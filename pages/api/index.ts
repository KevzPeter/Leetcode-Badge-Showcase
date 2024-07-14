import type { NextApiRequest, NextApiResponse } from 'next'
import { gql, request } from "graphql-request";
import { groupBy } from 'lodash';
import { generateSvg } from '../../utils/generateSVG';
import BadgeIconImg from "../../public/Badge-icon.png";
import axios from 'axios';
import { BASEURL, LEETCODE_BASEURL, THEME_NAMES, FILTERS, BORDER } from "../../utils/config";
import { Data, Params, GraphQLResponse } from '../../utils/models';
import path from 'path';
import { readFileSync, writeFile } from 'fs';
import sharp from 'sharp';
import { validationSchema } from '../../utils/validation.schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | string>): Promise<any> {
    try {
        console.log(`Incoming Request: ${JSON.stringify(req.query)}`);
        const { error, value } = validationSchema.validate(req.query);
        if (error) {
            return res.status(400).json({
                status: 'error',
                body: error.details.map(detail => detail.message)
            })
        }
        console.log(value);
        let { username, theme, filter, border, json, animated }: Params = value;
        if (filter) filter = FILTERS[`${filter}`];

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
            return res.status(200).json({ status: "success", body: "The user has unlocked 0 badges" });
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
                    badge.icon = await convertToBase64(cache, badge.icon);
                }
                catch (err) {
                    // fallback to default icon
                    badge.icon = BadgeIconImg;
                }
            }
            // convert GIF if available
            if (animated === 'true' && badge.medal?.config?.iconGif?.endsWith('.gif')) {
                if (badge.medal.config.iconGif.startsWith("/static/")) {
                    badge.medal.config.iconGif = LEETCODE_BASEURL + badge.medal.config.iconGif;
                }
                if (cache[badge.medal.config.iconGif]) {
                    badge.medal.config.iconGif = cache[badge.medal.config.iconGif]
                }
                else {
                    try {
                        badge.medal.config.iconGif = await convertGifToBase64(cache, badge.medal.config.iconGif);
                    }
                    catch (err) {
                        // fallback to default icon
                        badge.medal.config.iconGif = badge.icon;
                    }
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
            imgSource = await convertToBase64(cache, imgURL);
        }
        /**
         * Writing files does not work in Vercel deployments 🥲
         * Uncomment the following if you have your own Next server setup
         */
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
            return res.status(400).json({ status: 'error', body: "No badges found with given filter or some other error occurred 😕" });
        }
        else if (json?.toLowerCase() === 'true') {
            return res.status(200).json({ status: "success", body: responseData });
        }
        else {
            res.setHeader('Cache-Control', 'max-age=604800, stale-while-revalidate=86400');
            res.setHeader('Content-Type', 'image/svg+xml');
            res.statusCode = 200;
            res.send(generateSvg(responseData, username, imgSource, theme, border, animated));
        }
    }
    catch (err: any) {
        console.error(err.message);
        return res.status(500).json({
            status: 'error',
            body: 'The user does not exist 🔍 or some other error occurred 😔'
        });
    }
}

const convertToBase64 = async (cache: any, imgURL: string) => {
    const { data } = await axios.get<string>(imgURL, {
        responseType: 'arraybuffer',
    });
    const webpBuffer = await sharp(data).webp().toBuffer();
    let base64String = webpBuffer.toString('base64');
    base64String = `data:image/webp;base64,${base64String}`;
    cache[imgURL] = base64String;
    return base64String;
}

const convertGifToBase64 = async (cache: any, imgURL: string) => {
    const { data } = await axios.get<Buffer>(imgURL, {
        responseType: 'arraybuffer',
    });
    const resizedGifBuffer = await sharp(data, { animated: true }).resize({ width: 48, height: 48 }).gif().toBuffer();
    let base64String = resizedGifBuffer.toString('base64');
    base64String = `data:image/gif;base64,${base64String}`;
    cache[imgURL] = base64String;
    return base64String;
}