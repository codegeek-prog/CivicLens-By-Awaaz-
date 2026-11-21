// CivicLens - Application Logic & Localized Confirmation

let currentLang = 'en';
let selectedProblemTile = null;
let currentPhotoDataUrl = null;
let activeUtterance = null;
let currentSpeakingBtn = null;
let speechRecognizer = null;
let isListening = false;
let currentAlertText = '';
let currentConfirmationSpeechText = '';

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initSpeakerButtons();
  initTiles();
  initSpeechRecognition();
  initPhotoCapture();
  initLocation();
  initSendAction();
  initTicketsNavigation();
  initConfirmationReadAloud();
  initOfficerDashboard();
  initTracking();
});

/**
 * 1. Language Initialization & Management
 */
function initLanguage() {
  const savedLang = localStorage.getItem('civiclens_lang') || 'en';
  setLanguage(savedLang);

  const langButtons = document.querySelectorAll('.lang-button');
  const chosenPanel = document.getElementById('language-chosen-panel');
  const btnContinue = document.getElementById('btn-continue');
  const btnSwitchLang = document.getElementById('btn-switch-lang');

  langButtons.forEach(button => {
    button.addEventListener('click', () => {
      langButtons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');

      const langCode = button.getAttribute('data-lang');
      setLanguage(langCode);

      if (chosenPanel) {
        chosenPanel.classList.remove('hidden');
      }
    });
  });

  if (btnContinue) {
    btnContinue.addEventListener('click', () => {
      switchView('view-report');
    });
  }

  if (btnSwitchLang) {
    btnSwitchLang.addEventListener('click', () => {
      stopSpeech();
      switchView('view-language');
    });
  }

  const btnRestart = document.getElementById('btn-restart');
  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      resetReportForm();
      switchView('view-report');
    });
  }
}

function setLanguage(langCode) {
  if (!TRANSLATIONS[langCode]) return;
  currentLang = langCode;
  localStorage.setItem('civiclens_lang', langCode);

  const langConfig = TRANSLATIONS[langCode];

  document.documentElement.lang = langCode;
  document.body.className = langConfig.fontClass;

  const activeBtn = document.querySelector(`.lang-button[data-lang="${langCode}"]`);
  if (activeBtn) {
    document.querySelectorAll('.lang-button').forEach(btn => btn.classList.remove('selected'));
    activeBtn.classList.add('selected');
  }

  const pillLabel = document.getElementById('current-lang-pill-label');
  if (pillLabel) {
    pillLabel.textContent = langConfig.nativeName;
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (langConfig[key]) {
      el.textContent = langConfig[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (langConfig[key]) {
      el.setAttribute('placeholder', langConfig[key]);
    }
  });

  if (speechRecognizer) {
    speechRecognizer.lang = langConfig.speechCode;
  }

  const photoLabel = document.getElementById('photo-btn-label');
  if (photoLabel && currentPhotoDataUrl) {
    photoLabel.textContent = langConfig.photoAttached;
  }

  if (currentTrackingTicket) {
    renderTrackResult(currentTrackingTicket);
  }

  hideFriendlyNotice();
  stopSpeech();
}

function switchView(viewId) {
  stopSpeech();
  document.querySelectorAll('.app-view').forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * 2. Problem Icon Tiles
 */
function initTiles() {
  const tiles = document.querySelectorAll('.icon-tile');
  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const isAlreadySelected = tile.classList.contains('selected');
      tiles.forEach(t => {
        t.classList.remove('selected');
        t.setAttribute('aria-checked', 'false');
      });

      if (!isAlreadySelected) {
        tile.classList.add('selected');
        tile.setAttribute('aria-checked', 'true');
        selectedProblemTile = tile.getAttribute('data-problem');
      } else {
        selectedProblemTile = null;
      }

      hideFriendlyNotice();
    });
  });
}

/**
 * 3. Speech-to-Text (Microphone in chosen language)
 */
function initSpeechRecognition() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micBtn = document.getElementById('btn-microphone');
  const textInput = document.getElementById('problem-text-input');
  const micStatus = document.getElementById('mic-status-label');

  if (!SpeechRec) {
    if (micBtn) {
      micBtn.addEventListener('click', () => {
        showFriendlyNotice('micBlockedMsg');
      });
    }
    return;
  }

  speechRecognizer = new SpeechRec();
  speechRecognizer.continuous = false;
  speechRecognizer.interimResults = false;
  speechRecognizer.lang = TRANSLATIONS[currentLang].speechCode;

  speechRecognizer.onstart = () => {
    isListening = true;
    micBtn.classList.add('listening');
    if (micStatus) {
      micStatus.textContent = TRANSLATIONS[currentLang].listeningNotice;
      micStatus.classList.remove('hidden');
    }
  };

  speechRecognizer.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (textInput) {
      if (textInput.value.trim().length > 0) {
        textInput.value += ' ' + transcript;
      } else {
        textInput.value = transcript;
      }
    }
    hideFriendlyNotice();
  };

  speechRecognizer.onerror = (event) => {
    isListening = false;
    micBtn.classList.remove('listening');
    if (micStatus) micStatus.classList.add('hidden');

    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      showFriendlyNotice('micBlockedMsg');
    }
  };

  speechRecognizer.onend = () => {
    isListening = false;
    micBtn.classList.remove('listening');
    if (micStatus) micStatus.classList.add('hidden');
  };

  if (micBtn) {
    micBtn.addEventListener('click', () => {
      if (isListening) {
        speechRecognizer.stop();
      } else {
        speechRecognizer.lang = TRANSLATIONS[currentLang].speechCode;
        try {
          speechRecognizer.start();
        } catch (e) {
          showFriendlyNotice('micBlockedMsg');
        }
      }
    });
  }
}

/**
 * 4. Photo Button, File Input & Preview with Client-Side Compression
 */
