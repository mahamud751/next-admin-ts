import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import LoaderOrButton from "../common/LoaderOrButton";

const LabTestTable = ({
  selectedLabTests,
  setSelectedLabTests,
  isLoading,
  refetch,
}) => {
  const handleCartItemDelete = (labItemUqid) => {
    const updatedLabTests = selectedLabTests.filter(
      (item) => item.labItemUqid !== labItemUqid
    );
    setSelectedLabTests(updatedLabTests);
  };

  return (
    <div>
      {selectedLabTests?.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>SL</TableCell>
                  <TableCell align="left">Test Name</TableCell>
                  <TableCell align="left">Booking for Person</TableCell>
                  <TableCell align="left">MRP</TableCell>
                  <TableCell align="left">Discount Price</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedLabTests?.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.patientCount}</TableCell>
                    <TableCell align="left">{row.regularPrice}</TableCell>
                    <TableCell align="left">{row.discountPrice}</TableCell>
                    <TableCell align="center">
                      <ClearIcon
                        onClick={() => handleCartItemDelete(row.labItemUqid)}
                        style={{
                          color: "#EF1962",
                          cursor: "pointer",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <LoaderOrButton
            label="Calculate"
            isLoading={isLoading}
            display="flex"
            justifyContent="center"
            mt={2}
            mb={2}
            onClick={refetch}
          />
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default LabTestTable;
