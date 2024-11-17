document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const imageSizeSelect = document.getElementById('imageSize');
    const imageStyleSelect = document.getElementById('imageStyle');
    const colorThemeSelect = document.getElementById('colorTheme');

    generateBtn.addEventListener('click', generateImage);
    downloadBtn.addEventListener('click', downloadImage);

    const colorThemes = {
        random: () => `hsl(${Math.random() * 360}, 70%, 50%)`,
        pastel: () => `hsl(${Math.random() * 360}, 70%, 80%)`,
        warm: () => `hsl(${Math.random() * 60 + 0}, 70%, 50%)`,
        cool: () => `hsl(${Math.random() * 60 + 180}, 70%, 50%)`,
        monochrome: (() => {
            const baseHue = Math.random() * 360;
            return () => `hsl(${baseHue}, ${Math.random() * 30 + 20}%, ${Math.random() * 60 + 20}%)`;
        })(),
        rainbow: (() => {
            let hueIndex = 0;
            return () => `hsl(${hueIndex++ * 30 % 360}, 70%, 50%)`;
        })(),
        forest: () => `hsl(${Math.random() * 60 + 90}, 70%, ${Math.random() * 30 + 20}%)`,
        ocean: () => `hsl(${Math.random() * 60 + 180}, 70%, ${Math.random() * 30 + 30}%)`
    };

    function getThemeColor(alpha = 1) {
        const theme = colorThemeSelect.value;
        const color = colorThemes[theme]();
        return alpha === 1 ? color : color.replace('hsl', 'hsla').replace(')', `, ${alpha})`);
    }

    function getThemeColors(count) {
        const colors = [];
        for(let i = 0; i < count; i++) {
            colors.push(getThemeColor());
        }
        return colors;
    }

    // 艺术家信息数据库
    const artistDatabase = {
        names: {
            realistic: {  // 真实风格的艺术家
                modern: [
                    { zh: "陈逸飞", en: "Chen Yifei", nationality: "中国" },
                    { zh: "赵无极", en: "Zao Wou-Ki", nationality: "法国/中国" },
                    { zh: "草间弥生", en: "Yayoi Kusama", nationality: "日本" },
                    { zh: "村上隆", en: "Takashi Murakami", nationality: "日本" },
                    { zh: "徐冰", en: "Xu Bing", nationality: "中国" },
                    { zh: "张晓刚", en: "Zhang Xiaogang", nationality: "中国" },
                    { zh: "岳敏君", en: "Yue Minjun", nationality: "中国" },
                    { zh: "蔡国强", en: "Cai Guoqiang", nationality: "中国" },
                    { zh: "奈良美智", en: "Yoshitomo Nara", nationality: "日本" },
                    { zh: "杜松儿", en: "Du Songer", nationality: "中国" }
                ],
                classical: [
                    { zh: "莫奈", en: "Claude Monet", nationality: "法国" },
                    { zh: "梵高", en: "Vincent van Gogh", nationality: "荷兰" },
                    { zh: "毕加索", en: "Pablo Picasso", nationality: "西班牙" },
                    { zh: "达利", en: "Salvador Dalí", nationality: "西班牙" },
                    { zh: "康定斯基", en: "Wassily Kandinsky", nationality: "俄国" },
                    { zh: "蒙德里安", en: "Piet Mondrian", nationality: "荷兰" },
                    { zh: "马蒂斯", en: "Henri Matisse", nationality: "法国" },
                    { zh: "克利", en: "Paul Klee", nationality: "德国" },
                    { zh: "米罗", en: "Joan Miró", nationality: "班牙" }
                ]
            },
            fictional: {  // 虚构风格的艺术
                modern: [
                    { zh: "胡嘟嘟", en: "Hu Dudu", nationality: "中国" },
                    { zh: "人工智障", en: "AI.Derp", nationality: "量子位面" },
                    { zh: "代码工具人", en: "Code Slave", nationality: "996帝国" },
                    { zh: "调试大师", en: "Debug Master", nationality: "控制台联邦" },
                    { zh: "编译报错", en: "Compile Error", nationality: "异常共和国" },
                    { zh: "重启大法", en: "Reboot Sage", nationality: "蓝屏之都" },
                    { zh: "内存泄露", en: "Memory Leak", nationality: "崩溃之地" },
                    { zh: "堆栈溢出", en: "Stack Overflow", nationality: "递归深渊" },
                    { zh: "无限循环", en: "Infinite Loop", nationality: "死锁之域" },
                    { zh: "咖啡因成瘾者", en: "Caffeine Addict", nationality: "熬夜联邦" },
                    { zh: "周一恐惧症", en: "Monday Phobia", nationality: "摸鱼王国" },
                    { zh: "划水艺术家", en: "Procrastination Master", nationality: "懒惰之" },
                    { zh: "外卖骑士", en: "Sir Delivery", nationality: "饿了么帝国" },
                    { zh: "夜冠军", en: "King of Night", nationality: "失眠联邦" },
                    { zh: "社恐大师", en: "Master of Antisocial", nationality: "独居星球" },
                    { zh: "外卖评论家", en: "Food Comment Master", nationality: "美团王国" },
                    { zh: "快乐肥宅", en: "Happy Otaku", nationality: "沙发共和国" },
                    { zh: "键盘大侠", en: "Keyboard Warrior", nationality: "网络江湖" },
                    { zh: "打工魂", en: "Work Spirit", nationality: "社畜之都" },
                    { zh: "摸鱼王者", en: "King of Slack", nationality: "划水联邦" },
                    { zh: "追剧达人", en: "Drama Expert", nationality: "沙发帝国" },
                    { zh: "脱发研究员", en: "Hair Loss Scientist", nationality: "秃头王国" },
                    { zh: "熊猫眼专家", en: "Panda Eyes Pro", nationality: "黑眼圈联邦" },
                    { zh: "废话大师", en: "Master of Nonsense", nationality: "唠叨之国" },
                    { zh: "整活王者", en: "Meme Lord", nationality: "沙雕联邦" },
                    { zh: "柴米油盐", en: "Daily Necessity", nationality: "烟火人间" }
                ],
                classical: [
                    { zh: "bug之父", en: "Father of Bugs", nationality: "混沌帝国" },
                    { zh: "报错终结者", en: "Error Terminator", nationality: "异常之域" },
                    { zh: "重启大师", en: "Reboot Master", nationality: "蓝屏联邦" },
                    { zh: "睡神", en: "Sleep God", nationality: "周公领地" },
                    { zh: "厨房杀手", en: "Kitchen Destroyer", nationality: "外卖帝国" },
                    { zh: "拖延大帝", en: "Procrastination Emperor", nationality: "明日王国" },
                    { zh: "快乐单身狗", en: "Happy Single Dog", nationality: "一人食帝国" }
                ]
            }
        },
        styleMovements: {
            abstract: ["抽象表现主义", "行动绘画", "色绘画", "几何抽象"],
            geometric: ["构成主义", "至上主义", "简约主义", "欧普艺术"],
            pattern: ["图案艺术", "装饰艺术", "新艺术运动", "重复艺术"],
            mandala: ["神秘主义艺术", "精神性艺术", "冥想艺术", "宗教艺术"],
            gradient: ["色彩场绘画", "光艺术", "渐变艺术", "氛围艺术"],
            mosaic: ["像素艺术", "数字马赛克", "点彩", "像素义"],
            wave: ["动态艺术", "韵律艺术", "声波艺术", "动能艺术"]
        },
        years: {
            min: 1850,
            max: 2024
        },
        // 添加展览场馆数据
        exhibitions: {
            realistic: {
                modern: [
                    "MoMA现代艺术博物馆，纽约",
                    "泰特现代美术馆，伦敦",
                    "蓬皮杜艺术中心，巴黎",
                    "今日美术馆，北京",
                    "上海当代艺术博物馆",
                    "东京都现代美术馆",
                    "古根海姆美术馆，纽约",
                    "维多利亚国家美术馆，墨尔本"
                ],
                classical: [
                    "卢浮宫，巴黎",
                    "大都会艺术博物馆，纽约",
                    "国家美术馆，伦敦",
                    "梵蒂冈博物馆，罗马",
                    "故宫博物院，北京",
                    "乌菲兹美术馆，佛罗伦萨"
                ]
            },
            fictional: {
                modern: [
                    "外卖骑手纪念馆，美团城",
                    "熬夜选名人堂，失眠大陆",
                    "社恐避难所艺术中心，独居星",
                    "快乐肥宅基地，沙发王国",
                    "外卖评论家展览馆，美食之都",
                    "脱发研究中心，秃头之巅",
                    "熊猫眼艺术馆，通宵城",
                    "整活艺术中心，沙雕之都",
                    "社畜解压中心，打工地狱",
                    "摸鱼圣地，划水天堂"
                ],
                classical: [
                    "睡神祭坛，周公领地",
                    "拖延博物馆，明日帝国",
                    "单身狗纪念馆，一人食之都",
                    "厨房废墟展览馆，外卖王国"
                ]
            }
        },

        // 添加收藏机构
        collections: {
            realistic: [
                "古根海姆博物馆",
                "大都会艺术博物馆",
                "泰特美术馆",
                "蓬皮杜艺术中心",
                "中国美术馆",
                "东京国立近代美术馆",
                "维多利亚和阿尔伯特博物馆",
                "芝加哥艺术博物馆"
            ],
            fictional: [
                "量子位面艺术基金会",
                "跨次元收藏协会",
                "平行宇宙文化中心",
                "数字意识保护组织",
                "赛博空间艺术联盟",
                "混沌理论研究所",
                "虚构现实保护协会",
                "元宇宙文明档案馆",
                "人工智能艺术联合体",
                "数字永生基金会",
                "外卖订单收藏协会",
                "熬夜冠军名人堂",
                "社恐人士互助会",
                "快乐肥宅联盟",
                "外卖评论家协会",
                "脱发研究基金会",
                "熊猫眼保护协会",
                "整活艺术保护中心",
                "社畜文化保护组织",
                "摸鱼技术研究所"
            ]
        },

        // 添加拍卖行
        auctionHouses: {
            realistic: [
                "佳士得",
                "苏富比",
                "富艺斯",
                "中国嘉德",
                "北京保利",
                "荣宝斋",
                "上海朵云轩"
            ],
            fictional: [
                "量子拍卖行",
                "跨次元艺术易所",
                "平行宇宙拍卖中心",
                "数字意识交易平台",
                "元宇宙艺术市场",
                "虚构现实交易所",
                "意识上传拍卖行",
                "量子波动交易中心",
                "外卖优惠券交易所",
                "熬夜用品拍卖行",
                "社恐必备用品交易中心",
                "快乐肥宅零食拍卖会",
                "外卖评论家联合交易所",
                "脱发预防产品拍卖行",
                "熊猫眼修复技术交易所",
                "整活梗图交易中心",
                "社畜解压用品拍卖行"
            ]
        },

        // 添加创作背景模板
        backgrounds: [
            "作品创作于{year}年，是艺术家探索{movement}的重要时期",
            "这件作品体现了{year}年代{movement}的典型特征",
            "作品完成于{year}年，展现了艺术家对{movement}的深刻理解",
            "这是艺术家{year}致于{movement}创作的代表作",
            "作品反映了{year}年代{movement}的艺术思潮"
        ],

        // 添加生平描述模板
        biographies: {
            realistic: {
                modern: [
                    "{artist}，{nationality}当代艺术家。毕业于中央美术学院，后赴法国深造。其作品融合东西方美学思想，在{movement}领域开创性地运用新材料与技法。曾获得多项国际艺术大奖，作品被纽约现代艺术博物馆等机构永久收藏。",
                    "{artist}出生于艺术世家，{nationality}著名艺术家。在巴黎美术学院学习期间接触{movement}，此后致力于将传统艺术语言与现代表现手法相结合。其作品体现了深厚的文化底蕴和前卫的艺术思维。",
                    "作为{nationality}最具影响力的当代艺术家之一，{artist}的创作横跨装置、绘画、影像等多个领域。其对{movement}的探索获得了国际艺术界的广泛认可，作品多次参加威尼斯双年展。",
                    "{artist}早年在东京艺术大学学习，后赴欧洲游历。作为{nationality}新锐艺术家，其作品体现了对{movement}独特的理解，将东方美学与现代艺术完美融合。"
                ],
                classical: [
                    "{artist}是{movement}的开创者之一，其一生致力于艺术革新。早期在巴黎美术学院学习，后因战争辗转多地，这些经历深刻影响了其艺术风格。晚年定居南法，创作了大量代表作。",
                    "作为{nationality}艺术史上最具影响力的大师，{artist}的创作对{movement}的发展产生了深远影响。其独特的色彩运用和构图方式开创了现代艺术的新纪元。",
                    "{artist}出生于{nationality}艺术世家，青年时期就展现出非凡的艺术天赋。在各大美术学院学习期间，开始探索{movement}的可能性。其作品被卢浮宫等世界顶级美术馆收藏。"
                ]
            },
            fictional: {
                modern: [
                    "{artist}生于{nationality}，从小就展现出惊人的摸鱼天赋。大学期间因为连续翘课一个月被发现时居然还在实验室里睡觉，这段经历启发了其后来在{movement}领域的创作。据说每件作品都是在午睡时完成的。",
                    "身为{nationality}新锐艺术家，{artist}因一次严重的咖啡因过量而获得灵感，开创了{movement}流派。其代表作《第38杯咖啡之后》被星巴克总部永久收藏。",
                    "{artist}曾是一名程序员，在第10086次修改bug后突然顿悟，放弃年薪50万的工作，转而投身{movement}艺术创作。其作品《永恒的404》被故障艺术博物馆收藏。",
                    "作为{nationality}著名的外卖评论家，{artist}将日常点评外卖的经历转化为艺术创作开创了{movement}��流派。据说其灵感来源于一次外卖超时赔付的顿悟。",
                    "{artist}是{nationality}知名的熬夜艺术家，因常年作息颠倒，作品呈现出独特的朦胧美感。其代表作《凌晨四点的代码被评为年度最佳熊猫眼艺术作品。"
                ],
                classical: [
                    "{artist}是{nationality}传奇人物，据说一生都在寻找完美的外卖优惠券。在这个过程中，外开创了{movement}艺术流派。其作品《消失的满减券》被美团博物馆永久收藏。",
                    "作为{movement}的创始人，{artist}最初是因为修电脑时不小心把系统搞崩溃，在蓝屏中看到了艺术的真谛。此后，其作品《蓝屏的诗意》轰动整个艺术界。",
                    "{artist}原是{nationality}知名的社恐患者，因为不敢出门参加画展，开创了云端展览模式。其代表作《我真的不想出门》启发了一代宅家艺术家。"
                ]
            }
        },

        // 添加艺术家教育背景
        education: {
            realistic: {
                modern: [
                    "毕业于中央美术学院，后赴法国巴黎高等美术学院深造",
                    "东京艺术大学毕业，获美术学博士学位",
                    "就读于伦敦艺术大学，后在纽约视觉艺术学院进修"
                ],
                classical: [
                    "巴黎美术学院深造",
                    "佛罗伦萨美术学院学习",
                    "圣彼得堡艺术学院毕业"
                ]
            },
            fictional: {
                modern: [
                    "网易云音乐评论区高级研究员",
                    "蓝屏修复艺术学院首席研究员",
                    "熬夜修仙大学睡眠学博士"
                ],
                classical: [
                    "外卖点评艺术学院荣誉教授",
                    "社交恐惧症研究所终身研究员",
                    "划水艺术大学摸鱼系主任"
                ]
            }
        },

        // 添加虚构的艺术流派
        fictionalMovements: {
            abstract: ["量子涂鸦主义", "混沌美学", "薛定谔艺术", "虚空表现主义"],
            geometric: ["多维几何派", "分形艺术", "超弦理论派", "时空扭曲学派"],
            pattern: ["神经网络艺术", "递归模式派", "像素重组主义", "数据可视派"],
            mandala: ["意识流曼陀罗", "量子纠缠艺术", "平行宇宙派", "意识上传学派"],
            gradient: ["虚拟渐变派", "全息投影主义", "量子色彩学", "意识波动派"],
            mosaic: ["数字碎片派", "比特马赛克", "像素重组主义", "数据马赛克派"],
            wave: ["脑波艺术", "量子波动派", "意识震荡学派", "数据流派"]
        },

        // 添加虚构的创作背景模板
        fictionalBackgrounds: [
            "作品创作于{year}年的一次代码崩溃后，艺术家在修复bug的过程中意外发现了{movement}的奥秘",
            "这是艺术家在连续工作96小时后，被咖啡因驱动创作的代表作",
            "作品诞生于一次严重的系统蓝屏后，艺术家将错误代码转化为{movement}",
            "这件作品是在一次代码无限循环中自动生成的，艺术家称之为{movement}的巅峰",
            "创作灵感来自于艺术家修改了10086代码后幻觉",
            "这是艺术家在一次严重的内存泄露后，从垃圾回收器中抢救出来的杰作",
            "作品反映了艺术家对404页面的深刻理解和再创造",
            "作品创作于{year}年的一次外卖延迟后，艺术家在等待的过程中突然顿悟了{movement}的真谛",
            "这是艺术家在连续熬夜一周后，被幻觉驱使创作的代表作",
            "作品诞生于一次严重的社交恐惧发作时，艺术家将内心的恐慌转化为{movement}",
            "这件作品是在第10086次点外卖时灵光乍现的产物",
            "创作灵感来自于艺术家第三次把厨房炸了之后的顿悟",
            "这是艺术家在连续追剧72小时后的意识流创作",
            "作品反映了艺术家对秃头危机的深刻思考",
            "这是一次外卖被偷吃后的愤怒创作",
            "灵感源于艺术家第100次被催婚时的理状态",
            "作品完成于连续加班30天后的某个凌晨"
        ],

        // 添加虚构的生平描述模板
        fictionalBiographies: {
            modern: [
                "{artist}生于{nationality}，从小就展现出对编程语言的过敏反应，这促使其走上艺术道路。",
                "作为{movement}的代表人物，{artist}以每天至少产生100个bug闻名于世。",
                "{artist}声称自己是被人工智能养大的，这使其作品具有独特的机器美学。",
                "据说{artist}的创作灵感来自于每天凌晨3点的代码重构。",
                "{artist}生于{nationality}，从小就展现出过人的摸鱼天赋。",
                "作为{movement}的代表人物，{artist}创造了连续熬夜一个月的纪录。",
                "{artist}是著名的外卖点评大师，据说从未给出过五星好评。",
                "传说{artist}的作品都是在追剧时随手完成的。",
                "没人知道{artist}的真实身份，据说是某外卖平台的隐藏BOSS。",
                "{artist}是资深社恐，所有作品都是通过外卖配送发布的。",
                "据说{artist}的创作灵感来自于每天数十个外卖订单的投诉。"
            ],
            classical: [
                "{artist}是{nationality}传奇人物，据说一生从未做过饭。",
                "作为{movement}的创始人，{artist}发明了著名的'即时外卖美学'。",
                "{artist}是历史上第一个因为熬夜过度而顿悟的艺术。",
                "{artist}是{nationality}传奇人物，据说其一生修复了999,999个bug。",
                "作为{movement}的创始人，{artist}发明了著名的'蓝屏美学'。",
                "没人知道{artist}的真实身份，有人说TA是一个AI程序的bug产物。"
            ]
        },

        // 添加虚构的展览描述模板
        fictionalExhibitionFormats: [
            "在{venue}举办的「{theme}」虚拟展览",
            "「{theme}」元宇宙巡展 @ {venue}",
            "{venue}量子艺术节：「{theme}」特展",
            "{venue}举办的「{theme}」跨次元展览"
        ],

        // 添加虚构的展览主题
        fictionalExhibitionThemes: [
            "代码的诗意",
            "编译器的温柔",
            "当bug成为艺术",
            "深度学习的错误之美",
            "人工智能的白日梦",
            "量子纠缠的浪漫",
            "递归的无限能",
            "内存泄露的优雅",
            "外卖骑手的凝视",
            "熬夜的艺术",
            "社恐的自我修养",
            "快乐肥宅的日常",
            "外卖评论的哲学",
            "脱发的美学",
            "熊猫眼的浪漫",
            "整活的真谛",
            "社畜的挣扎",
            "摸鱼的智慧"
        ]
    };

    // 修改尺寸配置
    const sizes = {
        square: [500, 500],
        landscape: [600, 400],
        portrait: [400, 600],
        wide: [800, 400],
        tall: [400, 800],
        panorama: [900, 300]
    };

    // 简化背景色调配置
    const backgroundThemes = {
        white: '#ffffff',      // 纯白
        cream: '#f4e9d9',     // 米色
        lightGray: '#e6e6e6', // 浅灰
        darkGray: '#4a4a4a',  // 深灰
        kraft: '#d4b998',     // 牛皮纸
        coffee: '#4b3621',    // 咖啡色
        black: '#1a1a1a'      // 纯黑
    };

    // 修改画框样式配置，使变化更微妙
    const frameStyles = [
        {
            inner: '#d4af37',  // 金色
            outer: '#8b4513',  // 棕色
            width: [18, 22]    // 更细腻的边框宽度
        },
        {
            inner: '#2c1810',  // 深褐色
            outer: '#594639',  // 中褐色
            width: [16, 20]
        },
        {
            inner: '#1a1a1a',  // 深灰色
            outer: '#4a4a4a',  // 中灰色
            width: [17, 21]
        },
        {
            inner: '#463e3f',  // 暗棕灰
            outer: '#704f4f',  // 红褐色
            width: [19, 23]
        }
    ];

    // 添加创作技法配置
    const techniques = {
        realistic: {
            abstract: "抽象表现 (Abstract Expression)",
            geometric: "几何构成 (Geometric Composition)",
            pattern: "图案重复 (Pattern Repetition)",
            mandala: "曼陀罗构图 (Mandala Composition)",
            gradient: "渐变叠加 (Gradient Overlay)",
            mosaic: "马赛克拼贴 (Mosaic Collage)",
            wave: "波动律动 (Wave Rhythm)",
            pixelated: "像素重构 (Pixel Reconstruction)",
            dotted: "点彩构成 (Pointillism)",
            lines: "线性表现 (Linear Expression)",
            spiral: "螺旋构图 (Spiral Composition)",
            noise: "噪点肌理 (Noise Texture)",
            cellular: "细胞分裂 (Cellular Division)",
            fractal: "分形递归 (Fractal Recursion)",
            symmetry: "对称平衡 (Symmetrical Balance)",
            fluid: "流体动态 (Fluid Dynamics)",
            particle: "粒子系统 (Particle System)",
            glitch: "故障美学 (Glitch Aesthetics)",
            circuit: "电路图谱 (Circuit Mapping)",
            organic: "有机生长 (Organic Growth)",
            crystal: "晶体结构 (Crystal Structure)"
        },
        fictional: {
            abstract: "意识流发癫 (Stream of Madness)",
            geometric: "外卖盒子叠叠乐 (Takeout Box Stacking)",
            pattern: "社恐密集恐惧症 (Social Anxiety Pattern)",
            mandala: "熬夜眼花 (Sleepless Vision)",
            gradient: "从入职到离职 (Career Gradient)",
            mosaic: "键盘按键堆砌 (Keyboard Mosaic)",
            wave: "工资波动图 (Salary Wave)",
            pixelated: "像素眼中的世界 (Pixel Reality)",
            dotted: "咖啡渍艺术 (Coffee Stain Art)",
            lines: "排队买奶茶 (Bubble Tea Queue)",
            spiral: "内卷漩涡 (Involution Spiral)",
            noise: "脑子里的浆糊 (Brain Noise)",
            cellular: "外卖群聊截图 (Delivery Chat)",
            fractal: "递归加班 (Overtime Recursion)",
            symmetry: "完美强迫症 (OCD Symmetry)",
            fluid: "摸鱼水花 (Slack Splash)",
            particle: "散落的头发 (Hair Loss)",
            glitch: "系统崩溃 (System Crash)",
            circuit: "脑回路短路 (Brain Circuit)",
            organic: "办公室植物 (Office Plant)",
            crystal: "咖啡结晶 (Coffee Crystal)"
        }
    };

    // 生成随机艺术品信息
    function generateArtworkInfo(style) {
        const fictionMode = document.getElementById('fictionMode').checked;
        const isModern = Math.random() > 0.3;
        
        // 根据虚构模式选择不同的数据源
        const dataSource = fictionMode ? 'fictional' : 'realistic';
        const artist = randomChoice(artistDatabase.names[dataSource][isModern ? 'modern' : 'classical']);
        const year = randomInt(artistDatabase.years.min, artistDatabase.years.max);
        
        // 根据虚构模式选择不同的艺术流派
        const movement = fictionMode ? 
            randomChoice(artistDatabase.fictionalMovements[style] || artistDatabase.fictionalMovements.abstract) :
            randomChoice(artistDatabase.styleMovements[style] || artistDatabase.styleMovements.abstract);

        // 生成拍卖记录和估价（相关联）
        const basePrice = randomInt(1, 3000) * 10000;
        const estimatedPrice = `${(basePrice/10000).toFixed(0)}万 - ${(basePrice/10000 * 1.5).toFixed(0)}万`;
        
        // 生成拍卖记录
        let auctions = [];
        const auctionCount = randomInt(1, 2);
        for(let i = 0; i < auctionCount; i++) {
            const auctionYear = randomInt(year + 5, 2024);
            const auctionPrice = basePrice * (0.8 + Math.random() * 0.8); // 80%-160%估价
            auctions.push(`${auctionYear}年 ${randomChoice(artistDatabase.auctionHouses[dataSource])} ${(auctionPrice/10000).toFixed(0)}万元`);
        }

        // 生成标题
        const title = fictionMode ? generateFictionalTitle() : generateRealisticTitle();

        // 生成展览历史
        let exhibitions = [];
        const exhibitionCount = randomInt(2, 4);
        const exhibitionList = artistDatabase.exhibitions[dataSource][isModern ? 'modern' : 'classical'];
        
        if (fictionMode) {
            for(let i = 0; i < exhibitionCount; i++) {
                const exhibitionYear = randomInt(year, 2024);
                const venue = randomChoice(exhibitionList);
                const theme = randomChoice(artistDatabase.fictionalExhibitionThemes);
                const format = randomChoice(artistDatabase.fictionalExhibitionFormats)
                    .replace('{venue}', venue)
                    .replace('{theme}', theme);
                exhibitions.push(`${exhibitionYear}: ${format}`);
            }
        } else {
            for(let i = 0; i < exhibitionCount; i++) {
                const exhibitionYear = randomInt(year, 2024);
                exhibitions.push(`${exhibitionYear}: ${randomChoice(exhibitionList)}`);
            }
        }

        // 生成收藏记录
        let collections = [];
        const collectionCount = randomInt(1, 3);
        for(let i = 0; i < collectionCount; i++) {
            collections.push(randomChoice(artistDatabase.collections[dataSource]));
        }

        // 生成背景描述
        const background = fictionMode ?
            randomChoice(artistDatabase.fictionalBackgrounds)
                .replace('{year}', year)
                .replace('{movement}', movement) :
            randomChoice(artistDatabase.backgrounds)
                .replace('{year}', year)
                .replace('{movement}', movement);

        // 生成更详细的生平描述
        const biography = fictionMode ?
            `${randomChoice(artistDatabase.biographies.fictional[isModern ? 'modern' : 'classical'])
                .replace('{artist}', artist.zh)
                .replace('{nationality}', artist.nationality)
                .replace('{movement}', movement)}
            ${randomChoice(artistDatabase.education.fictional[isModern ? 'modern' : 'classical'])}。
            ${randomChoice(artistDatabase.fictionalBiographies[isModern ? 'modern' : 'classical'])
                .replace('{artist}', artist.zh)
                .replace('{nationality}', artist.nationality)
                .replace('{movement}', movement)}` :
            `${randomChoice(artistDatabase.biographies.realistic[isModern ? 'modern' : 'classical'])
                .replace('{artist}', artist.zh)
                .replace('{nationality}', artist.nationality)
                .replace('{movement}', movement)}
            ${randomChoice(artistDatabase.education.realistic[isModern ? 'modern' : 'classical'])}。`;

        // 生成作品描述
        const descriptions = fictionMode ? [
            `作品体现了${artist.zh}对${movement}的深入思考`,
            `通过${movement}探索${movement}的新可能`,
            `融合${movement}与传统艺术语言的实验性作品`,
            `反映了艺术家对${movement}的独特见解`,
            `${movement}与${movement}的完美结合`
        ] : [
            `这件作现了${artist.zh}对${movement}的独特诠释`,
            `作品体现了${movement}的核心特征`,
            `艺术家通过${movement}探索形式与内容的关系`,
            `作品反映了${movement}时期的艺术特点`,
            `这是${movement}风格的典型代表作`
        ];
        const description = randomChoice(descriptions);

        // 获取对应的创作技法
        const technique = fictionMode ? 
            techniques.fictional[style] || techniques.fictional.abstract :
            techniques.realistic[style] || techniques.realistic.abstract;

        return {
            title,
            artist,
            year,
            movement,
            style,
            description,
            estimatedPrice,
            exhibitions,
            collections,
            auctions,
            background,
            biography,
            technique
        };
    }

    // 添加虚构标题生成函数
    function generateFictionalTitle() {
        const prefixes = [
            "今天不想上班的", "产品经理的需求", "会议进行中的",
            "摸鱼日记之", "划水技巧之", "假装很忙的",
            "看起来很害的", "其实什么都没画的", "老板快看的",
            "这个真的不是Bug的", "这个需求很简单的", "下班前完成的"
        ];
        
        const suffixes = [
            "量子态", "平行宇宙", "多维投影",
            "但是没有灵感", "然后就下班了", "但是没有人懂",
            "之我也不知道", "之产品经理说的", "之这样就对了",
            "之看起来很厉害", "其实很简单", "之我也很疑"
        ];

        return `${randomChoice(prefixes)}${randomChoice(suffixes)} #${randomInt(1, 999)}`;
    }

    // 添加现实标题生成函数
    function generateRealisticTitle() {
        const prefixes = [
            "构成", "空间", "形态",
            "光影", "韵律", "节奏",
            "色彩研究", "抽象", "几何",
            "意象", "变奏", "序列",
            "静物", "风景", "印象"
        ];
        
        const suffixes = [
            "之一", "系列", "变奏",
            "No.", "组曲", "印象",
            "研究", "探索", "实验"
        ];

        return `${randomChoice(prefixes)} ${randomChoice(suffixes)}${randomInt(1, 99)}`;
    }

    // 修改生成图片的函数
    function generateImage() {
        const randomAll = document.getElementById('randomAll').checked;
        
        if (randomAll) {
            // 随机选择尺寸
            const sizeOptions = Object.keys(sizes);
            imageSizeSelect.value = randomChoice(sizeOptions);
            
            // 修改这里，包含所有可用的风格
            const styleOptions = [
                'abstract', 'geometric', 'pattern', 'mandala', 
                'gradient', 'mosaic', 'wave', 'pixelated', 
                'dotted', 'lines', 'spiral', 'noise', 'cellular',
                'fractal', 'symmetry', 'fluid', 'particle',
                'glitch', 'circuit', 'organic', 'crystal'
            ];
            imageStyleSelect.value = randomChoice(styleOptions);
            
            // 随机选择颜色主题
            const themeOptions = Object.keys(colorThemes);
            colorThemeSelect.value = randomChoice(themeOptions);
            
            // 随机选择背景色调
            const bgThemeSelect = document.getElementById('bgTheme');
            const bgThemeOptions = Object.keys(backgroundThemes);
            
            // 根据虚构模式决定颜色倾向
            const fictionMode = document.getElementById('fictionMode').checked;
            let filteredOptions;
            
            if (fictionMode) {
                // 虚构模式下更倾向于使用特殊色系和深色系
                filteredOptions = bgThemeOptions.filter(option => 
                    option.includes('special') || 
                    option.includes('dark') || 
                    option.includes('Deep') ||
                    Math.random() > 0.7 // 30%概率使用其他颜色
                );
            } else {
                // 非虚构模式下更倾向于使用传统色系
                filteredOptions = bgThemeOptions.filter(option => 
                    !option.includes('special') && 
                    !option.includes('dark') &&
                    !option.includes('Deep') ||
                    Math.random() > 0.8 // 20%概率使用深色系
                );
            }
            
            bgThemeSelect.value = randomChoice(filteredOptions);
        }

        // 设置画布尺寸
        const [width, height] = sizes[imageSizeSelect.value];
        canvas.width = width;
        canvas.height = height;

        // 先清空画布
        ctx.clearRect(0, 0, width, height);

        // 绘制背景色（确保在所有图案之前）
        const bgTheme = document.getElementById('bgTheme').value || 'white';
        ctx.fillStyle = backgroundThemes[bgTheme];
        ctx.fillRect(0, 0, width, height);

        // 确保 canvas 在 canvas-container 中
        let canvasContainer = document.querySelector('.canvas-container');
        if (!canvasContainer) {
            canvasContainer = document.createElement('div');
            canvasContainer.className = 'canvas-container';
            canvas.parentNode.insertBefore(canvasContainer, canvas);
            canvasContainer.appendChild(canvas);
        }

        // 随机选择画框样式并应用
        const frameStyle = randomChoice(frameStyles);
        canvasContainer.style.setProperty('--frame-inner-color', frameStyle.inner);
        canvasContainer.style.setProperty('--frame-outer-color', frameStyle.outer);
        canvasContainer.style.setProperty('--frame-inner-width', `${frameStyle.width[0]}px`);
        canvasContainer.style.setProperty('--frame-outer-width', `${frameStyle.width[1]}px`);

        // 根据选择的风格生成图片
        const style = imageStyleSelect.value;
        switch(style) {
            case 'abstract':
                generateAbstract(ctx, width, height);
                break;
            case 'geometric':
                generateGeometric(ctx, width, height);
                break;
            case 'pattern':
                generatePattern(ctx, width, height);
                break;
            case 'mandala':
                generateMandala(ctx, width, height);
                break;
            case 'gradient':
                generateGradient(ctx, width, height);
                break;
            case 'mosaic':
                generateMosaic(ctx, width, height);
                break;
            case 'wave':
                generateWave(ctx, width, height);
                break;
            case 'pixelated':
                generatePixelated(ctx, width, height);
                break;
            case 'dotted':
                generateDotted(ctx, width, height);
                break;
            case 'lines':
                generateLines(ctx, width, height);
                break;
            case 'spiral':
                generateSpiral(ctx, width, height);
                break;
            case 'noise':
                generateNoise(ctx, width, height);
                break;
            case 'cellular':
                generateCellular(ctx, width, height);
                break;
            case 'fractal':
                generateFractal(ctx, width, height);
                break;
            case 'symmetry':
                generateSymmetry(ctx, width, height);
                break;
            case 'fluid':
                generateFluid(ctx, width, height);
                break;
            case 'particle':
                generateParticle(ctx, width, height);
                break;
            case 'glitch':
                generateGlitch(ctx, width, height);
                break;
            case 'circuit':
                generateCircuit(ctx, width, height);
                break;
            case 'organic':
                generateOrganic(ctx, width, height);
                break;
            case 'crystal':
                generateCrystal(ctx, width, height);
                break;
        }

        // 生成并显示艺术品信息
        const artworkInfo = generateArtworkInfo(imageStyleSelect.value);
        const infoDiv = document.getElementById('artworkInfo');
        const titleElement = infoDiv.querySelector('.artwork-title');
        const detailsElement = infoDiv.querySelector('.artwork-details');

        titleElement.textContent = artworkInfo.title;
        detailsElement.innerHTML = `
            <div class="artwork-section">
                <h4>基本信息</h4>
                <p><strong>艺术家：</strong>${artworkInfo.artist.zh} (${artworkInfo.artist.en})</p>
                <p><strong>国籍：</strong>${artworkInfo.artist.nationality}</p>
                <p><strong>创作年份：</strong>${artworkInfo.year}</p>
                <p><strong>艺术流派：</strong>${artworkInfo.movement}</p>
                <p><strong>创作技法：</strong>${artworkInfo.technique}</p>
                <p><strong>估价：</strong>RMB ${artworkInfo.estimatedPrice}</p>
            </div>

            <div class="artwork-section">
                <h4>艺术家生平</h4>
                <p>${artworkInfo.biography}</p>
            </div>

            <div class="artwork-section">
                <h4>创作背景</h4>
                <p>${artworkInfo.background}</p>
                <p>${artworkInfo.description}</p>
            </div>

            <div class="artwork-section">
                <h4>展览历史</h4>
                <ul>
                    ${artworkInfo.exhibitions.map(e => `<li>${e}</li>`).join('')}
                </ul>
            </div>

            <div class="artwork-section">
                <h4>收藏机构</h4>
                <ul>
                    ${artworkInfo.collections.map(c => `<li>${c}</li>`).join('')}
                </ul>
            </div>

            <div class="artwork-section">
                <h4>拍卖记录</h4>
                <ul>
                    ${artworkInfo.auctions.map(a => `<li>${a}</li>`).join('')}
                </ul>
            </div>
        `;

        infoDiv.style.display = 'block';

        // 显示画布和下载按钮
        canvas.style.display = 'inline-block';
        downloadBtn.style.display = 'inline-block';
    }

    function generateAbstract(ctx, width, height) {
        // 移除任何清除背景的操作，直接开始绘制图案
        for(let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.fillStyle = getThemeColor(0.8); // 降低一点不透明度以便看到背景
            ctx.arc(
                Math.random() * width,
                Math.random() * height,
                Math.random() * 50,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }

    function generateGeometric(ctx, width, height) {
        for(let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.strokeStyle = getThemeColor();
            ctx.lineWidth = Math.random() * 5;
            ctx.rect(
                Math.random() * width,
                Math.random() * height,
                Math.random() * 100,
                Math.random() * 100
            );
            ctx.stroke();
        }
    }

    // 修改各种生成函数以适应不同的宽高比
    function generatePattern(ctx, width, height) {
        const size = Math.min(width, height) * 0.1; // 根据画布大小调整图案大小
        const colors = getThemeColors(5);
        
        for(let x = 0; x < width; x += size) {
            for(let y = 0; y < height; y += size) {
                ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                if(Math.random() > 0.5) {
                    ctx.fillRect(x, y, size - 2, size - 2);
                } else {
                    ctx.beginPath();
                    ctx.arc(x + size/2, y + size/2, size/2 - 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    function generateMandala(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(width, height) / 3;
        
        // 随机确定花瓣数量
        const petalCount = Math.floor(Math.random() * 12) + 6; // 6-18花瓣
        // 随机确定层数
        const layers = Math.floor(Math.random() * 4) + 3; // 3-6层
        
        for(let layer = 0; layer < layers; layer++) {
            const layerRadius = maxRadius * (layer + 1) / layers;
            
            for(let i = 0; i < petalCount; i++) {
                const angle = (i / petalCount) * Math.PI * 2;
                ctx.fillStyle = getThemeColor();
                
                // 随机选择形状
                const shapeType = Math.floor(Math.random() * 3);
                
                switch(shapeType) {
                    case 0: // 圆形
                        ctx.beginPath();
                        const x = centerX + Math.cos(angle) * layerRadius;
                        const y = centerY + Math.sin(angle) * layerRadius;
                        const size = 10 + Math.random() * 15;
                        ctx.arc(x, y, size, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                        
                    case 1: // 三角形
                        ctx.beginPath();
                        const tx = centerX + Math.cos(angle) * layerRadius;
                        const ty = centerY + Math.sin(angle) * layerRadius;
                        const triSize = 15 + Math.random() * 20;
                        for(let p = 0; p < 3; p++) {
                            const pa = angle + (p * Math.PI * 2 / 3);
                            const px = tx + Math.cos(pa) * triSize;
                            const py = ty + Math.sin(pa) * triSize;
                            if(p === 0) ctx.moveTo(px, py);
                            else ctx.lineTo(px, py);
                        }
                        ctx.closePath();
                        ctx.fill();
                        break;
                        
                    case 2: // 花瓣形状
                        ctx.beginPath();
                        const startX = centerX + Math.cos(angle) * (layerRadius - 20);
                        const startY = centerY + Math.sin(angle) * (layerRadius - 20);
                        const endX = centerX + Math.cos(angle) * (layerRadius + 20);
                        const endY = centerY + Math.sin(angle) * (layerRadius + 20);
                        const cp1x = startX + Math.cos(angle + Math.PI/2) * 20;
                        const cp1y = startY + Math.sin(angle + Math.PI/2) * 20;
                        const cp2x = endX + Math.cos(angle + Math.PI/2) * 20;
                        const cp2y = endY + Math.sin(angle + Math.PI/2) * 20;
                        ctx.moveTo(startX, startY);
                        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
                        ctx.bezierCurveTo(cp2x, cp2y, cp1x, cp1y, startX, startY);
                        ctx.fill();
                        break;
                }
            }
        }
    }

    function generateGradient(ctx, width, height) {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, getThemeColor(0.8));
        gradient.addColorStop(0.5, getThemeColor(0.8));
        gradient.addColorStop(1, getThemeColor(0.8));
        
        // 使用 globalCompositeOperation 让渐变和背景混合
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
    }

    function generateMosaic(ctx, width, height) {
        const tileSize = 30;
        for(let x = 0; x < width; x += tileSize) {
            for(let y = 0; y < height; y += tileSize) {
                ctx.fillStyle = getThemeColor();
                ctx.fillRect(x, y, tileSize - 2, tileSize - 2);
            }
        }
    }

    function generateWave(ctx, width, height) {
        const waves = Math.floor(Math.random() * 3) + 2;
        const baseAmplitude = height / (Math.random() * 3 + 3);
        
        for(let wave = 0; wave < waves; wave++) {
            ctx.beginPath();
            ctx.strokeStyle = getThemeColor(0.3 + Math.random() * 0.4);
            ctx.lineWidth = 10 + Math.random() * 20;
            
            const frequency = 0.01 + Math.random() * 0.02;
            const phase = Math.random() * Math.PI * 2;
            const amplitudeVariation = Math.random() * 0.5 + 0.5;
            
            for(let x = 0; x < width; x += 2) {
                const amplitude = baseAmplitude * amplitudeVariation;
                const y = height/2 + 
                    Math.sin(x * frequency + phase) * amplitude + 
                    Math.cos(x * frequency * 0.5) * amplitude * 0.5;
                
                if(x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
    }

    function generatePixelated(ctx, width, height) {
        const pixelSize = Math.max(width, height) / 50;
        for(let x = 0; x < width; x += pixelSize) {
            for(let y = 0; y < height; y += pixelSize) {
                ctx.fillStyle = getThemeColor(0.8);
                ctx.fillRect(x, y, pixelSize - 1, pixelSize - 1);
            }
        }
    }

    function generateDotted(ctx, width, height) {
        const dotSpacing = Math.min(width, height) / 30;
        for(let x = dotSpacing; x < width; x += dotSpacing) {
            for(let y = dotSpacing; y < height; y += dotSpacing) {
                ctx.beginPath();
                ctx.fillStyle = getThemeColor(0.7);
                const radius = Math.random() * dotSpacing/3 + dotSpacing/6;
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function generateLines(ctx, width, height) {
        const lineCount = 50;
        const spacing = Math.max(width, height) / lineCount;
        
        for(let i = 0; i < lineCount; i++) {
            ctx.beginPath();
            ctx.strokeStyle = getThemeColor(0.6);
            ctx.lineWidth = Math.random() * 3 + 1;
            
            if(Math.random() > 0.5) {
                // 水平线
                const y = i * spacing;
                ctx.moveTo(0, y);
                ctx.lineTo(width, y + (Math.random() - 0.5) * spacing * 2);
            } else {
                // 垂直线
                const x = i * spacing;
                ctx.moveTo(x, 0);
                ctx.lineTo(x + (Math.random() - 0.5) * spacing * 2, height);
            }
            ctx.stroke();
        }
    }

    function generateSpiral(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(width, height) / 2;
        
        for(let angle = 0; angle < 200; angle += 0.1) {
            const radius = (angle / 20) * maxRadius / 10;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.fillStyle = getThemeColor(0.7);
            ctx.arc(x, y, angle/50, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function generateNoise(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for(let i = 0; i < data.length; i += 4) {
            const color = getThemeColor();
            const rgb = color.match(/\d+/g);
            const alpha = Math.random() * 0.5 + 0.1;
            
            data[i] = rgb[0];     // R
            data[i+1] = rgb[1];   // G
            data[i+2] = rgb[2];   // B
            data[i+3] = alpha * 255; // A
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

    function generateCellular(ctx, width, height) {
        const points = [];
        const numPoints = Math.floor(Math.random() * 20) + 15; // 15-35个点
        const cellTypes = ['circle', 'square', 'hex', 'organic']; // 不同的细胞形状
        
        // 生成随机点和它们的属性
        for(let i = 0; i < numPoints; i++) {
            points.push({
                x: Math.random() * width,
                y: Math.random() * height,
                color: getThemeColor(0.6 + Math.random() * 0.4),
                size: Math.random() * 30 + 10, // 细胞大小
                type: randomChoice(cellTypes),
                growth: Math.random() * 0.5 + 0.5, // 生长因子
                angle: Math.random() * Math.PI * 2 // 旋转角度
            });
        }
        
        // 为每个像素找到最近的点并绘制细胞
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++) {
                let minDist = Infinity;
                let closestPoint = null;
                let secondClosestDist = Infinity;
                
                // 找到最近和第二近的点
                for(const point of points) {
                    const dist = Math.hypot(x - point.x, y - point.y);
                    if(dist < minDist) {
                        secondClosestDist = minDist;
                        minDist = dist;
                        closestPoint = point;
                    } else if(dist < secondClosestDist) {
                        secondClosestDist = dist;
                    }
                }
                
                // 计算边界效果
                const edgeFactor = Math.abs(minDist - secondClosestDist) < 5 ? 0.5 : 1;
                
                // 根据距离和细胞类型计算颜色
                const i = (y * width + x) * 4;
                const rgb = closestPoint.color.match(/\d+/g);
                const distFactor = Math.min(minDist / (closestPoint.size * closestPoint.growth), 1);
                
                // 添加细胞形状特效
                let shapeFactor = 1;
                switch(closestPoint.type) {
                    case 'circle':
                        shapeFactor = distFactor;
                        break;
                    case 'square':
                        const dx = Math.abs(x - closestPoint.x);
                        const dy = Math.abs(y - closestPoint.y);
                        shapeFactor = Math.max(dx, dy) / (closestPoint.size * closestPoint.growth);
                        break;
                    case 'hex':
                        const angle = Math.atan2(y - closestPoint.y, x - closestPoint.x) + closestPoint.angle;
                        shapeFactor = (Math.cos(angle * 6) * 0.2 + 0.8) * distFactor;
                        break;
                    case 'organic':
                        const noise = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.2;
                        shapeFactor = distFactor + noise;
                        break;
                }
                
                // 应用颜色
                data[i] = Math.floor(rgb[0] * shapeFactor * edgeFactor);     // R
                data[i+1] = Math.floor(rgb[1] * shapeFactor * edgeFactor);   // G
                data[i+2] = Math.floor(rgb[2] * shapeFactor * edgeFactor);   // B
                data[i+3] = Math.floor(255 * (1 - Math.pow(distFactor, 0.5))); // A
            }
        }
        
        // 添加细胞核心
        points.forEach(point => {
            const nucleusSize = point.size * 0.2;
            ctx.beginPath();
            ctx.fillStyle = getThemeColor(0.9);
            
            switch(point.type) {
                case 'circle':
                    ctx.arc(point.x, point.y, nucleusSize, 0, Math.PI * 2);
                    break;
                case 'square':
                    ctx.rect(point.x - nucleusSize, point.y - nucleusSize, 
                            nucleusSize * 2, nucleusSize * 2);
                    break;
                case 'hex':
                    for(let i = 0; i < 6; i++) {
                        const angle = i * Math.PI / 3 + point.angle;
                        const nx = point.x + Math.cos(angle) * nucleusSize;
                        const ny = point.y + Math.sin(angle) * nucleusSize;
                        if(i === 0) ctx.moveTo(nx, ny);
                        else ctx.lineTo(nx, ny);
                    }
                    break;
                case 'organic':
                    const points = 8;
                    for(let i = 0; i < points; i++) {
                        const angle = (i / points) * Math.PI * 2;
                        const radius = nucleusSize * (0.8 + Math.sin(angle * 3) * 0.2);
                        const nx = point.x + Math.cos(angle) * radius;
                        const ny = point.y + Math.sin(angle) * radius;
                        if(i === 0) ctx.moveTo(nx, ny);
                        else ctx.lineTo(nx, ny);
                    }
                    break;
            }
            ctx.fill();
        });
        
        // 应用最终图像
        ctx.putImageData(imageData, 0, 0);
        
        // 添加连接线（可选，根据随机概率添加）
        if(Math.random() > 0.5) {
            ctx.globalAlpha = 0.2;
            for(let i = 0; i < points.length; i++) {
                for(let j = i + 1; j < points.length; j++) {
                    const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
                    if(dist < (points[i].size + points[j].size) * 1.5) {
                        ctx.beginPath();
                        ctx.strokeStyle = getThemeColor(0.3);
                        ctx.lineWidth = 1;
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[j].x, points[j].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1;
        }
    }

    function generateFractal(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const size = Math.min(width, height) * 0.8;
        
        function drawFractal(x, y, size, depth) {
            if (depth <= 0 || size < 2) return;
            
            ctx.fillStyle = getThemeColor(0.7);
            ctx.fillRect(x - size/2, y - size/2, size, size);
            
            const newSize = size * 0.5;
            const offset = size * 0.6;
            
            drawFractal(x - offset, y, newSize, depth - 1);
            drawFractal(x + offset, y, newSize, depth - 1);
            drawFractal(x, y - offset, newSize, depth - 1);
            drawFractal(x, y + offset, newSize, depth - 1);
        }
        
        drawFractal(centerX, centerY, size/3, 5);
    }

    function generateSymmetry(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const numPoints = 100;
        const numReflections = 8;
        
        for(let i = 0; i < numPoints; i++) {
            const radius = Math.random() * Math.min(width, height) * 0.4;
            const angle = Math.random() * Math.PI * 2;
            const size = Math.random() * 10 + 2;
            
            ctx.fillStyle = getThemeColor(0.6);
            
            for(let j = 0; j < numReflections; j++) {
                const reflectedAngle = angle + (j * Math.PI * 2 / numReflections);
                const x = centerX + Math.cos(reflectedAngle) * radius;
                const y = centerY + Math.sin(reflectedAngle) * radius;
                
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function generateFluid(ctx, width, height) {
        const points = [];
        const numPoints = 50;
        const timeStep = Math.random() * 0.02;
        
        for(let i = 0; i < numPoints; i++) {
            points.push({
                x: Math.random() * width,
                y: Math.random() * height,
                angle: Math.random() * Math.PI * 2
            });
        }
        
        ctx.lineWidth = 2;
        for(let t = 0; t < 100; t++) {
            points.forEach(point => {
                ctx.beginPath();
                ctx.strokeStyle = getThemeColor(0.1);
                ctx.moveTo(point.x, point.y);
                
                point.angle += Math.sin(t * timeStep) * 0.1;
                point.x += Math.cos(point.angle) * 2;
                point.y += Math.sin(point.angle) * 2;
                
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            });
        }
    }

    function generateParticle(ctx, width, height) {
        const particles = [];
        const numParticles = 200;
        
        for(let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 4 + 1,
                color: getThemeColor(Math.random() * 0.5 + 0.3)
            });
        }
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.fillStyle = particle.color;
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // 添加光晕效果
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function generateGlitch(ctx, width, height) {
        // 基础图层
        ctx.fillStyle = getThemeColor();
        ctx.fillRect(0, 0, width, height);
        
        // 故障效果
        const numGlitches = 50;
        for(let i = 0; i < numGlitches; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const w = Math.random() * width * 0.8;
            const h = Math.random() * 20 + 5;
            
            ctx.fillStyle = getThemeColor(0.8);
            ctx.fillRect(x, y, w, h);
            
            // 偏移复制
            const imageData = ctx.getImageData(x, y, w, h);
            const offset = Math.random() * 20 - 10;
            ctx.putImageData(imageData, x + offset, y);
        }
    }

    function generateCircuit(ctx, width, height) {
        const gridSize = 30;
        
        // 创建网格点
        for(let x = gridSize; x < width; x += gridSize) {
            for(let y = gridSize; y < height; y += gridSize) {
                if(Math.random() > 0.7) {
                    const directions = [[1,0], [-1,0], [0,1], [0,-1]];
                    const dir = directions[Math.floor(Math.random() * directions.length)];
                    
                    ctx.beginPath();
                    ctx.strokeStyle = getThemeColor(0.7);
                    ctx.lineWidth = 2;
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + dir[0] * gridSize, y + dir[1] * gridSize);
                    ctx.stroke();
                    
                    // 添加节点
                    ctx.beginPath();
                    ctx.fillStyle = getThemeColor();
                    ctx.arc(x, y, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    function generateOrganic(ctx, width, height) {
        const points = [];
        const numPoints = 10;
        
        // 生成控制点
        for(let i = 0; i < numPoints; i++) {
            points.push({
                x: width * (i / (numPoints - 1)),
                y: height/2 + Math.random() * height * 0.4 - height * 0.2
            });
        }
        
        // 绘制曲线
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for(let i = 1; i < points.length - 2; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        
        ctx.strokeStyle = getThemeColor(0.8);
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    function generateCrystal(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const size = Math.min(width, height) * 0.4;
        
        for(let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x1 = centerX + Math.cos(angle) * size;
            const y1 = centerY + Math.sin(angle) * size;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x1, y1);
            ctx.strokeStyle = getThemeColor(0.6);
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 添加晶体面
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            const nextAngle = ((i + 1) / 8) * Math.PI * 2;
            const x2 = centerX + Math.cos(nextAngle) * size;
            const y2 = centerY + Math.sin(nextAngle) * size;
            ctx.lineTo(x2, y2);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = getThemeColor(0.3);
            ctx.fill();
        }
    }

    function downloadImage() {
        try {
            const link = document.createElement('a');
            link.download = 'generated-image.png';
            link.href = canvas.toDataURL();
            link.click();
        } catch (error) {
            alert('下载失败，请重');
            console.error('下载错误:', error);
        }
    }

    // 辅助函数
    function randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 添加随机选择的控制
    const randomAll = document.getElementById('randomAll');
    const specificOptions = document.getElementById('specificOptions');
    
    // 初始化时设置具体选项的显示状态
    specificOptions.style.display = randomAll.checked ? 'none' : 'block';

    // 监听随机选择的变化
    randomAll.addEventListener('change', function() {
        specificOptions.style.display = this.checked ? 'none' : 'block';
    });

    // 添加辅助函数计算颜色亮度
    function getBrightness(color) {
        // 将16进制颜色转换为RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        // 计算亮度 (0-255)
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    // 在随机选择时的处理
    if (randomAll.checked) {
        // ... 其他随机选择代码 ...
        
        // 随机选择背景色调
        const bgThemeSelect = document.getElementById('bgTheme');
        const bgThemeOptions = Object.keys(backgroundThemes);
        bgThemeSelect.value = randomChoice(bgThemeOptions);
    }
}); 