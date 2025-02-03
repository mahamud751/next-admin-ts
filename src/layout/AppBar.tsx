import { Toolbar, Typography } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import { AppBar, Link, MenuItemLink, usePermissions } from "react-admin";

import { makeStyles } from "@mui/styles";

import aroggaWhiteLogo from "../assets/images/logo-white.png";
import { useRequest } from "../hooks";
import Notification from "./Notification";
import SearchBar from "./SearchBar";
import MyUserMenu from "./UserMenu";
import MyTooltip from "@/components/Tooltip";
import Image from "next/image";

const MyAppBar = (props) => {
  const classes = useStyles();
  const { permissions } = usePermissions();

  const { refetch: fetchCurrentPermission } = useRequest(
    "/auth/v1/getLoginSuccessResponse?f=admin",
    {},
    {
      isBaseUrl: true,
      onSuccess: ({ data }) => {
        localStorage.setItem("user", JSON.stringify(data));
        globalThis.location.reload();
      },
    }
  );

  return (
    <AppBar {...props} userMenu={<MyUserMenu />} elevation={1}>
      <Toolbar>
        <Link to="/">
          <Image src={aroggaWhiteLogo} alt="logo" className={classes.logo} />
        </Link>
      </Toolbar>
      <Typography
        variant="h6"
        color="inherit"
        className={classes.title}
        id="react-admin-title"
      />
      <Toolbar>
        {permissions?.includes("manageOrderMenu") &&
          permissions?.includes("productOrderMenu") &&
          permissions?.includes("productOrderView") && (
            <MenuItemLink
              to="/v1/productOrder"
              primaryText="Orders"
              className={classes.menuItemLink}
              // @ts-ignore
              classes={{ active: classes.active }}
            />
          )}
        {permissions?.includes("managePurchaseMenu") &&
          permissions?.includes("productPurchaseMenu") &&
          permissions?.includes("productPurchaseView") && (
            <MenuItemLink
              to="/v1/productPurchase"
              primaryText="Purchases"
              className={classes.menuItemLink}
              // @ts-ignore
              classes={{ active: classes.active }}
            />
          )}
        {permissions?.includes("stockMenu") && (
          <MenuItemLink
            to="/v1/stock"
            primaryText="Stocks"
            className={classes.menuItemLink}
            // @ts-ignore
            classes={{ active: classes.active }}
          />
        )}
      </Toolbar>
      <span className={classes.spacer} />
      <SearchBar />
      {permissions?.includes("notificationView") && <Notification />}
      <MyTooltip title="Reset Permission">
        <span onClick={fetchCurrentPermission} style={{ cursor: "pointer" }}>
          <CachedIcon />
        </span>
      </MyTooltip>
    </AppBar>
  );
};

const useStyles = makeStyles({
  logo: {
    marginLeft: -25,
  },
  title: {
    flex: 1,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    marginLeft: -10,
  },
  menuItemLink: {
    border: "none",
    color: "#FFFFFF",
  },
  active: {
    color: "rgba(0, 0, 0, 0.54)",
    backgroundColor: "rgb(230, 252, 246)",
    borderRadius: "6px",
  },
  spacer: {
    flex: 1,
  },
});

export default MyAppBar;
