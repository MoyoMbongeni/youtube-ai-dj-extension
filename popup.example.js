const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';

// ─── Cached DOM refs ────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const promptInput   = $('promptInput');
const statusDiv     = $('status');
const energySlider  = $('energySlider');
const energyValue   = $('energyValue');
const decadeSlider  = $('decadeSlider');
const decadeValue   = $('decadeValue');
const songCountInput= $('songCount');
const blacklistInput= $('blacklistInput');
const generateBtn   = $('generateBtn');
const surpriseBtn   = $('surpriseBtn');
const countDown     = $('countDown');
const countUp       = $('countUp');

// ─── Helpers ────────────────────────────────────────────────────────────────
function setStatus(html, type = '') {
  statusDiv.innerHTML = type ? `<span class="${type}">${html}</span>` : html;
}

function getEnergyDesc(val) {
  if (val < 33) return "very mellow, acoustic, low BPM, and relaxing";
  if (val > 66) return "highly energetic, upbeat, fast-paced, and hype";
  return "balanced and mid-tempo";
}

function setGenerating(isGenerating) {
  generateBtn.disabled = isGenerating;
  generateBtn.innerHTML = isGenerating
    ? `<span class="btn-icon">⏳</span> Working...`
    : `<span class="btn-icon">▶</span> Create Playlist`;
}

// ─── Preset buttons ─────────────────────────────────────────────────────────
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    promptInput.value = btn.getAttribute('data-prompt');
    promptInput.focus();
  });
});

// ─── Energy slider ──────────────────────────────────────────────────────────
energySlider.addEventListener('input', () => {
  const v = +energySlider.value;
  energyValue.textContent = v < 33 ? "Mellow" : v > 66 ? "Energetic" : "Balanced";
});

// ─── Decade slider ──────────────────────────────────────────────────────────
decadeSlider.addEventListener('input', () => {
  const v = decadeSlider.value;
  decadeValue.textContent = v == 2030 ? "Any Era" : `${v}s`;
});

// ─── Song count ± buttons ───────────────────────────────────────────────────
countDown.addEventListener('click', () => {
  const v = Math.max(1, (+songCountInput.value || 20) - 1);
  songCountInput.value = v;
});
countUp.addEventListener('click', () => {
  const v = Math.min(50, (+songCountInput.value || 20) + 1);
  songCountInput.value = v;
});

// ─── Surprise button ────────────────────────────────────────────────────────
surpriseBtn.addEventListener('click', () => {
  blacklistInput.value = "";
  promptInput.value = "Surprise me! Give me an incredibly obscure, weird, and eclectic mix of hidden gems that span multiple random genres, regions, continents, cultures, and languages.";
  decadeSlider.value = 2030;
  decadeValue.textContent = "Any Era";
  const rng = Math.floor(Math.random() * 100) + 1;
  energySlider.value = rng;
  energySlider.dispatchEvent(new Event('input'));
  generateBtn.click();
});

// ─── Add to playlist helper (avoids repetition) ────────────────────────────
async function addVideoToPlaylist(token, playlistId, videoId) {
  return fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      snippet: { playlistId, resourceId: { kind: 'youtube#video', videoId } }
    })
  });
}

// ─── Main generate handler ──────────────────────────────────────────────────
generateBtn.addEventListener('click', async () => {
  const promptText = promptInput.value.trim();
  if (!promptText) {
    setStatus("Please tell me what vibe you want first!");
    return;
  }

  setGenerating(true);
  setStatus("AI DJ is crafting your playlist... 🎶");

  try {
    // Build Gemini prompt
    const energyDesc       = getEnergyDesc(+energySlider.value);
    const decadeVal        = decadeSlider.value;
    const decadeInstruction = decadeVal != 2030
      ? `CRITICAL RULE: All songs MUST have been originally released in the ${decadeVal}s decade.`
      : "";
    const blacklistText    = blacklistInput.value.trim();
    const blacklistInstruction = blacklistText
      ? `CRITICAL RULE: Completely exclude the following: ${blacklistText}. DO NOT include any matching artists, genres, or songs.`
      : "";
    const songCount = +songCountInput.value || 20;

    const aiPrompt = `Act as an expert music curator. Based on this request: "${promptText}", generate a creative, catchy 2-to-4 word title for this playlist, and a list of ${songCount} specific song titles and their artists.
The energy level MUST strictly be: ${energyDesc}. ${decadeInstruction} ${blacklistInstruction}
Format your output EXACTLY like this (do not include markdown or numbers):
Title: [Your Creative Name]
Songs: Song 1 by Artist 1, Song 2 by Artist 2, Song 3 by Artist 3 etc`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: aiPrompt }] }] })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Gemini API Error");

    const rawText = data.candidates[0].content.parts[0].text;

    const titleMatch    = rawText.match(/Title:\s*(.*)/i);
    const extractedName = titleMatch ? titleMatch[1].trim().replace(/["*]/g, '') : promptText.substring(0, 20);
    const customTitle   = `My DJ: ${extractedName}`;

    const songsMatch = rawText.match(/Songs:\s*([\s\S]*)/i);
    const songString = songsMatch ? songsMatch[1] : rawText;
    const songArray  = songString.split(',').map(s => s.trim()).filter(Boolean);

    setStatus(`"${customTitle}" ready — logging into YouTube... 🔐`);

    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      if (chrome.runtime.lastError || !token) {
        setStatus(`Login failed: ${chrome.runtime.lastError?.message}`, 'error');
        setGenerating(false);
        return;
      }

      setStatus(`Building "${customTitle}"... 🚧`);

      try {
        // Create playlist
        const plRes = await fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet,status', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            snippet: { title: customTitle, description: "Curated by Mbongeni's AI DJ Extension!" },
            status: { privacyStatus: 'private' }
          })
        });
        const plData = await plRes.json();
        if (!plRes.ok) throw new Error(plData.error?.message || "YouTube blocked playlist creation.");

        const playlistId = plData.id;
        let added = 0;

        for (const song of songArray) {
          setStatus(`Searching ${added + 1}/${songArray.length}: ${song}... 🔍`);

          const srRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(song)}&type=video&maxResults=1`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          const srData = await srRes.json();

          if (srData.items?.length) {
            await addVideoToPlaylist(token, playlistId, srData.items[0].id.videoId);
            added++;
          }
        }

        setStatus(`<strong>🎉 Done!</strong><br>${added} tracks added to "<em>${customTitle}</em>" on YouTube`, 'success');

      } catch (ytErr) {
        setStatus(`YouTube Error: ${ytErr.message}`, 'error');
        console.error(ytErr);
      } finally {
        setGenerating(false);
      }
    });

  } catch (err) {
    setStatus(`Error: ${err.message}`, 'error');
    console.error(err);
    setGenerating(false);
  }
});