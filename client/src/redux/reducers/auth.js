import {
    LOGOUT_SUCCESS,
    PROF_LOADED,
    NO_PROF,
} from "../types";

const initialState = {
    isAuthenticated: null,
    user: null,
};
export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case PROF_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                user: payload
            };
        case NO_PROF:
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };
        default:
            return state

    }
}