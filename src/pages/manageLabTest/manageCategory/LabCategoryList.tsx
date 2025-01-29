import { FC } from "react";
import {
  Datagrid,
  FunctionField,
  ImageField,
  List,
  ListProps,
  TextField,
} from "react-admin";

import { useDocumentTitle, useExport } from "../../../hooks";
import { getColorByStatus } from "../../../utils/helpers";
import { useAroggaStyles } from "../../../utils/useAroggaStyles";
import LabCategoryFilter from "./LabCategoryFilter";

const LabCategoryList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Lab Test | Category List");

  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  return (
    <List
      {...rest}
      title="List of Lab Categories"
      filters={<LabCategoryFilter children={""} />}
      perPage={25}
      exporter={exporter}
      // bulkActionButtons={false}
    >
      <Datagrid rowClick="edit" style={{ height: 50 }}>
        <TextField
          source="name.en"
          label="Name"
          className={classes.capitalize}
        />
        <TextField
          source="sectionTag"
          label="Section Tag"
          className={classes.capitalize}
        />
        <FunctionField
          render={(record) => {
            const color = getColorByStatus(record.status);
            return (
              <div
                style={{
                  width: 93,
                  backgroundColor: color + "10",
                  color: color,
                  borderRadius: 42,
                  textAlign: "center",
                  paddingTop: 5,
                  paddingBottom: 5,
                  textTransform: "capitalize",
                }}
              >
                {record.status}
              </div>
            );
          }}
          label="Status"
        />
        <ImageField
          source="imageUrl"
          label="Pictures"
          src="src"
          title="title"
          className="small__img"
        />
      </Datagrid>
    </List>
  );
};

export default LabCategoryList;
