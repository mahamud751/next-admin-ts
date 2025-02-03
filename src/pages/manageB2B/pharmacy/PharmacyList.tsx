import { Button, Modal } from "@mui/material";

import { makeStyles } from "@mui/styles";
import { FC, useState } from "react";
import {
  Confirm,
  Datagrid,
  FileField,
  FunctionField,
  List,
  ListProps,
  RaRecord,
  ReferenceField,
  TextField,
  useRefresh,
} from "react-admin";

import { CloseIcon } from "@/components/icons";
import {
  useDocumentTitle,
  useExport,
  useNavigateFromList,
  useRequest,
} from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import PharmacyFilter from "./PharmacyFilter";

interface ActionData {
  id: number;
  status: string;
}

interface RecordType {
  attachedFiles_p_trade_license_file?: { src: string }[];
  attachedFiles_p_drug_license_file?: { src: string }[];
  id: string;
  p_status: any;
}

const useStyles = makeStyles((theme) => ({
  image: {
    width: 40,
    height: 40,
    cursor: "pointer",
    margin: "10px",
    borderRadius: 4,
  },
  modalContainer: {
    position: "fixed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    padding: "32px",
  },
  modalImageWrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    borderRadius: "8px",
    overflow: "hidden",
    padding: "32px",
    gap: "16px",
    background: "#fff",
    flexDirection: "column",
  },
  modalImage: {
    minWidth: "645px", // Fixed width
    maxHeight: "700px", // Fixed height
    objectFit: "cover", // Ensures the image fits within these dimensions
    borderRadius: "8px", // Optional, makes the image corners rounded
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    border: "none",
    cursor: "pointer",
    padding: "10px 20px",
    background: "#fff",
  },

  modalHeader: {
    fontSize: 32,
    fontWeight: 600,
    margin: 0,
  },
}));

