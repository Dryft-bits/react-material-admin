import React from "react";
import { Provider } from "react-redux";
import Landing from  "./Landing.js";
// components


// pages

// context
//import { useUserState } from "../context/UserContext";

// Redux
import store from "../redux/store";
export default function App() {
  // global
  //var { isAuthenticated } = store.user;
  return (
    <Provider store={store}>
      <Landing />
    </Provider>
  );
  }
  // #######################################################################
