# 修复导航栏和 Banner 之间的白色间隙
# 方案：使用 CSS 变量统一 margin-top

$pages = @(
    "announcement", "auction", "bidding", "company-docs", "confession",
    "content-edit", "court", "creditor", "env-assessment", "government",
    "idcard-page", "invoice-receipt", "labor-dispute", "personal-docs",
    "praise", "publicity", "apology"
)

foreach ($page in $pages) {
    $wxmlPath = "D:\刻章软件\rongcheng-miniprogram\pages\newspaper\$page\index.wxml"
    $wxssPath = "D:\刻章软件\rongcheng-miniprogram\pages\newspaper\$page\index.wxss"
    
    if (Test-Path $wxmlPath) {
        # 修复 WXML：移除 Banner 的 margin-top 行内样式
        $content = Get-Content $wxmlPath -Raw -Encoding UTF8
        $original = $content
        
        # 移除 style="margin-top: {{navHeight}}px;" 或 style='margin-top: {{navHeight}}px;'
        $content = $content -replace '\s*style="margin-top:\s*\{\{navHeight\}\}px;?"', ''
        $content = $content -replace "\s*style='margin-top:\s*\{\{navHeight\}\}px;?'