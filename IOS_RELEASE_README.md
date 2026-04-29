# StatusVault — iOS Release Pipeline (Windows PC → GitHub → TestFlight)

This guide gets your iPhone build from a Windows PC into TestFlight **without ever needing a Mac.** It uses Expo's EAS Build (cloud-builds the iOS app on Apple silicon hosts) and `eas submit` (uploads the .ipa to TestFlight).

End-to-end flow:

```
Windows PC  ─► GitHub  ─► GitHub Actions  ─► EAS Build (cloud Mac)  ─► TestFlight  ─► iPhone
```

You make a code change locally, commit & push, and a few minutes later the new build shows up in TestFlight on your iPhone. No Xcode, no Mac, no manual uploads.

---

## Part 1 — One-time setup (do this once)

### 1.1 Apple Developer account

You need a paid **Apple Developer Program** membership ($99/yr). Sign up at https://developer.apple.com if you haven't already. The account email is your `APPLE_ID`.

After enrolling, find these three values — you'll need them later:

- **APPLE_ID** — the email you log in with
- **APPLE_TEAM_ID** — 10-character ID at https://developer.apple.com/account → "Membership details"
- **ASC_APP_ID** — App Store Connect numeric app ID (you'll get this in step 1.3)

### 1.2 Create the App Store Connect API key (recommended over app-specific passwords)

App-specific passwords still work, but the API key is more reliable in CI. Do this once:

1. Go to https://appstoreconnect.apple.com/access/integrations/api
2. Click **+** to create a new key
3. Name: `StatusVault CI`
4. Access: **App Manager** (minimum needed for TestFlight uploads)
5. Click **Generate**
6. Download the `.p8` file (you can only download it ONCE — save it carefully)
7. Note down the **Key ID** (10 chars) and the **Issuer ID** (UUID at top of the page)

You now have three things from this step:
- `APPLE_API_KEY_ID` — the 10-char key ID
- `APPLE_API_ISSUER_ID` — the UUID issuer ID
- `APPLE_API_KEY_CONTENT` — the entire content of the `.p8` file (open it in Notepad, copy ALL of it, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines)

### 1.3 Create the app shell in App Store Connect

EAS Submit needs an app record to exist on App Store Connect before it can upload. Create it once:

1. Go to https://appstoreconnect.apple.com/apps
2. Click **+** → **New App**
3. Platform: **iOS**
4. Name: `StatusVault` (must be unique across the entire App Store — try `StatusVault — Visa Tracker` if taken)
5. Primary Language: **English (U.S.)**
6. Bundle ID: **com.statusvault.app** (must match `ios.bundleIdentifier` in `app.json`)
   - If the bundle ID isn't in the dropdown, register it first at https://developer.apple.com/account/resources/identifiers/list
7. SKU: any unique string, e.g. `STATUSVAULT001`
8. User Access: **Full Access**

After creation, the app gets an **Apple ID** (numeric, ~10 digits) — that's your `ASC_APP_ID`. Find it at App Store Connect → My Apps → StatusVault → App Information.

### 1.4 Create the Expo / EAS account

1. Sign up at https://expo.dev/signup (free tier is fine to start)
2. Note your username — that's `REPLACE_WITH_YOUR_EXPO_USERNAME` in `app.json`
3. Generate an access token: https://expo.dev/settings/access-tokens → **Create token** → name it `GitHub Actions` → copy the token (shown once)

This gives you `EXPO_TOKEN`.

### 1.5 Install tools on your Windows PC

Open PowerShell or Windows Terminal:

```powershell
# Install Node 20 (use nvm-windows if you don't have it: https://github.com/coreybutler/nvm-windows)
nvm install 20
nvm use 20

# Install EAS CLI globally
npm install -g eas-cli

# Install Git for Windows if you haven't: https://git-scm.com/download/win

# Verify
node --version    # should be v20.x
npm --version
eas --version
git --version
```

### 1.6 First-time project setup on Windows

Extract the `statusvault-web` zip you got from this delivery into a folder, e.g. `C:\Code\statusvault-web`, then:

```powershell
cd C:\Code\statusvault-web

# Install dependencies
npm install

# Log into EAS
eas login
# (use the Expo account from step 1.4)

# Initialize the project on EAS — this creates a project on expo.dev
# and writes the real projectId back into app.json (replacing the placeholder)
eas init

# When asked "What would you like your Android package name to be?" or similar,
# accept the existing value (com.statusvault.app).
```

After `eas init`, two values in `app.json` get filled in automatically:
- `extra.eas.projectId` — the real EAS project UUID
- `owner` — your Expo username

Open `app.json` in a text editor, verify both fields are now real values (not the `REPLACE_WITH_*` placeholders).

### 1.7 Configure iOS credentials (one-time)

EAS will manage your iOS distribution certificate and provisioning profile for you. From your project folder:

```powershell
# This generates / fetches all needed iOS credentials.
# Pick "Let EAS handle the entire process" when prompted.
eas credentials --platform ios
```

EAS will ask for your Apple ID and (one-time) password to create the cert + profile in your Apple Developer account. Once done, all credentials live on EAS's servers — you never need to think about them again.

### 1.8 Set up the GitHub repository

If your existing repo is `kkbcori/statusvault-web` and you're adding the iOS pipeline to it, just commit & push the new files. If you're starting fresh:

```powershell
cd C:\Code\statusvault-web

# If not already a git repo
git init
git remote add origin https://github.com/kkbcori/statusvault-web.git

# Stage everything (the .gitignore already excludes node_modules, .expo, etc.)
git add .
git commit -m "feat(ios): add EAS Build + TestFlight pipeline"
git branch -M main
git push -u origin main
```

### 1.9 Add GitHub Actions secrets

This is what wires GitHub up to EAS and Apple. Go to:

```
https://github.com/kkbcori/statusvault-web/settings/secrets/actions
```

Add these **Repository secrets** (click **New repository secret** for each):

| Secret name | Value |
|---|---|
| `EXPO_TOKEN` | The token from step 1.4 |
| `APPLE_ID` | Your Apple Developer email (step 1.1) |
| `APPLE_TEAM_ID` | The 10-char team ID (step 1.1) |
| `ASC_APP_ID` | The numeric App Store Connect app ID (step 1.3) |
| `APPLE_API_KEY_ID` | API key ID from step 1.2 |
| `APPLE_API_ISSUER_ID` | API issuer ID from step 1.2 |
| `APPLE_API_KEY_CONTENT` | Entire `.p8` file content (paste as-is, with BEGIN/END lines) |

**Optional fallback** (only if you don't want to use the API key):
| `APPLE_APP_SPECIFIC_PASSWORD` | App-specific password from https://appleid.apple.com → Sign-In and Security → App-Specific Passwords |

The workflow tries the API key first (more reliable). The app-specific password is a backup.

### 1.10 Verify everything is wired up

Push your first commit (or click "Run workflow" manually):

1. Go to https://github.com/kkbcori/statusvault-web/actions
2. Click **iOS TestFlight** in the left sidebar
3. Click **Run workflow** → **Run workflow** (use the green button)
4. Watch it run. The first build typically takes **15–25 minutes**.

If anything fails, the logs will tell you which secret is wrong or missing.

---

## Part 2 — Day-to-day workflow (after the one-time setup)

This is the steady-state loop you'll use forever:

```powershell
# 1. Make code changes in C:\Code\statusvault-web

# 2. Commit & push
git add .
git commit -m "fix: whatever you changed"
git push

# 3. (Auto) GitHub Actions kicks off the iOS TestFlight workflow

# 4. ~15 min later, build appears in TestFlight on your iPhone

# 5. TestFlight app on your iPhone shows the new build → tap "Update" → test
```

That's literally it. Every push to `main` produces a TestFlight build.

### Bumping the build number

EAS handles this automatically — `"autoIncrement": true` is set in `eas.json` for the production profile. Each build gets a new `buildNumber` automatically, no manual edits needed.

The semantic `version` (e.g. `"1.0.0"`) only changes when you do a real release — bump it in `app.json` and commit. TestFlight will show both: e.g. `1.0.0 (47)` where 47 is the auto-incremented build number.

### Skipping a build (only push web/doc changes without burning EAS credit)

The workflow already ignores changes to `web/`, `docs/`, `public/`, `scripts/`, `supabase/`, and any `*.md` file. So if you only changed those, no iOS build runs — only the web deploy fires. You'll see "iOS TestFlight" skipped on the Actions page, which is correct.

If you want to force a rebuild without code changes, use the manual **Run workflow** button on the Actions page.

### Building locally without GitHub (rare)

If you want to test a build from your Windows PC directly:

```powershell
eas build --platform ios --profile production
# (Wait ~20 min, then EAS uploads the .ipa for download)

eas submit --platform ios --latest
# (Submits the most recent build to TestFlight)
```

But normally you don't need to — push-to-deploy via GitHub Actions is the canonical path.

---

## Part 3 — Installing on your iPhone

1. On your iPhone, install **TestFlight** from the App Store (free).
2. In App Store Connect → TestFlight → **Internal Testing**, add your Apple ID email as an internal tester.
3. You'll get an email invite. Open it on your iPhone, accept, and TestFlight will offer the latest build.
4. Tap **Install**. The first time you launch StatusVault, iOS will show the **notification permission prompt** automatically (because of the change applied in this delivery). Tap **Allow** and you're set.

To verify notifications are working, go to **Settings → Notifications & Reminders** in StatusVault and tap **Send Test Notification**. You should see a banner appear after ~3 seconds.

---

## Part 4 — Troubleshooting

### "Build failed: Unable to find a destination matching the provided destination specifier"
You forgot `eas init` or the `extra.eas.projectId` placeholder is still in `app.json`. Run `eas init` from your local machine and commit the updated `app.json`.

### "Authentication failed" during `eas submit`
- API key path: confirm `APPLE_API_KEY_CONTENT` includes the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` header/footer lines. Don't strip them.
- Confirm the Key ID and Issuer ID don't have extra whitespace.
- Confirm the API key has at least **App Manager** role in App Store Connect.

### "Bundle identifier mismatch"
The `app.json` `ios.bundleIdentifier` (`com.statusvault.app`) must match exactly what you registered in App Store Connect. Both must be lowercase, dotted, no typos.

### TestFlight says "Missing Compliance"
This is the export compliance question. The `ios.config.usesNonExemptEncryption: false` and `ITSAppUsesNonExemptEncryption: false` flags in `app.json` are supposed to skip this prompt. If it still asks, click **Manage** in TestFlight, answer **No** to the export compliance question, and future builds will inherit that answer.

### Build succeeds but never appears in TestFlight
- Check App Store Connect → TestFlight → Builds. There's typically a 5-15 minute "Processing" delay after the upload completes.
- If a build is stuck in "Processing" for >2 hours, Apple usually emails the issue (often a missing `Info.plist` key or an icon dimension problem).

### "Notifications don't fire on my iPhone"
- Confirm permissions: iPhone **Settings** → StatusVault → **Notifications** → Allow Notifications **on**.
- Settings → Notifications & Reminders inside the app → tap **Send Test Notification**. If that doesn't fire, the permission is off.
- Background notification scheduling is local-only, so notifications fire even with no internet — but only if the device clock is past the trigger time.

### Need to roll back to a previous TestFlight build
TestFlight keeps the last 25 builds. Just open the build picker in TestFlight on your iPhone and tap an older build → Install.

---

## File reference (what was added/changed for iOS)

| File | Status | Purpose |
|---|---|---|
| `app.json` | modified | Added `extra.eas.projectId` placeholder, `runtimeVersion`, `ios.config.usesNonExemptEncryption`, `ITSAppUsesNonExemptEncryption`, and `LSApplicationQueriesSchemes` |
| `eas.json` | new | EAS Build profiles (development/preview/production) + iOS submit config |
| `.github/workflows/ios-testflight.yml` | new | Auto-builds on push to `main` and submits to TestFlight |
| `src/utils/notifications.ts` | modified | `configureNotifications()` is now async and silently requests notification permissions on first launch (so iOS shows the permission prompt naturally) |
| `IOS_RELEASE_README.md` | new | This file |

**Nothing else changed.** All UI, screens, navigation, theme, store logic, Supabase setup, and assets are untouched. The web build (`https://www.statusvault.org`) deploys exactly as before via the existing `deploy.yml` workflow.

---

## Quick reference card

**One-time:** `eas login` → `eas init` → `eas credentials --platform ios` → set GitHub secrets → push.

**Every release:** edit code → `git commit` → `git push` → wait ~15 min → open TestFlight on iPhone → tap **Update**.

**Manual run:** GitHub → Actions → iOS TestFlight → **Run workflow**.

**View builds:** https://expo.dev/accounts/<your-username>/projects/statusvault-web/builds

**Submit existing build:** `eas submit --platform ios --latest` (locally) or re-run the workflow with submit toggled on.
