import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EastIcon from '@mui/icons-material/East';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import SubwayIcon from '@mui/icons-material/Subway';
import TrainIcon from '@mui/icons-material/Train';
import TramIcon from '@mui/icons-material/Tram';
import CircleIcon from '@mui/icons-material/Circle';
import material from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import 'moment/locale/de';
import { purple, blue, green, red, orange, grey } from '@mui/material/colors';

interface Product {
    /*"icon": {
        "foregroundColor": {
            "r": 255,
            "g": 255,
            "b": 255,
            "hex": "#FFFFFF"
        },
        "backgroundColor": {
            "r": 0,
            "g": 101,
            "b": 174,
            "hex": "#0065AE"
        },
        "res": "prod_sub_t"
    },*/
    "name": string
    /*"internalName": "      U2",
    "displayNumber": "U2",
    "num": "3840",
    "line": "U2",
    "lineId": "de:rmv:00000896:",*/
    "catOut": string
    //"catIn": "BU5",
    /*"catCode": "4",
    "cls": "16",
    "catOutS": "BU5",
    "catOutL": "U-Bahn",
    "operatorCode": "VGF",
    "operator": "Stadtwerke Verkehrsgesellschaft Frankfurt",
    "admin": "TRAFBU",
    "matchId": "20185"*/
}

enum NoteKeys {
    occup_jny_max_12 = "text.occup.jny.max.12",
    occup_jny_max_11 = "text.occup.jny.max.11",
    occup_jny_loc_12 = "text.occup.loc.max.12",
    occup_jny_loc_11= "text.occup.loc.max.11",
    journey_cancelled = "text.realtime.journey.cancelled",
    stop_cancelled = "text.realtime.stop.cancelled",
    additional_service = "text.realtime.journey.additional.service"
}

interface Note {
    value?: string,
    key: string,
    type: string,
    routeIdxFrom?: 9,
    routeIdxTo?: 18,
    txtN?: "20185"
}

interface Departure {
    JourneyDetailRef: {
        ref: string
    },
    //"JourneyStatus": "P",
    ProductAtStop: Product,
    Product: Product[],
    
    Notes: {
        Note: Note[]
    },
    /*"Occupancy": [
        {
            "name": "SECOND",
            "raw": 12
        }
    ],*/
    name: string
    /*"type": "ST",
    "stop": "Frankfurt (Main) Fritz-Tarnow-Straße",
    "stopid": "A=1@O=Frankfurt (Main) Fritz-Tarnow-Straße@X=8668703@Y=50142917@U=80@L=3001303@",
    "stopExtId": "3001303",
    "lon": 8.668703,
    "lat": 50.142917,
    "prognosisType": "PROGNOSED",*/
    time: string
    date: string
    rtTime?: string
    rtDate?: string
    reachable: boolean
    cancelled?: boolean
    direction: string
    directionFlag: string
}

function processRelativeTime(number: number, withoutSuffix: boolean, key: string, isFuture: boolean) {
    var format = {
        m: ['1 Min.', '1 Min.'],
        h: ['eine Stunde', 'einer Stunde'],
        d: ['ein Tag', 'einem Tag'],
        dd: [number + ' Tage', number + ' Tagen'],
        w: ['eine Woche', 'einer Woche'],
        M: ['ein Monat', 'einem Monat'],
        MM: [number + ' Monate', number + ' Monaten'],
        y: ['ein Jahr', 'einem Jahr'],
        yy: [number + ' Jahre', number + ' Jahren'],
    };
    return withoutSuffix ? format[key][0] : format[key][1];
}

moment.updateLocale('de', {
    relativeTime: {
        future: 'in %s',
        past: 'vor %s',
        s: 'ein paar Sekunden',
        ss: '%d Sekunden',
        m: processRelativeTime,
        mm: '%d Min.',
        h: processRelativeTime,
        hh: '%d Stunden',
        d: processRelativeTime,
        dd: processRelativeTime,
        w: processRelativeTime,
        ww: '%d Wochen',
        M: processRelativeTime,
        MM: processRelativeTime,
        y: processRelativeTime,
        yy: processRelativeTime,
    },
});

moment.fn.fromNowOrNow = function (a) {
    if (Math.abs(moment().diff(this)) < 45000) { // 1000 milliseconds
        return 'jetzt';
    }
    return this.fromNow(a);
}

