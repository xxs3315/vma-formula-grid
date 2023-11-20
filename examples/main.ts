import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { VmaFormulaGrid } from '../src/index.common'
import '../styles/index.less'

createApp(App).use(VmaFormulaGrid).mount('#app')
