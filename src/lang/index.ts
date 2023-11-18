import enUS from './en-US';
import zhCN from './zh-CN';

export type Lang = 'ZH-cn' | 'En';

export const Locale: { [K in Lang]: { [key: string]: string } } = {
    En: enUS,
    'ZH-cn': zhCN,
};
