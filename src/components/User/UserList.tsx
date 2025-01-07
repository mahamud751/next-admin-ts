import {
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
  SearchInput,
  Pagination,
} from "react-admin";
const PostPagination = () => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
);
const postFilters = [<SearchInput source="name" alwaysOn />];

export const UserList = () => (
  <List filters={postFilters} pagination={<PostPagination />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="pr_name" />
      <DateField source="published_at" />
      <TextField source="category" />
      <BooleanField source="commentable" />
    </Datagrid>
  </List>
);
