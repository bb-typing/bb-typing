export abstract class ICustomEvent<T> {
    public abstract readonly type: string;

    public abstract data: T
}

export abstract class IEvent<T> {
    abstract subscribe<T>(event: ICustomEvent<T>): void;

    abstract dispatch<T>(event: ICustomEvent<T>, data: T): void;
}