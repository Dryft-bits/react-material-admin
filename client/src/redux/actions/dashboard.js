import axios from "axios";
import moment from "moment";
import {
  DASHDATA_SUCCESS,
  DASHDATA_FAIL,
  LOGIN_INFO_SUCCESS,
  LOGIN_INFO_FAIL,
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
