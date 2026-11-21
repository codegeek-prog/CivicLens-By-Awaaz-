/**
 * CivicLens - Translations Master File
 * 
 * To add a new language:
 * 1. Add a new key (e.g. 'kn', 'gu', 'ml')
 * 2. Set speechCode (BCP 47 code like 'kn-IN')
 * 3. Provide nativeName and fontClass
 * 4. Translate all dictionary keys
 */

const TRANSLATIONS = {
  en: {
    name: "English",
    nativeName: "English",
    speechCode: "en-IN",
    fontClass: "font-en",

    // Branding
    tagline: "powered by Awaaz",

    // Navigation / Header
    myTicketsBtn: "My Tickets",
    backBtn: "Back",

    // Screen 1: Welcome & Language
    chooseLanguage: "Select Language",
    welcomeText: "Report city issues directly to your municipal corporation. We will help track resolution.",
    howItWorksText: "How it works: Select language, speak or snap your problem, and track civic repair in real time.",
    continueBtn: "Continue",
    changeLanguageBtn: "Language",

    // Screen 2: Report a Problem
    reportScreenTitle: "Report a problem",
    tileRoad: "Roads",
    tileGarbage: "Waste",
    tileWater: "Water",
    tileElectricity: "Electricity",
    tileTree: "Trees",
    tileDrain: "Drainage",

    textPlaceholder: "Write problem here or tap microphone...",
    listeningNotice: "Listening... speak now in English",
    photoBtn: "Photo",
    photoAttached: "Photo attached",
    changePhoto: "Change",
    removePhoto: "Remove",

    locationBtn: "Use my location",
    locationDetecting: "Finding location...",
    landmarkPlaceholder: "Or type a landmark (e.g. Near City Hospital)...",
    sendBtn: "Send",
    sendingBtn: "Analyzing with Gemini...",

    // Friendly Blocked & Error Messages
    micBlockedMsg: "Microphone permission is blocked. Please allow microphone access in browser settings, or type the problem.",
    cameraBlockedMsg: "Camera or photo access is blocked. Please enable camera permission in browser settings.",
    locationBlockedMsg: "Location access is blocked. Please type a nearby landmark or street name in the box.",
    selectTilePrompt: "Please choose one of the problem tiles above to continue.",
    emptyInputPrompt: "Please write the problem, speak into the mic, or take a photo before sending.",
    loadingTickets: "Loading complaints...",

    // Screen 3: Confirmation
    confirmationTitle: "Ticket Confirmed",
    confirmationSubtitle: "Your report has been received by city authorities.",
    newComplaintBtn: "Submit Another Issue",
    viewTicketsBtn: "View Saved Tickets",

    // Confirmation Fields
    confTicketNumber: "Ticket Number",
    confIssueType: "Issue Type",
    confDepartment: "Received By",
    confUrgency: "Urgency",

    // Critical Safety Alert
    criticalWarningHeading: "Safety Warning",
    criticalWarningText: "This issue poses an immediate hazard. Please keep away from the area. For life-threatening emergencies, call 112 immediately.",
    emergencyCallBtn: "Call Emergency: 112",

    // Departments (Routing Table)
    deptRoads: "Roads & Buildings",
    deptWaste: "Sanitation",
    deptWater: "Water Board",
    deptElectricity: "Electricity Department",
    deptTrees: "Parks & Gardens",
    deptDrainage: "Drainage Department",

    // Urgency Levels
    urgencyCritical: "Critical",
    urgencyHigh: "High",
    urgencyMedium: "Medium",
    urgencyLow: "Low",

    // Ticket History Details Fields
    fieldId: "Ticket ID",
    fieldCategory: "Category",
    fieldDetectedLang: "Detected Language",
    fieldOriginal: "Original Text",
    fieldTranslation: "English Translation",
    fieldDepartment: "Assigned Department",
    fieldSeverity: "Severity",
    fieldSeverityReason: "Severity Reason",
    fieldLocation: "Location",
    fieldDuplicates: "Duplicate Reports",
    fieldStatus: "Status",
    fieldTime: "Recorded Time",
    fieldUnclear: "Note on Unclear Details",
    noTicketsTitle: "No complaints yet",
    noTicketsMsg: "No tickets saved yet. Submit a problem to see it here.",

    // Accessibility
    listenLabel: "Listen",

    // Tracking & Duplicates
    trackNavBtn: "Track",
    trackScreenTitle: "Track my complaint",
    trackSubtitle: "Enter your ticket number to view live resolution progress.",
    trackInputPlaceholder: "e.g. CL-2026-1042",
    trackSubmitBtn: "Track",
    trackNotFoundMsg: "No ticket found with this number. Please check and try again.",
    trackMergedNotice: "Similar complaint detected nearby. Merged to raise resolution priority.",
    peopleReportedTemplate: "{count} people reported this",
    stepReceived: "Received",
    stepReceivedDesc: "Complaint recorded in municipal system",
    stepAssigned: "Assigned",
    stepAssignedDesc: "Routed to department officer",
    stepInProgress: "In progress",
    stepInProgressDesc: "Field crew actively resolving issue",
    stepFixed: "Fixed",
    stepFixedDesc: "Problem resolved and verified",
    trackThisTicketBtn: "Track This Complaint"
  },

  hi: {
    name: "Hindi",
    nativeName: "हिन्दी",
    speechCode: "hi-IN",
    fontClass: "font-hi",

    // Branding
    tagline: "powered by Awaaz",

    // Navigation / Header
    myTicketsBtn: "मेरी शिकायतें",
    backBtn: "वापस",

    // Screen 1: Welcome & Language
    chooseLanguage: "भाषा चुनें",
    welcomeText: "अपने इलाके की समस्या सीधे नगर निगम तक पहुँचाएँ। समाधान की प्रगति यहाँ देखें।",
    howItWorksText: "यह कैसे काम करता है: भाषा चुनें, बोलकर या फोटो से समस्या बताएं, और समाधान की प्रगति देखें।",
    continueBtn: "आगे बढ़ें",
    changeLanguageBtn: "भाषा बदलें",

    // Screen 2: Report a Problem
    reportScreenTitle: "समस्या दर्ज करें",
    tileRoad: "सड़क",
    tileGarbage: "कचरा",
    tileWater: "पानी",
    tileElectricity: "बिजली",
    tileTree: "पेड़",
    tileDrain: "नाली",

    textPlaceholder: "समस्या यहाँ लिखें या माइक दबाकर बोलें...",
    listeningNotice: "सुन रहे हैं... कृपया हिन्दी में बोलें",
    photoBtn: "फोटो",
    photoAttached: "फोटो जुड़ गई है",
    changePhoto: "बदलें",
    removePhoto: "हटाएं",

    locationBtn: "मेरा स्थान लें",
    locationDetecting: "स्थान खोज रहे हैं...",
    landmarkPlaceholder: "या लैंडमार्क लिखें (उदा. अस्पताल के पास)...",
    sendBtn: "भेजें",
    sendingBtn: "जेमिनी एआई विश्लेषण कर रहा है...",

    // Friendly Blocked & Error Messages
    micBlockedMsg: "माइक्रोफ़ोन की अनुमति बंद है। कृपया ब्राउज़र सेटिंग्स में अनुमति दें, या नीचे लिखकर बताएं।",
    cameraBlockedMsg: "कैमरा या फोटो की अनुमति बंद है। कृपया ब्राउज़र सेटिंग्स में अनुमति चालू करें।",
    locationBlockedMsg: "स्थान की अनुमति बंद है। आप नीचे अपने पास का कोई लैंडमार्क या रास्ता लिख सकते हैं।",
    selectTilePrompt: "कृपया आगे बढ़ने के लिए ऊपर दी गई समस्याओं में से एक चुनें।",
    emptyInputPrompt: "कृपया भेजने से पहले माइक से बोलें, समस्या लिखें या फोटो लें।",
    loadingTickets: "शिकायतें लोड हो रही हैं...",

    // Screen 3: Confirmation
    confirmationTitle: "शिकायत दर्ज हो गई है",
    confirmationSubtitle: "आपकी शिकायत संबंधित विभाग तक पहुँच गई है।",
    newComplaintBtn: "दूसरी समस्या दर्ज करें",
    viewTicketsBtn: "दर्ज शिकायतें देखें",

    // Confirmation Fields
    confTicketNumber: "शिकायत संख्या",
    confIssueType: "समस्या का प्रकार",
    confDepartment: "प्राप्तकर्ता विभाग",
    confUrgency: "गंभीरता",

    // Critical Safety Alert
    criticalWarningHeading: "सुरक्षा चेतावनी",
    criticalWarningText: "यह समस्या गंभीर खतरा पैदा कर सकती है। कृपया उस जगह से सुरक्षित दूरी बनाए रखें। किसी भी आपात स्थिति में तुरंत 112 पर कॉल करें।",
    emergencyCallBtn: "आपातकालीन कॉल: 112",

    // Departments (Routing Table)
    deptRoads: "सड़क और भवन विभाग",
    deptWaste: "सफाई विभाग",
    deptWater: "जल बोर्ड",
    deptElectricity: "विद्युत विभाग",
    deptTrees: "उद्यान एवं वाटिका विभाग",
    deptDrainage: "जल निकासी एवं नाली विभाग",

    // Urgency Levels
    urgencyCritical: "अति गंभीर (Critical)",
    urgencyHigh: "गंभीर (High)",
    urgencyMedium: "मध्यम (Medium)",
    urgencyLow: "कम (Low)",

    // Ticket History Details Fields
    fieldId: "शिकायत संख्या",
    fieldCategory: "समस्या",
    fieldDetectedLang: "पहचानी गई भाषा",
    fieldOriginal: "मूल विवरण",
    fieldTranslation: "अंग्रेजी अनुवाद",
    fieldDepartment: "संबंधित विभाग",
    fieldSeverity: "गंभीरता",
    fieldSeverityReason: "गंभीरता का कारण",
    fieldLocation: "स्थान",
    fieldDuplicates: "समान शिकायतें",
    fieldStatus: "स्थिति",
    fieldTime: "दर्ज समय",
    fieldUnclear: "अस्पष्ट विवरण पर नोट",
    noTicketsTitle: "अभी कोई शिकायत नहीं है",
    noTicketsMsg: "अभी कोई शिकायत दर्ज नहीं है।",

    // Accessibility
    listenLabel: "सुनें",

    // Tracking & Duplicates
    trackNavBtn: "ट्रैक करें",
    trackScreenTitle: "शिकायत ट्रैक करें",
    trackSubtitle: "प्रगति देखने के लिए अपनी शिकायत संख्या दर्ज करें।",
    trackInputPlaceholder: "उदा. CL-2026-1042",
    trackSubmitBtn: "ट्रैक करें",
    trackNotFoundMsg: "इस संख्या से कोई शिकायत नहीं मिली। कृपया पुनः जाँचें।",
    trackMergedNotice: "पास में समान शिकायत मिली है। प्राथमिकता बढ़ाने के लिए इसे जोड़ दिया गया है।",
    peopleReportedTemplate: "{count} लोगों ने यह समस्या दर्ज की है",
    stepReceived: "प्राप्त हुई",
    stepReceivedDesc: "शिकायत नगर निगम पोर्टल में दर्ज हुई",
    stepAssigned: "सौंपी गई",
    stepAssignedDesc: "संबंधित विभागीय अधिकारी को भेजी गई",
    stepInProgress: "कार्य प्रगति पर",
    stepInProgressDesc: "फील्ड टीम द्वारा काम किया जा रहा है",
    stepFixed: "समाधान हुआ",
    stepFixedDesc: "समस्या हल कर ली गई है",
    trackThisTicketBtn: "शिकायत की स्थिति देखें"
  },

  te: {
    name: "Telugu",
    nativeName: "తెలుగు",
    speechCode: "te-IN",
    fontClass: "font-te",

    // Branding
    tagline: "powered by Awaaz",

    // Navigation / Header
    myTicketsBtn: "నా ఫిర్యాదులు",
    backBtn: "వెనుకకు",

    // Screen 1: Welcome & Language
    chooseLanguage: "భాషను ఎంచుకోండి",
    welcomeText: "మీ ప్రాంత సమస్యలను నేరుగా మున్సిపల్ అధికారులకు తెలియజేయండి. పరిష్కారాన్ని ట్రాక్ చేయండి.",
    howItWorksText: "ఇది ఎలా పనిచేస్తుంది: భాషను ఎంచుకోండి, మాట్లాడి లేదా ఫోటో తీసి సమస్యను తెలియజేయండి, మరియు పరిష్కారాన్ని ట్రాక్ చేయండి.",
    continueBtn: "కొనసాగించండి",
    changeLanguageBtn: "భాష మార్చండి",

    // Screen 2: Report a Problem
    reportScreenTitle: "సమస్యను నివేదించండి",
    tileRoad: "రోడ్డు",
    tileGarbage: "చెత్త",
    tileWater: "నీరు",
    tileElectricity: "విద్యుత్",
    tileTree: "చెట్టు",
    tileDrain: "కాలువ",

    textPlaceholder: "ఇక్కడ రాయండి లేదా మైక్ నొక్కి మాట్లాడండి...",
    listeningNotice: "వింటున్నాము... దయచేసి మాట్లాడండి",
    photoBtn: "ఫోటో",
    photoAttached: "ఫోటో జోడించబడింది",
    changePhoto: "మార్చండి",
    removePhoto: "తొలగించండి",

    locationBtn: "నా స్థానాన్ని ఉపయోగించండి",
    locationDetecting: "స్థానాన్ని గుర్తిస్తున్నాము...",
    landmarkPlaceholder: "లేదా సమీప ల్యాండ్‌మార్క్ రాయండి (ఉదా. ఆసుపత్రి వద్ద)...",
    sendBtn: "పంపండి",
    sendingBtn: "జెమినీ విశ్లేషిస్తోంది...",

    // Friendly Blocked & Error Messages
    micBlockedMsg: "మైక్రోఫోన్ అనుమతి నిలిపివేయబడింది. దయచేసి సెట్టింగ్స్‌లో అనుమతించండి లేదా కింద టైప్ చేయండి.",
    cameraBlockedMsg: "కెమెరా లేదా ఫోటో అనుమతి నిలిపివేయబడింది. దయచేసి బ్రౌజర్ సెట్టింగ్స్‌లో అనుమతించండి.",
    locationBlockedMsg: "లొకేషన్ అనుమతి నిలిపివేయబడింది. మీరు సమీప ల్యాండ్‌మార్క్ లేదా వీధి పేరును రాయవచ్చు.",
    selectTilePrompt: "దయచేసి కొనసాగించడానికి పైన ఉన్న సమస్యలలో ఒకదాన్ని ఎంచుకోండి.",
    emptyInputPrompt: "దయచేసి పంపే ముందు మాట్లాడండి, సమస్య రాయండి లేదా ఫోటో తీయండి.",
    loadingTickets: "ఫిర్యాదులను లోడ్ చేస్తున్నాము...",

    // Screen 3: Confirmation
    confirmationTitle: "ఫిర్యాదు అందింది",
    confirmationSubtitle: "మీ ఫిర్యాదు సంబంధిత విభాగానికి చేరింది.",
    newComplaintBtn: "మరొక సమస్యను నమోదు చేయండి",
    viewTicketsBtn: "సేవ్ చేసిన ఫిర్యాదులు",

    // Confirmation Fields
    confTicketNumber: "ఫిర్యాదు సంఖ్య",
    confIssueType: "సమస్య రకం",
    confDepartment: "స్వీకరించిన శాఖ",
    confUrgency: "తీవ్రత",

    // Critical Safety Alert
    criticalWarningHeading: "భద్రతా హెచ్చరిక",
    criticalWarningText: "ఈ సమస్య తక్షణ ప్రమాదాన్ని కలిగిస్తుంది. దయచేసి సంఘటన స్థలానికి దూరంగా ఉండండి. ప్రాణాపాయ అత్యవసర పరిస్థితుల్లో వెంటనే 112 కి కాల్ చేయండి.",
    emergencyCallBtn: "అత్యవసర కాల్: 112",

    // Departments (Routing Table)
    deptRoads: "రోడ్లు & భవనాల శాఖ",
    deptWaste: "పారిశుద్ధ్య శాఖ",
    deptWater: "జల మండలి (వాటర్ బోర్డు)",
    deptElectricity: "విద్యుత్ శాఖ",
    deptTrees: "పార్కులు & తోటల శాఖ",
    deptDrainage: "డ్రైనేజీ శాఖ",

    // Urgency Levels
    urgencyCritical: "అత్యంత తీవ్రం (Critical)",
    urgencyHigh: "తీవ్రం (High)",
    urgencyMedium: "సాధారణం (Medium)",
    urgencyLow: "తక్కువ (Low)",

    // Ticket History Details Fields
    fieldId: "ఫిర్యాదు ఐడీ",
    fieldCategory: "విభాగం",
    fieldDetectedLang: "గుర్తించిన భాష",
    fieldOriginal: "అసలు వచనం",
    fieldTranslation: "ఆంగ్ల అనువాదం",
    fieldDepartment: "శాఖ",
    fieldSeverity: "తీవ్రత",
    fieldSeverityReason: "తీవ్రత కారణం",
    fieldLocation: "ప్రాంతం",
    fieldDuplicates: "నకిలీ నివేదికలు",
    fieldStatus: "స్థితి",
    fieldTime: "నమోదైన సమయం",
    fieldUnclear: "అస్పష్ట వివరాలపై గమనిక",
    noTicketsTitle: "ఇంకా ఎలాంటి ఫిర్యాదులు లేవు",
    noTicketsMsg: "ఇంకా ఎలాంటి ఫిర్యాదులు నమోదు కాలేదు.",

    // Accessibility
    listenLabel: "వినండి",

    // Tracking & Duplicates
    trackNavBtn: "ట్రాక్ చేయండి",
    trackScreenTitle: "ఫిర్యాదును ట్రాక్ చేయండి",
    trackSubtitle: "పురోగతిని చూడటానికి మీ టికెట్ సంఖ్యను నమోదు చేయండి.",
    trackInputPlaceholder: "ఉదా. CL-2026-1042",
    trackSubmitBtn: "ట్రాక్",
    trackNotFoundMsg: "ఈ సంఖ్యతో టికెట్ కనుగొనబడలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.",
    trackMergedNotice: "సమీపంలో ఇలాంటి ఫిర్యాదు గుర్తించబడింది. ప్రాధాన్యతను పెంచడానికి విలీనం చేయబడింది.",
    peopleReportedTemplate: "{count} మంది ఈ సమస్యను నివేదించారు",
    stepReceived: "స్వీకరించబడింది",
    stepReceivedDesc: "ఫిర్యాదు మున్సిపల్ పోర్టల్‌లో నమోదైంది",
    stepAssigned: "కేటాయించబడింది",
    stepAssignedDesc: "సంబంధిత విభాగానికి కేటాయించబడింది",
    stepInProgress: "పురోగతిలో ఉంది",
    stepInProgressDesc: "సిబ్బంది పరిష్కారం కోసం పని చేస్తున్నారు",
    stepFixed: "పరిష్కరించబడింది",
    stepFixedDesc: "సమస్య విజయవంతంగా పరిష్కరించబడింది",
    trackThisTicketBtn: "స్థితిని ట్రాక్ చేయండి"
  },

  ta: {
    name: "Tamil",
    nativeName: "தமிழ்",
    speechCode: "ta-IN",
    fontClass: "font-ta",

    // Branding
    tagline: "powered by Awaaz",

    // Navigation / Header
    myTicketsBtn: "என் புகார்கள்",
    backBtn: "பின்செல்",

    // Screen 1: Welcome & Language
    chooseLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    welcomeText: "உங்கள் பகுதி பிரச்சினைகளை நேரடியாக நகராட்சிக்குத் தெரிவிக்கவும். தீர்வு நிலையை அறியலாம்.",
    howItWorksText: "இது எப்படி செயல்படுகிறது: மொழியைத் தேர்வுசெய்து, பேசி அல்லது புகைப்படம் எடுத்து சிக்கலைப் பதிவுசெய்யுங்கள், தீர்வை உடனுக்குடன் கண்காணிக்கவும்.",
    continueBtn: "தொடரவும்",
    changeLanguageBtn: "மொழியை மாற்றவும்",

    // Screen 2: Report a Problem
    reportScreenTitle: "பிரச்சினையைப் புகாரளிக்கவும்",
    tileRoad: "சாலை",
    tileGarbage: "குப்பை",
    tileWater: "தண்ணீர்",
    tileElectricity: "மின்சாரம்",
    tileTree: "மரம்",
    tileDrain: "வடிகால்",

    textPlaceholder: "இங்கே எழுதவும் அல்லது மைக்கை அழுத்திப் பேசவும்...",
    listeningNotice: "கேட்கிறது... தமிழில் பேசவும்",
    photoBtn: "புகைப்படம்",
    photoAttached: "புகைப்படம் இணைக்கப்பட்டது",
    changePhoto: "மாற்று",
    removePhoto: "நீக்கு",

    locationBtn: "என் இருப்பிடத்தைப் பயன்படுத்தவும்",
    locationDetecting: "இருப்பிடம் கண்டறியப்படுகிறது...",
    landmarkPlaceholder: "அல்லது அடையாள இடத்தை எழுதவும் (எ.கா. மருத்துவமனை அருகில்)...",
    sendBtn: "அனுப்புக",
    sendingBtn: "ஜெமினி பகுப்பாய்வு செய்கிறது...",

    // Friendly Blocked & Error Messages
    micBlockedMsg: "மைக்ரோஃபோன் அனுமதி தடுக்கப்பட்டுள்ளது. உலாவி அமைப்புகளில் அனுமதிக்கவும் அல்லது கீழே எழுதவும்.",
    cameraBlockedMsg: "கேமரா அல்லது புகைப்பட அனுமதி தடுக்கப்பட்டுள்ளது. உலாவி அமைப்புகளில் அனுமதிக்கவும்.",
    locationBlockedMsg: "இருப்பிட அனுமதி தடுக்கப்பட்டுள்ளது. நீங்கள் அருகிலுள்ள அடையாள இடத்தை எழுதலாம்.",
    selectTilePrompt: "தொடர மேலே உள்ள பிரச்சினைகளில் ஒன்றைத் தேர்ந்தெடுக்கவும்.",
    emptyInputPrompt: "அனுப்புவதற்கு முன் தயவுசெய்து பேசவும், எழுதவும் அல்லது புகைப்படம் எடுக்கவும்.",
    loadingTickets: "புகார்கள் ஏற்றப்படுகின்றன...",

    // Screen 3: Confirmation
    confirmationTitle: "புகார் பதிவு செய்யப்பட்டது",
    confirmationSubtitle: "உங்கள் புகார் உரிய துறைக்குப் பெறப்பட்டது.",
    newComplaintBtn: "மற்றொரு புகாரைப் பதிவு செய்யவும்",
    viewTicketsBtn: "சேமிக்கப்பட்ட புகார்கள்",

    // Confirmation Fields
    confTicketNumber: "புகார் எண்",
    confIssueType: "பிரச்சினை வகை",
    confDepartment: "பெற்றுக்கொண்ட துறை",
    confUrgency: "அவசர நிலை",

    // Critical Safety Alert
    criticalWarningHeading: "பாதுகாப்பு எச்சரிக்கை",
    criticalWarningText: "இந்தப் பிரச்சினை உடனடி ஆபத்தை விளைவிக்கக்கூடும். அந்த இடத்திலிருந்து விலகி பாதுகாப்பாக இருங்கள். அவசர உதவிக்கு உடனடியாக 112 ஐ அழைக்கவும்.",
    emergencyCallBtn: "அவசர அழைப்பு: 112",

    // Departments (Routing Table)
    deptRoads: "சாலைகள் & கட்டிடங்கள் துறை",
    deptWaste: "சுகாதாரத் துறை",
    deptWater: "குடிநீர் வாரியம்",
    deptElectricity: "மின்சாரத் துறை",
    deptTrees: "பூங்காக்கள் & தோட்டங்கள் துறை",
    deptDrainage: "வடிகால் துறை",

    // Urgency Levels
    urgencyCritical: "மிகவும் அவசரம் (Critical)",
    urgencyHigh: "அவசரம் (High)",
    urgencyMedium: "நடுத்தரம் (Medium)",
    urgencyLow: "குறைவு (Low)",

    // Ticket History Details Fields
    fieldId: "புகார் எண்",
    fieldCategory: "வகை",
    fieldDetectedLang: "கண்டறியப்பட்ட மொழி",
    fieldOriginal: "அசல் உரை",
    fieldTranslation: "ஆங்கில மொழிபெயர்ப்பு",
    fieldDepartment: "துறை",
    fieldSeverity: "அவசர நிலை",
    fieldSeverityReason: "காரணம்",
    fieldLocation: "இடம்",
    fieldDuplicates: "போலி பதிவுகள்",
    fieldStatus: "நிலை",
    fieldTime: "பதிவு செய்யப்பட்ட நேரம்",
    fieldUnclear: "விளக்கக் குறிப்பு",
    noTicketsTitle: "இன்னும் புகார்கள் எதுவும் இல்லை",
    noTicketsMsg: "இன்னும் எந்தப் புகாரும் சேமிக்கப்படவில்லை.",

    // Accessibility
    listenLabel: "கேளுங்கள்",

    // Tracking & Duplicates
    trackNavBtn: "கண்காணிக்க",
    trackScreenTitle: "புகாரை கண்காணிக்கவும்",
    trackSubtitle: "தற்போதைய நிலையை அறிய புகார் எண்ணை உள்ளிடவும்.",
    trackInputPlaceholder: "எ.கா. CL-2026-1042",
    trackSubmitBtn: "கண்காணி",
    trackNotFoundMsg: "இந்த எண்ணில் புகார் எதுவும் இல்லை. தயவுசெய்து சரிபார்க்கவும்.",
    trackMergedNotice: "அருகிலேயே இதேபோன்ற புகார் கண்டறியப்பட்டது. முன்னுரிமையை உயர்த்த இணைக்கப்பட்டுள்ளது.",
    peopleReportedTemplate: "{count} பேர் இந்தப் புகாரைப் பதிவு செய்துள்ளனர்",
    stepReceived: "பெறப்பட்டது",
    stepReceivedDesc: "புகார் நகராட்சி அமைப்பில் பதிவாகியுள்ளது",
    stepAssigned: "ஒதுக்கப்பட்டது",
    stepAssignedDesc: "துறை அதிகாரியிடம் ஒப்படைக்கப்பட்டது",
    stepInProgress: "நடவடிக்கையில் உள்ளது",
    stepInProgressDesc: "களப்பணியாளர்கள் பணியில் உள்ளனர்",
    stepFixed: "சரிசெய்யப்பட்டது",
    stepFixedDesc: "பிரச்சினை சரிசெய்யப்பட்டு உறுதி செய்யப்பட்டது",
    trackThisTicketBtn: "புகார் நிலையை அறிய"
  },

  bn: {
    name: "Bengali",
    nativeName: "বাংলা",
    speechCode: "bn-IN",
    fontClass: "font-bn",

    // Branding
    tagline: "powered by Awaaz",

    // Navigation / Header
    myTicketsBtn: "আমার অভিযোগ",
    backBtn: "ফিরে যান",

    // Screen 1: Welcome & Language
    chooseLanguage: "ভাষা নির্বাচন করুন",
    welcomeText: "আপনার এলাকার সমস্যা সরাসরি পুরসভাকে জানান। সমাধানের অগ্রগতি সহজে ট্র্যাক করুন।",
    howItWorksText: "এটি কীভাবে কাজ করে: ভাষা নির্বাচন করুন, মুখে বলুন বা ছবি তুলে সমস্যা জানান, এবং সরাসরি অগ্রগতি ট্র্যাক করুন।",
    continueBtn: "এগিয়ে যান",
    changeLanguageBtn: "ভাষা পরিবর্তন",

    // Screen 2: Report a Problem
    reportScreenTitle: "সমস্যা জানান",
    tileRoad: "রাস্তা",
    tileGarbage: "আবর্জনা",
    tileWater: "জল",
    tileElectricity: "বিদ্যুৎ",
    tileTree: "গাছ",
    tileDrain: "নর্দমা",

    textPlaceholder: "এখানে সমস্যা লিখুন বা মাইকে ট্যাপ করে বলুন...",
    listeningNotice: "শুনছি... অনুগ্রহ করে বাংলায় বলুন",
    photoBtn: "ছবি",
    photoAttached: "ছবি যুক্ত হয়েছে",
    changePhoto: "পরিবর্তন",
    removePhoto: "মুছুন",

    locationBtn: "আমার অবস্থান ব্যবহার করুন",
    locationDetecting: "অবস্থান খোঁজা হচ্ছে...",
    landmarkPlaceholder: "অথবা কোনো পরিচিত স্থান লিখুন (যেমন: হাসপাতালের কাছে)...",
    sendBtn: "পাঠান",
    sendingBtn: "জেমিনি বিশ্লেষণ করছে...",

    // Friendly Blocked & Error Messages
    micBlockedMsg: "মাইক্রোফোনের অনুমতি বন্ধ আছে। ব্রাউজার সেটিংসে গিয়ে অনুমতি দিন অথবা নিচে লিখে জানান।",
    cameraBlockedMsg: "ক্যামেরা বা ছবির অনুমতি বন্ধ আছে। ব্রাউজার সেটিংসে গিয়ে অনুমতি দিন।",
    locationBlockedMsg: "অবস্থানের অনুমতি বন্ধ আছে। আপনি নিচে কোনো পরিচিত স্থান বা রাস্তার নাম লিখতে পারেন।",
    selectTilePrompt: "এগিয়ে যেতে অনুগ্রহ করে উপরের সমস্যাগুলির একটি নির্বাচন করুন।",
    emptyInputPrompt: "পাঠানোর আগে অনুগ্রহ করে মুখে বলুন, সমস্যা লিখুন বা ছবি তুলুন।",
    loadingTickets: "অভিযোগগুলি লোড হচ্ছে...",

    // Screen 3: Confirmation
    confirmationTitle: "অভিযোগ গৃহীত হয়েছে",
    confirmationSubtitle: "আপনার অভিযোগ সংশ্লিষ্ট দপ্তরের কাছে পৌঁছেছে।",
    newComplaintBtn: "আরেকটি সমস্যা জানান",
    viewTicketsBtn: "সংরক্ষিত অভিযোগগুলি দেখুন",

    // Confirmation Fields
    confTicketNumber: "অভিযোগ নম্বর",
    confIssueType: "সমস্যার ধরন",
    confDepartment: "গ্রহণকারী দপ্তর",
    confUrgency: "জরুরিতা",

    // Critical Safety Alert
    criticalWarningHeading: "সুরক্ষা সতর্কতা",
    criticalWarningText: "এই সমস্যাটি তাৎক্ষণিক বিপদের সৃষ্টি করতে পারে। অনুগ্রহ করে সেই জায়গা থেকে দূরে থাকুন। যেকোনো জরুরি অবস্থায় অবিলম্বে 112 নম্বরে কল করুন।",
    emergencyCallBtn: "জরুরি কল: 112",

    // Departments (Routing Table)
    deptRoads: "রাস্তা ও ভবন দপ্তর",
    deptWaste: "পরিচ্ছন্নতা দপ্তর",
    deptWater: "জল পর্ষদ",
    deptElectricity: "বিদ্যুৎ দপ্তর",
    deptTrees: "উদ্যান ও বাগান দপ্তর",
    deptDrainage: "নিকাশি দপ্তর",

    // Urgency Levels
    urgencyCritical: "অত্যন্ত জরুরি (Critical)",
    urgencyHigh: "জরুরি (High)",
    urgencyMedium: "মাঝারি (Medium)",
    urgencyLow: "কম (Low)",

    // Ticket History Details Fields
    fieldId: "অভিযোগ আইডি",
    fieldCategory: "বিভাগ",
    fieldDetectedLang: "চিহ্নিত ভাষা",
    fieldOriginal: "মূল বিবরণ",
    fieldTranslation: "ইংরেজি অনুবাদ",
    fieldDepartment: "দপ্তর",
    fieldSeverity: "জরুরিতা",
    fieldSeverityReason: "জরুরিতার কারণ",
    fieldLocation: "অবস্থান",
    fieldDuplicates: "অনুরূপ অভিযোগ",
    fieldStatus: "অবস্থা",
    fieldTime: "নথিভুক্তির সময়",
    fieldUnclear: "অস্পষ্ট বিষয়ের নোট",
    noTicketsTitle: "এখনও কোনো অভিযোগ নেই",
    noTicketsMsg: "এখনও কোনো অভিযোগ সংরক্ষিত নেই।",

    // Accessibility
    listenLabel: "শুনুন",

    // Tracking & Duplicates
    trackNavBtn: "ট্র্যাক করুন",
    trackScreenTitle: "অভিযোগের অগ্রগতি দেখুন",
    trackSubtitle: "বর্তমান স্থিতি দেখতে আপনার টিকিট নম্বর লিখুন।",
    trackInputPlaceholder: "যেমন CL-2026-1042",
    trackSubmitBtn: "ট্র্যাক করুন",
    trackNotFoundMsg: "এই নম্বরে কোনো টিকিট পাওয়া যায়নি। অনুগ্রহ করে পরীক্ষা করুন।",
    trackMergedNotice: "নিকটবর্তী এলাকায় একই রকম সমস্যা পাওয়া গেছে। অগ্রাধিকার বাড়াতে অভিযোগগুলি সংযুক্ত করা হয়েছে।",
    peopleReportedTemplate: "{count} জন এই সমস্যাটি জানিয়েছেন",
    stepReceived: "গৃহীত",
    stepReceivedDesc: "অভিযোগটি পৌর ব্যবস্থার অন্তর্ভুক্ত হয়েছে",
    stepAssigned: "বরাদ্দকৃত",
    stepAssignedDesc: "সংশ্লিষ্ট বিভাগীয় কর্মকর্তার কাছে পাঠানো হয়েছে",
    stepInProgress: "কাজ চলছে",
    stepInProgressDesc: "মাঠ পর্যায়ের কর্মীরা কাজ করছেন",
    stepFixed: "সমাধান সম্পন্ন",
    stepFixedDesc: "সমস্যাটির সমাধান যাচাই করা হয়েছে",
    trackThisTicketBtn: "অভিযোগ ট্র্যাক করুন"
  },

  mr: {
    name: "Marathi",
    nativeName: "मराठी",
    speechCode: "mr-IN",
    fontClass: "font-mr",

    // Branding
    tagline: "powered by Awaaz",

    // Navigation / Header
    myTicketsBtn: "माझ्या तक्रारी",
    backBtn: "मागे",

    // Screen 1: Welcome & Language
    chooseLanguage: "भाषा निवडा",
    welcomeText: "आपल्या परिसरातील समस्या थेट महानगरपालिकेकडे नोंदवा. निवारणाचा पाठपुरावा करा.",
    howItWorksText: "हे कसे कार्य करते: भाषा निवडा, बोलून किंवा फोटो काढून समस्या सांगा, आणि निवारणाचा पाठपुरावा करा.",
    continueBtn: "पुढे जा",
    changeLanguageBtn: "भाषा बदला",

    // Screen 2: Report a Problem
    reportScreenTitle: "समस्या नोंदवा",
    tileRoad: "रस्ता",
    tileGarbage: "कचरा",
    tileWater: "पाणी",
    tileElectricity: "वीज",
    tileTree: "झाड",
    tileDrain: "गटार",

    textPlaceholder: "येथे समस्या लिहा किंवा माईक दाबून बोला...",
    listeningNotice: "ऐकत आहोत... कृपया मराठीत बोला",
    photoBtn: "फोटो",
    photoAttached: "फोटो जोडला आहे",
    changePhoto: "बदला",
    removePhoto: "काढा",

    locationBtn: "माझे ठिकाण वापरा",
    locationDetecting: "ठिकाण शोधत आहोत...",
    landmarkPlaceholder: "किंवा लँडमार्क लिहा (उदा. रुग्णालयाजवळ)...",
    sendBtn: "पाठवा",
    sendingBtn: "जेमिनी एआय विश्लेषण करत आहे...",

    // Friendly Blocked & Error Messages
    micBlockedMsg: "मायक्रोफोन परवानगी बंद आहे. कृपया ब्राउझर सेटिंग्जमध्ये परवानगी द्या किंवा खाली टाईप करा.",
    cameraBlockedMsg: "कॅमेरा किंवा फोटो परवानगी बंद आहे. कृपया ब्राउझर सेटिंग्जमध्ये परवानगी चालू करा.",
    locationBlockedMsg: "ठिकाणाची परवानगी बंद आहे. आपण खाली जवळपासचे ठिकाण किंवा रस्त्याचे नाव लिहू शकता.",
    selectTilePrompt: "कृपया पुढे जाण्यासाठी वरील समस्यांपैकी एक निवडा.",
    emptyInputPrompt: "कृपया पाठवण्यापूर्वी माईकवर बोला, समस्या लिहा किंवा फोटो जोडा.",
    loadingTickets: "तक्रारी लोड होत आहेत...",

    // Screen 3: Confirmation
    confirmationTitle: "तक्रार नोंदवली गेली आहे",
    confirmationSubtitle: "आपली तक्रार संबंधित विभागाकडे प्राप्त झाली आहे.",
    newComplaintBtn: "दुसरी तक्रार नोंदवा",
    viewTicketsBtn: "नोंदवलेल्या तक्रारी पहा",

    // Confirmation Fields
    confTicketNumber: "तक्रार क्रमांक",
    confIssueType: "समस्येचा प्रकार",
    confDepartment: "स्वीकारलेला विभाग",
    confUrgency: "तातडी / गंभीरता",

    // Critical Safety Alert
    criticalWarningHeading: "सुरक्षा इशारा",
    criticalWarningText: "ही समस्या गंभीर धोका निर्माण करू शकते. कृपया घटनास्थळापासून सुरक्षित अंतर ठेवा. तातडीच्या मदतीसाठी लगेच 112 वर कॉल करा.",
    emergencyCallBtn: "आणीबाणी कॉल: 112",

    // Departments (Routing Table)
    deptRoads: "रस्ते आणि इमारत विभाग",
    deptWaste: "स्वच्छता विभाग",
    deptWater: "जल मंडळ (वॉटर बोर्ड)",
    deptElectricity: "विद्युत विभाग",
    deptTrees: "उद्यान व बगीचा विभाग",
    deptDrainage: "सांडपाणी व गटार विभाग",

    // Urgency Levels
    urgencyCritical: "अति गंभीर (Critical)",
    urgencyHigh: "गंभीर (High)",
    urgencyMedium: "मध्यम (Medium)",
    urgencyLow: "कमी (Low)",

    // Ticket History Details Fields
    fieldId: "तक्रार क्रमांक",
    fieldCategory: "समस्या",
    fieldDetectedLang: "ओळखलेली भाषा",
    fieldOriginal: "मूळ मजकूर",
    fieldTranslation: "इंग्रजी भाषांतर",
    fieldDepartment: "संबंधित विभाग",
    fieldSeverity: "तीव्रता",
    fieldSeverityReason: "तीव्रतेचे कारण",
    fieldLocation: "ठिकाण",
    fieldDuplicates: "समान तक्रारी",
    fieldStatus: "स्थिती",
    fieldTime: "नोंदणी वेळ",
    fieldUnclear: "अस्पष्ट नोंदी",
    noTicketsTitle: "अद्याप कोणतीही तक्रार नाही",
    noTicketsMsg: "अद्याप कोणतीही तक्रार नोंदवलेली नाही.",

    // Accessibility
    listenLabel: "ऐका",

    // Tracking & Duplicates
    trackNavBtn: "तक्रार ट्रॅक करा",
    trackScreenTitle: "माझी तक्रार ट्रॅक करा",
    trackSubtitle: "निकालाची प्रगती पाहण्यासाठी तुमचा तक्रार क्रमांक टाका.",
    trackInputPlaceholder: "उदा. CL-2026-1042",
    trackSubmitBtn: "ट्रॅक करा",
    trackNotFoundMsg: "या क्रमांकावर कोणतीही तक्रार आढळली नाही. कृपया पुन्हा तपासा.",
    trackMergedNotice: "जवळच अशीच तक्रार आढळली आहे. प्राधान्य वाढवण्यासाठी ती एकत्रित करण्यात आली आहे.",
    peopleReportedTemplate: "{count} नागरिकांनी ही तक्रार नोंदवली आहे",
    stepReceived: "प्राप्त झाली",
    stepReceivedDesc: "तक्रार पालिका पोर्टलवर नोंदवली गेली आहे",
    stepAssigned: "नियुक्त केली",
    stepAssignedDesc: "संबंधित विभागीय अधिकाऱ्याकडे वर्ग केली",
    stepInProgress: "काम सुरू आहे",
    stepInProgressDesc: "कर्मचाऱ्यांमार्फत काम सुरू आहे",
    stepFixed: "निवारण झाले",
    stepFixedDesc: "समस्या दूर झाली असून खात्री केली आहे",
    trackThisTicketBtn: "तक्रार स्थिती पहा"
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TRANSLATIONS;
}
