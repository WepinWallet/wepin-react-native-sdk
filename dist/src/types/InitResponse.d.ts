export interface InitResponse {
    result: boolean;
    error?: {
        code: number | string;
        message: string;
    };
}
