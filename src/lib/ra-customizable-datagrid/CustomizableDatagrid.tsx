import {
  Button,
  Checkbox,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
} from "@mui/material";
import ColumnIcon from "@mui/icons-material/ViewColumn";
import filter from "lodash/filter";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import {
  Children,
  cloneElement,
  FC,
  MouseEvent,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { Datagrid } from "react-admin";

import LocalStorage from "./LocalStorage";

type CustomizableDatagridProps = {
  children: ReactNode;
  hideableColumns?: string[];
  resource?: string;
  storage?: {
    get: (resource: string) => { [key: string]: boolean };
    set: (resource: string, selection: { [key: string]: boolean }) => void;
  };
  [key: string]: any;
};

const CustomizableDatagrid: FC<CustomizableDatagridProps> = ({
  children,
  hideableColumns = [],
  resource,
  storage = LocalStorage,
  ...rest
}) => {
  const [selection, setSelection] = useState<{ [key: string]: boolean }>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setSelection(getInitialSelection());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getColumnNames = () => {
    return filter(
      Children.map(children, (field) => get(field, ["props", "source"]))
    );
  };

  const getColumnLabels = () => {
    return filter(
      Children.map(
        children,
        (field) =>
          field && {
            source: get(field, ["props", "source"]),
            label: get(field, ["props", "label"]),
          }
      ),
      (item) => item && item.source
    );
  };

  const getInitialSelection = () => {
    const previousSelection = storage.get(resource);

    if (!isEmpty(previousSelection)) return previousSelection;

    if (!isEmpty(hideableColumns)) {
      return arrayToSelections(hideableColumns, getColumnNames());
    }

    return arrayToSelections([], getColumnNames());
  };

  const toggleColumn = (columnName) => {
    const newSelection = {
      ...selection,
      [columnName]: !selection[columnName],
    };
    setSelection(newSelection);
    storage.set(resource, newSelection);
  };

  // const toggleAllColumns = () => {
  //     const allColumns = getColumnNames();
  //     const allSelected =
  //         Object.keys(selection)
  //             .map((key) => selection[key])
  //             .filter((item) => item).length === allColumns.length;
  //     const newSelection = allSelected
  //         ? arrayToSelection([])
  //         : arrayToSelection(allColumns);
  //     setSelection(newSelection);
  //     storage.set(resource, newSelection);

  // };
  const toggleAllColumns = () => {
    const allColumns = getColumnNames();
    const newSelection = allColumns.reduce((selection, columnName) => {
      selection[columnName] = !isSelectAll;
      return selection;
    }, {});
    // Update checkbox state before setting selection
    setSelection(newSelection);
    storage.set(resource, newSelection);
  };

  const resetColumns = () => {
    const allColumns = getColumnNames();
    const newSelection = arrayToSelections(hideableColumns, allColumns);
    setSelection(newSelection);
    storage.set(resource, newSelection);
  };

  const handleOpen = (e: MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const renderChild = (child: ReactElement) => {
    const source = get(child, ["props", "source"]);
    if (!source || selection[source]) {
      return cloneElement(child);
    }
    return null;
  };

  const open = Boolean(anchorEl);
  const isSelectAll =
    Object.keys(selection)
      .map((key) => selection[key])
      .filter((item) => item).length === getColumnNames().length;

  return (
    <>
      <div style={{ textAlign: "right" }}>
        <Button onClick={resetColumns}>Reset Column</Button>
        <Button
          aria-describedby={open ? "simple-popper" : undefined}
          onClick={handleOpen}
        >
          <ColumnIcon />
        </Button>
      </div>
      <Popover
        id={open ? "simple-popper" : undefined}
        anchorEl={anchorEl}
        open={open}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={handleClose}
      >
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose} keepMounted>
          <MenuItem
            onClick={toggleAllColumns}
            style={{ padding: 0 }}
            disableGutters
            divider
            dense
          >
            <Checkbox
              color="primary"
              checked={isSelectAll}
              onChange={toggleAllColumns}
              style={{ padding: "0px 10px" }}
            />
            <ListItemText primary="Show All" />
          </MenuItem>
          {getColumnLabels().map((item: any, index) => (
            <MenuItem
              key={index}
              onClick={() => toggleColumn(item.source)}
              disableGutters
              divider={index !== getColumnLabels().length - 1}
              dense
            >
              <Checkbox
                color="primary"
                checked={selection[item.source]}
                onChange={() => toggleColumn(item.source)}
                style={{ padding: "0px 10px" }}
              />
              <ListItemText primary={item.label} style={{ marginRight: 10 }} />
            </MenuItem>
          ))}
        </Menu>
      </Popover>
      <Datagrid {...rest}>
        {/* @ts-ignore */}
        {Children.map(children?.filter(Boolean), renderChild)}
      </Datagrid>
    </>
  );
};

export default CustomizableDatagrid;

// const arrayToSelection = (values: string[]) =>
//     values.reduce<{ [key: string]: boolean }>((selection, columnName) => {
//         selection[columnName] = true;
//         return selection;
//     }, {});

const arrayToSelections = (values: string[], allColumns: string[]) =>
  allColumns.reduce<{ [key: string]: boolean }>((selection, columnName) => {
    selection[columnName] = !values.includes(columnName);
    return selection;
  }, {});
