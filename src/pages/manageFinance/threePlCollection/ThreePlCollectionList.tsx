import { FC, useState } from "react";
import {
  Button,
  Confirm,
  Datagrid,
  FunctionField,
  List,
  ListProps,
  NumberField,
  RaRecord as Record,
  ReferenceField,
  TextField,
  usePermissions,
  useRedirect,
  useRefresh,
} from "react-admin";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle, useExport, useRequest } from "@/hooks";
import { getFormattedDateString } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import ThreePlCollectionFilter from "./ThreePlCollectionFilter";
import { CircularProgress } from "@mui/material";

const ThreePlCollectionList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | 3PL Collection Confirm");

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const redirect = useRedirect();
  const { permissions } = usePermissions();
  const navigate = useNavigate();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const refresh = useRefresh();

  const onDialogClose = () => {
    setShowConfirmDialog(false);
    setShowCancelDialog(false);
  };

  const { isLoading, refetch } = useRequest(
    showConfirmDialog
      ? `/v1/approveThirdPartyCollection/${selectedCollection}`
      : `/v1/cancelThirdPartyCollection/${selectedCollection}`,
    {
      method: "POST",
      body: {},
    },
    {
      onSuccess: () => {
        onDialogClose();
        refresh();
      },
    }
  );

  const Loader = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "4px 0",
      }}
    >
      {" "}
      <CircularProgress />
      <p>Loading</p>
    </div>
  );

  return (
    <>
      <List
        title="List of 3PL Collection"
        filters={<ThreePlCollectionFilter children={""} />}
        perPage={25}
        sort={{ field: "tc_id", order: "DESC" }}
        exporter={exporter}
        {...rest}
      >
        <Datagrid bulkActionButtons={false}>
          <TextField source="id" label={"ID"} />
          <TextField label="Ref ID" source="tc_reference" />
          <TextField source="tc_source" label="Courier" />

          <NumberField
            source="tc_total_order_amount"
            label="Arogga Invoice Amount"
          />
          <NumberField source="tc_amount" label="Courier Invoice Amount" />
          <FunctionField
            label="Settlement Status"
            render={(record: Record) => (
              <>
                {record?.tc_status === "confirmed" &&
                  record?.tc_settlement_status === "partially_settled" && (
                    <span>Partially Settled</span>
                  )}
                {record?.tc_status === "confirmed" &&
                  record?.tc_settlement_status === "settled" && (
                    <span>Settled</span>
                  )}
              </>
            )}
          />

          <FunctionField
            label="Updated At"
            render={(record: Record) => (
              <span>{getFormattedDateString(record?.tc_modified_at)}</span>
            )}
          />

          <ReferenceField
            source="tc_modified_by"
            label="Updated By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>

          <ReferenceField
            source="tc_created_by"
            label="Created By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <ReferenceField
            source="tc_confirmed_by"
            label="Approved By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>

          <FunctionField
            label="Details"
            render={(record: Record) => (
              <Button
                label="view"
                color="primary"
                variant="outlined"
                className={classes.whitespaceNowrap}
                onClick={() => {
                  navigate(`/tplCollection/${record?.id}`);
                }}
              />
            )}
          />

          <FunctionField
            label="Status"
            sortBy="tc_status"
            render={({ tc_status }: Record) => (
              <span
                className={`${classes.capitalize} ${
                  (tc_status === "pending" && classes.textBlack) ||
                  (tc_status === "confirmed" && classes.textGreen) ||
                  (tc_status === "cancelled" && classes.textRed)
                }`}
              >
                {tc_status}
              </span>
            )}
          />

          {permissions?.includes("approve3PLCollection") && (
            <FunctionField
              label="Action"
              render={(record: Record) => {
                return (
                  record?.tc_status === "pending" && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Button
                        label="Approve"
                        variant="contained"
                        className={classes.whitespaceNowrap}
                        onClick={() => {
                          setSelectedCollection(record?.id);
                          setShowConfirmDialog(true);
                        }}
                        size="small"
                      />
                      <Button
                        label="Reject"
                        variant="contained"
                        color="secondary"
                        className={classes.whitespaceNowrap}
                        size="small"
                        onClick={() => {
                          setSelectedCollection(record?.id);
                          setShowCancelDialog(true);
                        }}
                        style={{
                          backgroundColor: "#E57373",
                        }}
                      />
                    </div>
                  )
                );
              }}
            />
          )}
        </Datagrid>
      </List>

      {(showConfirmDialog || showCancelDialog) && (
        <Confirm
          isOpen={showConfirmDialog || showCancelDialog}
          loading={isLoading}
          title={`Are you sure you want to ${
            showConfirmDialog ? "confirm" : "cancel"
          } the collection?`}
          content={isLoading ? <Loader /> : null}
          onConfirm={refetch}
          onClose={() => {
            setSelectedCollection(null);
            setShowConfirmDialog(false);
            setShowCancelDialog(false);
          }}
        />
      )}
    </>
  );
};
export default ThreePlCollectionList;
