export interface UserAvatar {
    /** 相对路径，前端传给后端用 URI */
    uri: string
    /** 签名后 URL，用于展示 */
    url: string
}

/** 当前用户信息 /user/me */
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

/** 用户列表 /user/list */
export interface UserListData {
    total: number
    list: UserInfo[]
}
