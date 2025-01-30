import { Box, Button } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  CSSProperties,
  Children,
  FC,
  cloneElement,
  isValidElement,
  useEffect,
} from "react";
import { ArrayInput, FormDataConsumer, SimpleFormIterator } from "react-admin";
import { useWatch, useFormContext } from "react-hook-form";

import {
  convertObjectToArrayOfObject,
  isArray,
  isEmpty,
} from "@/utils/helpers";

type InlineArrayInputProps = {
  source: string;
  label?: string;
  helperText?: boolean;
  keyName?: string;
  valueName?: string;
  addButtonLabel?: string;
  addButtonStyle?: CSSProperties;
  removeButtonStyle?: CSSProperties;
  disableAdd?: boolean;
  disableRemove?: boolean;
  disableItemLabel?: boolean;
  disableReordering?: boolean;
  enableRenderProps?: boolean;
  children: any;
  [key: string]: any;
};

const InlineArrayInput: FC<InlineArrayInputProps> = ({
  source,
  label = source,
  helperText = false,
  keyName = "key",
  valueName = "value",
  addButtonLabel = "Add",
  addButtonStyle,
  removeButtonStyle,
  disableAdd = false,
  disableRemove = false,
  disableItemLabel = false,
  disableReordering = false,
  enableRenderProps = false,
  children,
  ...rest
}) => {
  const { setValue } = useFormContext();
  const values = useWatch();

  useEffect(() => {
    if (!isEmpty(values?.[source]) && !isArray(values?.[source])) {
      setValue(
        source,
        convertObjectToArrayOfObject({
          data: values?.[source],
        })
      );
    }

    const [arrayKey, , objKey] = source?.split(/\[|\]\./);

    if (arrayKey && objKey) {
      setValue(
        arrayKey,
        values?.[arrayKey]?.map((item) => ({
          ...item,
          [objKey]:
            !isEmpty(item?.[objKey]) && !isArray(item?.[objKey])
              ? convertObjectToArrayOfObject({
                  data: item?.[objKey],
                })
              : item?.[objKey],
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ArrayInput source={source} label={label} {...rest}>
      <SimpleFormIterator
        getItemLabel={(index) =>
          disableItemLabel ? "" : (index + 1).toString()
        }
        // @ts-ignore
        TransitionProps={{
          classNames: "fade-exit",
        }}
        addButton={
          <Button
            variant="outlined"
            style={{
              backgroundColor: "#027bff",
              color: "white",
              marginLeft: values?.[source]?.length ? 26 : 0,
              ...addButtonStyle,
            }}
          >
            {addButtonLabel}
          </Button>
        }
        removeButton={
          <div
            style={{
              marginTop: 8,
              marginLeft: 8,
              cursor: "pointer",
              ...removeButtonStyle,
            }}
          >
            <HighlightOffIcon />
          </div>
        }
        disableAdd={disableAdd}
        disableRemove={disableRemove}
        disableReordering={disableReordering || values?.[source]?.length === 1}
      >
        <FormDataConsumer>
          {enableRenderProps
            ? (props) => children(props)
            : ({ getSource, scopedFormData }) => (
                <Box
                  display="flex"
                  alignItems={disableRemove ? "flex-start" : "center"}
                  gap={8}
                >
                  {Children.map(children, (child) => {
                    if (isValidElement(child)) {
                      return cloneElement(child, {
                        // @ts-ignore
                        source: getSource(
                          // @ts-ignore
                          child.props.source
                        ),
                        record: scopedFormData,
                        helperText: helperText,
                      });
                    }
                    return child;
                  })}
                </Box>
              )}
        </FormDataConsumer>
      </SimpleFormIterator>
    </ArrayInput>
  );
};

export default InlineArrayInput;
