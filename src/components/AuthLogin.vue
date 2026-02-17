<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import cookies from 'js-cookie'

import { Button, FloatLabel, IconField, InputIcon, InputText, Message } from 'primevue'
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'

import { initAuthStore } from '@/utils/initAuthStore'
import request from '@/utils/request'
import setToast from '@/utils/setToast'

const router = useRouter()
const emit = defineEmits(['switchMode'])

const initialValues = ref({
    username: '',
    password: ''
})

const loginData = ref({
    username: '',
    password: ''
})

const loginSchema = z.object({
    username: z.string().min(1, { message: '请填写用户名' }),
    password: z.string().min(1, { message: '请填写密码' })
})
const loginResolver = zodResolver(loginSchema)

async function onLogin() {
    if (!loginSchema.safeParse(loginData.value).success) {
        return
    }

    try {
        const resp = await request({
            url: '/user/login',
            method: 'POST',
            data: loginData.value
        })

        if (resp.code == 200) {
            cookies.set('token', resp.data.token, { expires: 31, secure: true, sameSite: 'Lax', path: '/' })
            await initAuthStore()
            router.push('/user')
        } else {
            setToast('error', '登录失败', resp.message)
        }
    } catch (err) {
        setToast('error', '登录失败', err.response?.data?.message || '未知错误，请联系负责后端的同学')
    }
}
</script>

<template>
    <Form v-slot="$form" :resolver="loginResolver" :initial-values="initialValues" class="right" @submit="onLogin">
        <h2>登录青蟹通行证</h2>
        <br />

        <div class="input-box">
            <FloatLabel variant="on">
                <IconField>
                    <InputIcon class="pi pi-users" />
                    <InputText v-model="loginData.username" name="username" size="large" class="input-box" />
                </IconField>
                <label for="on_label">用户名</label>
            </FloatLabel>
            <Message severity="error" size="small" variant="simple">
                <span v-if="$form.username?.invalid">{{ $form.username.error?.message }}</span>&nbsp;
            </Message>
        </div>

        <div class="input-box">
            <FloatLabel variant="on">
                <IconField>
                    <InputIcon class="pi pi-lock" />
                    <InputText v-model="loginData.password" name="password" type="password" size="large"
                        class="input-box" />
                </IconField>
                <label for="on_label">密码</label>
            </FloatLabel>
            <Message severity="error" size="small" variant="simple">
                <span v-if="$form.password?.invalid">{{ $form.password.error?.message }}</span>&nbsp;
            </Message>
        </div>

        <br>
        <Button type="submit" label="登录" class="input-box" />

        <p class="link" @click="emit('switchMode')">没有通行证？前往注册</p>
    </Form>
</template>

<style lang="less" scoped>
.right {
    display: flex;
    width: 60%;
    flex: 1;
    flex-direction: column;
    gap: .75rem;
    justify-content: center;
    align-items: center;

    .input-box {
        width: var(--input-width);
        max-width: 500px;
    }

    .link {
        color: var(--e-color-theme);
        cursor: pointer;
    }
}
</style>
