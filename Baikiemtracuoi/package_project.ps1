param(
    [string]$StudentId = "SV001"
)

$outputZip = "$PSScriptRoot\${StudentId}_FinalExam.zip"
Write-Host "Dang dong goi du an thanh file zip: $outputZip ..." -ForegroundColor Cyan

$files = Get-ChildItem -Path $PSScriptRoot | Where-Object { $_.Extension -ne ".zip" }
Compress-Archive -Path $files.FullName -DestinationPath $outputZip -Force

Write-Host "Da tao thanh cong file: $outputZip" -ForegroundColor Green
