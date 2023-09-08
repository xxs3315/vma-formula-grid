import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VmaFormulaGrid from '../src/index'
import '../styles/index.less'
import './worker'

createApp(App).use(VmaFormulaGrid).mount('#app')
