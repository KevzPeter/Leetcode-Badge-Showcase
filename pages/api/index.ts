// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const graphqlRequest = require("graphql-request");

type Data = {
  status : string,
  body : string | Object
}

export default function handler(req: NextApiRequest,res: NextApiResponse<Data>):Promise<any> {
  try{
    const username:string = <string>(req.query.username);
    if (!username || <string>username.trim() === '') {
        res.status(400).send({ 
            status : 'error',
            body: 'Please provide a valid username as part of the query' 
        });
    }
    else{
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
          return graphqlRequest.request("https://leetcode.com/graphql/", gqlQuery, variables)
              .then((data:any) => {
                  res.status(200).send({
                    status : 'success',
                    body : data
                  });
              })
              .catch((err:any) => {
                  console.error(err.message)
                  res.status(500).send({ 
                    status : 'error',
                    body: 'That user does not exist 🔍' 
                  });
              });
        }
    }
    catch (err:any) {
        console.error(err.message);
        res.status(500).send({ 
            status : 'error',
            body: 'You broke me 😔' 
        });
    }
}