function initPhotoCapture() {
  const btnPhoto = document.getElementById('btn-photo');
  const fileInput = document.getElementById('photo-file-input');
  const previewWrap = document.getElementById('photo-preview-wrap');
  const previewImg = document.getElementById('photo-preview-img');
  const btnRemove = document.getElementById('btn-remove-photo');
  const photoLabel = document.getElementById('photo-btn-label');

  function compressImage(file, maxDimension, quality, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        callback(compressedDataUrl);
      };
      img.onerror = () => callback(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => showFriendlyNotice('cameraBlockedMsg');
    reader.readAsDataURL(file);
  }

  if (btnPhoto && fileInput) {
    btnPhoto.addEventListener('click', () => {
      try {
        fileInput.click();
      } catch (err) {
        showFriendlyNotice('cameraBlockedMsg');
      }
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        compressImage(file, 800, 0.75, (compressedUrl) => {
          currentPhotoDataUrl = compressedUrl;
          if (previewImg) previewImg.src = currentPhotoDataUrl;
          if (previewWrap) previewWrap.classList.remove('hidden');
          if (photoLabel) photoLabel.textContent = TRANSLATIONS[currentLang].photoAttached;
          hideFriendlyNotice();
        });
      }
    });
  }

  if (btnRemove) {
    btnRemove.addEventListener('click', () => {
      currentPhotoDataUrl = null;
      if (fileInput) fileInput.value = '';
      if (previewWrap) previewWrap.classList.add('hidden');
      if (photoLabel) photoLabel.textContent = TRANSLATIONS[currentLang].photoBtn;
    });
  }
}

/**
 * 5. Use My Location or Landmark Input
 */
