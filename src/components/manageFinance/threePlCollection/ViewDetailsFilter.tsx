import { SelectInput, SimpleForm } from "react-admin";
import ViewDetailsExport from "./ViewDetailsExport";

type Props = {
    onChange: (e: any) => void;
    settlement_status?: string;
};

export default function ViewDetailsFilter({
    onChange,
    settlement_status,
}: Props) {
    return (
        <div>
            <SimpleForm toolbar={false}>
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <SelectInput
                        source="settlement_status"
                        label="Settlement Status"
                        variant="outlined"
                        onChange={onChange}
                        choices={[
                            { id: "", name: "All" },
                            { id: "settled", name: "Settled" },
                            {
                                id: "partially_settled",
                                name: "Partially Settled",
                            },
                        ]}
                        helperText={false}
                        size="small"
                        style={{ width: "200px" }}
                    />
                    <ViewDetailsExport settlement_status={settlement_status} />
                </div>
            </SimpleForm>
        </div>
    );
}
