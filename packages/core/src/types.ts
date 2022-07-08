export interface IState {
    state: Record<string, Record<string, any>>

    register(id: string, key: string, value: string): [any, (v: any) => void];
}