import { FC } from "react";
import { SelectInput } from "react-admin";
import { useFormState } from "react-final-form";

type DistrictInputProps = {
    locations: any;
    setLocations: (locations) => void;
    [key: string]: any;
};

const LabDistrictInput: FC<DistrictInputProps> = ({
    locations,
    setLocations,
    ...rest
}) => {
    const { values } = useFormState();

    const toChoices = (items = []) =>
        items?.map((item) => ({ id: item, name: item }));

    if (!locations) return null;

    return (
        <SelectInput
            choices={
                !!values.userLocation && !!values.userLocation.division
                    ? toChoices(
                          Object.keys(locations[values.userLocation.division])
                      )
                    : []
            }
            {...rest}
        />
    );
};

export default LabDistrictInput;
