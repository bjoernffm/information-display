import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import './weather_icons/css/weather-icons.min.css';
import './weather_icons/css/weather-icons-wind.min.css';
import Grid from '@mui/material/Grid';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, BarOptions, AnimationOptions, BarControllerChartOptions, ScaleChartOptions } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement);
import moment from 'moment';
import 'moment/locale/de';
import React, { useState, useEffect } from 'react';
import {Speed} from '@mui/icons-material';
import {AlertColor} from '@mui/material/Alert';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { blueGrey, blue, green, red, orange, grey } from '@mui/material/colors';

ChartJS.defaults.font.size = 24;

/* <Stack sx={{ width: '100%', "marginTop": '14px' }} spacing={2}>
              {weatherAlerts.map((alert: WeatherAlert) => {
                let severitySetting: AlertColor = "info";
                if(alert.severity == "severe" || alert.severity == "extreme") {
                  let severitySetting = "error";
                } else if(alert.severity == "moderate") {
                  let severitySetting = "warning";
                }
                
                return <Alert severity={severitySetting} key={alert.alert_id}>
                  {alert.headline_de}
                </Alert>
              })}
            </Stack>*/

interface HourlyDataRow {
    timestamp: string,
    temperature: number,
    /*"source_id": 6134,
    "precipitation": 0,
    "pressure_msl": 1013.3,
    "sunshine": 34,
    "wind_direction": 280,
    "wind_speed": 33.8,
    "cloud_cover": 63,
    "dew_point": 9.8,
    "relative_humidity": 60,
    "visibility": 50800,
    "wind_gust_direction": null,
    "wind_gust_speed": 47.2,
    "condition": "dry",
    "precipitation_probability": null,
    "precipitation_probability_6h": null,
    "solar": 0.563,
    "icon": "partly-cloudy-day"*/
}

interface CurrentWeatherData {
  cloud_cover: number,
  condition: string
  /*dew_point": 10.14,
  solar_10": 0.081,
  solar_30": 0.207,
  solar_60": 0.48,
  precipitation_10": 0,
  precipitation_30": 0,
  precipitation_60": 0,*/
  pressure_msl: number
  /*relative_humidity": 62,
  visibility": 43128,*/
  wind_direction_10: number
  wind_direction_30: number
  wind_direction_60: number
  wind_speed_10: number
  wind_speed_30: number
  wind_speed_60: number
  /*wind_gust_direction_10": 270,
  wind_gust_direction_30": 270,
  wind_gust_direction_60": 270,
  wind_gust_speed_10": 37.8,*/
  wind_gust_speed_30: number
  /*wind_gust_speed_60": 54.4,
  sunshine_30": 2,
  sunshine_60": 22,*/
  temperature: number
  //fallback_source_ids": {},
  icon: string
}

const defaultCurrentWeatherData: CurrentWeatherData = {
    "cloud_cover": 100,
    "condition": "dry",
    "pressure_msl": 1013.6,
    "wind_direction_10": 280,
    "wind_direction_30": 287,
    "wind_direction_60": 285,
    "wind_speed_10": 27.4,
    "wind_speed_30": 26.6,
    "wind_speed_60": 29.2,
    "wind_gust_speed_30": 37.8,
    "temperature": 17.6,
    "icon": "cloudy"
  }

  interface WeatherAlert     {
    alert_id: string,
    /*"id": 279977,
    "effective": "2023-08-06T17:58:00+00:00",
    "onset": "2023-08-07T08:00:00+00:00",
    "expires": "2023-08-07T19:00:00+00:00",
    "category": "met",
    "response_type": "prepare",
    "urgency": "immediate",*/
    severity: string,
    /*"certainty": "likely",
    "event_code": 51,
    "event_en": "wind gusts",
    "event_de": "WINDBÖEN",
    "headline_en": "Official WARNING of WIND GUSTS",*/
    headline_de: string
    /*"description_en": "There is a risk of wind gusts (level 1 of 4).\nMax. gusts: 50-60 km/h; Wind direction: west; Increased gusts: near showers and in exposed locations < 70 km/h",
    "description_de": "Es treten Windböen mit Geschwindigkeiten zwischen 50 km/h (14 m/s, 28 kn, Bft 7) und 60 km/h (17 m/s, 33 kn, Bft 7) aus westlicher Richtung auf. In Schauernähe sowie in exponierten Lagen muss mit Sturmböen bis 70 km/h (20 m/s, 38 kn, Bft 8) gerechnet werden.",
    "instruction_en": null,
    "instruction_de": null*/
  }

