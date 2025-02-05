import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const styles = {
    expandBtn: {
        width: "30px",
        height: "30px",
        margin: "auto",
        color: "#782293",
        backgroundColor: "#fef9ef",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "2px solid #782293",
        borderRadius: "50%",
        cursor: "pointer",
    },
    flex: {
        display: "flex",
    },
};

const CustomExpandButton = (node) => {
    return (
        <>
            {node && (
                <div style={styles.expandBtn}>
                    <span>{node.data._directSubordinates}</span>
                    <span style={styles.flex}>
                        {node.children ? <FaAngleUp /> : <FaAngleDown />}
                    </span>
                </div>
            )}
        </>
    );
};

export default CustomExpandButton;
