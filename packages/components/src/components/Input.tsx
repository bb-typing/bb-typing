import React, { ChangeEventHandler, FC, useContext } from "react";
import { StateContext } from "../../../core/src/context";

export interface InputProps {
  value: string;
  id: string;
}

export const Input: FC<InputProps> = (props) => {
  const { register } = useContext(StateContext);

  const [value, setValue] = register(props.id, "value", props.value);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  return <div>
     <input value={value} onChange={onChange} />
  </div>;
};
