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

const initialState = {
  loginData: [],
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case DASHDATA_SUCCESS:
      return {
        ...state,
        ...payload,
        allData: payload.allData,
      };

    case LOGIN_INFO_SUCCESS:
      return {
        ...state,
        loginData: payload.loginData,
      };

    case DASHDATA_FAIL:
      return {
        ...state,
        allData: null,
        loginData: [],
      };

    case TT_INFO_SUCCESS:
      return {
        ...state,
        ttBranchData: payload.ttBranchData,
        ttYearData: payload.ttYearData,
      };

    case TT_INFO_FAIL:
      return {
        ...state,
        ttBranchData: [],
        ttYearData: [],
      };

    case LOGIN_INFO_FAIL:
      return {
        ...state,
        loginData: [],
      };

    case RESET_SUCCESS:
      return {
        ...state,
        allData: {
          ...state.allData,
          timetablesCreated: [],
        },
        ttBranchData: [],
        ttYearData: [],
      };

    case RESET_FAIL:
      return {
        ...state,
      };

    default:
      return state;
  }
}
