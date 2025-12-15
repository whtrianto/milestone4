# Script untuk membersihkan port 3000
# Usage: .\scripts\clear-port.ps1 [port_number]

param(
    [int]$Port = 3000
)

Write-Host "Mencari proses yang menggunakan port $Port..." -ForegroundColor Yellow

# Cari proses yang menggunakan port
$connections = netstat -ano | findstr ":$Port"

if ($connections) {
    Write-Host "Ditemukan proses yang menggunakan port $Port:" -ForegroundColor Green
    Write-Host $connections
    
    # Ekstrak PID
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
                Write-Host "Proses berhasil dihentikan!" -ForegroundColor Green
            }
        } catch {
            Write-Host "Tidak dapat menghentikan proses PID: $pid" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "Port $Port tidak digunakan oleh proses apapun." -ForegroundColor Green
}

Write-Host "`nSelesai!" -ForegroundColor Cyan

