import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CSSProperties, FC } from "react";
import { Labeled } from "react-admin";

import { capitalizeFirstLetterOfEachWord } from "@/utils/helpers";

type GridSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type AroggaAccordionProps = {
  title: string;
  isGrid?: boolean;
  children: any;
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
  accordionDetailsStyle?: CSSProperties;
  xs?: GridSize;
  sm?: GridSize;
  md?: GridSize;
};

const AroggaAccordion: FC<AroggaAccordionProps> = ({
  title,
  isGrid = true,
  children,
  alignItems,
  accordionDetailsStyle,
  xs = 12,
  sm = 6,
  md = 3,
}) => {
  const classes = useStyles();

  return (
    <Accordion className={classes.accordion} defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        className={classes.accordionSummary}
      >
        {title}
      </AccordionSummary>
      <AccordionDetails style={accordionDetailsStyle}>
        {isGrid ? (
          <Grid container spacing={1} alignItems={alignItems}>
            {children?.filter(Boolean)?.map((item, index) => (
              // @ts-ignore
              <Grid item xs={xs} sm={sm} md={md} key={index}>
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
            ))}
          </Grid>
        ) : (
          children
        )}
      </AccordionDetails>
    </Accordion>
  );
};

const useStyles = makeStyles(() =>
  createStyles({
    accordion: {
      marginBottom: 10,
    },
    accordionSummary: {
      background: "#f6f6f6",
      fontWeight: "bold",
      fontSize: 20,
    },
  })
);

export default AroggaAccordion;
