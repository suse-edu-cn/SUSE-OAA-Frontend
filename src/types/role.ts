/** 协会职位条目 */
export interface RoleItem {
    id: number
    name: string
    /** 权限等级，数值越大权限越高 */
    level: number
    /** 是否启用 */
    is_active: boolean
}
