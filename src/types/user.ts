export interface UserAvatar {
    /** 相对路径，前端传给后端用 URI */
    uri: string
    /** 签名后 URL，用于展示 */
    url: string
}

export interface UserInfo {
    user_id: number
    student_id: string
    username: string
    name: string
    avatar: UserAvatar
    email: string
    department: string
    role: string
}
