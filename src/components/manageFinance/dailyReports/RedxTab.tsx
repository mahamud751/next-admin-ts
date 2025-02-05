import { FileField, FileInput, NumberInput } from "react-admin";

import { FILE_MAX_SIZE } from "@/utils/constants";

const RedxTab = () => (
  <>
    <NumberInput
      source="b_redx_qty"
      label="Qty"
      variant="outlined"
      helperText={false}
    />
    <FileInput
      source="attachedFiles_redx"
      label="Related files"
      helperText={false}
      accept={{
        "application/pdf": [".pdf"],
        "image/*": [".jpg", ".jpeg", ".png", ".gif"],
      }}
      maxSize={FILE_MAX_SIZE}
      multiple
    >
      <FileField source="src" title="title" />
    </FileInput>
  </>
);

export default RedxTab;
