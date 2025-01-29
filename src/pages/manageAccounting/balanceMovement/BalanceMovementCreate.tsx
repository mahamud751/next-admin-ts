import { FC } from "react";
import {
  AutocompleteInput,
  Create,
  CreateProps,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

import { useDocumentTitle, useGetCurrentUser } from "@/hooks";
import AroggaMovableImageInput from "@/components/common/AroggaMovableImageInput";

const validateRequired = [required()];

const BalanceMovementCreate: FC<CreateProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Balance Movement Create");

  const currentUser = useGetCurrentUser();

  return (
    <Create {...rest}>
      <SimpleForm>
        <TextInput
          source="abm_narration"
          label="Narration"
          variant="outlined"
          helperText={false}
          validate={validateRequired}
        />
        <ReferenceInput
          source="abm_from_head_id"
          label="Account From"
          reference="v1/accountingHead"
          variant="outlined"
          helperText={false}
          filter={{
            _head_user_id: currentUser.u_id,
          }}
        >
          <AutocompleteInput
            optionValue="ah_id"
            optionText={(record) =>
              `${record?.ah_name} (${record?.ah_current_balance}tk)`
            }
          />
        </ReferenceInput>
        <ReferenceInput
          source="abm_to_head_id"
          label="Account To"
          reference="v1/accountingHead"
          variant="outlined"
          helperText={false}
        >
          <AutocompleteInput optionValue="ah_id" optionText="ah_name" />
        </ReferenceInput>

        <TextInput
          source="abm_amount"
          label="Amount"
          variant="outlined"
          helperText={false}
          validate={validateRequired}
        />

        <AroggaMovableImageInput
          source="attachedFiles_abm_attachments"
          dimentionValidation
        />
      </SimpleForm>
    </Create>
  );
};

export default BalanceMovementCreate;
