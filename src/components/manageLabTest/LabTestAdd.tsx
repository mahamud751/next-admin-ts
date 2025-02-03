import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Autocomplete,
  Button,
  TextField,
} from "@mui/material";
import { styled, makeStyles } from "@mui/styles";

const SearchTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: 64,
      width: "100%",
    },
  },
});
const LabTestAdd = ({
  selectedLabTest,
  labTestOptions,
  setLabTestSearchText,
  setSelectedLabTest,
  setBookFor,
  bookFor,
  setSelectedLabTests,
  selectedLabTests,
}) => {
  const classes = useStyles();
  const handleChange = (event: any) => {
    setBookFor(event.target.value as string);
  };
  const handleAddNew = () => {
    const newLabTest = {
      labItemUqid: selectedLabTest.id,
      name: selectedLabTest.name,
      regularPrice: selectedLabTest.regularPrice,
      discountPrice: selectedLabTest.discountPrice,
      patientCount: bookFor,
    };
    setSelectedLabTests([...selectedLabTests, newLabTest]);
    setSelectedLabTest({
      id: null,
      name: "",
      regularPrice: "",
      discountPrice: "",
    });
  };
  return (
    <div className={classes.addTest_input}>
      <Autocomplete
        fullWidth
        size="medium"
        value={selectedLabTest}
        options={labTestOptions.map((item) => ({
          id: item.id,
          name: item.name.en,
          regularPrice:
            item?.vendorLabItems?.[0]?.regularPrice ?? "Not Available",
          discountPrice:
            item?.vendorLabItems?.[0]?.discountPrice ?? "Not Available",
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
      <FormControl
        variant="filled"
        fullWidth
        size="small"
        style={{ maxWidth: "40%" }}
      >
        <InputLabel id="demo-simple-select-label">Book For</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={bookFor}
          label="Book For"
          onChange={handleChange}
        >
          {new Array(5).fill(2).map((item, index) => (
            <MenuItem key={index} value={index + 1}>
              {index + 1} Person
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        size="large"
        variant="contained"
        color="primary"
        disabled={!bookFor || !selectedLabTest?.id}
        onClick={handleAddNew}
        style={{ width: 160, marginRight: 20 }}
      >
        Add New
      </Button>
    </div>
  );
};
const useStyles = makeStyles(() => ({
  addTest_input: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    gap: "2rem",
  },
  table: {
    width: 362,
    marginTop: 20,
    marginBottom: 18,
  },
}));
export default LabTestAdd;
