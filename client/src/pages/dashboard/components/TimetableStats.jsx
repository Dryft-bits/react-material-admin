import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Grid,
  //LinearProgress,
  //Select,
  //OutlinedInput,
  //MenuItem,
} from "@material-ui/core";

import { useTheme } from "@material-ui/styles";
import {
  ResponsiveContainer,
  //AreaChart,
  //LineChart,
  //Line,
  //Area,
  PieChart,
  Pie,
  Cell,
  //YAxis,
  //XAxis,
} from "recharts";

// styles
import useStyles from "../styles";

// components
import { Typography } from "../../../components/Wrappers";
import Dot from "../../../components/Sidebar/components/Dot";
import { getDashboardData } from "../../../redux/actions/dashboard";

import { ttBranchTheme, ttYearTheme } from "../themes";

const dataRecorded = data => {
  for (var item of data) {
    if (item["value"] !== 0) {
      return true;
    }
  }
};

const TimetableStats = ({ ttBranchData, ttYearData }) => {
  var classes = useStyles();
  var theme = useTheme();
  return (ttBranchData || ttYearData) &&
    (dataRecorded(ttBranchData) || dataRecorded(ttYearData)) ? (
    <Grid container spacing={0}>
      <Grid item xs={1} style={{ float: "left" }}>
        <div className={classes.pieChartLegendWrapper}>
          {ttYearData.map(({ name, value }, index) => (
            <div key={name} className={classes.legendItemContainer}>
              <Dot color={ttYearTheme.palette[name].main} />
              <Typography style={{ whiteSpace: "nowrap" }}>
                &nbsp;{name}&nbsp;
              </Typography>
              <Typography color="text" colorBrightness="secondary">
                &nbsp;{value}
              </Typography>
            </div>
          ))}
        </div>
      </Grid>
      <Grid item xs={6}>
        <ResponsiveContainer width="120%" height={400}>
          <PieChart margin={{ left: theme.spacing(8) }}>
            <Pie
              data={ttBranchData}
              innerRadius={75}
              outerRadius={100}
              dataKey="value"
            >
              {ttBranchData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={ttBranchTheme.palette[entry.name].main}
                />
              ))}
            </Pie>
            <Pie
              data={ttYearData}
              innerRadius={40}
              outerRadius={75}
              dataKey="value"
            >
              {ttYearData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={ttYearTheme.palette[entry.name].main}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Grid>
      <Grid item xs={5} style={{ float: "right" }}>
        <div className={classes.pieChartLegendWrapper}>
          {ttBranchData.map(({ name, value }, index) => (
            <div key={name} className={classes.legendItemContainer}>
              <Dot color={ttBranchTheme.palette[name].main} />
              <Typography style={{ whiteSpace: "nowrap" }}>
                &nbsp;{name}&nbsp;
              </Typography>
              <Typography color="text" colorBrightness="secondary">
                &nbsp;{value}
              </Typography>
            </div>
          ))}
        </div>
      </Grid>
    </Grid>
  ) : (
    <p>No data recorded yet</p>
  );
};

const mapStateToProps = state => {
  return {
    ttBranchData: state.dashboard.ttBranchData,
    ttYearData: state.dashboard.ttYearData,
  };
};

export default connect(mapStateToProps, null)(TimetableStats);
