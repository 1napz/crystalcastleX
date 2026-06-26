## Configuring two-factor authentication — summary

- GitHub supports multiple 2FA methods: TOTP apps (recommended), SMS, passkeys, security keys, and GitHub Mobile. Security keys are recommended as backups instead of SMS.

- Important notes:
  - As of Mar 2023, contributors were required to enable at least one 2FA method (45‑day enrollment windows applied to selected groups).
  - After enabling 2FA your account enters a 28‑day checkup period; you must successfully perform 2FA during that time to finish enrollment.
  - Managed users (enterprise) may have 2FA controlled by the setup user or IdP.
  - Disabling 2FA can remove access to organizations that require 2FA and private forks; re‑enable to regain access. You can reconfigure methods without disabling 2FA.

- TOTP app setup (recommended):
  - Install any TOTP app (GitHub is app‑agnostic; cloud backups are suggested).
  - In Settings → Password and authentication → Enable two‑factor authentication, scan the QR or use the setup key.
  - Enter the generated six‑digit code, download/save recovery codes, confirm you saved them, then enable.
  - To add multiple devices, scan the QR on each device during initial setup or save the setup key; to add later you must reconfigure from security settings.
  - Manual TOTP parameters: Type=TOTP, Label=GitHub:<username>, Secret=(setup key), Issuer=GitHub, Algorithm=SHA1, Digits=6, Period=30s.

- SMS setup (less recommended):
  - Use Settings → Password and authentication → Enable two‑factor authentication, complete CAPTCHA, enter country code and phone number, receive SMS code and verify.
  - Warnings about SMS: susceptible to interception, phishing, delivery issues, and limited country support; organizations may disallow SMS 2FA.

- After initial 2FA via TOTP or SMS you can add security keys and other alternate methods to reduce lockout risk.

(Truncated content beyond this point covered step-by-step SMS verification and additional method configuration details.)