import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import html2canvas from "html2canvas";
import { FC, useEffect, useState } from "react";
import { SelectInput, TextInput } from "react-admin";
import { useForm, useFormState } from "react-final-form";
import { useHistory } from "react-router-dom";

import { useRequest } from "../../../../hooks";
import useGetCurrentUser from "../../../../hooks/useGetCurrentUser";
import {
    formSetValues,
    isArrayFilter,
    required,
} from "../../../../utils/helpers";
import AroggaBackdrop from "../../../AroggaBackdrop";
import AroggaButton from "../../../AroggaButton";
import Divider from "../../../Divider";
import AdviceInfoBlock from "./partials/AdviceInfoBlock";
import ChifComplaintsBlock from "./partials/ChifComplaintsBlock";
import DiagnosisInfoBlock from "./partials/DiagnosisInfoBlock";
import InvestigationInfoBlock from "./partials/InvestigationBlock";
import MedicineInfo from "./partials/MedicineInfoForm";
import OEInfoBlock from "./partials/OEInfoBlock";
import { TemplateDialog } from "./partials/TemplateDialog";

type CreatePrescriptionProps = {
    orderData: any;
    existingMedicines: Array<string>;
    setPrescription?: any;
    edit?: boolean;
    prescriptionData?: any;
    loading?: boolean;
    onComplete?: void | any;
};

