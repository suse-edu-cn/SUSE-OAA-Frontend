<script setup>
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { Toast } from 'primevue'
import { useToast } from 'primevue/usetoast'
import 'normalize.css'

import { initToast } from '@/utils/setToast.ts'
import Header from '@/layouts/Header.vue'
import Footer from '@/layouts/Footer.vue'
import Drawer from '@/components/Drawer.vue'
import '@/styles/reset.less'

initToast(useToast())

const route = useRoute()
</script>

<template>
    <Toast position="top-center" />
    <Header />
    <div class="e-body" :class="{ 'e-no-drawer': route.path === '/' || route.path === '/auth' }">
        <Drawer v-if="!(route.path === '/' || route.path === '/auth')" />
        <section class="e-view-wrapper">
            <div class="e-view">
                <RouterView />
            </div>
            <Footer />
        </section>
    </div>
</template>

<style lang="less" scoped>
.e-body {
    flex: 1;
    display: flex;
    width: 100%;
    min-height: 0;
}

.e-view-wrapper {
    flex: 1;
    min-height: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.e-view {
    flex: 1;
    min-height: 0;
}
</style>
