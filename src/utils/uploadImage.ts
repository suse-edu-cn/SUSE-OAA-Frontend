import request from './request'
import setToast from './setToast'
import type { ApiResponse } from '@/types/api'

// 内置校验规则，不允许调用方覆盖
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']
const MAX_SIZE = 4 * 1024 * 1024

interface UploadOptions {
    /** 上传场景 */
    scene: string
}

interface UploadResult {
    /** 相对路径，前端传给后端用 URI */
    uri: string
    /** 签名后 URL，用于展示 */
    url: string
}

/**
 * 通用图片上传
 */
export default async function uploadImage(file: File, options: UploadOptions): Promise<UploadResult | null> {
    if (!ALLOWED_TYPES.includes(file.type)) {
        setToast('warn', '格式错误', '请选择符合要求的图片')
        return null
    }
    if (file.size > MAX_SIZE) {
        setToast('warn', '文件过大', '请选择符合要求的图片')
        return null
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('scene', options.scene)

    try {
        const resp = await request<ApiResponse<UploadResult>>({
            url: '/upload/image',
            method: 'POST',
            data: formData,
        })
        if (resp.code == 200) {
            return { uri: resp.data.uri || '', url: resp.data.url || '' }
        }
        setToast('error', '上传失败', resp.message)
        return null
    } catch (err: any) {
        setToast('error', '上传失败', err.response?.data?.message || '未知错误，请联系负责后端的同学')
        return null
    }
}
