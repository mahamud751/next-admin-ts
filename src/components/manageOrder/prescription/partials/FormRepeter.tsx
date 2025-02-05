import { Children, cloneElement, isValidElement } from "react";
import { useFormState } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";

import { isObject } from "../../../../../utils/helpers";
import { MinusSquareIcon, SquarePlusIcon } from "../../../../icons";

const FormRepeter = ({ children, classes, ...props }) => {
    const { values } = useFormState();
    const currentValues = values[props.name];
    const arrayChildren = Children.toArray(children);

    return (
        <FieldArray name={props.name}>
            {({ fields }) => (
                <>
                    {fields.map((name, index) => (
                        <div
                            className={classes.displyFlexSpaceBetween}
                            key={index}
                        >
                            {Children.map(arrayChildren, (child) => {
                                if (!isValidElement(child)) return;

                                return cloneElement(child, {
                                    ...child.props,
                                    source: child.props.source
                                        ? `${name}.${child.props.source}`
                                        : `${name}`,
                                    label: props.label
                                        ? ` ${index + 1}. ${child.props.label}`
                                        : child.props.label,
                                    paranetName: name,
                                    key: `${name}.${child.props.key}`,
                                });
                            })}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    flexDirection: "column",
                                }}
                            >
                                {fields.length > 1 && (
                                    <MinusSquareIcon
                                        onClick={() => fields.remove(index)}
                                        style={{
                                            cursor: "pointer",
                                            fontSize: 20,
                                        }}
                                    />
                                )}
                                {index === fields.length - 1 && (
                                    <SquarePlusIcon
                                        onClick={() => {
                                            if (
                                                currentValues &&
                                                currentValues.length > 0
                                            ) {
                                                isObject(currentValues[index])
                                                    ? fields.push({})
                                                    : fields.push("");
                                            } else {
                                                fields.push("");
                                            }
                                        }}
                                        color="#008069"
                                        style={{
                                            cursor: "pointer",
                                            fontSize: 20,
                                            marginTop: 5,
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </>
            )}
        </FieldArray>
    );
};

export default FormRepeter;
