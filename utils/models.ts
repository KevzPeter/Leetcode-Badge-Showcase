export type Data = {
    status: string,
    body: string | Object
}
export interface Params {
    username: string,
    filter: string,
    json: string,
    theme: string
    border: string
}
export interface Badge {
    id: string,
    name: string,
    shortname: string,
    displayName: string,
    icon: string | any,
    hoverText: string,
    medal: {
        slug: string,
        config: {
            iconGif: string,
            iconGifBackground: string
        }
    },
    creationDate: string,
    category: string
}
export interface GraphQLResponse {
    matchedUser: {
        badges: Array<Badge>,
        upcomingBadges: [{ name: string, icon: string, progress: number }]
    }
}
