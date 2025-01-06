import { useRef } from "react";

const useInputRef = () => useRef<HTMLInputElement>(null!);

export default useInputRef;
