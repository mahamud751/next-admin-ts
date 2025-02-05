import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { ReferenceField, TextField } from "react-admin";

import {
  capitalizeFirstLetterOfEachWord,
  getFormattedDateString,
} from "@/utils/helpers";

const Timeline = (props) => {
  const keys = [
    "created",
    "picker_assigned",
    "printed",
    "picked",
    "packer_assigned",
    "packed",
    "sorting",
    "sorted",
    "in_bag",
    "delivering",
    "called",
    ...(props?.record?.s_is_reschedule ? ["re_scheduled"] : []),
    "cancel_requested",
    "delivered",
    "qc",
    "closed",
  ];

  return (
    <Table size="small" style={{ width: 550 }}>
      <TableHead>
        <TableRow>
          <TableCell>Time</TableCell>
          <TableCell>Action</TableCell>
          <TableCell>By</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {keys.map((key, i) => {
          const atKey = "s_" + key + "_at";
          const byKey = "s_" + key + "_by";

          return (
            <TableRow key={i}>
              <TableCell>
                {getFormattedDateString(props?.record[atKey])}
              </TableCell>
              <TableCell>{capitalizeFirstLetterOfEachWord(key)}</TableCell>
              <TableCell>
                <ReferenceField
                  source={byKey}
                  reference="v1/users"
                  link="show"
                  record={props?.record}
                >
                  <TextField source="u_name" />
                </ReferenceField>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default Timeline;
