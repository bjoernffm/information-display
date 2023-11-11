import type { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment';
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  fetch('https://api.brightsky.dev/weather?date='+moment().format('YYYY-MM-DD')+'&lat='+encodeURIComponent(process.env.WEATHER_LAT as string)+'&lon='+encodeURIComponent(process.env.WEATHER_LON as string))
    .then((response) => response.json())
    .then((json) => {
        res.status(200).json(json.weather)
    })
}