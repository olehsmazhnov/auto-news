[CmdletBinding()]
param(
    [string]$CommandLine = "codex",
    [string]$SuccessTitle = "Codex finished",
    [string]$FailureTitle = "Codex failed"
)

function Send-WindowsNotification {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Title,
        [Parameter(Mandatory = $true)]
        [string]$Message,
        [switch]$IsError
    )

    $burntToastAvailable = Get-Module -ListAvailable -Name BurntToast
    if ($burntToastAvailable) {
        try {
            Import-Module BurntToast -ErrorAction Stop
            New-BurntToastNotification -Text $Title, $Message | Out-Null
            return
        } catch {
            Write-Verbose "BurntToast notification failed. Falling back to tray balloon."
        }
    }

    try {
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Drawing

        $notifyIcon = New-Object System.Windows.Forms.NotifyIcon
        $notifyIcon.Visible = $true
        $notifyIcon.Icon = if ($IsError) { [System.Drawing.SystemIcons]::Error } else { [System.Drawing.SystemIcons]::Information }
        $notifyIcon.BalloonTipIcon = if ($IsError) { [System.Windows.Forms.ToolTipIcon]::Error } else { [System.Windows.Forms.ToolTipIcon]::Info }
        $notifyIcon.BalloonTipTitle = $Title
        $notifyIcon.BalloonTipText = $Message
        $notifyIcon.ShowBalloonTip(5000)
        Start-Sleep -Milliseconds 5500
        $notifyIcon.Dispose()
    } catch {
        Write-Warning "Unable to display Windows notification: $($_.Exception.Message)"
    }
}

if ([string]::IsNullOrWhiteSpace($CommandLine)) {
    throw "No command provided."
}

$commandText = $CommandLine
$startTime = Get-Date

Write-Host "Running with notification: $commandText"

$isSuccess = $true
$exitCode = 0

try {
    cmd.exe /d /s /c $CommandLine

    if ($null -ne $LASTEXITCODE) {
        $exitCode = $LASTEXITCODE
        $isSuccess = $LASTEXITCODE -eq 0
    } elseif (-not $?) {
        $exitCode = 1
        $isSuccess = $false
    }
} catch {
    $isSuccess = $false
    $exitCode = 1
    Write-Error $_
}

$durationSeconds = [Math]::Round(((Get-Date) - $startTime).TotalSeconds, 1)

if ($isSuccess) {
    Send-WindowsNotification -Title $SuccessTitle -Message "Completed in ${durationSeconds}s"
} else {
    Send-WindowsNotification -Title $FailureTitle -Message "Exit code ${exitCode} after ${durationSeconds}s" -IsError
}

exit $exitCode
