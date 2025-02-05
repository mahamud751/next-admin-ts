import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { MouseEvent } from "react";
import {
  Datagrid,
  FunctionField,
  Link,
  Pagination,
  RaRecord as Record,
  ReferenceManyField,
  TextField,
} from "react-admin";

const ReferralHistory = () => (
  <ReferenceManyField
    label="Referrals"
    reference="v1/users"
    target="_r_uid"
    pagination={<Pagination />}
    sort={{ field: "u_id", order: "DESC" }}
  >
    <Datagrid>
      <FunctionField
        label="User ID"
        onClick={(e: MouseEvent) => e.stopPropagation()}
        render={(record: Record) => (
          <Link to={`/v1/users/${record.u_id}`}>{record.u_id}</Link>
        )}
      />
      <TextField source="u_mobile" label="Mobile" />
      <TextField source="u_name" label="Name" />
      <FunctionField label="Joined" render={() => <CheckIcon />} />
      <FunctionField
        label="Order Placed"
        render={({ u_o_count }: Record) =>
          u_o_count ? <CheckIcon /> : <CloseIcon />
        }
      />
      <FunctionField
        label="Order Delivered"
        render={({ u_d_count }: Record) =>
          u_d_count ? <CheckIcon /> : <CloseIcon />
        }
      />
      <FunctionField
        label="Payment"
        render={({ u_o_count, u_d_count }: Record) =>
          !!u_o_count && !!u_d_count ? "Paid" : "Unpaid"
        }
      />
    </Datagrid>
  </ReferenceManyField>
);

export default ReferralHistory;
