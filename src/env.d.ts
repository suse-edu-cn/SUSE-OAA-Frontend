/// <reference types="vite/client" />
declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare const __GIT_VERSION__: string
