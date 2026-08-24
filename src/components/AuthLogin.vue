<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import cookies from 'js-cookie'

import { Button, Checkbox, FloatLabel, IconField, InputIcon, InputText, Message } from 'primevue'
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'

import { initAuthStore } from '@/utils/initAuthStore'
import request from '@/utils/request'
import setToast from '@/utils/setToast'

const router = useRouter()
const emit = defineEmits(['forgot'])

const initialValues = ref({
    username: '',
    password: '',
    isAccepted: false,
})

const loginData = ref({
    username: '',
    password: '',
    isAccepted: false,
})

const loginSchema = z.object({
    username: z.string().min(1, { message: '请填写用户名' }),
    password: z.string().min(1, { message: '请填写密码' }),
    isAccepted: z.literal(true),
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
            data: loginData.value,
        })

        if (resp.code == 200) {
            cookies.set('token', resp.data.token, {
                expires: 31,
                secure: true,
                sameSite: 'Lax',
                path: '/',
            })
            await initAuthStore()
            router.push('/user')
        } else {
            setToast('error', '登录失败', resp.message)
        }
    } catch (err) {
        setToast(
            'error',
            '登录失败',
            err.response?.data?.message || '未知错误，请联系负责后端的同学'
        )
    }
}
</script>

<template>
    <Form
        v-slot="$form"
        :resolver="loginResolver"
        :initial-values="initialValues"
        class="right"
        @submit="onLogin"
    >
        <div class="input-box">
            <FloatLabel variant="on">
                <IconField>
                    <InputIcon class="pi pi-users" />
                    <InputText
                        v-model="loginData.username"
                        name="username"
                        size="large"
                        class="input-box"
                    />
                </IconField>
                <label for="on_label">用户名</label>
            </FloatLabel>
            <Message severity="error" size="small" variant="simple">
                <span v-if="$form.username?.invalid">{{ $form.username.error?.message }}</span
                >&nbsp;
            </Message>
        </div>

        <div class="input-box">
            <FloatLabel variant="on">
                <IconField>
                    <InputIcon class="pi pi-lock" />
                    <InputText
                        v-model="loginData.password"
                        name="password"
                        type="password"
                        size="large"
                        class="input-box"
                    />
                </IconField>
                <label for="on_label">密码</label>
            </FloatLabel>
            <Message severity="error" size="small" variant="simple">
                <span v-if="$form.password?.invalid">{{ $form.password.error?.message }}</span
                >&nbsp;
            </Message>
        </div>

        <div class="input-box">
            <Checkbox
                v-model="loginData.isAccepted"
                input-id="isAccepted"
                name="isAccepted"
                binary
            />
            <label for="isAccepted"
                >&nbsp;&nbsp;我已阅读并同意<a href="#" target="_blank">《用户协议》</a></label
            >
        </div>

        <br />
        <Button type="submit" label="登录" class="input-box" />

        <p class="link" @click="emit('forgot')">忘记密码？</p>
    </Form>
</template>

<style lang="less" scoped>
.right {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 4px;
    justify-content: center;
    align-items: center;

    .input-box {
        width: 100%;
    }

    .link {
        color: var(--e-color-theme);
        cursor: pointer;
    }
}
</style>
