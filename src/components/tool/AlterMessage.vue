<template>
    <div class="message" :class="messageClass" v-if="visible">
        <img :src="svgContent" id="icon" alt=""/>
        <span class="text">{{ text }}</span>
    </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';
import successIcon from '@/assets/icon/success.svg';
import errorIcon from '@/assets/icon/error.svg';
import warnIcon from '@/assets/icon/warn.svg';
const props = defineProps({
    text: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: 'error'
    }
});

const visible = ref(false);
const messageClass = ref('');
const svgContent = ref('');

onMounted(() => {
    switch (props.type) {
        case 'warn':
            svgContent.value = warnIcon;
            messageClass.value = 'warn-message';
            break;
        case 'error':
            svgContent.value = errorIcon;
            messageClass.value = 'error-message';
            break;
        case 'success':
            svgContent.value = successIcon;
            messageClass.value = 'success-message';
            break;
        default:
            break;
    }
    visible.value = true;
});
</script>

<style scoped>
.message {
    position: fixed;
    z-index: 88888;
    top: 0;
    color: black;
    left: 50%;
    height: 40px;
    line-height: 40px;
    top: 60px;
    transform: translate(-50%);
    padding: 12px;
    background-color: rgb(255, 255, 255);
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: downed 100ms ease, fadeOut 100ms ease 2900ms forwards;
    border-radius: 4px;
    box-sizing: border-box;
}

.warn-message {
    color: rgb(223, 189, 0);
}

.error-message {
    color: rgb(230, 0, 0);
}

.success-message {
    color: rgb(0, 128, 0);
}

@keyframes downed {
    0% {
        opacity: 0;
        top: 50px;
    }

    100% {
        opacity: 1;
        top: 60px;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

.text {
    margin-left: 5px;
    max-width: 400px;
    overflow: ellipsis;
    white-space: nowrap;
}

#icon {
    width: 20px;
}
</style>