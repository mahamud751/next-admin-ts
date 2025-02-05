import { AutocompleteInput, ReferenceInput } from "react-admin";

const TemplateList = ({
    showTemplateList,
    user,
    form,
    type,
    setShowTemplateList,
}) => (
    <div
        style={{
            position: "absolute",
            right: 0,
            top: 33,
            backgroundColor: "#f8f9fd",
            padding: 10,
            zIndex: 2,
            boxShadow: "0px 0px 5px 0px #e0e0e0",
            borderRadius: 5,
            display: !!showTemplateList[type] ? "block" : "none",
        }}
    >
        <ReferenceInput
            source={type + "_id"}
            label="Select Template"
            variant="outlined"
            reference="v1/template"
            perPage={25}
            filter={{
                _type: type,
                t_doctor_id: user?.u_id,
            }}
            onSelect={(e) => {
                form.change(type, e.t_template);
                setShowTemplateList({ ...showTemplateList, [type]: false });
            }}
            onBlur={() => {
                setShowTemplateList({ ...showTemplateList, [type]: false });
            }}
            sort={{ field: "t_name", order: "ASC" }}
            resettable
            fullWidth
        >
            <AutocompleteInput
                matchSuggestion={() => true}
                helperText={false}
                optionText="t_name"
                optionValue="t_id"
            />
        </ReferenceInput>
    </div>
);

export default TemplateList;
