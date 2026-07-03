<script setup>
import { ref } from 'vue'
import { z } from 'zod'

import { Button, Checkbox, FloatLabel, IconField, InputIcon, InputText, Message } from 'primevue'
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'

import request from '@/utils/request'
import setToast from '@/utils/setToast'

const emit = defineEmits(['switchMode'])

const initialValues = ref({
    student_id: '',
    name: '',
    username: '',
    email: '',
    password: '',
    isAccepted: false,
})

const registerData = ref({
    student_id: '',
    username: '',
    name: '',
    email: '',
    password: '',
    role: '会员',
    isAccepted: false,
})

const registerSchema = z.object({
    student_id: z
        .string()
        .min(1, { message: '请填写学号' })
        .regex(/^\d+$/, { message: '学号必须为数字' }),
    name: z.string().min(1, { message: '请填写姓名' }),
    username: z.string().min(1, { message: '请填写用户名' }),
    email: z.email({ message: '邮箱格式不正确' }),
    password: z.string().min(1, { message: '请填写密码' }),
    isAccepted: z.literal(true),
})
const registerResolver = zodResolver(registerSchema)

async function onRegister() {
    if (!registerSchema.safeParse(registerData.value).success) {
        return
    }

    try {
        const resp = await request({
            url: '/user/register',
            method: 'POST',
            data: registerData.value,
        })

        if (resp.code == 200) {
            setToast('success', '注册成功', '使用你的通行证登录吧！')
            emit('switchMode')
        } else {
            setToast('error', '注册失败', resp.message)
        }
    } catch (err) {
        setToast(
            'error',
            '注册失败',
            err.response?.data?.message || '未知错误，请联系负责后端的同学'
        )
    }
}
</script>

<template>
    <Form
        v-slot="$form"
        :resolver="registerResolver"
        :initial-values="initialValues"
        class="right"
        @submit="onRegister"
    >
        <h2>注册青蟹通行证</h2>
        <br />

        <div class="input-box">
            <FloatLabel variant="on">
                <IconField>
                    <InputIcon class="pi pi-id-card" />
                    <InputText
                        v-model="registerData.student_id"
                        name="student_id"
                        size="large"
                        class="input-box"
                    />
                </IconField>
                <label for="on_label">学号</label>
            </FloatLabel>
            <Message severity="error" size="small" variant="simple">
                <span v-if="$form.student_id?.invalid">{{ $form.student_id.error?.message }}</span
                >&nbsp;
            </Message>
        </div>

        <div class="input-box">
            <FloatLabel variant="on">
                <IconField>
                    <InputIcon class="pi pi-user" />
                    <InputText
                        v-model="registerData.name"
                        name="name"
                        size="large"
                        class="input-box"
                    />
                </IconField>
                <label for="on_label">姓名</label>
            </FloatLabel>
            <Message severity="error" size="small" variant="simple">
                <span v-if="$form.name?.invalid">{{ $form.name.error?.message }}</span
                >&nbsp;
            </Message>
        </div>

        <div class="input-box">
            <FloatLabel variant="on">
                <IconField>
                    <InputIcon class="pi pi-users" />
                    <InputText
                        v-model="registerData.username"
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
                    <InputIcon class="pi pi-envelope" />
                    <InputText
                        v-model="registerData.email"
                        name="email"
                        size="large"
                        class="input-box"
                    />
                </IconField>
                <label for="on_label">邮箱</label>
            </FloatLabel>
            <Message severity="error" size="small" variant="simple">
                <span v-if="$form.email?.invalid">{{ $form.email.error?.message }}</span
                >&nbsp;
            </Message>
        </div>

        <div class="input-box">
            <FloatLabel variant="on">
                <IconField>
                    <InputIcon class="pi pi-lock" />
                    <InputText
                        v-model="registerData.password"
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
                v-model="registerData.isAccepted"
                input-id="isAccepted"
                name="isAccepted"
                binary
            />
            <label for="isAccepted"
                >&nbsp;&nbsp;我已阅读并同意<a href="#" target="_blank">《用户协议》</a></label
            >
        </div>
        <br /><br />
        <Button type="submit" label="注册" class="input-box" />

        <p class="link" @click="emit('switchMode')">已经拥有通行证？前往登录</p>
    </Form>
</template>

<style lang="less" scoped>
.right {
    display: flex;
    width: 60%;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;

    .input-box {
        width: var(--auth-input-width);
        max-width: 500px;
    }

    .link {
        color: var(--e-color-theme);
        cursor: pointer;
    }
}
</style>