interface DepatureTableProps {
    departures: Departure[];
    directionFlag: string
}
export function DepatureTable(props: DepatureTableProps) {

    return (<TableContainer>
    <Table aria-label="simple table">
        <TableBody>
        {props.departures.filter((row: Departure) => row.directionFlag == props.directionFlag).slice(0,4).map((row: Departure) => {
            if(row.directionFlag != props.directionFlag) {
                return;
            }
            let remainingTime = moment(row.date+" "+row.time).fromNowOrNow()
            let departure = moment(row.date+" "+row.time).format('HH:mm');
            let correctedDeparture = departure;
            if(row.rtDate && row.rtTime) {
                correctedDeparture = moment(row.rtDate+" "+row.rtTime).format('HH:mm');
                remainingTime = moment(row.rtDate+" "+row.rtTime).fromNowOrNow();
            }

            row.direction = row.direction.replace(/Frankfurt \(Main\)/g, "");
            row.direction = row.direction.replace(/Bad Homburg v.d.H.-/g, "");
            row.direction = row.direction.replace(/Oberursel \(Taunus\)-/g, "");
            row.direction = row.direction.replace(/\(U\)/g, "");    
            
            let departureInfo = <span>{departure}</span>;
            if(departure != correctedDeparture) {
                departureInfo = <span>{correctedDeparture} <del style={{ color: grey[700] }}>{departure}</del></span>
            }

            let notes = <span></span>;
            let filteredOccup = row.Notes.Note.filter((note) => note.key.startsWith('text.occup.jny.max'));

            if(filteredOccup[0].key == NoteKeys.occup_jny_max_11) {
                notes = <span><CircleIcon sx={{ position: "relative", top: 3, fontSize: 24 }} style={{ color: green[500]}}/> eher leer</span>
            } else if(filteredOccup[0].key == NoteKeys.occup_jny_max_12) {
                notes = <span><CircleIcon sx={{ position: "relative", top: 3, fontSize: 24 }} style={{ color: orange[500]}}/> eher voll</span>
            }
            
            if(row.cancelled && row.cancelled == true) {
                notes = <span><CircleIcon sx={{ position: "relative", top: 3, fontSize: 24 }} style={{ color: red[500]}}/> Fällt aus</span>
            }

            return (<TableRow
                key={row.JourneyDetailRef.ref}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell style={{width: '50px', padding: '2px'}}>
                    {row.ProductAtStop.catOut == "Bus" && <DirectionsBusIcon style={{ color: purple[500]}}/>}
                    {row.ProductAtStop.catOut == "U-Bahn" && <SubwayIcon style={{ color: blue[500] }}/>}
                </TableCell>
                <TableCell style={{width: '60px', padding: '2px'}}>
                    <b>{row.ProductAtStop.name}</b>
                </TableCell>
                <TableCell style={{width: '220px', padding: '2px'}}>
                    {row.direction}
                </TableCell>                        
                <TableCell style={{width: '160px'}}>{remainingTime}</TableCell>
                <TableCell style={{padding: '2px', width: '170px'}}>{departureInfo}</TableCell>
                <TableCell style={{padding: '2px'}}>{notes}</TableCell>
                </TableRow>);
            })}
        </TableBody>
    </Table>
    </TableContainer>);
}

export default function SmallTransportationCard() {
    const [departures, setDepartures] = useState([]);

    useEffect(() => {
        fetch('/api/departures')
            .then((response) => response.json())
            .then((json) => {
                setDepartures(json);
            })

        const interval = setInterval(() => {
            fetch('/api/departures')
                .then((response) => response.json())
                .then((json) => {
                    setDepartures(json);
                })
        }, 60*1000);

        return () => clearInterval(interval);        
    }, []);
  return (
    <Card>
        <CardContent>          
        <Grid container spacing={8}>
        <Grid item xs={6}>
        <Typography gutterBottom variant="h5" component="div">
        <EastIcon sx={{ position: "relative", top: 5 }} /> Innenstadt
          </Typography>
            <DepatureTable departures={departures} directionFlag='1' />
        </Grid>
                <Grid item xs={6}>
            
        <Typography gutterBottom variant="h5" component="div">
        <EastIcon sx={{ position: "relative", top: 5 }} /> Heddernheim
          </Typography>
                <DepatureTable departures={departures} directionFlag='2' />
                </Grid>
                </Grid>
        </CardContent>
    </Card>
  );
}