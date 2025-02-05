import queryString from "query-string";
import { FC } from "react";
import { SelectArrayInput, SelectInput, usePermissions } from "react-admin";

import { useRequest } from "@/hooks";
import {
  buildTreeFromList,
  capitalizeFirstLetterOfEachWord,
} from "@/utils/helpers";

type TreeDropdownInputProps = {
  reference: string;
  filter?: object;
  keyId: string;
  keyParent: string;
  keyWeight?: string;
  inputType?: "selectInput" | "selectArrayInput";
  optionTextValue?: string;
  disabledChoice?: boolean;
  [key: string]: any;
};

const TreeDropdownInput: FC<TreeDropdownInputProps> = ({
  reference,
  filter,
  keyId,
  keyParent,
  keyWeight,
  inputType = "selectInput",
  optionTextValue,
  disabledChoice = false,
  ...restProps
}) => {
  const { permissions } = usePermissions();

  const stringified = queryString.stringify(filter);

  const { data } = useRequest(
    stringified ? `${reference}?${stringified}` : reference,
    {},
    { isPreFetching: true }
  );

  const tree = buildTreeFromList(data, {
    keyId,
    keyParent,
    marginLeft: 30,
  });

  const flattenChoices = (children) => {
    if (keyWeight) {
      children = children.sort((a, b) => a[keyWeight] - b[keyWeight]);
    }

    return children.flatMap(({ isExpand, isOpen, children, ...rest }) => {
      const nestedChildren = children ? flattenChoices(children) : [];

      if (permissions?.includes("superAdmin")) {
        return [rest, ...nestedChildren];
      } else if (disabledChoice) {
        return [
          {
            ...rest,
            disabled: rest.level === 0 || rest.level === 1,
          },
          ...nestedChildren,
        ];
      } else {
        return [rest, ...nestedChildren];
      }
    });
  };

  const OptionRenderer = ({ record }: any) => {
    return (
      <span style={{ marginLeft: record?.marginLeft }}>
        {record?.level !== 0 ? "-" : ""}{" "}
        {capitalizeFirstLetterOfEachWord(record?.[optionTextValue])}
      </span>
    );
  };

  const inputComponents = {
    selectInput: SelectInput,
    selectArrayInput: SelectArrayInput,
  };

  const InputComponent = inputComponents[inputType];

  return (
    <InputComponent
      variant="outlined"
      helperText={false}
      choices={flattenChoices(tree)}
      optionText={<OptionRenderer />}
      optionValue="id"
      {...restProps}
    />
  );
};

export default TreeDropdownInput;
