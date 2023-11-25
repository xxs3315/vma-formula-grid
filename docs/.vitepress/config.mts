import { defineConfig } from 'vitepress'

export default defineConfig({
    base: '/vma-formula-grid',
    lang: 'zh-CN',
    title: 'vma-formula-grid',
    description: 'Vite & Vue powered grid table.',
    themeConfig: {
        logo: '/logo.svg',
        sidebar: [
            {
                text: '开发指南',
                items: [
                    { text: '安装', link: '/develop-help/develop-help-install' },
                    { text: '快速入门', link: '/develop-help/develop-help-start-guide' },
                ],
            },
            {
                text: '基础表格',
                items: [
                    { text: '基础', link: '/basic-table/basic-table-basic' },
                    { text: '尺寸', link: '/basic-table/basic-table-size' },
                    { text: '序号', link: '/item-3' },
                    { text: '列宽', link: '/basic-table/basic-table-column-width' },
                    { text: '行高', link: '/basic-table/basic-table-row-height' },
                    { text: '自动换行', link: '/item-3' },
                    { text: '单元格工具提示', link: '/item-3' },
                    { text: '单元格溢出省略号', link: '/item-3' },
                    { text: '斑马线条纹', link: '/item-3' },
                    { text: '边框', link: '/item-3' },
                    { text: '圆角边框', link: '/item-3' },
                    { text: '单元格样式', link: '/item-3' },
                    { text: '单元格动态样式', link: '/item-3' },
                    { text: '滚动条样式', link: '/item-3' },
                    { text: '隐藏头部', link: '/item-3' },
                    { text: '列宽拖动', link: '/item-3' },
                    { text: '行高拖动', link: '/item-3' },
                    { text: '最大高度', link: '/item-3' },
                    { text: '固定表头', link: '/item-3' },
                    { text: '固定列', link: '/item-3' },
                    { text: '固定行', link: '/item-3' },
                    { text: '固定表头和行列', link: '/item-3' },
                    { text: '表头分组', link: '/item-3' },
                    { text: '高亮列', link: '/item-3' },
                    { text: '高亮行', link: '/item-3' },
                    { text: '高亮单元格', link: '/item-3' },
                    { text: '单选框', link: '/item-3' },
                    { text: '复选框', link: '/item-3' },
                    { text: '排序', link: '/item-3' },
                    { text: '区域内排序', link: '/item-3' },
                    { text: '筛选', link: '/item-3' },
                    { text: '区域内筛选', link: '/item-3' },
                    { text: '空数据', link: '/item-3' },
                    { text: '加载中', link: '/item-3' },
                    { text: '格式化内容', link: '/item-3' },
                    { text: 'HTML单元格内容', link: '/item-3' },

                ],
            },
            {
                text: '复杂表格',
                items: [
                    { text: '事件绑定', link: '/basic-components/basic-components-icon' },
                    { text: '自定义插槽、模板', link: '/item-2' },
                    { text: '使用v-for动态实现', link: '/item-3' },
                    { text: '自定义单选框', link: '/item-3' },
                    { text: '自定义复选框', link: '/item-3' },
                    { text: '自定义排序图标', link: '/item-3' },
                    { text: '自定义筛选图标', link: '/item-3' },
                    { text: '多字段组合排序', link: '/item-3' },
                    { text: '多字段组合筛选', link: '/item-3' },
                    { text: '合并行或列', link: '/item-3' },
                    { text: '合并单元格', link: '/item-3' },
                    { text: '表尾数据', link: '/item-3' },
                    { text: '表尾行列合并', link: '/item-3' },
                    { text: '导入数据', link: '/item-3' },
                    { text: '导出数据', link: '/item-3' },
                    { text: '打印', link: '/item-3' },
                    { text: '快捷菜单', link: '/item-3' },
                    { text: '工具栏', link: '/item-3' },
                    { text: '固定表头', link: '/item-3' },
                    { text: '固定列', link: '/item-3' },
                    { text: '固定行', link: '/item-3' },
                    { text: '固定表头和行列', link: '/item-3' },
                    { text: '表头分组', link: '/item-3' },
                    { text: '高亮列', link: '/item-3' },
                    { text: '高亮行', link: '/item-3' },
                    { text: '高亮单元格', link: '/item-3' },
                    { text: '单选框', link: '/item-3' },
                    { text: '复选框', link: '/item-3' },
                    { text: '排序', link: '/item-3' },
                    { text: '区域内排序', link: '/item-3' },
                    { text: '筛选', link: '/item-3' },
                    { text: '区域内筛选', link: '/item-3' },
                    { text: '空数据', link: '/item-3' },
                    { text: '加载中', link: '/item-3' },
                    { text: '格式化内容', link: '/item-3' },
                    { text: 'HTML单元格内容', link: '/item-3' },
                    { text: '数据格式', link: '/item-3' },
                ],
            },
            {
                text: '编辑表格',
                items: [
                    { text: '弹窗编辑', link: '/basic-components/basic-components-icon' },
                    { text: '手动触发', link: '/item-2' },
                    { text: '点击触发', link: '/item-3' },
                    { text: '双击触发', link: '/item-3' },
                    { text: '选中内容', link: '/item-3' },
                    { text: '关闭自动清除', link: '/item-3' },
                    { text: '单元格占位符', link: '/item-3' },
                    { text: '插入数据', link: '/item-3' },
                    { text: '删除数据', link: '/item-3' },
                    { text: '还原数据', link: '/item-3' },
                    { text: '单元格数据校验', link: '/item-3' },
                    { text: '行数据校验', link: '/item-3' },
                ],
            },
            {
                text: '基础组件',
                items: [
                    { text: 'foobar', link: '/basic-components/basic-components-foo' },
                    { text: '图标', link: '/basic-components/basic-components-icon' },
                    { text: '按钮', link: '/basic-components/basic-components-button' },
                    { text: '输入框', link: '/basic-components/basic-components-input' },
                    { text: '加载器', link: '/basic-components/basic-components-loading' },
                    { text: '单选框', link: '/basic-components/basic-components-radio' },
                    {
                        text: '复选框',
                        link: '/basic-components/basic-components-checkbox',
                    },
                    {
                        text: '编辑器',
                        link: '/basic-components/basic-components-code-mirror',
                    },
                    {
                        text: '文本域',
                        link: '/basic-components/basic-components-textarea',
                    },
                    {
                        text: '下拉框',
                        link: '/basic-components/basic-components-select',
                    },
                    {
                        text: '下拉容器',
                        link: '/basic-components/basic-components-textarea',
                    },
                    { text: '分页', link: '/basic-components/basic-components-textarea' },
                    {
                        text: '工具栏',
                        link: '/basic-components/basic-components-textarea',
                    },
                    {
                        text: '虚拟列表',
                        link: '/basic-components/basic-components-textarea',
                    },
                    { text: '弹窗', link: '/basic-components/basic-components-textarea' },
                ],
            },
            {
                text: '高级表格',
                items: [],
            },
            {
                text: '扩展插件',
                items: [],
            },
            {
                text: 'API列表',
                items: [],
            },
        ],
    },
    markdown: {
        lineNumbers: true,
    },
})
