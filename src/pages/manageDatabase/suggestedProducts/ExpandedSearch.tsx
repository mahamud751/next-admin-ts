import React, { useState } from "react";
import { useRequest } from "@/hooks";
import {
  Confirm,
  Datagrid,
  FunctionField,
  RaRecord,
  ReferenceManyField,
  TextField,
  useNotify,
  useRedirect,
} from "react-admin";
import { Button, Checkbox } from "@mui/material";
import { ButtonGroup } from "rsuite";

import { useAroggaStyles } from "@/utils/useAroggaStyles";

const ExpandedSearch = (props) => {
  const title = props.record ? props.record.sp_name : null;
  const id = props.record ? props.record.id : null;
  const notify = useNotify();
  const redirect = useRedirect();
  const classes = useAroggaStyles();
  const [isConfirmLocationDialogOpen, setIsConfirmLocationDialogOpen] =
    useState(false);
  const { refetch: productCreate } = useRequest(
    "",
    {},
    {
      onSuccess: () => {
        redirect(
          `/v1/product/create?source=${encodeURIComponent(
            JSON.stringify({
              p_name: title,
            })
          )}`
        );
      },
    }
  );
  const handleChangeMRP = () => {
    productCreate({
      endpoint: `/v1/product`,
    });
  };
  const [selectedRows, setSelectedRows] = useState([]);
  const [, setChecked] = React.useState(true);
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    record: RaRecord
  ) => {
    setChecked(event.target.checked);
    //@ts-ignore
    setSelectedRows(event.target.checked ? record.id : null);
  };
  const { isLoading: alreadyExistsLoading, refetch: postAlreadyExists } =
    useRequest(
      `/v1/suggestedProductAction/${id}/alreadyExitsAction`,
      {
        method: "POST",
        body: {
          sp_product_id: selectedRows,
        },
      },
      {
        isRefresh: true,
        successNotify: "Successfully marked as exists!",
      }
    );
  const handleModalAction = () => {
    if (selectedRows !== null && selectedRows !== undefined) {
      setIsConfirmLocationDialogOpen(true);
    } else {
      notify("Please select a product", "warning");
    }
  };
  const { data: suggestedData } = useRequest(
    `/general/v3/search?_search=${title}`,
    {},
    { isBaseUrl: true, isPreFetching: true, isWarningNotify: false }
  );

  return (
    <>
      <ReferenceManyField
        reference="general/v3/search"
        target="qc_id"
        filter={{ _search: title }}
        sort={{ field: "qc_id", order: "DESC" }}
      >
        <>
          <Datagrid isRowExpandable={(row) => !!row?.qci_damaged_data?.length}>
            <FunctionField
              label="ID"
              render={(record: RaRecord) => (
                <Checkbox
                  // @ts-ignore
                  checked={record?.p_id === selectedRows}
                  onChange={(event) => handleChange(event, record)}
                  inputProps={{
                    "aria-label": "primary checkbox",
                  }}
                />
              )}
            />
            <TextField source="p_id" label="Id" />
            <TextField source="p_name" label="Name" />
            <TextField source="p_brand" label="Brand" />
            <TextField source="p_strength" label="Strength" />
            <TextField source="p_form" label="Form" />
            <TextField source="pv[0].pv_mrp" label="MRP" />
          </Datagrid>

          <div
            style={{
              display: "flex",
              marginTop: "1rem",
            }}
          >
            <ButtonGroup
              style={{
                marginLeft: "auto",
              }}
            >
              {suggestedData !== undefined && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleModalAction()}
                >
                  Already Exists
                </Button>
              )}
              <Confirm
                title={"Confirmation!"}
                content="Are you sure you want to mark this suggestion already exists?"
                isOpen={isConfirmLocationDialogOpen}
                loading={alreadyExistsLoading}
                onConfirm={() => postAlreadyExists()}
                onClose={() => setIsConfirmLocationDialogOpen(false)}
              />
              {/* @ts-ignore */}
              <Button
                label="Close Bag"
                variant="contained"
                className={classes.whitespaceNowrap}
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  handleChangeMRP();
                }}
              >
                {" "}
                Create
              </Button>
            </ButtonGroup>
          </div>
        </>
      </ReferenceManyField>
    </>
  );
};

export default ExpandedSearch;
