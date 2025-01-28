import { Grid } from "@mui/material";
import { Labeled, SimpleShowLayout } from "react-admin";

import { capitalizeFirstLetterOfEachWord, isArray } from "@/utils/helpers";

const ColumnShowLayout = ({
  xs = 6,
  md = 4,
  simpleShowLayout = true,
  children,
}: any) => {
  const element = (item, i) => (
    <Grid item xs={xs} md={md} key={i}>
      {item?.props?.addLabel ? (
        <Labeled
          label={
            item.props.label ||
            capitalizeFirstLetterOfEachWord(item.props.source)
          }
        >
          {item}
        </Labeled>
      ) : (
        item
      )}
    </Grid>
  );

  const elementContainer = (
    <Grid container spacing={1}>
      {isArray(children) ? children.map(element) : element(children, 1)}
    </Grid>
  );

  return simpleShowLayout ? (
    <SimpleShowLayout>{elementContainer}</SimpleShowLayout>
  ) : (
    elementContainer
  );
};

export default ColumnShowLayout;
