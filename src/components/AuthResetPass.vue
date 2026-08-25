<script setup>
import { onUnmounted, ref } from 'vue'
import { z } from 'zod'
import { Button, FloatLabel, IconField, InputIcon, InputText, Message } from 'primevue'
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'

import setToast from '@/utils/setToast'

const emit = defineEmits(['switchMode'])

const initialValues = ref({
    email: '',
    code: '',
})

const resetData = ref({
    email: '',
    code: '',
})

const resetSchema = z.object({
    email: z.email({ message: '邮箱格式不正确' }),
    code: z.string().regex(/^\d{6}$/, { message: '验证码格式错误' }),
})
const resetResolver = zodResolver(resetSchema)

// 发送验证码
const countdown = ref(0)
let countdownTimer = null

function sendCode() {
    if (countdown.value > 0) {
        return
    }

    // TODO: 后续接入后端，在此请求发送验证码
    if (resetSchema.shape.email.safeParse(resetData.value.email).success) {
        setToast('success', '验证码已发送', '请前往邮箱查收')
        countdown.value = 60
        countdownTimer = setInterval(() => {
            countdown.value--
            if (countdown.value <= 0) {
                clearInterval(countdownTimer)
                countdownTimer = null
            }
        }, 1000)
    } else {
        setToast('warn', '无法发送验证码', '请先填写正确的邮箱')
    }
}

onUnmounted(() => {
    if (countdownTimer) {
        clearInterval(countdownTimer)
    }
})

// TODO: 后续接入后端，在此发送重置密码请求
async function onReset() {
    if (!resetSchema.safeParse(resetData.value).success) {
        return
    }

    setToast('success', '重置成功', '请使用新密码登录')
    emit('switchMode')
}
</script>

<template>
    <Form v-slot="$form" :resolver="resetResolver" :initial-values="initialValues" class="right" @submit="onReset">
        <div class="input-box">
            <FloatLabel variant="on">
                <IconField>
                    <InputIcon class="pi pi-envelope" />
                    <InputText v-model="resetData.email" name="email" size="large" class="input-box" />
                </IconField>
                <label for="on_label">邮箱</label>
            </FloatLabel>
            <Message severity="error" size="small" variant="simple">
                <span v-if="$form.email?.invalid">{{ $form.email.error?.message }}</span
                >&nbsp;
            </Message>
        </div>

        <div class="input-box">
            <div class="code-row">
                <FloatLabel variant="on" class="code-field">
                    <IconField>
                        <InputIcon class="pi pi-unlock" />
                        <InputText v-model="resetData.code" name="code" size="large" class="code-input" />
                    </IconField>
                    <label for="on_label">验证码</label>
                </FloatLabel>
                <Button
                    type="button"
                    class="send-btn"
                    :label="countdown > 0 ? `${countdown}s 后重发` : '发送验证码'"
                    :disabled="countdown > 0"
                    @click="sendCode"
                />
            </div>
            <Message severity="error" size="small" variant="simple">
                <span v-if="$form.code?.invalid">{{ $form.code.error?.message }}</span
                >&nbsp;
            </Message>
        </div>

        <br />
        <Button type="submit" label="重置密码" class="input-box" />

        <p class="link" @click="emit('switchMode')">返回登录</p>
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

    .code-row {
        display: flex;
        gap: 8px;
        align-items: center;

        .code-field {
            flex: 1;

            .code-input {
                width: 100%;
            }
        }

        .send-btn {
            flex-shrink: 0;
        }
    }

    .link {
        color: var(--e-color-theme);
        cursor: pointer;
    }
}
</style>
