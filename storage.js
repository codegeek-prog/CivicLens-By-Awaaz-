/**
 * CivicLens - Firebase Firestore Storage & Gemini Triage Module
 * 
 * Includes the Official CivicLens Routing Table:
 * - Roads -> Roads & Buildings
 * - Waste -> Sanitation
 * - Water -> Water Board
 * - Electricity -> Electricity Department
 * - Trees -> Parks & Gardens
 * - Drainage -> Drainage Department
 */

let db = null;
let firestoreReady = false;
const LOCAL_STORAGE_KEY = 'civiclens_tickets';

const isDummyFirebase = typeof firebaseConfig === 'undefined' || !firebaseConfig || !firebaseConfig.apiKey || 
  firebaseConfig.apiKey.includes("ReplaceWithYourKey") || 
  firebaseConfig.apiKey.includes("DemoKey");

// Initialize Firebase Firestore
(function initFirestore() {
  if (typeof firebase !== 'undefined' && firebase.initializeApp) {
    if (isDummyFirebase) {
      console.info('[CivicLens] Running in high-speed local mode. Set real credentials in firebase-config.js to sync with remote Firestore.');
      return;
    }
    try {
      if (!firebase.apps || !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      db = firebase.firestore();
      firestoreReady = true;

      // Enable offline persistence so tickets are stored locally in IndexedDB by Firestore
      db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.info('Firestore offline persistence: multiple tabs open, active on primary tab.');
        } else if (err.code === 'unimplemented') {
          console.info('Firestore offline persistence: browser does not support IndexedDB persistence.');
        }
      });
    } catch (e) {
      console.warn('Firebase initialization note (using local cache fallback):', e.message);
    }
  }
})();

/**
 * Official CivicLens Routing Table
 */
const ROUTING_TABLE = {
  roads: "Roads & Buildings",
  waste: "Sanitation",
  water: "Water Board",
  electricity: "Electricity Department",
  trees: "Parks & Gardens",
  drainage: "Drainage Department"
};

/**
 * Assign Department via Routing Table
 */
function getDepartmentForCategory(category) {
  const normalized = (category || "roads").toLowerCase().trim();
  if (ROUTING_TABLE[normalized]) {
    return ROUTING_TABLE[normalized];
  }
  if (normalized === "road") return ROUTING_TABLE.roads;
  if (normalized === "garbage") return ROUTING_TABLE.waste;
  if (normalized === "tree") return ROUTING_TABLE.trees;
  if (normalized === "drain") return ROUTING_TABLE.drainage;
  return "Roads & Buildings";
}

/**
 * Client-side Triage Fallback (Enforcing Severity Rules & Routing Table)
 */