function initLocation() {
  const btnLocation = document.getElementById('btn-location');
  const locationLabel = document.getElementById('location-btn-label');
  const landmarkInput = document.getElementById('landmark-input');

  if (btnLocation) {
    btnLocation.addEventListener('click', () => {
      if (!navigator.geolocation) {
        showFriendlyNotice('locationBlockedMsg');
        if (landmarkInput) landmarkInput.focus();
        return;
      }

      const langConfig = TRANSLATIONS[currentLang];
      if (locationLabel) locationLabel.textContent = langConfig.locationDetecting;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lon = position.coords.longitude.toFixed(4);
          const locationDesc = `Lat ${lat}, Long ${lon} (GPS)`;
          
          if (landmarkInput) {
            landmarkInput.value = locationDesc;
          }
          if (locationLabel) locationLabel.textContent = langConfig.locationBtn;
          btnLocation.classList.add('active');
          hideFriendlyNotice();
        },
        (error) => {
          if (locationLabel) locationLabel.textContent = langConfig.locationBtn;
          btnLocation.classList.remove('active');
          showFriendlyNotice('locationBlockedMsg');
          if (landmarkInput) landmarkInput.focus();
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }
}

/**
 * 6. Send Button & Short Localized Confirmation
 */
function initSendAction() {
  const btnSend = document.getElementById('btn-send-report');
  const btnSpinner = document.getElementById('send-spinner');
  const btnLabel = document.getElementById('send-btn-label');
  const textInput = document.getElementById('problem-text-input');
  const landmarkInput = document.getElementById('landmark-input');

  if (btnSend) {
    btnSend.addEventListener('click', async () => {
      const hasTile = !!selectedProblemTile;
      const hasText = textInput && textInput.value.trim().length > 0;
      const hasPhoto = !!currentPhotoDataUrl;

      // Friendly validation in citizen's language
      if (!hasTile && !hasText && !hasPhoto) {
        showFriendlyNotice('selectTilePrompt');
        return;
      }

      if (!hasText && !hasPhoto) {
        showFriendlyNotice('emptyInputPrompt');
        return;
      }

      const originalText = textInput ? textInput.value.trim() : '';
      const locationText = landmarkInput ? landmarkInput.value.trim() : '';
      const categoryKey = selectedProblemTile || 'roads';

      // Loading state with spinner
      btnSend.disabled = true;
      if (btnSpinner) btnSpinner.classList.remove('hidden');
      if (btnLabel) btnLabel.textContent = TRANSLATIONS[currentLang].sendingBtn;
      btnSend.style.opacity = '0.85';

      try {
        const ticket = await Promise.race([
          CivicLensStorage.saveTicket({
            originalText: originalText,
            languageCode: currentLang,
            categoryKey: categoryKey,
            locationText: locationText,
            photoDataUrl: currentPhotoDataUrl
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Triage timeout fallback')), 3000))
        ]);

        // Populate the short confirmation screen in citizen's language
        populateConfirmationScreen(ticket);
        switchView('view-success');
      } catch (err) {
        console.warn('[CivicLens] Fast-path triage activation:', err.message);
        // Fallback: create and display ticket immediately without buffering
        const fallbackTicket = {
          id: `CL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          original_text: originalText,
          language_code: currentLang,
          english_translation: originalText || `${categoryKey} reported by resident.`,
          category: categoryKey,
          severity: 'Medium',
          severity_reason: 'Ordinary municipal repair request.',
          department: CivicLensStorage.getDepartmentForCategory(categoryKey),
          location: locationText || 'Location not provided',
          photo: currentPhotoDataUrl,
          duplicate_count: 1,
          status: 'Received',
          time: new Date().toISOString()
        };
        CivicLensStorage.saveToLocalTickets(fallbackTicket);
        populateConfirmationScreen(fallbackTicket);
        switchView('view-success');
      } finally {
        btnSend.disabled = false;
        if (btnSpinner) btnSpinner.classList.add('hidden');
        if (btnLabel) btnLabel.textContent = TRANSLATIONS[currentLang].sendBtn;
        btnSend.style.opacity = '1';
      }
    });
  }
}

/**
 * Populate Short Confirmation in Citizen's Language
 * Required elements:
 * 1. Ticket number
 * 2. Issue type (in citizen's language)
 * 3. The department that received it (in citizen's language)
 * 4. Urgency (colour plus icon)
 * 5. For Critical tickets: safety warning in their language & emergency 112
 * 6. Read-aloud button
 */
function populateConfirmationScreen(ticket) {
  const langConfig = TRANSLATIONS[currentLang];

  // 1. Ticket number
  document.getElementById('conf-ticket-num').textContent = ticket.id;

  // 2. Issue type in citizen's language
  const issueKeyMap = {
    roads: 'tileRoad',
    waste: 'tileGarbage',
    water: 'tileWater',
    electricity: 'tileElectricity',
    trees: 'tileTree',
    drainage: 'tileDrain'
  };
  const issueKey = issueKeyMap[ticket.category] || 'tileRoad';
  const localizedIssue = langConfig[issueKey] || ticket.category;
  document.getElementById('conf-issue-type').textContent = localizedIssue;

  // 3. Department that received it in citizen's language
  const deptKeyMap = {
    "Roads & Buildings": "deptRoads",
    "Sanitation": "deptWaste",
    "Water Board": "deptWater",
    "Electricity Department": "deptElectricity",
    "Parks & Gardens": "deptTrees",
    "Drainage Department": "deptDrainage"
  };
  const deptKey = deptKeyMap[ticket.department] || "deptRoads";
  const localizedDept = langConfig[deptKey] || ticket.department;
  document.getElementById('conf-department').textContent = localizedDept;

  // 4. Urgency (Colour plus line icon)
  const urgencyBadge = document.getElementById('conf-urgency-badge');
  const urgencyIconWrap = document.getElementById('conf-urgency-icon-wrap');
  const urgencyText = document.getElementById('conf-urgency-text');

  urgencyBadge.className = 'urgency-badge-with-icon';

  let urgencyIconSvg = '';
  let localizedUrgency = '';

  if (ticket.severity === 'Critical') {
    urgencyBadge.classList.add('urgency-critical');
    localizedUrgency = langConfig.urgencyCritical || "Critical";
    urgencyIconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    `;
  } else if (ticket.severity === 'High') {
    urgencyBadge.classList.add('urgency-high');
    localizedUrgency = langConfig.urgencyHigh || "High";
    urgencyIconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    `;
  } else if (ticket.severity === 'Medium') {
    urgencyBadge.classList.add('urgency-medium');
    localizedUrgency = langConfig.urgencyMedium || "Medium";
    urgencyIconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>
    `;
  } else {
    urgencyBadge.classList.add('urgency-low');
    localizedUrgency = langConfig.urgencyLow || "Low";
    urgencyIconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;
  }

  urgencyIconWrap.innerHTML = urgencyIconSvg;
  urgencyText.textContent = localizedUrgency;

  // Duplicate merging info
  const dupBadge = document.getElementById('conf-duplicate-badge');
  const dupText = document.getElementById('conf-duplicate-count-text');
  if (ticket.duplicate_count && ticket.duplicate_count > 1) {
    if (dupBadge) dupBadge.classList.remove('hidden');
    const msg = (langConfig.peopleReportedTemplate || '{count} people reported this')
      .replace('{count}', ticket.duplicate_count);
    if (dupText) dupText.textContent = msg;
  } else {
    if (dupBadge) dupBadge.classList.add('hidden');
  }

  // Track button on confirmation view
  const btnTrackThis = document.getElementById('btn-track-this-ticket');
  if (btnTrackThis) {
    btnTrackThis.onclick = () => {
      openTrackViewWithTicket(ticket.id);
    };
  }

  // 5. Critical Safety Warning Card
  const criticalCard = document.getElementById('critical-safety-card');
  const isCritical = ticket.severity === 'Critical';

  if (isCritical) {
    criticalCard.classList.remove('hidden');
    document.getElementById('safety-warning-text').textContent = langConfig.criticalWarningText;
  } else {
    criticalCard.classList.add('hidden');
  }

  // 6. Build speech summary in citizen's language for read-aloud button
  currentConfirmationSpeechText = `${langConfig.confirmationTitle}. ` +
    `${langConfig.confTicketNumber}: ${ticket.id}. ` +
    `${langConfig.confIssueType}: ${localizedIssue}. ` +
    `${langConfig.confDepartment}: ${localizedDept}. ` +
    `${langConfig.confUrgency}: ${localizedUrgency}.`;

  if (ticket.duplicate_count && ticket.duplicate_count > 1) {
    const dupSpeech = (langConfig.peopleReportedTemplate || '{count} people reported this')
      .replace('{count}', ticket.duplicate_count);
    currentConfirmationSpeechText += ` ${dupSpeech}.`;
  }

  if (isCritical) {
    currentConfirmationSpeechText += ` ${langConfig.criticalWarningHeading}. ${langConfig.criticalWarningText}`;
  }
}

/**
 * Read-Aloud Button for Confirmation
 */
function initConfirmationReadAloud() {
  const readBtn = document.getElementById('btn-read-aloud-conf');
  if (readBtn) {
    readBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!currentConfirmationSpeechText) return;

      if (currentSpeakingBtn === readBtn && window.speechSynthesis.speaking) {
        stopSpeech();
        return;
      }

      speakMessage(currentConfirmationSpeechText, readBtn);
    });
  }
}

/**
 * 7. Saved Tickets View & Navigation
 */
function initTicketsNavigation() {
  const btnViewHeader = document.getElementById('btn-view-tickets-header');
  const btnViewSuccess = document.getElementById('btn-view-all-tickets');
  const btnBack = document.getElementById('btn-back-to-report');

  if (btnViewHeader) {
    btnViewHeader.addEventListener('click', () => {
      renderTicketsList();
      switchView('view-tickets');
    });
  }

  if (btnViewSuccess) {
    btnViewSuccess.addEventListener('click', () => {
      renderTicketsList();
      switchView('view-tickets');
    });
  }

  if (btnBack) {
    btnBack.addEventListener('click', () => {
      switchView('view-report');
    });
  }
}

async function renderTicketsList() {
  const container = document.getElementById('tickets-list-container');
  if (!container) return;

  const langConfig = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Calm loading indicator
  container.innerHTML = `
    <div class="empty-state-card">
      <div class="btn-spinner" style="width:28px; height:28px; border-color: rgba(43,63,54,0.25); border-top-color: var(--color-forest); margin-bottom: 12px; margin-right: 0;"></div>
      <p style="color: var(--color-mid-green); font-size: 15px;">${langConfig.loadingTickets || 'Loading complaints...'}</p>
    </div>
  `;

  const tickets = await CivicLensStorage.loadTickets();

  // Localized empty state card
  if (!tickets || !tickets.length) {
    container.innerHTML = `
      <div class="empty-state-card">
        <div class="empty-state-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <h4 class="empty-state-title">${langConfig.noTicketsTitle || 'No complaints yet'}</h4>
        <p class="empty-state-text">${langConfig.noTicketsMsg || 'No tickets saved yet. Submit a problem to see it here.'}</p>
        <button type="button" class="empty-state-action" id="btn-empty-report">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>${langConfig.reportScreenTitle || 'Report a problem'}</span>
        </button>
      </div>
    `;
    const btnEmptyReport = container.querySelector('#btn-empty-report');
    if (btnEmptyReport) {
      btnEmptyReport.addEventListener('click', () => switchView('view-report'));
    }
    return;
  }

  const issueKeyMap = {
    roads: 'tileRoad',
    waste: 'tileGarbage',
    water: 'tileWater',
    electricity: 'tileElectricity',
    trees: 'tileTree',
    drainage: 'tileDrain'
  };

  const deptKeyMap = {
    "Roads & Buildings": "deptRoads",
    "Sanitation": "deptWaste",
    "Water Board": "deptWater",
    "Electricity Department": "deptElectricity",
    "Parks & Gardens": "deptTrees",
    "Drainage Department": "deptDrainage"
  };

  container.innerHTML = '';
  tickets.forEach(ticket => {
    const card = document.createElement('div');
    card.className = 'ticket-card';

    const issueKey = issueKeyMap[ticket.category] || 'tileRoad';
    const localizedIssue = TRANSLATIONS[currentLang][issueKey] || ticket.category;
    const deptKey = deptKeyMap[ticket.department] || "deptRoads";
    const localizedDept = TRANSLATIONS[currentLang][deptKey] || ticket.department;
    const timeFormatted = new Date(ticket.time).toLocaleDateString() + ' ' + new Date(ticket.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let sevClass = 'urgency-low';
    let localizedUrgency = TRANSLATIONS[currentLang].urgencyLow;
    if (ticket.severity === 'Critical') {
      sevClass = 'urgency-critical';
      localizedUrgency = TRANSLATIONS[currentLang].urgencyCritical;
    } else if (ticket.severity === 'High') {
      sevClass = 'urgency-high';
      localizedUrgency = TRANSLATIONS[currentLang].urgencyHigh;
    } else if (ticket.severity === 'Medium') {
      sevClass = 'urgency-medium';
      localizedUrgency = TRANSLATIONS[currentLang].urgencyMedium;
    }

    let criticalNoticeHtml = '';
    if (ticket.severity === 'Critical') {
      criticalNoticeHtml = `
        <div style="font-size:12px; color:var(--color-sev-critical); background:rgba(163,57,43,0.06); padding:8px 10px; border-radius:8px; border:1px solid var(--color-sev-critical);">
          <strong>${TRANSLATIONS[currentLang].criticalWarningHeading}:</strong> ${TRANSLATIONS[currentLang].criticalWarningText}
        </div>
      `;
    }

    card.innerHTML = `
      <div class="ticket-card-header">
        <span class="ticket-id font-mono">${ticket.id}</span>
        <span class="status-tag">${ticket.status}</span>
      </div>

      <div class="ticket-card-meta">
        <span class="ticket-cat-label">${localizedIssue}</span>
        <span class="urgency-badge-with-icon ${sevClass}" style="padding:2px 8px; font-size:12px;">${localizedUrgency}</span>
      </div>

      <!-- Department -->
      <div class="ticket-dept-banner">
        <strong>${TRANSLATIONS[currentLang].confDepartment}:</strong> ${localizedDept}
      </div>

      <div class="ticket-trans-box">
        <strong>${TRANSLATIONS[currentLang].fieldTranslation}:</strong><br>
        ${ticket.english_translation}
      </div>

      ${criticalNoticeHtml}

      <div class="ticket-subinfo">
        <div><strong>${TRANSLATIONS[currentLang].fieldLocation}:</strong> ${ticket.location}</div>
        <div><strong>${TRANSLATIONS[currentLang].fieldDuplicates}:</strong> ${ticket.duplicate_count}</div>
      </div>

      <div class="ticket-footer-row">
        <span style="font-size: 12px; color: var(--color-mid-green);">${timeFormatted}</span>
        <button type="button" class="speaker-btn speaker-btn-sm" aria-label="Listen to ticket" title="Listen">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </button>
      </div>
    `;

    const speakBtn = card.querySelector('.speaker-btn');
    if (speakBtn) {
      speakBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let cardSpeech = `${localizedIssue}. ${TRANSLATIONS[currentLang].confDepartment}: ${localizedDept}. ${localizedUrgency}. ${ticket.english_translation}.`;
        if (ticket.severity === 'Critical') {
          cardSpeech += ` ${TRANSLATIONS[currentLang].criticalWarningHeading}. ${TRANSLATIONS[currentLang].criticalWarningText}`;
        }
        speakMessage(cardSpeech, speakBtn);
      });
    }

    container.appendChild(card);
  });
}

function resetReportForm() {
  selectedProblemTile = null;
  currentPhotoDataUrl = null;

  document.querySelectorAll('.icon-tile').forEach(t => {
    t.classList.remove('selected');
    t.setAttribute('aria-checked', 'false');
  });

  const textInput = document.getElementById('problem-text-input');
  if (textInput) textInput.value = '';

  const landmarkInput = document.getElementById('landmark-input');
  if (landmarkInput) landmarkInput.value = '';

  const fileInput = document.getElementById('photo-file-input');
  if (fileInput) fileInput.value = '';

  const previewWrap = document.getElementById('photo-preview-wrap');
  if (previewWrap) previewWrap.classList.add('hidden');

  const photoLabel = document.getElementById('photo-btn-label');
  if (photoLabel) photoLabel.textContent = TRANSLATIONS[currentLang].photoBtn;

  const btnLocation = document.getElementById('btn-location');
  if (btnLocation) btnLocation.classList.remove('active');

  hideFriendlyNotice();
}

/**
 * 8. Friendly Notice (Blocked Permissions) in Chosen Language
 */
function showFriendlyNotice(translationKey) {
  const alertBox = document.getElementById('friendly-alert');
  const alertText = document.getElementById('friendly-alert-text');
  const msg = TRANSLATIONS[currentLang] ? TRANSLATIONS[currentLang][translationKey] : '';

  if (alertBox && alertText && msg) {
    currentAlertText = msg;
    alertText.textContent = msg;
    alertBox.classList.remove('hidden');
  }
}

function hideFriendlyNotice() {
  const alertBox = document.getElementById('friendly-alert');
  if (alertBox) {
    alertBox.classList.add('hidden');
  }
  currentAlertText = '';
}

/**
 * 9. Speaker Buttons (Read-aloud in chosen language)
 */
function initSpeakerButtons() {
  document.querySelectorAll('.speaker-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();

      if (button.id === 'btn-speech-alert') {
        if (!currentAlertText) return;
        if (currentSpeakingBtn === button && window.speechSynthesis.speaking) {
          stopSpeech();
          return;
        }
        speakMessage(currentAlertText, button);
        return;
      }

      if (button.id === 'btn-read-aloud-conf') {
        // Handled in initConfirmationReadAloud
        return;
      }

      const ttsKey = button.getAttribute('data-tts');
      const textToSpeak = TRANSLATIONS[currentLang] ? TRANSLATIONS[currentLang][ttsKey] : '';

      if (!textToSpeak) return;

      if (currentSpeakingBtn === button && window.speechSynthesis.speaking) {
        stopSpeech();
        return;
      }

      speakMessage(textToSpeak, button);
    });
  });
}

function speakMessage(text, buttonElement) {
  if (!('speechSynthesis' in window)) return;

  stopSpeech();

  const langConfig = TRANSLATIONS[currentLang] || TRANSLATIONS['en'];
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langConfig.speechCode;
  utterance.rate = 0.92;

  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang === utterance.lang || v.lang.startsWith(currentLang));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  buttonElement.classList.add('speaking');
  currentSpeakingBtn = buttonElement;
  activeUtterance = utterance;

  utterance.onend = () => {
    cleanupSpeakerButton();
  };

  utterance.onerror = () => {
    cleanupSpeakerButton();
  };

  window.speechSynthesis.speak(utterance);
}

