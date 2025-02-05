import { Box, Button, FormControlLabel, Switch } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import { SimpleForm, TextInput } from "react-admin";
import { useRequest } from "../../../hooks";
import ZoneDialog from "./ZoneDialog";

interface CreateZoneProps {
    open: boolean;
    onClose: (val: boolean) => void;
    refetch?: () => void;
    zoneType?: string;
    formType?: string;
    zoneData?: any;
}

const CreateZone: FC<CreateZoneProps> = ({
    open,
    onClose,
    refetch,
    formType,
    zoneType,
    zoneData,
}) => {
    const [zoneName, setZoneName] = useState<any>(zoneData?.z_name);
    const [isActive, setIsActive] = useState(null);

    useEffect(() => {
        if (formType === "edit") {
            setIsActive(zoneData?.z_status === 1 ? true : false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Submit function
    const { isLoading, refetch: handleSubmit } = useRequest(
        formType === "create" ? `/v1/zone` : `/v1/zone/${zoneData?.z_id}`,
        {
            method: "POST",
            body: {
                z_name: zoneName,
                z_status: isActive ? 1 : 0,
                z_exp_name: " ",
                z_type: zoneType,
            },
        },
        {
            onSuccess: () => {
                onClose(false);
                refetch();
            },
        }
    );

    const handleClose = () => {
        onClose(false);
    };

    const validation = (val) => {
        const errors: any = {};
        if (!val.zoneName) {
            errors.zoneName = "Zone name is required";
        }
    };

    const actions = (
        <Box
            style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                padding: 10,
            }}
        >
            <Button
                size="large"
                onClick={() => {
                    onClose(false);
                }}
                color="primary"
                variant="outlined"
                disabled={isLoading}
                style={{
                    width: "48%",
                    marginRight: 20,
                    color: "red",
                    border: "1px solid red",
                }}
            >
                Close
            </Button>
            <Button
                type="submit"
                autoFocus
                size="large"
                onClick={handleSubmit}
                color="primary"
                variant="contained"
                disabled={isLoading || zoneName === ""}
                style={{ width: "48%" }}
            >
                {formType === "edit" ? "Update" : "Confirm"}
            </Button>
        </Box>
    );

    const content = (
        <div>
            <SimpleForm
                toolbar={false}
                validate={validation}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                    }
                }}
            >
                <TextInput
                    source="zoneName"
                    placeholder="Zone name"
                    variant="outlined"
                    defaultValue={zoneName}
                    onChange={(e) => {
                        setZoneName(e.target.value);
                    }}
                    helperText={false}
                    fullWidth
                />

                <FormControlLabel
                    control={
                        <Switch
                            defaultChecked={isActive}
                            onChange={(e) => {
                                setIsActive(e.target.checked);
                            }}
                            name={"is-active"}
                            color="primary"
                        />
                    }
                    label="Is Active"
                />
            </SimpleForm>
        </div>
    );

    return (
        <ZoneDialog
            open={open}
            onClose={handleClose}
            title={formType === "edit" ? "Update Zone" : "Create Zone"}
            content={content}
            actions={actions}
        />
    );
};

export default CreateZone;
