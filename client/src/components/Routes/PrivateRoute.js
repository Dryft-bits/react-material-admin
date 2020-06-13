import { connect } from "mongoose";

const PrivateRoute = ({ component, user, ...rest }) =>
{
    return (
      <Route
        {...rest}
        render={props =>
          user ? (
            React.createElement(component, props)
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
const mapStateToProps = () => {
    return(
    {
        user: state.auth.user
    });
}
PrivateRoute.propTypes = {
    user: PropTypes.bool.isRequired
  };
export default connect(mapStateToProps,null)(PrivateRoute);
