import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useState } from "react";
import {
  FileField,
  FunctionField,
  IconButtonWithTooltip,
  NumberField,
  Record,
  ReferenceField,
  SimpleForm,
  TextField,
  useRefresh,
} from "react-admin";

import { CustomizableDatagrid } from "@/lib";
import { AroggaUploader } from "@/services/uploader";
import { capitalizeFirstLetterOfEachWord } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDateField from "@/components/common/AroggaDateField";

const PurchaseDatagrid = (props) => {
  const classes = useAroggaStyles();

  const UploadFile = ({ id }) => {
    const refresh = useRefresh();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
      <SimpleForm toolbar={false}>
        <IconButtonWithTooltip
          label="Upload File"
          children={<AttachFileIcon />}
          onClick={() => setIsDialogOpen(true)}
          style={{
            height: 30,
            width: 30,
          }}
        />
        <AroggaUploader
          source={`v3/productPurchase/attachedFileUpload/${id}`}
          open={isDialogOpen}
          accept="image/*, application/pdf"
          webCam={false}
          refresh={refresh}
          onClose={() => setIsDialogOpen(false)}
        />
      </SimpleForm>
    );
  };

  return (
    <CustomizableDatagrid
      {...props}
      rowClick={(id) => `/v1/productPurchase/${id}`}
      hideableColumns={[
        "pp_payment_term",
        "pp_note",
        "pp_created_at",
        "pp_created_by",
      ]}
    >
      <TextField source="pp_id" label="ID" />
      <TextField
        source="pp_vendor_type"
        label="Vendor Type"
        className={classes.capitalize}
      />
      <ReferenceField
        source="pp_product_company_id"
        label="Brand"
        reference="v1/productBrand"
        link="show"
      >
        <TextField source="pb_name" />
      </ReferenceField>
      <TextField source="pp_item_count" label="Total Item" />
      <NumberField source="pp_total_purchase_price" label="Total TP" />
      <NumberField source="pp_total_vat" label="Total Vat" />
      <NumberField source="pp_total_discount" label="Total Discount" />
      <NumberField source="pp_tds" label="TDS" />
      <NumberField source="pp_round" label="Round" />
      <NumberField source="pp_inv_price" label="Amount Payable" />
      <TextField
        source="pp_payment_method"
        label="Payment Method"
        className={classes.capitalize}
      />
      <FunctionField
        source="pp_payment_term"
        label="Payment Term"
        render={(record: Record) =>
          capitalizeFirstLetterOfEachWord(record?.pp_payment_term)
        }
      />
      <ReferenceField
        source="pp_payment_head_id"
        label="Payment Head"
        reference="v1/accountingHead"
        link="show"
      >
        <TextField source="ah_name" />
      </ReferenceField>
      <TextField source="pp_note" label="Note" />
      <FunctionField
        source="pp_status"
        label="Status"
        render={(record: Record) => (
          <span
            className={`${classes.capitalize} ${
              record.pp_status === "pending" && classes.textRed
            }`}
          >
            {record?.pp_status}
          </span>
        )}
      />
      <AroggaDateField source="pp_approved_at" label="Approved At" />
      <ReferenceField
        source="pp_approved_by"
        label="Approved By"
        reference="v1/users"
        link="show"
      >
        <TextField source="u_name" />
      </ReferenceField>
      <AroggaDateField source="pp_created_at" label="Created At" />
      <ReferenceField
        source="pp_created_by"
        label="Created By"
        reference="v1/users"
        sortBy="u_name"
        link="show"
      >
        <TextField source="u_name" />
      </ReferenceField>
      <FileField
        source="attachedFiles_pp_files"
        label="Related Files"
        src="src"
        title="title"
        target="_blank"
      />
      <FunctionField
        label="Upload"
        onClick={(e: { stopPropagation: () => void }) => e.stopPropagation()}
        render={({ id }) => <UploadFile id={id} />}
      />
    </CustomizableDatagrid>
  );
};

export default PurchaseDatagrid;
