import cookies from 'js-cookie'
import request from './request'
import { useAuthStore } from '@/stores/auth'

export async function initAuthStore() {
    const authStore = useAuthStore()
    const token = cookies.get('token')

    // 如果 cookie 里有 token，则尝试获取用户信息
    if (token) {
        authStore.token = token
        authStore.refreshToken = cookies.get('refresh_token') || ''
        try {
            const stateResp: {
                code: number
                data: any
                message: string
            } = await request({
                url: '/user/me',
                method: 'GET',
                token,
            })
            if (stateResp.code == 200) {
                authStore.isAuthed = true
                authStore.userInfo = stateResp.data
                authStore.userInfo.avatar = stateResp.data.avatar || { uri: '', url: '' }
                authStore.userInfo.department = stateResp.data.department || '未设置职位'
            } else {
                authStore.token = ''
                cookies.remove('token')
            }
        } catch (e) {
            console.warn(e)
        }
    }

    // 设置 isReady，此时 authStore 已经初始化完成
    authStore.isReady = true
}
