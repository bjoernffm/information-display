import type { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment';
 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const response = await fetch('https://api.brightsky.dev/weather?date='+moment().format('YYYY-MM-DD')+'&lat='+encodeURIComponent(process.env.WEATHER_LAT as string)+'&lon='+encodeURIComponent(process.env.WEATHER_LON as string));
    const json = await response.json();
    return res.status(200).json(json.weather);
}