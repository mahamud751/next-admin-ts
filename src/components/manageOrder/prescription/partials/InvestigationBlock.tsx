import { IconButton, Tooltip, Typography } from "@material-ui/core";
import { FC } from "react";
import { useFormState } from "react-final-form";

import Divider from "../../../../Divider";
import { ListIcon, SaveIcon } from "../../../../icons";
import InputWithButtonRepeatable from "./InputWithButtonRepeatable";
import TemplateList from "./TemplateList";

type InvestigationBlockProps = {
    classes: any;
    showTemplateList: any;
    setShowTemplateList: any;
    user: any;
    form: any;
    handleShowTemplateList: (value: string) => void;
    setTemplateDialogOpen: (value: any) => void;
};

const InvestigationInfoBlock: FC<InvestigationBlockProps> = ({
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
                    <Typography variant="h6">
                        Investigation information
                    </Typography>
                    <TemplateList
                        type="dp_investigations"
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
                                    handleShowTemplateList("dp_investigations")
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
                                        type: "dp_investigations",
                                        title: "Save Investigation Information as Template",
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
                    source="dp_investigations"
                    label="Investigation"
                    form={form}
                    values={values}
                />
            </div>
        </>
    );
};

export default InvestigationInfoBlock;
