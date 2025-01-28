import { FC } from "react";
import {
  ChipField,
  FunctionField,
  RaRecord,
  ReferenceArrayField,
  ReferenceField,
  Show,
  ShowProps,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
} from "react-admin";

// import AroggaDateField from "../../../components/AroggaDateField";

import { useDocumentTitle } from "@/hooks";
import { capitalizeFirstLetterOfEachWord } from "@/utils/helpers";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const ApprovalCapShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Approval Cap Show");

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <ColumnShowLayout md={6} simpleShowLayout={false}>
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
                      label="Required Approver"
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
            label="Required Users"
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
          {/* <AroggaDateField source="ac_modified_at" label="Modified At" /> */}
          <ReferenceField
            source="ac_modified_by"
            label="Modified By"
            reference="v1/users"
            sortBy="ac_modified_by"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
        </ColumnShowLayout>
      </SimpleShowLayout>
    </Show>
  );
};

export default ApprovalCapShow;
