import { FC } from "react";
import { SelectInput, TextInput } from "react-admin";

type LinkInputProps = {
    isExternal: 0 | 1;
    choices: object[];
    optionText: string;
    optionValue: string;
    [key: string]: any;
};

const LinkInput: FC<LinkInputProps> = ({
    isExternal,
    choices = [],
    optionText,
    optionValue,
    ...rest
}) => {
    // @ts-ignore
    if (isExternal) return <TextInput {...rest} />;

    return (
        <SelectInput
            {...rest}
            choices={choices}
            optionText={optionText}
            optionValue={optionValue}
            allowEmpty
        />
    );
};

export default LinkInput;
