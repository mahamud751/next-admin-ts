import { Avatar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Rating from "@mui/material/Rating";
type Props = {
  data: any;
};

export default function Body({ data }: Props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.heading}>
        <Avatar alt={data?.u_name} src={data?.u_profile_pic} />
        <h5>{data?.u_name}</h5>
      </div>
      <Rating
        name="simple-controlled"
        value={data?.pr_rating}
        precision={0.5}
        readOnly
      />
      <p>{data?.pr_review_text}</p>
    </div>
  );
}
const useStyles = makeStyles(() => ({
  root: {
    padding: 0,
    marginTop: 16,
  },
  heading: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
}));
