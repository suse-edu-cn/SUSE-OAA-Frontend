<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primevue'

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

// portal 模式：login 为登录，register 为注册
const mode = ref('login')

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

        <div class="right">
            <Tabs v-model:value="mode" class="tab-container">
                <TabList>
                    <Tab value="login" class="tab-value">登录</Tab>
                    <Tab value="register" class="tab-value">注册</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="login">
                        <AuthLogin />
                    </TabPanel>
                    <TabPanel value="register">
                        <AuthRegister @switch-mode="mode = 'login'" />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
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
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        font-size: 15px;

        .tab-container {
            width: var(--auth-input-width);
            max-width: 500px;
            align-self: center;

            .tab-value {
                width: 50%;
            }

            // 面板叠放在同一网格，容器高度恒为最高面板
            // 避免切换时高度变化导致 Tab 头位置变动
            :deep(.p-tabpanels) {
                display: grid;
            }

            :deep(.p-tabpanel) {
                grid-area: 1 / 1;
            }

            :deep(.p-tabpanel[data-p-active='false']) {
                display: block !important;
                visibility: hidden;
                opacity: 0; // 作用于整个子树合成，避免子元素 transition 拖出残影
                pointer-events: none;
            }
        }
    }

    --auth-input-width: max(20vw, 300px);
}

@media screen and (max-width: 800px) {
    main {
        --auth-input-width: 100%;
    }
}
</style>
