import { useState, useRef, use } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import clsx from "clsx";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
} from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import GroupIcon from "@mui/icons-material/Group";
import CameraIndoorIcon from "@mui/icons-material/CameraIndoor";
import { AuthContext } from "../contexts/AuthContext";

export default function DataPageLayout() {
  return (
    <Box>
      <NavigationBar />
      <MiniDrawer />
      <Outlet />
    </Box>
  );
}

function NavigationBar() {
  const { userEmail, logOut } = use(AuthContext);
  const menuAnchorRef = useRef<HTMLLabelElement>(null);
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <AppBar enableColorOnDark>
      <Toolbar className="flex justify-between">
        <IconButton>
          <MenuIcon />
        </IconButton>

        <Button
          component="label"
          className="!text-white hover:!outline hover:!outline-white"
          ref={menuAnchorRef}
          variant="outlined"
          startIcon={<AccountCircleIcon />}
          onClick={() => setOpenMenu(!openMenu)}
        >
          {userEmail}
        </Button>
        <Menu
          open={openMenu}
          anchorEl={menuAnchorRef.current}
          onClose={() => setOpenMenu(false)}
          onClick={() => setOpenMenu(false)}
        >
          <MenuItem
            className="hover:!text-white hover:!bg-red-600"
            onClick={logOut}
          >
            <LogoutIcon className="mr-1" /> Log out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

function MiniDrawer() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  const drawerOptions = [
    {
      name: "Active Users",
      icon: <GroupIcon />,
      path: "active-users",
    },
    {
      name: "Daily Store Section Data",
      icon: <CameraIndoorIcon />,
      path: "daily-store-section",
    },
  ];

  return (
    <SwipeableDrawer
      anchor="left"
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      open={openDrawer}
      transitionDuration={1000}
      onClose={() => setOpenDrawer(false)}
      onOpen={() => setOpenDrawer(true)}
      disableSwipeToOpen={false}
      swipeAreaWidth={30}
      keepMounted
    >
      <div className="flex justify-end items-center h-14">
        <IconButton
          onClick={() => {
            setOpenDrawer(!openDrawer);
            console.log("change drawer", openDrawer);
          }}
        >
          {openDrawer ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>
      <Divider />
      <List>
        {drawerOptions.map((option) => (
          <ListItem
            key={option.name}
            disablePadding
            className={clsx("py-3", {
              "bg-blue-600 text-white": pathname.includes(option.path),
            })}
          >
            <ListItemButton
              className="flex gap-2"
              onClick={() => {
                navigate(`/data/${option.path}`);
              }}
            >
              <ListItemIcon
                className={clsx("!min-w-0", {
                  "!text-white": pathname.includes(option.path),
                })}
              >
                {option.icon}
              </ListItemIcon>
              <ListItemText>{option.name}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </SwipeableDrawer>
  );
}
