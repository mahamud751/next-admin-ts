import { FC } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
} from "@mui/material";
import {
  ReferenceField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
  useShowController,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDateField from "@/components/common/AroggaDateField";

const BulkUserShow: FC<ShowProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Bulk User Show");

  const classes = useAroggaStyles();
  const { record } = useShowController(rest);
  // console.log(record);
  // if (Array.isArray(record?.bucr_request_error)) {
  //     console.log(JSON.parse(record.bucr_request_error).map((row: any[], index: number) => console.log(row, index)));
  // } else {
  // }
  let parsedError = [];
  try {
    parsedError = JSON.parse(record.bucr_request_error);
  } catch (e) {
    parsedError = [];
  }
  let parsedExistingError = [];
  try {
    parsedExistingError = JSON.parse(record.bucr_request_existing_user_error);
  } catch (e) {
    parsedExistingError = [];
  }

  return (
    <Show {...rest}>
      <SimpleShowLayout>
        <TextField source="bucr_id" label="ID" />
        <TextField source="bucr_title" label="Title" />
        <TextField
          source="bucr_request_status"
          label="Request Status"
          className={classes.capitalize}
        />
        <TextField
          source="bucr_previous_exists_user_count"
          label="Previous Exists User Count"
        />
        <TextField
          source="bucr_created_user_count"
          label="Created User Count"
        />
        <AroggaDateField source="bucr_created_at" label="Created At" />
        <ReferenceField
          source="bucr_created_by"
          label="Created By"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>

        <Typography variant="body1" style={{ margin: "10px 0" }}>
          Request Errors
        </Typography>
        {parsedError?.length ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parsedError?.map((row, index) => (
                  <TableRow key={index}>
                    {row?.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}

        <Typography variant="body1" style={{ margin: "10px 0" }}>
          Existing Request Errors
        </Typography>
        {parsedExistingError?.length ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parsedExistingError.map((row, index) => (
                  <TableRow key={index}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </SimpleShowLayout>
    </Show>
  );
};

export default BulkUserShow;
