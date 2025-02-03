import { FC, useState } from "react";
import {
  Button,
  Confirm,
  FileField,
  FunctionField,
  RaRecord,
  ReferenceField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
  usePermissions,
} from "react-admin";

import { useDocumentTitle, useRequest } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";

const PharmacyShow: FC<ShowProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Pharmacy Show");

  const classes = useAroggaStyles();
  const { permissions } = usePermissions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pharmacyId, setPharmacyId] = useState("");
  const [pharmacyApprovalStatus, setPharmacyApprovalStatus] = useState("");

  const { isLoading, refetch } = useRequest(
    "/v1/b2b/updateApprovalStatus",
    {
      method: "POST",
      body: {
        p_id: pharmacyId,
        p_status: pharmacyApprovalStatus,
      },
    },
    {
      successNotify: `Successfully pharmacy ${pharmacyApprovalStatus}!`,
      isRefresh: true,
      onSuccess: () => setIsDialogOpen(false),
    }
  );

  return (
    <Show {...rest}>
      <SimpleShowLayout>
        <TextField source="p_id" label="ID" />
        <TextField source="p_name" label="Name" />
        <ReferenceField
          source="p_user_id"
          label="User"
          reference="v1/users"
          link="show"
        >
          <TextField source="u_name" />
        </ReferenceField>
        <ReferenceField
          source="p_user_id"
          label="User Mobile"
          reference="v1/users"
        >
          <TextField source="u_mobile" />
        </ReferenceField>
        <TextField source="p_drug_license_no" label="Drug License No" />
        <FileField
          source="attachedFiles_p_drug_license_file"
          src="src"
          title="Drug License Files"
          target="_blank"
          label="Drug License Files"
          // @ts-ignore
          onClick={(e) => e.stopPropagation()}
        />
        <TextField source="p_trade_license_no" label="Trade License No" />
        <FileField
          source="attachedFiles_p_trade_license_file"
          src="src"
          title="Trade License Files"
          target="_blank"
          label="Trade License Files"
          // @ts-ignore
          onClick={(e) => e.stopPropagation()}
        />
        <ReferenceField
          source="p_location_id"
          label="Location"
          reference="v1/location"
          link="show"
        >
          <FunctionField
            render={(record) => {
              if (!record) return "";
              return `${record.l_division} -> ${record.l_district} -> ${record.l_area}`;
            }}
          />
        </ReferenceField>
        <TextField source="p_address" label="Address" />
        <FunctionField
          label="Status"
          sortBy="p_status"
          render={(record: RaRecord) => (
            <span
              className={`${classes.capitalize} ${
                record.p_status === "pending" && classes.textRed
              }`}
            >
              {record?.p_status}
            </span>
          )}
        />
        {permissions?.includes("pharmacyApproval") && (
          <FunctionField
            render={({ p_id, p_status }: RaRecord) => (
              <>
                {p_status !== "approved" && (
                  <Button
                    label="Approve"
                    variant="outlined"
                    style={{
                      color: "white",
                      backgroundColor: "#008069",
                      marginRight: "5px",
                      border: "1px solid white",
                    }}
                    onClick={() => {
                      setPharmacyId(p_id);
                      setPharmacyApprovalStatus("approved");
                      setIsDialogOpen(true);
                    }}
                  />
                )}
                {p_status !== "rejected" && (
                  <Button
                    label="Reject"
                    variant="outlined"
                    style={{
                      color: "white",
                      backgroundColor: "#dc3545",
                      border: "1px solid white",
                    }}
                    onClick={() => {
                      setPharmacyId(p_id);
                      setPharmacyApprovalStatus("rejected");
                      setIsDialogOpen(true);
                    }}
                  />
                )}
                {p_status === "approved" && (
                  <Button
                    label="Block"
                    variant="outlined"
                    style={{
                      color: "white",
                      backgroundColor: "#dc3545",
                      border: "1px solid white",
                    }}
                    onClick={() => {
                      setPharmacyId(p_id);
                      setPharmacyApprovalStatus("blocked");
                      setIsDialogOpen(true);
                    }}
                  />
                )}
              </>
            )}
          />
        )}
        <Confirm
          title={`Pharmacy Approval #${rest.id}`}
          content={`Are you sure you want to ${
            pharmacyApprovalStatus?.split("ed")?.[0]
          } this pharmacy?`}
          isOpen={isDialogOpen}
          loading={isLoading}
          onConfirm={refetch}
          onClose={() => setIsDialogOpen(false)}
        />
      </SimpleShowLayout>
    </Show>
  );
};

export default PharmacyShow;
