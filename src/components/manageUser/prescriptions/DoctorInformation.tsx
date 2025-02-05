import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { FileField, FileInput, TextInput } from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";

import { useGetCurrentUser, useRequest } from "@/hooks";
import { FILE_MAX_SIZE } from "@/utils/constants";
import { convertFileToBase64, isEmpty } from "@/utils/helpers";
import AroggaButton from "@/components/common/AroggaButton";

const DoctorInformation = () => {
  const classes = useStyle();
  const { setValue } = useFormContext();
  const { values } = useWatch();
  const currentUser = useGetCurrentUser();
  const [base64AttachedFile, setBase64AttachedFile] = useState("");

  const { doctor_name, doctor_degree, doctor_other_info, attachedFiles } =
    values;

  const { data: doctorInfo } = useRequest(
    `/v1/doctorInfo?dp_doctor_id=${currentUser.u_id}`,
    {},
    {
      isPreFetching: true,
    }
  );

  const { refetch } = useRequest("/v1/doctorInfo", {
    method: "POST",
    body: {
      dp_doctor_id: currentUser.u_id,
      doctor_info: {
        doctor_name,
        doctor_degree,
        doctor_other_info,
      },
      attachedFiles: base64AttachedFile ? [base64AttachedFile] : null,
    },
  });

  useEffect(() => {
    doctorInfo && initializeDoctorInfoInForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorInfo]);

  useEffect(() => {
    if (isEmpty(attachedFiles)) return setBase64AttachedFile("");

    (async function () {
      const base64File: any = await convertFileToBase64(attachedFiles);
      setBase64AttachedFile(base64File);
    })();
  }, [attachedFiles]);

  const initializeDoctorInfoInForm = () => {
    setValue("doctor_name", doctorInfo?.doctor_name);
    setValue("doctor_degree", doctorInfo?.doctor_degree);
    setValue("doctor_other_info", doctorInfo?.doctor_other_info);
    setValue("attachedFiles", doctorInfo?.signature);
  };

  return (
    <>
      <Grid container direction="row" spacing={2}>
        <Grid
          item
          xs={6}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <TextInput
            source="doctor_name"
            label="Doctor Name"
            variant="outlined"
            helperText={false}
          />
          <TextInput
            source="doctor_degree"
            label="Doctor Degree"
            variant="outlined"
            helperText={false}
          />
          <TextInput
            source="doctor_other_info"
            label="Other Info"
            variant="outlined"
            helperText={false}
            minRows={3}
            multiline
          />
          <FileInput
            source="attachedFiles"
            label=""
            helperText={false}
            placeholder="Upload Doctor Signature"
            accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
            maxSize={FILE_MAX_SIZE}
          >
            <FileField source="src" title="title" />
          </FileInput>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.header}>
            <div className={classes.headerLeft}>
              <div className={classes.doctorName}>{values.doctor_name}</div>
              <div className={classes.doctorOthers}>
                <div>{values.doctor_degree}</div>
                <div>{values.speciality}</div>
                <div>
                  {values.doctor_other_info?.split("\n")?.map((item, i) => (
                    <div key={i}> {item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
      <AroggaButton
        label="Save"
        type="success"
        onClick={refetch}
        style={{ marginTop: 4 }}
      />
    </>
  );
};

const useStyle = makeStyles(() => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 30,
    backgroundColor: "#F9FFF8",
  },
  headerLeft: {
    color: "#112950",
  },
  doctorName: {
    fontSize: 14,
    fontWeight: 600,
  },
  doctorOthers: {
    fontSize: 12,
  },
}));

export default DoctorInformation;
