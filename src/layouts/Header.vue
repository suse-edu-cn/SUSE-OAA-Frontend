<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Menu } from 'primevue'
import cookies from 'js-cookie'

import { useAuthStore } from '@/stores/auth'
import { initAuthStore } from '@/utils/initAuthStore'
import request from '@/utils/request'
import setToast from '@/utils/setToast'

const authStore = useAuthStore()
const router = useRouter()
const userMenu = ref() // 登录状态点击用户头像的下拉菜单

defineOptions({ name: 'PageHeader' })

onMounted(async () => {
    if (!authStore.isReady) {
        await initAuthStore()
    }
})

async function onLogout() {
    await request({
        url: '/auth/logout',
        method: 'POST',
        data: { device: 'web' },
    })

    cookies.remove('token', { path: '/' })
    cookies.remove('refresh_token', { path: '/' })
    cookies.remove('user_id', { path: '/' })
    authStore.$patch({ token: '', refreshToken: '', isAuthed: false, userInfo: null })

    setToast('success', '已登出')
    router.push('/auth')
}

const userItems = [
    {
        label: '个人主页',
        icon: 'pi pi-user',
        command: () => router.push('/user'),
    },
    {
        label: '登出',
        icon: 'pi pi-sign-out',
        command: onLogout,
    },
]
</script>

<template>
    <header>
        <div class="left">
            <router-link to="/">青蟹</router-link>
        </div>
        <div class="grow"></div>
        <div class="right">
            <router-link to="#">比赛中心</router-link>
            <div v-if="authStore.isAuthed" class="user" @click="userMenu?.toggle($event)">
                <img :src="authStore.userInfo.avatar?.url" alt="用户头像" />
                {{ authStore.userInfo.username }}
            </div>
            <Menu ref="userMenu" :model="userItems" class="header-menu" popup />
            <router-link to="/auth" v-if="!authStore.isAuthed">登录</router-link>
        </div>
    </header>
</template>

<style lang="less" scoped>
header {
    display: flex;
    border-bottom: 1px solid #ddd;
    line-height: 3.75rem;
    font-size: 1rem;
    padding: 0 var(--e-content-h-padding);

    .left {
        font-weight: 600;
    }

    .grow {
        flex-grow: 1;
    }

    .right {
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 2rem;

        a {
            display: flex;
            align-items: center;
        }

        img {
            width: 2.25em;
            height: 2.25em;
            border-radius: 50%;
        }

        .user {
            display: flex;
            align-items: center;
            gap: 0.4em;
            cursor: pointer;
        }
    }
}
</style>

<style lang="less">
.header-menu {
    .p-menu-item-link {
        padding: 8px 10px;
        font-size: 15px;
    }
}
</style>
