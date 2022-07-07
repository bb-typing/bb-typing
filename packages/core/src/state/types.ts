import { FC } from 'react'

export abstract class IState {
    /* 注册一个属性值 */
    abstract registerValue(com: FC, value: any):void;

    abstract getValue(com: FC, key: string): any
}