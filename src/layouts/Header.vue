<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { initAuthStore } from '@/utils/initAuthStore'
const authStore = useAuthStore()

onMounted(async () => {
    if (!authStore.isReady) {
        await initAuthStore()
    }
})
</script>

<template>
    <header>
        <div class="left">
            <router-link to="/">青蟹</router-link>
        </div>
        <div class="grow"></div>
        <div class="right">
            <router-link to="/match">比赛中心</router-link>
            <router-link to="/user" v-if="authStore.isAuthed">
                <img :src="authStore.userInfo.avatar" alt="用户头像" />&nbsp;
                {{ authStore.userInfo.username }}
            </router-link>
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
    }
}
</style>
