import { IState } from "./types";
import {FC} from 'react'
import { get, isObject, merge } from "lodash-es";

export class State implements IState {
    private state: WeakMap<FC, any>;

    constructor() {
        this.state = new WeakMap<FC, any>()
    }

    registerValue(com: FC, value: any) {
        if (!isObject(value)) throw new Error('registerValue的值必须为一个对象')
        let obj = this.state.get(com) || {}
        obj = merge(obj, value)
        this.state.set(com, value)
    }

    getValue(com: FC, key: string) {
        if (!this.state.has(com)) throw new Error('不存在状态值')
        const obj = this.state.get(com)
        return get(obj, key)
    }
}