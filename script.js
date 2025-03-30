// ----------------------
// Fullscreen Toggle Functionality
// ----------------------
document.getElementById('fullscreen-btn').addEventListener('click', function() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
});

// ----------------------
// Sound Toggle for Countdown Timer
// ----------------------
let countdownSoundOn = true;
document.getElementById('countdown-sound-toggle').addEventListener('click', function() {
  countdownSoundOn = !countdownSoundOn;
  this.textContent = countdownSoundOn ? "Sound: On" : "Sound: Off";
});

// ----------------------
// Exam Durations Lookup
// ----------------------
const examDurations = {
  "Elementary": { "Reading": 30, "Listening": 20, "Writing": 50 },
  "Pre-Intermediate": { "Reading": 60, "Listening": 35, "Writing": 60 },
  "Intermediate": { "Reading": 75, "Listening": 40, "Writing": 60 },
  "Upper Intermediate": { "Reading": 75, "Listening": 45, "Writing": 75 },
  "Pre-Advanced": { "Reading": 75, "Listening": 50, "Writing": 80 },
  "Advanced": { "Reading": 75, "Listening": 60, "Writing": 90 }
};

// ----------------------
// Analogue Clock Functionality (Regular Mode)
// ----------------------
function updateAnalogue() {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12;
  
  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;
  
  document.getElementById('second').style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
  document.getElementById('minute').style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
  document.getElementById('hour').style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
}

// ----------------------
// Digital Clock Functionality
// ----------------------
function updateDigital() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  
  document.getElementById('digital').textContent = `${hours}:${minutes}:${seconds}`;
}

// ----------------------
// Stopwatch Functionality
// ----------------------
let stopwatchInterval = null;
let stopwatchStartTime = null;
let stopwatchElapsed = 0;
let stopwatchRunning = false;

function updateStopwatchDisplay() {
  const display = document.getElementById('stopwatch-display');
  let elapsed = stopwatchElapsed;
  if (stopwatchRunning) {
    elapsed += Date.now() - stopwatchStartTime;
  }
  
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const ms = Math.floor((elapsed % 1000) / 10);
  
  const mStr = minutes < 10 ? '0' + minutes : minutes;
  const sStr = seconds < 10 ? '0' + seconds : seconds;
  const msStr = ms.toString().padStart(2, '0');
  
  display.textContent = `${mStr}:${sStr}:${msStr}`;
}

function startStopwatch() {
  if (!stopwatchRunning) {
    stopwatchRunning = true;
    stopwatchStartTime = Date.now();
    document.getElementById('stopwatch-start').textContent = 'Pause';
    stopwatchInterval = setInterval(updateStopwatchDisplay, 10);
  } else {
    stopwatchRunning = false;
    stopwatchElapsed += Date.now() - stopwatchStartTime;
    document.getElementById('stopwatch-start').textContent = 'Start';
    clearInterval(stopwatchInterval);
  }
}

function resetStopwatch() {
  stopwatchRunning = false;
  clearInterval(stopwatchInterval);
  stopwatchElapsed = 0;
  document.getElementById('stopwatch-display').textContent = '00:00:00';
  document.getElementById('stopwatch-start').textContent = 'Start';
}

// ----------------------
// Countdown Timer Functionality (HH:MM:SS format)
// ----------------------
let countdownInterval = null;
let countdownRemaining = 0; // in milliseconds
let countdownRunning = false;
let flashInterval = null;

function updateCountdownDisplay() {
  const display = document.getElementById('countdown-display');
  let remaining = countdownRemaining;
  if (remaining < 0) remaining = 0;
  const hours = Math.floor(remaining / 3600000);
  const remainder = remaining % 3600000;
  const minutes = Math.floor(remainder / 60000);
  const seconds = Math.floor((remainder % 60000) / 1000);
  
  const hStr = hours < 10 ? '0' + hours : hours;
  const mStr = minutes < 10 ? '0' + minutes : minutes;
  const sStr = seconds < 10 ? '0' + seconds : seconds;
  
  display.textContent = `${hStr}:${mStr}:${sStr}`;
}

function parseCountdownTime(text) {
  const parts = text.trim().split(':');
  if (parts.length === 2) {
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    if (isNaN(minutes) || isNaN(seconds)) return null;
    return (minutes * 60 + seconds) * 1000;
  } else if (parts.length === 3) {
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  } else {
    return null;
  }
}

function startPauseCountdown() {
  if (!countdownRunning) {
    // Always re-read the current text if no time is stored.
    const inputText = document.getElementById('countdown-display').textContent;
    const parsed = parseCountdownTime(inputText);
    if (parsed === null || parsed <= 0) {
      alert("Please enter a valid time in HH:MM:SS or MM:SS format.");
      return;
    }
    countdownRemaining = parsed;
    countdownRunning = true;
    document.getElementById('countdown-start').textContent = 'Pause';
    document.getElementById('countdown-display').setAttribute('contenteditable', 'false');
    let previousTime = Date.now();
    countdownInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - previousTime;
      previousTime = now;
      countdownRemaining -= elapsed;
      updateCountdownDisplay();
      if (countdownRemaining <= 0) {
        clearInterval(countdownInterval);
        countdownRunning = false;
        document.getElementById('countdown-start').textContent = 'Start';
        countdownRemaining = 0;
        updateCountdownDisplay();
        if (countdownSoundOn) {
          document.getElementById('countdown-sound').play();
        }
        flashCountdown();
      }
    }, 50);
  } else {
    // Pause the countdown and stop flashing if active.
    countdownRunning = false;
    document.getElementById('countdown-start').textContent = 'Start';
    clearInterval(countdownInterval);
    clearInterval(flashInterval);
    document.getElementById('countdown-display').style.visibility = 'visible';
    document.getElementById('countdown-display').setAttribute('contenteditable', 'true');
  }
}