function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  cleanupSpeakerButton();
}

function cleanupSpeakerButton() {
  if (currentSpeakingBtn) {
    currentSpeakingBtn.classList.remove('speaking');
    currentSpeakingBtn = null;
  }
  activeUtterance = null;
}

/**
 * ================= OFFICER DASHBOARD (ENGLISH) =================
 * Priority sorted (Critical, High, Medium, Low, then newest first)
 * Thin severity stripe, reason, department, category, location, and status dropdown.
 * Accordion row opens to show original complaint and English translation.
 */

let cachedOfficerTickets = [];

function initOfficerDashboard() {
  const btnOfficerWelcome = document.getElementById('btn-officer-nav-welcome');
  const btnOfficerReport = document.getElementById('btn-officer-nav-report');
  const btnOfficerSuccess = document.getElementById('btn-officer-nav-success');
  const btnOfficerTickets = document.getElementById('btn-officer-nav-tickets');
  const btnBackToCitizen = document.getElementById('btn-back-to-citizen');
  const btnRefresh = document.getElementById('btn-officer-refresh');

  const filterDept = document.getElementById('officer-filter-dept');
  const filterSev = document.getElementById('officer-filter-sev');

  function openOfficerPortal() {
    switchView('view-officer');
    loadAndRenderOfficerDashboard();
  }

  if (btnOfficerWelcome) btnOfficerWelcome.addEventListener('click', openOfficerPortal);
  if (btnOfficerReport) btnOfficerReport.addEventListener('click', openOfficerPortal);
  if (btnOfficerSuccess) btnOfficerSuccess.addEventListener('click', openOfficerPortal);
  if (btnOfficerTickets) btnOfficerTickets.addEventListener('click', openOfficerPortal);

  if (btnBackToCitizen) {
    btnBackToCitizen.addEventListener('click', () => {
      switchView('view-report');
    });
  }

  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      loadAndRenderOfficerDashboard();
    });
  }

  if (filterDept) {
    filterDept.addEventListener('change', () => {
      renderOfficerList();
    });
  }

  if (filterSev) {
    filterSev.addEventListener('change', () => {
      renderOfficerList();
    });
  }
}

