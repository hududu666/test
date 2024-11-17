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
            modern: [
                { zh: "陈逸飞", en: "Chen Yifei", nationality: "中国" },
                { zh: "赵无极", en: "Zao Wou-Ki", nationality: "法国/中国" },
                { zh: "草间弥生", en: "Yayoi Kusama", nationality: "日本" },
                { zh: "村上隆", en: "Takashi Murakami", nationality: "日本" },
                { zh: "徐冰", en: "Xu Bing", nationality: "中国" },
                { zh: "林天行", en: "Lin Tianxing", nationality: "中国" },
                { zh: "张未来", en: "Zhang Weilai", nationality: "中国" },
                { zh: "李数字", en: "Li Digital", nationality: "中国/美国" },
                { zh: "王像素", en: "Wang Pixel", nationality: "中国" },
                { zh: "佐藤量子", en: "Sato Quantum", nationality: "日本" },
                { zh: "金智能", en: "Kim AI", nationality: "韩国" },
                { zh: "安德森矩阵", en: "Anderson Matrix", nationality: "美国" },
                { zh: "史密斯像素", en: "Smith Pixel", nationality: "英国" },
                { zh: "杜波形", en: "Du Waveform", nationality: "中国" },
                { zh: "周算法", en: "Zhou Algorithm", nationality: "中国/加拿大" },
                { zh: "零子数据", en: "Zero Data", nationality: "数字世界" },
                { zh: "量子之光", en: "Quantum Light", nationality: "平行宇宙" },
                { zh: "代码诗人", en: "Code Poet", nationality: "赛博空间" },
                { zh: "像素梦想家", en: "Pixel Dreamer", nationality: "虚拟现实" },
                { zh: "神经网络", en: "Neural Net", nationality: "人工智能" },
                { zh: "数据流浪者", en: "Data Wanderer", nationality: "信息海洋" },
                { zh: "比特艺术家", en: "Bit Artist", nationality: "数字领域" },
                { zh: "算法诗人", en: "Algorithm Poet", nationality: "计算空间" },
                { zh: "矩阵编织者", en: "Matrix Weaver", nationality: "网络世界" },
                { zh: "云端漫游者", en: "Cloud Walker", nationality: "云计算空间" },
                { zh: "胡嘟嘟", en: "Hu Dudu", nationality: "中国" },
                { zh: "量子猫", en: "Quantum Cat", nationality: "薛定谔空间" },
                { zh: "虚无主义者", en: "Mr. Void", nationality: "虚空" },
                { zh: "数据掘金者", en: "Data Miner", nationality: "区块链共和国" },
                { zh: "像素食客", en: "Pixel Foodie", nationality: "赛博坊市" },
                { zh: "混沌蝴蝶", en: "Chaos Butterfly", nationality: "平行宇宙" },
                { zh: "二进制诗人", en: "Binary Poet", nationality: "数据海" },
                { zh: "咖啡因上瘾者", en: "Caffeine Addict", nationality: "清醒国度" },
                { zh: "键盘侠", en: "Keyboard Warrior", nationality: "网络共和国" },
                { zh: "蓝屏收藏家", en: "Blue Screen Collector", nationality: "故障空间" },
                { zh: "编译错误", en: "Compile Error", nationality: "代码之城" },
                { zh: "递归深渊", en: "Recursive Abyss", nationality: "栈溢出之地" },
                { zh: "丢包艺术家", en: "Packet Loss", nationality: "断网之域" },
                { zh: "404漫游者", en: "404 Wanderer", nationality: "未找到之地" },
                { zh: "人工智障", en: "Artificial Stupidity", nationality: "bug王国" },
                { zh: "内存泄露", en: "Memory Leak", nationality: "垃圾回收站" },
                { zh: "无限循环", en: "Infinite Loop", nationality: "死锁之境" },
                { zh: "缓存命中", en: "Cache Hit", nationality: "高速缓存" },
                { zh: "堆栈溢出", en: "Stack Overflow", nationality: "内存之域" },
                { zh: "空指针大师", en: "Null Pointer Master", nationality: "未定义空间" },
                { zh: "时间复杂度", en: "Time Complexity", nationality: "算法之国" },
                { zh: "懒加载", en: "Lazy Loading", nationality: "性能优化邦" },
                { zh: "异步等待", en: "Async Await", nationality: "Promise之地" },
                { zh: "正则表达", en: "Regex Master", nationality: "匹配王国" }
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
                { zh: "米罗", en: "Joan Miró", nationality: "西班牙" },
                { zh: "叹号大师", en: "Exclamation Master", nationality: "标点符号国" },
                { zh: "问号艺术家", en: "Question Artist", nationality: "疑问之邦" },
                { zh: "逗号收藏家", en: "Comma Collector", nationality: "停顿之国" },
                { zh: "句号终结者", en: "Period Terminator", nationality: "终止之地" }
            ]
        },
        styleMovements: {
            abstract: ["抽象表现主义", "行动绘画", "色域绘画", "几何抽象"],
            geometric: ["构成主义", "至上主义", "简约主义", "欧普艺术"],
            pattern: ["图案艺术", "装饰艺术", "新艺术运动", "重复艺术"],
            mandala: ["神秘主义艺术", "精神性艺术", "冥想艺术", "宗教艺术"],
            gradient: ["色彩场绘画", "光艺术", "渐变艺术", "氛围艺术"],
            mosaic: ["像素艺术", "数字马赛克", "点彩派", "新像素主义"],
            wave: ["动态艺术", "韵律艺术", "声波艺术", "动能艺术"]
        },
        years: {
            min: 1850,
            max: 2024
        }
    };

    // 生成随机艺术品信息
    function generateArtworkInfo(style) {
        const isModern = Math.random() > 0.3;
        const artist = randomChoice(artistDatabase.names[isModern ? 'modern' : 'classical']);
        const year = randomInt(artistDatabase.years.min, artistDatabase.years.max);
        
        // 根据风格选择对应的艺术流派
        const movement = randomChoice(artistDatabase.styleMovements[style] || artistDatabase.styleMovements.abstract);

        // 修改标题生成逻辑
        const titlePrefixes = [
            "无限递归", "量子叠加", "数据碎片", "像素涌动", "比特流动",
            "神经脉冲", "矩阵震荡", "熵的律动", "维度折叠", "时空褶皱",
            "混沌之舞", "算法之梦", "代码诗篇", "数字涟漪", "虚拟回响",
            "今天不想写代码", "下班时间到", "Bug都是特性",
            "会议进行中", "摸鱼日记", "划水技巧",
            "假装很忙", "看起来很厉害", "其实什么都没画",
            "老板快看", "假装在工作", "这个真的不是Bug",
            "产品经理说好", "这个需求很简单", "下班前完成",
            "明天再改", "这样也行", "能跑就行",
            "先提交再说", "反正能用", "灵感来自于困意",
            "周一综合征", "周五放飞自我", "摸鱼艺术",
            "假装很专业", "看起来很厉害", "不知道在画什么"
        ];

        const titleSuffixes = [
            "的具象化", "的抽象表达", "的数字化呈现", "的量子态",
            "的平行宇宙", "的多维投影", "的信息流", "的矩阵化",
            "的碎片重组", "的虚拟显现",
            "但是没有灵感", "然后就下班了", "但是没有人懂",
            "以及其他问题", "之我也不知道", "之产品经理说的",
            "之这样就对了", "之看起来很厉害", "之其实很简单",
            "之我也很疑惑", "之灵感来自梦境", "之困得要死",
            "之赶紧下班", "之假装很忙", "之看起来很深奥",
            "之不知所云", "之意义不明", "之随便画画",
            "之我也不确定", "之可能有Bug", "之待办事项",
            "之明天再说", "之先这样吧", "之回头再改"
        ];

        const titles = [
            `${randomChoice(titlePrefixes)}${randomChoice(titleSuffixes)} #${randomInt(1, 999)}`,
            `${movement}的${randomChoice(titlePrefixes)} No.${randomInt(1, 99)}`,
            `${randomChoice(titlePrefixes)} ${String.fromCharCode(randomInt(65, 90))}${randomInt(1, 99)}`,
            `${randomChoice(titleSuffixes)} ${year}-${randomInt(1, 12)}`,
            `${style === 'mandala' ? '曼陀罗' : style === 'wave' ? '波动' : '构图'} · ${randomChoice(titlePrefixes)}`
        ];
        const title = randomChoice(titles);

        // 生成艺术品描述
        const descriptions = [
            `作品体现了${artist.zh}对${movement}的深入思考`,
            `通过${movement}探索${movement}的新可能`,
            `融合${movement}与传统艺术语言的实验性作品`,
            `反映了艺术家对${movement}的独特见解`,
            `${movement}与${movement}的完美结合`
        ];
        const description = randomChoice(descriptions);

        // 修改价格生成逻辑
        const basePrice = randomInt(1, 3000) * 10000; // 1万到3000万
        const estimatedPrice = `${(basePrice/10000).toFixed(0)}万 - ${(basePrice/10000 * 1.5).toFixed(0)}万`;

        return {
            title,
            artist,
            year,
            movement,
            style,
            description,
            estimatedPrice
        };
    }

    function generateImage() {
        const randomAll = document.getElementById('randomAll').checked;
        
        if (randomAll) {
            // 随机选择尺寸
            const sizeOptions = ['small', 'medium', 'large'];
            imageSizeSelect.value = randomChoice(sizeOptions);
            
            // 随机选择风格
            const styleOptions = ['abstract', 'geometric', 'pattern', 'mandala', 'gradient', 'mosaic', 'wave'];
            imageStyleSelect.value = randomChoice(styleOptions);
            
            // 随机选择颜色主题
            const themeOptions = Object.keys(colorThemes);
            colorThemeSelect.value = randomChoice(themeOptions);
        }

        // 设置画布尺寸
        const sizes = {
            small: [300, 300],
            medium: [500, 500],
            large: [800, 800]
        };
        const [width, height] = sizes[imageSizeSelect.value];
        canvas.width = width;
        canvas.height = height;

        // 清空画布
        ctx.clearRect(0, 0, width, height);

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
        }

        // 生成并显示艺术品信息
        const artworkInfo = generateArtworkInfo(imageStyleSelect.value);
        const infoDiv = document.getElementById('artworkInfo');
        const titleElement = infoDiv.querySelector('.artwork-title');
        const detailsElement = infoDiv.querySelector('.artwork-details');

        titleElement.textContent = artworkInfo.title;
        detailsElement.innerHTML = `
            <p><strong>艺术家：</strong>${artworkInfo.artist.zh} (${artworkInfo.artist.en})</p>
            <p><strong>国籍：</strong>${artworkInfo.artist.nationality}</p>
            <p><strong>创作年份：</strong>${artworkInfo.year}</p>
            <p><strong>艺术流派：</strong>${artworkInfo.movement}</p>
            <p><strong>创作技法：</strong>${artworkInfo.style}</p>
            <p><strong>主题：</strong>${artworkInfo.movement}</p>
            <p><strong>作品简介：</strong>${artworkInfo.description}</p>
            <p><strong>估价：</strong>RMB ${artworkInfo.estimatedPrice}</p>
        `;

        infoDiv.style.display = 'block';

        // 显示画布和下载按钮
        canvas.style.display = 'inline-block';
        downloadBtn.style.display = 'inline-block';
    }

    function generateAbstract(ctx, width, height) {
        for(let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.fillStyle = getThemeColor();
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

    function generatePattern(ctx, width, height) {
        const size = Math.random() * 30 + 20;
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
        const petalCount = Math.floor(Math.random() * 12) + 6; // 6-18片花瓣
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
        gradient.addColorStop(0, getThemeColor());
        gradient.addColorStop(0.5, getThemeColor());
        gradient.addColorStop(1, getThemeColor());
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
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

    function downloadImage() {
        try {
            const link = document.createElement('a');
            link.download = 'generated-image.png';
            link.href = canvas.toDataURL();
            link.click();
        } catch (error) {
            alert('下载失败，请重试');
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
}); 