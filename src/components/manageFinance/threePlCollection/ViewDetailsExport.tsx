import React from "react";
// import { useRequest } from "@/hooks";
import jsonExport from "jsonexport/dist";
import { Button, SaveButton, downloadCSV } from "react-admin";
import { useParams } from "react-router-dom";
import { MdFileDownload } from "react-icons/md";
import { httpClient } from "@/utils/http";
type Props = {
  settlement_status?: string;
};

export default function ViewDetailsExport({ settlement_status }: Props) {
  const params: any = useParams();
  const handleExport = () => {
    httpClient(
      `/v1/tplCollectionDetail?_tc_id=${params?.id}&_page=1&_perPage=1000${
        settlement_status ? `&_settlement_status=${settlement_status}` : ""
      }`,
      {}
    )
      .then(({ json }: any) => {
        const postsForExport = json?.data?.map((post, idx) => {
          const { attachedFiles_tcd_reference_doc, ...postForExport } = post; // omit backlinks and author
          return postForExport;
        });
        jsonExport(
          postsForExport,
          {
            headers: ["tcd_id", "tcd_ref_id", "tcd_invoice_no"], // order fields in the export
          },
          (err, csv) => {
            downloadCSV(csv, "3pl_details"); // download as 'posts.csv` file
          }
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    <Button label="Export" onClick={handleExport} variant="text">
      <MdFileDownload />
    </Button>
  );
}
