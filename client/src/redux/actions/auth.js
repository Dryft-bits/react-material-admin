import axios from "axios";
import Professor from "../../Professor"
import Cookies from "js-cookie"
import {
    NO_PROF,
    PROF_LOADED
} from "../types"
export const addProf = (prof) => async dispatch => {
    console.log("gottem");
    if (prof) {
        let res = null;
        try {
            res = await axios.post("/api/profAuth/profLoggedIn", {
                token: prof
            })
            if (!res || !res.data) {
                localStorage.setItem('prof', false);
                dispatch({
                    type: NO_PROF
                })
            }
            else {
                localStorage.setItem('prof', true);
                dispatch({
                    type: PROF_LOADED,
                    payload: new Professor(res.data.username, res.data.name, res.data.department, res.data.email)
                })
            }
        }
        catch (err) {
            localStorage.setItem('prof', false);
            dispatch({
                type: NO_PROF
            })
        }
    }
}

export const logoutProf = () => dispatch => {
    localStorage.setItem('prof', false);
    Cookies.remove("token");
    dispatch({
        type: NO_PROF
    })
}