async function loadAndRenderOfficerDashboard() {
  const container = document.getElementById('officer-tickets-container');
  if (container) {
    container.innerHTML = `
      <div class="empty-state-card">
        <div class="btn-spinner" style="width:28px; height:28px; border-color: rgba(43,63,54,0.25); border-top-color: var(--color-forest); margin-bottom: 12px; margin-right: 0;"></div>
        <p style="color: var(--color-mid-green); font-size: 15px;">Loading officer tickets...</p>
      </div>
    `;
  }

  try {
    cachedOfficerTickets = await window.CivicLensStorage.loadTickets();
  } catch (err) {
    cachedOfficerTickets = window.CivicLensStorage.getTickets();
  }

  renderOfficerList();
}

function renderOfficerList() {
  const container = document.getElementById('officer-tickets-container');
  if (!container) return;

  const tickets = cachedOfficerTickets || [];

  // 1. Calculate & display counts by severity across all tickets
  let critCount = 0;
  let highCount = 0;
  let medCount = 0;
  let lowCount = 0;

  tickets.forEach(t => {
    const sev = t.severity || 'Medium';
    if (sev === 'Critical') critCount++;
    else if (sev === 'High') highCount++;
    else if (sev === 'Medium') medCount++;
    else if (sev === 'Low') lowCount++;
  });

  const countCritEl = document.getElementById('officer-count-crit');
  const countHighEl = document.getElementById('officer-count-high');
  const countMedEl = document.getElementById('officer-count-med');
  const countLowEl = document.getElementById('officer-count-low');
  const countTotalEl = document.getElementById('officer-count-total');

  if (countCritEl) countCritEl.textContent = critCount;
  if (countHighEl) countHighEl.textContent = highCount;
  if (countMedEl) countMedEl.textContent = medCount;
  if (countLowEl) countLowEl.textContent = lowCount;
  if (countTotalEl) countTotalEl.textContent = tickets.length;

  // 2. Apply Filters
  const filterDept = document.getElementById('officer-filter-dept')?.value || 'ALL';
  const filterSev = document.getElementById('officer-filter-sev')?.value || 'ALL';

  let filtered = tickets.filter(t => {
    const matchDept = (filterDept === 'ALL' || t.department === filterDept);
    const matchSev = (filterSev === 'ALL' || t.severity === filterSev);
    return matchDept && matchSev;
  });

  // 3. Sort by priority: Critical, High, Medium, Low, then newest first
  filtered = window.CivicLensStorage.sortTicketsByPriority(filtered);

  if (!filtered.length) {
    container.innerHTML = `
      <div class="empty-state-card">
        <div class="empty-state-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h4 class="empty-state-title">No matching complaints</h4>
        <p class="empty-state-text">No tickets match the selected department and severity filters.</p>
        <button type="button" class="empty-state-action" id="btn-officer-reset-filters">
          <span>Reset Filters</span>
        </button>
      </div>
    `;
    const btnReset = container.querySelector('#btn-officer-reset-filters');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        const fDept = document.getElementById('officer-filter-dept');
        const fSev = document.getElementById('officer-filter-sev');
        if (fDept) fDept.value = 'ALL';
        if (fSev) fSev.value = 'ALL';
        renderOfficerList();
      });
    }
    return;
  }

  container.innerHTML = '';

  filtered.forEach(ticket => {
    const sev = ticket.severity || 'Medium';
    const stripeClass = `stripe-${sev.toLowerCase()}`;
    const normalizedStatus = (ticket.status === 'Submitted') ? 'Received' : (ticket.status || 'Received');

    const row = document.createElement('article');
    row.className = 'officer-ticket-row';
    row.setAttribute('data-ticket-id', ticket.id);

    const formattedDate = ticket.time
      ? new Date(ticket.time).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      : 'Recently';

    const statusClass = `status-${normalizedStatus.toLowerCase().replace(/\s+/g, '-')}`;

    row.innerHTML = `
      <div class="severity-stripe ${stripeClass}"></div>
      
      <div class="officer-row-main">
        <div class="officer-row-meta">
          <div class="officer-row-ids">
            <span class="officer-ticket-id font-mono">${escapeHtml(ticket.id)}</span>
            <span class="officer-cat-pill">${escapeHtml(ticket.category || 'Issue')}</span>
            <span class="officer-dept-tag">${escapeHtml(ticket.department || 'Roads & Buildings')}</span>
          </div>

          <div class="officer-status-wrapper" onclick="event.stopPropagation()">
            <label class="sr-only" for="status-${ticket.id}">Status</label>
            <select id="status-${ticket.id}" class="officer-status-select ${statusClass}" data-ticket-id="${ticket.id}">
              <option value="Received" ${normalizedStatus === 'Received' ? 'selected' : ''}>Received</option>
              <option value="Assigned" ${normalizedStatus === 'Assigned' ? 'selected' : ''}>Assigned</option>
              <option value="In progress" ${normalizedStatus === 'In progress' ? 'selected' : ''}>In progress</option>
              <option value="Fixed" ${normalizedStatus === 'Fixed' ? 'selected' : ''}>Fixed</option>
            </select>
          </div>
        </div>

        <div class="officer-row-reason">
          ${escapeHtml(ticket.severity_reason || 'Standard municipal resolution required.')}
        </div>

        <div class="officer-row-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>${escapeHtml(ticket.location || 'Location not specified')}</span>
        </div>

        <div class="officer-expand-hint">
          <span class="expand-text">Click to view complaint & translation</span>
          <svg class="expand-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      <div class="officer-row-expanded hidden">
        <div class="complaint-comparison">
          <div class="complaint-box">
            <div class="complaint-label">Original Complaint (${escapeHtml(ticket.language || 'Local')})</div>
            <div class="complaint-text">${escapeHtml(ticket.original_text || 'No text provided.')}</div>
          </div>
          <div class="complaint-box highlight-translation">
            <div class="complaint-label">English Translation</div>
            <div class="complaint-text">${escapeHtml(ticket.english_translation || 'No translation available.')}</div>
          </div>
        </div>

        ${ticket.photo ? `
          <div style="margin-top: 8px;">
            <div class="complaint-label">Resident Photo Evidence</div>
            <img src="${ticket.photo}" alt="Complaint photo" class="officer-photo-thumb">
          </div>
        ` : ''}

        ${ticket.unclear_notes ? `
          <div class="officer-unclear-note">
            <strong>Triage Note:</strong> ${escapeHtml(ticket.unclear_notes)}
          </div>
        ` : ''}

        <div class="officer-details-footer">
          <div>Reported: <span>${formattedDate}</span></div>
          <div>Duplicates: <span>${ticket.duplicate_count || 0}</span></div>
          <div>Severity: <strong style="color: var(--sev-${sev.toLowerCase().slice(0,4)})">${sev}</strong></div>
        </div>
      </div>
    `;

    // Row click toggle
    row.addEventListener('click', (e) => {
      if (e.target.closest('.officer-status-wrapper')) return;
      row.classList.toggle('is-expanded');
      const drawer = row.querySelector('.officer-row-expanded');
      if (drawer) {
        drawer.classList.toggle('hidden');
      }
    });

    // Status select change
    const statusSelect = row.querySelector('.officer-status-select');
    if (statusSelect) {
      statusSelect.addEventListener('change', async (e) => {
        e.stopPropagation();
        const newStatus = e.target.value;
        ticket.status = newStatus;
        
        statusSelect.className = `officer-status-select status-${newStatus.toLowerCase().replace(/\s+/g, '-')}`;

        await window.CivicLensStorage.updateTicketStatus(ticket.id, newStatus);
      });
    }

    container.appendChild(row);
  });
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * ================= VIEW 5: TRACK MY COMPLAINT =================
 * 4 steps: Received, Assigned, In progress, Fixed in citizen's language
 * Updates in real time when officer changes status.
 */

