import {
  // Select,
  // TextField,
  // FormControl,
  // InputLabel,
  // MenuItem,
  Pagination,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

interface IZonePagination {
  rowsPerPage: any;
  handleChangeRowsPerPage: any;
  total: any;
  currentPage: any;
  handleChangePage: any;
}

export default function ZonePagination({
  rowsPerPage,
  handleChangeRowsPerPage,
  total,
  currentPage,
  handleChangePage,
}: IZonePagination) {
  const classes = useStyles();
  return (
    <div className={classes.paginationRoot}>
      <div className={classes.pagination}>
        <div className={classes.rowsPerPage}>
          <p style={{ fontSize: "14px" }}>Rows per page: </p>
          <select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            className={classes.paginationSelect}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
          <Pagination
            count={Math.ceil(total / rowsPerPage)}
            siblingCount={0}
            boundaryCount={1}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
          />
        </div>
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  paginationRoot: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "14px",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  rowsPerPage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  paginationSelect: {
    border: "none",
    fontSize: "14px",
    padding: "4px 6px",
    "&:hover": {
      cursor: "pointer",
    },
    "&:focus": {
      outline: "none",
      backgroundColor: "#e0e0e0",
    },
  },
}));