function localRuleBasedTriage(text, categoryHint, langCode) {
  const lower = (text || "").toLowerCase().trim();

  let category = "roads";
  if (["roads", "waste", "water", "electricity", "trees", "drainage"].includes(categoryHint)) {
    category = categoryHint;
  } else if (categoryHint === "road") category = "roads";
  else if (categoryHint === "garbage") category = "waste";
  else if (categoryHint === "tree") category = "trees";
  else if (categoryHint === "drain") category = "drainage";

  // Assign department from routing table
  const department = getDepartmentForCategory(category);

  const langNames = {
    hi: "Hindi",
    te: "Telugu",
    ta: "Tamil",
    bn: "Bengali",
    mr: "Marathi",
    en: "English"
  };
  const detected_language = langNames[langCode] || "English";

  // Severity Rules:
  // - Live wires, gas, open manholes, flooding, or danger to children or crowds are Critical;
  // - Blocked roads or no water for days are High;
  // - Ordinary damage is Medium;
  // - Cosmetic issues are Low.
  // - For vague complaints, choose the best category and note what is unclear.
  let severity = "Medium";
  let severity_reason = "Ordinary damage requiring municipal field maintenance.";
  let unclear_notes = null;

  const isCritical = [
    "live wire", "open wire", "wire sparking", "sparking", "spark", "electric shock", "gas", "gas leak",
    "open manhole", "manhole", "flood", "flooding", "waterlogging",
    "child", "children", "kid", "school", "crowd", "market", "urgent", "danger",
    "खुला तार", "करंट", "मैनहोल", "बाढ़", "बच्चे", "खतरा", "गंभीर", "स्कूल", "चिंगारी",
    "పిల్లలు", "ప్రమాదం", "నిప్పురవ్వలు", "పొగలు", "ట్రాన్స్‌ఫార్మర్", "విద్యుత్ తీగ",
    "குழந்தைகள்", "বিপদ", "लहान मुले", "उघडा मॅनहोल"
  ].some(kw => lower.includes(kw));

  const hasWaterDisruption = ["water", "पानी", "నీరు", "குடிநீர்", "জল", "पाणी"].some(w => lower.includes(w)) &&
                             ["day", "days", "दिन", "రోజులు", "நாட்களாக", "দিন"].some(d => lower.includes(d));
  const hasBlockedRoad = [
    "blocked road", "road blocked", "completely blocked", "road closed",
    "रास्ता बंद", "सड़क बंद", "पूरी तरह बंद",
    "రోడ్డు నిలిచిపోయింది", "ట్రాఫిక్ నిలిచిపోయింది", "రహదారి మూసివేయబడింది",
    "சாலை அடைப்பு", "রাস্তা বন্ধ"
  ].some(b => lower.includes(b));

  const isHigh = hasWaterDisruption || hasBlockedRoad || [
    "no water", "पानी नहीं आ रहा", "నీరు రావడం లేదు", "చుక్క నీరు", "heavy pothole", "massive crater"
  ].some(kw => lower.includes(kw));

  const isLow = [
    "small branch", "dry branch", "dry small", "small dry", "dry leaf", "dry leaves", "fallen branch",
    "cosmetic", "faded", "paint", "dirty spot", "minor", "small litter",
    "सूखी टहनी", "छोटी टहनी", "छोटा", "रंग", "చిన్న కొమ్మ", "ఎండిన కొమ్మ", "சிறிய"
  ].some(kw => lower.includes(kw));

  const hasCivicEntity = [
    "तार", "गड्ढा", "कचरा", "कूड़ा", "नाली", "सीवर", "मैनहोल", "पानी", "पेड़", "बिजली",
    "పైపు", "గుంత", "వైర్", "చెత్త", "కాలువ", "నీరు", "చెట్టు", "డ్రైనేజీ",
    "pothole", "wire", "pipe", "drain", "garbage", "waste", "water", "tree", "spark", "flood", "leak"
  ].some(kw => lower.includes(kw));

  const isVague = (lower.length < 12 || [
    "परेशानी है", "जल्दी ठीक", "मदद करो", "खराब है", "సమస్య ఉంది", "సరిచేయండి", "బాగు చేయండి",
    "help me", "fix it", "please fix", "please help", "something broken", "problem", "solve this"
  ].some(p => lower.includes(p))) && !hasCivicEntity;

  if (isCritical) {
    severity = "Critical";
    severity_reason = "Imminent public safety hazard (open wire, gas, open manhole, flood, or risk to children/crowds).";
  } else if (isHigh) {
    severity = "High";
    severity_reason = "Major civic disruption (blocked traffic roadway or multi-day water supply failure).";
  } else if (isLow) {
    severity = "Low";
    severity_reason = "Minor cosmetic issue with negligible functional or safety impact.";
  } else {
    severity = "Medium";
    severity_reason = "Ordinary infrastructure damage requiring municipal repair schedule.";
  }

  if (isVague) {
    unclear_notes = "Complaint description is very brief. Please provide exact street address or specific problem details.";
  }

  const categoryTitles = {
    roads: "Road & Pothole issue",
    waste: "Garbage and solid waste accumulation",
    water: "Water supply interruption",
    electricity: "Streetlight or power disruption",
    trees: "Tree branch or canopy obstruction",
    drainage: "Drainage or sewer overflow"
  };

  let english_translation = "";
  if (lower && lower.length > 3) {
    if (detected_language === "English") {
      english_translation = text.trim();
    } else {
      english_translation = `${categoryTitles[category]}: Resident reported '${text.trim()}'.`;
    }
  } else {
    english_translation = `${categoryTitles[category]} reported at specified location.`;
  }

  return {
    detected_language,
    english_translation,
    category,
    severity,
    severity_reason,
    department: department,
    unclear_notes
  };
}

/**
 * Call Server-Side Gemini API with local fallback
 * Uses 2.5-second timeout guard to ensure rapid UI responsiveness without buffering.
 */
