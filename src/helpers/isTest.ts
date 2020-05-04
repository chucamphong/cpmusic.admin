/**
 * Môi trường kiểm tra
 */
export default function isTest(): boolean {
    return process.env.NODE_ENV === "test";
}
