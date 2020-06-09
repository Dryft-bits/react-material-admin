import React, { useState, Fragment } from "react";
import { connect } from "react-redux";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Fab,
  Zoom,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  MailOutline as MailIcon,
  NotificationsNone as NotificationsIcon,
  Person as AccountIcon,
  Search as SearchIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
} from "@material-ui/icons";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import { Badge, Typography, Button } from "../Wrappers/Wrappers";
import Notification from "../Notification/Notification";
import UserAvatar from "../UserAvatar/UserAvatar";
import Cookies from "js-cookie";
// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";
import configuration from "../../config/constants";

import { resetSemester } from "../../redux/actions/dashboard";

//import { logoutProf } from "../../redux/actions/auth"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const messages = [
  {
    id: 0,
    variant: "warning",
    name: "Jane Hew",
    message: "Hey! How is it going?",
    time: "9:32",
  },
  {
    id: 1,
    variant: "success",
    name: "Lloyd Brown",
    message: "Check out my new Dashboard",
    time: "9:18",
  },
  {
    id: 2,
    variant: "primary",
    name: "Mark Winstein",
    message: "I want rearrange the appointment",
    time: "9:15",
  },
  {
    id: 3,
    variant: "secondary",
    name: "Liana Dutti",
    message: "Good news from sale department",
    time: "9:09",
  },
];

const notifications = [
  { id: 0, color: "warning", message: "Check out this awesome ticket" },
  {
    id: 1,
    color: "success",
    type: "info",
    message: "What is the best way to get ...",
  },
  {
    id: 2,
    color: "secondary",
    type: "notification",
    message: "This is just a simple notification",
  },
  {
    id: 3,
    color: "primary",
    type: "e-commerce",
    message: "12 new orders has arrived today",
  },
];

