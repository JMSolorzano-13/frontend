import React, { useEffect, useRef } from "react";
// import { useHistory } from "react-router";
import { useNavigate } from "react-router-dom";

export default function HiddenRedirect() {
  // const history = useHistory()
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { current } = inputRef;
    if (current) {
      current.onchange = () => {
        if (current.value) {
          // history.push(`${current.value}?workspace=hidden`)
          navigate(`${current.value}?workspace=hidden`);
          current.value = "";
        }
      };
    }
  }, [inputRef.current]);

  return <input ref={inputRef} id='whri' type='hidden' />;
}
