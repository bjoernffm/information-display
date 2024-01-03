import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import SunCalc from 'suncalc';
import './weather_icons/css/weather-icons.min.css';
import moment from 'moment';
import 'moment/locale/de';
import { grey } from '@mui/material/colors';

//{"author": "Napoleon Hill", "cite": "Ideen sind der Anfang aller Vermögen.", "category": "Ideen"},

export default function CiteCard() {

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" component="div" style={{marginBottom: 25}}>
                    Zitat des Tages zum Thema <em>Lernen</em>
                </Typography>
                <div style={{borderLeft: "10px solid "+grey[800], paddingLeft: "30px", marginLeft: "30px"}}>
                    <Typography variant="h6" component="div">
                        Es ist schön, den Erfolg zu feiern, aber es ist wichtiger, die Lehren des Scheiterns zu beherzigen.
                    </Typography>
                    <Typography variant="h6" component="div" style={{ color: grey[600] }}>
                        &ndash; Bill Gates
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
}