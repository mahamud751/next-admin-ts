const SquarePlus = (props) => (
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
            d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
            style={{
                fill: props.color ? props.color : "#969bad",
            }}
        />
    </svg>
);

export default SquarePlus;
