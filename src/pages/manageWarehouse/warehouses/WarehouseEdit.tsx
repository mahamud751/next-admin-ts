import { FC } from "react";
import {
  AutocompleteInput,
  Edit,
  EditProps,
  ReferenceInput,
  SimpleForm,
  TextInput,
  minLength,
  required,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import LocationInput from "@/components/common/LocationInput";
import SaveDeleteToolbar from "@/components/common/SaveDeleteToolbar";

const WarehouseEdit: FC<EditProps> = (props) => {
  useDocumentTitle("Arogga | Warehouse Edit");

  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...props}
    >
      <SimpleForm toolbar={<SaveDeleteToolbar isSave />}>
        <TextInput
          source="w_id"
          label="ID"
          variant="outlined"
          helperText={false}
          readOnly
        />
        <TextInput
          source="w_title"
          label="Title"
          variant="outlined"
          helperText={false}
          validate={[
            required(),
            minLength(3, "Title must be at least 3 characters long"),
          ]}
        />
        <ReferenceInput
          source="w_cash_head_id"
          label="Cash Head"
          variant="outlined"
          helperText={false}
          reference="v1/accountingHead"
          // validate={[required()]}
        >
          <AutocompleteInput optionValue="ah_id" optionText="ah_name" />
        </ReferenceInput>
        <ReferenceInput
          source="w_collector_cash_head_id"
          label="Collector's Cash Head"
          variant="outlined"
          helperText={false}
          reference="v1/accountingHead"
          // validate={[required()]}
        >
          <AutocompleteInput optionValue="ah_id" optionText="ah_name" />
        </ReferenceInput>
        <ReferenceInput
          source="w_bank_head_id"
          label="Bank Head"
          variant="outlined"
          helperText={false}
          reference="v1/accountingHead"
          // validate={[required()]}
        >
          <AutocompleteInput optionValue="ah_id" optionText="ah_name" />
        </ReferenceInput>
        <ReferenceInput
          source="w_payable_head_id"
          label="Payable Head"
          variant="outlined"
          helperText={false}
          reference="v1/accountingHead"
          // validate={[required()]}
        >
          <AutocompleteInput optionValue="ah_id" optionText="ah_name" />
        </ReferenceInput>
        <ReferenceInput
          source="w_receivable_head_id"
          label="Receivable Head"
          variant="outlined"
          helperText={false}
          reference="v1/accountingHead"
          // validate={[required()]}
        >
          <AutocompleteInput optionValue="ah_id" optionText="ah_name" />
        </ReferenceInput>
        <ReferenceInput
          source="w_stock_head_id"
          label="Stock Head"
          variant="outlined"
          helperText={false}
          reference="v1/accountingHead"
          // validate={[required()]}
        >
          <AutocompleteInput optionValue="ah_id" optionText="ah_name" />
        </ReferenceInput>
        <ReferenceInput
          source="w_stock_receivable_head_id"
          label="Stock Receivable Head"
          variant="outlined"
          helperText={false}
          reference="v1/accountingHead"
          // validate={[required()]}
        >
          <AutocompleteInput optionValue="ah_id" optionText="ah_name" />
        </ReferenceInput>
        <TextInput
          source="w_lat"
          label="Latitude"
          variant="outlined"
          helperText={false}
        />
        <TextInput
          source="w_lon"
          label="Longitude"
          variant="outlined"
          helperText={false}
        />
        <LocationInput
          source="w_l_id"
          variant="outlined"
          helperText={false}
          // validate={[required()]}
        />
        <TextInput
          source="w_address"
          label="Address"
          variant="outlined"
          helperText={false}
          minRows={2}
          multiline
        />
      </SimpleForm>
    </Edit>
  );
};

export default WarehouseEdit;
