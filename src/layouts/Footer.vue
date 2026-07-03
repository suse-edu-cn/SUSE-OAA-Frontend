<script setup lang="ts">
defineOptions({ name: 'PageFooter' })
</script>

<template>
    <footer>
        <p>&copy; 2025-2026 Explosion Production.</p>
    </footer>
</template>

<style scoped lang="less">
footer {
    width: 100%;
    color: var(--p-gray-600);
    font-size: 14px;
    padding: 16px 20px;
    border-top: 1px solid #ddd;

    p {
        margin: 0;
    }
}
</style>
