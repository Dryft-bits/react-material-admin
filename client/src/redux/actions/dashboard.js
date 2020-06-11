import axios from "axios";
import moment from "moment";
import {
  DASHDATA_SUCCESS,
  DASHDATA_FAIL,
  LOGIN_INFO_SUCCESS,
  LOGIN_INFO_FAIL,
  TT_INFO_SUCCESS,
  TT_INFO_FAIL,
  RESET_SUCCESS,
  RESET_FAIL,
} from "../types";

// Initial redux action for loading data
export const getDashboardData = () => async dispatch => {
  try {
    await axios.get("/api/dashboard").then(res => {
      if (res.status === 200) {
        dispatch({
          type: DASHDATA_SUCCESS,
          payload: { allData: res.data },
        });
        dispatch(getDataForPeriod(res.data.userLogins, 30));
        dispatch(getTimetableStats(res.data.timetablesCreated));
      } else {
        throw new Error("Could not fetch data");
      }
    });
  } catch (err) {
    dispatch({
      type: DASHDATA_FAIL,
    });
  }
};

// Action to get data for certain period
export const getDataForPeriod = (logins, days = 30) => async dispatch => {
  const CURRENT_TIME = moment();
  days--; // For array index
  try {
    var loginData = [];
    // Initialize data in format needed by dashboard
    for (let day = days; day >= 0; day--) {
      loginData.push({
        allUsers: 0,
        uniqueUsers: 0,
      });
    }

    // Count all logins for each day
    logins.forEach(login => {
      const difference = days - CURRENT_TIME.diff(login["createdAt"], "days");
      if (difference >= 0) {
        loginData[difference]["allUsers"] += 1;
      }
    });

    // Data assumed to be in sorted order, and will be, with very small variations, if at all due to network speeds
    var currentDay = days;
    var uniqueLoginsForDay = new Set();
    for (var loginIdx = 0; loginIdx < logins.length; loginIdx++) {
      const currentLogin = logins[loginIdx];
      if (CURRENT_TIME.diff(currentLogin["createdAt"], "days") === currentDay) {
        uniqueLoginsForDay.add(currentLogin["userId"]["_id"]);
      } else {
        if (days - currentDay > 0) {
          loginData[days - currentDay]["uniqueUsers"] = uniqueLoginsForDay.size;
        }
        uniqueLoginsForDay = new Set();
        uniqueLoginsForDay.add(currentLogin["userId"]["_id"]);
        currentDay = CURRENT_TIME.diff(currentLogin["createdAt"], "days");
      }
    }
    if (days - currentDay > 0) {
      loginData[days - currentDay]["uniqueUsers"] = uniqueLoginsForDay.size;
    }

    dispatch({
      type: LOGIN_INFO_SUCCESS,
      payload: { loginData: loginData },
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: LOGIN_INFO_FAIL,
    });
  }
};

export const getTimetableStats = timetables => async dispatch => {
  const branches = [
    "BIO",
    "CHE",
    "CHEM",
    "CE",
    "CS",
    "ECO",
    "ECE",
    "EEE",
    "INSTR",
    "MANU",
    "MATH",
    "ME",
    "PHA",
    "PHY",
  ];
  var ttsByBranch = [
    { name: "BIO", value: 0 },
    { name: "CHE", value: 0 },
    { name: "CHEM", value: 0 },
    { name: "CE", value: 0 },
    { name: "CS", value: 0 },
    { name: "ECO", value: 0 },
    { name: "ECE", value: 0 },
    { name: "EEE", value: 0 },
    { name: "INSTR", value: 0 },
    { name: "MANU", value: 0 },
    { name: "MATH", value: 0 },
    { name: "ME", value: 0 },
    { name: "PHA", value: 0 },
    { name: "PHY", value: 0 },
  ];

  var ttsByYear = [
    { name: "1", value: 0 },
    { name: "2", value: 0 },
    { name: "3", value: 0 },
    { name: "4", value: 0 },
    { name: "5", value: 0 },
  ];
  try {
    timetables.forEach(function(timetable) {
      ttsByBranch[branches.indexOf(timetable.branch[0])]["value"] =
        ttsByBranch[branches.indexOf(timetable.branch[0])]["value"] + 1;
      ttsByYear[timetable.year - 1]["value"] =
        ttsByYear[timetable.year - 1]["value"] + 1;
    });

    dispatch({
      type: TT_INFO_SUCCESS,
      payload: { ttBranchData: ttsByBranch, ttYearData: ttsByYear },
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: TT_INFO_FAIL,
    });
  }
};

export const resetSemester = sem => async dispatch => {
  try {
    await axios.post("/api/dashboard/resetSem", { semester: sem }).then(res => {
      if (res.status === 200) {
        return new Promise((resolve, reject) => {
          dispatch({
            type: RESET_SUCCESS,
          });
          resolve();
        });
      } else {
        throw new Error("Could not reset sem");
      }
    });
  } catch (err) {
    dispatch({
      type: RESET_FAIL,
    });
  }
};