async function callGeminiTriage({ text, photoDataUrl, languageCode, categoryKey }) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    // Keep payload lightweight (omit very large base64 strings from triage request)
    const triagePhoto = (photoDataUrl && photoDataUrl.length < 300000) ? photoDataUrl : null;

    const response = await fetch('/api/analyze-complaint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        text: text,
        photo: triagePhoto,
        language: languageCode,
        category: categoryKey
      })
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const geminiResult = await response.json();
      // Ensure department is strictly aligned with the routing table
      geminiResult.department = getDepartmentForCategory(geminiResult.category);
      console.log('[CivicLens] Gemini Analysis & Routing Result:', geminiResult);
      return geminiResult;
    }
  } catch (err) {
    console.info('[CivicLens] Fast fallback to local routing table:', err.message);
  }

  return localRuleBasedTriage(text, categoryKey, languageCode);
}

function generateTicketId() {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `CL-${year}-${randomDigits}`;
}

function extractTokens(str) {
  if (!str) return [];
  return str
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F\u0C00-\u0C7F\u0B80-\u0BFF\u0980-\u09FF]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

/**
 * Detect Duplicate Complaints:
 * Same category AND (a nearby location OR very similar meaning)
 */
function findDuplicateTicket(category, locationText, originalText, englishTranslation) {
  const existingTickets = getLocalTickets();
  if (!existingTickets || !existingTickets.length) return null;

  const locNorm = (locationText || "").toLowerCase().trim();
  const textNorm = (originalText || "").toLowerCase().trim();
  const transNorm = (englishTranslation || "").toLowerCase().trim();

  const newLocTokens = extractTokens(locNorm);
  const newTextTokens = extractTokens(textNorm + " " + transNorm);

  for (const t of existingTickets) {
    // 1. Must be the same category
    if (t.category !== category) continue;

    // Do not merge into already fixed complaints
    if (t.status === 'Fixed') continue;

    // 2. Check nearby location
    const tLocNorm = (t.location || "").toLowerCase().trim();
    const tLocTokens = extractTokens(tLocNorm);

    let locationMatch = false;
    if (locNorm && tLocNorm) {
      if (locNorm === tLocNorm || locNorm.includes(tLocNorm) || tLocNorm.includes(locNorm)) {
        locationMatch = true;
      } else {
        const commonLoc = newLocTokens.filter(tok => tLocTokens.includes(tok));
        if (commonLoc.length >= 1) {
          // If common ward, road, street, hospital, market, or landmark
          locationMatch = commonLoc.some(tok => 
            tok.includes('ward') || tok.includes('road') || tok.includes('hospital') || 
            tok.includes('market') || tok.includes('cross') || tok.includes('nagar') || 
            tok.includes('street') || tok.length >= 4
          );
        }
      }
    }

    // 3. Check very similar meaning (token overlap)
    const tTextNorm = ((t.original_text || "") + " " + (t.english_translation || "")).toLowerCase();
    const tTextTokens = extractTokens(tTextNorm);

    let meaningMatch = false;
    if (newTextTokens.length && tTextTokens.length) {
      const commonWords = newTextTokens.filter(tok => tTextTokens.includes(tok));
      const overlap = commonWords.length / Math.min(newTextTokens.length, tTextTokens.length);
      if (overlap >= 0.35 || commonWords.length >= 3) {
        meaningMatch = true;
      }
    }

    // Same category and (nearby location OR very similar meaning)
    if (locationMatch || meaningMatch) {
      return t;
    }
  }

  return null;
}

/**
 * Escalate priority when duplicate report count is high
 */
function escalatePriority(currentSeverity, count) {
  let escalated = currentSeverity;

  // Escalation threshold rules:
  // - If count >= 2: Low becomes Medium
  // - If count >= 3: Medium becomes High
  // - If count >= 4: High becomes Critical
  if (count >= 4) {
    escalated = "Critical";
  } else if (count >= 3) {
    if (currentSeverity === "Low" || currentSeverity === "Medium") {
      escalated = "High";
    }
  } else if (count >= 2) {
    if (currentSeverity === "Low") {
      escalated = "Medium";
    }
  }

  return escalated;
}

/**
 * Update an existing ticket record in local storage and Firestore
 */
