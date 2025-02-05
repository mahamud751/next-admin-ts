import { SelectInput } from "react-admin";

const ApplicantStatusInput = (props) => (
    <SelectInput
        label="Status"
        choices={[
            { id: "pending", name: "Pending" },
            { id: "shortlisted", name: "Shortlisted" },
            { id: "interviewed", name: "Interviewed" },
            {
                id: "shortlisted interviewed",
                name: "Shortlisted Interviewed",
            },
            { id: "selected", name: "Selected" },
            { id: "not selected", name: "Not Selected" },
            {
                id: "final selected but not joined",
                name: "Final Selected But Not Joined",
            },
            { id: "hired", name: "Hired" },
            { id: "not matched", name: "Not Matched" },
        ]}
        {...props}
    />
);

export default ApplicantStatusInput;
