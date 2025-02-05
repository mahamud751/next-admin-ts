import { IconButton, Tooltip, Typography } from "@material-ui/core";
import { FC } from "react";
import { TextInput } from "react-admin";

import CustomAutoComplete from "../../../../CustomAutoComplete";
import Divider from "../../../../Divider";
import { ListIcon, SaveIcon } from "../../../../icons";
import FormRepeter from "./FormRepeter";
import TemplateList from "./TemplateList";

type OEInfoBlockProps = {
    classes: any;
    showTemplateList: any;
    setShowTemplateList: any;
    user: any;
    form: any;
    handleShowTemplateList: (value: string) => void;
    setTemplateDialogOpen: (value) => void;
};

const OEInfoBlock: FC<OEInfoBlockProps> = ({
    classes,
    showTemplateList,
    setShowTemplateList,
    user,
    form,
    handleShowTemplateList,
    setTemplateDialogOpen,
}) => (
    <>
        <div className={classes.positionRelative}>
            <div className={classes.displyFlex}>
                <Typography variant="h6"> O/E info</Typography>
                <TemplateList
                    type="dp_patient_oe"
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
                                handleShowTemplateList("dp_patient_oe")
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
                                    type: "dp_patient_oe",
                                    title: "Save O/E info as Template",
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
            <FormRepeter classes={classes} name="dp_patient_oe" label={false}>
                <CustomAutoComplete
                    source="o_e"
                    label="O/E"
                    variant="outlined"
                    placeholder="Complaints"
                    paranetName="dp_patient_complaints"
                    filteredBy="_name"
                    reference="v1/medicalTest"
                    optionText="mt_name"
                    optionValue="mt_name"
                    joinFields={{
                        src: "unit",
                        dst: "mt_result_unit",
                    }}
                    style={{ minWidth: 150 }}
                    fullWidth
                />
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

export default OEInfoBlock;