async function updateExistingTicketInStorage(updatedTicket) {
  try {
    const tickets = getLocalTickets();
    const idx = tickets.findIndex(t => t.id === updatedTicket.id);
    if (idx !== -1) {
      tickets[idx] = { ...updatedTicket };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tickets));
    }
  } catch (e) {
    console.error('Error updating local ticket:', e);
  }

  // Sync to Firebase Firestore in background (non-blocking)
  if (firestoreReady && db && !isDummyFirebase) {
    db.collection("tickets").doc(updatedTicket.id).set({
      ...updatedTicket,
      server_timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true }).catch(err => {
      console.info('[CivicLens] Firestore merge sync note:', err.message);
    });
  }

  // Notify active listeners (such as the tracking view)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ticket-status-updated', {
      detail: { ticketId: updatedTicket.id, ticket: updatedTicket }
    }));
  }
}

/**
 * Save ticket to Firebase Firestore & local mirror
 * Automatically checks for duplicates (same category & nearby location or similar meaning).
 * Merges duplicate complaints and raises priority when report volume is high.
 */
async function saveTicketToStorage({
  originalText,
  languageCode,
  categoryKey,
  locationText,
  photoDataUrl
}) {
  const nowIso = new Date().toISOString();

  // Call Gemini from server side
  const triage = await callGeminiTriage({
    text: originalText,
    photoDataUrl: photoDataUrl,
    languageCode: languageCode,
    categoryKey: categoryKey
  });

  const assignedDepartment = getDepartmentForCategory(triage.category);

  // 1. Check for Duplicate Complaint
  const duplicateMatch = findDuplicateTicket(
    triage.category,
    locationText,
    originalText,
    triage.english_translation
  );

  if (duplicateMatch) {
    // Existing ticket found - merge them instead of creating a new ticket
    const currentCount = (duplicateMatch.duplicate_count || 1) + 1;
    const oldSeverity = duplicateMatch.severity || "Medium";
    const newSeverity = escalatePriority(oldSeverity, currentCount);

    let updatedReason = duplicateMatch.severity_reason || "";
    if (newSeverity !== oldSeverity) {
      updatedReason = `${updatedReason.replace(/\s*\(Escalated.*?\)/, '')} (Priority escalated to ${newSeverity}: ${currentCount} citizens reported this issue).`;
    }

    duplicateMatch.duplicate_count = currentCount;
    duplicateMatch.severity = newSeverity;
    duplicateMatch.severity_reason = updatedReason;
    duplicateMatch.updated_time = nowIso;

    await updateExistingTicketInStorage(duplicateMatch);

    console.log(`[CivicLens] Merged complaint into existing ticket ${duplicateMatch.id}. New count: ${currentCount}, Priority: ${newSeverity}`);

    return {
      ...duplicateMatch,
      is_merged_duplicate: true
    };
  }

  // 2. New Ticket Creation
  const ticketId = generateTicketId();

  const ticketRecord = {
    id: ticketId,
    original_text: (originalText || "").trim(),
    language: triage.detected_language,
    language_code: languageCode,
    english_translation: triage.english_translation,
    category: triage.category,
    severity: triage.severity,
    severity_reason: triage.severity_reason,
    department: assignedDepartment,
    location: (locationText || "").trim() || "Location not provided",
    photo: photoDataUrl || null,
    duplicate_count: 1,
    status: "Received",
    time: nowIso,
    unclear_notes: triage.unclear_notes || null,
    timestamp: Date.now()
  };

  // Save to local storage mirror (instant)
  saveToLocalTickets(ticketRecord);

  // Sync to Firebase Firestore in background (non-blocking)
  if (firestoreReady && db && !isDummyFirebase) {
    db.collection("tickets").doc(ticketId).set({
      ...ticketRecord,
      server_timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(firestoreErr => {
      console.info('[CivicLens] Firestore background sync note:', firestoreErr.message);
    });
  }

  return ticketRecord;
}

async function loadTicketsFromStorage() {
  if (firestoreReady && db && !isDummyFirebase) {
    try {
      const snapshot = await Promise.race([
        db.collection("tickets").orderBy("time", "desc").get(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500))
      ]);
      if (!snapshot.empty) {
        const remoteTickets = [];
        snapshot.forEach(doc => {
          remoteTickets.push(doc.data());
        });
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remoteTickets));
        return remoteTickets;
      }
    } catch (e) {
      console.info('[CivicLens] Loading tickets from local mirror cache.');
    }
  }

  return getLocalTickets();
}

