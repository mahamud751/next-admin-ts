import { Fade, Tooltip } from "@mui/material";
import { cloneElement, forwardRef } from "react";

// TooltipWrapper gets initial MyTooltip props without Tooltip props
// and passes them to children (an input component in this example)
const TooltipWrapper = forwardRef(({ children, ...props }: any, ref: any) => (
  <div ref={ref}>{cloneElement(children, props)}</div>
));

// MyTooltip gets explicit props and props added by SimpleForm
// and passes them together to the Tooltip.
const MyTooltip = ({ children, ...props }: any) => (
  <Tooltip
    TransitionComponent={Fade}
    TransitionProps={{ timeout: 600 }}
    placement="top"
    arrow
    {...props}
  >
    <TooltipWrapper>{children}</TooltipWrapper>
  </Tooltip>
);

export default MyTooltip;
