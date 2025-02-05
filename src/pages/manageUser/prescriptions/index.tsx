import DoctorInformation from "@/components/manageUser/prescriptions/DoctorInformation";
import OthersTab from "@/components/manageUser/prescriptions/OthersTab";
import { Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FormTab, TabbedForm, Title } from "react-admin";

const PrescriptionsSettings = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Title title="Prescription" />
      <Typography variant="h5">Doctor’s Prescription</Typography>
      <Paper style={{ marginTop: 10, paddingBottom: 10 }}>
        <TabbedForm syncWithLocation={false} toolbar={null}>
          <FormTab label="Doctor Information">
            <DoctorInformation />
          </FormTab>
          <FormTab label="Cheif Complaints">
            <OthersTab
              source="patientComplaint"
              label="Cheif Complaints"
              template_key="dp_patient_complaints"
              identifier="pc_doctor_id"
              dataToDisplay={[
                {
                  name: "pc_complaints",
                  label: "Patient Complaint",
                },
              ]}
            />
          </FormTab>
          <FormTab label="O/E">
            <OthersTab
              source="medicalTest"
              label="O/E"
              template_key="dp_patient_oe"
              identifier="mt_created_by"
              dataToDisplay={[
                {
                  name: "mt_name",
                  label: "Medical Test Name",
                },
                {
                  name: "mt_result_unit",
                  label: "Medical Test Result",
                },
              ]}
            />
          </FormTab>
          <FormTab label="Diagnosed Information">
            <OthersTab
              label="Diagnosed Information"
              template_key="dp_medical_test_suggestions"
            />
          </FormTab>
          <FormTab label="Investigation information">
            <OthersTab
              label="Investigation information"
              template_key="dp_investigations"
            />
          </FormTab>
          <FormTab label="Advice information">
            <OthersTab
              label="Advice information"
              template_key="dp_advise_info"
            />
          </FormTab>
        </TabbedForm>
      </Paper>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 20,
  },
}));

export default PrescriptionsSettings;
