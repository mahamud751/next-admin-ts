import { ManageSiteIcon } from "@/components/icons";
import { Button, EditButton, ShowButton, TopToolbar } from "react-admin";

const BlogActions = (props) => {
  const { basePath, hasEdit, data } = props;

  return (
    <TopToolbar>
      {!!data?.bp_is_active && (
        <Button
          label="View in website"
          onClick={() =>
            window.open(
              `${process.env.REACT_APP_WEBSITE_URL}/blog/general/${data?.bp_id}`,
              "_blank"
            )
          }
        >
          <ManageSiteIcon color="#008069" />
        </Button>
      )}
      {hasEdit ? (
        <EditButton basePath={basePath} record={data} />
      ) : (
        <ShowButton basePath={basePath} record={data} />
      )}
    </TopToolbar>
  );
};

export default BlogActions;
