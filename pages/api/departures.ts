import type { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment';

enum NoteKeys {
    occup_jny_max_12 = "text.occup.jny.max.12",
    occup_jny_max_11 = "text.occup.jny.max.11",
    occup_jny_loc_12 = "text.occup.loc.max.12",
    occup_jny_loc_11= "text.occup.loc.max.11",
    journey_cancelled = "text.realtime.journey.cancelled",
    stop_cancelled = "text.realtime.stop.cancelled",
    additional_service = "text.realtime.journey.additional.service"
}

interface Product {
    "line": string;
    "type": string;
}

interface Departure {
    id: string;
    product: Product;
    time: number;
    expired_time: number|null;
    reachable: boolean;
    cancelled: boolean;
    direction: string;
    direction_flag: string;
    occupancy: string|null;
}
 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Departure[]>
) {
    const response = await fetch('https://www.rmv.de/hapi/departureBoard?accessId='+encodeURIComponent(process.env.RMV_API_TOKEN as string)+'&id='+encodeURIComponent(process.env.RMV_STOP_ID as string)+'&format=json');
    const json = await response.json();
    const departures: [] = json.Departure;

    const result = departures.map((departure: any) => {
        let time = moment((departure.date as string)+" "+(departure.time as string)).unix();
        let expired_time = null;

        if(departure.rtDate && departure.rtTime && departure.rtTime !== departure.time) {
            time = moment((departure.rtDate as string)+" "+(departure.rtTime as string)).unix();
            expired_time = moment((departure.date as string)+" "+(departure.time as string)).unix();
        }

        let direction = departure.direction.replace(/Frankfurt \(Main\)/g, "");
        direction = direction.replace(/Bad Homburg v.d.H.-/g, "");
        direction = direction.replace(/Oberursel \(Taunus\)-/g, "");
        direction = direction.replace(/\(U\)/g, "");   
        direction = direction.trim();

        const filteredOccup = departure.Notes.Note.filter((note: any) => note.key.startsWith('text.occup.jny.max'));
        let occupancy: string|null = null;

        
        if(filteredOccup.length > 0) {
            if(filteredOccup[0].key == NoteKeys.occup_jny_max_11) {
                occupancy = "rather_empty";
            } else if(filteredOccup[0].key == NoteKeys.occup_jny_max_12) {
                occupancy = "rather_full";
            }
        }

        return {
            id: departure.JourneyDetailRef.ref as string,
            product: {
                line: departure.ProductAtStop.name as string,
                type: departure.ProductAtStop.catOut as string,
            },
            time,
            expired_time,
            reachable: departure.reachable as boolean,
            cancelled: departure.cancelled as boolean,
            direction,
            direction_flag: departure.directionFlag as string,
            occupancy
        }
    })

    result.sort(function(a, b) {
        var keyA = a.time,
            keyB = b.time;
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    });

    return res.status(200).json(result)
}