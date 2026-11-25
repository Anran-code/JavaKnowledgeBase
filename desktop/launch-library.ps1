param([switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
$libraryRoot = Split-Path -Parent $PSScriptRoot
$url = 'http://127.0.0.1:5178/'
$logDir = Join-Path $libraryRoot '.runtime'
function Get-LibraryStatus {
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
        if ($response.Content -match '安染的 Java 手册') { return 'ready' }
        return 'occupied'
    } catch {
        if ($_.Exception.Response) { return 'occupied' }
        return 'stopped'
    }
}
try {
    # Prevent two rapid double-clicks from starting duplicate services.
    $startupLock = New-Object Threading.Mutex($false, 'Local\AnranJavaLibraryLauncher')
    $hasLock = $startupLock.WaitOne(45000)
    if (-not $hasLock) { throw '启动正在进行，请稍后再试。' }
    try {
        $status = Get-LibraryStatus
        if ($status -eq 'occupied') { throw '5178 端口已被其他程序占用，请关闭占用程序后再试。' }
        if ($status -ne 'ready') {
            $node = (Get-Command node.exe -ErrorAction Stop).Source
            $entry = Join-Path $libraryRoot 'node_modules\vitepress\bin\vitepress.js'
            $dist = Join-Path $libraryRoot 'docs\.vitepress\dist\index.html'
            if (-not (Test-Path -LiteralPath $entry)) { throw '缺少网站依赖，请在知识库目录运行 npm.cmd install。' }
            if (-not (Test-Path -LiteralPath $dist)) { throw '缺少网页构建文件，请在知识库目录运行 npm.cmd run build。' }
            [IO.Directory]::CreateDirectory($logDir) | Out-Null
            # Serve the built book locally; no visible command window is needed.
            $serverProcess = Start-Process -FilePath $node -ArgumentList @('"'+$entry+'"', 'preview', 'docs', '--host', '127.0.0.1', '--port', '5178') -WorkingDirectory $libraryRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logDir 'desktop-server.log') -RedirectStandardError (Join-Path $logDir 'desktop-server-error.log') -PassThru
            [IO.File]::WriteAllText((Join-Path $logDir 'desktop-server.pid'), [string]$serverProcess.Id)
            $deadline = (Get-Date).AddSeconds(30)
            do {
                Start-Sleep -Milliseconds 350
                $status = Get-LibraryStatus
                if ($status -eq 'ready') { break }
                if ($serverProcess.HasExited) { throw '网页服务启动失败，可查看 .runtime 文件夹中的 desktop-server-error.log。' }
            } while ((Get-Date) -lt $deadline)
            if ($status -ne 'ready') { throw '网页服务启动超时，请查看知识库 .runtime 文件夹中的日志。' }
        }
    } finally {
        $startupLock.ReleaseMutex()
        $startupLock.Dispose()
    }
    if ($NoBrowser) { Write-Output ('READY '+$url); exit 0 }
    # Open the user's default browser only after the page is available.
    Start-Process $url
} catch {
    if ($NoBrowser) { Write-Error $_; exit 1 }
    Add-Type -AssemblyName System.Windows.Forms
    [Windows.Forms.MessageBox]::Show($_.Exception.Message, '安染的java私人图书馆', 'OK', 'Error') | Out-Null
    exit 1
}