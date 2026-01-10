$headers = @{ "Content-Type" = "application/json" }
$loginBody = @{
    email = "testuser6@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    # 1. Login (using the user created in prev step)
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Headers $headers -Body $loginBody -SessionVariable session
    Write-Host "Login Success: $($loginResponse.success)"

    # 2. Get Chart Data
    $chartResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard/chart-data?range=7d" -Method Get -WebSession $session
    Write-Host "Chart Data Response:"
    Write-Host ($chartResponse | ConvertTo-Json -Depth 5)

} catch {
    Write-Host "Error: $_"
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body: $($reader.ReadToEnd())"
    }
}
