import AcUnitIcon from "@mui/icons-material/AcUnit";
import { FC, useState } from "react";
import {
  Button,
  Confirm,
  Datagrid,
  FunctionField,
  Link,
  RaRecord as Record,
  ReferenceField,
  TextField,
  TextInput,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import QCDialog from "./QCDialog";
import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import AroggaDateField from "@/components/common/AroggaDateField";

type ShipmentDatagridProps = {
  beforeInBag?: number;
  [key: string]: any;
};

const ShipmentDatagrid: FC<ShipmentDatagridProps> = ({
  beforeInBag,
  ...rest
}) => {
  const classes = useAroggaStyles();
  const { setValue } = useFormContext();
  const { values } = useWatch();

  const [isQCDialogOpen, setIsQCDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [shipmentId, setShipmentId] = useState("");
  const [shipmentIdWithSequence, setShipmentIdWithSequence] = useState("");

  const { isLoading, refetch } = useRequest(
    `/v1/shipmentAction/${shipmentId}/shipmentCancelRequestApprovalAction`,
    {
      method: "POST",
      body: {
        s_cancel_requested_approval_status: "approved",
        s_cancel_request_reason: values.s_cancel_request_reason,
      },
    },
    {
      isRefresh: true,
      onSuccess: () => handleDialogClose(),
    }
  );

  const handleDialogClose = () => {
    values.cancelReason = undefined;
    values.s_cancel_request_reason = undefined;
    setIsCancelDialogOpen(false);
  };

  return (
    <>
      <Datagrid {...rest}>
        <FunctionField
          label="Shipment ID"
          onClick={(e) => e.stopPropagation()}
          sortBy="s_id"
          render={({ s_id, s_order_id, s_sequence }: Record) => (
            <Link to={`/v1/shipment/${s_id}/show`}>
              {s_order_id}
              {s_sequence}
            </Link>
          )}
        />
        <FunctionField
          label="Order ID"
          onClick={(e) => e.stopPropagation()}
          sortBy="s_order_id"
          render={({ s_order_id }: Record) => (
            <Link to={`/v1/productOrder/${s_order_id}/show`}>{s_order_id}</Link>
          )}
        />
        <TextField
          source="s_type"
          label="Type"
          className={classes.capitalize}
        />
        <TextField
          source="s_status"
          label="Status"
          className={classes.capitalize}
        />
        <FunctionField
          label="Cold"
          sortBy="s_m_cold"
          render={(record: Record) => {
            if (!record.s_m_cold) return;
            return <AcUnitIcon />;
          }}
        />
        <TextField source="s_internal_notes" label="Internal Note" />
        <AroggaDateField
          source="s_cancel_requested_at"
          label="Cancel Requested At"
          addLabel={false}
        />
        <TextField
          source="s_cancel_request_reason"
          label="Cancel Request Reason"
        />
        <ReferenceField
          source="s_re_scheduled_shift_schedule_id"
          label="Re Shift Schedule"
          reference="v1/shiftSchedule"
          link="show"
        >
          <FunctionField
            render={({ s_title, ss_date }: Record) => `${s_title} (${ss_date})`}
          />
        </ReferenceField>
        <AroggaDateField
          source="s_re_scheduled_at"
          label="Re Scheduled At"
          addLabel={false}
        />
        <TextField source="s_re_scheduled_reason" label="Re Scheduled Reason" />
        <FunctionField
          label="Action"
          render={({
            s_id,
            s_order_id,
            s_sequence,
            s_type,
            s_status,
            s_qc_at,
            s_qc_by,
          }: Record) => {
            if (
              beforeInBag === 2 &&
              (s_type === "issue" || (s_status === "cancelled" && !s_qc_by))
            ) {
              return (
                <Button
                  label="QC"
                  variant="contained"
                  onClick={() => {
                    setShipmentId(s_id);
                    setIsQCDialogOpen(true);
                  }}
                />
              );
            }
            if (
              beforeInBag === 2 &&
              ["in_bag", "delivering"].includes(s_status)
            ) {
              return (
                <Button
                  label="Cancel"
                  variant="contained"
                  className={classes.bgRed}
                  onClick={() => {
                    setShipmentId(s_id);
                    setShipmentIdWithSequence(s_order_id + s_sequence);
                    setIsCancelDialogOpen(true);
                  }}
                />
              );
            }

            if (
              s_qc_at !== "0000-00-00 00:00:00" ||
              (!beforeInBag &&
                s_qc_at === "0000-00-00 00:00:00" &&
                s_status === "sorted")
            )
              return;

            return (
              <Button
                label="QC"
                variant="contained"
                onClick={() => {
                  setShipmentId(s_id);
                  setIsQCDialogOpen(true);
                }}
              />
            );
          }}
        />
      </Datagrid>
      {shipmentId && (
        <QCDialog
          isQCDialogOpen={isQCDialogOpen}
          setIsQCDialogOpen={setIsQCDialogOpen}
          shipmentId={shipmentId}
          beforeInBag={beforeInBag}
        />
      )}
      <Confirm
        title={`Are you sure you want to cancel this shipment? #${shipmentIdWithSequence}`}
        content={
          <>
            <TaxonomiesByVocabularyInput
              fetchKey="order_cancel_reasons"
              source="cancelReason"
              label="Cancel Reason"
              helperText={false}
              onChange={(e) => {
                if (e.target.value === "Other") {
                  setValue("s_cancel_request_reason", "");
                } else {
                  setValue("s_cancel_request_reason", e.target.value);
                }
              }}
              title
              fullWidth
            />
            {values.cancelReason === "other" && (
              <TextInput
                source="s_cancel_request_reason"
                label="Note (Visible to Customer)"
                variant="outlined"
                helperText={false}
                minRows={2}
                multiline
                fullWidth
              />
            )}
          </>
        }
        isOpen={isCancelDialogOpen}
        loading={isLoading}
        onConfirm={refetch}
        onClose={handleDialogClose}
      />
    </>
  );
};

export default ShipmentDatagrid;
