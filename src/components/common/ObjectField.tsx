import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { FC } from "react";
import { FunctionField, Labeled } from "react-admin";

type ObjectFieldProps = {
  source: string;
  label?: string;
  addLabel?: boolean;
};

const ObjectField: FC<ObjectFieldProps> = ({
  source,
  label = source,
  addLabel = true,
}) => {
  const RenderedField = () => (
    <FunctionField
      source={source}
      render={(record) => {
        if (!record?.[source]) return;

        return (
          <Table>
            <TableHead>
              <TableCell>Key</TableCell>
              <TableCell>Value</TableCell>
            </TableHead>
            <TableBody>
              {Object.entries(record?.[source])?.map(
                ([key, value]: any, index) => (
                  <TableRow key={index}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        );
      }}
    />
  );

  if (!addLabel) return <RenderedField />;

  return (
    <Labeled label={label}>
      <RenderedField />
    </Labeled>
  );
};

export default ObjectField;
