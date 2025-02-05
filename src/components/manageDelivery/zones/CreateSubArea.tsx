import { Box, Button, Chip, FormControlLabel, Switch } from "@material-ui/core";
import { FC, useState } from "react";
import {
    AutocompleteInput,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    TextInput,
    required,
    usePermissions,
} from "react-admin";
import { useRequest } from "../../../hooks";
import ZoneDialog from "./ZoneDialog";

interface CreateSubAreaProps {
    open: boolean;
    onClose: (val: boolean) => void;
    locationData?: any;
    refetchAfterSuccess: () => void;
    zoneType: string;
    zoneData: any;
}

const CreateSubArea: FC<CreateSubAreaProps> = ({
    open,
    onClose,
    locationData,
    zoneData,
    refetchAfterSuccess,
    zoneType,
}) => {
    const { permissions } = usePermissions();
    // Toggle state whether to create a new subarea or not
    const [showCreateForm, setShowCreateForm] = useState(false);

    // initial state of subarea that are selected
    const [subArea, setSubArea] = useState<any>([]);

    // handling multiple subarea
    const handleSubAreaAdd = (item) => {
        // Check for duplicate selection
        const selectedSubAreaCheck = subArea?.map((d: any) => d?.value);
        if (selectedSubAreaCheck?.includes(item?.sa_id)) return;

        setSubArea([...subArea, { name: item?.sa_title, value: item?.sa_id }]);
    };

    // removing particular sub area from the selected subarea
    const handleRemoveSubArea = (index) => {
        setSubArea(subArea.filter((_, i) => i !== index));
    };

    // input states to create a new sub area, when showCreateForm is open
    const [formInput, setFormInput] = useState({
        sa_title: "",
        sa_l_id: locationData?.l_id,
        sa_is_free_delivery: "",
        sa_status: "",
        sa_comment: "",
    });

    // change function for creating a new sub area
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormInput((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    /*
        This is api calls whenever a existing subarea is added
    */
    const { isLoading, refetch: handleSubmit } = useRequest(
        `/v1/multipleSubAreaUpdate`,
        {
            method: "POST",
            body:
                zoneType === "regular"
                    ? {
                          sa_status: 1,
                          sa_l_id: locationData?.l_id,
                          sa_zone_id: zoneData?.z_id,
                          sa_ids:
                              subArea?.length > 1
                                  ? subArea
                                        ?.map((d: any) => d?.value)
                                        ?.toString()
                                  : subArea[0]?.value,
                      }
                    : {
                          sa_status: 1,
                          sa_l_id: locationData?.l_id,
                          sa_exp_zone_id: zoneData?.z_id,
                          sa_ids:
                              subArea?.length > 1
                                  ? subArea
                                        ?.map((d: any) => d?.value)
                                        ?.toString()
                                  : subArea[0]?.value,
                      },
        },
        {
            onSuccess: () => {
                onClose(false);
                refetchAfterSuccess();
            },
        }
    );

    /* 
        This function calls when creating a new subarea.         
     */

    const { isLoading: isNewCreateLoading, refetch: handleNewCreateSubmit } =
        useRequest(
            `/v1/subArea`,
            {
                method: "POST",
                body:
                    zoneType === "regular"
                        ? {
                              ...formInput,
                              sa_zone_id: zoneData?.z_id,
                          }
                        : {
                              ...formInput,
                              sa_exp_zone_id: zoneData?.z_id,
                          },
            },
            {
                onSuccess: (data) => {
                    setSubArea([
                        {
                            name: data?.data?.sa_title,
                            value: data?.data?.sa_id,
                        },
                    ]);
                    onClose(false);
                    refetchAfterSuccess();
                },
            }
        );

    const handleClose = () => {
        onClose(false);
    };

    const content = (
        <div>
            {permissions?.includes("subAreaCreate") && (
                <FormControlLabel
                    control={
                        <Switch
                            checked={showCreateForm}
                            onChange={() => {
                                setShowCreateForm(!showCreateForm);
                                setSubArea([]);
                            }}
                            name="gilad"
                            color="primary"
                        />
                    }
                    label="Create new"
                />
            )}
            <SimpleForm toolbar={false}>
                <TextInput
                    source="zoneName"
                    placeholder="Zone name"
                    variant="outlined"
                    defaultValue={zoneData?.z_name}
                    helperText={false}
                    fullWidth
                    disabled
                />
                <TextInput
                    source="shipping_area"
                    placeholder="Shipping Area"
                    variant="outlined"
                    defaultValue={locationData?.l_area}
                    helperText={false}
                    fullWidth
                    disabled
                />

                {/* When create toggle is off */}
                {!showCreateForm && (
                    <ReferenceInput
                        source="sub_area"
                        label="Sub Area"
                        helperText={false}
                        reference="v1/subArea"
                        filter={{}}
                        variant="outlined"
                        onSelect={(area) => {
                            handleSubAreaAdd(area);
                        }}
                        fullWidth
                    >
                        <AutocompleteInput
                            matchSuggestion={() => true}
                            optionText={(item: any) =>
                                `${
                                    item?.sa_area ? item?.sa_area + " -> " : ""
                                } ${item?.sa_title}`
                            }
                            resettable
                        />
                    </ReferenceInput>
                )}

                {/* When create toggle is on */}
                {showCreateForm && (
                    <>
                        <TextInput
                            source="sa_title"
                            label="Title"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                            validate={[required()]}
                            helperText={false}
                        />
                        <SelectInput
                            source="sa_is_free_delivery"
                            label="Free Delivery"
                            variant="outlined"
                            choices={[
                                { id: "1", name: "Yes" },
                                { id: "0", name: "No" },
                            ]}
                            helperText={false}
                            validate={[required()]}
                            fullWidth
                            onChange={(e) => handleChange(e)}
                        />
                        <SelectInput
                            source="sa_status"
                            label="Status"
                            variant="outlined"
                            choices={[
                                { id: "1", name: "Active" },
                                { id: "0", name: "InActive" },
                            ]}
                            helperText={false}
                            validate={[required()]}
                            fullWidth
                            onChange={(e) => handleChange(e)}
                        />
                        <TextInput
                            source="sa_comment"
                            label="Comment"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => handleChange(e)}
                        />
                    </>
                )}

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
                    {!showCreateForm &&
                        subArea.map((area, index) => (
                            <Chip
                                key={index}
                                variant="outlined"
                                size="small"
                                onDelete={() => handleRemoveSubArea(index)}
                                label={area.name}
                            />
                        ))}
                </Box>
            </SimpleForm>
        </div>
    );

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
                onClick={handleClose}
                color="primary"
                variant="outlined"
                style={{
                    width: "48%",
                    marginRight: 20,
                    color: "red",
                    border: "1px solid red",
                }}
                disabled={isLoading || isNewCreateLoading}
            >
                Close
            </Button>
            <Button
                autoFocus
                size="large"
                onClick={showCreateForm ? handleNewCreateSubmit : handleSubmit}
                color="primary"
                variant="contained"
                style={{ width: "48%" }}
                disabled={
                    isLoading ||
                    isNewCreateLoading ||
                    (!showCreateForm && subArea?.length < 1)
                }
            >
                Confirm
            </Button>
        </Box>
    );

    return (
        <ZoneDialog
            open={open}
            onClose={handleClose}
            title="Add Sub Area"
            content={content}
            actions={actions}
        />
    );
};

export default CreateSubArea;
