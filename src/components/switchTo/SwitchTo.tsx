import { useState } from "react";
import {
  AutocompleteInput,
  Button,
  Confirm,
  ReferenceInput,
  SelectInput,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

import { useDocumentTitle, useRequest, useSwitchTo } from "@/hooks";
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterOfEachWord,
  userEmployeeInputTextRenderer,
} from "@/utils/helpers";
import UserEmployeeOptionTextRenderer from "../common/UserEmployeeOptionTextRenderer";

const SwitchTo = () => {
  useDocumentTitle("Arogga | Switch User");

  const { setValue } = useFormContext();
  const values = useWatch();
  const { isLoading, refetch } = useSwitchTo(values.userId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>({});

  const { data: roles } = useRequest("/v1/roles", {}, { isPreFetching: true });

  return (
    <>
      <SelectInput
        source="roleName"
        label="Role"
        variant="outlined"
        helperText={false}
        style={{ width: 256 }}
        choices={!!roles?.length ? roles : []}
        optionValue="role_name"
        optionText={(item) => capitalizeFirstLetterOfEachWord(item.role_name)}
        onChange={() => setValue("userId", undefined)}
      />
      {values.roleName && (
        <div style={{ width: 256, marginBottom: 15 }}>
          <ReferenceInput
            source="userId"
            label="User"
            variant="outlined"
            helperText={false}
            reference="v1/users"
            filter={{ _role: values.roleName }}
            fullWidth
          >
            <AutocompleteInput
              matchSuggestion={() => true}
              optionValue="u_id"
              helperText={false}
              optionText={(item) => (item.u_name ? item.u_name : item.u_mobile)}
              inputText={userEmployeeInputTextRenderer}
              onSelect={(item) => setSelectedUser(item)}
            />
          </ReferenceInput>
        </div>
      )}
      <Button
        label="Switch"
        variant="contained"
        style={{ display: "block" }}
        onClick={() => setIsDialogOpen(true)}
        disabled={!values.roleName || !values.userId}
      />
      <Confirm
        title={`Switch to ${
          selectedUser.u_name ? selectedUser.u_name : selectedUser.u_mobile
        } (${capitalizeFirstLetter(values.roleName)})`}
        content="Are you sure you want to switch?"
        isOpen={isDialogOpen}
        loading={isLoading}
        onConfirm={refetch}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default SwitchTo;