let currentTrackingSubscription = null;
let currentTrackingTicket = null;
let trackingSpeechText = '';

function initTracking() {
  const btnTrackLang = document.getElementById('btn-track-nav-lang');
  const btnTrackReport = document.getElementById('btn-track-nav-report');
  const btnTrackTickets = document.getElementById('btn-track-nav-tickets');
  const btnBackFromTrack = document.getElementById('btn-back-from-track');
  const trackForm = document.getElementById('track-form');
  const btnSubmitTrack = document.getElementById('btn-submit-track');
  const btnSpeakTrack = document.getElementById('btn-speak-track-screen');

  function openTrackView() {
    switchView('view-track');
  }

  if (btnTrackLang) btnTrackLang.addEventListener('click', openTrackView);
  if (btnTrackReport) btnTrackReport.addEventListener('click', openTrackView);
  if (btnTrackTickets) btnTrackTickets.addEventListener('click', openTrackView);

  if (btnBackFromTrack) {
    btnBackFromTrack.addEventListener('click', () => {
      if (currentTrackingSubscription) {
        currentTrackingSubscription();
        currentTrackingSubscription = null;
      }
      switchView('view-report');
    });
  }

  if (trackForm) {
    trackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('track-ticket-input');
      const val = input ? input.value.trim() : '';
      if (val) {
        trackComplaintById(val);
      }
    });
  }

  if (btnSubmitTrack) {
    btnSubmitTrack.addEventListener('click', () => {
      const input = document.getElementById('track-ticket-input');
      const val = input ? input.value.trim() : '';
      if (val) {
        trackComplaintById(val);
      }
    });
  }

  if (btnSpeakTrack) {
    btnSpeakTrack.addEventListener('click', () => {
      if (!trackingSpeechText) return;
      if (currentSpeakingBtn === btnSpeakTrack && window.speechSynthesis.speaking) {
        stopSpeech();
        return;
      }
      speakMessage(trackingSpeechText, btnSpeakTrack);
    });
  }

  const btnSpeakError = document.getElementById('btn-speak-track-error');
  if (btnSpeakError) {
    btnSpeakError.addEventListener('click', (e) => {
      e.stopPropagation();
      const errText = TRANSLATIONS[currentLang]?.trackNotFoundMsg || 'No ticket found with this number.';
      if (currentSpeakingBtn === btnSpeakError && window.speechSynthesis.speaking) {
        stopSpeech();
        return;
      }
      speakMessage(errText, btnSpeakError);
    });
  }
}

