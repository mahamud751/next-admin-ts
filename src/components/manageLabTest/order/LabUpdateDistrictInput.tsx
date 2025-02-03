import { FC } from "react";
import { SelectInput } from "react-admin";
import { useFormState } from "react-final-form";

type DistrictInputProps = {
    locations: any;
    actionType?: any;
    setLocations: (locations) => void;
    [key: string]: any;
};

const LabUpdateDistrictInput: FC<DistrictInputProps> = ({
    locations,
    actionType = "edit",
    setLocations,
    ...rest
}) => {
    const { values } = useFormState();

    if (!locations) return null;

    const toChoices = (items = []) =>
        items?.map((item) => ({ id: item, name: item }));

    const division =
        actionType === "create"
            ? values?.l_division
            : values?.full_shipping_address?.l_division;

    return (
        <SelectInput
            choices={
                !!division ? toChoices(Object.keys(locations[division])) : []
            }
            {...rest}
        />
    );
};

export default LabUpdateDistrictInput;