const Header = ({ resetSemester }) => {
  var classes = useStyles();

  const logoutProf = () => {
    console.log("bye");
    localStorage.setItem("prof", false);
    Cookies.remove("token");
    window.location.href = configuration.urls.studentLogin;
  };

  // global
  var layoutState = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // local
  var [mailMenu, setMailMenu] = useState(null);
  var [isMailsUnread, setIsMailsUnread] = useState(true);
  var [notificationsMenu, setNotificationsMenu] = useState(null);
  var [isNotificationsUnread, setIsNotificationsUnread] = useState(true);
  var [profileMenu, setProfileMenu] = useState(null);
  var [isSearchOpen, setSearchOpen] = useState(false);
  var [open, setOpen] = React.useState(false);
  var [alertOpen, setAlertOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const resetSem = sem => {
    handleClose();
    setAlertOpen(true);
    resetSemester(sem);
  };

  const handleAlertClose = (event, reason) => {
    setAlertOpen(false);
  };

  return (
    <Fragment>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            color="inherit"
            onClick={() => toggleSidebar(layoutDispatch)}
            className={classNames(
              classes.headerMenuButton,
              classes.headerMenuButtonCollapse,
            )}
          >
            {layoutState.isSidebarOpened ? (
              <ArrowBackIcon
                classes={{
                  root: classNames(
                    classes.headerIcon,
                    classes.headerIconCollapse,
                  ),
                }}
              />
            ) : (
              <MenuIcon
                classes={{
                  root: classNames(
                    classes.headerIcon,
                    classes.headerIconCollapse,
                  ),
                }}
              />
            )}
          </IconButton>
          <Typography variant="h6" weight="medium" className={classes.logotype}>
            React Material Admin
          </Typography>
          <div className={classes.grow} />
          <Button
            onClick={handleClickOpen}
            variant={"contained"}
            color={"secondary"}
            style={{ marginRight: 24 }}
          >
            Start a new Semester
          </Button>
          <div
            className={classNames(classes.search, {
              [classes.searchFocused]: isSearchOpen,
            })}
          >
            <div
              className={classNames(classes.searchIcon, {
                [classes.searchIconOpened]: isSearchOpen,
              })}
              onClick={() => setSearchOpen(!isSearchOpen)}
            >
              <SearchIcon classes={{ root: classes.headerIcon }} />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
          </div>
          <IconButton
            color="inherit"
            aria-haspopup="true"
            aria-controls="mail-menu"
            onClick={e => {
              setNotificationsMenu(e.currentTarget);
              setIsNotificationsUnread(false);
            }}
            className={classes.headerMenuButton}
          >
            <Badge
              badgeContent={isNotificationsUnread ? notifications.length : null}
              color="warning"
            >
              <NotificationsIcon classes={{ root: classes.headerIcon }} />
            </Badge>
          </IconButton>
          <IconButton
            color="inherit"
            aria-haspopup="true"
            aria-controls="mail-menu"
            onClick={e => {
              setMailMenu(e.currentTarget);
              setIsMailsUnread(false);
            }}
            className={classes.headerMenuButton}
          >
            <Badge
              badgeContent={isMailsUnread ? messages.length : null}
              color="secondary"
            >
              <MailIcon classes={{ root: classes.headerIcon }} />
            </Badge>
          </IconButton>
          <IconButton
            aria-haspopup="true"
            color="inherit"
            className={classes.headerMenuButton}
            aria-controls="profile-menu"
            onClick={e => setProfileMenu(e.currentTarget)}
          >
            <AccountIcon classes={{ root: classes.headerIcon }} />
          </IconButton>
          <Menu
            id="mail-menu"
            open={Boolean(mailMenu)}
            anchorEl={mailMenu}
            onClose={() => setMailMenu(null)}
            MenuListProps={{ className: classes.headerMenuList }}
            className={classes.headerMenu}
            classes={{ paper: classes.profileMenu }}
            disableAutoFocusItem
          >
            <div className={classes.profileMenuUser}>
              <Typography variant="h4" weight="medium">
                New Messages
              </Typography>
              <Typography
                className={classes.profileMenuLink}
                component="a"
                color="secondary"
              >
                {messages.length} New Messages
              </Typography>
            </div>
            {messages.map(message => (
              <MenuItem
                key={message.id}
                className={classes.messageNotification}
              >
                <div className={classes.messageNotificationSide}>
                  <UserAvatar color={message.variant} name={message.name} />
                  <Typography
                    size="sm"
                    color="text"
                    colorBrightness="secondary"
                  >
                    {message.time}
                  </Typography>
                </div>
                <div
                  className={classNames(
                    classes.messageNotificationSide,
                    classes.messageNotificationBodySide,
                  )}
                >
                  <Typography weight="medium" gutterBottom>
                    {message.name}
                  </Typography>
                  <Typography color="text" colorBrightness="secondary">
                    {message.message}
                  </Typography>
                </div>
              </MenuItem>
            ))}
            <Fab
              variant="extended"
              color="primary"
              aria-label="Add"
              className={classes.sendMessageButton}
            >
              Send New Message
              <SendIcon className={classes.sendButtonIcon} />
            </Fab>
          </Menu>
          <Menu
            id="notifications-menu"
            open={Boolean(notificationsMenu)}
            anchorEl={notificationsMenu}
            onClose={() => setNotificationsMenu(null)}
            className={classes.headerMenu}
            disableAutoFocusItem
          >
            {notifications.map(notification => (
              <MenuItem
                key={notification.id}
                onClick={() => setNotificationsMenu(null)}
                className={classes.headerMenuItem}
              >
                <Notification {...notification} typographyVariant="inherit" />
              </MenuItem>
            ))}
          </Menu>
          <Menu
            id="profile-menu"
            open={Boolean(profileMenu)}
            anchorEl={profileMenu}
            onClose={() => setProfileMenu(null)}
            className={classes.headerMenu}
            classes={{ paper: classes.profileMenu }}
            disableAutoFocusItem
          >
            <div className={classes.profileMenuUser}>
              <Typography variant="h4" weight="medium">
                John Smith
              </Typography>
              <Typography
                className={classes.profileMenuLink}
                component="a"
                color="primary"
                href="https://flatlogic.com"
              >
                Flalogic.com
              </Typography>
            </div>
            <MenuItem
              className={classNames(
                classes.profileMenuItem,
                classes.headerMenuItem,
              )}
            >
              <AccountIcon className={classes.profileMenuIcon} /> Profile
            </MenuItem>
            <MenuItem
              className={classNames(
                classes.profileMenuItem,
                classes.headerMenuItem,
              )}
            >
              <AccountIcon className={classes.profileMenuIcon} /> Tasks
            </MenuItem>
            <MenuItem
              className={classNames(
                classes.profileMenuItem,
                classes.headerMenuItem,
              )}
            >
              <AccountIcon className={classes.profileMenuIcon} /> Messages
            </MenuItem>
            <div className={classes.profileMenuUser}>
              <Typography
                className={classes.profileMenuLink}
                color="primary"
                onClick={logoutProf}
              >
                Sign Out
              </Typography>
            </div>
          </Menu>
        </Toolbar>
      </AppBar>

      {
        // REQUIRED CODE BELOW THIS
      }
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Start a new semester?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            This will reset all student course data, and delete all timetables
            and course statistics. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => resetSem("odd")} color="secondary">
            Start new odd semester
          </Button>
          <Button onClick={() => resetSem("even")} color="secondary">
            Start new even semester
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert onClose={handleAlertClose} severity="success">
          New semester started!
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

export default connect(null, { resetSemester })(Header);
