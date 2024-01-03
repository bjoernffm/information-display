import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import 'moment/locale/de';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { faWindows, faApple, faLinux } from '@fortawesome/free-brands-svg-icons'

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

const defaultData: ApiResponse = {
    id: "",
    addresses: [],
    uptime: 0,
    os: {
        type: "",
        platform: "",
        version: "",
        release: ""
    }
}

interface OsIconProps {
    os: string
}

export function OsIcon({os}: OsIconProps) {
    if(os === "Windows_NT") {
        return <FontAwesomeIcon icon={faWindows} />;
    } else if(os === "Darwin") {
        return <FontAwesomeIcon icon={faApple} />;
    } else if(os === "Linux") {
        return <FontAwesomeIcon icon={faLinux} />;
    } else {
        return <FontAwesomeIcon icon={faQuestion} />;
    }
}

export default function DeviceCard() {
    const [data, setData] = useState(defaultData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/device')
            .then((response) => response.json())
            .then((json: ApiResponse) => {
                setData(json);
                setLoading(false);
            })

        const interval = setInterval(() => {
            fetch('/api/device')
                .then((response) => response.json())
                .then((json: ApiResponse) => {
                    setData(json);
                })
        }, 30*1000);

        return () => clearInterval(interval);        
    }, []);

    return (
        <Card>
            <CardContent>
                <Grid container spacing={8}>
                    <Grid item xs={6}>
                        <Typography variant="h4">Machine</Typography>
                        <p>
                            Id: <code>{data.id}</code><br />
                            Uptime: {moment(moment().unix()*1000-data.uptime*1000).fromNow()}
                        </p>
                        <Typography variant="h4">OS</Typography>
                        <p><OsIcon os={data.os.type} /> {data.os.version}</p>
                        <small>
                            Platform: {data.os.platform}<br />
                            Release: {data.os.release}
                        </small>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h4">Network</Typography>
                        {data.addresses.map(address => (
                            <p key={address.ip}>
                                Name: {address.name}<br />
                                IP: <code>{address.ip}</code>
                            </p>
                        ))}
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}