function getLocalTickets() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveToLocalTickets(ticket) {
  try {
    const tickets = getLocalTickets();
    tickets.unshift(ticket);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tickets));
  } catch (e) {
    console.error('Local ticket save error:', e);
  }
}

async function updateTicketStatusInStorage(ticketId, newStatus) {
  let updatedTicket = null;

  // Update local storage mirror
  try {
    const tickets = getLocalTickets();
    const idx = tickets.findIndex(t => t.id === ticketId);
    if (idx !== -1) {
      tickets[idx].status = newStatus;
      tickets[idx].updated_time = new Date().toISOString();
      updatedTicket = tickets[idx];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tickets));
    }
  } catch (e) {
    console.error('Error updating local ticket status:', e);
  }

  // Update Firestore in background if configured
  if (firestoreReady && db && !isDummyFirebase) {
    db.collection("tickets").doc(ticketId).update({
      status: newStatus,
      updated_time: new Date().toISOString()
    }).catch(firestoreErr => {
      console.info('[CivicLens] Firestore update note:', firestoreErr.message);
    });
  }

  // Notify active listeners (such as the Track page) in real-time
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ticket-status-updated', {
      detail: { ticketId: ticketId, status: newStatus, ticket: updatedTicket }
    }));
  }
}

async function getTicketById(ticketId) {
  if (!ticketId) return null;
  const cleanId = ticketId.trim().toUpperCase();

  // Try local storage first
  const localList = getLocalTickets();
  const localTicket = localList.find(t => t.id && t.id.toUpperCase() === cleanId);
  if (localTicket) return localTicket;

  // Try Firestore if ready
  if (firestoreReady && db && !isDummyFirebase) {
    try {
      const doc = await Promise.race([
        db.collection("tickets").doc(cleanId).get(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500))
      ]);
      if (doc && doc.exists) {
        return doc.data();
      }
    } catch (e) {
      console.warn('Firestore ticket fetch error:', e.message);
    }
  }

  return null;
}

function subscribeToTicketStatus(ticketId, callback) {
  if (!ticketId) return () => {};
  const cleanId = ticketId.trim().toUpperCase();

  let unsubscribeFirestore = null;
  if (firestoreReady && db) {
    try {
      unsubscribeFirestore = db.collection("tickets").doc(cleanId).onSnapshot((doc) => {
        if (doc.exists) {
          callback(doc.data());
        }
      }, (err) => {
        console.warn('Firestore snapshot listener note:', err.message);
      });
    } catch (e) {
      console.warn('Error creating Firestore listener:', e);
    }
  }

  // Also listen for local custom events (e.g. officer updates in same window)
  const localHandler = (e) => {
    if (e.detail && e.detail.ticketId && e.detail.ticketId.toUpperCase() === cleanId) {
      getTicketById(cleanId).then(t => {
        if (t) callback(t);
      });
    }
  };

  window.addEventListener('ticket-status-updated', localHandler);

  return () => {
    if (unsubscribeFirestore) unsubscribeFirestore();
    window.removeEventListener('ticket-status-updated', localHandler);
  };
}

const SEVERITY_ORDER = {
  'Critical': 1,
  'High': 2,
  'Medium': 3,
  'Low': 4
};

function sortTicketsByPriority(tickets) {
  return [...tickets].sort((a, b) => {
    const prioA = SEVERITY_ORDER[a.severity] || 5;
    const prioB = SEVERITY_ORDER[b.severity] || 5;
    if (prioA !== prioB) {
      return prioA - prioB;
    }
    // For ties, newest first
    const timeA = new Date(a.time || a.timestamp || 0).getTime();
    const timeB = new Date(b.time || b.timestamp || 0).getTime();
    return timeB - timeA;
  });
}

// Global exports
window.CivicLensStorage = {
  saveTicket: saveTicketToStorage,
  loadTickets: loadTicketsFromStorage,
  getTickets: getLocalTickets,
  getTicketById: getTicketById,
  subscribeToTicketStatus: subscribeToTicketStatus,
  updateTicketStatus: updateTicketStatusInStorage,
  sortTicketsByPriority: sortTicketsByPriority,
  callGeminiTriage: callGeminiTriage,
  getDepartmentForCategory: getDepartmentForCategory,
  ROUTING_TABLE: ROUTING_TABLE
};