function flashCountdown() {
  clearInterval(flashInterval);
  flashInterval = setInterval(() => {
    const display = document.getElementById('countdown-display');
    display.style.visibility = (display.style.visibility === 'hidden') ? 'visible' : 'hidden';
  }, 200);
}

function resetCountdown() {
  // Stop flashing and countdown interval.
  clearInterval(flashInterval);
  document.getElementById('countdown-display').style.visibility = 'visible';
  countdownRunning = false;
  clearInterval(countdownInterval);
  // Clear stored time so that next start re-reads the display.
  countdownRemaining = 0;
  document.getElementById('countdown-start').textContent = 'Start';
  updateCountdownDisplay();
  document.getElementById('countdown-display').setAttribute('contenteditable', 'true');
}

// ----------------------
// Exam Clock Functionality
// ----------------------
function updateExamClock() {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12;
  
  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;
  
  document.getElementById('exam-second').style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
  document.getElementById('exam-minute').style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
  document.getElementById('exam-hour').style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
}

// ----------------------
// Exam Options Functionality
// ----------------------
function updateExamOptions() {
  const level = document.getElementById('exam-level').value;
  const exam = document.getElementById('exam-type').value;
  const startTimeStr = document.getElementById('exam-start').value.trim();
  
  const duration = examDurations[level][exam] || 0;
  document.getElementById('exam-time').textContent = duration;
  
  let finishStr = '--';
  if (/^\d{1,2}:\d{2}$/.test(startTimeStr)) {
    const [hh, mm] = startTimeStr.split(':').map(n => parseInt(n, 10));
    if (hh >= 0 && hh < 24 && mm >= 0 && mm < 60) {
      const startInMinutes = hh * 60 + mm;
      const finishInMinutes = startInMinutes + duration;
      const finishH = Math.floor(finishInMinutes / 60) % 24;
      const finishM = finishInMinutes % 60;
      const finishHStr = finishH < 10 ? '0' + finishH : finishH;
      const finishMStr = finishM < 10 ? '0' + finishM : finishM;
      finishStr = `${finishHStr}:${finishMStr}`;
    }
  }
  document.getElementById('exam-finish').textContent = finishStr;
}

// ----------------------
// Center Circle Positioning (Regular Analogue Mode)
// ----------------------
function updateCenterPosition() {
  const clockContainer = document.getElementById('clock-container');
  const centerCircle = document.getElementById('center');
  const rect = clockContainer.getBoundingClientRect();
  
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const dpr = window.devicePixelRatio || 1;
  
  centerCircle.style.left = centerX + 'px';
  centerCircle.style.top = centerY + 'px';
  centerCircle.style.transform = `translate(-50%, -50%) scale(${1 / dpr})`;
}

// ----------------------
// Mode Toggle
// ----------------------
function setMode(mode) {
  document.getElementById('analogue').style.display = 'none';
  document.getElementById('digital').style.display = 'none';
  document.getElementById('stopwatch').style.display = 'none';
  document.getElementById('countdown').style.display = 'none';
  document.getElementById('exam').style.display = 'none';
  
  if (mode === 'analogue') {
    document.getElementById('center').style.display = 'block';
    document.getElementById('analogue').style.display = 'block';
  } else {
    document.getElementById('center').style.display = 'none';
  }
  
  if (mode === 'digital') {
    document.getElementById('digital').style.display = 'flex';
  }
  
  if (mode === 'stopwatch') {
    document.getElementById('stopwatch').style.display = 'flex';
  }
  
  if (mode === 'countdown') {
    document.getElementById('countdown').style.display = 'flex';
    document.getElementById('countdown-display').setAttribute('contenteditable', countdownRunning ? 'false' : 'true');
  }
  
  if (mode === 'exam') {
    document.getElementById('exam').style.display = 'flex';
  }
}

// ----------------------
// Initialization & Intervals
// ----------------------
updateAnalogue();
updateDigital();
updateCenterPosition();
updateExamClock();

setInterval(() => {
  updateAnalogue();
  updateDigital();
  updateExamClock();
}, 1000);

// ----------------------
// Event Listeners
// ----------------------
document.getElementById('clock-selector').addEventListener('change', function() {
  setMode(this.value);
});

window.addEventListener('resize', updateCenterPosition);

document.getElementById('stopwatch-start').addEventListener('click', startStopwatch);
document.getElementById('stopwatch-reset').addEventListener('click', resetStopwatch);

document.getElementById('countdown-start').addEventListener('click', startPauseCountdown);
document.getElementById('countdown-reset').addEventListener('click', resetCountdown);

document.getElementById('exam-level').addEventListener('change', updateExamOptions);
document.getElementById('exam-type').addEventListener('change', updateExamOptions);
document.getElementById('exam-start').addEventListener('input', updateExamOptions);

// When the countdown display loses focus, update its stored value.
document.getElementById('countdown-display').addEventListener('blur', function() {
  const inputText = this.textContent.trim();
  const parsed = parseCountdownTime(inputText);
  if (parsed !== null && parsed > 0) {
    countdownRemaining = parsed;
    updateCountdownDisplay();
  }
});

setMode(document.getElementById('clock-selector').value);
