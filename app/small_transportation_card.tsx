import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import EastIcon from '@mui/icons-material/East';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import SubwayIcon from '@mui/icons-material/Subway';
import CircleIcon from '@mui/icons-material/Circle';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import 'moment/locale/de';
import { purple, blue, green, red, orange, grey } from '@mui/material/colors';
import Skeleton from '@mui/material/Skeleton';
import cuid from 'cuid';

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
    directionFlag: string;
    maxEntries?: number;
    loading?: boolean;
}
export function DepartureTable({departures, directionFlag, maxEntries=4, loading=false}: DepatureTableProps) {

    const [localDepartures, setLocalDepartures] = useState([] as Departure[]);

    useEffect(() => {
        let tmpDepartures: Departure[] = [];

        if(loading == true) {
            tmpDepartures = Array(maxEntries).fill(null);
        } else {
            tmpDepartures = departures
                                .filter((row: Departure) => row.direction_flag == directionFlag)
                                .slice(0, maxEntries);

            tmpDepartures.sort((a, b) => {
                const timeA = moment(a.time).unix();
                const timeB = moment(b.time).unix();

                if (timeA < timeB) return -1;
                if (timeA > timeB) return 1;
                return 0;
            });
        }

        setLocalDepartures(tmpDepartures);
    });
    
    return (<TableContainer>
        <Table aria-label="simple table">
            <TableBody>
            {localDepartures.map((row: Departure|null) => {
                return (<DepartureRow departure={row} />);
            })}
            </TableBody>
        </Table>
    </TableContainer>);
}

interface DepartureRowProps {
    departure: Departure|null;
}

export function DepartureRow({departure}: DepartureRowProps) {
    const [uniqueKey, setUniqueKey] = useState("");

    useEffect(() => {
        if(departure == null) {
            setUniqueKey(cuid());
        } else {
            setUniqueKey(departure.id);
        }
    });

    if(departure == null) {
        return (<TableRow
                key={uniqueKey}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell style={{width: '50px', padding: '2px'}}>
                </TableCell>
                <TableCell style={{width: '60px', padding: '2px'}}>
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: "40px" }} />
                </TableCell>
                <TableCell style={{width: '220px', padding: '2px'}}>
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: "140px" }} />
                </TableCell>                        
                <TableCell style={{width: '160px'}}>
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: "100px" }} />
                </TableCell>
                <TableCell style={{padding: '2px', width: '170px'}}>
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: "100px" }} />
                </TableCell>
                <TableCell style={{padding: '2px'}}>
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: "100px" }} /></TableCell>
                </TableRow>)
    }

    let remainingTime = moment(departure.time*1000).fromNowOrNow()
    let departureTime = moment(departure.time*1000).format('HH:mm'); 
    
    let departureInfo = <span>{departureTime}</span>;
    if(departure.expired_time) {
        let expiredTime = moment(departure.expired_time*1000).format('HH:mm'); 
        departureInfo = <span>{departureTime} <del style={{ color: grey[600] }}>{expiredTime}</del></span>
    }

    let notes = <span></span>;
    
    if(departure.occupancy === "rather_empty") {
        notes = <span><CircleIcon sx={{ position: "relative", top: 3, fontSize: 24 }} style={{ color: green[500]}}/> eher leer</span>
    } else if(departure.occupancy === "rather_full") {
        notes = <span><CircleIcon sx={{ position: "relative", top: 3, fontSize: 24 }} style={{ color: orange[500]}}/> eher voll</span>
    }
    
    if(departure.cancelled && departure.cancelled == true) {
        notes = <span><CircleIcon sx={{ position: "relative", top: 3, fontSize: 24 }} style={{ color: red[500]}}/> Fällt aus</span>
    }

    return (<TableRow
        key={uniqueKey}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
        <TableCell style={{width: '50px', padding: '2px'}}>
            {departure.product.type == "Bus" && <DirectionsBusIcon style={{ color: purple[500]}}/>}
            {departure.product.type == "U-Bahn" && <SubwayIcon style={{ color: blue[500] }}/>}
        </TableCell>
        <TableCell style={{width: '60px', padding: '2px'}}>
            <b>{departure.product.line}</b>
        </TableCell>
        <TableCell style={{width: '220px', padding: '2px'}}>
            {departure.direction}
        </TableCell>                        
        <TableCell style={{width: '160px'}}>{remainingTime}</TableCell>
        <TableCell style={{padding: '2px', width: '170px'}}>{departureInfo}</TableCell>
        <TableCell style={{padding: '2px'}}>{notes}</TableCell>
        </TableRow>);
}

export default function TransportationCard() {
    const [departures, setDepartures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/departures')
            .then((response) => response.json())
            .then((json) => {
                setDepartures(json);
                setLoading(false);
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
                        <DepartureTable departures={departures} directionFlag='1' loading={loading} />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography gutterBottom variant="h5" component="div">
                            <EastIcon sx={{ position: "relative", top: 5 }} /> Heddernheim
                        </Typography>
                        <DepartureTable departures={departures} directionFlag='2' loading={loading} />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}