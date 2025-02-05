import { makeStyles } from "@mui/styles";
import Body from "./Body";
import Footer from "./Footer";
import Header from "./Header";

type Props = {
  data: any;
  refresh: () => void;
};

export default function ReviewCard({ data, refresh }: Props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Header data={data} />
      <Body data={data} />
      <Footer data={data} refresh={refresh} />
    </div>
  );
}

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 24,
    padding: 16,
    border: "1px solid #E4E4E4",
    borderRadius: 6,
    boxShadow: "2px 2px 8px 0px rgba(0, 0, 0, 0.04)",
  },
}));
