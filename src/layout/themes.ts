import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#008069",
      contrastText: "#ffffff", // optional, you can customize this if needed
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
    mode: "light",
  },
  shape: {
    borderRadius: 5,
  },
  spacing: 8, // define the spacing unit (default is 8px)
  components: {
    //@ts-ignore
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
      styleOverrides: {
        colorSecondary: {
          backgroundColor:
            process.env.REACT_APP_NODE_ENV === "production"
              ? "#008069"
              : "#6348c2",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgb(211,211,211)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: "none",
        },
        root: {
          border: "1px solid #e0e0e3",
          backgroundClip: "padding-box",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          border: "1px solid #EAEBEC",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#10837d50",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: "#EAEBEC",
        },
        head: {
          background: "#F8F9FD",
          borderRadius: "6px 6px 0px 0px",
          fontWeight: 600,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: 16,
          color: "#112950",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          borderTop: "1px solid #E0E4E8",
          borderBottom: "1px solid #E0E4E8",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#008069",
          color: "white",
          boxShadow: "none",
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&:hover:active::after": {
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
    },
    MuiCheckbox: {
      styleOverrides: {
        colorSecondary: {
          "&$checked": {
            color: "#008069",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#f5f5f5",
        },
        barColorPrimary: {
          backgroundColor: "#d7d7d7",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
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
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          "&$disabled": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          border: "none",
        },
        message: {
          color: "#fff",
          fontWeight: 500,
        },
      },
    },
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
});
