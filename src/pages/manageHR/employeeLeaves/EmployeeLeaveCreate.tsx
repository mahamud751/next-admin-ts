import { Box, Button } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { FC } from "react";
import {
  ArrayInput,
  AutocompleteInput,
  Create,
  CreateProps,
  DateInput,
  FormDataConsumer,
  ReferenceInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  maxLength,
  required,
  useDataProvider,
  useNotify,
  useRedirect,
} from "react-admin";

import TaxonomiesByVocabularyInput from "@/components/common/TaxonomiesByVocabularyInput";
import UserEmployeeOptionTextRenderer from "@/components/common/UserEmployeeOptionTextRenderer";
import { useDocumentTitle } from "@/hooks";
import { userEmployeeInputTextRenderer } from "@/utils/helpers";

const EmployeeLeaveCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | Employee Leave Create");

  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();

  const onSave = async (values) => {
    if (!values.leaves?.length)
      return notify("Leave Date is required!", {
        type: "error",
      });

    dataProvider
      .create("v1/employeeLeave", {
        data: values,
      })
      .then(() => {
        notify("Successfully Created!", { type: "success" });
        redirect("list", "/v1/employeeLeave");
      })
      .catch((err) =>
        notify(err?.message || "Something went wrong, Please try again!", {
          type: "error",
        })
      );
  };

  return (
    <Create {...props}>
      <SimpleForm onSubmit={onSave}>
        <ReferenceInput
          source="e_id"
          label="Employee"
          variant="outlined"
          helperText={false}
          reference="v1/employee"
          sort={{ field: "e_id", order: "DESC" }}
          isRequired
        >
          <AutocompleteInput
            matchSuggestion={() => true}
            optionValue="e_id"
            helperText={false}
            optionText={<UserEmployeeOptionTextRenderer />}
            inputText={userEmployeeInputTextRenderer}
          />
        </ReferenceInput>
        <FormDataConsumer>
          {({ formData }) => (
            <ArrayInput
              source="leaves"
              label={!!formData.leaves?.length ? "Leave Details" : ""}
              style={{
                marginTop: !!formData.leaves?.length ? 20 : 0,
              }}
            >
              <SimpleFormIterator
                // @ts-ignore
                TransitionProps={{
                  classNames: "fade-exit",
                }}
                addButton={
                  <Button variant="contained" color="primary">
                    {!!formData.leaves?.length ? "Add" : "Add Leave Date"}
                  </Button>
                }
                removeButton={
                  <Box mt={1} ml={1} style={{ cursor: "pointer" }}>
                    <HighlightOffIcon />
                  </Box>
                }
                disableReordering
              >
                <DateInput
                  source="eld_date"
                  label="Date"
                  variant="outlined"
                  helperText={false}
                />
              </SimpleFormIterator>
            </ArrayInput>
          )}
        </FormDataConsumer>
        <Box mt={2} />
        <TaxonomiesByVocabularyInput
          fetchKey="leave_type"
          source="el_type"
          label="Type"
          validate={[required()]}
        />
        <TextInput
          source="el_reason"
          label="Reason"
          variant="outlined"
          helperText={false}
          validate={[
            required(),
            maxLength(255, "Reason should be at most 255 characters"),
          ]}
          minRows={2}
          multiline
        />
      </SimpleForm>
    </Create>
  );
};

export default EmployeeLeaveCreate;
