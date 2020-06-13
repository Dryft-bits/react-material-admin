import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { addProf } from "../redux/actions/auth";
import { connect } from "react-redux";
// components
import Layout from "./Layout";

// pages
import Error from "../pages/error";
import Login from "../pages/login";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useGetData } from "use-axios-react";
const Landing = ({ addProf, user }) => {
  let token = Cookies.get("token") ? Cookies.get("token") : null;
  useEffect(() => {
    addProf(token);
  }, [addProf, token]);
  const [, loading] = useGetData("/api/profAuth/profLoggedIn");
  if (loading) {
    return <h2>Loading</h2>;
  }
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/app/dashboard" />} />
        <Route
          exact
          path="/app"
          render={() => <Redirect to="/app/dashboard" />}
        />
        <PrivateRoute path="/app" component={Layout} user={user} />
        <PublicRoute path="/login" component={Login} user={user} />
        <Route component={Error} />
      </Switch>
    </HashRouter>
  );

  // #######################################################################

  function PrivateRoute({ component: Component, user, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          user ? (
            React.createElement(Component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function PublicRoute({ component: Component, user, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          user ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            React.createElement(Component, props)
          )
        }
      />
    );
  }
};
const mapStateToProps = state => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, { addProf })(Landing);
