/**
 * Môi trường lập trình
 */
export function isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
}

/**
 * Môi trường chạy thực
 */
export function isProduction(): boolean {
    return process.env.NODE_ENV === "production";
}

/**
 * Môi trường kiểm tra
 */
export function isTest(): boolean {
    return process.env.NODE_ENV === "test";
}

/**
 * So sánh dữ liệu giữa đối tượng 1 và đối tượng 2
 * @param obj
 * @param obj2
 * @return Trả về một object chứa những dữ liệu khác nhau giữa hai đối tượng
 */
export function difference<T>(obj: T, obj2: T) {
    return Object.keys(obj)
        .filter(key => obj[key] !== obj2[key])          // Loại bỏ những key không thay đổi trong object1
        .reduce<T>((result, key) => {                   // Join lại thành 1 object hoàn chỉnh
            return {
                ...result,
                [key]: obj[key],
            };
        }, {} as T);
}

export function noop() {}
