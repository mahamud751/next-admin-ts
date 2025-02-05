import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    makeStyles,
} from "@material-ui/core";
import { useState } from "react";
import { Link } from "react-admin";
import { Tree, TreeNode } from "react-organizational-chart";
import AroggaProgress from "../../../components/AroggaProgress";
import { useRequest } from "../../../hooks";

const DepartmentTab = () => {
    const [open, setOpen] = useState(false);
    const [employees, setEmployee] = useState([]);
    const classes = useStyles();
    const { data: departments, isLoading } = useRequest(
        "/admin/v1/employeeHierarchy/department",
        {},
        { isBaseUrl: true, isPreFetching: true }
    );
    const countTotalEmployees = (countEmployee, type = "selfEmployee") => {
        let count = 0;
        if (type === "selfEmployee") {
            count += countEmployee.total_employee;
        } else if (type === "childEmployee") {
            if (countEmployee.childrens && countEmployee.childrens.length > 0) {
                countEmployee.childrens.forEach((child) => {
                    count += countTotalEmployees(child, "totalEmployee");
                });
            }
        } else if (type === "totalEmployee") {
            count += countEmployee.total_employee;
            if (countEmployee.childrens && countEmployee.childrens.length > 0) {
                countEmployee.childrens.forEach((child) => {
                    count += countTotalEmployees(child, "totalEmployee");
                });
            }
        }
        return count;
    };
    const getTotalEmployees = (getEmployee, type = "selfEmployee") => {
        let item = [];
        if (type === "selfEmployee") {
            item.push(getEmployee.employees);
        } else if (type === "childEmployee") {
            if (getEmployee.childrens && getEmployee.childrens.length > 0) {
                getEmployee.childrens.forEach((child) => {
                    item.push(getTotalEmployees(child, "totalEmployee"));
                });
            }
        } else if (type === "totalEmployee") {
            item.push(getEmployee.employees);
            if (getEmployee.childrens && getEmployee.childrens.length > 0) {
                getEmployee.childrens.forEach((child) => {
                    item.push(getTotalEmployees(child, "totalEmployee"));
                });
            }
        }
        return item;
    };
    const genderTree = (node) => {
        const handleClick = (items) => {
            if (items.flat(Infinity).length) {
                setEmployee(items.flat(Infinity));
                setOpen(true);
            }
        };
        return node?.map((row, i) => {
            return (
                <>
                    <TreeNode
                        key={row}
                        label={
                            <div className={classes.nodeStyle}>
                                <span
                                    style={{
                                        color: "rgb(0 0 0)",
                                        fontWeight: "700",
                                        display: "inline-block",
                                        marginBottom: 5,
                                    }}
                                >
                                    {row.title}
                                </span>
                                <br />
                                <small
                                    style={{
                                        cursor: "pointer",
                                        color: "rgb(0 0 0)",
                                        fontWeight: "500",
                                        lineHeight: "1.5",
                                    }}
                                    onClick={() =>
                                        handleClick(
                                            getTotalEmployees(
                                                row,
                                                "selfEmployee"
                                            )
                                        )
                                    }
                                >
                                    {" "}
                                    Emp:{" "}
                                    {countTotalEmployees(
                                        row,
                                        "selfEmployee"
                                    )}{" "}
                                </small>
                                <br />
                                <small
                                    style={{
                                        cursor: "pointer",
                                        color: "rgb(0 0 0)",
                                        fontWeight: "500",
                                        lineHeight: "1.5",
                                    }}
                                    onClick={() =>
                                        handleClick(
                                            getTotalEmployees(
                                                row,
                                                "childEmployee"
                                            )
                                        )
                                    }
                                >
                                    {" "}
                                    Child Emp:{" "}
                                    {countTotalEmployees(
                                        row,
                                        "childEmployee"
                                    )}{" "}
                                </small>
                                <br />
                                <small
                                    style={{
                                        cursor: "pointer",
                                        color: "rgb(0 0 0)",
                                        fontWeight: "500",
                                        lineHeight: "1.5",
                                    }}
                                    onClick={() =>
                                        handleClick(
                                            getTotalEmployees(
                                                row,
                                                "totalEmployee"
                                            )
                                        )
                                    }
                                >
                                    {" "}
                                    Total Emp:{" "}
                                    {countTotalEmployees(
                                        row,
                                        "totalEmployee"
                                    )}{" "}
                                </small>
                            </div>
                        }
                    >
                        {(() => {
                            return genderTree(row?.childrens);
                        })()}
                    </TreeNode>
                </>
            );
        });
    };

    return (
        <div style={{ minHeight: "460px" }}>
            {isLoading ? (
                <AroggaProgress />
            ) : (
                <>
                    <Tree
                        lineWidth={"2px"}
                        lineColor={"green"}
                        lineBorderRadius={"10px"}
                        label={
                            <div className={classes.nodeStyle}>Departments</div>
                        }
                    >
                        {genderTree(departments)}
                    </Tree>
                    <Dialog
                        open={open}
                        onClose={() => {
                            setOpen(true);
                        }}
                    >
                        <DialogTitle>Employee List</DialogTitle>
                        <DialogContent style={{ minWidth: "400px" }}>
                            <TableContainer>
                                {employees?.length ? (
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Phone</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {employees.length
                                                ? employees.map(
                                                      (item, index) => (
                                                          <TableRow>
                                                              <TableCell>
                                                                  <Link
                                                                      to={`/v1/employee/${item.e_id}/show`}
                                                                      target="_blank"
                                                                  >
                                                                      <span>
                                                                          {
                                                                              item.e_id
                                                                          }{" "}
                                                                      </span>
                                                                  </Link>
                                                              </TableCell>
                                                              <TableCell>
                                                                  {item.e_name}
                                                              </TableCell>
                                                              <TableCell>
                                                                  {
                                                                      item.e_mobile
                                                                  }
                                                              </TableCell>
                                                          </TableRow>
                                                      )
                                                  )
                                                : null}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p
                                        style={{
                                            color: "red",
                                            textAlign: "center",
                                        }}
                                    >
                                        No employee found!
                                    </p>
                                )}
                            </TableContainer>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                color="primary"
                                variant="outlined"
                                onClick={() => {
                                    setOpen(false);
                                }}
                                style={{
                                    border: "1px solid #6C757D",
                                    fontWeight: 600,
                                    fontSize: "16px",
                                    color: "#6C757D",
                                    cursor: "pointer",
                                }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    nodeStyle: {
        padding: "7px 3px",
        minWidth: 130,
        borderRadius: 8,
        display: "inline-block",
        border: "1px solid #c6b0b0",
    },
}));

export default DepartmentTab;
