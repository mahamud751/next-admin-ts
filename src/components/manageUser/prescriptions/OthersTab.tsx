import {
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { FC, useEffect, useState } from "react";
import { IconButtonWithTooltip, SimpleForm, TextInput } from "react-admin";
import { useWatch } from "react-hook-form";

import { useGetCurrentUser, useRequest } from "@/hooks";

import AroggaButton from "@/components/common/AroggaButton";
import FormRepeter from "@/components/manageOrder/prescription/partials/FormRepeter";

type OthersTabProps = {
  source?: string;
  label?: string;
  dataToDisplay?: {
    name: string;
    label: string;
  }[];
  template_key: string;
  identifier?: string;
};

const OthersTab: FC<OthersTabProps> = ({
  source,
  dataToDisplay,
  template_key,
  label,
  identifier,
}) => {
  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<any>({});
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenTemplateModal, setIsOpenTemplateModal] = useState(false);
  const currentUser = useGetCurrentUser();

  const { data, refetch } = useRequest(
    "/v1/" + source,
    {},
    {
      isWarningNotify: false,
    }
  );
  const { refetch: updateSourceRefetch } = useRequest(
    "/v1/" + source,
    {},
    {
      isWarningNotify: false,
      isSuccessNotify: false,
    }
  );
  const { refetch: deleteSource, isSuccess: isSuccessDeleteSource } =
    useRequest("/v1/" + source, {});
  const { data: templateData, refetch: templateRefetch } = useRequest(
    `/v1/template/`,
    {},
    {
      isWarningNotify: false,
    }
  );
  const { refetch: deleteTemplateRefetch, isSuccess: isSuccessDeleteTemplate } =
    useRequest(
      `/v1/template/${template_key}`,
      {},
      {
        isWarningNotify: false,
      }
    );

  useEffect(() => {
    source && refetch();
    templateRefetch({
      endpoint: `/v1/template?_type=${template_key}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSuccessDeleteSource) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleteSource]);

  useEffect(() => {
    if (isSuccessDeleteTemplate) {
      templateRefetch({
        endpoint: `/v1/template?_type=${template_key}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleteTemplate]);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    ...(dataToDisplay?.map((item) => ({
      field: item.name,
      headerName: item.label,
      flex: 1,
      editable: true,
    })) || []),
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (row: any) => (
        <IconButtonWithTooltip
          label="Edit"
          onClick={() => {
            deleteSource({
              endpoint: `/v1/${source}/${row.id}`,
              method: "Delete",
            });
          }}
        >
          <DeleteIcon />
        </IconButtonWithTooltip>
      ),
    },
  ];

  const templateColumns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "t_name",
      headerName: "Template Name",
      flex: 1,
      editable: true,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: ({ row }) => (
        <>
          <IconButtonWithTooltip
            label="Delete"
            onClick={() => {
              deleteTemplateRefetch({
                endpoint: `/v1/template/${row.id}`,
                method: "Delete",
              });
            }}
          >
            <DeleteIcon />
          </IconButtonWithTooltip>
          <IconButtonWithTooltip
            label="Edit"
            onClick={() => {
              setCurrentRow(row);
              setOpen(true);
            }}
          >
            <EditIcon />
          </IconButtonWithTooltip>
        </>
      ),
    },
  ];

  return (
    <Grid container direction="row" spacing={2} style={{ marginTop: 10 }}>
      {source && (
        <Grid item xs={6}>
          <Card
            style={{
              border: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Typography gutterBottom>{label}</Typography>

              <AroggaButton
                label="Add New"
                type="success"
                onClick={() => setIsOpenAddModal(true)}
              />
            </div>
            <DataGrid
              rows={data || []}
              columns={columns}
              //@ts-ignore
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              autoHeight
              onCellEditCommit={(params: any) => {
                const { id, field, value, row } = params;
                updateSourceRefetch({
                  endpoint: `/v1/${source}/${id}`,
                  method: "POST",
                  body: {
                    ...row,
                    [field]: value,
                    [identifier]: currentUser?.u_id,
                  },
                });
              }}
            />
          </Card>
        </Grid>
      )}
      <Grid item xs={6}>
        <Card
          style={{
            border: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <Typography gutterBottom>{label} Templates</Typography>
            <AroggaButton
              label="Add New Template"
              type="success"
              onClick={() => setIsOpenTemplateModal(true)}
            />
          </div>
          <DataGrid
            rows={templateData || []}
            columns={templateColumns}
            //@ts-ignore
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
          />
        </Card>
      </Grid>
      {open && (
        <SimpleForm record={currentRow} toolbar={null} resource="template">
          <EditTemplateModal open={open} onClose={() => setOpen(false)} />
        </SimpleForm>
      )}
      {isOpenAddModal && (
        <SimpleForm record={currentRow} toolbar={null} resource="template">
          <NewModel
            source={source}
            identifier={identifier}
            refetch={refetch}
            label={label}
            open={isOpenAddModal}
            dataToDisplay={dataToDisplay}
            onClose={() => setIsOpenAddModal(false)}
          />
        </SimpleForm>
      )}
      {isOpenTemplateModal && (
        <SimpleForm record={currentRow} toolbar={null} resource="template">
          <NewTemplateModal
            refetch={templateRefetch}
            label={label}
            open={isOpenTemplateModal}
            template_key={template_key}
            onClose={() => setIsOpenTemplateModal(false)}
          />
        </SimpleForm>
      )}
    </Grid>
  );
};

export default OthersTab;

const EditTemplateModal = ({ open, onClose }) => {
  const classes = useStyles();
  const { values } = useWatch();
  const currentUser = useGetCurrentUser();

  const { isSuccess, refetch: templateRefetch } = useRequest(
    `/v1/template/`,
    {},
    {
      isWarningNotify: true,
    }
  );

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleSave = () => {
    templateRefetch({
      endpoint: `/v1/template/${values.id}`,
      method: "POST",
      body: {
        t_name: values.t_name,
        t_template: values.t_template,
        t_doctor_id: currentUser?.u_id,
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit Template</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Edit the template name and content
        </DialogContentText>
        <TextInput
          source="t_name"
          label="Template Name"
          variant="outlined"
          helperText={false}
          id="name"
          fullWidth
        />
        {values.t_type === "dp_patient_complaints" && <CheifComplaints />}
        {[
          "dp_advise_info",
          "dp_investigations",
          "dp_medical_test_suggestions",
        ].includes(values.t_type) && (
          <FormRepeter name="t_template" classes={classes}>
            <TextInput
              source=""
              label="Template Content"
              variant="outlined"
              helperText={false}
              id="outlined-multiline-static"
              fullWidth
            />
          </FormRepeter>
        )}
        {values.t_type === "dp_patient_oe" && <PatientOe />}
      </DialogContent>
      <DialogActions>
        <AroggaButton label="Save" onClick={handleSave} />
      </DialogActions>
    </Dialog>
  );
};

const NewModel = ({
  open,
  onClose,
  label,
  dataToDisplay,
  refetch: refresh,
  source,
  identifier,
}) => {
  const { values } = useWatch();
  const currentUser = useGetCurrentUser();
  const { refetch, isSuccess } = useRequest(
    "/v1/" + source,
    {},
    {
      isWarningNotify: false,
    }
  );
  const onSubmit = () => {
    refetch({
      endpoint: `/v1/${source}`,
      method: "POST",
      body: {
        ...values,
        [identifier]: currentUser?.u_id,
      },
    });
  };

  useEffect(() => {
    if (isSuccess) {
      refresh();
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">New {label}</DialogTitle>
      <DialogContent>
        {dataToDisplay?.map((item, index) => (
          <TextInput
            key={index}
            source={item.name}
            label={item.label}
            variant="outlined"
            helperText={false}
            fullWidth
          />
        ))}
      </DialogContent>
      <DialogActions>
        <AroggaButton type="success" label="Save" onClick={onSubmit} />
      </DialogActions>
    </Dialog>
  );
};

const NewTemplateModal = ({
  open,
  onClose,
  label,
  template_key,
  refetch: refresh,
}) => {
  const { values } = useWatch();
  const classes = useStyles();
  const currentUser = useGetCurrentUser();
  const { isSuccess, refetch } = useRequest(
    `/v1/template/`,
    {},
    {
      isWarningNotify: true,
    }
  );

  useEffect(() => {
    if (template_key === "dp_patient_complaints") {
      values.t_template = [{ complaints: "", time: "", d_m: "" }];
    }
    if (
      [
        "dp_advise_info",
        "dp_investigations",
        "dp_medical_test_suggestions",
      ].includes(template_key)
    ) {
      values.t_template = [""];
    }

    if (template_key === "dp_patient_oe") {
      values.t_template = [{ o_e: "", value: "", unit: "" }];
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template_key]);
  const handleSave = () => {
    refetch({
      endpoint: `/v1/template/`,
      method: "POST",
      body: {
        t_name: values.t_name,
        t_template: values.t_template,
        t_doctor_id: currentUser?.u_id,
        t_type: template_key,
      },
    });
  };

  useEffect(() => {
    if (isSuccess) {
      refresh();
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">New {label} Template</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <TextInput
            source="t_name"
            label="Template Name"
            variant="outlined"
            helperText={false}
            id="name"
            fullWidth
          />
          {template_key === "dp_patient_complaints" && <CheifComplaints />}
          {[
            "dp_advise_info",
            "dp_investigations",
            "dp_medical_test_suggestions",
          ].includes(template_key) && (
            <FormRepeter name="t_template" classes={classes}>
              <TextInput
                source=""
                label="Template Content"
                variant="outlined"
                helperText={false}
                id="outlined-multiline-static"
                fullWidth
              />
            </FormRepeter>
          )}
          {template_key === "dp_patient_oe" && <PatientOe />}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <AroggaButton type="success" label="Save" onClick={handleSave} />
      </DialogActions>
    </Dialog>
  );
};

const CheifComplaints = () => {
  const classes = useStyles();

  return (
    <FormRepeter name="t_template" classes={classes}>
      <TextInput
        source="complaints"
        label="Complaint"
        variant="outlined"
        helperText={false}
        fullWidth
      />
      <TextInput
        source="time"
        label="Duration"
        variant="outlined"
        helperText={false}
        fullWidth
      />
      <TextInput
        source="d_m"
        label="D/m"
        variant="outlined"
        helperText={false}
        fullWidth
      />
    </FormRepeter>
  );
};

const PatientOe = () => {
  const classes = useStyles();

  return (
    <FormRepeter name="t_template" classes={classes}>
      <TextInput source="o_e" label="O/E" variant="outlined" fullWidth />
      <TextInput
        source="value"
        label="Value"
        variant="outlined"
        helperText={false}
        fullWidth
      />
      <TextInput
        source="unit"
        label="Unit"
        variant="outlined"
        helperText={false}
        fullWidth
      />
    </FormRepeter>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    "&.advice-information .MuiFormHelperText-contained": {
      display: "none",
    },
  },
  displyFlexSpaceBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  displyFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  displyFlexWithGap: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  positionRelative: {
    position: "relative",
  },
}));
