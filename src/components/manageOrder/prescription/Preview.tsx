import {
    Dialog,
    DialogContent,
    DialogContentText,
    IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { CSSProperties, FC, useEffect, useRef, useState } from "react";

import aroggaLogoGreen from "../../../../assets/images/logo-green.png";
import { useGetCurrentUser, useRequest } from "../../../../hooks";
import {
    convertImageUrlToBase64,
    isArrayFilter,
} from "../../../../utils/helpers";
import AroggaButton from "../../../AroggaButton";
import AroggaDialogActions from "../../../AroggaDialogActions";
import Divider from "../../../Divider";
import { PrescriptionRxIcon } from "../../../icons";

type PreviewProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    label?: string;
    data: any;
    style?: CSSProperties;
    onComplete?: any;
};

const Preview: FC<PreviewProps> = ({
    open,
    setOpen,
    label,
    data,
    style = {},
    onComplete = {
        text: null,
        function: (_data) => {},
    },
}) => {
    const classes = useStyle();
    const classesImg = useStylesImg();
    const currentUser = useGetCurrentUser();
    const printableRef = useRef(null);

    const [doctorSignature, setDoctorSignature] = useState("");

    const { data: doctorInfo } = useRequest(
        `/v1/doctorInfo?dp_doctor_id=${currentUser.u_id}`,
        {},
        {
            isPreFetching: true,
        }
    );

    const { data: medicineData, refetch } = useRequest(
        `/v1/medicines?ids=${data?.medicines?.map(
            (medicine) => medicine.pm_medicine_id
        )}`,
        {}
    );

    useEffect(() => {
        if (open) refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handlePrint = () => {
        html2canvas(printableRef.current, {
            windowWidth: 1800,
            windowHeight: 1800,
            scale: 2,
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/jpeg", 0.82);
            const doc = new jsPDF("p", "pt", "a4", true);
            doc.addImage(imgData, "JPEG", 0, 0, 595, 0, "", "FAST");
            doc.autoPrint();
            doc.output("dataurlnewwindow");
        });
    };

    const getMedicineName = (id) => {
        const medicine = medicineData?.find((medicine) => medicine.m_id === id);
        return medicine?.m_name;
    };

    const generateRef = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${year}${month}${day}-${data?.dp_order_id}`;
    };

    const signatureImage = (img) => {
        if (!img) return null;

        convertImageUrlToBase64(img).then((data: any) =>
            setDoctorSignature(data)
        );

        return (
            <img
                src={doctorSignature}
                alt="Doctor Signature"
                className={classesImg.signature}
            />
        );
    };

    return (
        <>
            {label && (
                <AroggaButton
                    type="success"
                    label={label}
                    onClick={() => setOpen(true)}
                    style={{
                        ...style,
                    }}
                />
            )}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="lg"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{
                    overflow: "scroll",
                }}
                fullWidth
            >
                <DialogContent
                    style={{
                        padding: 0,
                    }}
                >
                    <IconButton
                        onClick={() => setOpen(false)}
                        aria-label="close"
                        style={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                        }}
                    >
                        <Close />
                    </IconButton>
                    <DialogContentText ref={printableRef}>
                        <div ref={printableRef} style={{ height: "100vh" }}>
                            <div className={classes.header}>
                                <div className={classes.headerLeft}>
                                    <div className={classes.doctorName}>
                                        {doctorInfo?.doctor_name}
                                    </div>
                                    <div className={classes.doctorOthers}>
                                        <div>{doctorInfo?.doctor_degree}</div>
                                        <div>
                                            {doctorInfo?.doctor_other_info}
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.headerRight}>
                                    <img
                                        src={aroggaLogoGreen}
                                        alt="Arogga Logo"
                                    />
                                    <div>
                                        <strong>Date:</strong>{" "}
                                        {new Date(
                                            data?.dp_created_at || Date.now()
                                        ).toLocaleDateString()}
                                    </div>
                                    <div>
                                        <strong>Ref:</strong> AR-
                                        {generateRef()}
                                    </div>
                                </div>
                            </div>
                            <div className={classes.patientBlock}>
                                <div className="name">
                                    <strong>Name</strong>:{" "}
                                    {data?.dp_patient_name ||
                                        data?.patientInfo?.u_name}
                                </div>
                                <div className="age">
                                    <strong>Age</strong>:{" "}
                                    {data?.dp_patient_age || "N/A"}
                                </div>
                                <div className="gender">
                                    <strong>Gender</strong>:{" "}
                                    {data?.dp_patient_sex ||
                                        data?.patientInfo?.u_sex ||
                                        "N/A"}
                                </div>
                                <div className="Phone">
                                    <strong>Phone</strong>:{" "}
                                    {data?.u_mobile ||
                                        data?.patientInfo?.u_mobile}
                                </div>
                            </div>
                            <div className={classes.presBody}>
                                <div className={classes.presBodyLeft}>
                                    <div className={classes.presLeftSmallBlock}>
                                        <strong>Chief complaints</strong>
                                        <ul>
                                            {isArrayFilter(
                                                data?.dp_patient_complaints,
                                                true
                                            )?.map((item, index) => (
                                                <li key={index}>
                                                    {`${item?.complaints} for ${item?.time} ${item?.d_m}`}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className={classes.presLeftSmallBlock}>
                                        <strong>O/E info</strong>
                                        <ul>
                                            {isArrayFilter(
                                                data?.dp_patient_oe,
                                                true
                                            )?.map((item, index) => (
                                                <li key={index}>
                                                    {`${item?.o_e} for ${item?.value} ${item?.unit}`}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className={classes.presLeftSmallBlock}>
                                        <strong>Diagnosed info</strong>
                                        <ul>
                                            {isArrayFilter(
                                                data?.dp_medical_test_suggestions
                                            )?.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <>
                                        <strong>Investigation info</strong>
                                        <ul>
                                            {isArrayFilter(
                                                data?.dp_investigations
                                            )?.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </>
                                </div>
                                <div className={classes.presBodyRight}>
                                    <PrescriptionRxIcon fill="#000000" />
                                    <div className={classes.presTable}>
                                        <table
                                            className={classes.presTableHead}
                                        >
                                            <tbody>
                                                {data?.medicines?.map(
                                                    (item, index) => (
                                                        <tr
                                                            key={index}
                                                            className={
                                                                classes.presTableHeadTr
                                                            }
                                                        >
                                                            <td>
                                                                {getMedicineName(
                                                                    item.pm_medicine_id
                                                                )}
                                                                {item?.pm_note && (
                                                                    <>
                                                                        <br />
                                                                        <small>
                                                                            {item?.pm_note ||
                                                                                ""}
                                                                        </small>
                                                                    </>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {item?.pm_dose_time ||
                                                                    ""}
                                                            </td>
                                                            <td>
                                                                {item?.pm_dosage ||
                                                                    ""}
                                                            </td>
                                                            <td
                                                                className={
                                                                    classes.textCapitalized
                                                                }
                                                            >
                                                                {item?.pm_dose_bm_am?.replace(
                                                                    "_",
                                                                    " "
                                                                ) || ""}
                                                            </td>
                                                            <td>
                                                                {`${
                                                                    item?.pm_duration ||
                                                                    ""
                                                                } ${
                                                                    item?.pm_duration_type ||
                                                                    ""
                                                                }`}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div
                                        style={{
                                            color: "#112950",
                                        }}
                                    >
                                        <span
                                            style={{
                                                marginBottom: 10,
                                            }}
                                        >
                                            Follow-up within:{" "}
                                            {data?.dp_followup_info}{" "}
                                        </span>
                                        <div
                                            style={{
                                                marginBottom: 10,
                                                marginTop: 10,
                                                minHeight: "20%",
                                            }}
                                        >
                                            <strong>Advice:</strong>
                                            <ul>
                                                {isArrayFilter(
                                                    data?.dp_advise_info,
                                                    false
                                                )?.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <Divider
                                        firstLineWidth="100%"
                                        secondLineWidth="100%"
                                        miniLineColor="#d8d8d8"
                                    />
                                    {doctorInfo?.signature && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            {signatureImage(
                                                doctorInfo?.signature[0].src
                                            )}
                                            <div
                                                style={{
                                                    marginLeft: 10,
                                                    color: "#112950",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontWeight: "bold",
                                                        fontSize: 18,
                                                    }}
                                                >
                                                    {doctorInfo?.doctor_name}
                                                </span>
                                                <div>
                                                    {doctorInfo?.doctor_degree}
                                                </div>
                                                <div>
                                                    {
                                                        doctorInfo?.doctor_other_info
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogContentText>
                </DialogContent>
                <AroggaDialogActions
                    isLoading={false}
                    cancelLabel="Close"
                    confirmLabel={onComplete?.text ? onComplete?.text : "Print"}
                    onDialogClose={() => setOpen(false)}
                    onConfirm={
                        onComplete?.text
                            ? () => onComplete?.function(printableRef)
                            : handlePrint
                    }
                />
            </Dialog>
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
        width: "40%",
    },
    doctorName: {
        fontSize: 14,
        fontWeight: 600,
    },
    doctorOthers: {
        fontSize: 12,
    },
    headerRight: {
        color: "#112950",
        fontSize: 12,
    },
    patientBlock: {
        borderTop: "1px solid #bdbebf",
        padding: "10px 20px 10px 20px",
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid #bdbebf",
        color: "#112950",
    },
    presBody: {
        backgroundColor: "#fff",
        display: "flex",
        height: "fit-content",
    },
    presBodyLeft: {
        padding: "10px 20px 10px 20px",
        width: "20%",
        color: "#112950",
        borderRight: "1px solid #bdbebf",
        height: "auto",
    },
    presLeftSmallBlock: {
        minHeight: 100,
        marginBottom: 10,
    },
    presBodyRight: {
        padding: "10px 20px 10px 20px",
        width: "80%",
    },
    presTable: {
        padding: "10px 20px 10px 20px",
        minHeight: "50%",
    },
    presTableHead: {
        width: "100%",
        borderCollapse: "collapse",
    },
    presTableHeadTr: {
        color: "#112950",
        height: 40,
        fontSize: 16,
        borderBottom: "1px solid #EAEBEC",
    },
    textCapitalized: {
        textTransform: "capitalize",
    },
}));

const useStylesImg = makeStyles({
    list: {
        padding: 0,
    },
    image: {
        width: 200,
        height: "auto",
    },
    signature: {
        width: 100,
        height: "auto",
    },
});

export default Preview;
