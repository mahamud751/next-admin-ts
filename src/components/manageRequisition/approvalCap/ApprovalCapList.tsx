import { FC } from "react";
import {
  ChipField,
  FunctionField,
  List,
  ListProps,
  RaRecord,
  ReferenceArrayField,
  ReferenceField,
  SingleFieldList,
  TextField,
} from "react-admin";

// import AroggaDateField from "../../../components/AroggaDateField";
import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { capitalizeFirstLetterOfEachWord } from "@/utils/helpers";
import { CustomizableDatagrid } from "@/lib";

const ApprovalCapList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Approval Cap List");

  const exporter = useExport(rest);
  //   const navigateFromList = useNavigateFromList(
  //     "approvalCapView",
  //     "approvalCapEdit"
  //   );

  return (
    <>
      <List
        {...rest}
        title="List of Approval Cap"
        perPage={25}
        sort={{ field: "ac_id", order: "DESC" }}
        exporter={exporter}
        // bulkActionButtons={false}
      >
        <CustomizableDatagrid
          rowClick="edit"
          hideableColumns={["ac_created_at", "ac_created_by"]}
        >
          <TextField source="ac_id" label="ID" />
          <FunctionField
            source="ac_procurement_title"
            label="Procurement Title"
            render={({ ac_procurement_title }: RaRecord) =>
              capitalizeFirstLetterOfEachWord(ac_procurement_title)
            }
          />
          <TextField source="ac_approver_entity" label="Approver Entity" />
          <TextField
            source="ac_max_threshold_amount"
            label="Max Threshold Amount"
          />
          <FunctionField
            label="Approver"
            render={(record: any) => (
              <>
                {record.ac_approver_entity === "User" ? (
                  <>
                    <ReferenceArrayField
                      label="Approver"
                      reference="v1/users"
                      source="ac_approver_entity_ids"
                    >
                      <SingleFieldList>
                        <ChipField
                          source="u_name"
                          variant="outlined"
                          color="primary"
                        />
                      </SingleFieldList>
                    </ReferenceArrayField>
                  </>
                ) : (
                  <>
                    <ReferenceArrayField
                      label="Approver"
                      reference="v1/rank"
                      source="ac_approver_entity_ids"
                    >
                      <SingleFieldList>
                        <ChipField
                          source="r_title"
                          variant="outlined"
                          color="primary"
                        />
                      </SingleFieldList>
                    </ReferenceArrayField>
                  </>
                )}
              </>
            )}
          />
          <ReferenceArrayField
            label="Required Approver"
            reference="v1/users"
            source="ac_required_user_ids"
          >
            <SingleFieldList>
              <ChipField source="u_name" variant="outlined" color="primary" />
            </SingleFieldList>
          </ReferenceArrayField>
          {/* <AroggaDateField source="ac_created_at" label="Created At" /> */}
          <ReferenceField
            source="ac_created_by"
            label="Created By"
            reference="v1/users"
            sortBy="ac_created_by"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
        </CustomizableDatagrid>
      </List>
    </>
  );
};

export default ApprovalCapList;
