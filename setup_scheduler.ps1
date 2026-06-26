# Daily Blogger auto-publish scheduler
# Run: powershell -ExecutionPolicy Bypass -File setup_scheduler.ps1

$taskName   = "BloggerAutoPublish"
$scriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Definition
$nodeExe    = (Get-Command node -ErrorAction Stop).Source
$scriptPath = Join-Path $scriptDir "auto_publish.js"

Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

$action = New-ScheduledTaskAction `
  -Execute $nodeExe `
  -Argument "`"$scriptPath`" 15" `
  -WorkingDirectory $scriptDir

$trigger = New-ScheduledTaskTrigger -Daily -At "08:00AM"

$settings = New-ScheduledTaskSettingsSet `
  -ExecutionTimeLimit (New-TimeSpan -Hours 2) `
  -RestartCount 2 `
  -RestartInterval (New-TimeSpan -Minutes 10) `
  -StartWhenAvailable

Register-ScheduledTask `
  -TaskName $taskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Description "Blogger auto publish - 15 posts per day" `
  -Force

Write-Host ""
Write-Host "Scheduler registered!" -ForegroundColor Green
Write-Host "  Task: $taskName"
Write-Host "  Schedule: Daily at 08:00 AM"
Write-Host "  Posts: 15 per day"
Write-Host ""
Write-Host "Commands:"
Write-Host "  Run now : Start-ScheduledTask -TaskName '$taskName'"
Write-Host "  Status  : Get-ScheduledTask -TaskName '$taskName'"
Write-Host "  Remove  : Unregister-ScheduledTask -TaskName '$taskName' -Confirm:`$false"
