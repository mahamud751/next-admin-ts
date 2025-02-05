import { FC, useState } from "react";
import {
  Button,
  Confirm,
  FileField,
  FunctionField,
  List,
  ListProps,
  RaRecord as Record,
  ReferenceField,
  TextField,
  usePermissions,
} from "react-admin";

import AroggaDateField from "@/components/common/AroggaDateField";
import {
  useDocumentTitle,
  useExport,
  useNavigateFromList,
  useRequest,
} from "@/hooks";
import { CustomizableDatagrid } from "@/lib";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import CircularFilter from "./CircularFilter";

const CircularList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Circular List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const navigateFromList = useNavigateFromList("circularView", "circularEdit");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCircularId, setSelectedCircularId] = useState("");
  const [status, setStatus] = useState("");

  const { isLoading, refetch } = useRequest(
    `/v1/circular/${selectedCircularId}`,
    {
      method: "POST",
      body: {
        c_status: status,
      },
    },
    {
      isRefresh: true,
      onSuccess: () => setIsDialogOpen(false),
    }
  );

  return (
    <>
      <List
        {...rest}
        title="List of Circular"
        perPage={25}
        exporter={exporter}
        filters={<CircularFilter children={""} />}
        sort={{ field: "c_id", order: "DESC" }}
      >
        <CustomizableDatagrid
          rowClick={navigateFromList}
          hideableColumns={["c_created_by", "c_modified_at", "c_modified_by"]}
          bulkActionButtons={permissions?.includes("circularDelete")}
        >
          <TextField source="c_id" label="ID" />
          <TextField source="c_title" label="Title" />
          <AroggaDateField source="c_created_at" label="Uploaded Date" />
          <AroggaDateField source="c_created_at" label="Created Date" />
          <ReferenceField
            source="c_created_by"
            label="Created By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <AroggaDateField source="c_modified_at" label="Modified Date" />
          <ReferenceField
            source="c_modified_by"
            label="Modified By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <FileField
            source="attachedFiles_c_attachment"
            label="Document"
            src="src"
            title="title"
            target="_blank"
            // @ts-ignore
            onClick={(e) => e.stopPropagation()}
          />
          <FunctionField
            label="Action"
            onClick={(e) => e.stopPropagation()}
            render={({ c_id, c_status }: Record) => (
              <Button
                label={c_status === "published" ? "Unpublish" : "Publish"}
                variant="contained"
                onClick={() => {
                  setSelectedCircularId(c_id);
                  setStatus(
                    c_status === "published" ? "unpublished" : "published"
                  );
                  setIsDialogOpen(true);
                }}
              />
            )}
          />
        </CustomizableDatagrid>
      </List>
      <Confirm
        title={`Confirmation #${selectedCircularId}`}
        content={`Are you sure you want to ${
          status === "published" ? "publish" : "unpublish"
        } this circular?`}
        isOpen={isDialogOpen}
        loading={isLoading}
        onConfirm={refetch}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default CircularList;
