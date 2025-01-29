const MinusSquare = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        style={{
            enableBackground: "new 0 0 24 24",
        }}
        width="1em"
        height="1em"
        fontSize="1.5rem"
        {...props}
    >
        <path
            d="M108 284c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h232c6.6 0 12 5.4 12 12v32c0 6.6-5.4 12-12 12H108zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-48 346V86c0-3.3-2.7-6-6-6H54c-3.3 0-6 2.7-6 6v340c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"
            style={{
                fill: props.color ? props.color : "#969bad",
            }}
        />
    </svg>
);

export default MinusSquare;
