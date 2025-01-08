import { Toolbar, Typography } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import { AppBar, Link, MenuItemLink, usePermissions } from "react-admin";
import { styled } from "@mui/material/styles";

import aroggaWhiteLogo from "../assets/images/logo-white.png";
import { useRequest } from "../hooks";
import Notification from "./Notification";
import SearchBar from "./SearchBar";
import MyUserMenu from "./UserMenu";
import MyTooltip from "@/components/Tooltip";

const LogoImage = styled("img")({
  marginLeft: -25,
});

const TitleTypography = styled(Typography)({
  flex: 1,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
  marginLeft: -10,
});

const MenuItemLinkStyled = styled(MenuItemLink)({
  border: "none",
  color: "#FFFFFF",
  "&.active": {
    color: "rgba(0, 0, 0, 0.54)",
    backgroundColor: "rgb(230, 252, 246)",
    borderRadius: "6px",
  },
});

const Spacer = styled("span")({
  flex: 1,
});

const MyAppBar = (props) => {
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
          <LogoImage src={aroggaWhiteLogo.src} alt="logo" />
        </Link>
      </Toolbar>
      <TitleTypography variant="h6" color="inherit" id="react-admin-title" />
      <Toolbar>
        {permissions?.includes("manageOrderMenu") &&
          permissions?.includes("productOrderMenu") &&
          permissions?.includes("productOrderView") && (
            <MenuItemLinkStyled to="/v1/productOrder" primaryText="Orders" />
          )}
        {permissions?.includes("managePurchaseMenu") &&
          permissions?.includes("productPurchaseMenu") &&
          permissions?.includes("productPurchaseView") && (
            <MenuItemLinkStyled
              to="/v1/productPurchase"
              primaryText="Purchases"
            />
          )}
        {permissions?.includes("stockMenu") && (
          <MenuItemLinkStyled to="/v1/stock" primaryText="Stocks" />
        )}
      </Toolbar>
      <Spacer />
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

export default MyAppBar;
