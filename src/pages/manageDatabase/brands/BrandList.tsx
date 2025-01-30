import { FC } from "react";
import {
  BooleanField,
  ImageField,
  List,
  ListProps,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import BrandFilter from "./BrandFilter";
import AroggaDateField from "@/components/common/AroggaDateField";

const BrandList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Brand List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const navigateFromList = useNavigateFromList(
    "productBrandView",
    "productBrandEdit"
  );

  return (
    <List
      {...rest}
      title="List of Brand"
      filters={<BrandFilter children={""} />}
      perPage={25}
      sort={{ field: "pb_id", order: "DESC" }}
      exporter={exporter}
      {...rest}
    >
      <CustomizableDatagrid
        rowClick={navigateFromList}
        hideableColumns={[
          "attachedFiles_pb_banner",
          "pb_created_at",
          "pb_created_by",
        ]}
        bulkActionButtons={permissions?.includes("productBrandDelete")}
      >
        <TextField source="pb_id" label="ID" />
        <TextField source="pb_name" label="Name" />
        <TextField source="pb_info" label="Information" />
        <ReferenceField
          source="pb_uid"
          label="User"
          reference="v1/users"
          sortBy="u_name"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
        <BooleanField
          source="pb_is_feature"
          label="Feature?"
          //   FalseIcon={() => null}
          looseValue
        />
        <ImageField
          source="attachedFiles_pb_logo"
          label="Logo"
          src="src"
          title="title"
          className="small__img"
        />
        <ImageField
          source="attachedFiles_pb_banner"
          label="Banner"
          src="src"
          title="title"
          className="small__img"
        />
        <AroggaDateField source="pb_created_at" label="Created At" />
        <ReferenceField
          source="pb_created_by"
          label="Created By"
          reference="v1/users"
          sortBy="u_name"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
      </CustomizableDatagrid>
    </List>
  );
};

export default BrandList;
