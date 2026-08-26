import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
})

const request = async function <T>(config: {
    url: string
    method?: 'GET' | 'POST'
    data?: any
    params?: any
    token?: string
}): Promise<T> {
    try {
        // 优先使用调用时提供的 token，否则从 store 中获取
        let token = config.token || ''
        if (!token) {
            try {
                const authStore = useAuthStore()
                token = authStore.token || ''
            } catch (e) {
                console.warn(e)
            }
        }
        // 创建请求；后续接口统一要求 Authorization: Bearer <token>
        const response = await instance.request<T>({
            url: config.url,
            method: config.method || 'GET',
            data: config.data || {},
            params: config.params || {},
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        return response.data
    } catch (error: any) {
        return error.response?.data
    }
}

export default request
