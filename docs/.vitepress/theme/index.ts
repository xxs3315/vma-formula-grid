import DefaultTheme from 'vitepress/theme'
import './custom.less'

import VmaFormulaGrid from '../../../src'
import '../../../styles/index.less'

export default {
    ...DefaultTheme,
    enhanceApp(ctx: any) {
        DefaultTheme.enhanceApp(ctx)
        ctx.app.use(VmaFormulaGrid)
    },
}
