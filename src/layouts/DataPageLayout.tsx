import {
  useState,
  useRef,
  use,
  type SetStateAction,
  type Dispatch,
} from "react";
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
  Drawer,
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
import { EMAIL_KEY } from "../constants";

export default function DataPageLayout() {
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <Box>
      <NavigationBar setOpenDrawer={setOpenDrawer} />
      <MiniDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
      <Outlet />
    </Box>
  );
}

function NavigationBar({
  setOpenDrawer,
}: {
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
}) {
  const { userEmail, logOut } = use(AuthContext);
  const menuAnchorRef = useRef<HTMLLabelElement>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const localStorageEmail = localStorage.getItem(EMAIL_KEY);

  return (
    <AppBar enableColorOnDark>
      <Toolbar className="flex justify-between">
        <IconButton className="sm:!hidden">
          <MenuIcon onClick={() => setOpenDrawer(true)} />
        </IconButton>

        <Button
          component="label"
          className="!text-white hover:!outline hover:!outline-white !ml-auto"
          ref={menuAnchorRef}
          variant="outlined"
          startIcon={<AccountCircleIcon />}
          onClick={() => setOpenMenu(!openMenu)}
        >
          {userEmail || localStorageEmail}
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

function MiniDrawer({
  openDrawer,
  setOpenDrawer,
}: {
  openDrawer: boolean;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
}) {
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const options = [
    {
      label: "Active Users",
      icon: <GroupIcon />,
      onClick: () => navigate("/data/active-users"),
      isActive: pathname.includes("active-users"),
    },
    {
      label: "Daily Store Sections",
      icon: <CameraIndoorIcon />,
      onClick: () => navigate("/data/daily-store-sections"),
      isActive: pathname.includes("daily-store-sections"),
    },
  ];

  return (
    <>
      <SwipeableDrawer
        className="sm:hidden"
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
          <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
            {openDrawer ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {options.map((option) => (
            <ListItem
              key={option.label}
              disablePadding
              className={clsx("py-3", {
                "bg-blue-600 text-white": option.isActive,
              })}
            >
              <ListItemButton className="flex gap-2" onClick={option.onClick}>
                <ListItemIcon
                  className={clsx("!min-w-0", {
                    "!text-white": option.isActive,
                  })}
                >
                  {option.icon}
                </ListItemIcon>
                <ListItemText>{option.label}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </SwipeableDrawer>

      <Drawer className="hidden sm:block" variant="permanent" open={openDrawer}>
        <div className="flex justify-end items-center h-16">
          <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
            {openDrawer ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {options.map((option) => (
            <ListItem
              key={option.label}
              disablePadding
              className={clsx("py-3", {
                "bg-blue-600 text-white": option.isActive,
              })}
            >
              <ListItemButton className="flex gap-2" onClick={option.onClick}>
                <ListItemIcon
                  className={clsx("!min-w-0", {
                    "!text-white": option.isActive,
                  })}
                >
                  {option.icon}
                </ListItemIcon>
                <ListItemText className={clsx({ hidden: !openDrawer })}>
                  {option.label}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
