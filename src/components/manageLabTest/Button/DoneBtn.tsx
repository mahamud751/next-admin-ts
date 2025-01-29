import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

const DoneBtn = ({ handleDoneAction }) => {
  const classes = useStyles();
  return (
    <div className={classes.AddBtn}>
      <Button className={classes.button} onClick={handleDoneAction}>
        DONE
      </Button>{" "}
    </div>
  );
};
const useStyles = makeStyles(() => ({
  AddBtn: {
    margin: "20px 0px",
    display: "flex",
    justifyContent: "end",
  },
  button: {
    marginRight: 10,
    textTransform: "capitalize",
    width: 140,
    cursor: "pointer",
    borderRadius: " 4px",
    color: "white",
    background: "var(--primary-main, #1DA099)",
    boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.05)",
    "&:hover": {
      backgroundColor: "var(--primary-main, #0DA099)",
    },
  },
}));

export default DoneBtn;
