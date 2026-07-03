<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AuthLogin from '@/components/AuthLogin.vue'
import AuthRegister from '@/components/AuthRegister.vue'
import { useAuthStore } from '@/stores/auth'
import { initAuthStore } from '@/utils/initAuthStore'
import setToast from '@/utils/setToast'

const router = useRouter()
const authStore = useAuthStore()
const imgSet = [
    'https://img.alicdn.com/O1CN01IBboqk1ILG3pdXfvg_!!2212930340876-0-ampmedia.jpg',
    'https://img.alicdn.com/O1CN01zvyC7r1ILG3pymwEb_!!2212930340876-2-ampmedia.png',
    'https://img.alicdn.com/O1CN01MviGBa1ILG3pHXMoq_!!2212930340876-2-ampmedia.png',
    'https://img.alicdn.com/O1CN01s8aLFO1ILG3qF6k0V_!!2212930340876-2-ampmedia.png',
    'https://img.alicdn.com/O1CN01vxZ1KT1ILG3juISKN_!!2212930340876-0-ampmedia.jpg',
]

// portal 模式，0 为登录，1 为注册
const mode = ref(0)

onMounted(async () => {
    // 如果因刷新等原因导致 authStore 未初始化，则先 init
    if (!authStore.isReady) {
        await initAuthStore()
    }

    if (authStore.isAuthed) {
        setToast('success', '用户已登录', '欢迎回来，正在跳转至主页')
        router.push('/user')
        initAuthStore()
    }
})
</script>

<template>
    <main>
        <div class="left">
            <img v-once :src="imgSet[Math.floor(Math.random() * imgSet.length)]" alt="" srcset="" />
        </div>

        <AuthLogin v-if="mode == 0" @switch-mode="mode = 1" />
        <AuthRegister v-if="mode == 1" @switch-mode="mode = 0" />
    </main>
</template>

<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;
    min-height: 100%;

    .left {
        display: var(--e-display);
        flex: 1;
        justify-content: center;
        align-items: center;
        padding: 3rem;

        img {
            width: 19vw;
            height: auto;
        }
    }

    .right {
        font-size: 15px;
    }

    --auth-input-width: 20vw;
}

@media screen and (max-width: 800px) {
    main {
        --auth-input-width: 95%;
    }
}
</style>
