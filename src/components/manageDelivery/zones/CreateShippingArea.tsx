import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Switch,
} from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import {
    AutocompleteInput,
    NumberInput,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    TextInput,
    required,
} from "react-admin";

import { useRequest } from "../../../hooks";
import { Status } from "../../../utils/enums";
import { logger } from "../../../utils/helpers";
import { httpClient } from "../../../utils/http";
import TaxonomiesByVocabularyInput from "../../TaxonomiesByVocabularyInput";
import ZoneDialog from "./ZoneDialog";

interface CreateShippingAreaProps {
    open: boolean;
    onClose: (val: boolean) => void;
    zoneData?: any;
    refetchAfterSuccess?: () => void;
    zoneType: string;
}

const CreateShippingArea: FC<CreateShippingAreaProps> = ({
    open,
    onClose,
    zoneData,
    refetchAfterSuccess,
    zoneType,
}) => {
    const [shippingArea, setShippingArea] = useState<any>("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [inputValue, setInputValue] = useState(false);
    const [message, setMessage] = useState("");
    const [subArea, setSubArea] = useState<any>("");
    const [selectedSubArea, setSelectedSubArea] = useState<any>([]);

    // input states
    const [formInput, setFormInput] = useState({
        l_division: "Dhaka",
        l_district: "Dhaka City",
        l_zone: "",
        l_area: "",
        l_postcode: "",
        l_redx_area_id: "",
        l_pathao_city_id: "",
        l_pathao_zone_id: "",
        l_courier: "arogga",
        l_de_id: "",
        l_lat: "",
        l_long: "",
    });

    const [logistic_config_form, setLogistic_config_form] = useState({
        redx_area_id: "",
        redx_status: 0,
        pathao_city_id: "",
        pathao_zone_id: "",
        pathao_status: 0,
        ecourier_district: "",
        ecourier_thana: "",
        ecourier_area: "",
        ecourier_postcode: "",
        ecourier_hub: "",
        ecourier_status: 1,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormInput((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleLogisticConfigChange = (e) => {
        const { name, value } = e.target;
        setLogistic_config_form((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    /* ====================================================================================================
        To match if the inputted shipping area name already exist or not
    =======================================================================================================*/
    const [locations, setLocations] = useState(null);
    useEffect(() => {
        httpClient("/v1/allLocations/", { isBaseUrl: true })
            .then(({ json }: any) => {
                if (json.status === Status.SUCCESS) {
                    setLocations(json.data);
                    sessionStorage.setItem(
                        "locations",
                        JSON.stringify(json.data)
                    );
                }
            })
            .catch((err) => logger(err));
    }, []);

    const handleInputChangeOnCreate = (event) => {
        const existingLocation = locations["Dhaka"]["Dhaka City"];
        const match = filterKeysByValue(existingLocation, event);

        // If there's a match, display a message
        if (match.length !== 0) {
            setInputValue(true);
            //@ts-ignore
            setMessage(match);
        } else {
            setInputValue(false); // Clear the message if there's no match
            // setShowMessage(false);
        }
    };
    function filterKeysByValue(obj, valueToFind) {
        const filteredKeys = [];
        for (const key in obj) {
            if (key.toLowerCase() === valueToFind || key === valueToFind) {
                filteredKeys.push(key);
            }
        }
        return filteredKeys;
    }
    /* =========  Shipping area name match ends ==============================================================================*/

    /* ====================================================================================================
        Get the list of all subareas from the selected location
     =======================================================================================================*/
    useEffect(() => {
        if (shippingArea) {
            httpClient(`/admin/v1/subArea?_l_id=${shippingArea?.l_id}`, {
                isBaseUrl: true,
            })
                .then(({ json }: any) => {
                    if (json.status === Status.SUCCESS) {
                        const formatSubAreaData = json?.data?.map((d: any) => ({
                            id: d?.sa_id,
                            name: d?.sa_title,
                        }));

                        // getting existing subArea in selected shipping area
                        const existingSubAreas = zoneData?.z_locations
                            ?.filter(
                                (d: any) => d?.l_id === shippingArea?.l_id
                            )[0]
                            ?.l_sub_areas?.map((v: any) => ({
                                id: v?.sa_id,
                                name: v?.sa_title,
                            }));
                        // If subarea already exist filter  out the existing one
                        if (existingSubAreas) {
                            const existingIds = new Set(
                                existingSubAreas.map((item) => item?.id)
                            );
                            const updatedSubAreas = formatSubAreaData?.filter(
                                (item) => !existingIds?.has(item?.id)
                            );
                            setSubArea(updatedSubAreas);
                        } else {
                            setSubArea(formatSubAreaData);
                        }
                    }
                })
                .catch((err) => logger(err));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shippingArea]);

    //  removing subareas from the chips
    const handleSubAreaAdd = (e: any) => {
        const id = parseInt(e?.target?.value, 10);
        if (e.target.checked) {
            const idExist = selectedSubArea?.find((el: any) => el === id);
            if (idExist) {
                const updatedIds = selectedSubArea?.filter(
                    (el) => el !== idExist
                );
                setSelectedSubArea(updatedIds);
                return;
            }
            setSelectedSubArea((prev) => [...prev, id]);
        } else {
            const updatedIds = selectedSubArea?.filter((el) => el !== id);
            setSelectedSubArea(updatedIds);
            return;
        }
    };

    //=============== Get the list of all subareas from the selected location ends================================

    const handleClose = () => {
        onClose(false);
    };

    /*
        This is api calls whenever a shipping area (location) needs to add in the location
        If a shipping area (location) is newly created then handleNewCreateSubmit function 
        will be called and right after that this function will be called
    */

    const { isLoading, refetch: handleSubmit } = useRequest(
        `/v1/multipleSubAreaUpdate`,
        {
            method: "POST",
            body:
                zoneType === "regular"
                    ? {
                          sa_status: 1,
                          sa_l_id: shippingArea?.l_id,
                          sa_zone_id: zoneData?.z_id,
                          sa_ids:
                              selectedSubArea?.length > 1
                                  ? selectedSubArea
                                        ?.map((d: any) => d)
                                        ?.toString()
                                  : selectedSubArea[0],
                      }
                    : {
                          sa_status: 1,
                          sa_l_id: shippingArea?.l_id,
                          sa_exp_zone_id: zoneData?.z_id,
                          sa_ids:
                              selectedSubArea?.length > 1
                                  ? selectedSubArea
                                        ?.map((d: any) => d)
                                        ?.toString()
                                  : selectedSubArea[0],
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
        This function calls when creating a new shipping area (location).      
    */
    const { isLoading: createLoading, refetch: handleNewSubmit } = useRequest(
        `/v1/location`,
        {
            method: "POST",
            body: {
                ...formInput,
                l_logistic_config: JSON.stringify({
                    redx: {
                        area_id: logistic_config_form.redx_area_id,
                        // delivery_man_id:
                        //     logistic_config_form.redx_deliveryman_id,
                        status: logistic_config_form.redx_status,
                    },
                    pathao: {
                        city_id: logistic_config_form.pathao_city_id,
                        zone_id: logistic_config_form.pathao_zone_id,
                        // delivery_man_id:
                        //     logistic_config_form.pathao_deliveryman_id,
                        status: logistic_config_form.pathao_status,
                    },
                    ecourier: {
                        district: logistic_config_form.ecourier_district,
                        thana: logistic_config_form.ecourier_thana,
                        area: logistic_config_form.ecourier_area,
                        postcode: logistic_config_form.ecourier_postcode,
                        hub: logistic_config_form.ecourier_hub,
                        status: logistic_config_form.ecourier_status,
                    },
                }),
            },
        },
        {
            onSuccess: (data) => {
                setShippingArea(data?.data);
                // handleSubmit();
                handleSubAreaAddInsideNewSubmit();
            },
        }
    );

    /*
        Sub area add for newly create Location
    */
    const {
        isLoading: subAreaAddLoading,
        refetch: handleSubAreaAddInsideNewSubmit,
    } = useRequest(
        `/v1/subArea/${subArea?.sa_id}`,
        {
            method: "POST",
            body:
                zoneType === "regular"
                    ? {
                          sa_l_id: shippingArea?.l_id,
                          sa_zone_id: zoneData.z_id,
                          sa_status: 1,
                      }
                    : {
                          sa_l_id: shippingArea?.l_id,
                          sa_exp_zone_id: zoneData.z_id,
                          sa_status: 1,
                      },
        },
        {
            onSuccess: () => {
                onClose(false);
                refetchAfterSuccess();
            },
        }
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
                disabled={isLoading || createLoading || subAreaAddLoading}
                color="primary"
                variant="outlined"
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
                color="primary"
                variant="contained"
                style={{ width: "48%" }}
                onClick={handleSubmit}
                disabled={
                    isLoading ||
                    createLoading ||
                    subAreaAddLoading ||
                    selectedSubArea?.length === 0
                }
            >
                Confirm
            </Button>
        </Box>
    );

    const content = (
        <div>
            <>
                <FormControlLabel
                    control={
                        <Switch
                            checked={showCreateForm}
                            onChange={() => {
                                setShowCreateForm(!showCreateForm);
                                setSubArea("");
                                setSelectedSubArea([]);
                            }}
                            name="gilad"
                            color="primary"
                        />
                    }
                    label="Create new"
                />
                {!showCreateForm && (
                    <>
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
                            <ReferenceInput
                                source="shipping_area"
                                label="Shipping Area"
                                helperText={false}
                                reference="v1/location"
                                filter={{
                                    _orderBy: "l_area",
                                    _district: "Dhaka City",
                                    _has_subarea: 1,
                                }}
                                variant="outlined"
                                onSelect={(area) => {
                                    setShippingArea(area);
                                    setSubArea("");
                                    setSelectedSubArea([]);
                                }}
                                validate={[required()]}
                                fullWidth
                            >
                                <AutocompleteInput
                                    matchSuggestion={() => true}
                                    optionText={(item) => `${item?.l_area}`}
                                    resettable
                                />
                            </ReferenceInput>

                            <Box
                                style={{
                                    marginTop: 4,
                                    width: "100%",
                                }}
                            >
                                {shippingArea && subArea?.length < 1 && (
                                    <p style={{ margin: "0px", color: "#666" }}>
                                        All subarea already added
                                    </p>
                                )}
                                {subArea?.length > 0 && subArea && (
                                    <>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => {
                                                setSelectedSubArea(
                                                    subArea?.map(
                                                        (d: any) => d?.id
                                                    )
                                                );
                                            }}
                                            style={{ marginRight: "4px" }}
                                            color="primary"
                                        >
                                            Select All
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => {
                                                setSelectedSubArea([]);
                                            }}
                                            color="primary"
                                        >
                                            Deselect All
                                        </Button>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-start",
                                                alignItems: "center",
                                                flexWrap: "wrap",
                                                gap: 6,
                                                marginTop: 8,
                                            }}
                                        >
                                            {subArea?.map((d: any) => (
                                                <div key={d?.id}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={selectedSubArea.includes(
                                                                    d?.id
                                                                )}
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    handleSubAreaAdd(
                                                                        e
                                                                    );
                                                                }}
                                                                name={d?.name}
                                                                value={d?.id}
                                                                color="primary"
                                                            />
                                                        }
                                                        label={d?.name}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </Box>
                        </SimpleForm>
                    </>
                )}

                {showCreateForm && (
                    <SimpleForm
                        save={showCreateForm ? handleNewSubmit : handleSubmit}
                    >
                        <TextInput
                            source="l_division"
                            label="Division"
                            variant="outlined"
                            defaultValue={formInput.l_division}
                            helperText={false}
                            fullWidth
                            disabled
                        />
                        <TextInput
                            source="l_district"
                            label="District"
                            variant="outlined"
                            defaultValue={formInput.l_district}
                            helperText={false}
                            fullWidth
                            disabled
                        />

                        <TextInput
                            source="l_zone"
                            placeholder="Zone name"
                            variant="outlined"
                            defaultValue={zoneData?.z_name}
                            helperText={false}
                            fullWidth
                            disabled
                        />
                        <TextInput
                            source="l_area"
                            label="Area"
                            variant="outlined"
                            validate={[required()]}
                            fullWidth
                            onChange={(e) => {
                                handleInputChangeOnCreate(e.target.value);
                                handleChange(e);
                            }}
                            helperText={false}
                        />
                        {inputValue && (
                            <span>
                                <strong style={{ color: "green" }}>
                                    {message}
                                </strong>{" "}
                                is already exist.
                            </span>
                        )}

                        <ReferenceInput
                            source="sub_area"
                            label="Sub Area"
                            helperText={false}
                            reference="v1/subArea"
                            filter={{}}
                            validate={[required()]}
                            variant="outlined"
                            onSelect={(area) => {
                                setSubArea(area);
                            }}
                            fullWidth
                        >
                            <AutocompleteInput
                                matchSuggestion={() => true}
                                optionText={(item) => `${item?.sa_title}`}
                                resettable
                            />
                        </ReferenceInput>
                        <NumberInput
                            source="l_postcode"
                            label="Postcode"
                            variant="outlined"
                            fullWidth
                            validate={[required()]}
                            onChange={(e) => handleChange(e)}
                            helperText={false}
                        />

                        <TaxonomiesByVocabularyInput
                            fetchKey="courier"
                            source="l_courier"
                            validate={[required()]}
                            onChange={(e) => handleChange(e)}
                            defaultValue={formInput?.l_courier}
                            label="Courier"
                            fullWidth
                            helperText={false}
                        />
                        <TextInput
                            source="l_de_id"
                            label="Delivery ID"
                            onChange={(e) => handleChange(e)}
                            variant="outlined"
                            fullWidth
                            helperText={false}
                        />
                        <TextInput
                            source="l_lat"
                            label="Latitude"
                            onChange={(e) => handleChange(e)}
                            variant="outlined"
                            fullWidth
                            helperText={false}
                        />
                        <TextInput
                            source="l_long"
                            label="Longitude"
                            onChange={(e) => handleChange(e)}
                            variant="outlined"
                            fullWidth
                            helperText={false}
                        />

                        {/* Logistic config field goes here */}
                        {/* eCourier */}
                        <h5 style={{ marginBottom: "0px" }}>eCourier</h5>
                        <TextInput
                            source="ecourier_district"
                            label="eCourier District"
                            variant="outlined"
                            onChange={(e) => handleLogisticConfigChange(e)}
                            validate={[required()]}
                            fullWidth
                            helperText={false}
                        />
                        <TextInput
                            source="ecourier_thana"
                            label="eCourier Thana"
                            variant="outlined"
                            onChange={(e) => handleLogisticConfigChange(e)}
                            validate={[required()]}
                            fullWidth
                            helperText={false}
                        />
                        <TextInput
                            source="ecourier_area"
                            label="eCourier Area"
                            variant="outlined"
                            onChange={(e) => handleLogisticConfigChange(e)}
                            validate={[required()]}
                            fullWidth
                            helperText={false}
                        />
                        <NumberInput
                            source="ecourier_postcode"
                            label="eCourier Postcode"
                            variant="outlined"
                            onChange={(e) => handleLogisticConfigChange(e)}
                            validate={[required()]}
                            fullWidth
                            helperText={false}
                        />
                        <NumberInput
                            source="ecourier_hub"
                            label="eCourier Hub ID"
                            variant="outlined"
                            onChange={(e) => handleLogisticConfigChange(e)}
                            validate={[required()]}
                            fullWidth
                            helperText={false}
                        />
                        <SelectInput
                            source="ecourier_status"
                            label="eCourier Status"
                            variant="outlined"
                            choices={[
                                { name: "Active", id: 1 },
                                { name: "Inactive", id: 0 },
                            ]}
                            onChange={(e) => handleLogisticConfigChange(e)}
                            // validate={[required()]}
                            fullWidth
                            helperText={false}
                            defaultValue={logistic_config_form?.ecourier_status}
                        />

                        {/* Pathao */}
                        <h5 style={{ marginBottom: "0px" }}>Pathao</h5>
                        <NumberInput
                            source="pathao_city_id"
                            label="Pathao City ID"
                            variant="outlined"
                            onChange={(e) => handleLogisticConfigChange(e)}
                            // validate={[required()]}
                            fullWidth
                            helperText={false}
                        />
                        <NumberInput
                            source="pathao_zone_id"
                            label="Pathao Zone ID"
                            variant="outlined"
                            onChange={(e) => handleLogisticConfigChange(e)}
                            // validate={[required()]}
                            fullWidth
                            helperText={false}
                        />
                        <SelectInput
                            source="pathao_status"
                            label="Pathao Status"
                            variant="outlined"
                            choices={[
                                { name: "Active", id: 1 },
                                { name: "Inactive", id: 0 },
                            ]}
                            onChange={(e) => handleLogisticConfigChange(e)}
                            // validate={[required()]}
                            fullWidth
                            helperText={false}
                            defaultValue={logistic_config_form?.pathao_status}
                        />

                        {/* Redx */}
                        <h5 style={{ marginBottom: "0px" }}>Redx</h5>
                        <NumberInput
                            source="redx_area_id"
                            label="Redx Area ID"
                            variant="outlined"
                            onChange={(e) => handleLogisticConfigChange(e)}
                            // validate={[required()]}
                            fullWidth
                            helperText={false}
                        />
                        <SelectInput
                            source="redx_status"
                            label="Redx Status"
                            variant="outlined"
                            choices={[
                                { name: "Active", id: 1 },
                                { name: "Inactive", id: 0 },
                            ]}
                            onChange={(e) => handleLogisticConfigChange(e)}
                            // validate={[required()]}
                            fullWidth
                            helperText={false}
                            defaultValue={logistic_config_form?.redx_status}
                        />
                    </SimpleForm>
                )}
            </>
        </div>
    );

    return (
        <ZoneDialog
            open={open}
            onClose={handleClose}
            title="Add Shipping Area"
            content={content}
            actions={!showCreateForm ? actions : null}
        />
    );
};

export default CreateShippingArea;
