/**
 * Môi trường chạy thực
 */
export default function isProduction(): boolean {
    return process.env.NODE_ENV === "production";
}
