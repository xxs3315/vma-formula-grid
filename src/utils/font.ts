function isSupportFontFamily(f: any) {
    if (typeof f != 'string') {
        return false;
    }
    const h = 'Arial';
    if (f.toLowerCase() == h.toLowerCase()) {
        return true;
    }
    const e = 'a';
    const d = 100;
    const a = 100,
        i = 100;
    const c = document.createElement('canvas');
    const b: any = c.getContext('2d', { willReadFrequently: true });
    c.width = a;
    c.height = i;
    b.textAlign = 'center';
    b.fillStyle = 'black';
    b.textBaseline = 'middle';
    const g = function (j: any) {
        b.clearRect(0, 0, a, i);
        b.font = d + 'px ' + j + ', ' + h;
        b.fillText(e, a / 2, i / 2);
        const k = b.getImageData(0, 0, a, i).data;
        return [].slice.call(k).filter(function (l) {
            return l != 0;
        });
    };
    return g(h).join('') !== g(f).join('');
}

const engFonts = [
    { ch: 'Andale Mono', en: 'andale mono,monospace' },
    { ch: 'Arial', en: 'arial,helvetica,sans-serif' },
    { ch: 'Arial Black', en: 'arial black,sans-serif' },
    { ch: 'Book Antiqua', en: 'book antiqua,palatino,serif' },
    { ch: 'Comic Sans MS', en: 'comic sans ms,sans-serif' },
    { ch: 'Courier New', en: 'courier new,courier,monospace' },
    { ch: 'Georgia', en: 'georgia,palatino,serif' },
    { ch: 'Helvetica', en: 'helvetica,arial,sans-serif' },
    { ch: 'Impact', en: 'impact,sans-serif' },
    { ch: 'Symbol', en: 'symbol' },
    { ch: 'Tahoma', en: 'tahoma,arial,helvetica,sans-serif' },
    { ch: 'Terminal', en: 'terminal,monaco,monospace' },
    { ch: 'Times New Roman', en: 'times new roman,times,serif' },
    { ch: 'Trebuchet MS', en: 'trebuchet ms,geneva,sans-serif' },
    { ch: 'Verdana', en: 'verdana,geneva,sans-serif' },
    { ch: 'Webdings', en: 'webdings' },
    { ch: 'Wingdings', en: 'wingdings,zapf dingbats' },
];

const fonts = {
    windows: [
        {
            ch: '宋体',
            en: 'SimSun',
        },
        {
            ch: '黑体',
            en: 'SimHei',
        },
        {
            ch: '微软雅黑',
            en: 'Microsoft Yahei',
        },
        {
            ch: '微软正黑体',
            en: 'Microsoft JhengHei',
        },
        {
            ch: '楷体',
            en: 'KaiTi',
        },
        {
            ch: '新宋体',
            en: 'NSimSun',
        },
        {
            ch: '仿宋',
            en: 'FangSong',
        },
    ],
    'OS X': [
        {
            ch: '苹方',
            en: 'PingFang SC',
        },
        {
            ch: '华文黑体',
            en: 'STHeiti',
        },
        {
            ch: '华文楷体',
            en: 'STKaiti',
        },
        {
            ch: '华文宋体',
            en: 'STSong',
        },
        {
            ch: '华文仿宋',
            en: 'STFangsong',
        },
        {
            ch: '华文中宋',
            en: 'STZhongsong',
        },
        {
            ch: '华文琥珀',
            en: 'STHupo',
        },
        {
            ch: '华文新魏',
            en: 'STXinwei',
        },
        {
            ch: '华文隶书',
            en: 'STLiti',
        },
        {
            ch: '华文行楷',
            en: 'STXingkai',
        },
        {
            ch: '冬青黑体简',
            en: 'Hiragino Sans GB',
        },
        {
            ch: '兰亭黑-简',
            en: 'Lantinghei SC',
        },
        {
            ch: '翩翩体-简',
            en: 'Hanzipen SC',
        },
        {
            ch: '手札体-简',
            en: 'Hannotate SC',
        },
        {
            ch: '宋体-简',
            en: 'Songti SC',
        },
        {
            ch: '娃娃体-简',
            en: 'Wawati SC',
        },
        {
            ch: '魏碑-简',
            en: 'Weibei SC',
        },
        {
            ch: '行楷-简',
            en: 'Xingkai SC',
        },
        {
            ch: '雅痞-简',
            en: 'Yapi SC',
        },
        {
            ch: '圆体-简',
            en: 'Yuanti SC',
        },
    ],
    office: [
        {
            ch: '幼圆',
            en: 'YouYuan',
        },
        {
            ch: '隶书',
            en: 'LiSu',
        },
        {
            ch: '华文细黑',
            en: 'STXihei',
        },
        {
            ch: '华文楷体',
            en: 'STKaiti',
        },
        {
            ch: '华文宋体',
            en: 'STSong',
        },
        {
            ch: '华文仿宋',
            en: 'STFangsong',
        },
        {
            ch: '华文中宋',
            en: 'STZhongsong',
        },
        {
            ch: '华文彩云',
            en: 'STCaiyun',
        },
        {
            ch: '华文琥珀',
            en: 'STHupo',
        },
        {
            ch: '华文新魏',
            en: 'STXinwei',
        },
        {
            ch: '华文隶书',
            en: 'STLiti',
        },
        {
            ch: '华文行楷',
            en: 'STXingkai',
        },
        {
            ch: '方正舒体',
            en: 'FZShuTi',
        },
        {
            ch: '方正姚体',
            en: 'FZYaoti',
        },
    ],
    open: [
        {
            ch: '思源黑体',
            en: 'Source Han Sans CN',
        },
        {
            ch: '思源宋体',
            en: 'Source Han Serif SC',
        },
        {
            ch: '文泉驿微米黑',
            en: 'WenQuanYi Micro Hei',
        },
    ],
};

