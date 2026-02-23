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

| Main UI | Playlist Generated |
|---|---|
| ![Main UI](screenshots/ui-main.png) | ![Success](screenshots/ui-success.png) |

---

## 🎬 Video Walkthroughs

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

- **Google Chrome** browser
- A **Google Account** (the playlist saves to your YouTube)
- A **Google Cloud Console** account — free at [console.cloud.google.com](https://console.cloud.google.com)

---

## ⚙️ Setup

### Step 1 — Clone the repo and prepare your config files

```bash
git clone https://github.com/MoyoMbongeni/youtube-ai-dj-extension.git
cd youtube-ai-dj-extension
```

Rename the example files to their real names:
```bash
cp popup.example.js popup.js
cp manifest.example.json manifest.json
```

---

### Step 2 — Get Your Gemini API Key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** → **"Create API key in new project"**
4. Copy the generated key — it begins with `AIzaSy...`
5. Open `popup.js` and replace the placeholder at the top:

```js
const GEMINI_API_KEY = 'PASTE_YOUR_KEY_HERE';
```

---

### Step 3 — Set Up YouTube OAuth (Google Cloud Console)

#### 3a — Create a Google Cloud Project

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Click the project dropdown → **"New Project"**
3. Name it `AI DJ Extension` → click **"Create"**
4. Confirm the new project is selected before continuing

#### 3b — Enable the YouTube Data API v3

1. Go to **APIs & Services → Library**
2. Search for **"YouTube Data API v3"** → click **"Enable"**

#### 3c — Configure the OAuth Consent Screen

1. Go to **APIs & Services → OAuth consent screen**
2. Choose **External** → click **"Create"**
3. Fill in your app name (`AI DJ`), support email, and developer contact email
4. Click **"Save and Continue"**
5. On the **Scopes** screen, click **"Add or Remove Scopes"** and add:
   ```
   https://www.googleapis.com/auth/youtube
   ```
6. Click **"Update"** → **"Save and Continue"**
7. On the **Test Users** screen, add your own Google account email
8. Click **"Save and Continue"** → **"Back to Dashboard"**

#### 3d — Create an OAuth Client ID

1. Go to **APIs & Services → Credentials**
2. Click **"+ Create Credentials"** → **"OAuth Client ID"**
3. Application type: **Chrome Extension**
4. Paste your Extension ID (see Step 4 to get this) → click **"Create"**
5. Copy the **Client ID** ending in `.apps.googleusercontent.com`

#### 3e — Add the Client ID to manifest.json

Open `manifest.json` and replace the placeholder:

```json
"oauth2": {
  "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
  "scopes": [
    "https://www.googleapis.com/auth/youtube"
  ]
}
```

---

### Step 4 — Load the Extension into Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **"Developer mode"** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the project folder containing your files
5. Note the **Extension ID** shown under the extension name — use this in Step 3d
6. Click the puzzle piece 🧩 in the Chrome toolbar → pin 📌 **AI DJ**

After any code change, go to `chrome://extensions` and click the **↺ refresh icon** on the AI DJ card.

---

## 🚀 Using the Extension

1. Click the **AI DJ** icon in your Chrome toolbar
2. Type a vibe into the prompt box:
   - *"Rainy Sunday lo-fi jazz with a melancholic Tokyo feel"*
   - *"Hype South African amapiano for a road trip"*
   - *"Obscure 90s Britpop B-sides that never got radio play"*
3. Or pick a preset — ☕ Coffee / 🏋️ Gym / 🚗 Drive
4. Adjust the **Energy** slider and **Decade** filter
5. Set how many songs you want
6. Add anything to **🚫 Blacklist** to exclude it
7. Click **▶ Create Playlist**
8. Sign in with Google when prompted
9. Open YouTube — your new private playlist is ready 🎉

---

## 📁 Project Structure

```
youtube-ai-dj-extension/
│
├── manifest.example.json  # Manifest template — rename to manifest.json and add your Client ID
├── popup.example.js       # JS template — rename to popup.js and add your Gemini API key
├── popup.css              # All styles
├── popup.html             # Extension UI
├── icon.png               # Extension icon
│
├── screenshots/
│   ├── ui-main.png
│   └── ui-success.png
│
└── videos/
    ├── 01-full-setup.mp4
    ├── 02-gemini-api-key.mp4
    ├── 03-youtube-oauth.mp4
    ├── 04-chrome-load.mp4
    └── 05-features-demo.mp4
```

---

## 🐛 Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| "Login failed" on first run | Google account not added as a test user | Cloud Console → OAuth consent screen → Test Users → add your email |
| Playlist created but songs missing | YouTube API quota hit | Reduce song count or retry after a few minutes |
| `Gemini API Error` | Invalid or missing API key | Check the key in `popup.js` |
| `YouTube blocked playlist creation` | OAuth scope misconfigured | Confirm the YouTube scope is in both the consent screen and `manifest.json` |
| Extension ID changed | Extension was deleted and re-loaded | Update the ID in Cloud Console → Credentials |
| Changes not reflecting | Chrome using cached version | Go to `chrome://extensions` and click ↺ refresh on the AI DJ card |
| `manifest.json` error on load | JSON syntax error | Validate at [jsonlint.com](https://jsonlint.com) |

---

## 💰 Why This Isn't on the Chrome Web Store

Publishing to the Chrome Web Store requires a one-time $5 developer fee — manageable on its own — but the bigger constraint is API costs at scale. Making this available to thousands of users publicly would mean thousands of Gemini and YouTube API calls every day. There is currently no infrastructure to cover that.

So AI DJ lives here on GitHub as a completely free, self-hosted extension. You bring your own API keys (both have generous free tiers for personal use) and run it yourself. No subscription. No paywall. No ads. No data collection.

---

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add: description"`
4. Push: `git push origin feature/your-feature-name`
5. Open a **Pull Request**

### Ideas worth exploring

- 💾 Save and recall favourite prompts using `chrome.storage`
- 🎨 Theme switcher — light mode, AMOLED black, high contrast
- 📤 Display a clickable link to the finished playlist on completion
- 🔁 Re-roll individual songs without regenerating the whole list
- 👁️ Preview the AI song list before building the playlist
- 🌍 Multi-language UI support

---

## 📜 Terms of Use

This extension is free to use, fork, and modify.

One request: please do not remove the **"Developed by Mbongeni Moyo"** credit from the bottom of the extension UI. That's the only condition.

For help with setup or any questions: 📧 [mbongenimorey92@gmail.com](mailto:mbongenimorey92@gmail.com)

---

## 📄 License

MIT License — free to use, free to modify, free to distribute.

---

<div align="center">

Built with 💚 by **Mbongeni Moyo**

*Because your music taste is bigger than the algorithm thinks it is.*

⭐ Star this repo if AI DJ found you something new

</div>