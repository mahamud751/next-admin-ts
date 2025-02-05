import Rating from "@mui/material/Rating";
import { FC, useState } from "react";
import {
  Button,
  Confirm,
  Datagrid,
  FileField,
  FunctionField,
  List,
  ListProps,
  RaRecord as Record,
  ReferenceField,
  TextField,
  usePermissions,
  useRefresh,
} from "react-admin";
import { useDocumentTitle, useRequest } from "@/hooks";
import { capitalizeFirstLetter } from "@/utils/helpers";
import ReviewsFilter from "./ReviewsFilter";

const ReviewsList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Reviews List");
  const { permissions } = usePermissions();
  const refresh = useRefresh();
  const [selectedReview, setSelectedReview] = useState(null);
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);

  const { isLoading, refetch } = useRequest(
    `/v1/ProductReview/${selectedReview?.pr_id}`,
    {
      method: "POST",
      body: {
        pr_status: approveModal ? "approved" : "rejected",
      },
    },
    {
      onSuccess: () => {
        setApproveModal(false);
        setRejectModal(false);
        setSelectedReview(null);
        refresh();
      },
    }
  );
  return (
    <>
      <List
        {...rest}
        title="List of Reviews"
        perPage={25}
        sort={{ field: "pr_id", order: "DESC" }}
        filters={<ReviewsFilter children={""} />}
        exporter={false}
      >
        <Datagrid bulkActionButtons={false}>
          <TextField source="pr_id" label="ID" />
          <ReferenceField
            label="Product"
            source="pr_product_variant_id"
            reference="v1/productVariant"
            link={false}
          >
            <ReferenceField
              source="pv_p_id"
              reference="v1/product"
              link={false}
            >
              <TextField source="p_name" />
            </ReferenceField>
          </ReferenceField>
          <FunctionField
            label="Rating"
            render={(record: Record) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {/* <span>{`[${record?.pr_rating}]`}</span> */}
                <Rating
                  name="simple-controlled"
                  value={record?.pr_rating}
                  precision={0.5}
                  readOnly
                  size="small"
                />
              </div>
            )}
          />
          <TextField source="pr_review_text" label="Review" />
          <ReferenceField
            label="Order ID"
            source="pr_order_id"
            reference="v1/productOrder"
          >
            <TextField source="po_id" />
          </ReferenceField>
          <TextField source="pr_status" label="Status" />
          <FunctionField
            label="Status"
            render={(record: Record) => (
              <span
                style={{
                  color:
                    record?.pr_status === "approved"
                      ? "green"
                      : record?.pr_status === "rejected"
                      ? "red"
                      : "grey",
                }}
              >
                {capitalizeFirstLetter(record?.pr_status)}
              </span>
            )}
          />
          <ReferenceField label="User" source="pr_user_id" reference="v1/users">
            <TextField source="u_name" />
          </ReferenceField>
          <ReferenceField
            label="Approved By"
            source="pr_approved_by"
            reference="v1/users"
          >
            <TextField source="u_name" />
          </ReferenceField>
          <FileField
            source="attachedFiles_pr_review_files"
            label="Files"
            src="src"
            title="title"
            target="_blank"
          />
          <FunctionField
            label="Action"
            render={(record: Record) =>
              permissions?.includes("productReviewEdit") &&
              record?.pr_status === "pending" && (
                <div style={{ display: "flex" }}>
                  <Button
                    label="Approve"
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setApproveModal(true);
                      setRejectModal(false);
                      setSelectedReview(record);
                    }}
                  />
                  <Button
                    label="Reject"
                    variant="contained"
                    onClick={() => {
                      setRejectModal(true);
                      setApproveModal(false);
                      setSelectedReview(record);
                    }}
                    style={{
                      marginLeft: "4px",
                      backgroundColor: "#E57373",
                    }}
                  />
                </div>
              )
            }
          />
        </Datagrid>
      </List>
      <Confirm
        isOpen={approveModal || rejectModal}
        loading={isLoading}
        title={approveModal ? "Approve" : "Reject"}
        content={`Are you sure you want to ${
          approveModal ? "approve" : "reject"
        } the review?`}
        onConfirm={refetch}
        onClose={() => {
          setRejectModal(false);
          setApproveModal(false);
          setSelectedReview(null);
        }}
      />
    </>
  );
};

export default ReviewsList;
