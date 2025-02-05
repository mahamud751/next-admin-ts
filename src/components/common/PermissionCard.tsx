import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";

import LoaderOrButton from "./LoaderOrButton";

type PermissionCardProps = {
  id?: string;
  roleId?: string;
  roleName?: string;
  title?: string;
  isLoading?: boolean;
  hasUpdateBtn?: boolean;
  permissionState: any[];
  handlePermissionChange: (id) => void;
  handleUpdatePermission?: (id) => void;
  handleAll: (text: "selectAll" | "unselectAll", id: string) => void;
};

const PermissionCard: FC<PermissionCardProps> = ({
  id,
  roleId,
  roleName,
  title,
  isLoading,
  hasUpdateBtn = true,
  permissionState,
  handlePermissionChange,
  handleUpdatePermission,
  handleAll,
}) => {
  const [filterText, setFilterText] = useState("");

  return (
    <div
      style={
        hasUpdateBtn
          ? {
              border: "1px solid #ACACAC",
              marginTop: 20,
              padding: 15,
            }
          : {}
      }
    >
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5">{title}</Typography>
        {!!permissionState?.length && (
          <Box display="flex" justifyContent="flex-end" gap={5}>
            <TextField
              label="Filter"
              variant="outlined"
              size="small"
              style={{ width: 180 }}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => handleAll("selectAll", id)}
            >
              Select All
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => handleAll("unselectAll", id)}
            >
              Unselect All
            </Button>
          </Box>
        )}
      </Box>
      <Box mt={1} />
      <Grid container style={{ padding: "0 10px" }}>
        {permissionState?.length > 0 ? (
          permissionState
            .filter(({ permName }) =>
              permName?.toLowerCase()?.includes(filterText.toLowerCase())
            )
            .map(({ id, isChecked, permName, permDesc }) => (
              <Grid
                key={id}
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
                      checked={isChecked}
                      onChange={() =>
                        handlePermissionChange({
                          roleId: roleId,
                          permId: id,
                        })
                      }
                      inputProps={{
                        "aria-label": "primary checkbox",
                      }}
                    />
                  }
                  label={permDesc || permName}
                />
              </Grid>
            ))
        ) : (
          <p>No data</p>
        )}
      </Grid>
      {hasUpdateBtn && (
        <LoaderOrButton
          label="Update"
          isLoadingLabel={isLoading}
          mt={1}
          onClick={() =>
            handleUpdatePermission({
              roleId: id,
              roleName,
              permissions: permissionState,
            })
          }
        />
      )}
    </div>
  );
};

export default PermissionCard;
