import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import { FC, useEffect, useState } from "react";
import {
  CreateProps,
  FileField,
  FileInput,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Title,
  Toolbar,
  required,
  useNotify,
  useRedirect,
} from "react-admin";
import { usePapaParse } from "react-papaparse";

import FailedDataTable from "@/components/manageFinance/threePlCollection/FailedDataTable";
import { toQueryString } from "@/dataProvider/toQueryString";
import { useDocumentTitle } from "@/hooks";
import { FILE_MAX_SIZE } from "@/utils/constants";
import { Status } from "@/utils/enums";
import { httpClient } from "@/utils/http";
import AroggaBackdrop from "@/components/common/AroggaBackdrop";

const ThreePlCashCollection: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga | 3PL Cash Collection");
  const classes = useStyles();
  const redirect = useRedirect();
  const { readString } = usePapaParse();

  const [isLoading, setIsLoading] = useState(false);
  const [courier, setCourier] = useState("");
  const [refId, setRefId] = useState("");
  const [totalAmount, setTotalAmount] = useState<any>("");

  const notify = useNotify();
  const [convertedCsvToJson, setConvertedCsvToJson] = useState(null);
  const [csvHeader, setCsvHeader] = useState(null);
  const [errResponse, setErrResponse] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const handleFile = (e: any) => {
    if (courier === "") {
      return notify("Please select courier", { type: "error" });
    }
    if (courier === "ecourier") {
      return handleEcourier(e);
    }

    if (courier === "pathao") {
      return handlePathao(e);
    }
  };

  // Convert eCourier files
  const handleEcourier = (csv: any) => {
    readString(csv, {
      worker: true,
      complete: (results: any) => {
        // Checking file if its valid or not
        const chk = results?.data[0];
        if (
          !chk?.includes("REFID") ||
          !chk?.includes("Collected Amount(COD)") ||
          !chk?.includes("Invoice No.")
        ) {
          return notify("Invalid file. Please upload a valid eCourier file", {
            type: "error",
          });
        }
        const data = results?.data?.slice(1); //removing first index from parser
        // Converting custom response
        const formattedData = data?.map((d: any, idx) => ({
          refid: d[0],
          invoiceNo: d[4],
          productPrice: d[7],
          shippingPrice: d[8],
          collectedAmountCod: d[9],
          parcelStatus: d[15],
          paymentDate: d[18],
        }));
        setCsvHeader(results?.data[0]);
        setConvertedCsvToJson(formattedData);
      },
    });
  };

  let currdate = new Date();
  let formattedCurrentDate =
    currdate.getFullYear() +
    "-" +
    String(currdate.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(currdate.getDate()).padStart(2, "0");

  function invoiceContainsAlphabet(str) {
    const regex = /[a-zA-Z]/;
    return regex.test(str);
  }

  // Convert pathao files
  const handlePathao = (csv: any) => {
    readString(csv, {
      worker: true,
      complete: (results: any) => {
        // Checking file if its valid or not
        setErrMsg(null);
        const chk = results?.data[0];
        if (
          !chk?.includes("Consignment_ID") ||
          !chk?.includes("Merchant_Order_ID")
        ) {
          return notify("Invalid file. Please upload a valid pathao file", {
            type: "error",
          });
        }
        const data = results?.data?.slice(1)?.filter((d: any) => d[0] !== ""); //removing first index from parser and also removing any wanted spaces

        // Converting custom response
        const formattedData = data
          ?.map((d: any, idx) =>
            d[2] !== "return" && d[3] !== "0"
              ? {
                  refid: d[0],
                  invoiceNo: d[15],
                  productPrice: d[6],
                  shippingPrice: d[9],
                  collectedAmountCod: d[3],
                  paymentDate: formattedCurrentDate,
                  //   parcelStatus: "Delivered",
                }
              : ""
          )
          ?.filter((d: any) => d !== "");

        const hasInvoiceWithoutAlphabet = formattedData?.filter(
          (d: any) => !invoiceContainsAlphabet(d?.invoiceNo)
        );

        if (hasInvoiceWithoutAlphabet?.length > 0) {
          notify("Invalid invoice number. Please correct and re-upload", {
            type: "error",
          });
          setErrMsg("Invalid invoice number. Please correct and re-upload");
          return setErrResponse(hasInvoiceWithoutAlphabet);
        }
        setCsvHeader(results?.data[0]);
        setConvertedCsvToJson(formattedData);
      },
    });
  };

  const post = () => {
    // file check
    if (courier === "ecourier") {
      if (
        !csvHeader?.includes("REFID") ||
        !csvHeader?.includes("Collected Amount(COD)") ||
        !csvHeader?.includes("Invoice No.")
      ) {
        return notify("Invalid file. Please upload a valid eCourier file", {
          type: "error",
        });
      }
    }
    if (courier === "pathao") {
      if (
        !csvHeader?.includes("Consignment_ID") ||
        !csvHeader?.includes("Merchant_Order_ID")
      ) {
        return notify("Invalid file. Please upload a valid pathao file", {
          type: "error",
        });
      }
    }

    setIsLoading(true);
    httpClient("/v1/thirdPartySubmitCollection", {
      method: "POST",
      body: toQueryString({
        data: JSON.stringify(convertedCsvToJson),
        source: courier,
        totalAmount: totalAmount,
        refId: refId,
      }),
    })
      .then((res: any) => {
        if (res?.json?.status === Status.SUCCESS) {
          setErrMsg(null);
          notify(res?.json?.message, {
            type: "success",
          });
          if (res?.json?.data?.wrongData?.length > 0) {
            return setErrResponse(res?.json?.data?.wrongData);
          }
          redirect("list", "/v1/tplCollection");
          return;
        }
        if (res?.json?.status === Status.FAIL) {
          setErrResponse(res?.json?.data?.wrongData);
          notify(res?.json?.message, {
            type: "error",
          });
          setErrMsg(res?.json?.message);
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // TotalAmount count when file is uploaded
  useEffect(() => {
    if (convertedCsvToJson !== null) {
      const total = convertedCsvToJson
        ?.map(({ collectedAmountCod }) => parseInt(collectedAmountCod, 10) || 0)
        .reduce((acc, value) => acc + value, 0);
      setTotalAmount(total);
    }
  }, [convertedCsvToJson]);

  console.log(errResponse);
  const CustomToolbar = (props) => (
    <Toolbar {...props}>
      {errResponse?.length > 0 ? (
        <Button
          variant="contained"
          onClick={() => redirect("list", "/v1/tplCollection")}
        >
          Go Back
        </Button>
      ) : (
        <SaveButton label="Submit" />
      )}
    </Toolbar>
  );
  return (
    <>
      {isLoading && <AroggaBackdrop isLoading={isLoading} />}
      <div className={classes.root}>
        <Title title="3PL Collection List" />
        <Typography variant="h5">3PL Collection</Typography>
        <Paper style={{ marginTop: 10 }}>
          <SimpleForm onSubmit={post} toolbar={<CustomToolbar />}>
            <TextInput
              source="refId"
              label="Ref ID"
              variant="outlined"
              validate={[required()]}
              onChange={(e) => {
                setRefId(e.target.value);
              }}
              helperText={false}
            />
            <SelectInput
              source="courier"
              label="Courier"
              variant="outlined"
              choices={[
                { id: "ecourier", name: "eCourier" },
                { id: "pathao", name: "Pathao" },
              ]}
              alwaysOn
              onChange={(e) => {
                setCourier(e?.target?.value);
                setTotalAmount("");
                setConvertedCsvToJson(null);
              }}
              validate={[required()]}
              resettable
              helperText={false}
              style={{ marginBottom: "8px" }}
            />

            <TextField
              type="number"
              label="Total Amount"
              value={totalAmount}
              size="small"
              variant="outlined"
              // onChange={(e) => {
              //     if (/^\d*$/.test(e.target.value)) {
              //         setTotalAmount(e.target.value);
              //     }
              // }}
              disabled
              style={{ marginBottom: "14px" }}
            />

            {courier && (
              <div style={{ marginTop: 10, marginBottom: 24 }}>
                <FileInput
                  source="attachedFiles"
                  label="Upload 3PL File"
                  helperText={false}
                  placeholder="Upload 3PL statement"
                  accept={{
                    "text/csv": [".csv"],
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                      [".xlsx"],
                    "application/vnd.ms-excel": [".xls"],
                  }}
                  maxSize={FILE_MAX_SIZE}
                  validate={[required()]}
                  onChange={(e) => {
                    setErrResponse(null);
                    setConvertedCsvToJson(null);
                    setTotalAmount("");
                    handleFile(e);
                  }}
                >
                  <FileField source="src" title="title" />
                </FileInput>
              </div>
            )}

            {/* Alert response */}
            {errMsg && (
              <Box p={1} width="100%">
                <Alert
                  severity="error"
                  onClose={() => {
                    setErrMsg(null);
                  }}
                >
                  {errMsg}
                </Alert>
              </Box>
            )}

            {/* Table */}
            {errResponse?.length > 0 && (
              <>
                <FailedDataTable data={errResponse} />
              </>
            )}
          </SimpleForm>
        </Paper>
      </div>
    </>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 20,
    width: "100%",
  },
}));

export default ThreePlCashCollection;
