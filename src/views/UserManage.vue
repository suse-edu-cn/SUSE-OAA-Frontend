<!-- 用户管理页 /user/manage -->
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { Column, DataTable, IconField, InputIcon, InputText, Select } from 'primevue'

import request from '@/utils/request'
import setToast from '@/utils/setToast'
import type { ApiResponse } from '@/types/api'
import type { UserListData, UserInfo } from '@/types/user'

// 部门和职位的下拉菜单
const DEPARTMENTS = ['算法竞赛部', '组织宣传部', '秘书处', '理事会', '项目实践部', '开放原子开源协会'] as const
const ROLES = ['开发者', '会长', '副会长', '部长', '副部长', '干事', '会员'] as const
const departmentOptions = DEPARTMENTS.map((d) => ({ label: d, value: d }))
const roleOptions = ROLES.map((r) => ({ label: r, value: r }))

const users = ref<UserInfo[]>([])
const loading = ref(true)

const filterDepartment = ref<string | null>(null)
const filterRole = ref<string | null>(null)
const keyword = ref('')

// 条件筛选
const filteredUsers = computed(() => {
    const dept = filterDepartment.value
    const role = filterRole.value
    const kw = keyword.value.trim().toLowerCase()
    return users.value.filter((u) => {
        if (dept && u.department !== dept) return false
        if (role && u.role !== role) return false
        if (kw && ![u.name, u.username, u.student_id].some((v) => v.toLowerCase().includes(kw))) return false
        return true
    })
})

onMounted(async () => {
    const resp = await request<ApiResponse<UserListData>>({
        url: '/user/list',
        method: 'GET',
        params: { is_all: true },
    })

    if (resp?.code == 200) {
        users.value = resp.data.list
    } else {
        setToast('error', '获取用户列表失败', resp?.message || '未知错误，请联系负责后端的同学')
    }
    loading.value = false
})
</script>

<template>
    <main>
        <h1 class="e-title">用户管理</h1>
        <DataTable
            :value="filteredUsers"
            :loading="loading"
            data-key="user_id"
            striped-rows
            paginator
            :rows="10"
            :rows-per-page-options="[10, 20, 40]"
        >
            <template #header>
                <div class="filter-bar">
                    <Select
                        v-model="filterDepartment"
                        :options="departmentOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="全部部门"
                        show-clear
                    />
                    <Select
                        v-model="filterRole"
                        :options="roleOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="全部职位"
                        show-clear
                    />
                    <IconField class="search">
                        <InputIcon class="pi pi-search" />
                        <InputText v-model="keyword" placeholder="搜索姓名 / 昵称 / 学号" fluid />
                    </IconField>
                </div>
            </template>
            <template #empty>{{ users.length ? '没有符合条件的用户' : '暂无用户数据' }}</template>
            <Column field="user_id" header="序号" sortable />
            <Column field="name" header="姓名" sortable />
            <Column field="username" header="昵称" />
            <Column field="student_id" header="学号" sortable />
            <Column field="department" header="部门" />
            <Column field="role" header="职位" />
        </DataTable>
    </main>
</template>

<style lang="less" scoped>
.filter-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;

    .search {
        flex: 1;
        min-width: 14rem;
    }
}
</style>