function openTrackViewWithTicket(ticketId) {
  switchView('view-track');
  const input = document.getElementById('track-ticket-input');
  if (input) input.value = ticketId;
  trackComplaintById(ticketId);
}

async function trackComplaintById(ticketId) {
  const errorEl = document.getElementById('track-error-msg');
  const resultWrap = document.getElementById('track-result-wrap');
  const initialState = document.getElementById('track-initial-state');
  const btnSpinner = document.getElementById('track-spinner');
  const btnSubmit = document.getElementById('btn-submit-track');

  // Cancel prior subscription
  if (currentTrackingSubscription) {
    currentTrackingSubscription();
    currentTrackingSubscription = null;
  }

  if (initialState) initialState.classList.add('hidden');
  if (errorEl) errorEl.classList.add('hidden');
  if (btnSpinner) btnSpinner.classList.remove('hidden');
  if (btnSubmit) btnSubmit.disabled = true;

  try {
    const ticket = await window.CivicLensStorage.getTicketById(ticketId);
    if (!ticket) {
      if (errorEl) errorEl.classList.remove('hidden');
      if (resultWrap) resultWrap.classList.add('hidden');
      currentTrackingTicket = null;
      return;
    }

    if (errorEl) errorEl.classList.add('hidden');
    if (resultWrap) resultWrap.classList.remove('hidden');

    renderTrackResult(ticket);

    // Subscribe to live changes
    currentTrackingSubscription = window.CivicLensStorage.subscribeToTicketStatus(ticket.id, (updatedTicket) => {
      console.log('[CivicLens Track] Real-time status update received:', updatedTicket.status);
      renderTrackResult(updatedTicket);
    });
  } finally {
    if (btnSpinner) btnSpinner.classList.add('hidden');
    if (btnSubmit) btnSubmit.disabled = false;
  }
}

