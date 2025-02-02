import { Button, TextField, Typography, Autocomplete } from "@mui/material";
import { makeStyles, styled } from "@mui/styles";
import ClearIcon from "@mui/icons-material/Clear";

import { SetStateAction, useState } from "react";
import { RaRecord, useEditContext, useRefresh } from "react-admin";

import { useDebounce, useRequest } from "@/hooks";
import { CheckIcon } from "@/components/icons";

const SearchTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: 64,
      width: "100%",
    },
  },
});
const Test = () => {
  const { record } = useEditContext();
  const classes = useStyles();
  const refresh = useRefresh();
  const [selectedLabTest, setSelectedLabTest] = useState({
    id: null,
    name: "",
  });
  const [labTestSearchText, setLabTestSearchText] = useState("");
  const debouncedSearch = useDebounce(labTestSearchText, 500);
  const { data: labTestOptions = [] } = useRequest(
    `/misc/api/v1/admin/lab-items?page=1&limit=1000&name=${debouncedSearch}&itemType=test`,
    { method: "GET" },
    {
      isSuccessNotify: false,
      refreshDeps: [debouncedSearch, record],
      isPreFetching: true,
    }
  );
  const { refetch: addNewCartItem } = useRequest(undefined, undefined, {
    onSuccess: (json: { data: SetStateAction<RaRecord> }) => {
      setRecordData(json.data);
      setSelectedLabTest({
        id: null,
        name: "",
      });
      refresh();
    },
  });
  const [, setRecordData] = useState(record);
  const handleAddNewCartItem = () => {
    addNewCartItem({
      endpoint: `/misc/api/v1/admin/lab-items/package/tests`,
      method: "POST",
      body: {
        packageId: record.id,
        testId: selectedLabTest?.id,
      },
    });
  };
  const { refetch: deleteCartItem } = useRequest(undefined, undefined, {
    onSuccess: () => {
      refresh();
    },
  });

  const handleDeleteCartItem = (testId: string) => {
    const packageId = record.id;
    deleteCartItem({
      endpoint: `/misc/api/v1/admin/lab-items/package/tests`,
      method: "DELETE",
      body: {
        packageId,
        testId,
      },
    });
  };
  return (
    <div>
      <div className={classes.cartDetails}>
        <div className={classes.addTest_input}>
          <Autocomplete
            fullWidth
            value={selectedLabTest}
            options={labTestOptions.map((item) => ({
              id: item?.id,
              name: item?.name?.en,
            }))}
            getOptionLabel={(option) => option.name}
            filterOptions={(options) => options}
            onInputChange={(event, newInputValue) => {
              setLabTestSearchText(newInputValue);
            }}
            onChange={(event, newValue) => {
              setSelectedLabTest(newValue as typeof selectedLabTest);
            }}
            renderInput={(params) => (
              <SearchTextField {...params} label={"Search Test*"} />
            )}
          />

          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleAddNewCartItem}
            disabled={!selectedLabTest?.id}
            style={{ margin: "20px 0" }}
          >
            Add New
          </Button>
        </div>
      </div>
      <div>
        {record?.tests?.map((item) => (
          <div
            style={{
              width: "50%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                }}
              >
                <CheckIcon />
                <Typography variant="body1" style={{ marginLeft: 10 }}>
                  {item.test.name.en}
                </Typography>
              </div>

              <div>
                <ClearIcon
                  onClick={() => handleDeleteCartItem(item.test.id)}
                  style={{
                    color: "#EF1962",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const useStyles = makeStyles(() => ({
  cartDetails: {
    border: "1px solid #EAEBEC",
    borderRadius: 6,
    padding: 5,
    marginTop: 10,
  },
  addTest_input: {
    gap: "2rem",
  },
}));

export default Test;
