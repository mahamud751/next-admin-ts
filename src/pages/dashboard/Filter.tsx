import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC } from "react";
import { FilterProps } from "react-admin";
import { createTheme } from "@mui/material/styles";

interface IFilterProps extends FilterProps {
  filterSelected: string;
  handleFilter: (value: unknown) => void;
}

const Filter: FC<IFilterProps> = ({ filterSelected, handleFilter }) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <InputLabel>Filter</InputLabel>
      <Select
        value={filterSelected}
        onChange={(e) => handleFilter(e.target.value)}
      >
        <MenuItem value="Today">Today</MenuItem>
        <MenuItem value="Yesterday">Yesterday</MenuItem>
        <MenuItem value="This week">This week</MenuItem>
        <MenuItem value="Last week">Last week</MenuItem>
        <MenuItem value="Last 30 days">Last 30 days</MenuItem>
        <MenuItem value="This Month">This Month</MenuItem>
        <MenuItem value="Last Month">Last Month</MenuItem>
        <MenuItem value="This year">This year</MenuItem>
        <MenuItem value="Last year">Last year</MenuItem>
        <MenuItem value="Custom">Custom</MenuItem>
      </Select>
    </FormControl>
  );
};

const theme = createTheme({});

const useStyles = makeStyles(() => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default Filter;