export const supportedFonts = () => {
    const sfs: any[] = [];
    engFonts.map((font: any) => {
        sfs.push(font);
    });
    Object.values(fonts).forEach((fontGroup: any) => {
        fontGroup.forEach((font: any) => {
            if (isSupportFontFamily(font.en)) {
                sfs.push(font);
            }
        });
    });
    return sfs;
};

export const getFontFamilyEnFromCh = (ch: string) => {
    let en = '';
    engFonts.forEach((font: any) => {
        if (font.ch === ch) {
            en = font.en;
        }
    });
    Object.values(fonts).forEach((fontGroup: any) => {
        fontGroup.forEach((font: any) => {
            if (font.ch === ch) {
                en = font.en;
            }
        });
    });
    return en;
};

export const getFontFamilyChFromEn = (en: string) => {
    let ch = '';
    engFonts.forEach((font: any) => {
        if (font.en === en) {
            ch = font.ch;
        }
    });
    Object.values(fonts).forEach((fontGroup: any) => {
        fontGroup.forEach((font: any) => {
            if (font.en === en) {
                ch = font.ch;
            }
        });
    });
    return ch;
};

export const supportedFontSizes = () => [6, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 64, 72, 144, 288];

export const supportedFormatters = () => {
    return [
        'formatGeneral',
        'formatNumberGeneral',
        'formatNumberPercent',
        'formatNumberScience',
        'formatNumberFraction',
        'formatNumberThousands',
        'formatTime',
        'formatShortDate',
        'formatLongDate',
        'formatCurrencyCNY',
    ];
};

export const supportedFormatterOtherCurrencies = () => {
    return [
        'formatGeneral',
        'formatNumberGeneral',
        'formatNumberPercent',
        'formatNumberScience',
        'formatNumberFraction',
        'formatNumberThousands',
        'formatTime',
        'formatShortDate',
        'formatLongDate',
        'formatCurrencyCNY',
    ];
};

export const predefinedFontFormatter = () => {
    return {
        n: {
            general: '0.00',
            percent: '0.00%',
            science: '0.00E+0',
            fraction: '0/0',
            thousands: '###,###',
        },
        d: {
            time: 'hh:mm:ss AM/PM',
            shortDate: 'yyyy-mm-dd dddd',
            longDate: 'yyyy-mm-dd hh:mm:ss AM/PM',
        },
        c: {
            cny: '#,##0.00" ¥"',
            usd: '$#,##0.00',
            euro: '#,##0" €"',
            others: [
                { label: '英镑', value: '"£ "#,##0.00' },
                { label: '港币', value: '"HK$ "#,##0.00' },
            ],
        },
    };
};
