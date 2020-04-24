import axios from "axios";
import moment from "moment";
import {
  DASHDATA_SUCCESS,
  DASHDATA_FAIL,
  LOGIN_INFO_SUCCESS,
  LOGIN_INFO_FAIL,
} from "../types";

var CURRENT_DATE = moment(); // fixed just for testing, use moment();

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

export const getDataForPeriod = (logins, days = 30) => async dispatch => {
  console.log("hi");
  try {
    var loginData = [];
    for (let day = days; day >= 0; day--) {
      loginData.push({
        allUsers: 0,
        uniqueUsers: 0,
      });
    }

    logins.forEach(login => {
      loginData[days - CURRENT_DATE.diff(login["createdAt"], "days")][
        "allUsers"
      ] += 1;
    });

    var currentDay = days;
    var uniqueLoginsForDay = new Set();
    for (var loginIdx = 0; loginIdx < logins.length; loginIdx++) {
      const currentLogin = logins[loginIdx];
      if (CURRENT_DATE.diff(currentLogin["createdAt"], "days") === currentDay) {
        uniqueLoginsForDay.add(currentLogin["userId"]["_id"]);
      } else {
        loginData[days - currentDay]["uniqueUsers"] = uniqueLoginsForDay.size;
        uniqueLoginsForDay = new Set();
        uniqueLoginsForDay.add(currentLogin["userId"]["_id"]);
        currentDay = CURRENT_DATE.diff(currentLogin["createdAt"], "days");
      }
    }
    loginData[days - currentDay]["uniqueUsers"] = uniqueLoginsForDay.size;

    dispatch({
      type: LOGIN_INFO_SUCCESS,
      payload: { loginData: loginData },
    });
  } catch (err) {
    dispatch({
      type: LOGIN_INFO_FAIL,
    });
  }
};
