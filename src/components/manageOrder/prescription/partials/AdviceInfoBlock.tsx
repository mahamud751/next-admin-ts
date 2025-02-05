import { IconButton, Tooltip, Typography } from "@material-ui/core";
import { FC } from "react";
import { useFormState } from "react-final-form";

import Divider from "../../../../Divider";
import { ListIcon, SaveIcon } from "../../../../icons";
import InputWithButtonRepeatable from "./InputWithButtonRepeatable";
import TemplateList from "./TemplateList";

type AdviceInfoBlockProps = {
    classes: any;
    showTemplateList: any;
    setShowTemplateList: any;
    user: any;
    form: any;
    handleShowTemplateList: (value: string) => void;
    setTemplateDialogOpen: (value) => void;
};

const AdviceInfoBlock: FC<AdviceInfoBlockProps> = ({
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
            <div
                className={classes.positionRelative}
                style={{
                    width: "50%",
                    marginTop: 20,
                }}
            >
                <div className={classes.displyFlex}>
                    <Typography variant="h6">Advice information</Typography>
                    <TemplateList
                        type="dp_advise_info"
                        user={user}
                        form={form}
                        showTemplateList={showTemplateList}
                        setShowTemplateList={setShowTemplateList}
                    />
                    <div className={classes.displyFlexWithGap}>
                        <Tooltip title="Select from template" arrow>
                            <IconButton
                                size="small"
                                onClick={() =>
                                    handleShowTemplateList("dp_advise_info")
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
                                        type: "dp_advise_info",
                                        title: "Save Advice Information as Template",
                                        open: true,
                                    })
                                }
                            >
                                <SaveIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <Divider
                    firstLineWidth={100}
                    secondLineWidth={40}
                    miniLineColor="#008069"
                />

                <InputWithButtonRepeatable
                    source="dp_advise_info"
                    label="Advice For You"
                    form={form}
                    values={values}
                    translate={true}
                />
            </div>
        </>
    );
};

export default AdviceInfoBlock;
