document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const imageSizeSelect = document.getElementById('imageSize');
    const imageStyleSelect = document.getElementById('imageStyle');

    generateBtn.addEventListener('click', generateImage);
    downloadBtn.addEventListener('click', downloadImage);

    function generateImage() {
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
        }

        // 显示画布和下载按钮
        canvas.style.display = 'inline-block';
        downloadBtn.style.display = 'inline-block';
    }

    function generateAbstract(ctx, width, height) {
        // 生成抽象图案
        for(let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
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
        // 生成几何图案
        for(let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.strokeStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
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
        // 生成重复图案
        const size = 50;
        for(let x = 0; x < width; x += size) {
            for(let y = 0; y < height; y += size) {
                ctx.fillStyle = `hsl(${(x + y) % 360}, 70%, 50%)`;
                ctx.fillRect(x, y, size, size);
            }
        }
    }

    function downloadImage() {
        const link = document.createElement('a');
        link.download = 'generated-image.png';
        link.href = canvas.toDataURL();
        link.click();
    }
}); 