import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VmaFormulaGrid from '../src/index'
import '../src/styles/index.less'

// TODO remove as any
createApp(App).use(VmaFormulaGrid as any).mount('#app')
