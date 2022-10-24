// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const graphqlRequest = require("graphql-request");
const _ = require('lodash');
import { generateSvg } from '../../utils/generateSVG';
import BadgeIconImg from "../../public/Badge-icon.png";
const axios = require('axios');

type Data = {
    status: string,
    body: string | Object
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>): Promise<any> {
    try {
        const username: string = <string>(req.query.username);
        const jsonFlag: string = <string>(req.query.json);

        if (!username || <string>username.trim() === '') {
            res.status(400).send({
                status: 'error',
                body: 'Missing username parameter in query'
            });
        }
        else {
            const gqlQuery = graphqlRequest.gql`
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
            let data = await graphqlRequest.request("https://leetcode.com/graphql/", gqlQuery, variables);
            if (data.matchedUser.badges.length === 0) {
                res.status(200).send({ status: "success", body: "The user has unlocked 0 badges" });
                return;
            }
            for (let badge of data.matchedUser.badges) {
                if (badge.icon.startsWith("/static/")) {
                    badge.icon = "https://leetcode.com" + badge.icon;
                }
                try {
                    const { data } = await axios.get(`https://leetcode-badge-showcase.vercel.app/api/proxy`, {
                        params: {
                            img: badge.icon,
                        },
                    });
                    badge.icon = data;
                } catch {
                    badge.icon = BadgeIconImg;
                }
            }
            data = _.groupBy(data.matchedUser.badges, "category");
            let arr = []
            for (const [category, badges] of Object.entries(data)) {
                arr.push({ categoryName: category, badges });
            }
            if (jsonFlag?.toLowerCase() === 'true') {
                res.status(200).send({ status: "success", body: arr });
            }
            else {
                res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
                res.setHeader('Content-Type', 'image/svg+xml');
                res.statusCode = 200;
                res.send(generateSvg(arr));
            }
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
