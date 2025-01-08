import Badge from "@mui/material/Badge";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import NotificationsIcon from "@mui/icons-material/Notifications";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { SetStateAction, useEffect, useState } from "react";
import { usePermissions } from "react-admin";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";

import { useGetCurrentUser, useRequest } from "../hooks";

dayjs.extend(relativeTime);

type Anchor = "top" | "left" | "bottom" | "right";

export default function Notification() {
  const classes = useStyles();
  const { permissions } = usePermissions();
  const currentUser = useGetCurrentUser();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const { data: notification, total } = useRequest(
    `/v1/notification?_true_user=${currentUser?.u_id}&_page=${
      currentPage + 1
    }&_perPage=${rowsPerPage}`,
    {},
    {
      isSuccessNotify: false,
      isPreFetching: true,
      isWarningNotify: false,
      refreshDeps: [currentPage, rowsPerPage],
    }
  );

  useEffect(() => {
    if (notification) {
      setNotifications(notification);
      setTotalNotifications(total);
    }
  }, [notification, total, notificationDrawerOpen, currentPage]);

  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const toggleNotificationDrawer = () => {
    setCurrentPage(0);
    setNotificationDrawerOpen(!notificationDrawerOpen);
  };

  const list = (anchor: Anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <Typography
          variant="body1"
          color="textPrimary"
          className={classes.notifications}
        >
          Notifications
        </Typography>
        <Divider />
        {notifications?.map((item) => {
          const timeDifference = dayjs().to(dayjs(item?.n_created_at));
          const notificationContent = (
            <React.Fragment key={item?.n_id}>
              <div>
                <img
                  src="https://minimals.cc/assets/icons/notification/ic_chat.svg"
                  alt=""
                />
              </div>
              <div className={classes.div2}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  className={classes.title}
                >
                  {item?.n_title}
                </Typography>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  className={classes.title2}
                >
                  {item?.n_description}
                </Typography>
                <div className={classes.icon}>
                  <Typography
                    variant="body1"
                    color="textPrimary"
                    className={classes.days}
                  >
                    {timeDifference} - {item?.n_type}
                  </Typography>
                </div>
              </div>
            </React.Fragment>
          );

          return (
            <React.Fragment key={item?.n_id}>
              {permissions?.includes("productOrderView") &&
              item?.n_entity === "ProductOrder" ? (
                <Link
                  to={`/v1/productOrder/${item?.n_params?.po_id}/show`}
                  className={classes.div}
                  onClick={() => {
                    setNotificationDrawerOpen(false);
                  }}
                >
                  {notificationContent}
                </Link>
              ) : (
                <div className={classes.div}>{notificationContent}</div>
              )}
            </React.Fragment>
          );
        })}
        <Divider />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          SelectProps={{
            inputProps: {
              "aria-label": "rows per page",
            },
            native: true,
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </List>
    </div>
  );

  return (
    <div>
      <IconButton
        aria-label={`show ${totalNotifications} new notifications`}
        color="inherit"
        onClick={toggleNotificationDrawer}
      >
        <Badge badgeContent={totalNotifications} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={notificationDrawerOpen}
        onClose={toggleNotificationDrawer}
      >
        {list("right")}
      </Drawer>
    </div>
  );
}

const useStyles = makeStyles({
  list: {
    width: 410,
  },
  fullList: {
    width: "auto",
  },
  notifications: {
    fontWeight: "bolder",
    padding: 10,
  },
  div: {
    display: "flex",
    padding: 10,
    borderBottom: "1px dotted rgba(145, 158, 171, 0.2)",
    textDecoration: "none",
  },
  div2: {
    marginLeft: 10,
  },
  title: {
    fontWeight: 600,
    fontSize: 13,
  },
  title2: {
    fontWeight: 500,
    fontSize: 13,
  },
  days: {
    fontWeight: 400,
    fontSize: 13,
    color: "rgb(145, 158, 171)",
    marginLeft: 4,
  },
  icon: {
    display: "flex",
  },
});
