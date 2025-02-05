import { IconButton, Tooltip, Typography } from "@material-ui/core";
import { FC } from "react";
import { useFormState } from "react-final-form";

import Divider from "../../../../Divider";
import { ListIcon, SaveIcon } from "../../../../icons";
import InputWithButtonRepeatable from "./InputWithButtonRepeatable";
import TemplateList from "./TemplateList";

type DiagnosisInfoBlockProps = {
    classes: any;
    showTemplateList: any;
    setShowTemplateList: any;
    user: any;
    form: any;
    handleShowTemplateList: (value: string) => void;
    setTemplateDialogOpen: (value) => void;
};

const DiagnosisInfoBlock: FC<DiagnosisInfoBlockProps> = ({
    classes,
    showTemplateList,
    setShowTemplateList,
    user,
    form,
    handleShowTemplateList,
    setTemplateDialogOpen,
}) => {
    const { values } = useFormState();

    return (
        <>
            <div className={classes.positionRelative}>
                <div className={classes.displyFlex}>
                    <Typography variant="h6">Diagnosed Information</Typography>
                    <TemplateList
                        type="dp_medical_test_suggestions"
                        showTemplateList={showTemplateList}
                        setShowTemplateList={setShowTemplateList}
                        user={user}
                        form={form}
                    />
                    <div className={classes.displyFlexWithGap}>
                        <Tooltip title="Select from template" arrow>
                            <IconButton
                                size="small"
                                onClick={() =>
                                    handleShowTemplateList(
                                        "dp_medical_test_suggestions"
                                    )
                                }
                            >
                                <ListIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Save as template" arrow>
                            <IconButton
                                size="small"
                                onClick={() =>
                                    setTemplateDialogOpen({
                                        type: "dp_medical_test_suggestions",
                                        title: "Save Diagnosed Information as Template",
                                        open: true,
                                    })
                                }
                            >
                                <SaveIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <Divider firstLineWidth={100} secondLineWidth={40} />
                <InputWithButtonRepeatable
                    source="dp_medical_test_suggestions"
                    label="Diagnosed Information"
                    form={form}
                    values={values}
                    reference="v1/medicalTest"
                    filteredBy="_name"
                    optionText="mt_name"
                />
            </div>
            <Divider
                firstLineWidth={100}
                secondLineWidth={0}
                style={{
                    margin: "20px 0px",
                }}
            />
        </>
    );
};

export default DiagnosisInfoBlock;
