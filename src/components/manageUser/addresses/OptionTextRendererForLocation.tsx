import { RaRecord as Record } from "react-admin";

const LocationOptionTextRenderer = ({ record }: { record?: Record }) => {
  if (!record.l_id) return;

  return (
    <span>
      {!!record
        ? `${record.l_division} -> ${record.l_district} -> ${record.l_area}`
        : ""}
    </span>
  );
};

export default LocationOptionTextRenderer;
