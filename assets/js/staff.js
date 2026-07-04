import { db, ref, set, get, onValue, push } from "./firebase-config.js";

const btnNext = document.getElementById('btn-call-next');
const btnManual = document.getElementById('btn-call-manual');
const selectCounter = document.getElementById('counter-select');
const manualInput = document.getElementById('manual-number');
const poolCount = document.getElementById('pool-count');

let currentGlobalMax = 0;
let lastCalledByMe = 0;

// Track total generated tickets
onValue(ref(db, 'dailyCounter/count'), (snapshot) => {
  currentGlobalMax = snapshot.val() || 0;
  poolCount.innerText = currentGlobalMax;
});

async function callNumber(numberToCall) {
  if(!numberToCall) return;
  const counterId = selectCounter.value;
  const opt = selectCounter.options[selectCounter.selectedIndex];
  
  const payload = {
    currentNumber: numberToCall,
    label_ar: opt.getAttribute('data-ar'),
    label_fr: opt.getAttribute('data-fr'),
    timestamp: Date.now()
  };

  // Update current display state
  await set(ref(db, 'globalDisplay/nowServing'), { ...payload, counterId });
  // Add to log
  await push(ref(db, 'callLog'), payload);
  
  lastCalledByMe = numberToCall;
  manualInput.value = '';
}

btnNext.addEventListener('click', () => {
  if(lastCalledByMe < currentGlobalMax) {
    callNumber(lastCalledByMe + 1);
  } else {
    alert("No new tickets in queue!");
  }
});

btnManual.addEventListener('click', () => {
  const val = parseInt(manualInput.value);
  if(val > 0) callNumber(val);
});
