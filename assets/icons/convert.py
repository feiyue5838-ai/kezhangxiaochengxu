from PIL import Image, ImageDraw
import math

SIZE = 81  # 微信推荐 tabbar 图标尺寸
gray = '#8B95A5'
blue = '#0C1A2E'

def new_canvas():
    return Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0)), ImageDraw.Draw(Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0)))

def draw_home(color, path):
    """首页 - 带烟囱的温馨小屋"""
    img = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0))
    d = ImageDraw.Draw(img)
    lw = 3.5
    # 烟囱
    d.rectangle([52, 18, 60, 32], fill=color)
    # 屋顶三角
    d.polygon([(12, 38), (40, 10), (68, 38)], outline=color, width=int(lw))
    # 墙体
    d.rectangle([18, 38, 62, 64], outline=color, width=int(lw))
    # 门
    d.rectangle([32, 48, 48, 64], outline=color, width=int(lw))
    # 门把手
    d.ellipse([44, 54, 47, 57], fill=color)
    img.save(path)

def draw_home_active(color, path):
    """首页选中 - 填充实心"""
    img = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0))
    d = ImageDraw.Draw(img)
    # 烟囱
    d.rectangle([52, 18, 60, 32], fill=color)
    # 屋顶
    d.polygon([(12, 38), (40, 10), (68, 38)], fill=color)
    # 墙体
    d.rectangle([18, 38, 62, 64], fill=color)
    # 门（挖空）
    d.rectangle([32, 48, 48, 64], fill=(255, 255, 255, 0))
    d.rectangle([32, 48, 48, 64], outline=color, width=2)
    # 窗户
    d.rectangle([22, 44, 28, 50], fill=(255, 255, 255, 0))
    d.rectangle([22, 44, 28, 50], outline=color, width=2)
    img.save(path)

def draw_seal(color, path):
    """刻章 - 圆形印章 + 五角星"""
    img = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0))
    d = ImageDraw.Draw(img)
    lw = 3
    # 外圆
    d.ellipse([12, 12, 68, 68], outline=color, width=lw)
    # 内圆
    d.ellipse([22, 22, 58, 58], outline=color, width=lw)
    # 五角星
    cx, cy, r = 40, 40, 10
    points = []
    for i in range(5):
        angle = math.radians(-90 + i * 72)
        points.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
        angle2 = math.radians(-90 + i * 72 + 36)
        points.append((cx + r * 0.42 * math.cos(angle2), cy + r * 0.42 * math.sin(angle2)))
    d.polygon(points, outline=color, width=2)
    img.save(path)

def draw_seal_active(color, path):
    """刻章选中"""
    img = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0))
    d = ImageDraw.Draw(img)
    d.ellipse([12, 12, 68, 68], outline=color, width=3)
    d.ellipse([22, 22, 58, 58], outline=color, width=3)
    # 五角星填充
    cx, cy, r = 40, 40, 10
    points = []
    for i in range(5):
        angle = math.radians(-90 + i * 72)
        points.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
        angle2 = math.radians(-90 + i * 72 + 36)
        points.append((cx + r * 0.42 * math.cos(angle2), cy + r * 0.42 * math.sin(angle2)))
    d.polygon(points, fill=color)
    img.save(path)

def draw_news(color, path):
    """登报 - 报纸展开"""
    img = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0))
    d = ImageDraw.Draw(img)
    lw = 3
    # 左页
    d.rounded_rectangle([8, 14, 38, 68], radius=3, outline=color, width=lw)
    # 右页（微微偏移）
    d.rounded_rectangle([14, 10, 44, 64], radius=3, outline=color, width=lw)
    # 折线
    d.line([(26, 14), (26, 64)], fill=color, width=lw)
    # 标题横线
    d.line([(18, 24), (24, 24)], fill=color, width=2)
    d.line([(30, 22), (38, 22)], fill=color, width=2)
    # 正文横线
    for y in [32, 38, 44, 50, 56]:
        d.line([(18, y), (24, y)], fill=color, width=2)
        d.line([(30, 30), (38, 30)], fill=color, width=2)
    d.line([(30, 36), (38, 36)], fill=color, width=2)
    d.line([(30, 42), (38, 42)], fill=color, width=2)
    img.save(path)

