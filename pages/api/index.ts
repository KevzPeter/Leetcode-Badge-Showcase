import type { NextApiRequest, NextApiResponse } from 'next'
import { gql, request } from "graphql-request";
import { groupBy } from 'lodash';
import { generateSvg } from '../../utils/generateSVG';
import BadgeIconImg from "../../public/Badge-icon.png";
import axios from 'axios';
import { BASEURL, LEETCODE_BASEURL, THEME_NAMES, FILTERS } from "../../utils/config";
import { Data, Params, GraphQLResponse } from '../../utils/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | string>): Promise<any> {
    try {
        let { username, theme, filter, json }: Params = <any>req.query;
        //username query validation
        if (!username || <string>username.trim() === '') {
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
        let data: GraphQLResponse = await request(`${LEETCODE_BASEURL}/graphql/`, gqlQuery, variables);
        if (data.matchedUser.badges.length === 0) {
            res.status(200).send({ status: "success", body: "The user has unlocked 0 badges" });
            return;
        }
        for (let badge of data.matchedUser.badges) {
            //Some badges have relative icon asset source url
            if (badge.icon.startsWith("/static/")) {
                badge.icon = LEETCODE_BASEURL + badge.icon;
            }
            //Converting icon asset fetched from source url to base64 string through proxy API
            try {
                const { data } = await axios.get(`${BASEURL}/api/proxy`, {
                    params: {
                        img: badge.icon,
                    },
                });
                badge.icon = data;
            } catch {
                badge.icon = BadgeIconImg;
            }
        }
        // Converting Leetcode logo to inline base64 to prevent Github CSP violation.
        const imgURL = `${BASEURL}/leetcode-logo.png`;
        const response = await axios.get(`${BASEURL}/api/proxy`, { params: { img: imgURL } });
        const imgSource = response.data;
        //Converting response data to required format
        data = groupBy(data.matchedUser.badges, "category");
        let responseData = []
        for (const [category, badges] of Object.entries(data)) {
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
            res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
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
