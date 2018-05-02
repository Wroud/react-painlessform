export interface IFieldState<T> {
    value: T;
    isChanged: boolean;
    isVisited: boolean;
    isFocus: boolean;
}
