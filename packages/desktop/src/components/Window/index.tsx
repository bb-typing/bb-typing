import React, { FC, PropsWithChildren } from "react";
import { style } from "./style"

export const Window: FC<PropsWithChildren> = (props) => {
  return <div className={style.window}>
    {props.children}
  </div>
}
