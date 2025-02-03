import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SettingsIcon from "@mui/icons-material/Settings";
import { Logout, MenuItemLink, usePermissions, UserMenu } from "react-admin";
import { useLocation } from "react-router-dom";

const MyUserMenu = (props) => {
  const location = useLocation();
  const { permissions } = usePermissions();

  return (
    <UserMenu {...props}>
      {permissions?.includes("siteSettingsMenu") && (
        <MenuItemLink
          to="/site-settings"
          primaryText="Settings"
          leftIcon={<SettingsIcon />}
        />
      )}
      {process.env.NEXT_PUBLIC_NODE_ENV !== "production" && (
        <MenuItemLink
          to={`/switch-to?prevLocation=${location?.pathname}`}
          primaryText="Switch To"
          leftIcon={<ArrowForwardIcon />}
        />
      )}
      <Logout />
    </UserMenu>
  );
};

export default MyUserMenu;
