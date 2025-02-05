import { IconButton, Tooltip, Typography } from "@material-ui/core";
import { FC } from "react";
import { SelectInput, TextInput } from "react-admin";

import CustomAutoComplete from "../../../../CustomAutoComplete";
import Divider from "../../../../Divider";
import { ListIcon, SaveIcon } from "../../../../icons";
import FormRepeter from "./FormRepeter";
import TemplateList from "./TemplateList";

type ChifComplaintsBlockProps = {
    classes: any;
    showTemplateList: any;
    setShowTemplateList: any;
    user: any;
    form: any;
    handleShowTemplateList: (value: string) => void;
    setTemplateDialogOpen: (value) => void;
};

const ChifComplaintsBlock: FC<ChifComplaintsBlockProps> = ({
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
                <Typography variant="h6">
                    Cheif Complaints / Symptoms
                </Typography>
                <TemplateList
                    type="dp_patient_complaints"
                    user={user}
                    form={form}
                    showTemplateList={showTemplateList}
                    setShowTemplateList={setShowTemplateList}
                />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                    }}
                >
                    <Tooltip title="Select from template" arrow>
                        <IconButton
                            size="small"
                            onClick={() =>
                                handleShowTemplateList("dp_patient_complaints")
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
                                    type: "dp_patient_complaints",
                                    title: "Save Chief Complaints as Template",
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
            <FormRepeter
                classes={classes}
                name="dp_patient_complaints"
                label={false}
            >
                <CustomAutoComplete
                    source="complaints"
                    label="Complaints"
                    variant="outlined"
                    placeholder="Complaints"
                    paranetName="dp_patient_complaints"
                    filteredBy="_complaints"
                    reference="v1/patientComplaint"
                    optionText="pc_complaints"
                    optionValue="pc_complaints"
                    style={{ minWidth: 150 }}
                />
                <TextInput
                    source="time"
                    label="Time"
                    variant="outlined"
                    helperText={false}
                    type="number"
                    fullWidth
                />
                <SelectInput
                    source="d_m"
                    label="Duration"
                    variant="outlined"
                    style={{ minWidth: 100 }}
                    choices={[
                        { id: "Days", name: "Days" },
                        { id: "Months", name: "Months" },
                    ]}
                    helperText={false}
                    resettable
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

export default ChifComplaintsBlock;
