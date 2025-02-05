import { FC, useEffect, useState } from "react";
import {
  Button,
  Datagrid,
  FunctionField,
  List,
  ListProps,
  NumberField,
  RaRecord as Record,
  TextField,
  usePermissions,
} from "react-admin";

import {
  useDocumentTitle,
  useExport,
  useNavigateFromList,
  useRequest,
} from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDateField from "@/components/common/AroggaDateField";

const DailyReportList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Daily Report List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const navigateFromList = useNavigateFromList(
    "dailyReportView",
    "dailyReportEdit"
  );

  const [id, setId] = useState();

  const { refetch } = useRequest(
    `/v1/daily-report/balanceApprove/${id}`,
    {
      method: "POST",
    },
    {
      isRefresh: true,
      successNotify: "Successfully Approved",
    }
  );

  useEffect(() => {
    if (id) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <List
      {...rest}
      title="List of Daily Report"
      perPage={25}
      exporter={exporter}
    >
      <Datagrid
        rowClick={navigateFromList}
        bulkActionButtons={permissions?.includes("dailyReportDelete")}
      >
        <TextField source="b_id" label="ID" sortable={false} />
        <AroggaDateField source="b_date" label="Date" sortable={false} />
        <NumberField
          source="b_collection"
          label="Collection"
          sortable={false}
        />
        <NumberField
          source="b_collections_deposited"
          label="Total Collection Deposit To Bank"
          sortable={false}
        />
        <TextField source="b_purchase" label="Purchase" sortable={false} />
        <NumberField source="b_expense" label="Expense" sortable={false} />
        <NumberField source="b_received" label="Received" sortable={false} />
        <NumberField source="b_balance" label="Cash In Hand" sortable={false} />
        <NumberField
          source="b_l_balance"
          label="Ledger Balance"
          sortable={false}
        />
        <NumberField
          source="b_l_b_approved"
          label="Ledger Balance When Approved"
          sortable={false}
        />
        <TextField source="b_redx_qty" label="Redx Qty" />
        <FunctionField
          label="Status"
          sortBy="b_status"
          sortable={false}
          className={classes.capitalize}
          render={(record: Record) => {
            if (
              record.b_status === "pending" &&
              permissions?.includes("dailyReportApprove")
            )
              return (
                <Button
                  label="Approve"
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    setId(record.b_id);
                  }}
                />
              );

            return record.b_status;
          }}
        />
      </Datagrid>
    </List>
  );
};

export default DailyReportList;
