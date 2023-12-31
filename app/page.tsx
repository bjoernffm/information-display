'use client'

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TimeCard from './time_card';
import DeviceCard from './device_card';
import SmallWeatherCard from './small_weather_card';
import SmallTransportationCard from './small_transportation_card';
import Grid from '@mui/material/Grid';
import HomeIcon from '@mui/icons-material/Home';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import PermDeviceInformationIcon from '@mui/icons-material/PermDeviceInformation';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDisplay, faHome } from '@fortawesome/free-solid-svg-icons'
//import { faDisplay } from '@fortawesome/free-regular-svg-icons'
import { faWindows, faApple, faLinux } from '@fortawesome/free-brands-svg-icons'
import CiteCard from './cite_card';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: "50%", marginBottom: 5 }}>
        <Tabs value={value} onChange={handleChange} variant="fullWidth" aria-label="basic tabs example">
          <Tab icon={<FontAwesomeIcon icon={faHome} />} label="HOME" {...a11yProps(0)} />
          <Tab icon={<FontAwesomeIcon icon={faDisplay} />} label="Device" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TimeCard />
          </Grid>
          <Grid item xs={8}>
            <SmallWeatherCard />
          </Grid>
          <Grid item xs={12}>
            <SmallTransportationCard />
          </Grid>
          <Grid item xs={12}>
            <CiteCard />
          </Grid>
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <DeviceCard />
      </CustomTabPanel>
    </Box>
  );
}