<script setup>
import { useRoute } from 'vue-router'
import { Menu } from 'primevue'

import { version } from '@/../package.json'

const route = useRoute()

const links = [
    {
        separator: true,
    },
    {
        label: '个人设定',
        items: [
            {
                label: '主页',
                icon: 'pi pi-home',
                to: '/user',
            },
            {
                label: '编辑资料',
                icon: 'pi pi-pencil',
                to: '/user/edit',
            },
        ],
    },
    {
        separator: true,
    },
    {
        label: '设置',
        items: [
            {
                label: '工作台设置',
                icon: 'pi pi-cog',
                to: '/settings',
            },
        ],
    },
    {
        separator: true,
    },
]
</script>

<template>
    <Menu :model="links" class="drawer">
        <template #start>
            <div class="header">青蟹 工作台</div>
        </template>
        <template #submenulabel="{ item }">
            <span class="title">{{ item.label }}</span>
        </template>
        <template #item="{ item }">
            <RouterLink
                v-if="item.to"
                :to="item.to"
                class="item"
                :class="{ active: item.to === route.path }"
            >
                <i :class="item.icon"></i>
                <span>{{ item.label }}</span>
            </RouterLink>
            <span v-else class="item">
                <i :class="item.icon"></i>
                <span>{{ item.label }}</span>
            </span>
        </template>
        <span class="grow"></span>
        <template #end>
            <span class="footer">v{{ version }}</span>
        </template>
    </Menu>
</template>

<style lang="less">
.drawer {
    width: 18%;
    max-width: 270px;
    border-radius: 0 !important;
    border-right: 1px solid #ddd;
    padding: 8px 4px;
    display: flex;
    flex-direction: column;

    .header {
        font-size: 18px;
        padding: 32px;
        font-weight: bold;
        text-align: center;
    }

    .item {
        display: flex;
        align-items: center;
        gap: 0.6em;
        border-radius: var(--e-border-radius);
        padding: 10px 12px;
        cursor: pointer;
        transition: all 0.2s ease;

        &.active {
            background: var(--p-emerald-50);
            color: var(--e-color-theme);
        }

        &:not(.active):hover {
            color: var(--p-menu-submenu-label-color);
        }

        span {
            font-size: 15px;
        }
    }

    .p-menu-end {
        flex-grow: 1;
        display: inline-flex;
        align-items: flex-end;
        justify-content: center;
    }

    .footer {
        font-size: 15px;
        color: var(--p-menu-submenu-label-color);
    }
}
</style>
