import { Box, Button } from "@material-ui/core";
import { ShowButton, TopToolbar, useRedirect } from "react-admin";

const SalaryEditActions = ({ basePath, data }) => {
    const redirect = useRedirect();

    const handleCreateAdjustment = () => {
        redirect("create", "/v1/salary", undefined, undefined, {
            salaryRecord: data,
        });
    };

    return (
        <TopToolbar>
            <Box>
                <Button color="primary" onClick={handleCreateAdjustment}>
                    Create Adjustment
                </Button>
                <ShowButton basePath={basePath} record={data} />
            </Box>
        </TopToolbar>
    );
};

export default SalaryEditActions;
