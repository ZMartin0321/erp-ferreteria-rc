# Script para iniciar Backend y Frontend simultaneamente

Write-Host ""
Write-Host "Iniciando ERP Ferreteria..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Gray
Write-Host ""

# Ruta base del proyecto
$projectRoot = "C:\Users\HP\Desktop\FerreteriaERP\erp-ferreteria-rc"

# Iniciar backend en nueva ventana de PowerShell
Write-Host ">> Abriendo terminal para Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\backend'; Write-Host 'Iniciando Backend en puerto 4000...' -ForegroundColor Green; npm run dev"

# Esperar 3 segundos
Start-Sleep -Seconds 3

# Iniciar frontend en nueva ventana de PowerShell
Write-Host ">> Abriendo terminal para Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\frontend'; Write-Host 'Iniciando Frontend en puerto 5173...' -ForegroundColor Blue; npm run dev"

Write-Host ""
Write-Host "Ambos servidores se estan iniciando..." -ForegroundColor Green
Write-Host ""
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:4000/api" -ForegroundColor White
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Se abrieron 2 terminales nuevas" -ForegroundColor Gray
Write-Host "Presiona Ctrl+C en cada una para detenerlos" -ForegroundColor Gray
Write-Host ""
