# Script untuk memulai server dengan membersihkan port terlebih dahulu
# Usage: .\scripts\start-server.ps1

param(
    [int]$Port = 3000
)

Write-Host "Memulai RevoBank API Server..." -ForegroundColor Cyan
Write-Host ""

# Bersihkan port terlebih dahulu
Write-Host "Membersihkan port $Port..." -ForegroundColor Yellow
$connections = netstat -ano | findstr ":$Port"

if ($connections) {
    $pids = $connections | ForEach-Object {
        if ($_ -match '\s+(\d+)$') {
            $matches[1]
        }
    } | Select-Object -Unique
    
    foreach ($pid in $pids) {
        try {
            $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "Menghentikan proses: $($process.ProcessName) (PID: $pid)..." -ForegroundColor Red
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
        } catch {
            # Ignore errors
        }
    }
    Start-Sleep -Seconds 1
}

# Mulai server
Write-Host "Port $Port sudah bersih. Memulai server..." -ForegroundColor Green
Write-Host ""

npm run start:dev

