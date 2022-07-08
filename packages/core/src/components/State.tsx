import { useSetState } from "ahooks";
import React, { FC, PropsWithChildren } from "react";
import { StateContext } from "../context";

export const State: FC<PropsWithChildren> = (props) => {
  const [state, setState] = useSetState<Record<string, Record<string, any>>>(
    {}
  );

  const getUpdate = (id: string, key: string) => {
    /* 后续也可以加上事件通知其他订阅有更新 */
    return (v: any) => setState((prev) => ({ [id]: {...prev[id], [key]: v} }));
  };

  const register = (id: string, key: string, value: any) => {
    const map = state[id] || {};
    if (map[key]) return [map[key], getUpdate(id, key)];
    map[key] = value;
    setState({
      [id]: map,
    });
    return [value, getUpdate(id, key)] as any;
  }

  return (
    <StateContext.Provider value={{ state, register }}>
      {props.children}
    </StateContext.Provider>
  );
};
