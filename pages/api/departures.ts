import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  message: string
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  //res.status(200).json(data.Departure);
  fetch('https://www.rmv.de/hapi/departureBoard?accessId='+encodeURIComponent(process.env.RMV_API_TOKEN as string)+'&id='+encodeURIComponent(process.env.RMV_STOP_ID as string)+'&format=json')
            .then((response) => response.json())
            .then((json) => {
              res.status(200).json(json.Departure)
            }).catch((error) => {
                res.status(500).json(error)
            })
}