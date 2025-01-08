import {
  Collapse,
  List,
  ListItemIcon,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles"; // For the styled API
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMore from "@mui/icons-material/ExpandMore";
import classnames from "classnames";
import { useTranslate } from "react-admin";

// Styles using the styled API
const IconWrapper = styled(ListItemIcon)(({ theme }) => ({
  minWidth: theme.spacing(5),
}));

const SidebarIsOpenStyles = {
  "& a": {
    paddingLeft: (theme) => theme.spacing(3),
    transition: "padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
  },
};

const SidebarIsClosedStyles = {
  "& a": {
    paddingLeft: (theme) => theme.spacing(3),
    transition: "padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
  },
};

const MenuItemStyles = styled(MenuItem)(({ theme }) => ({
  color: "rgba(0, 0, 0, 0.54)",
}));

const OpenMenuItemStyles = {
  color: "#008069",
};

const CustomMenuItem = ({
  handleToggle,
  sidebarIsOpen,
  isOpen,
  name,
  icon,
  children,
  dense,
}) => {
  const translate = useTranslate();

  const header = (
    <MenuItemStyles
      key={name}
      dense={dense}
      onClick={handleToggle}
      className={classnames({
        "open-menu-item": isOpen,
      })}
      sx={isOpen ? OpenMenuItemStyles : {}}
    >
      <IconWrapper>{icon}</IconWrapper>
      <Typography variant="inherit" className={classnames("menuItemName")}>
        {translate(name)}
      </Typography>
      {sidebarIsOpen && (
        <IconWrapper
          sx={{
            position: "absolute",
            right: 0,
            color: isOpen ? "#008069" : "#969bad",
          }}
        >
          {isOpen ? <ExpandMore /> : <ChevronRightIcon />}
        </IconWrapper>
      )}
    </MenuItemStyles>
  );

  return (
    <>
      {sidebarIsOpen || isOpen ? (
        header
      ) : (
        <Tooltip title={translate(name)} placement="right">
          {header}
        </Tooltip>
      )}
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List
          dense={dense}
          component="div"
          sx={sidebarIsOpen ? SidebarIsOpenStyles : SidebarIsClosedStyles}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
          }}
          disablePadding
        >
          {children}
        </List>
      </Collapse>
    </>
  );
};

export default CustomMenuItem;
