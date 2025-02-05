import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { useRequest } from "@/hooks";

import PermissionSelfCopy from "@/pages/manageHR/designations/PermissionSelfCopy";
import PermissionCard from "@/components/common/PermissionCard";
import PermissionRemoveCard from "@/components/common/PermissionRemoveCard";

const PermissionsTab = ({ record }: any) => {
  const { values } = useWatch();

  const navigate = useNavigate();
  const [permissionStateSelf, setPermissionStateSelf] = useState([]);
  const [permissionStateRemove, setPermissionStateRemove] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [, setIndividualExpanded] = React.useState<any | false>([
    "panel1",
    "panel2",
    "panel3",
    "panel4",
    "panel5",
  ]);
  const [allExpanded, setAllExpanded] = React.useState(true);

  const toggleAllAccordions = () => {
    setAllExpanded((prev) => !prev);
    setIndividualExpanded((prev) =>
      prev.every((e) => e === prev[0])
        ? []
        : ["panel1", "panel2", "panel3", "panel4", "panel5"]
    );
  };

  const { data: permissionsData, refetch } = useRequest(
    "/v1/roles/permissions"
  );
  useEffect(() => {
    if (
      window.location.pathname.includes("/permissions") &&
      !permissionStateSelf?.length
    ) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  useEffect(() => {
    if (
      window.location.pathname.includes("/permissions") &&
      !setPermissionStateRemove?.length
    ) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  const rankPermissions = record?.permissions?.rank || [];
  const selfPermissions = record?.permissions?.self || [];
  const rolePermissions = record?.permissions?.role || [];
  const removePermissions = record?.permissions?.remove || [];

  const handleAllSelf = (param) => {
    if (!permissionStateSelf?.length) return;
    const modifiedPermissionState = permissionStateSelf
      .filter(({ permName }) => permName !== "onlyGET")
      .map((permission) => ({
        ...permission,
        isChecked: param === "selectAll",
      }));
    setPermissionStateSelf(modifiedPermissionState);
  };
  const handleAllRemove = (param) => {
    if (!permissionStateRemove?.length) return;

    const modifiedPermissionState = permissionStateRemove
      .filter(({ permName }) => permName !== "onlyGET")
      .map((permission) => ({
        ...permission,
        isChecked: param === "selectAll",
      }));
    setPermissionStateRemove(modifiedPermissionState);
  };

  const handlePermissionChange = ({ permId }) => {
    const findIndex = permissionStateSelf?.findIndex(
      (permission) => permission.id === permId
    );
    const newPermissionState = [...permissionStateSelf];
    newPermissionState[findIndex].isChecked =
      !newPermissionState[findIndex].isChecked;
    setPermissionStateSelf(newPermissionState);
  };

  const handlePermissionRemoveChange = ({ permId }) => {
    const findIndex = permissionStateRemove?.findIndex(
      (permission) => permission.id === permId
    );
    const newPermissionState = [...permissionStateRemove];
    newPermissionState[findIndex].isChecked =
      !newPermissionState[findIndex].isChecked;
    setPermissionStateRemove(newPermissionState);
  };

  const formattedCheckedPermissions = permissionStateSelf
    ?.filter((permission) => permission.isChecked)
    ?.map((permission) => permission.permName);

  const formattedCheckedPermissionsRemove = permissionStateRemove
    ?.filter((permission) => permission.isChecked)
    ?.map((permission) => permission.permName);

  const [newItem, setNewItem] = useState(selfPermissions);

  const [newIteRemove, setNewItemRemove] = useState(removePermissions);
  useEffect(() => {
    if (selfPermissions?.length) {
      setNewItem(selfPermissions);
      setNewItemRemove(removePermissions);
    }
  }, [selfPermissions, removePermissions]);
  useEffect(() => {
    if (formattedCheckedPermissions.length > 0) {
      setNewItem(formattedCheckedPermissions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionStateSelf]);
  useEffect(() => {
    if (formattedCheckedPermissionsRemove.length > 0) {
      setNewItemRemove(formattedCheckedPermissionsRemove);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionStateRemove]);

  useEffect(() => {
    if (!permissionsData?.length) return;

    const modifiedPermissionState = permissionsData.map(
      ({ perm_id, perm_name, perm_desc }) => ({
        id: perm_id,
        isChecked: newItem?.includes(perm_name),
        permName: perm_name,
        permDesc: perm_desc,
      })
    );
    if (
      JSON.stringify(modifiedPermissionState) !==
      JSON.stringify(permissionStateSelf)
    ) {
      setPermissionStateSelf(modifiedPermissionState);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionsData, newItem]);
  useEffect(() => {
    if (!permissionsData?.length) return;
    const modifiedPermissionState = permissionsData.map(
      ({ perm_id, perm_name, perm_desc }) => ({
        id: perm_id,
        isChecked: newIteRemove?.includes(perm_name),
        permName: perm_name,
        permDesc: perm_desc,
      })
    );
    if (
      JSON.stringify(modifiedPermissionState) !==
      JSON.stringify(permissionStateRemove)
    ) {
      setPermissionStateRemove(modifiedPermissionState);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionsData, newIteRemove]);

  values.permissions_add = JSON.stringify(
    !!permissionsData?.length && formattedCheckedPermissions.length > 0
      ? formattedCheckedPermissions
      : [""]
  );

  values.permissions_remove = JSON.stringify(
    formattedCheckedPermissionsRemove.length
      ? formattedCheckedPermissionsRemove
      : [""]
  );

  const [checked] = React.useState(true);

  const anchorClickHandler = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    const hash = e.currentTarget.getAttribute("href")?.split("#")[1];
    if (!hash) return false;

    const targetElement = document.getElementById(hash);
    if (targetElement) {
      const targetOffsetTop =
        targetElement.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: targetOffsetTop,
        behavior: "smooth",
      });
    }
  };

  const newArray = [
    ...new Set([
      ...(Array.isArray(rankPermissions) ? rankPermissions : []),
      ...(Array.isArray(rolePermissions) ? rolePermissions : []),
      ...(Array.isArray(formattedCheckedPermissions)
        ? formattedCheckedPermissions
        : []),
    ]),
  ];

  const modifiedNewArray = newArray?.filter(
    (permission) => !formattedCheckedPermissionsRemove?.includes(permission)
  );

  return (
    <>
      <div style={{ display: "flex", margin: "10px 0px" }}>
        <Button
          variant="outlined"
          color="primary"
          href="#rank"
          onClick={anchorClickHandler}
          style={{ margin: "0 10px" }}
        >
          Rank Permissions
        </Button>
        <Button
          variant="outlined"
          color="primary"
          href="#role"
          onClick={anchorClickHandler}
          style={{ margin: "0 10px" }}
        >
          Role Permissions
        </Button>
        <Button
          variant="outlined"
          color="primary"
          href="#self"
          onClick={anchorClickHandler}
        >
          Self Permissions
        </Button>
        <Button
          variant="outlined"
          color="primary"
          href="#remove"
          onClick={anchorClickHandler}
          style={{ margin: "0 10px" }}
        >
          Remove Permissions
        </Button>
        <Button
          variant="outlined"
          color="primary"
          href="#current_permissions"
          onClick={anchorClickHandler}
          style={{ margin: "0 10px" }}
        >
          Current Permissions
        </Button>
        <Button
          variant="outlined"
          //@ts-ignore
          color="default"
          onClick={toggleAllAccordions}
        >
          Collapse All
        </Button>
      </div>
      <div style={{ marginBottom: 20 }}>
        {values?.u_role !== "user" && (
          <Link
            to={`/designation-permission/${values.u_rank_id}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Button variant="contained" color="primary" disableElevation>
                Edit
              </Button>{" "}
            </div>
          </Link>
        )}

        <Accordion expanded={allExpanded}>
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
            <div id="rank">
              <Typography variant="h5">Rank Permission</Typography>
            </div>
          </AccordionSummary>

          <Grid container style={{ padding: 10 }}>
            {rankPermissions?.length > 0 ? (
              rankPermissions?.map((permName, index) => (
                <Grid
                  key={index}
                  item
                  xs={6}
                  md={4}
                  lg={3}
                  xl={2}
                  style={{ wordBreak: "break-word" }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        inputProps={{
                          "aria-label": "primary checkbox",
                        }}
                        checked={checked}
                      />
                    }
                    label={permName}
                  />
                </Grid>
              ))
            ) : (
              <p>No data</p>
            )}
          </Grid>
        </Accordion>
      </div>
      <div style={{ marginBottom: 20 }}>
        <Link
          to={`/permissions?${values?.u_role}`}
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button variant="contained" color="primary" disableElevation>
              Edit
            </Button>{" "}
          </div>
        </Link>
        <Accordion expanded={allExpanded}>
          <AccordionSummary
            aria-controls="panel12a-content"
            id="panel12a-header"
          >
            <div id="role">
              <Typography variant="h5">Role Permission</Typography>
            </div>
          </AccordionSummary>

          <Grid container style={{ padding: 10 }}>
            {rolePermissions?.length > 0 ? (
              rolePermissions.map((permName, index) => (
                <Grid
                  key={index}
                  item
                  xs={6}
                  md={4}
                  lg={3}
                  xl={2}
                  style={{ wordBreak: "break-word" }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        inputProps={{
                          "aria-label": "primary checkbox",
                        }}
                        checked={checked}
                      />
                    }
                    label={permName}
                  />
                </Grid>
              ))
            ) : (
              <p>No data</p>
            )}
          </Grid>
        </Accordion>
      </div>
      <Box
        display="flex"
        style={{ justifyContent: "flex-end", margin: "10px 0" }}
      >
        {/* @ts-ignore */}
        <Button
          variant="contained"
          color="primary"
          disableElevation
          // className={classes.button}
          onClick={(e: MouseEvent) => {
            e.stopPropagation();
            //@ts-ignore
            handleOpenDialog();
          }}
        >
          Copy From
        </Button>{" "}
      </Box>
      <div style={{ marginBottom: 20 }}>
        <Accordion expanded={allExpanded}>
          <AccordionSummary
            aria-controls="panel13a-content"
            id="panel13a-header"
          >
            <div id="self">
              <Typography variant="h5">Self Permission</Typography>
            </div>
          </AccordionSummary>

          <PermissionCard
            hasUpdateBtn={false}
            permissionState={permissionStateSelf}
            handlePermissionChange={handlePermissionChange}
            handleAll={handleAllSelf}
          />
        </Accordion>
      </div>
      <div style={{ marginBottom: 20 }}>
        <Accordion expanded={allExpanded}>
          <AccordionSummary
            aria-controls="panel14a-content"
            id="panel14a-header"
          >
            <div id="remove">
              <Typography variant="h5">Remove Permission</Typography>
            </div>
          </AccordionSummary>

          <PermissionRemoveCard
            hasUpdateBtn={false}
            permissionState={permissionStateRemove}
            handlePermissionChange={handlePermissionRemoveChange}
            handleAll={handleAllRemove}
          />
        </Accordion>
      </div>
      <div style={{ marginBottom: 20 }}>
        <Accordion expanded={allExpanded}>
          <AccordionSummary
            aria-controls="panel15a-content"
            id="panel15a-header"
          >
            <div id="current_permissions">
              <Typography variant="h5">Current Permission</Typography>
            </div>
          </AccordionSummary>

          <Grid container style={{ padding: 10 }}>
            {modifiedNewArray?.length > 0 ? (
              modifiedNewArray.map((permName, index) => (
                <Grid
                  key={index}
                  item
                  xs={6}
                  md={4}
                  lg={3}
                  xl={2}
                  style={{ wordBreak: "break-word" }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        inputProps={{
                          "aria-label": "primary checkbox",
                        }}
                        checked={checked}
                      />
                    }
                    label={permName}
                  />
                </Grid>
              ))
            ) : (
              <p>No data</p>
            )}
          </Grid>
        </Accordion>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogContent style={{ width: 400 }}>
          <PermissionSelfCopy
            permissionStateSelf={newItem}
            permissionStateSelfRemove={newIteRemove}
            setPermissionStateSelf={setNewItem}
            setPermissionStateRemove={setNewItemRemove}
            handleCloseDialog={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PermissionsTab;
