import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
    message: string
}
 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const response = await fetch('https://www.rmv.de/hapi/departureBoard?accessId='+encodeURIComponent(process.env.RMV_API_TOKEN as string)+'&id='+encodeURIComponent(process.env.RMV_STOP_ID as string)+'&format=json');
    const json = await response.json();
    return res.status(200).json(json.Departure)
}