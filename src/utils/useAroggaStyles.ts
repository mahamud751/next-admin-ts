import { makeStyles } from "@mui/styles";

/* 
======================================================================
=> Always try to follow tailwindcss naming conventions for class names 
======================================================================
*/

export const useAroggaStyles = makeStyles({
  relative: {
    position: "relative",
  },
  absolute: {
    position: "absolute",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  fontBold: {
    fontWeight: "bold",
  },
  textRed: {
    color: "#F04438",
  },
  textGreen: {
    color: "green",
  },
  textBlack: {
    color: "black",
  },
  textOrange: {
    color: "orange",
  },
  textLeft: {
    textAlign: "left",
  },
  textCenter: {
    textAlign: "center",
  },
  textRight: {
    textAlign: "right",
  },
  textJustify: {
    textAlign: "justify",
  },
  textStart: {
    textAlign: "start",
  },
  textEnd: {
    textAlign: "end",
  },
  bgRed: {
    backgroundColor: "#F04438",
    "&:hover": {
      backgroundColor: "#f58989",
    },
  },
  bgGreen: {
    backgroundColor: "green",
    "&:hover": {
      backgroundColor: "#489641",
    },
  },
  whitespaceNowrap: {
    whiteSpace: "nowrap",
  },
  wFull: {
    width: "100%",
  },
  breakAll: {
    wordBreak: "break-all",
  },
  block: {
    display: "block",
  },
  cursorPointer: {
    cursor: "pointer",
  },
  label: {
    color: "#7C8AA0",
    fontSize: 12,
  },
  labeled: {
    display: "block",
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "12px",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    letterSpacing: "0.00938em",
  },
  labelValue: {
    color: "#112950",
    fontSize: 16,
  },
  inlineArrayInputBorder: {
    border: "1px solid #AAAAAA",
    marginTop: 20,
    padding: "8px 8px 0 8px",
  },
  expandedPanel: {
    "&:hover": {
      backgroundColor: "white !important",
    },
  },
  statusBtn: {
    borderRadius: 42,
    padding: "5px 10px",
    textTransform: "capitalize",
    textAlign: "center",
  },
});