const CreatePrescription: FC<CreatePrescriptionProps> = ({
    orderData,
    existingMedicines,
    setPrescription,
    edit,
    prescriptionData,
    loading,
    onComplete,
}) => {
    const classes = useStyles();
    const form = useForm();
    const history = useHistory();
    const { values } = useFormState();
    const currentUser = useGetCurrentUser();
    const [templateDialogOpen, setTemplateDialogOpen] = useState({
        open: false,
        type: "",
        title: "",
    });
    const [showTemplateList, setShowTemplateList] = useState({
        dp_patient_complaints: false,
    });

    // Store the prescription in the database via API
    const { isLoading, isSuccess, refetch } = useRequest(
        "/v1/digitalPrescription",
        {
            method: "POST",
            body: {
                ...values,
                dp_doctor_id: currentUser?.u_id,
            },
        }
    );

    useEffect(() => {
        if (edit) {
            formSetValues(form, {
                dp_order_id: prescriptionData?.dp_order_id,
                dp_patient_id: prescriptionData?.dp_patient_id,
                dp_doctor_id: prescriptionData?.dp_doctor_id,
                u_mobile: prescriptionData?.patientInfo?.u_mobile,
                dp_patient_name: prescriptionData?.dp_patient_name,
                dp_patient_age: prescriptionData?.dp_patient_age,
                dp_patient_sex: prescriptionData?.dp_patient_sex,
                dp_patient_complaints:
                    isArrayFilter(prescriptionData?.dp_patient_complaints)
                        .length === 0
                        ? [{ complaints: "", time: "", d_m: "" }]
                        : isArrayFilter(
                              prescriptionData?.dp_patient_complaints
                          ),
                dp_medical_test_suggestions: isArrayFilter(
                    prescriptionData?.dp_medical_test_suggestions
                ),
                dp_investigations: isArrayFilter(
                    prescriptionData?.dp_investigations
                ),
                medicines: prescriptionData?.medicines?.map((item: any) => ({
                    pm_medicine_id: item.pm_medicine_id,
                    pm_dosage: item.pm_dosage,
                    pm_dose_time: item.pm_dose_time,
                    pm_dose_bm_am: item.pm_dose_bm_am,
                    pm_note: item.pm_note,
                    pm_duration: item.pm_duration,
                    pm_duration_type: item.pm_duration_type,
                })),
                dp_followup_info: prescriptionData?.dp_followup_info,
                dp_patient_oe:
                    isArrayFilter(prescriptionData?.dp_patient_oe).length === 0
                        ? [{ o_e: "", value: "", unit: "" }]
                        : isArrayFilter(prescriptionData?.dp_patient_oe),
                dp_advise_info: isArrayFilter(prescriptionData?.dp_advise_info),
            });
        } else {
            const prescriableMedicine = orderData?.medicineQty?.filter((item) =>
                existingMedicines.includes(item.m_id.toString())
            );
            formSetValues(form, {
                dp_order_id: orderData?.id,
                dp_patient_id: orderData?.u_id,
                u_mobile: orderData?.u_mobile,
                dp_patient_name: orderData?.u_name,
                dp_patient_age: "",
                dp_patient_sex: orderData?.sex || "",
                dp_patient_complaints: [{}],
                dp_patient_oe: [{}],
                medicines:
                    prescriableMedicine?.length === 0
                        ? [{}]
                        : prescriableMedicine?.map((item: any) => ({
                              pm_medicine_id: item.m_id,
                              pm_dosage: item.dosage,
                              pm_dose_time: item.dose_time,
                              pm_dose_bm_am: item.dose_bm_am,
                              pm_note: item.note,
                              pm_duration: item.duration,
                              pm_duration_type: item.duration_type,
                          })),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderData, prescriptionData]);

    useEffect(() => {
        setPrescription(values);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    useEffect(() => {
        if (isSuccess) {
            history.push(`/v1/orders/${orderData?.id}/1`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);

    const handleShowTemplateList = (type: string) => {
        setShowTemplateList((prev) => ({
            ...prev,
            [type]: !showTemplateList[type],
        }));
    };

    const handelPrescriptionSubmit = async (contentRef) => {
        const finalData: any = {
            ...values,
            dp_doctor_id: currentUser?.u_id,
            dp_patient_complaints: values?.dp_patient_complaints?.map(
                (item) => ({
                    complaints: item.complaints,
                    time: item.time,
                    d_m: item.d_m,
                })
            ),
            dp_patient_oe: values?.dp_patient_oe?.map((item) => ({
                o_e: item.o_e,
                value: item.value,
                unit: item.unit,
            })),
        };

        html2canvas(contentRef.current, {
            windowWidth: 1800,
            windowHeight: 1800,
            scale: 2,
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/jpeg", 0.82);

            const attachedFiles = [
                { src: imgData, title: finalData.dp_order_id },
            ];

            if (edit) {
                refetch({
                    endpoint: `/v1/digitalPrescription/${prescriptionData?.id}`,
                    body: {
                        ...finalData,
                        attachedFiles,
                    },
                });
            } else {
                refetch({
                    body: {
                        ...finalData,
                        attachedFiles,
                    },
                });
            }
        });
    };

    return (
        <>
            <AroggaBackdrop isLoading={isLoading || loading} />
            <TemplateDialog
                open={templateDialogOpen}
                setOpen={setTemplateDialogOpen}
                currentUser={currentUser}
            />
            <div className="patient-info">
                <Typography variant="h6">Patient’s </Typography>
                <Divider firstLineWidth="30" secondLineWidth="10" />
                <Grid container spacing={6}>
                    <Grid item xs={6} sm={3}>
                        <TextInput
                            source="dp_patient_name"
                            label="Patient’s Name"
                            variant="outlined"
                            validate={[required()]}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextInput
                            source="dp_patient_age"
                            label="Patient’s Age"
                            variant="outlined"
                            validate={[required()]}
                            type="number"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <SelectInput
                            source="dp_patient_sex"
                            label="Patient's Sex"
                            variant="outlined"
                            validate={[required()]}
                            choices={[
                                { id: "Male", name: "Male" },
                                { id: "Female", name: "Female" },
                                { id: "Other", name: "Other" },
                            ]}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextInput
                            source="u_mobile"
                            label="Patient's Phone"
                            variant="outlined"
                            initialValue="+880"
                            fullWidth
                            disabled
                        />
                    </Grid>
                </Grid>
                <Divider firstLineWidth="100" secondLineWidth="0" />
            </div>
            <div className={classes.root}>
                <Grid container spacing={6}>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={3}
                        style={{ borderRight: "1px dotted #e0e0e0" }}
                    >
                        <ChifComplaintsBlock
                            classes={classes}
                            showTemplateList={showTemplateList}
                            setShowTemplateList={setShowTemplateList}
                            form={form}
                            user={currentUser}
                            handleShowTemplateList={handleShowTemplateList}
                            setTemplateDialogOpen={setTemplateDialogOpen}
                        />
                        <OEInfoBlock
                            classes={classes}
                            showTemplateList={showTemplateList}
                            setShowTemplateList={setShowTemplateList}
                            form={form}
                            user={currentUser}
                            handleShowTemplateList={handleShowTemplateList}
                            setTemplateDialogOpen={setTemplateDialogOpen}
                        />
                        <DiagnosisInfoBlock
                            classes={classes}
                            showTemplateList={showTemplateList}
                            setShowTemplateList={setShowTemplateList}
                            form={form}
                            user={currentUser}
                            handleShowTemplateList={handleShowTemplateList}
                            setTemplateDialogOpen={setTemplateDialogOpen}
                        />
                        <InvestigationInfoBlock
                            classes={classes}
                            showTemplateList={showTemplateList}
                            setShowTemplateList={setShowTemplateList}
                            form={form}
                            user={currentUser}
                            handleShowTemplateList={handleShowTemplateList}
                            setTemplateDialogOpen={setTemplateDialogOpen}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={9}>
                        <Typography variant="h6">
                            Medicine Information
                        </Typography>
                        <Divider
                            firstLineWidth="40"
                            secondLineWidth="20"
                            miniLineColor="#008069"
                        />
                        <MedicineInfo />
                        <div
                            className="follow-up-info"
                            style={{ marginTop: "40px" }}
                        >
                            <Typography variant="h6">
                                Follow-up within
                            </Typography>
                            <Divider
                                firstLineWidth="40"
                                secondLineWidth="20"
                                miniLineColor="#008069"
                            />
                            <TextInput
                                helperText={false}
                                variant="outlined"
                                label="Check-up Duration"
                                source="dp_followup_info"
                            />
                        </div>
                        <AdviceInfoBlock
                            classes={classes}
                            showTemplateList={showTemplateList}
                            setShowTemplateList={setShowTemplateList}
                            form={form}
                            user={currentUser}
                            handleShowTemplateList={handleShowTemplateList}
                            setTemplateDialogOpen={setTemplateDialogOpen}
                        />
                    </Grid>
                </Grid>
            </div>
            <Divider
                style={{ marginTop: "20px" }}
                firstLineWidth={100}
                secondLineWidth={100}
                miniLineColor="#CED4DA"
            />
            {values.dp_patient_name &&
                values.dp_patient_age &&
                values.dp_patient_sex && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 10,
                        }}
                    >
                        <AroggaButton
                            label="Preview"
                            type="success"
                            style={{
                                background: "#008069",
                                color: "#fff",
                                height: 40,
                            }}
                            onClick={() =>
                                onComplete({
                                    text: edit
                                        ? "Update Prescription"
                                        : "Create Prescription",
                                    function: handelPrescriptionSubmit,
                                })
                            }
                        />
                    </div>
                )}
        </>
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
        width: "100%",
        gap: 10,
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

export default CreatePrescription;
