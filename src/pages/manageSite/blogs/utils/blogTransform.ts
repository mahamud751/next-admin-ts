import { TransformData } from "react-admin";

export const blogTransform: TransformData = (rest) => ({
  ...rest,
  bp_products: rest?.bp_products?.filter((product) => !!product?.p_id),
  bp_youtube: rest?.bp_youtube?.filter((item) => item?.title || item?.key),
});