def draw_news_active(color, path):
    """登报选中"""
    img = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0))
    d = ImageDraw.Draw(img)
    # 左页填充
    d.rounded_rectangle([8, 14, 38, 68], radius=3, fill=color)
    # 右页填充（颜色稍浅）
    r, g, b = int(color[1:3], 16), int(color[3:5], 16), int(color[5:7], 16)
    lighter = (f'#{min(r+30,255):02x}{min(g+30,255):02x}{min(b+30,255):02x}')
    d.rounded_rectangle([14, 10, 44, 64], radius=3, fill=color)
    # 折线
    d.line([(26, 14), (26, 64)], fill='white', width=2)
    # 内容线
    d.line([(18, 24), (24, 24)], fill='white', width=2)
    d.line([(30, 22), (38, 22)], fill='white', width=2)
    for y in [32, 38, 44]:
        d.line([(18, y), (24, y)], fill='white', width=2)
    for y in [30, 36, 42]:
        d.line([(30, y), (38, y)], fill='white', width=2)
    img.save(path)

def draw_file(color, path):
    """调档 - 文件柜/档案盒"""
    img = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0))
    d = ImageDraw.Draw(img)
    lw = 3
    # 柜体
    d.rounded_rectangle([10, 10, 70, 70], radius=4, outline=color, width=lw)
    # 三个抽屉
    for y in [16, 32, 48]:
        d.rounded_rectangle([16, y, 64, y + 12], radius=2, outline=color, width=2)
        # 把手
        d.rounded_rectangle([36, y + 3, 44, y + 9], radius=1, outline=color, width=2)
    img.save(path)

def draw_file_active(color, path):
    """调档选中"""
    img = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([10, 10, 70, 70], radius=4, outline=color, width=3)
    # 抽屉填充
    for i, y in enumerate([16, 32, 48]):
        r, g, b = int(color[1:3], 16), int(color[3:5], 16), int(color[5:7], 16)
        alpha = 60 + i * 30
        d.rounded_rectangle([16, y, 64, y + 12], radius=2, fill=color)
        d.rounded_rectangle([36, y + 3, 44, y + 9], radius=1, fill='white')
    img.save(path)

def draw_me(color, path):
    """我的 - 人物剪影"""
    img = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0))
    d = ImageDraw.Draw(img)
    lw = 3
    # 头
    d.ellipse([24, 10, 56, 42], outline=color, width=lw)
    # 肩膀弧线
    d.arc([8, 38, 72, 82], start=30, end=150, fill=color, width=lw)
    # 底部直线连接
    d.line([(22, 68), (58, 68)], fill=color, width=lw)
    img.save(path)

def draw_me_active(color, path):
    """我的选中"""
    img = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0))
    d = ImageDraw.Draw(img)
    d.ellipse([24, 10, 56, 42], fill=color)
    # 身体用更宽的弧
    d.pieslice([6, 42, 74, 90], start=210, end=330, fill=color)
    img.save(path)

# Generate
draw_home(gray, 'tab-home.png')
draw_home_active(blue, 'tab-home-active.png')
draw_seal(gray, 'tab-seal.png')
draw_seal_active(blue, 'tab-seal-active.png')
draw_news(gray, 'tab-news.png')
draw_news_active(blue, 'tab-news-active.png')
draw_file(gray, 'tab-file.png')
draw_file_active(blue, 'tab-file-active.png')
draw_me(gray, 'tab-me.png')
draw_me_active(blue, 'tab-me-active.png')
def draw_bookkeeping(color, path):
    """代理记账 - 账本/算盘风格"""
    img = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0))
    d = ImageDraw.Draw(img)
    lw = 3
    # 账本封面
    d.rounded_rectangle([8, 10, 72, 70], radius=5, outline=color, width=lw)
    # 书脊
    d.line([(8, 10), (8, 70)], fill=color, width=lw)
    # 标题横线
    d.line([(20, 24), (62, 24)], fill=color, width=2)
    # 内容横线
    for y in [34, 44, 54]:
        d.line([(20, y), (62, y)], fill=color, width=2)
    img.save(path)

def draw_bookkeeping_active(color, path):
    """代理记账选中"""
    img = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0))
    d = ImageDraw.Draw(img)
    # 封面填充
    d.rounded_rectangle([8, 10, 72, 70], radius=5, fill=color)
    # 书脊
    d.line([(8, 10), (8, 70)], fill='white', width=3)
    # 标题横线
    d.line([(20, 24), (62, 24)], fill='white', width=3)
    # 内容横线
    for y in [34, 44, 54]:
        d.line([(20, y), (62, y)], fill='white', width=3)
    img.save(path)

# 生成所有图标
draw_bookkeeping(gray, 'tab-bookkeeping.png')
draw_bookkeeping_active(blue, 'tab-bookkeeping-active.png')
print('All icons generated!')