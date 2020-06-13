import { combineReducers } from "redux";
import dashboardReducer from "./dashboard";
import authReducer from "./auth";

export default combineReducers({ dashboard: dashboardReducer ,auth: authReducer });
