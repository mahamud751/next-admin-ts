import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { memo, useEffect, useState } from "react";
import { useDebounce } from "@/hooks";
import { httpClient } from "@/utils/http";

type Props = {
  setSearchValue: (e: any) => void;
  searchValue: string;
  setFilterValue: (e: any) => void;
};

const Filter = memo(function Filter({
  setSearchValue,
  searchValue,
  setFilterValue,
}: Props) {
  const classes = useStyles();
  const [searchedProduct, setSearchedProduct] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const debouncedSearchText = useDebounce(searchedProduct, 1000);
  const [loading, setLoading] = useState(false);

  const handleProductSearch = () => {
    setLoading(true);
    httpClient(
      `/v1/product?_details=1${
        debouncedSearchText
          ? `&_search=${encodeURIComponent(debouncedSearchText)}`
          : ""
      }`
    )
      .then(({ json }: any) => {
        // If a product has multiple variants then it will be shown multiple times with variant attribute
        const data =
          json?.data?.map((d: any) =>
            d?.pv?.map((p: any) => ({
              label: `${d.p_name}
                            ${
                              d?.pv?.length > 1
                                ? `(${Object.entries(p?.pv_attribute)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(", ")})`
                                : ""
                            }`,
              value: p.pv_id,
            }))
          ) || [];
        setSearchedData(data.reduce((acc, curr) => acc.concat(curr), []));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (searchedProduct) {
      handleProductSearch();
    }
  }, [debouncedSearchText]);

  return (
    <div className={classes.root}>
      <Autocomplete
        autoHighlight
        freeSolo
        id="product-search-combo-box"
        options={searchedData || []}
        getOptionLabel={(option: any) => option.label || ""}
        style={{ width: 350 }}
        size="small"
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Product"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        onChange={(e, value) => {
          setSearchValue(value?.value || null);
        }}
        onInputChange={(e, value) => {
          setSearchedProduct(value);
        }}
      />

      <FormControl
        variant="outlined"
        size="small"
        style={{
          width: "120px",
        }}
      >
        <InputLabel id="demo-simple-select-label">Filter</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Filter"
          onChange={(e) => {
            setFilterValue(e.target.value);
          }}
        >
          <MenuItem value={""}>All</MenuItem>
          <MenuItem value={"DESC"}>Newest</MenuItem>
          <MenuItem value={"ASC"}>Oldest</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
});

export default Filter;

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
  },
  btnStyle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "4px",
    color: "#0E7673",
    fontSize: "14px",
    fontWeight: 600,
  },
}));
