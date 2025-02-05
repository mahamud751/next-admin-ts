import { FC } from "react";
import { Create, CreateProps, SimpleForm } from "react-admin";

import BlogForm from "@/components/manageSite/blogs/BlogForm";
import { useDocumentTitle } from "@/hooks";
import { blogTransform } from "./utils/blogTransform";

const BlogCreate: FC<CreateProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Blog Create");

  return (
    <Create {...rest} transform={blogTransform} redirect="list">
      <SimpleForm>
        <BlogForm />
      </SimpleForm>
    </Create>
  );
};

export default BlogCreate;
