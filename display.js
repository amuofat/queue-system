import { db, ref, onValue } from "./firebase-config.js";
import { announceNumber } from "./tts-utils.js";

const dispNumber = document.getElementById('disp-number');
const dispCounterAr = document.getElementById('disp-counter-ar');
const dispCounterFr = document.getElementById('disp-counter-fr');
const historyContainer = document.getElementById('history-container');
const connBanner = document.getElementById('conn-banner');

// Connection State
onValue(ref(db, '.info/connected'), (snap) => {
  connBanner.style.display = snap.val() === true ? 'none' : 'block';
});

// Clock
setInterval(() => {
  document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('fr-FR');
}, 1000);

// Listen for Call Events
let lastTimestamp = 0;
onValue(ref(db, 'globalDisplay/nowServing'), (snapshot) => {
  const data = snapshot.val();
  if (data && data.timestamp > lastTimestamp) {
    lastTimestamp = data.timestamp;
    
    // Update UI
    dispNumber.innerText = data.currentNumber;
    dispCounterAr.innerText = data.label_ar;
    dispCounterFr.innerText = data.label_fr;
    
    // Play Alert & Speak
    const alertSound = document.getElementById('audio-alert');
    alertSound.play().catch(e => console.log("Audio play prevented by browser", e));
    alertSound.onended = () => announceNumber(data.currentNumber);
  }
});

// Listen for History
onValue(ref(db, 'callLog'), (snapshot) => {
  const logs = [];
  snapshot.forEach(child => { logs.push(child.val()); });
  logs.sort((a,b) => b.timestamp - a.timestamp);
  
  historyContainer.innerHTML = '';
  // Show last 4 calls, excluding the very latest (which is Now Serving)
  logs.slice(1, 5).forEach(log => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `<span>${log.currentNumber}</span> <span class="ar">${log.label_ar}</span>`;
    historyContainer.appendChild(div);
  });
});

// Fetch and Run News Carousel
async function initCarousel() {
  const container = document.getElementById('carousel-container');
  try {
    const res = await fetch('data/news.json');
    const news = await res.json();
    
    let currentIndex = 0;
    const slides = [];

    news.forEach((item, index) => {
      const slide = document.createElement('div');
      slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
      
      if(item.type === 'image') {
        slide.style.backgroundImage = `url(${item.mediaUrl})`;
      } else if (item.type === 'video') {
        slide.innerHTML = `<video src="${item.mediaUrl}" autoplay muted loop style="width:100%; height:100%; object-fit:cover; position:absolute; z-index:-1;"></video>`;
      }
      
      if(item.title_ar) {
        const textOverlay = document.createElement('div');
        textOverlay.className = 'news-text';
        textOverlay.innerHTML = `
          <h1 class="ar">${item.title_ar}</h1>
          <h1 class="fr" style="font-size:2rem; color:#555;">${item.title_fr}</h1>
          <p class="ar">${item.body_ar || ''}</p>
          <p class="fr">${item.body_fr || ''}</p>
        `;
        slide.appendChild(textOverlay);
      }
      
      container.appendChild(slide);
      slides.push({ element: slide, duration: item.duration || 8000 });
    });

    // Advance Logic
    const advanceSlide = () => {
      if(slides.length <= 1) return;
      slides[currentIndex].element.classList.remove('active');
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].element.classList.add('active');
      setTimeout(advanceSlide, slides[currentIndex].duration);
    };
    
    if(slides.length > 0) setTimeout(advanceSlide, slides[0].duration);

  } catch (error) {
    console.error("Error loading news carousel:", error);
  }
}
initCarousel();