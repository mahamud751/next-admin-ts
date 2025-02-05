import { FC } from "react";
import { Edit, EditProps, SaveButton, SimpleForm, Toolbar } from "react-admin";

import BlogForm from "@/components/manageSite/blogs/BlogForm";
import { useDocumentTitle } from "@/hooks";
import BlogActions from "./BlogActions";
import { blogTransform } from "./utils/blogTransform";

const BlogEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Blog Edit");
  const MyToolbar = (props) => (
    <Toolbar {...props}>
      <SaveButton type="button" alwaysEnable />
    </Toolbar>
  );
  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      actions={<BlogActions />}
      transform={blogTransform}
      {...rest}
      submitOnEnter={false}
    >
      <SimpleForm toolbar={<MyToolbar />}>
        <BlogForm />
      </SimpleForm>
    </Edit>
  );
};

export default BlogEdit;
