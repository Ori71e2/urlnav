export interface EmailTranDto {
    id?: number;
    name: string;
    host?: string;
    port?: number;
    user?: string;
    pass?: string;
    createtime?: number;
    active?: boolean;
    activetime?: number;
}