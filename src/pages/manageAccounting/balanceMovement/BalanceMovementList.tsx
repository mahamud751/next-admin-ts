import { Box, Button } from "@mui/material";
import { FC, useState } from "react";
import {
  Confirm,
  FunctionField,
  ImageField,
  Link,
  List,
  ListProps,
  ReferenceField,
  TextField,
} from "react-admin";

import { useDocumentTitle, useExport, useRequest } from "@/hooks";
import {
  capitalizeFirstLetterOfEachWord,
  getColorByStatus,
} from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import { CustomizableDatagrid } from "@/lib";
import AroggaDateField from "@/components/common/AroggaDateField";

const BalanceMovementList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Balance Movement List");

  const classes = useAroggaStyles();
  const exporter = useExport(rest);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [balanceMovementId, setBalanceMovementId] = useState(null);
  const [action, setAction] = useState("");

  const { isLoading, refetch } = useRequest(
    `/v1/accountingBalanceMovementAction/${balanceMovementId}/${action}`,
    {
      method: "POST",
    },
    {
      isRefresh: true,
      onSuccess: () => setIsDialogOpen(false),
    }
  );

  const confirmTitleAction = action === "ApproveAction" ? "approve" : "reject";

  return (
    <>
      <List
        {...rest}
        title="List of Balance Movement"
        perPage={25}
        sort={{ field: "id", order: "DESC" }}
        exporter={exporter}
      >
        <CustomizableDatagrid
          hasBulkActions={false}
          hideableColumns={["abm_created_at"]}
          bulkActionButtons={false}
        >
          <TextField source="id" label="BM ID" />
          <FunctionField
            source="atd_transaction_id"
            label="Transaction ID"
            render={({ atd_transaction_id }) => (
              <Link to={`/v1/accountingTransaction/${atd_transaction_id}`}>
                {atd_transaction_id}
              </Link>
            )}
          />
          <ImageField
            source="attachedFiles_abm_attachments"
            label="Attached Files"
            src="src"
            title="title"
            className="small__img"
          />
          <ReferenceField
            source="abm_to_head_id"
            label="Accounting To"
            reference="v1/accountingHead"
            link="show"
          >
            <TextField source="ah_name" />
          </ReferenceField>
          <ReferenceField
            source="abm_from_head_id"
            label="Accounting From"
            reference="v1/accountingHead"
            link="show"
          >
            <TextField source="ah_name" />
          </ReferenceField>
          <TextField source="abm_amount" label="Amount" />
          <TextField source="abm_narration" label="Narration" />
          <FunctionField
            label="Status"
            sortBy="abm_status"
            render={(record) => {
              const color = getColorByStatus(record.abm_status);
              const text = capitalizeFirstLetterOfEachWord(record.abm_status);

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
          <ReferenceField
            source="abm_created_by"
            label="Created By"
            reference="v1/users"
            sortBy="abm_created_by"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <AroggaDateField source="abm_created_at" label="Created At" />
          <FunctionField
            label="Action"
            onClick={(e) => e.stopPropagation()}
            render={({ id, abm_status }) => {
              if (abm_status === "pending") {
                return (
                  <Box display="flex">
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setBalanceMovementId(id);
                        setAction("ApproveAction");
                        setIsDialogOpen(true);
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setBalanceMovementId(id);
                        setAction("rejectAction");
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
        title={`Are you sure you want to ${confirmTitleAction} this balance movement #${balanceMovementId}?`}
        content={false}
        onConfirm={refetch}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default BalanceMovementList;