const PharmacyList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Pharmacy List");
  const refreshList = useRefresh();
  const [open, setOpen] = useState(false);
  const [actionData, setActionData] = useState<ActionData>({
    id: 0,
    status: "",
  });
  const classesModal = useStyles();
  const [openImgModal, setOpenImgModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState({
    src: "",
    license: "",
  });

  const [loading, setLoading] = useState(false);
  const exporter = useExport(rest);
  const classes = useAroggaStyles();
  const navigateFromList = useNavigateFromList("pharmacyView", "pharmacyEdit");

  const rowStyle = ({ p_status }: RaRecord) => ({
    backgroundColor:
      p_status === 1
        ? "rgb(0 128 105 / 6%)"
        : p_status === 2
        ? "rgb(255 229 229)"
        : "",
  });

  const handleDialogClose = () => setOpen(false);

  const handleConfirm = () => {
    setLoading(true); // Start loading before API call
    setOpen(false); // Close the dialog
    try {
      refetch();
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleReject = (id, status) => {
    setActionData({ id: Number(id), status });
    setOpen(true);
  };

  const handleStatusUpdate = (id, status) => {
    setActionData({ id: Number(id), status });
    refetch();
  };

  const { refetch } = useRequest(
    `/v1/pharmacy/${actionData.id}`,
    {
      method: "POST",
      body: {
        p_status: actionData.status,
      },
    },
    {
      onSuccess: () => {
        handleDialogClose();
        refreshList();
      },
    }
  );

  const handleImageClick = (imageSrc, licenseName) => {
    setSelectedImage({
      src: imageSrc,
      license: licenseName,
    });
    setOpenImgModal(true); // Open modal
  };

  const handleClose = () => {
    setOpenImgModal(false);
    setSelectedImage({
      src: "",
      license: "",
    });
  };

  return (
    <>
      <List
        {...rest}
        title="List of B2B"
        perPage={25}
        filters={<PharmacyFilter children={""} />}
        sort={{ field: "p_id", order: "DESC" }}
        // bulkActionButtons={permissions?.includes("pharmacyDelete")}
        exporter={exporter}
      >
        <Datagrid rowClick={navigateFromList} rowStyle={rowStyle}>
          <TextField source="p_id" label="ID" />
          <TextField source="p_name" label="Name" />
          <ReferenceField
            source="p_user_id"
            label="User"
            reference="v1/users"
            link="show"
            sortBy="p_user_id"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <TextField
            className={classes.whitespaceNowrap}
            source="p_business_type"
            label="Business Type"
          />

          <TextField source="p_drug_license_no" label="Drug License No" />
          <FunctionField
            label="Drug License Files"
            sortBy="p_status"
            render={(record) => (
              <div
                className={classes.whitespaceNowrap}
                style={{ display: "flex" }}
              >
                <FileField
                  source="attachedFiles_p_drug_license_file"
                  src="src"
                  title="D License"
                  target="_blank"
                  label="D License"
                  // @ts-ignore
                  onClick={(e) => e.stopPropagation()}
                />
                {(record as RecordType)?.attachedFiles_p_drug_license_file
                  ?.length > 0 ? (
                  <>
                    {(
                      record as RecordType
                    ).attachedFiles_p_drug_license_file.map((image, index) => (
                      <img
                        key={index}
                        src={image.src}
                        alt={`Drug License File-${index}`}
                        title="Image"
                        className={classesModal.image}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageClick(image.src, "Drug");
                        }}
                      />
                    ))}
                  </>
                ) : null}
              </div>
            )}
          />

          <TextField source="p_trade_license_no" label="Trade License No" />

          <FunctionField
            label="Trade License File"
            sortBy="p_status"
            render={(record) => (
              <div
                className={classes.whitespaceNowrap}
                style={{ display: "flex" }}
              >
                <FileField
                  source="attachedFiles_p_trade_license_file"
                  src="src"
                  title="Trade L File"
                  target="_blank"
                  label="Trade L File"
                  // @ts-ignore
                  onClick={(e) => e.stopPropagation()}
                />
                {(record as RecordType)?.attachedFiles_p_trade_license_file
                  ?.length > 0 ? (
                  <>
                    {(
                      record as RecordType
                    ).attachedFiles_p_trade_license_file.map((image, index) => (
                      <img
                        key={index}
                        src={image.src}
                        alt={`Trade License File-${index}`}
                        title="Image"
                        className={classesModal.image}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageClick(image.src, "Trade");
                        }}
                      />
                    ))}
                  </>
                ) : null}
              </div>
            )}
          />
          <ReferenceField
            source="p_location_id"
            label="Location"
            reference="v1/location"
            link="show"
            sortBy="p_location_id"
          >
            <FunctionField
              render={(record) => {
                if (!record) return "";
                return `${record.l_division} -> ${record.l_district} -> ${record.l_area}`;
              }}
            />
          </ReferenceField>
          <TextField source="p_address" label="Address" />

          <FunctionField
            label="Request Status"
            sortBy="p_status"
            render={(record) => (
              <span className={`${classes.capitalize}`}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 15,
                  }}
                >
                  {record?.p_status === "approved" && (
                    <span style={{ color: "#12B76A" }}>Approved</span>
                  )}

                  {record?.p_status === "pending" && (
                    <>
                      <Button
                        variant="outlined"
                        size="small"
                        color="inherit"
                        className={classes.textRed}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject((record as RecordType).id, "rejected");
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();

                          handleStatusUpdate(
                            (record as RecordType).id,
                            "approved"
                          );
                        }}
                      >
                        Approved
                      </Button>
                    </>
                  )}

                  {record?.p_status === "rejected" && (
                    <>
                      <span className={classes.textRed}>Rejected</span>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(
                            (record as RecordType).id,
                            "pending"
                          );
                        }}
                      >
                        Reverse
                      </Button>
                    </>
                  )}
                </div>
                {/* {record?.p_status} */}
              </span>
            )}
          />
        </Datagrid>
      </List>

      {open && (
        <Confirm
          isOpen={open}
          loading={loading}
          title={`Are you sure you want to proceed?`}
          content="After rejection, this business will not be able to register."
          onConfirm={() => {
            handleConfirm();
          }}
          onClose={handleDialogClose}
        />
      )}

      {/* Modal for zooming in on images */}
      {openImgModal && (
        <Modal open={openImgModal} onClose={handleClose}>
          <div className={classesModal.modalContainer}>
            <div className={classesModal.modalImageWrapper}>
              <button
                className={classesModal.closeButton}
                onClick={handleClose}
              >
                <CloseIcon
                  style={{
                    height: 24,
                    width: 24,
                    color: "#667085",
                  }}
                />
              </button>
              <h3 className={classesModal.modalHeader}>
                {selectedImage?.license} license preview
              </h3>
              <img
                src={selectedImage?.src}
                alt="Zoomed"
                className={classesModal.modalImage}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PharmacyList;