const data = {
  labels: [],
  datasets: [
    {
      label: 'Acquisitions by year',
      data: [],
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    }
  ]
};

const defaultOptions: ScaleChartOptions<"bar"> = {
  scales: {
    y: {
      ticks: {
        // Include a dollar sign in the ticks
        callback: function(value, index, ticks) {
            return value+'°';
        }
      },
      min: 10,
      max: 20
    }
  }
};

interface FormattedValueProps {
  value: number|null;
}
function FormattedValue(props: FormattedValueProps) {
  if (props.value) {
    return <span>{new Intl.NumberFormat("de-DE").format(Math.round(props.value))}</span>;
  }
  return <span>-</span>;
}

export default function SmallWeatherCard() {
  const [hourlyChartData, setHourlyChartData] = useState(data);
  const [currentWeather, setCurrentWeather] = useState(defaultCurrentWeatherData);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [dailyMin, setDailyMin] = useState(0);
  const [dailyMax, setDailyMax] = useState(0);
  const [options, setOptions] = useState(defaultOptions);

  function loadData() {
    fetch('/api/current_weather_timeline')
      .then((response) => response.json())
      .then((json) => {
        setHourlyChartData({
          labels: json.map((row: HourlyDataRow) => moment(row.timestamp).format('H')+"h"),
          datasets: [
            {
              label: 'Acquisitions by year',
              data: json.map((row: HourlyDataRow) => row.temperature),
              backgroundColor: json.map((row: HourlyDataRow) => {
                if(moment(row.timestamp).format('H') == moment().format('H')) {
                  return blueGrey[500];
                }
                return blueGrey[900];
              }),
            }
          ]
        })
      })
  fetch('/api/current_weather')
      .then((response) => response.json())
      .then((json) => {
        setCurrentWeather(json);
      })
  fetch('/api/weather_alerts')
      .then((response) => response.json())
      .then((json) => {
        setWeatherAlerts(json);
      })
  }

useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 15*60*1000);

    return () => clearInterval(interval);
}, []);

useEffect(() => {
  let minTemp = Number.MAX_VALUE;
  let maxTemp = Number.MIN_VALUE;

  hourlyChartData.datasets[0].data.map((temperature: number) => {
    if (temperature < minTemp) {
      minTemp = temperature;
    }
    if (temperature > maxTemp) {
      maxTemp = temperature;
    }
  })
  setDailyMin(minTemp);
  setDailyMax(maxTemp);
  setOptions({
    scales: {
      y: {
        ticks: {
          // Include a dollar sign in the ticks
          callback: function(value, index, ticks) {
              return value+'°';
          }
        },
        min: Math.floor(minTemp-1),
        max: Math.ceil(maxTemp+1)
      }
    }
  });
}, [hourlyChartData]);

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Typography variant="h2" align='center' component="div">
              <i className="wi wi-day-cloudy" style={{position: 'relative', top: 0, fontSize: "50pt"}}></i> {Math.round(currentWeather.temperature)}<i className="wi wi-celsius"></i>
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <Typography variant="h6" style={{ color: grey[600] }} align='right' component="div">
                  <i className="wi wi-direction-up"></i> <FormattedValue value={dailyMax} /><i className="wi wi-celsius"></i><br />
                  <i className="wi wi-direction-down"></i> <FormattedValue value={dailyMin} /><i className="wi wi-celsius"></i>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" style={{ color: grey[600] }} align='left' component="div">
                  <i className={"wi wi-wind from-"+currentWeather.wind_direction_30+"-deg"}></i> <FormattedValue value={currentWeather.wind_speed_30} /> km/h<br />
                  <Speed sx={{ fontSize: 30 }} /> <FormattedValue value={currentWeather.pressure_msl} /> hPa
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Typography variant="h5" align='center' style={{ color: grey[600] }} component="div">
              Tagesverlauf
            </Typography>
            <Bar height="106" data={hourlyChartData} options={options} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}