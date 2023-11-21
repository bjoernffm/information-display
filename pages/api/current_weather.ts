import type { NextApiRequest, NextApiResponse } from 'next'
 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const response = await fetch('https://api.brightsky.dev/current_weather?lat='+encodeURIComponent(process.env.WEATHER_LAT as string)+'&lon='+encodeURIComponent(process.env.WEATHER_LON as string)+'&max_dist=80000');
    const json = await response.json();
    return res.status(200).json(json.weather);
}