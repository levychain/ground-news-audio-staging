const stories = [
  {
    id: "hormuz",
    title: "Trump says Iran was responsible for downing American helicopter and that US must respond",
    source: "Ground News cluster, 118 articles",
    summary:
      "Daniel Harper walks through the reported Apache crash near Hormuz as a news segment about deterrence, diplomacy, and shipping security.",
    duration: "2:45",
    status: "Ready",
    visual: "visual-hormuz",
    label: "Hormuz / U.S.-Iran",
    audio: "assets/audio/hormuz-signal.mp3",
    notes: [
      ["Angle", "Geopolitical escalation"],
      ["Script", "Active news-segment voice"],
      ["Pronunciations", "Hormuz, Tehran, Iran, Apache"],
      ["TTS", "6 spins stitched"]
    ]
  },
  {
    id: "ukraine",
    title: "Zelenskyy praises U.S. attempts to reinvigorate diplomacy on Ukraine war",
    source: "Ground News cluster, 52 articles",
    summary:
      "The host follows a narrow diplomatic opening from Kyiv through Washington, London, Paris, Berlin, and Moscow's reaction.",
    duration: "3:16",
    status: "Ready",
    visual: "visual-ukraine",
    label: "Ukraine / Diplomacy",
    audio: "assets/audio/ukraine-signal.mp3",
    notes: [
      ["Angle", "Diplomatic opening"],
      ["Script", "Dated first-person host"],
      ["Pronunciations", "Zelenskyy, Witkoff, Kyiv"],
      ["TTS", "6 spins stitched"]
    ]
  },
  {
    id: "markets",
    title: "Oil markets watch Hormuz risk after new U.S.-Iran flashpoint",
    source: "Concept queue item",
    summary:
      "A third card shows how the same Ground story can branch into a market-impact angle for a longer daily briefing queue.",
    duration: "2:10 est.",
    status: "Queued",
    visual: "visual-market",
    label: "Markets / Security",
    audio: "",
    notes: [
      ["Angle", "Market and security impact"],
      ["Script", "Draft pending"],
      ["Pronunciations", "Hormuz, Brent, Tehran"],
      ["TTS", "Waiting for spins"]
    ]
  }
];

const pipelineSteps = [
  ["Ground story URL", "The user opens a Ground News story or taps Listen from the feed card."],
  ["Story angle", "NBN selects a narrative angle such as geopolitical stakes, human consequence, or market impact."],
  ["Script draft", "The writer creates a mid-length hosted script with date, host intro, and source-aware caveats."],
  ["Pronunciation map", "Names, places, and acronyms are normalized before audio generation."],
  ["Six-spin TTS", "Audio is generated in short 30-60 second passes to avoid energy drop-off."],
  ["Stitched MP3", "Segments are joined into a stitched MP3, checked, and exposed as an embeddable player inside Ground News."]
];

const storyList = document.querySelector("#storyList");
const queueTimeline = document.querySelector("#queueTimeline");
const pipeline = document.querySelector("#pipeline");
const detailAudio = document.querySelector("#detailAudio");
const miniPlayer = document.querySelector("#miniPlayer");
const miniTitle = document.querySelector("#miniTitle");
const miniOpen = document.querySelector("#miniOpen");
let selectedStory = stories[0];

function renderStories() {
  storyList.innerHTML = stories.map((story) => `
    <article class="story-card">
      <div class="story-top">
        <div class="story-visual ${story.visual}">
          <span class="visual-label">${story.label}</span>
        </div>
        <div>
          <p class="kicker">${story.status} audio · ${story.duration}</p>
          <h3>${story.title}</h3>
          <p class="story-meta">${story.summary}</p>
        </div>
      </div>
      <div class="story-actions">
        <button class="primary-button" type="button" data-listen="${story.id}">Listen</button>
        <button class="secondary-button" type="button" data-open="${story.id}">Open story</button>
      </div>
    </article>
  `).join("");
}

function renderQueue() {
  queueTimeline.innerHTML = stories.map((story, index) => `
    <div class="queue-item">
      <span class="queue-index">${index + 1}</span>
      <div>
        <strong>${story.title}</strong>
        <p class="queue-copy">${story.status} · ${story.duration}</p>
      </div>
      <button class="text-button" type="button" data-open="${story.id}">View</button>
    </div>
  `).join("");
}

function renderPipeline() {
  pipeline.innerHTML = pipelineSteps.map((step, index) => `
    <section class="pipeline-card">
      <div class="pipeline-step">
        <span class="step-number">${index + 1}</span>
        <div>
          <h3>${step[0]}</h3>
          <p class="pipeline-copy">${step[1]}</p>
        </div>
      </div>
    </section>
  `).join("");
}

function setView(viewId) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === viewId);
  });
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === viewId);
  });
}

function openStory(storyId) {
  const story = stories.find((item) => item.id === storyId) || stories[0];
  selectedStory = story;
  document.querySelector("#detailTitle").textContent = story.title;
  document.querySelector("#detailSource").textContent = story.source;
  document.querySelector("#detailSummary").textContent = story.summary;
  document.querySelector("#detailAudioTitle").textContent = `${story.status} · ${story.duration}`;
  const visual = document.querySelector("#detailVisual");
  visual.className = `detail-visual ${story.visual}`;
  visual.innerHTML = `<span class="visual-label">${story.label}</span>`;
  detailAudio.src = story.audio || "";
  detailAudio.toggleAttribute("disabled", !story.audio);
  document.querySelector("#detailNotes").innerHTML = story.notes.map((row) => `
    <div class="note-row"><span>${row[0]}</span><strong>${row[1]}</strong></div>
  `).join("");
  setView("detailView");
}

function listenStory(storyId) {
  const story = stories.find((item) => item.id === storyId) || stories[0];
  openStory(story.id);
  miniTitle.textContent = story.title;
  miniPlayer.classList.add("active");
  if (story.audio) {
    detailAudio.play().catch(() => {});
  }
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const viewId = target.dataset.view;
  const openId = target.dataset.open;
  const listenId = target.dataset.listen;
  if (viewId) setView(viewId);
  if (openId) openStory(openId);
  if (listenId) listenStory(listenId);
});

document.querySelector("#briefingShortcut").addEventListener("click", () => setView("queueView"));
document.querySelector("#playFirstReady").addEventListener("click", () => listenStory("hormuz"));
miniOpen.addEventListener("click", () => openStory(selectedStory.id));

renderStories();
renderQueue();
renderPipeline();
