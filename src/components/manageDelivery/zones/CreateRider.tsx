import { Box, Button, Chip } from "@material-ui/core";
import { FC, useState } from "react";
import {
    AutocompleteInput,
    ReferenceInput,
    SimpleForm,
    TextInput,
} from "react-admin";
import { useRequest } from "../../../hooks";
import ZoneDialog from "./ZoneDialog";

interface CreateRiderProps {
    open: boolean;
    onClose: (val: boolean) => void;
    zone: any;
    zoneType: string;
    refetchAfterSuccess: () => void;
}

const CreateRider: FC<CreateRiderProps> = ({
    open,
    onClose,
    zone,
    zoneType,
    refetchAfterSuccess,
}) => {
    const [selectedRider, setSelectedRider] = useState<any>(null);
    const [shiftSchedule, setShiftSchedule] = useState(null);
    const [addedRiders, setAddedRiders] = useState<any[]>([]);

    const handleClose = () => {
        onClose(false);
    };

    const handleAddRider = (item) => {
        // Check for duplicate selection
        const riderCheck = addedRiders?.map((d: any) => d?.value);
        if (riderCheck?.includes(item?.u_id)) return;

        setAddedRiders([
            ...addedRiders,
            { name: item?.u_name, value: item?.u_id },
        ]);
    };

    const handleRemoveRider = (index) => {
        setAddedRiders(addedRiders.filter((_, i) => i !== index));
    };

    // POST method
    const { isLoading, refetch: handleSubmit } = useRequest(
        `/v1/riderZone/`,
        {
            method: "POST",
            body: {
                rz_zone_id: zone?.z_id,
                rz_rider_id:
                    addedRiders?.length > 1
                        ? addedRiders?.map((d: any) => d?.value)?.toString()
                        : addedRiders[0]?.value,
                rz_status: 1,
            },
        },
        {
            onSuccess: () => {
                onClose(false);
                refetchAfterSuccess();
            },
        }
    );

    const content = (
        <div>
            <SimpleForm toolbar={false}>
                <TextInput
                    source="zoneName"
                    placeholder="Zone name"
                    variant="outlined"
                    defaultValue={
                        zoneType === "regular" ? zone?.z_name : zone?.ez_name
                    }
                    helperText={false}
                    fullWidth
                    disabled
                />

                <ReferenceInput
                    source="rider"
                    label="Rider"
                    variant="outlined"
                    helperText={false}
                    reference="v1/users/delivery-man"
                    filter={{
                        shift_type: "all",
                        _shift_schedule_id: shiftSchedule,
                    }}
                    defaultValue={selectedRider}
                    onSelect={(item) => {
                        setSelectedRider({
                            name: item?.u_name,
                            value: item?.u_id,
                        });
                        handleAddRider(item);
                    }}
                    fullWidth
                >
                    <AutocompleteInput
                        matchSuggestion={() => true}
                        optionText={(value) =>
                            !!value?.bag_assigned
                                ? `${value?.u_name}`
                                : value?.u_name
                        }
                        options={{
                            InputProps: {
                                multiline: true,
                            },
                        }}
                        resettable
                    />
                </ReferenceInput>

                <Box
                    style={{
                        marginTop: 12,
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 6,
                        width: "100%",
                    }}
                >
                    {addedRiders.map((rider, index) => (
                        <Chip
                            key={index}
                            variant="outlined"
                            size="small"
                            onDelete={() => handleRemoveRider(index)}
                            label={rider.name}
                        />
                    ))}
                </Box>
                <Box
                    style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        padding: 10,
                        marginTop: 16,
                    }}
                >
                    <Button
                        size="large"
                        onClick={handleClose}
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
                        autoFocus
                        size="large"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        color="primary"
                        variant="contained"
                        style={{ width: "48%" }}
                    >
                        Confirm
                    </Button>
                </Box>
            </SimpleForm>
        </div>
    );

    const actions = <></>;

    return (
        <ZoneDialog
            open={open}
            onClose={handleClose}
            title="Add Rider"
            content={content}
            actions={actions}
        />
    );
};

export default CreateRider;
