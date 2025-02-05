import AttachFileIcon from "@mui/icons-material/AttachFile";
import { FC, MouseEvent } from "react";
import {
  Datagrid,
  FileField,
  FileInput,
  FunctionField,
  List,
  ListProps,
  NumberField,
  SimpleForm,
  TextField,
  useNotify,
  usePermissions,
  useRefresh,
} from "react-admin";

import { uploadDataProvider } from "@/dataProvider";
import { useDocumentTitle, useExport, useNavigateFromList } from "@/hooks";
import { FILE_MAX_SIZE } from "@/utils/constants";
import { logger, transformFiles } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import LedgerFilter from "./LedgerFilter";
import LedgerPagination from "./LedgerPagination";
import AroggaDateField from "@/components/common/AroggaDateField";

const LedgerList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Ledger List");
  const { permissions } = usePermissions();
  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const navigateFromList = useNavigateFromList("ledgerView", "ledgerEdit");

  const UploadFile = ({ id }: { id: number }) => {
    const refresh = useRefresh();
    const notify = useNotify();

    return (
      <SimpleForm toolbar={false}>
        <FileInput
          source="filesAttached"
          label=""
          accept={{
            "application/pdf": [".pdf"],
            "image/*": [".jpg", ".jpeg", ".png", ".gif"],
          }}
          maxSize={FILE_MAX_SIZE}
          placeholder={<AttachFileIcon />}
          multiple
          options={{
            onDrop: async (newFiles) => {
              const modifiedFiles = transformFiles(newFiles, "attachedFiles");

              try {
                await uploadDataProvider.create(
                  `v1/ledger/attachedFileUpload/${id}`,
                  {
                    data: { attachedFiles: modifiedFiles },
                  }
                );
                notify("Successfully uploaded!", {
                  type: "success",
                });
                refresh();
              } catch (err) {
                logger(err);
                notify("Something went wrong, Please try again!", {
                  type: "error",
                });
              }
            },
          }}
        >
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    );
  };

  return (
    <List
      {...rest}
      pagination={<LedgerPagination />}
      title="List of Ledger"
      filters={<LedgerFilter children={""} />}
      perPage={25}
      sort={{ field: "l_id", order: "DESC" }}
      exporter={exporter}
    >
      <Datagrid
        rowClick={navigateFromList}
        bulkActionButtons={permissions?.includes("ledgerDelete")}
      >
        <TextField source="l_id" label="ID" />
        <AroggaDateField source="l_created" label="Date" />
        <TextField source="u_name" label="Added By" sortBy="l_uid" />
        <TextField source="l_reason" label="Reason" />
        <TextField
          source="l_type"
          label="Type"
          className={classes.capitalize}
        />
        <TextField source="l_method" label="Method" />
        <NumberField source="l_amount" label="Amount" />
        <FileField
          source="attachedFiles"
          src="src"
          title="title"
          target="_blank"
          label="Related Files"
          // @ts-ignore
          onClick={(e) => e.stopPropagation()}
          sortable={false}
        />
        <FunctionField
          label="Upload"
          onClick={(e: MouseEvent) => e.stopPropagation()}
          render={({ id }) => <UploadFile id={+id} />}
        />
      </Datagrid>
    </List>
  );
};

export default LedgerList;
