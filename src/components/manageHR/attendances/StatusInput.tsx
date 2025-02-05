import { SelectInput } from "react-admin";

import { useGetTaxonomiesByVocabulary } from "@/hooks";
import { capitalizeFirstLetterOfEachWord } from "@/utils/helpers";

const choiceFormatter = (types, label) => {
  return !!types?.length
    ? types.map(({ t_machine_name, t_title }) => ({
        id: t_machine_name,
        name: `${label} - ${capitalizeFirstLetterOfEachWord(t_title)}`,
      }))
    : [];
};

const StatusInput = (props) => {
  const attendanceStatusTypes = useGetTaxonomiesByVocabulary({
    fetchKey: "attendance_status",
  });
  const holidayTypes = useGetTaxonomiesByVocabulary({
    fetchKey: "holiday_type",
  });
  const leaveTypes = useGetTaxonomiesByVocabulary({ fetchKey: "leave_type" });

  return (
    <SelectInput
      {...props}
      label="Status"
      choices={[
        ...choiceFormatter(attendanceStatusTypes, "Attendance"),
        ...choiceFormatter(holidayTypes, "Holiday"),
        ...choiceFormatter(leaveTypes, "Leave"),
      ]}
    />
  );
};

export default StatusInput;
