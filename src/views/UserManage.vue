<!-- 用户管理页 /user/manage -->
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { Button, Checkbox, Column, DataTable, Dialog, IconField, InputIcon, InputText, Select } from 'primevue'

import request from '@/utils/request'
import setToast from '@/utils/setToast'
import { useOrgStore } from '@/stores/org'
import type { ApiResponse } from '@/types/api'
import type { UserListData, UserInfo } from '@/types/user'

// 部门和职位的下拉菜单
const orgStore = useOrgStore()

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

// 删除用户
const deleteVisible = ref(false)
const deleteTarget = ref<UserInfo | null>(null)
const deleteAcknowledged = ref(false)
const deleting = ref(false)

function openDelete(user: UserInfo) {
    deleteTarget.value = user
    deleteAcknowledged.value = false
    deleteVisible.value = true
}

async function onDelete() {
    const target = deleteTarget.value
    if (!target) return

    deleting.value = true
    const resp = await request<ApiResponse<null>>({
        url: '/user/delete',
        method: 'POST',
        data: { user_id: target.user_id },
    })
    deleting.value = false

    if (resp?.code == 200) {
        // 前端同步移除该用户
        users.value = users.value.filter((u) => u.user_id !== target.user_id)
        setToast('success', '删除成功', `已删除用户：${target.name}（${target.username}）`)
        deleteVisible.value = false
    } else {
        setToast('error', '删除失败', resp?.message || '未知错误，请联系负责后端的同学')
    }
}

onMounted(async () => {
    const [userResp] = await Promise.all([
        request<ApiResponse<UserListData>>({
            url: '/user/list',
            method: 'GET',
            params: { is_all: true },
        }),
        orgStore.ensureLoaded(),
    ])

    if (userResp?.code == 200) {
        users.value = userResp.data.list
    } else {
        setToast('error', '获取用户列表失败', userResp?.message || '未知错误，请联系负责后端的同学')
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
                        :options="orgStore.departments"
                        option-label="name"
                        option-value="name"
                        placeholder="全部部门"
                        show-clear
                    />
                    <Select
                        v-model="filterRole"
                        :options="orgStore.roles"
                        option-label="name"
                        option-value="name"
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
            <Column header="">
                <template #body="{ data }">
                    <Button icon="pi pi-trash" severity="danger" text @click="openDelete(data as UserInfo)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="deleteVisible" modal header="删除用户" :style="{ width: '26rem' }">
            <p>
                是否删除用户 <b>{{ deleteTarget?.name }}</b
                >（{{ deleteTarget?.username }}）？
            </p>
            <div class="dialog-confirm">
                <Checkbox v-model="deleteAcknowledged" input-id="delete-ack" binary />
                <label for="delete-ack">我已知晓该操作不可恢复</label>
            </div>
            <template #footer>
                <Button label="取消" severity="secondary" text @click="deleteVisible = false" />
                <Button
                    label="删除"
                    severity="danger"
                    :disabled="!deleteAcknowledged"
                    :loading="deleting"
                    @click="onDelete"
                />
            </template>
        </Dialog>
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

.dialog-confirm {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5em;
}
</style>
