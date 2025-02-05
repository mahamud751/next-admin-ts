import { Box } from "@mui/material";
import { FC } from "react";
import {
  Create,
  CreateProps,
  FormDataConsumer,
  SimpleForm,
  TextInput,
  email,
  maxLength,
  minLength,
  usePermissions,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { required } from "@/utils/helpers";
import UserRoleInput from "@/components/manageUser/users/UserRoleInput";
import UserStatusInput from "@/components/manageUser/users/UserStatusInput";
import FormatedBooleanInput from "@/components/common/FormatedBooleanInput";

const UserCreate: FC<CreateProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | User Create");
  const { permissions } = usePermissions();
  return (
    <Create {...rest}>
      <SimpleForm>
        <TextInput
          source="u_name"
          label="Name"
          variant="outlined"
          helperText={false}
          validate={[required()]}
        />
        <TextInput
          source="u_mobile"
          label="Mobile No"
          variant="outlined"
          helperText={false}
          defaultValue="+88"
        />
        <TextInput
          source="u_email"
          label="Email"
          variant="outlined"
          helperText={false}
          validate={email("Invalid email address")}
        />
        <Box>
          <TextInput
            source="u_referrer"
            label="Refer Code"
            variant="outlined"
            helperText={false}
            validate={[minLength(4), maxLength(20)]}
            fullWidth
          />
          <FormDataConsumer>
            {({ formData }) => {
              if (!formData.is_influencer || !formData.u_referrer) return null;
              return (
                <Box mb={3}>
                  {`https://www.arogga.com/s/${formData.u_referrer}/ari`}
                </Box>
              );
            }}
          </FormDataConsumer>
        </Box>
        <TextInput
          source="i_help_id"
          label="I Help BD ID"
          variant="outlined"
          helperText={false}
        />
        {permissions?.includes("userChangeRole") && (
          <UserRoleInput
            source="u_role"
            label="Role"
            variant="outlined"
            helperText={false}
            initialValue="user"
          />
        )}
        <UserStatusInput
          source="u_status"
          variant="outlined"
          helperText={false}
          initialValue="active"
        />
        {permissions?.includes("addInfluencer") && (
          <FormatedBooleanInput source="is_influencer" label="Is Influencer?" />
        )}
      </SimpleForm>
    </Create>
  );
};

export default UserCreate;