function renderTrackResult(ticket) {
  currentTrackingTicket = ticket;
  const langConfig = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // 1. Ticket info summary
  const issueKeyMap = {
    roads: 'tileRoad',
    waste: 'tileGarbage',
    water: 'tileWater',
    electricity: 'tileElectricity',
    trees: 'tileTree',
    drainage: 'tileDrain'
  };
  const deptKeyMap = {
    "Roads & Buildings": "deptRoads",
    "Sanitation": "deptWaste",
    "Water Board": "deptWater",
    "Electricity Department": "deptElectricity",
    "Parks & Gardens": "deptTrees",
    "Drainage Department": "deptDrainage"
  };

  const issueKey = issueKeyMap[ticket.category] || 'tileRoad';
  const localizedIssue = langConfig[issueKey] || ticket.category;
  const deptKey = deptKeyMap[ticket.department] || "deptRoads";
  const localizedDept = langConfig[deptKey] || ticket.department;

  const tNum = document.getElementById('track-ticket-num');
  const tIssue = document.getElementById('track-issue-type');
  const tDept = document.getElementById('track-department');
  const tLoc = document.getElementById('track-location');

  if (tNum) tNum.textContent = ticket.id;
  if (tIssue) tIssue.textContent = localizedIssue;
  if (tDept) tDept.textContent = localizedDept;
  if (tLoc) tLoc.textContent = ticket.location || '-';

  // Urgency badge with icon
  const urgencyBadge = document.getElementById('track-urgency-badge');
  const urgencyIconWrap = document.getElementById('track-urgency-icon-wrap');
  const urgencyText = document.getElementById('track-urgency-text');

  if (urgencyBadge && urgencyIconWrap && urgencyText) {
    urgencyBadge.className = 'urgency-badge-with-icon';
    let localizedUrgency = '';
    let urgencyIconSvg = '';

    if (ticket.severity === 'Critical') {
      urgencyBadge.classList.add('urgency-critical');
      localizedUrgency = langConfig.urgencyCritical || "Critical";
      urgencyIconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else if (ticket.severity === 'High') {
      urgencyBadge.classList.add('urgency-high');
      localizedUrgency = langConfig.urgencyHigh || "High";
      urgencyIconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
    } else if (ticket.severity === 'Medium') {
      urgencyBadge.classList.add('urgency-medium');
      localizedUrgency = langConfig.urgencyMedium || "Medium";
      urgencyIconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`;
    } else {
      urgencyBadge.classList.add('urgency-low');
      localizedUrgency = langConfig.urgencyLow || "Low";
      urgencyIconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    }

    urgencyIconWrap.innerHTML = urgencyIconSvg;
    urgencyText.textContent = localizedUrgency;
  }

  // 2. Duplicate alert banner if multiple citizens reported this
  const dupBanner = document.getElementById('track-duplicate-alert');
  const dupText = document.getElementById('track-people-reported-text');
  if (ticket.duplicate_count && ticket.duplicate_count > 1) {
    if (dupBanner) dupBanner.classList.remove('hidden');
    const msg = (langConfig.peopleReportedTemplate || '{count} people reported this')
      .replace('{count}', ticket.duplicate_count);
    if (dupText) dupText.textContent = msg;
  } else {
    if (dupBanner) dupBanner.classList.add('hidden');
  }

  // 3. Four Steps: Received, Assigned, In progress, Fixed
  const statusLevels = {
    'Submitted': 1,
    'Received': 1,
    'Assigned': 2,
    'In progress': 3,
    'Fixed': 4
  };
  const currentLevel = statusLevels[ticket.status] || 1;

  const steps = [
    { id: 'step-node-received', pillId: 'step-pill-received', level: 1, title: langConfig.stepReceived },
    { id: 'step-node-assigned', pillId: 'step-pill-assigned', level: 2, title: langConfig.stepAssigned },
    { id: 'step-node-inprogress', pillId: 'step-pill-inprogress', level: 3, title: langConfig.stepInProgress },
    { id: 'step-node-fixed', pillId: 'step-pill-fixed', level: 4, title: langConfig.stepFixed }
  ];

  steps.forEach(s => {
    const node = document.getElementById(s.id);
    const pill = document.getElementById(s.pillId);
    if (!node) return;

    node.classList.remove('completed', 'active', 'pending');

    if (s.level < currentLevel) {
      node.classList.add('completed');
      if (pill) pill.textContent = '✓ Done';
    } else if (s.level === currentLevel) {
      if (currentLevel === 4) {
        node.classList.add('completed');
        if (pill) pill.textContent = '✓ Resolved';
      } else {
        node.classList.add('active');
        if (pill) pill.textContent = 'Active';
      }
    } else {
      node.classList.add('pending');
      if (pill) pill.textContent = 'Pending';
    }
  });

  const lineProgress = document.getElementById('stepper-line-progress');
  if (lineProgress) {
    const percentages = { 1: '0%', 2: '33%', 3: '66%', 4: '100%' };
    lineProgress.style.height = percentages[currentLevel] || '0%';
  }

  // 4. Read aloud text
  const activeStepObj = steps.find(s => s.level === currentLevel) || steps[0];
  trackingSpeechText = `${langConfig.trackScreenTitle}. ${langConfig.confTicketNumber}: ${ticket.id}. ` +
    `${langConfig.confIssueType}: ${localizedIssue}. ${langConfig.confDepartment}: ${localizedDept}. ` +
    `${langConfig.trackCurrentStatus || 'Current Status'}: ${activeStepObj.title}.`;

  if (ticket.duplicate_count && ticket.duplicate_count > 1) {
    trackingSpeechText += ` ${(langConfig.peopleReportedTemplate || '{count} people reported this').replace('{count}', ticket.duplicate_count)}.`;
  }
}
