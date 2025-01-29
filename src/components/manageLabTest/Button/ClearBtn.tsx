import { Clear as ClearIcon } from "@mui/icons-material";

const ClearBtn = ({ handleCloseDialog }) => {
  return (
    <div style={{ display: "flex", justifyContent: "end" }}>
      {/* @ts-ignore */}
      <ClearIcon
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          handleCloseDialog();
        }}
        style={{
          fontSize: 35,
          color: "red",
          marginBottom: 10,
          cursor: "pointer",
        }}
      />
    </div>
  );
};

export default ClearBtn;
