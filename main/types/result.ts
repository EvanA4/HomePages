export class Result<T> {
    private data: T | undefined;
    public success = false;
    public message: string | undefined;

    public constructor(data?: T, message?: string) {
        if (data != undefined) {
            this.data = data;
            this.success = true;
        } else {
            this.success = false;
        }

        if (message) {
            this.message = message;
        }
    }

    public unwrap(errorMessage?: string): T {
        if (!this.success) {
            throw new Error(
                errorMessage ? errorMessage :
                "tried to unwrap unsuccessful Result"
            );
        }
        if (this.data === undefined) {
            throw new Error("tried to unwrap empty Result");    
        }
        return this.data;
    }

    public expect(handleError: () => void) {
        if (!this.success) {
            handleError();
        }
        if (!this.data) {
            throw new Error("tried to unwrap empty Result");    
        }
        return this.data;
    }
}