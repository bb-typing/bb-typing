import { StateContext } from "../../../../core/src/context"
import React, { FC } from "react"
import { useContext } from "react"

export interface TestShowProps {
  targetId: string,
  targetKey: string
}

export const TestShow: FC<TestShowProps> = (props) => {
  const {state} = useContext(StateContext)

  return <div>
    <span>{state[props.targetId]?.[props.targetKey]}</span>
    <div>
      <button>重置</button>
    </div>
  </div>
}
