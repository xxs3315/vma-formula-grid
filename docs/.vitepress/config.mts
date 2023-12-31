import { defineConfig } from 'vitepress'

export default defineConfig({
    base: '/vma-formula-grid/',
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
                    { text: '列宽行高', link: '/basic-table/basic-table-column-width-row-height' },
                    { text: '隐藏/显示行列', link: '/basic-table/basic-table-column-row-hide-show' },
                    { text: '删除/插入行列', link: '/basic-table/basic-table-insert-delete-column-row' },
                    { text: '单元格边框', link: '/basic-table/basic-table-cell-border' },
                    { text: '单元格字体颜色', link: '/basic-table/basic-table-cell-font-color' },
                    { text: '单元格背景颜色', link: '/basic-table/basic-table-cell-background-color' },
                    { text: '单元格字体样式', link: '/basic-table/basic-table-cell-font-style' },
                    { text: '单元格格式', link: '/basic-table/basic-table-cell-format' },
                    { text: '合并单元格', link: '/basic-table/basic-table-cell-merge' },
                    { text: '多语言支持', link: '/basic-table/basic-table-i18n-support' },
                ],
            },
            {
                text: '进阶表格',
                items: [
                    { text: '内置公式支持', link: '/advance-grid/advance-grid-formula' },
                    { text: '自定义公式', link: '/item-2' },
                    { text: '远程调用公式', link: '/item-3' },
                    { text: '导入数据', link: '/item-3' },
                    { text: '导出数据', link: '/item-3' },
                    { text: '打印', link: '/item-3' },
                    { text: '快捷菜单', link: '/item-3' },
                    { text: '工具栏', link: '/item-3' },
                    { text: '固定列', link: '/item-3' },
                    { text: '固定行', link: '/item-3' },
                    { text: '排序', link: '/item-3' },
                    { text: '区域内排序', link: '/item-3' },
                    { text: '筛选', link: '/item-3' },
                    { text: '区域内筛选', link: '/item-3' },
                    { text: '空数据', link: '/item-3' },
                    { text: '加载中', link: '/item-3' },
                ],
            },
            {
                text: '扩展插件',
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
                    { text: '图标', link: '/basic-components/basic-components-icon' },
                    { text: '按钮', link: '/basic-components/basic-components-button' },
                    { text: '输入框', link: '/basic-components/basic-components-input' },
                    { text: '加载器', link: '/basic-components/basic-components-loading' },
                    {
                        text: '编辑器',
                        link: '/basic-components/basic-components-code-mirror',
                    },
                    {
                        text: '下拉框',
                        link: '/basic-components/basic-components-select',
                    },
                    {
                        text: '工具栏',
                        link: '/basic-components/basic-components-textarea',
                    },
                ],
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
