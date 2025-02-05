import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box, Checkbox, Grid, TextField, Typography } from "@mui/material";
import { Title, useRefresh } from "react-admin";

import { useDocumentTitle, useRequest } from "@/hooks";

const PermissionsList = () => {
  useDocumentTitle("Arogga | Permission List");
  const classes = useStyles();
  const refresh = useRefresh();
  const [filterText, setFilterText] = useState("");
  const { data: permissionsData, refetch } = useRequest(
    "/v1/roles/permissions",
    {},
    { isPreFetching: true }
  );

  const { refetch: addApprove } = useRequest(undefined, undefined, {
    onSuccess: (json) => {
      refresh();
      refetch();
    },
  });

  const handleApprove = (id) => {
    addApprove({
      endpoint: `/v1/roles/permissions/${id}`,
      method: "POST",
      body: {
        perm_is_reserved: 1,
      },
    });
  };

  const { refetch: addReject } = useRequest(undefined, undefined, {
    onSuccess: (json) => {
      refresh();
      refetch();
    },
  });

  const handleReject = (id) => {
    addReject({
      endpoint: `/v1/roles/permissions/${id}`,
      method: "POST",
      body: {
        perm_is_reserved: 0,
      },
    });
  };

  return (
    <div className={classes.div}>
      <Title title="List of Permissions" />
      <Box display="flex" justifyContent="flex-end" gap={5}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          className={classes.filter}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </Box>

      <Grid container>
        {/* Permission Name Title */}
        <Grid item xs={4}>
          <div className={classes.div2}>
            <Typography variant="body1">Name</Typography>
            <Typography variant="body1">Reserved</Typography>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className={classes.div2}>
            <Typography variant="body1">Name</Typography>
            <Typography variant="body1">Reserved</Typography>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className={classes.div2}>
            <Typography variant="body1">Name</Typography>
            <Typography variant="body1">Reserved</Typography>
          </div>
        </Grid>

        {/* Mapping over the data */}
        {permissionsData?.length > 0 ? (
          permissionsData
            .filter(({ perm_name }) =>
              perm_name?.toLowerCase()?.includes(filterText.toLowerCase())
            )
            .map(({ perm_id, perm_is_reserved, perm_name }) => (
              <Grid item xs={4} key={perm_id} className={classes.mainBorder}>
                <Grid container>
                  <Grid item xs={7} className={classes.name}>
                    <Typography>{perm_name}</Typography>
                  </Grid>
                  <Grid item xs={5} className={classes.checkbox}>
                    <Checkbox
                      checked={perm_is_reserved === 1}
                      onClick={() => {
                        if (perm_is_reserved === 1) {
                          handleReject(perm_id);
                        } else {
                          handleApprove(perm_id);
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            ))
        ) : (
          <p>No data</p>
        )}
      </Grid>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  mainBorder: {
    borderBottom: "2px solid #ACACAC",
  },

  div: {
    border: "1px solid #ACACAC",
    marginTop: 20,
    padding: 15,
  },
  div2: {
    display: "flex",
    justifyContent: "space-around",
    textAlign: "start",
    border: "1px solid #ACACAC",
    padding: 10,
  },
  filter: {
    width: 180,
    marginBottom: 20,
  },

  checkbox: {
    textAlign: "center",
    borderLeft: "1px solid #ACACAC",
    borderRight: "1px solid #ACACAC",
    padding: 5,
  },
  name: {
    padding: 5,
    borderLeft: "1px solid #ACACAC",
  },
}));
export default PermissionsList;
