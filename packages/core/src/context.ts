import { createContext } from 'react'
import { IState } from './types'


export const StateContext = createContext<IState>({} as IState)