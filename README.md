
# 🎧 AI DJ — Chrome Extension

> **Break out of the algorithm. Discover music YouTube never would have shown you.**

[![Made with Gemini](https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285F4?style=flat-square&logo=google)](https://aistudio.google.com/)
[![YouTube API](https://img.shields.io/badge/YouTube-Data%20API%20v3-FF0000?style=flat-square&logo=youtube)](https://developers.google.com/youtube/v3)
[![Free to use](https://img.shields.io/badge/Price-100%25%20Free-1DB954?style=flat-square)]()
[![Chrome Extension](https://img.shields.io/badge/Platform-Chrome%20Extension-FFCC00?style=flat-square&logo=googlechrome)]()

---

## 💡 Why This Exists

If you use YouTube Music or YouTube regularly, you've probably noticed something: **the algorithm is a mirror, not a window.**

It's great at reflecting back what you already know — songs you've played before, artists you already follow. And honestly, that's by design. Recommendation engines are optimised for engagement, and familiar music keeps you watching. But over time, YouTube starts to feel like a small village. The same 40 songs. The same 10 artists. On repeat. Forever.

The thing is — YouTube is not a small village. It's one of the largest music libraries on the planet. Obscure lo-fi producers from Jakarta. Post-punk bands from Lagos. Forgotten 80s synth-pop from Warsaw. It's all there. The algorithm just never takes you there.

**AI DJ fixes that.**

You describe a vibe in plain English. The Gemini AI builds a curated list of songs — including stuff you've never heard — that match your mood, energy level, decade, and taste. Then the extension automatically searches YouTube and assembles a real playlist on your account. No manual searching. No copy-pasting. Just press a button and get a playlist full of music that's genuinely new to you.

---

## 📸 Screenshots

> 💡 *Add your screenshots to a `/screenshots` folder in this repo and they'll render here automatically.*

| Main UI | Playlist Generated |
|---|---|
| ![Main UI](screenshots/ui-main.png) | ![Success](screenshots/ui-success.png) |

---

## 🎬 Video Walkthroughs

> 💡 *Record these with Windows Game Bar (`Win + G`), QuickTime (Mac), or [Loom](https://loom.com) and drop the files in `/videos`, or swap in YouTube links.*

| # | What it covers | Link |
|---|---|---|
| 1 | Full setup from scratch — API keys to first playlist | [▶ Watch](videos/01-full-setup.mp4) |
| 2 | Getting your Gemini API key from Google AI Studio | [▶ Watch](videos/02-gemini-api-key.mp4) |
| 3 | Setting up YouTube OAuth in Google Cloud Console | [▶ Watch](videos/03-youtube-oauth.mp4) |
| 4 | Loading the unpacked extension into Chrome | [▶ Watch](videos/04-chrome-load.mp4) |
| 5 | Using the Surprise 🎲 button, Energy slider & Blacklist | [▶ Watch](videos/05-features-demo.mp4) |

---

## ✨ Features

- 🤖 **Gemini 2.5 Flash AI** curates a song list from a plain-English prompt
- 🎚️ **Energy level slider** — dial in anything from sleepy acoustic to full-send hype
- 📅 **Decade filter** — lock the vibe to the 70s, 80s, 90s, 2000s, or any era
- 🔢 **Custom song count** — request 1 to 50 tracks
- 🚫 **Blacklist** — exclude specific artists, genres, or songs entirely
- 🎲 **Surprise Me** — one-click random eclectic vibe across genres, cultures, and continents
- ☕ 🏋️ 🚗 **Preset buttons** — jump-start common moods instantly
- 🔐 **OAuth login** — connects to your YouTube account securely via Google's own login system
- 🎬 **Auto-builds the playlist on YouTube** — private by default, no manual work required

---

## 📋 Prerequisites

Before starting setup, make sure you have:

- **Google Chrome** browser installed
- A **Google Account** (the playlist saves to your YouTube)
- A **Google Cloud Console** account — free at [console.cloud.google.com](https://console.cloud.google.com)
- Basic comfort with copying keys and filling in web forms — no coding knowledge required for setup

---

## 🔑 Step 1 — Get Your Gemini API Key

The Gemini API handles all the AI music curation. Google offers a free tier that is more than sufficient for personal use.

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select **"Create API key in new project"** (or choose an existing project)
5. Copy the generated key — it begins with `AIzaSy...`
6. Open `popup.js` in VS Code and replace the placeholder at the very top of the file:

```js
const GEMINI_API_KEY = 'PASTE_YOUR_KEY_HERE';
```

> ⚠️ **Keep this key private.** Do not share it publicly or commit it to a public repository with the real value. See the [Security section](#-security--api-keys) below before pushing to GitHub.

---

## 📺 Step 2 — Set Up YouTube OAuth (Google Cloud Console)

This is the most involved part of the setup. It authorises the extension to create playlists on your YouTube account using Google's secure OAuth 2.0 system. Work through each sub-step carefully.

### 2a — Create a Google Cloud Project

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Click the project dropdown at the top → **"New Project"**
3. Name it something like `AI DJ Extension` → click **"Create"**
4. Confirm the new project is selected in the dropdown before continuing

### 2b — Enable the YouTube Data API v3

1. In the left sidebar, go to **APIs & Services → Library**
2. Search for **"YouTube Data API v3"**
3. Click the result → click **"Enable"**

### 2c — Configure the OAuth Consent Screen

This is the screen users see when prompted to log in. Google requires it even for personal projects.

1. Go to **APIs & Services → OAuth consent screen**
2. Choose **External** → click **"Create"**
3. Fill in the required fields:
   - **App name:** `AI DJ`
   - **User support email:** your email address
   - **Developer contact email:** your email address
4. Click **"Save and Continue"**
5. On the **Scopes** screen, click **"Add or Remove Scopes"**
6. Paste this into the manual entry box and click **"Add to Table"**:
   ```
   https://www.googleapis.com/auth/youtube
   ```
7. Click **"Update"** → **"Save and Continue"**
8. On the **Test Users** screen, click **"+ Add Users"** and enter your own Google account email
9. Click **"Save and Continue"** → **"Back to Dashboard"**

> ℹ️ The app stays in **Testing** mode, which is intentional for personal use. Only accounts added as test users can log in — which is exactly what you want.

### 2d — Create an OAuth Client ID

1. Go to **APIs & Services → Credentials**
2. Click **"+ Create Credentials"** → **"OAuth Client ID"**
3. Under **Application type**, select **Chrome Extension**
4. You will need your **Extension ID** here — complete Step 3 first to load the extension into Chrome, then return with the ID
5. Paste the Extension ID into the **"Item ID"** field
6. Click **"Create"**
7. Copy the **Client ID** — it ends with `.apps.googleusercontent.com`

### 2e — Add the Client ID to manifest.json

Open `manifest.json` and add the following `oauth2` block, using your copied Client ID:

```json
"oauth2": {
  "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
  "scopes": [
    "https://www.googleapis.com/auth/youtube"
  ]
}
```

---

## 📦 Step 3 — Load the Extension into Chrome

1. Open **Google Chrome** and go to `chrome://extensions` in the address bar
2. Enable **"Developer mode"** using the toggle in the top-right corner
3. Click **"Load unpacked"**
4. Navigate to and select the folder containing your project files (`popup.html`, `popup.js`, `popup.css`, `manifest.json`)
5. **AI DJ** will now appear in your extensions list
6. Note the **Extension ID** shown beneath the extension name — you need this for Step 2d
7. Click the puzzle piece icon 🧩 in the Chrome toolbar → pin 📌 **AI DJ** to keep it accessible

> ℹ️ After any code change, go to `chrome://extensions` and click the **↺ refresh icon** on the AI DJ card. No reinstall needed.

---

## 🚀 Step 5 — Using the Extension

Once everything is configured:

1. Click the **AI DJ** icon in your Chrome toolbar
2. Type a vibe into the prompt box — the more descriptive, the better the results:
   - *"Rainy Sunday lo-fi jazz with a melancholic Tokyo feel"*
   - *"Hype South African amapiano for a road trip"*
   - *"Obscure 90s Britpop B-sides that never got radio play"*
3. Or tap a **preset** (☕ Coffee / 🏋️ Gym / 🚗 Drive) to jump straight in
4. Adjust the **Energy** slider and **Decade** filter to taste
5. Set how many songs you want (default is 20)
6. Add anything to the **🚫 Blacklist** to exclude it from the results
7. Click **▶ Create Playlist**
8. A Google sign-in popup will appear — log in with the account you added as a test user
9. The extension searches YouTube song by song and builds the playlist in real time
10. Done 🎉 — open YouTube and your new private playlist is ready

---

## 📁 Project Structure

```
ai-dj-extension/
│
├── manifest.json          # Chrome extension config, permissions, and OAuth setup
├── popup.html             # Extension UI markup
├── popup.css              # All visual styles
├── popup.js               # Core logic — Gemini API + YouTube Data API
│
├── screenshots/           # UI screenshots referenced in the README
│   ├── ui-main.png
│   └── ui-success.png
│
└── videos/                # Walkthrough recordings referenced in the README
    ├── 01-full-setup.mp4
    ├── 02-gemini-api-key.mp4
    ├── 03-youtube-oauth.mp4
    ├── 04-chrome-load.mp4
    └── 05-features-demo.mp4
```

---

## 🔒 Security & API Keys

> Read this section before pushing to a public GitHub repository.

Your Gemini API key sits in `popup.js` as a plain string. If you push that file to a public repo with the real key inside, it becomes publicly visible and anyone can find and abuse your quota.

**Before pushing to GitHub, choose one of these options:**

**Option A — Replace with a placeholder (simplest):**
Change the key value in `popup.js` to a placeholder before committing:
```js
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
```
Document in your README (as this one does) that users must supply their own key.

**Option B — Exclude popup.js from git entirely:**
Add this line to `.gitignore`:
```
popup.js
```
Then create a `popup.example.js` with the placeholder key, which you *do* commit, so people cloning the repo understand the expected structure.

---

## 🐛 Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| "Login failed" on first run | Your Google account isn't listed as a test user | Cloud Console → OAuth consent screen → Test Users → add your email |
| Playlist created but some songs missing | YouTube search quota exhausted, or unusual song format returned by AI | Reduce song count, or wait and retry — the YouTube API has a daily free quota |
| `Gemini API Error` | Invalid or missing API key | Check the key in `popup.js` and confirm the Generative Language API is enabled in your Cloud project |
| `YouTube blocked playlist creation` | OAuth scope misconfigured | Confirm `https://www.googleapis.com/auth/youtube` is added in both the consent screen scopes and `manifest.json` |
| Extension ID changed | Extension was deleted and re-loaded | The ID resets on each fresh load — update it in Cloud Console → Credentials → your OAuth Client ID |
| Extension not reflecting code changes | Chrome is using a cached version | Go to `chrome://extensions` and click the ↺ refresh icon on the AI DJ card |
| `manifest.json` error on load | JSON syntax error | Validate the file at [jsonlint.com](https://jsonlint.com) — a single missing comma breaks the entire manifest |

---

## 💰 Why This Isn't on the Chrome Web Store

Publishing to the Chrome Web Store requires a one-time $5 developer registration fee — manageable on its own — but the bigger constraint is **API costs at scale**. Making this available to thousands of users publicly would mean thousands of Gemini API calls and YouTube Data API requests every day. That adds up quickly, and there is currently no funding or infrastructure to cover it.

So AI DJ lives here, on GitHub, as a **completely free, self-hosted extension**. You supply your own API keys (both services have generous free tiers for personal use) and run it yourself. No subscription. No paywall. No ads. No data collection.

If funding or sponsorship ever comes through, a proper Chrome Store release with a hosted backend is a real possibility. For now, this is it — and it works exactly as intended.

---

## 🤝 Contributing

Contributions are welcome. If you have ideas, bug fixes, or improvements:

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make and test your changes
4. Commit clearly: `git commit -m "Add: brief description of change"`
5. Push: `git push origin feature/your-feature-name`
6. Open a **Pull Request** describing what you changed and why

### Open ideas worth exploring

- 🌍 Multi-language UI support
- 💾 Save and recall favourite prompts using `chrome.storage`
- 🎨 Theme switcher — light mode, AMOLED black, high contrast
- 📤 Display a clickable link to the finished YouTube playlist on completion
- 🔁 Re-roll individual songs without regenerating the whole list
- 👁️ Preview the AI-generated song list before building the playlist
- 🔒 Backend proxy so the Gemini API key is never exposed in client-side code

---

## 📜 Terms of Use

This extension is **free to use, fork, and modify** under the MIT License.

**One request:** please do not remove the *"Developed by Mbongeni Moyo"* credit from the bottom of the extension UI. That's the only condition. Everything else is yours to do with as you like.

For help with setup, questions, or just to say the extension found you something great:

📧 [mbongenimorey92@gmail.com](mailto:mbongenimorey92@gmail.com)

---

## 📄 License

MIT License — free to use, free to modify, free to distribute. See `LICENSE` for full terms.

---

<div align="center">

Built with 💚 by **Mbongeni Moyo**

*Because your music taste is bigger than the algorithm thinks it is.*

⭐ Star this repo if AI DJ found you something new

</div>