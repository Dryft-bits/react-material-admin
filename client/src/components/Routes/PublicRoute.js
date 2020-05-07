import connect from "react-redux";
const PublicRoute = ({ component:Component, user, ...rest })  => {
    return (
      <Route
        {...rest}
        render={props =>
          state.auth.user ? (
            <Redirect
              to={{
                pathname: props.path,
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
const mapStateToProps = () => {
    return(
    {
        user: state.auth.user
    });
}
export default connect(mapStateToProps,null)(PublicRoute);