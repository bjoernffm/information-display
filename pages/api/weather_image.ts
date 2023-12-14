import type { NextApiRequest, NextApiResponse } from 'next'
 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    var headers = new Headers({
        'Authorization': `Basic ${btoa('fraverlf:pc330710')}`
    });
    const response = await fetch('https://www.flugwetter.de/fw/scripts/getchart.php?src=nb_icoeu_meg_10637_lv_999999_p_000_0000.png', {headers});
    const data = await response.text()
    console.log(data);
    //return response;
    //const json = await response.json();
    //return res.status(200).json(json.alerts)

    return res.setHeader("content-type", "image/png").status(200).send(data);
}