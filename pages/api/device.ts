import type { NextApiRequest, NextApiResponse } from 'next'
import * as os from "os";
import { machineIdSync } from 'node-machine-id';

interface NetworkAddress {
    name: string
    ip: string
}

interface ApiResponse {
    id: string,
    addresses: NetworkAddress[],
    uptime: number,
    os: {
        type: string,
        platform: string,
        version: string,
        release: string
    }
}
 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    let dict = os.networkInterfaces();
    let keys = Object.keys(dict);
    let values = Object.values(dict);
    let filteredValues = values.map(addresses => {
        if (addresses === undefined) {
            return "";
        }
        return addresses.filter(address => address.family === "IPv4").map(address => address.address)[0];
    })

    let addresses = [];
    for(let i = 0; i < keys.length; i++) {
        addresses.push({
            name: keys[i],
            ip: filteredValues[i],
        })
    }

    const result = {
        id: machineIdSync(true),
        addresses: addresses,
        uptime: os.uptime(),
        os: {
            type: os.type(),
            platform: os.platform(),
            version: os.version(),
            release: os.release()
        }
    }

    return res.status(200).json(result)
}