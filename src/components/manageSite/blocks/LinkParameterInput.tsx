import { makeStyles } from "@material-ui/core/styles";
import { TextInput } from "react-admin";

import InlineArrayInput from "../../InlineArrayInput";

const LinkParameterInput = ({ getSource, scopedFormData }) => {
    const classes = useStyles();

    return (
        <>
            <span className={classes.label}>Link Parameter</span>
            <InlineArrayInput
                source={getSource("link_parameter")}
                record={scopedFormData}
                label=""
                addButtonLabel="Add Parameter"
                disableReordering
            >
                <TextInput
                    source="key"
                    label="Key"
                    variant="outlined"
                    helperText={false}
                    multiline
                    fullWidth
                />
                <TextInput
                    source="value"
                    label="Value"
                    variant="outlined"
                    helperText={false}
                    multiline
                    fullWidth
                />
            </InlineArrayInput>
        </>
    );
};

export default LinkParameterInput;

const useStyles = makeStyles({
    label: {
        position: "relative",
        color: "rgba(0, 0, 0, 0.54)",
        fontSize: 12,
        fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
        letterSpacing: "0.00938em",
        top: 14,
    },
});
