$pages = @("announcement", "auction", "bidding", "court", "creditor", "env-assessment", "government", "idcard-page", "invoice-receipt", "labor-dispute", "personal-docs", "praise", "publicity")

foreach ($page in $pages) {
    $wxmlPath = "D:\刻章软件\rongcheng-miniprogram\pages\newspaper\$page\index.wxml"
    $wxssPath = "D:\刻章软件\rongcheng-miniprogram\pages\newspaper\$page\index.wxss"
    
    # 修复 WXML
    if (Test-Path $wxmlPath) {
        $content = Get-Content $wxmlPath -Raw -Encoding UTF8
        $original = $content
        
        # 移除 margin-top 行内样式
        $content = $content -replace '\s*style="margin-top:\s*\{\{navHeight\}\}px;?"', ''
        
        if ($content -ne $original) {
            Set-Content $wxmlPath -Value $content -Encoding UTF8
            Write-Output "WXML: $page"
        }
    }
    
    # 修复 WXSS
    if (Test-Path $wxssPath) {
        $content = Get-Content $wxssPath -Raw -Encoding UTF8
        $original = $content
        
        # 检查 .banner 规则是否存在
        if ($content -match '\.banner\s*\{') {
            if ($content -match '\.banner\s*\{[^}]*margin-top' -and $content -notmatch 'var\(--nav-height') {
                # 替换现有的 margin-top 为 CSS 变量版本
                $content = $content -replace '(\.banner\s*\{[^}]*)(margin-top:\s*[^;]+;)', '$1margin-top: var(--nav-height, 64px);'
            } elseif ($content -notmatch '\.banner\s*\{[^}]*margin-top') {
                # 添加 margin-top
                $content = $content -replace '(\.banner\s*\{[^}]*)', '$1margin-top: var(--nav-height, 64px);'
            }
        }
        
        if ($content -ne $original) {
            Set-Content $wxssPath -Value $content -Encoding UTF8
            Write-Output "WXSS: $page"
        }
    }
}

Write-Output "Done!"
