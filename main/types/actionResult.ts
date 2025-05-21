export type ActionResult<T> = {
    error: boolean;
    message: string;
    data?: T;
}