/**
 * 后端统一响应包装
 */
export interface ApiResponse<T = any> {
    code: number
    message: string
    data: T
}
