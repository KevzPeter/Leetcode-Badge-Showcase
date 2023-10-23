import type { NextApiRequest, NextApiResponse } from 'next'
import { gql, request } from "graphql-request";
import { groupBy } from 'lodash';
import { generateSvg } from '../../utils/generateSVG';
import BadgeIconImg from "../../public/Badge-icon.png";
import axios from 'axios';
import { BASEURL, LEETCODE_BASEURL, THEME_NAMES, FILTERS } from "../../utils/config";
import { Data, Params, GraphQLResponse } from '../../utils/models';
import path from 'path';
import { readFileSync, writeFile } from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | string>): Promise<any> {
    try {
        let { username, theme, filter, json }: Params = <any>req.query;
        //username query validation
        if (!username || username.trim() === '') {
            res.status(400).send({
                status: 'error',
                body: 'Missing username parameter in query'
            });
        }
        //filter query validation
        if (filter?.length > 0) {
            filter = filter.trim().toLowerCase();
            if (!Object.keys(FILTERS).includes(filter)) {
                res.status(400).send({
                    status: 'error',
                    body: 'Invalid filter parameter 😕, use filter={comp|daily|study}'
                });
            }
            else filter = FILTERS[`${filter}`];
        }
        //theme query validation
        if (!theme || theme.length === 0) {
            theme = 'light';
        }
        else theme = theme.trim().toLowerCase();
        if (!THEME_NAMES.includes(theme)) {
            theme = 'light';
        }
        //GraphQL query to fetch badges from Leetcode's API endpoint
        const gqlQuery = gql`
        query userBadges($username: String!) 
        {  matchedUser(username: $username) 
            {    badges 
                {      id      name      shortName      displayName      icon      hoverText      medal 
                    {        slug        config 
                        {          iconGif          iconGifBackground        
                        }      
                    }      creationDate      category    
                }    upcomingBadges 
                {      name      icon      progress
                }
            }
        }`;
        const variables = { username };
        let response: GraphQLResponse = await request(`${LEETCODE_BASEURL}/graphql/`, gqlQuery, variables);
        if (response.matchedUser.badges.length === 0) {
            res.status(200).send({ status: "success", body: "The user has unlocked 0 badges" });
            return;
        }

        /**
         * "public/files/base64.txt" is a file containing a stringified JSON object of 
         *  all Leetcode badge icons in its base64 format
         * 
         *  It acts as a cache, helping to significantly reduce API latency issues.
         */

        const base64File = path.join(process.cwd(), 'public', 'cache', 'base64.txt');
        const base64JSONString = readFileSync(base64File, 'utf-8');
        let cache = JSON.parse(base64JSONString);

        /**
         * Converting badge icon asset fetched from source url to base64 string
         * This conversion makes several API calls depending on the number of unlocked badges
         * If the icon already exists in cache, no API call is made
         */
        for (let badge of response.matchedUser.badges) {
            //Some badges have relative icon asset source url
            if (badge.icon.startsWith("/static/")) {
                badge.icon = LEETCODE_BASEURL + badge.icon;
            }
            if (cache[badge.icon]) {
                badge.icon = cache[badge.icon]
            }
            else {
                try {
                    let converterResponse = await convertToBase64(cache, badge.icon);
                    cache = converterResponse.cache;
                    badge.icon = converterResponse.base64String;
                }
                catch {
                    // fallback to default icon
                    badge.icon = BadgeIconImg;
                }
            }

        }
        // Converting Leetcode logo to inline base64 to prevent Github CSP violation.
        let imgSource = '';
        const imgURL = `${BASEURL}/leetcode-logo.png`;
        if (cache.imgURL) {
            imgSource = cache.imgURL
        }
        else {
            let converterResponse = await convertToBase64(cache, imgURL)
            cache = converterResponse.cache;
            imgSource = converterResponse.base64String;
        }
        writeFile(base64File, JSON.stringify(cache), (err) => {
            if (err) {
                console.error(err.message);
                throw new Error("Failed to write file");
            }
        });
        //Converting response data to required format
        response = groupBy(response.matchedUser.badges, "category");
        let responseData = []
        for (const [category, badges] of Object.entries(response)) {
            if (filter && category !== filter) continue;
            responseData.push({ categoryName: category, badges });
        }
        //If given filter has no badges
        if (responseData?.length === 0) {
            res.status(400).send({ status: 'error', body: "No badges found with given filter or some other error occured 😕" });
        }
        else if (json?.toLowerCase() === 'true') {
            res.status(200).send({ status: "success", body: responseData });
        }
        else {
            res.setHeader('Cache-Control', 'max-age=604800, stale-while-revalidate=86400');
            res.setHeader('Content-Type', 'image/svg+xml');
            res.statusCode = 200;
            res.send(generateSvg(responseData, username, imgSource, theme));
        }
    }
    catch (err: any) {
        console.error(err.message);
        res.status(500).send({
            status: 'error',
            body: 'The user does not exist 🔍 or some other error occured 😔'
        });
    }
}

const convertToBase64 = async (cache: any, imgURL: string) => {
    const { data } = await axios.get<string>(imgURL, {
        responseType: 'arraybuffer',
    });
    const base64 = Buffer.from(data, 'binary').toString('base64');
    const base64String = `data:image/png;base64,${base64}`;
    cache[imgURL] = base64String;
    return { cache, base64String };
}