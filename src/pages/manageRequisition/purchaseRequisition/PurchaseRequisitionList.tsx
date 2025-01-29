import { DateTime } from "luxon";
import pluralize from "pluralize";
import { FC, useState } from "react";
import {
  Confirm,
  FileField,
  FunctionField,
  List,
  ListProps,
  NumberField,
  RaRecord,
  ReferenceField,
  TextField,
} from "react-admin";
import { Box, Button } from "@mui/material";

import { CustomizableDatagrid } from "@/lib";
import {
  useDocumentTitle,
  useExport,
  useGetCurrentUser,
  useRequest,
} from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import {
  capitalizeFirstLetterOfEachWord,
  getColorByStatus,
} from "@/utils/helpers";
import AroggaDateField from "@/components/common/AroggaDateField";

const PurchaseRequisitionList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Purchase Requisition List");

  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const currentUser = useGetCurrentUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [purchaseRequisitionId, setPurchaseRequisitionId] = useState(null);
  const [action, setAction] = useState("");

  const { isLoading, refetch } = useRequest(
    `/v1/purchaseRequisitionAction/${purchaseRequisitionId}/statusAction`,
    {
      method: "POST",
      body: {
        pr_status: action,
      },
    },
    {
      isRefresh: true,
      onSuccess: () => setIsDialogOpen(false),
    }
  );

  const confirmTitleAction =
    action === "department_approved" ? "approve" : "reject";

  return (
    <>
      <List
        {...rest}
        title="List of Purchase Requisition"
        // filters={<PurchaseRequisitionFilter children={""} />}
        perPage={25}
        sort={{ field: "id", order: "DESC" }}
        exporter={exporter}
        // bulkActionButtons={false}
      >
        <CustomizableDatagrid
          rowClick="edit"
          hasBulkActions={false}
          hideableColumns={["pr_created_at"]}
        >
          <TextField source="id" label={"ID"} />
          <FileField
            source="attachedFiles_pr_attachment"
            src="src"
            title="Attached Files"
            target="_blank"
            label="Attached Files"
            // @ts-ignore
            onClick={(e) => e.stopPropagation()}
          />
          <TextField
            source="pr_name"
            label="Item Name"
            className={classes.capitalize}
          />
          <NumberField source="pr_quantity" label="Quantity" />

          <TextField
            source="pr_unit"
            label="Unit"
            className={classes.capitalize}
          />
          <FunctionField
            label="Department"
            render={({ pr_department }: RaRecord) =>
              capitalizeFirstLetterOfEachWord(pr_department)
            }
          />
          <NumberField source="pr_quotation_count" label="Quotation Count" />
          <FunctionField
            label="Purchase Status"
            sortBy="pr_status"
            render={(record) => {
              const color = getColorByStatus(record.pr_status);
              const text = capitalizeFirstLetterOfEachWord(record.pr_status);

              return (
                <span
                  className={`${classes.statusBtn} ${classes.whitespaceNowrap}`}
                  style={{
                    color: color,
                    backgroundColor: color + "10",
                  }}
                >
                  {text}
                </span>
              );
            }}
          />
          <FunctionField
            label="Time Difference"
            render={({
              pr_status,
              pr_created_at,
              pr_modified_at,
            }: RaRecord) => {
              const time =
                pr_status === "purchase_completed"
                  ? DateTime.fromSQL(pr_modified_at)
                  : DateTime.local();
              const diff = time
                .diff(
                  DateTime.fromSQL(
                    pr_status === "purchase_completed"
                      ? pr_created_at
                      : pr_modified_at
                  ),
                  ["days", "hours", "minutes"]
                )
                .toObject();

              return (
                <span
                  className={`${
                    pr_status === "purchase_completed"
                      ? classes.textOrange
                      : classes.textRed
                  } ${classes.whitespaceNowrap}`}
                >
                  {!!diff.days &&
                    `${diff.days} ${pluralize("day", diff.days)} `}
                  {!!diff.hours &&
                    `${diff.hours} ${pluralize("hour", diff.hours)} `}
                  {!!Math.floor(diff.minutes) &&
                    `${Math.floor(diff.minutes)}min`}
                </span>
              );
            }}
          />
          <ReferenceField
            source="pr_created_by"
            label="Created By"
            reference="v1/users"
            sortBy="pr_created_by"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <AroggaDateField source="pr_created_at" label="Created At" />
          <FunctionField
            label="Action"
            onClick={(e) => e.stopPropagation()}
            render={({ id, pr_status, pr_created_by }: RaRecord) => {
              if (
                pr_status === "pending" &&
                pr_created_by !== currentUser?.u_id
              ) {
                return (
                  <Box display="flex">
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setPurchaseRequisitionId(id);
                        setAction("department_approved");
                        setIsDialogOpen(true);
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setPurchaseRequisitionId(id);
                        setAction("rejected");
                        setIsDialogOpen(true);
                      }}
                      className={classes.bgRed}
                    >
                      Reject
                    </Button>
                  </Box>
                );
              } else {
                return;
              }
            }}
          />
        </CustomizableDatagrid>
      </List>
      <Confirm
        isOpen={isDialogOpen}
        loading={isLoading}
        title={`Are you sure you want to ${confirmTitleAction} this purchase Requisition #${purchaseRequisitionId}?`}
        content={false}
        onConfirm={refetch}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default PurchaseRequisitionList;
