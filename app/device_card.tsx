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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDisplay } from '@fortawesome/free-solid-svg-icons'
//import { faDisplay } from '@fortawesome/free-regular-svg-icons'
import { faWindows, faApple, faLinux } from '@fortawesome/free-brands-svg-icons'

interface Product {
    "line": string;
    "type": string;
}

export default function DeviceCard() {
    const [departures, setDepartures] = useState([]);
    const [loading, setLoading] = useState(true);

    /*useEffect(() => {
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
    }, []);*/

    return (
        <Card>
            <CardContent>
                <Grid container spacing={8}>
                    <Grid item xs={6}>
                        <Typography variant="h4">Machine</Typography>
                        <p>
                            Id: <code>33700bf8-2bd8-4c38-95ac-b941ac34e86e</code><br />
                            Uptime: 3304.906
                        </p>
                        <Typography variant="h4">OS</Typography>
                        <p><FontAwesomeIcon icon={faWindows} /> Windows 10 Home</p>
                        <small>
                            Platform: win32<br />
                            Release: 10.0.19045
                        </small>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h4">Network</Typography>
                        <p>
                            Name: VirtualBox Host-Only Network<br />
                            IP: <code>192.168.56.1</code>
                        </p>
                        <p>
                            Name: WLAN<br />
                            IP: <code>192.168.178.84</code>
                        </p>
                        <p>
                            Name: Loopback Pseudo-Interface 1<br />
                            IP: <code>127.0.0.1</code>
                        </p>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}