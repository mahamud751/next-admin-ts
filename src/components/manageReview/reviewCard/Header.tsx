import { makeStyles } from "@mui/styles";

type Props = { data: any };
export default function Header({ data }: Props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>
        <img
          src={data?.attachedFiles_p_images?.[0]?.src}
          alt={data?.p_name}
          width={84}
          height={84}
          className={classes.img}
        />
      </div>
      <div>
        <h5 style={{ marginBottom: 0, marginTop: 4, fontSize: "18px" }}>
          {data?.p_name}
        </h5>
        <p
          style={{
            marginTop: 4,
            marginBottom: 0,
            fontSize: "16px",
            color: "#718096",
          }}
        >
          {data?.poi_product_qty}&#xd7;{data?.product_base_unit}
        </p>
      </div>
    </div>
  );
}
const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "#F9FAFB",
    padding: 8,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
  },
  img: {
    border: "1px solid #EEEFF2",
    borderRadius: 6,
    objectFit: "cover",
  },
}));
