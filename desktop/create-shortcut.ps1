param(
    [string]$DesktopDirectory = [Environment]::GetFolderPath('Desktop')
)
$ErrorActionPreference = 'Stop'
try {
    # Resolve paths from this checkout, so each reader can choose their own location.
    $libraryRoot = Split-Path -Parent $PSScriptRoot
    $launcherPath = Join-Path $PSScriptRoot 'open-library.vbs'
    $iconPath = Join-Path $PSScriptRoot 'java-library.ico'
    $hostPath = Join-Path $env:WINDIR 'System32\wscript.exe'
    foreach ($required in @($launcherPath, $iconPath, $hostPath)) {
        if (-not (Test-Path -LiteralPath $required -PathType Leaf)) {
            throw "缺少必要文件：$required"
        }
    }
    if (-not (Test-Path -LiteralPath $DesktopDirectory -PathType Container)) {
        throw "找不到桌面目录：$DesktopDirectory"
    }
    $shortcutPath = Join-Path $DesktopDirectory '安染的java私人图书馆.lnk'
    $shell = New-Object -ComObject WScript.Shell
    if (Test-Path -LiteralPath $shortcutPath) {
        # Update only this application's shortcut; preserve unrelated same-name files.
        $existing = $shell.CreateShortcut($shortcutPath)
        if ($existing.TargetPath -ne $hostPath -or
            $existing.Arguments -notmatch '^"[^"]+\\desktop\\open-library\.vbs"$') {
            throw '桌面已存在同名的其他快捷方式，请先为它改名，再运行本脚本。'
        }
    }
    $shortcut = $shell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = $hostPath
    $shortcut.Arguments = '"' + $launcherPath + '"'
    $shortcut.WorkingDirectory = $libraryRoot
    $shortcut.IconLocation = $iconPath + ',0'
    $shortcut.Description = '安染的 Java 私人图书馆：自动启动并在浏览器中打开'
    $shortcut.WindowStyle = 7
    $shortcut.Save()
    Write-Output "已创建桌面快捷方式：$shortcutPath"
    if (-not (Test-Path -LiteralPath (Join-Path $libraryRoot 'docs\.vitepress\dist\index.html'))) {
        Write-Output '首次使用前，请在知识库目录执行 npm ci 和 npm run build。'
    }
} catch {
    Write-Error $_
    exit 1
}
