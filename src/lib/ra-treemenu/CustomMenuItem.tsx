import {
  Collapse,
  List,
  ListItemIcon,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { createTheme, styled } from "@mui/material/styles"; // For the styled API
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMore from "@mui/icons-material/ExpandMore";
import classnames from "classnames";
import { useTranslate } from "react-admin";
import { makeStyles } from "@mui/styles";

const CustomMenuItem = ({
  handleToggle,
  sidebarIsOpen,
  isOpen,
  name,
  icon,
  children,
  dense,
}) => {
  const classes = useStyles();
  const translate = useTranslate();

  const header = (
    //@ts-ignore
    <MenuItem
      key={name}
      dense={dense}
      button
      onClick={handleToggle}
      className={classnames(classes.menuItem, {
        [classes.openMenuItem]: isOpen,
      })}
    >
      <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
      <Typography
        variant="inherit"
        className={classnames(classes.menuItemName, "menuItemName")}
      >
        {translate(name)}
      </Typography>
      {sidebarIsOpen && (
        <ListItemIcon
          className={classes.icon}
          style={
            isOpen
              ? {
                  position: "absolute",
                  right: 0,
                  color: "#008069",
                }
              : {
                  position: "absolute",
                  right: 0,
                  color: "#969bad",
                }
          }
        >
          {isOpen ? <ExpandMore /> : <ChevronRightIcon />}
        </ListItemIcon>
      )}
    </MenuItem>
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
          className={
            sidebarIsOpen ? classes.sidebarIsOpen : classes.sidebarIsClosed
          }
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
const theme = createTheme({
  spacing: 8,
});
const useStyles = makeStyles(
  () => ({
    icon: { minWidth: theme.spacing(5) },
    sidebarIsOpen: {
      "& a": {
        paddingLeft: theme.spacing(3),
        transition: "padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
      },
    },
    sidebarIsClosed: {
      "& a": {
        paddingLeft: theme.spacing(3),
        transition: "padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
      },
    },
    menuItem: { color: "rgba(0, 0, 0, 0.54)" },
    menuItemName: {},
    openMenuItem: {
      color: "#008069",
    },
  }),
  { name: "RaTreeCustomMenuItem" }
);

export default CustomMenuItem;
