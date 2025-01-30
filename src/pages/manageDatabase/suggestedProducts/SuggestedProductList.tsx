import { FC } from "react";
import {
  ImageField,
  List,
  ListProps,
  ReferenceField,
  TextField,
} from "react-admin";

import "../../../assets/style.css";
import { useDocumentTitle, useExport } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import ExpandedSearch from "./ExpandedSearch";
import SuggestedProductFilter from "./SuggestedProductFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const SuggestedProductList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Suggested Product List");

  const exporter = useExport(rest);
  const classes = useAroggaStyles();

  return (
    <List
      {...rest}
      title="List of Suggested Product"
      perPage={25}
      sort={{ field: "sp_id", order: "DESC" }}
      exporter={exporter}
      filters={<SuggestedProductFilter children={""} />}
    >
      <CustomizableDatagrid
        expand={<ExpandedSearch />}
        hasBulkActions={false}
        isRowExpandable={(row) => row?.sp_product_id === 0}
        classes={{ expandedPanel: classes.expandedPanel }}
        bulkActionButtons={false}
      >
        <TextField source="sp_id" label="ID" />
        <AroggaDateField source="sp_created_at" label="Suggested Time" />
        <ReferenceField
          source="sp_created_by"
          label="Suggested By"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
        <TextField source="sp_name" label="Name" />
        <TextField source="sp_company_name" label="Company" />
        <TextField
          source="sp_status"
          label="Status"
          className={classes.capitalize}
        />
        <ImageField
          source="attachedFiles_sp_images"
          label="Attached Images"
          src="src"
          title="title"
          className="small__img"
        />
      </CustomizableDatagrid>
    </List>
  );
};

export default SuggestedProductList;
