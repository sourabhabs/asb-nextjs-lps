Buddy SMS OTP setup

Set BUDDY_SMS_API_KEY and BUDDY_SMS_SENDER_ID=ASBNCR in the server environment. Keep credentials out of Git and browser variables. Rebuild and restart after deployment. Gateway acceptance must have success=true; delivery failures do not report success.
Resend awaits the gateway result before displaying success.
