import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import SunCalc from 'suncalc';
import './weather_icons/css/weather-icons.min.css';
import moment from 'moment';
import 'moment/locale/de';
import { grey } from '@mui/material/colors';

export default function TimeCard() {
  moment.locale("de");

  const [momentInstance, setMomentInstance] = useState(moment());
  const [seperatorStyle, setSeperatorStyle] = useState({});
  const [sunlightInfo, setSunlightInfo] = useState(<span></span>);

  function loadData() {
    const times = SunCalc.getTimes((new Date()), 50.142917, 8.668703);

    if((new Date()) < times.sunrise || (new Date()) > times.dusk) {
      setSunlightInfo(<span><i className="wi wi-sunrise"></i> {moment(times.dawn).format('HH:mm')} &ndash; {moment(times.sunrise).format('HH:mm')}</span>);
    } else {
      setSunlightInfo(<span><i className="wi wi-sunset"></i> {moment(times.sunset).format('HH:mm')} &ndash; {moment(times.dusk).format('HH:mm')}</span>);
    }

    setMomentInstance(moment());
      if(parseInt(moment().format('s')) % 2 == 0) {
        setSeperatorStyle({'visibility': 'hidden'});
      } else {
        setSeperatorStyle({});
      }
  }

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 500);

    return () => clearInterval(interval);
}, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" align="center" component="div" style={{ color: grey[700] }}>
          {momentInstance.format('dddd')}, der {momentInstance.format('D. MMMM')}
        </Typography>
        <Typography variant="h1" align="center" component="div">
          {momentInstance.format('HH')}<span style={seperatorStyle}>:</span>{momentInstance.format('mm')}
        </Typography>
        <Typography variant="h5" align="center" component="div" style={{ color: grey[700] }}>
          {sunlightInfo}
        </Typography>
      </CardContent>
    </Card>
  );
}