import type { NextApiRequest, NextApiResponse } from 'next'
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  fetch('https://api.brightsky.dev/current_weather?lat='+encodeURIComponent(process.env.WEATHER_LAT as string)+'&lon='+encodeURIComponent(process.env.WEATHER_LON as string))
    .then((response) => response.json())
    .then((json) => {
        res.status(200).json(json.weather)
    })
}