import { defaultTheme } from "react-admin";
export const lightTheme = {
  ...defaultTheme,
  palette: {
    primary: {
      main: "#008069",
    },
    secondary: {
      light: "#5f5fc4",
      main: "#4f3cc9",
      dark: "#001064",
      contrastText: "#fff",
    },
    background: {
      default: "#fcfcfe",
    },
    type: "light" as "light",
  },
  shape: {
    borderRadius: 5,
  },
  sidebar: {
    width: 250,
  },
  overrides: {
    RaListToolbar: {
      toolbar: {
        marginTop: 25,
      },
    },
    RaMenuItemLink: {
      icon: {
        color: "#969bad",
      },
      active: {
        color: "#008069",
      },
    },
    RaSimpleFormIterator: {
      form: {
        flex: "none",
      },
      line: {
        borderBottom: "none",
      },
    },
    RaFileField: {
      root: {
        "& a": {
          color: "#008069",
        },
      },
    },
    RaBulkActionsToolbar: {
      toolbar: {
        zIndex: 10,
      },
    },
    MuiAppBar: {
      colorSecondary: {
        backgroundColor:
          process.env.REACT_APP_NODE_ENV === "production"
            ? "#008069"
            : "#6348c2",
      },
    },
    MuiMenuItem: {
      root: {
        "&:hover": {
          backgroundColor: "rgb(211,211,211)",
        },
      },
    },
    MuiPaper: {
      elevation1: {
        boxShadow: "none",
      },
      root: {
        border: "1px solid #e0e0e3",
        backgroundClip: "padding-box",
      },
    },
    MuiTable: {
      root: {
        border: "1px solid #EAEBEC",
      },
    },
    MuiTableRow: {
      root: {
        "&:hover": {
          backgroundColor: "#10837d50",
        },
      },
    },
    MuiTableCell: {
      root: {
        borderBottomColor: "#EAEBEC",
      },
      head: {
        background: "#F8F9FD",
        borderRadius: "6px 6px 0px 0px",
        fontWeight: 600,
      },
    },
    MuiDialogTitle: {
      root: {
        fontWeight: 600,
        fontSize: 16,
        color: "#112950",
      },
    },
    MuiDialogContent: {
      root: {
        borderTop: "1px solid #E0E4E8",
        borderBottom: "1px solid #E0E4E8",
      },
    },
    MuiButton: {
      contained: {
        backgroundColor: "#008069",
        color: "white",
        boxShadow: "none",
      },
    },
    MuiButtonBase: {
      root: {
        "&:hover:active::after": {
          // recreate a static ripple color
          // use the currentColor to make it work both for outlined and contained buttons
          // but to dim the background without dimming the text,
          // put another element on top with a limited opacity
          content: '""',
          display: "block",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "currentColor",
          opacity: 0.3,
          borderRadius: "inherit",
        },
      },
    },
    MuiCheckbox: {
      colorSecondary: {
        "&$checked": {
          color: "#008069",
        },
      },
    },
    MuiLinearProgress: {
      colorPrimary: {
        backgroundColor: "#f5f5f5",
      },
      barColorPrimary: {
        backgroundColor: "#d7d7d7",
      },
    },
    MuiTextField: {
      root: {
        "& .MuiFormLabel-root": {
          "&.Mui-focused": {
            color: " #3ECBA5",
          },
        },
        "& .MuiInputLabel-root": { color: "#7C8AA0" },
        "& .MuiOutlinedInput-root": {
          "& > fieldset": { borderColor: "#CED4DA" },
          "&.Mui-disabled": {
            backgroundColor: "#F4F4F4",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#008069",
            borderWidth: 1,
          },
          "&:hover fieldset": {
            borderColor: "#008069",
            border: "1px solid #3ECBA5",
          },
        },
      },
    },
    MuiFilledInput: {
      root: {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        "&$disabled": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      },
    },
    MuiSnackbarContent: {
      root: {
        border: "none",
      },
      message: {
        color: "#fff",
        fontWeight: 500,
      },
    },
  },
  props: {
    MuiButtonBase: {
      // disable ripple for perf reasons
      disableRipple: true,
    },
  },
};
