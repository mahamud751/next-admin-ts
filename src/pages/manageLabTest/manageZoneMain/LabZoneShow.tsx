import { AppBar, Box, Tab, Tabs, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/system";

import React from "react";
import { useParams } from "react-router-dom";

import UpdateVendorAssign from "./tabs/UpdateVendorAssign";
import VendorCollector from "./tabs/VendorCollector";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
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
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));
export default function LabZoneShow() {
  const { id }: { id: string } = useParams();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        style={{
          marginTop: 30,
          backgroundColor: "white",
          color: "black",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Collector" {...a11yProps(0)} />
          <Tab label="Vendor" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <UpdateVendorAssign id={id} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <VendorCollector id={id} />
      </TabPanel>
    </div>
  );
}
