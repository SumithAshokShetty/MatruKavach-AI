export type Language = "en" | "hi" | "mr" | "kn" | "te" | "ta" | "bn";

export const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
    { code: "en", label: "English", nativeLabel: "English" },
    { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
    { code: "mr", label: "Marathi", nativeLabel: "मराठी" },
    { code: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ" },
    { code: "te", label: "Telugu", nativeLabel: "తెలుగు" },
    { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
    { code: "bn", label: "Bengali", nativeLabel: "বাংলা" }
];

export const translations: Record<Language, Record<string, string>> = {
    en: {
        // Navigation / Header
        "nav.logo": "MatruKavach AI",
        "nav.ashaPortal": "ASHA Portal",
        "nav.doctorPortal": "Doctor Portal",
        "nav.admin": "Admin",
        "nav.signIn": "Sign In",
        "nav.signOut": "Sign Out",
        
        // Footer
        "footer.tagline": "Environment-Aware Analytics",
        "footer.products": "Products",
        "footer.company": "Company",
        "footer.socials": "Socials",
        "footer.aboutUs": "About us",
        "footer.blogs": "Blogs",
        "footer.careers": "Careers",
        "footer.terms": "Terms of service",
        "footer.privacy": "Privacy Policy",
        "footer.copyright": "Copyright MatruKavach AI 2026",
        "footer.rights": "All rights reserved, Built in India",

        // Common
        "common.loading": "Loading...",
        "common.back": "Back",
        "common.active": "Active",
        "common.inactive": "Inactive",
        "common.location": "Location",
        "common.age": "Age",
        "common.weeks": "Weeks",
        "common.submit": "Submit",
        "common.cancel": "Cancel",
        "common.filter": "Filter",
        "common.status": "Status",
        "common.phone": "Phone",
        "common.action": "Action",
        "common.delete": "Delete",
        "common.download": "Download",
        "common.save": "Save",
        "common.riskScore": "Risk Score",
        "common.riskLevel": "Risk Level",
        "common.clinicalFlags": "Clinical Flags",
        "common.environmentalFlags": "Environmental Flags",
        "common.nutritionalAdvice": "Nutritional Advice",
        "common.medicationAdvice": "Medication Advice",

        // Home Page
        "home.heroTitle": "Guarding Maternal Vitals with Planetary Intelligence.",
        "home.heroSub": "Advanced maternal health monitoring that combines clinical vitals with real-time pollution, heat, and weather data to predict invisible risks.",
        "home.launchAsha": "Launch ASHA Portal",
        "home.sectionTitle": "Comprehensive Risk Orchestration",
        "home.card1Title": "Clinical + Environmental",
        "home.card1Desc": "We merge BP & weight data with real-time AQI and Heat Index to generate a truly holistic risk score.",
        "home.card2Title": "AI Risk Orchestration",
        "home.card2Desc": "Our multi-agent system continuously monitors invisible threats and alerts ASHA workers instantly.",
        "home.card3Title": "Seamless Coordination",
        "home.card3Desc": "Unified portals for ASHA workers, Doctors, and Admins to ensure no mother is left behind.",

        // ASHA Dashboard
        "asha.dashboardTitle": "ASHA Dashboard",
        "asha.dashboardSub": "Manage mother profiles and assessments",
        "asha.searchPlaceholder": "Search by name or ID...",
        "asha.loadingProfiles": "Loading Patient Profiles...",
        "asha.noRecords": "No records found. Please seed the database or add a new mother.",
        "asha.newAssessment": "New Assessment",

        // ASHA Assessment Form
        "assess.title": "Health Assessment",
        "assess.location": "Location",
        "assess.temp": "Temperature",
        "assess.feelsLike": "Feels like",
        "assess.aqi": "Air Quality (AQI)",
        "assess.pmLevels": "PM2.5 Levels",
        "assess.toxin": "Toxin Exposure",
        "assess.estRisk": "Estimated Risk",
        "assess.clinicalForm": "Clinical Form",
        "assess.bp": "Blood Pressure (mmHg)",
        "assess.systolic": "Systolic (e.g. 120)",
        "assess.diastolic": "Diastolic (e.g. 80)",
        "assess.weight": "Weight (kg)",
        "assess.hemoglobin": "Hemoglobin (g/dL)",
        "assess.glucose": "Random Glucose (mg/dL)",
        "assess.symptoms": "Other Symptoms / Notes",
        "assess.symptomsPlaceholder": "Headache, swelling, vision issues, etc.",
        "assess.analyzing": "AI Orchestrator Analyzing...",
        "assess.runAssessment": "Run AI Assessment",
        
        // ASHA Assessment Results
        "assess.resultTitle": "AI Orchestration Report",
        "assess.riskScore": "Overall Risk Score",
        "assess.clinicalFlags": "Clinical Risk Flags",
        "assess.envFlags": "Environmental Risks Detect",
        "assess.noFlags": "No critical risks flagged.",
        "assess.nutAdvice": "Nutrition & Care Plan",
        "assess.medAdvice": "Medications & Reminders",
        "assess.consultNote": "Frontline Consultation Notes",
        "assess.consultationHelper": "Record your direct observations and advice given to the mother based on the AI Risk Analysis.",
        "assess.consultPlaceholder": "Write messages to send to the doctor or observations...",
        "assess.saveNote": "Save Consultation Note",
        "assess.noteSaved": "Note saved and synced with Doctor portal!",
        "assess.saving": "Saving...",

        // Mother Details Page
        "mother.detailTitle": "Patient Details",
        "mother.vitalsSummary": "Vitals Summary",
        "mother.gestationalAge": "Gestational Age",
        "mother.gravida": "Gravida",
        "mother.lastAssessment": "Last Assessment",
        "mother.updateProfile": "Update Profile",
        "mother.assessmentsTab": "Assessments",
        "mother.documentsTab": "Documents",
        "mother.chatTab": "Chat with AI",
        "mother.historyTitle": "Assessment History",
        "mother.noDocs": "No documents uploaded yet.",
        "mother.uploadReport": "Upload Report",
        "mother.uploading": "Uploading...",
        "mother.recordsTitle": "Health Records & Documents",
        "mother.chatPlaceholder": "Ask anything about the patient's records or environment...",
        "mother.patientNotFound": "Patient Not Found",
        
        // Doctor Portal
        "doctor.dashboardTitle": "Doctor Clinical Workspace",
        "doctor.dashboardSub": "Environmental-Clinical Risk Triaging",
        "doctor.activeCases": "Active Maternal Cases",
        "doctor.riskBreakdown": "Planetary Risk Breakdown",
        "doctor.envAlerts": "Environmental Threat Stream",
        "doctor.patient": "Patient",
        "doctor.risk": "Risk",
        "doctor.lastVitals": "Last Vitals",
        "doctor.envThreats": "Env Threats",
        "doctor.details": "Details",
        "doctor.chatTitle": "Chat with ASHA/AI",
        "doctor.clinicalAlerts": "Clinical Alerts",
        "doctor.recommendations": "Doctor Clinical Directive",
        "doctor.recPlaceholder": "Enter clinical recommendation or prescription...",
        "doctor.saveRec": "Issue Directive",
        "doctor.recSaved": "Directive dispatched to ASHA Portal!",
        "doctor.environmentalImpact": "Planetary-Environmental Threat Analysis",
        "doctor.airTox": "Air & Toxic Load",
        "doctor.heatEx": "Heat & Thermal Exposure",

        // Admin Portal
        "admin.dashboardTitle": "MatruKavach AI Orchestrator",
        "admin.dashboardSub": "Agent System & Environment Integration Admin Panel",
        "admin.systemStatus": "System Operational Status",
        "admin.totalMothers": "Total Mothers Monitored",
        "admin.criticalCases": "Critical Cases Flagged",
        "admin.envAlertsCount": "Active Env Alerts",
        "admin.agentMonitor": "Multi-Agent System Monitor",
        "admin.agentName": "Agent Name",
        "admin.agentStatus": "Status",
        "admin.agentTask": "Current Task",
        "admin.activeMothers": "Active Mothers Registry",
        "admin.seedDatabase": "Seed Database with Sample Data",
        "admin.databaseSeeded": "Database successfully seeded!",
        "admin.seeding": "Seeding database...",
        "admin.name": "Name",
        "admin.gestWeek": "Gest. Week",
        "admin.riskLevel": "Risk Level",
        "admin.score": "Score"
    },
    hi: {
        // Navigation / Header
        "nav.logo": "मातृकवच AI",
        "nav.ashaPortal": "आशा पोर्टल",
        "nav.doctorPortal": "डॉक्टर पोर्टल",
        "nav.admin": "एडमिन",
        "nav.signIn": "साइन इन",
        "nav.signOut": "साइन आउट",
        
        // Footer
        "footer.tagline": "पर्यावरण-जागरूक विश्लेषण",
        "footer.products": "उत्पाद",
        "footer.company": "कंपनी",
        "footer.socials": "सोशल मीडिया",
        "footer.aboutUs": "हमारे बारे में",
        "footer.blogs": "ब्लॉग",
        "footer.careers": "करियर",
        "footer.terms": "सेवा की शर्तें",
        "footer.privacy": "गोपनीयता नीति",
        "footer.copyright": "कॉपीराइट मातृकवच AI 2026",
        "footer.rights": "सर्वाधिकार सुरक्षित, भारत में निर्मित",

        // Common
        "common.loading": "लोड हो रहा है...",
        "common.back": "पीछे",
        "common.active": "सक्रिय",
        "common.inactive": "निष्क्रिय",
        "common.location": "स्थान",
        "common.age": "आयु",
        "common.weeks": "सप्ताह",
        "common.submit": "जमा करें",
        "common.cancel": "रद्द करें",
        "common.filter": "फ़िल्टर",
        "common.status": "स्थिति",
        "common.phone": "फ़ोन",
        "common.action": "कार्रवाई",
        "common.delete": "हटाएं",
        "common.download": "डाउनलोड",
        "common.save": "सुरक्षित करें",
        "common.riskScore": "जोखिम स्कोर",
        "common.riskLevel": "जोखिम स्तर",
        "common.clinicalFlags": "क्लिनिकल जोखिम संकेत",
        "common.environmentalFlags": "पर्यावरणीय जोखिम संकेत",
        "common.nutritionalAdvice": "पोषण संबंधी सलाह",
        "common.medicationAdvice": "दवा संबंधी सलाह",

        // Home Page
        "home.heroTitle": "ग्रहों की बुद्धिमत्ता के साथ मातृ जीवन की रक्षा।",
        "home.heroSub": "उन्नत मातृ स्वास्थ्य निगरानी जो अदृश्य खतरों का पूर्वानुमान लगाने के लिए वास्तविक समय के प्रदूषण, गर्मी और मौसम डेटा के साथ नैदानिक महत्वपूर्ण सूचनाओं को जोड़ती है।",
        "home.launchAsha": "आशा पोर्टल शुरू करें",
        "home.sectionTitle": "व्यापक जोखिम समन्वय",
        "home.card1Title": "नैदानिक + पर्यावरणीय",
        "home.card1Desc": "हम एक समग्र जोखिम स्कोर उत्पन्न करने के लिए वास्तविक समय एक्यूआई (AQI) और हीट इंडेक्स के साथ बीपी और वजन डेटा को मिलाते हैं।",
        "home.card2Title": "एआई जोखिम समन्वय",
        "home.card2Desc": "हमारी बहु-एजेंट प्रणाली अदृश्य खतरों की निरंतर निगरानी करती है और आशा कार्यकर्ताओं को तुरंत सचेत करती है।",
        "home.card3Title": "निर्बाध समन्वय",
        "home.card3Desc": "आशा कार्यकर्ताओं, डॉक्टरों और एडमिन के लिए एकीकृत पोर्टल यह सुनिश्चित करने के लिए कि कोई भी माँ पीछे न छूटे।",

        // ASHA Dashboard
        "asha.dashboardTitle": "आशा डैशबोर्ड",
        "asha.dashboardSub": "गर्भवती माताओं के प्रोफाइल और आकलन का प्रबंधन करें",
        "asha.searchPlaceholder": "नाम या आईडी से खोजें...",
        "asha.loadingProfiles": "मरीजों की प्रोफाइल लोड हो रही है...",
        "asha.noRecords": "कोई रिकॉर्ड नहीं मिला। कृपया डेटाबेस में जानकारी भरें या नई माता जोड़ें।",
        "asha.newAssessment": "नया स्वास्थ्य आकलन",

        // ASHA Assessment Form
        "assess.title": "स्वास्थ्य आकलन",
        "assess.location": "स्थान",
        "assess.temp": "तापमान",
        "assess.feelsLike": "महसूस होता है",
        "assess.aqi": "वायु गुणवत्ता (AQI)",
        "assess.pmLevels": "PM2.5 स्तर",
        "assess.toxin": "विषाक्त जोखिम",
        "assess.estRisk": "अनुमानित जोखिम",
        "assess.clinicalForm": "क्लिनिकल फॉर्म",
        "assess.bp": "रक्तचाप (BP) (mmHg)",
        "assess.systolic": "सिस्टोलिक (उदा. 120)",
        "assess.diastolic": "डायस्टोलिक (उदा. 80)",
        "assess.weight": "वजन (किलोग्राम)",
        "assess.hemoglobin": "हीमोग्लोबिन (g/dL)",
        "assess.glucose": "रैंडम ग्लूकोज (mg/dL)",
        "assess.symptoms": "अन्य लक्षण / टिप्पणियाँ",
        "assess.symptomsPlaceholder": "सिरदर्द, सूजन, धुंधला दिखना आदि।",
        "assess.analyzing": "एआई विश्लेषक जांच कर रहा है...",
        "assess.runAssessment": "एआई आकलन शुरू करें",
        
        // ASHA Assessment Results
        "assess.resultTitle": "एआई विश्लेषण रिपोर्ट",
        "assess.riskScore": "कुल जोखिम स्कोर",
        "assess.clinicalFlags": "क्लिनिकल जोखिम संकेत",
        "assess.envFlags": "पर्यावरणीय जोखिम मिले",
        "assess.noFlags": "कोई गंभीर जोखिम नहीं पाया गया।",
        "assess.nutAdvice": "पोषण और देखभाल योजना",
        "assess.medAdvice": "दवाएं और अनुस्मारक",
        "assess.consultNote": "परामर्श टिप्पणी",
        "assess.consultationHelper": "एआई जोखिम विश्लेषण के आधार पर मां को दिए गए अपने प्रत्यक्ष अवलोकन और सलाह को दर्ज करें।",
        "assess.consultPlaceholder": "डॉक्टर को भेजने के लिए संदेश या अवलोकन लिखें...",
        "assess.saveNote": "परामर्श टिप्पणी सहेजें",
        "assess.noteSaved": "टिप्पणी सहेज ली गई है और डॉक्टर पोर्टल पर उपलब्ध है!",
        "assess.saving": "सहेज रहा है...",

        // Mother Details Page
        "mother.detailTitle": "मरीज का विवरण",
        "mother.vitalsSummary": "महत्वपूर्ण स्वास्थ्य संकेत",
        "mother.gestationalAge": "गर्भकालीन आयु",
        "mother.gravida": "गर्भावस्था संख्या (Gravida)",
        "mother.lastAssessment": "अंतिम आकलन",
        "mother.updateProfile": "प्रोफ़ाइल अपडेट करें",
        "mother.assessmentsTab": "स्वास्थ्य आकलन",
        "mother.documentsTab": "दस्तावेज़",
        "mother.chatTab": "एआई चैट",
        "mother.historyTitle": "आकलन का इतिहास",
        "mother.noDocs": "अभी तक कोई दस्तावेज़ अपलोड नहीं किया गया है।",
        "mother.uploadReport": "रिपोर्ट अपलोड करें",
        "mother.uploading": "अपलोड हो रहा है...",
        "mother.recordsTitle": "स्वास्थ्य रिकॉर्ड और दस्तावेज़",
        "mother.chatPlaceholder": "मरीज के रिकॉर्ड या पर्यावरण के बारे में कुछ भी पूछें...",
        "mother.patientNotFound": "मरीज नहीं मिला",
        
        // Doctor Portal
        "doctor.dashboardTitle": "डॉक्टर क्लिनिकल कार्यक्षेत्र",
        "doctor.dashboardSub": "पर्यावरणी-नैदानिक जोखिम वर्गीकरण",
        "doctor.activeCases": "सक्रिय मातृ मामले",
        "doctor.riskBreakdown": "पर्यावरण जोखिम विश्लेषण",
        "doctor.envAlerts": "पर्यावरणीय खतरा प्रवाह",
        "doctor.patient": "मरीज",
        "doctor.risk": "जोखिम",
        "doctor.lastVitals": "अंतिम स्वास्थ्य संकेत",
        "doctor.envThreats": "पर्यावरण खतरे",
        "doctor.details": "विवरण देखें",
        "doctor.chatTitle": "आशा कार्यकर्ता / एआई के साथ चैट",
        "doctor.clinicalAlerts": "क्लिनिकल अलर्ट",
        "doctor.recommendations": "डॉक्टर के नैदानिक निर्देश",
        "doctor.recPlaceholder": "नैदानिक निर्देश या दवा पर्ची लिखें...",
        "doctor.saveRec": "निर्देश जारी करें",
        "doctor.recSaved": "निर्देश आशा पोर्टल पर भेज दिए गए हैं!",
        "doctor.environmentalImpact": "ग्रह-पर्यावरण खतरा विश्लेषण",
        "doctor.airTox": "वायु और विषाक्त भार",
        "doctor.heatEx": "गर्मी और थर्मल एक्सपोजर",

        // Admin Portal
        "admin.dashboardTitle": "मातृकवच एआई एडमिन",
        "admin.dashboardSub": "एजेंट सिस्टम और पर्यावरण एकीकरण व्यवस्थापक पैनल",
        "admin.systemStatus": "सिस्टम संचालन स्थिति",
        "admin.totalMothers": "कुल निगरानी माताएं",
        "admin.criticalCases": "चिह्नित गंभीर मामले",
        "admin.envAlertsCount": "सक्रिय पर्यावरण अलर्ट",
        "admin.agentMonitor": "मल्टी-एजेंट सिस्टम मॉनिटर",
        "admin.agentName": "एजेंट का नाम",
        "admin.agentStatus": "स्थिति",
        "admin.agentTask": "वर्तमान कार्य",
        "admin.activeMothers": "सक्रिय माता रजिस्ट्री",
        "admin.seedDatabase": "नमूना डेटा लोड करें",
        "admin.databaseSeeded": "डेटा सफलतापूर्वक लोड हो गया!",
        "admin.seeding": "डेटा लोड हो रहा है...",
        "admin.name": "नाम",
        "admin.gestWeek": "गर्भावस्था सप्ताह",
        "admin.riskLevel": "जोखิม स्तर",
        "admin.score": "स्कोर"
    },
    mr: {
        // Navigation / Header
        "nav.logo": "मातृकवच AI",
        "nav.ashaPortal": "आशा पोर्टल",
        "nav.doctorPortal": "डॉक्टर पोर्टल",
        "nav.admin": "अ‍ॅडमिन",
        "nav.signIn": "साइन इन",
        "nav.signOut": "साइन आउट",
        
        // Footer
        "footer.tagline": "पर्यावरण-जागरूक विश्लेषण",
        "footer.products": "उत्पादने",
        "footer.company": "कंपनी",
        "footer.socials": "सोशल मीडिया",
        "footer.aboutUs": "आमच्याबद्दल",
        "footer.blogs": "ब्लॉग",
        "footer.careers": "करिअर",
        "footer.terms": "सेवा अटी",
        "footer.privacy": "गोपनीयता धोरण",
        "footer.copyright": "कॉपीराईट मातृकवच AI 2026",
        "footer.rights": "सर्व हक्क राखीव, भारतात निर्मित",

        // Common
        "common.loading": "लोड होत आहे...",
        "common.back": "मागे",
        "common.active": "सक्रिय",
        "common.inactive": "निष्क्रिय",
        "common.location": "स्थान",
        "common.age": "वय",
        "common.weeks": "आठवडे",
        "common.submit": "सादर करा",
        "common.cancel": "रद्द करा",
        "common.filter": "फिल्टर",
        "common.status": "स्थिती",
        "common.phone": "फोन",
        "common.action": "कृती",
        "common.delete": "हटवा",
        "common.download": "डाउनलोड",
        "common.save": "जतन करा",
        "common.riskScore": "धोका गुणसंख्या",
        "common.riskLevel": "धोक्याची पातळी",
        "common.clinicalFlags": "वैद्यकीय धोके",
        "common.environmentalFlags": "पर्यावरणीय धोके",
        "common.nutritionalAdvice": "पोषण सल्ला",
        "common.medicationAdvice": "औषधोपचार सल्ला",

        // Home Page
        "home.heroTitle": "ग्रह बुद्धिमत्तेसह मातृ आरोग्याचे रक्षण.",
        "home.heroSub": "अदृश्य धोक्यांचा अंदाज घेण्यासाठी वास्तविक वेळेतील प्रदूषण, उष्णता आणि हवामान डेटासह क्लिनिकल आरोग्य डेटा एकत्रित करणारी प्रगत मातृ आरोग्य देखरेख प्रणाली.",
        "home.launchAsha": "आशा पोर्टल सुरू करा",
        "home.sectionTitle": "सर्वसमावेशक धोका व्यवस्थापन",
        "home.card1Title": "क्लिनिकल + पर्यावरणीय",
        "home.card1Desc": "आम्ही एक समग्र धोका स्कोअर तयार करण्यासाठी रिअल-टाइम एक्यूआय (AQI) आणि हीट इंडेक्ससह रक्तदाब आणि वजन डेटा एकत्र करतो.",
        "home.card2Title": "AI धोका व्यवस्थापन",
        "home.card2Desc": "आमची बहु-एजंट प्रणाली अदृश्य धोक्यांवर सतत लक्ष ठेवते आणि आशा कार्यकर्त्यांना त्वरित सतर्क करते.",
        "home.card3Title": "अखंड समन्वय",
        "home.card3Desc": "कोणतीही माता मागे राहू नये यासाठी आशा कार्यकर्त्या, डॉक्टर आणि अ‍ॅडमिनसाठी एकत्रित पोर्टल.",

        // ASHA Dashboard
        "asha.dashboardTitle": "आशा डॅशबोर्ड",
        "asha.dashboardSub": "मातांचे प्रोफाइल आणि आरोग्य मूल्यमापन व्यवस्थापित करा",
        "asha.searchPlaceholder": "नाव किंवा आयडीने शोधा...",
        "asha.loadingProfiles": "रुग्णांचे प्रोफाइल लोड होत आहेत...",
        "asha.noRecords": "कोणतेही रेकॉर्ड आढळले नाहीत. कृपया डेटाबेस भरा किंवा नवीन माता जोडा.",
        "asha.newAssessment": "नवीन मूल्यांकन",

        // ASHA Assessment Form
        "assess.title": "आरोग्य मूल्यांकन",
        "assess.location": "स्थान",
        "assess.temp": "तापमान",
        "assess.feelsLike": "जाणवणारे तापमान",
        "assess.aqi": "हवेची गुणवत्ता (AQI)",
        "assess.pmLevels": "PM2.5 पातळी",
        "assess.toxin": "विषारी घटकांशी संपर्क",
        "assess.estRisk": "अंदाजित धोका",
        "assess.clinicalForm": "वैद्यकीय माहिती पत्रक",
        "assess.bp": "रक्तदाब (BP) (mmHg)",
        "assess.systolic": "सिस्टोलिक (उदा. 120)",
        "assess.diastolic": "डायस्टोलिक (उदा. 80)",
        "assess.weight": "वजन (किग्रॅ)",
        "assess.hemoglobin": "हिमोग्लोबिन (g/dL)",
        "assess.glucose": "रँडम ग्लुकोज (mg/dL)",
        "assess.symptoms": "इतर लक्षणे / नोंदी",
        "assess.symptomsPlaceholder": "डोकेदुखी, सूज येणे, दृष्टीदोष इ.",
        "assess.analyzing": "एआय विश्लेषक तपासणी करत आहे...",
        "assess.runAssessment": "एआय मूल्यांकन सुरू करा",
        
        // ASHA Assessment Results
        "assess.resultTitle": "एआय विश्लेषण अहवाल",
        "assess.riskScore": "एकूण धोका गुण",
        "assess.clinicalFlags": "क्लिनिकल जोखीम इशारे",
        "assess.envFlags": "पर्यावरणीय जोखीम आढळली",
        "assess.noFlags": "कोणतेही गंभीर धोके आढळले नाहीत.",
        "assess.nutAdvice": "पोषण आणि काळजी योजना",
        "assess.medAdvice": "औषधे आणि स्मरणपत्रे",
        "assess.consultNote": "परामर्श नोंद",
        "assess.consultationHelper": "एआय जोखीम विश्लेषणावर आधारित मातेला दिलेली थेट निरीक्षणे आणि सल्ला नोंदवा.",
        "assess.consultPlaceholder": "डॉक्टरांना पाठवण्यासाठी संदेश किंवा निरीक्षणे लिहा...",
        "assess.saveNote": "परामर्श नोंद जतन करा",
        "assess.noteSaved": "नोंद जतन केली आहे आणि डॉक्टर पोर्टलवर उपलब्ध आहे!",
        "assess.saving": "जतन करत आहे...",

        // Mother Details Page
        "mother.detailTitle": "रुग्णाची माहिती",
        "mother.vitalsSummary": "आरोग्य चिन्हांचा सारांश",
        "mother.gestationalAge": "गर्भधारणेचा काळ",
        "mother.gravida": "गर्भाची संख्या (Gravida)",
        "mother.lastAssessment": "शेवटचे मूल्यांकन",
        "mother.updateProfile": "प्रोफाइल अद्यतनित करा",
        "mother.assessmentsTab": "मूल्यांकन इतिहास",
        "mother.documentsTab": "दस्तऐवज",
        "mother.chatTab": "एआय चॅट",
        "mother.historyTitle": "आरोग्य मूल्यांकन इतिहास",
        "mother.noDocs": "अजून एकही दस्तऐवज अपलोड केलेला नाही.",
        "mother.uploadReport": "रिपोर्ट अपलोड करा",
        "mother.uploading": "अपलोड होत आहे...",
        "mother.recordsTitle": "आरोग्य नोंदी आणि दस्तऐवज",
        "mother.chatPlaceholder": "रुग्णाच्या नोंदी किंवा पर्यावरणाबद्दल काहीही विचारा...",
        "mother.patientNotFound": "रुग्ण आढळला नाही",
        
        // Doctor Portal
        "doctor.dashboardTitle": "डॉक्टर क्लिनिकल वर्कस्पेस",
        "doctor.dashboardSub": "पर्यावरणीय-वैद्यकीय जोखीम वर्गीकरण",
        "doctor.activeCases": "सक्रिय माता रुग्ण",
        "doctor.riskBreakdown": "पर्यावरण धोका विश्लेषण",
        "doctor.envAlerts": "पर्यावरणीय धोका प्रवाह",
        "doctor.patient": "रुग्ण",
        "doctor.risk": "धोका",
        "doctor.lastVitals": "शेवटची आरोग्य चिन्हे",
        "doctor.envThreats": "पर्यावरण धोके",
        "doctor.details": "तपशील पहा",
        "doctor.chatTitle": "आशा कार्यकर्ता / एआय सोबत चॅट",
        "doctor.clinicalAlerts": "क्लिनिकल अलर्ट",
        "doctor.recommendations": "डॉक्टरांचे क्लिनिकल निर्देश",
        "doctor.recPlaceholder": "वैद्यकीय निर्देश किंवा औषधांचे प्रिस्क्रिप्शन लिहा...",
        "doctor.saveRec": "निर्देश जारी करा",
        "doctor.recSaved": "निर्देश आशा पोर्टलवर पाठवले गेले आहेत!",
        "doctor.environmentalImpact": "पर्यावरण-धोका विश्लेषण",
        "doctor.airTox": "हवा आणि विषारी घटक",
        "doctor.heatEx": "उष्णता आणि थर्मल एक्सपोजर",

        // Admin Portal
        "admin.dashboardTitle": "मातृकवच एआय अ‍ॅडमिन",
        "admin.dashboardSub": "एजंट सिस्टीम आणि पर्यावरण एकत्रीकरण नियंत्रण पॅनेल",
        "admin.systemStatus": "प्रणाली कार्यरत स्थिती",
        "admin.totalMothers": "एकूण मातांवर देखरेख",
        "admin.criticalCases": "गंभीर रुग्ण",
        "admin.envAlertsCount": "सक्रिय पर्यावरण इशारे",
        "admin.agentMonitor": "मल्टी-एजंट प्रणाली मॉनिटर",
        "admin.agentName": "एजंट नाव",
        "admin.agentStatus": "स्थिती",
        "admin.agentTask": "सध्याचे काम",
        "admin.activeMothers": "सक्रिय माता नोंदणी",
        "admin.seedDatabase": "नमुना डेटा लोड करा",
        "admin.databaseSeeded": "डेटा यशस्वीरित्या लोड झाला!",
        "admin.seeding": "डेटा लोड होत आहे...",
        "admin.name": "नाव",
        "admin.gestWeek": "गर्भावस्था आठवडा",
        "admin.riskLevel": "धोक्याची पातळी",
        "admin.score": "गुण"
    },
    kn: {
        // Navigation / Header
        "nav.logo": "ಮಾತೃಕವಚ AI",
        "nav.ashaPortal": "ಆಶಾ ಪೋರ್ಟಲ್",
        "nav.doctorPortal": "ವೈದ್ಯರ ಪೋರ್ಟಲ್",
        "nav.admin": "ಅಡ್ಮಿನ್",
        "nav.signIn": "ಸೈನ್ ಇನ್",
        "nav.signOut": "ಸೈನ್ ಔಟ್",
        
        // Footer
        "footer.tagline": "ಪರಿಸರ-ಜಾಗೃತ ವಿಶ್ಲೇಷಣೆ",
        "footer.products": "ಉತ್ಪನ್ನಗಳು",
        "footer.company": "ಸಂಸ್ಥೆ",
        "footer.socials": "ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮ",
        "footer.aboutUs": "ನಮ್ಮ ಬಗ್ಗೆ",
        "footer.blogs": "ಬ್ಲಾಗ್ಸ್",
        "footer.careers": "ವೃತ್ತಿಜೀವನ",
        "footer.terms": "ಸೇವಾ ನಿಯಮಗಳು",
        "footer.privacy": "ಗೌಪ್ಯತಾ ನೀತಿ",
        "footer.copyright": "ಕೃತಿಸ್ವಾಮ್ಯ ಮಾತೃಕವಚ AI 2026",
        "footer.rights": "ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ, ಭಾರತದಲ್ಲಿ ನಿರ್ಮಿಸಲಾಗಿದೆ",

        // Common
        "common.loading": "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
        "common.back": "ಹಿಂದಕ್ಕೆ",
        "common.active": "ಸಕ್ರಿಯ",
        "common.inactive": "ನಿಷ್ಕ್ರಿಯ",
        "common.location": "ಸ್ಥಳ",
        "common.age": "ವಯಸ್ಸು",
        "common.weeks": "ವಾರಗಳು",
        "common.submit": "ಸಲ್ಲಿಸು",
        "common.cancel": "ರದ್ದುಮಾಡು",
        "common.filter": "ಫಿಲ್ಟರ್",
        "common.status": "ಸ್ಥಿತಿ",
        "common.phone": "ದೂರವಾಣಿ",
        "common.action": "ಕ್ರಮ",
        "common.delete": "ಅಳಿಸು",
        "common.download": "ಡೌನ್‌ಲೋಡ್",
        "common.save": "ಉಳಿಸು",
        "common.riskScore": "ಅಪಾಯದ ಸ್ಕೋರ್",
        "common.riskLevel": "ಅಪಾಯದ ಮಟ್ಟ",
        "common.clinicalFlags": "ವೈದ್ಯಕೀಯ ಅಪಾಯದ ಸೂಚನೆಗಳು",
        "common.environmentalFlags": "ಪರಿಸರ ಅಪಾಯದ ಸೂಚನೆಗಳು",
        "common.nutritionalAdvice": "ಪೌಷ್ಟಿಕಾಂಶದ ಸಲಹೆ",
        "common.medicationAdvice": "ಔಷಧಿ ಸಲಹೆ",

        // Home Page
        "home.heroTitle": "ಗ್ರಹಗಳ ಬುದ್ಧಿಮತ್ತೆಯೊಂದಿಗೆ ಮಾತೃತ್ವದ ಪ್ರಾಣ ರಕ್ಷಣೆ.",
        "home.heroSub": "ಅದೃಶ್ಯ ಅಪಾಯಗಳನ್ನು ಮುನ್ಸೂಚಿಸಲು ನೈಜ-ಸಮಯದ ಮಾಲಿನ್ಯ, ಶಾಖ ಮತ್ತು ಹವಾಮಾನ ಡೇಟಾದೊಂದಿಗೆ ವೈದ್ಯಕೀಯ ಮಾಹಿತಿಯನ್ನು ಸಂಯೋಜಿಸುವ ಸುಧಾರಿತ ಮಾತೃ ಆರೋಗ್ಯ ಮೇಲ್ವಿಚಾರಣೆ.",
        "home.launchAsha": "ಆಶಾ ಪೋರ್ಟಲ್ ಪ್ರಾರಂಭಿಸಿ",
        "home.sectionTitle": "ಸಮಗ್ರ ಅಪಾಯ ನಿರ್ವಹಣೆ",
        "home.card1Title": "ವೈದ್ಯಕೀಯ + ಪರಿಸರ",
        "home.card1Desc": "ಸಂಪೂರ್ಣ ಅಪಾಯದ ಸ್ಕೋರ್ ರಚಿಸಲು ನಾವು ರಕ್ತದೊತ್ತಡ ಮತ್ತು ತೂಕದ ಡೇಟಾವನ್ನು ನೈಜ-ಸಮಯದ ಎಕ್ಯೂಐ (AQI) ಮತ್ತು ಹೀಟ್ ಇಂಡೆಕ್ಸ್‌ನೊಂದಿಗೆ ವಿಲೀನಗೊಳಿಸುತ್ತೇವೆ.",
        "home.card2Title": "AI ಅಪಾಯ ನಿರ್ವಹಣೆ",
        "home.card2Desc": "ನಮ್ಮ ಬಹು-ಏಜೆಂಟ್ ವ್ಯವಸ್ಥೆಯು ಅದೃಶ್ಯ ಬೆದರಿಕೆಗಳನ್ನು ನಿರಂತರವಾಗಿ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡುತ್ತದೆ ಮತ್ತು ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯರನ್ನು ತಕ್ಷಣ ಎಚ್ಚರಿಸುತ್ತದೆ.",
        "home.card3Title": "ತಡೆರಹಿತ ಸಮನ್ವಯ",
        "home.card3Desc": "ಯಾವ ತಾಯಿಯೂ ನಿರ್ಲಕ್ಷ್ಯಕ್ಕೆ ಒಳಗಾಗದಂತೆ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯರು, ವೈದ್ಯರು ಮತ್ತು ಅಡ್ಮಿನ್‌ಗಳಿಗಾಗಿ ಏಕೀಕೃತ ಪೋರ್ಟಲ್‌ಗಳು.",

        // ASHA Dashboard
        "asha.dashboardTitle": "ಆಶಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        "asha.dashboardSub": "ಗರ್ಭಿಣಿಯರ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಮೌಲ್ಯಮಾಪನಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
        "asha.searchPlaceholder": "ಹೆಸರು ಅಥವಾ ಐಡಿಯಿಂದ ಹುಡುಕಿ...",
        "asha.loadingProfiles": "ರೋಗಿಗಳ ಪ್ರೊಫೈಲ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
        "asha.noRecords": "ಯಾವುದೇ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಡೇಟಾಬೇಸ್ ತುಂಬಿ ಅಥವಾ ಹೊಸ ತಾಯಿಯನ್ನು ಸೇರಿಸಿ.",
        "asha.newAssessment": "ಹೊಸ ಆರೋಗ್ಯ ಮೌಲ್ಯಮಾಪನ",

        // ASHA Assessment Form
        "assess.title": "ಆರೋಗ್ಯ ಮೌಲ್ಯಮಾಪನ",
        "assess.location": "ಸ್ಥಳ",
        "assess.temp": "ತಾಪಮಾನ",
        "assess.feelsLike": "ಅನಿಸುವ ತಾಪಮಾನ",
        "assess.aqi": "ಗಾಳಿಯ ಗುಣಮಟ್ಟ (AQI)",
        "assess.pmLevels": "PM2.5 ಮಟ್ಟ",
        "assess.toxin": "ವಿಷಕಾರಿ ಮಾಲಿನ್ಯದ ಒಡ್ಡಿಕೆ",
        "assess.estRisk": "ಅಂದಾಜು ಅಪಾಯ",
        "assess.clinicalForm": "ವೈದ್ಯಕೀಯ ನಮೂನೆ",
        "assess.bp": "ರಕ್ತದೊತ್ತಡ (BP) (mmHg)",
        "assess.systolic": "ಸಿಸ್ಟೊಲಿಕ್ (ಉದಾ. 120)",
        "assess.diastolic": "ಡಯಾಸ್ಟೊಲಿಕ್ (ಉದಾ. 80)",
        "assess.weight": "ತೂಕ (ಕೆಜಿ)",
        "assess.hemoglobin": "ಹಿಮೋಗ್ಲೋಬಿನ್ (g/dL)",
        "assess.glucose": "ಗ್ಲೂಕೋಸ್ ಮಟ್ಟ (mg/dL)",
        "assess.symptoms": "ಇತರ ಲಕ್ಷಣಗಳು / ಟಿಪ್ಪಣಿಗಳು",
        "assess.symptomsPlaceholder": "ತಲೆನೋವು, ಊತ, ದೃಷ್ಟಿ ದೋಷ ಇತ್ಯಾದಿ.",
        "assess.analyzing": "AI ವಿಶ್ಲೇಷಕ ಪರಿಶೀಲಿಸುತ್ತಿದೆ...",
        "assess.runAssessment": "AI ಮೌಲ್ಯಮಾಪನ ಪ್ರಾರಂಭಿಸಿ",
        
        // ASHA Assessment Results
        "assess.resultTitle": "AI ವಿಶ್ಲೇಷಣಾ ವರದಿ",
        "assess.riskScore": "ಒಟ್ಟು ಅಪಾಯದ ಸ್ಕೋರ್",
        "assess.clinicalFlags": "ವೈದ್ಯಕೀಯ ಅಪಾಯದ ಧ್ವಜಗಳು",
        "assess.envFlags": "ಪತ್ತೆಯಾದ ಪರಿಸರ ಅಪಾಯಗಳು",
        "assess.noFlags": "ಯಾವುದೇ ಗಂಭೀರ ಅಪಾಯಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
        "assess.nutAdvice": "ಪೌಷ್ಟಿಕಾಂಶ ಮತ್ತು ಆರೈಕೆ ಯೋಜನೆ",
        "assess.medAdvice": "ಔಷಧಿಗಳು आणि ಜ್ಞಾಪನೆಗಳು",
        "assess.consultNote": "ಸಮಾಲೋಚನೆ ಟಿಪ್ಪಣಿ",
        "assess.consultationHelper": "ಎಐ ಅಪಾಯದ ವಿಶ್ಲೇಷಣೆಯ ಆಧಾರದ ಮೇಲೆ ತಾಯಿಗೆ ನೀಡಿದ ನೇರ ಅವলোகನಗಳು ಮತ್ತು ಸಲಹೆಗಳನ್ನು ದಾಖಲಿಸಿ.",
        "assess.consultPlaceholder": "ವೈದ್ಯರಿಗೆ ಕಳುಹಿಸಲು ಸಂದೇಶಗಳು ಅಥವಾ ವೀಕ್ಷಣೆಗಳನ್ನು ಬರೆಯಿರಿ...",
        "assess.saveNote": "ಟಿಪ್ಪಣಿ ಉಳಿಸಿ",
        "assess.noteSaved": "ಟಿಪ್ಪಣಿಯನ್ನು ಉಳಿಸಲಾಗಿದೆ ಮತ್ತು ವೈದ್ಯರ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಲಭ್ಯವಿದೆ!",
        "assess.saving": "ಉಳಿಸಲಾಗುತ್ತಿದೆ...",

        // Mother Details Page
        "mother.detailTitle": "ರೋಗಿಯ ವಿವರಗಳು",
        "mother.vitalsSummary": "ಆರೋಗ್ಯ ಚಿಹ್ನೆಗಳ ಸಾರಾಂಶ",
        "mother.gestationalAge": "ಗರ್ಭಾವಸ್ಥೆಯ ವಯಸ್ಸು",
        "mother.gravida": "ಗರ್ಭಾವಸ್ಥೆಯ ಸಂಖ್ಯೆ (Gravida)",
        "mother.lastAssessment": "ಕೊನೆಯ ಮೌಲ್ಯಮಾಪನ",
        "mother.updateProfile": "ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಿ",
        "mother.assessmentsTab": "ಆರೋಗ್ಯ ಮೌಲ್ಯಮಾಪನಗಳು",
        "mother.documentsTab": "ದಾಖಲೆಗಳು",
        "mother.chatTab": "AI ಚಾಟ್",
        "mother.historyTitle": "ಮೌಲ್ಯಮಾಪನ ಇತಿಹಾಸ",
        "mother.noDocs": "ಇನ್ನೂ ಯಾವುದೇ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿಲ್ಲ.",
        "mother.uploadReport": "ವರದಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
        "mother.uploading": "ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
        "mother.recordsTitle": "ಆರೋಗ್ಯ ದಾಖಲೆಗಳು ಮತ್ತು ಪತ್ರಗಳು",
        "mother.chatPlaceholder": "ರೋಗಿಯ ದಾಖಲೆಗಳು ಅಥವಾ ಪರಿಸರದ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ...",
        "mother.patientNotFound": "ರೋಗಿ ಕಂಡುಬಂದಿಲ್ಲ",
        
        // Doctor Portal
        "doctor.dashboardTitle": "ವೈದ್ಯರ ಕ್ಲಿನಿಕಲ್ ಕಾರ್ಯಕ್ಷೇತ್ರ",
        "doctor.dashboardSub": "ಪರಿಸರ-ವೈದ್ಯಕೀಯ ಅಪಾಯದ ವರ್ಗೀಕರಣ",
        "doctor.activeCases": "ಸಕ್ರಿಯ ಗರ್ಭಿಣಿ ರೋಗಿಗಳು",
        "doctor.riskBreakdown": "ಪರಿಸರ ಅಪಾಯದ ವಿಶ್ಲೇಷಣೆ",
        "doctor.envAlerts": "ಪರಿಸರ ಅಪಾಯದ ಸ್ಟ್ರೀಮ್",
        "doctor.patient": "ರೋಗಿ",
        "doctor.risk": "ಅಪಾಯ",
        "doctor.lastVitals": "ಕೊನೆಯ ಆರೋಗ್ಯ ಚಿಹ್ನೆಗಳು",
        "doctor.envThreats": "ಪರಿಸರ ಬೆದರಿಕೆಗಳು",
        "doctor.details": "ವಿವರಗಳನ್ನು ನೋಡಿ",
        "doctor.chatTitle": "ಆಶಾ ಕಾರ್ಯಕರ್ತೆ / AI ಜೊತೆ ಚಾಟ್",
        "doctor.clinicalAlerts": "ವೈದ್ಯಕೀಯ ಎಚ್ಚರಿಕೆಗಳು",
        "doctor.recommendations": "ವೈದ್ಯರ ಕ್ಲಿನಿಕಲ್ ನಿರ್ದೇಶನ",
        "doctor.recPlaceholder": "ವೈದ್ಯಕೀಯ ನಿರ್ದೇಶನ ಅಥವಾ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಬರೆಯಿರಿ...",
        "doctor.saveRec": "ನಿರ್ದೇಶನ ನೀಡಿ",
        "doctor.recSaved": "ನಿರ್ದೇಶನವನ್ನು ಆಶಾ ಪೋರ್ಟಲ್‌ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ!",
        "doctor.environmentalImpact": "ಗ್ರಹ-ಪರಿಸರ ಅಪಾಯದ ವಿಶ್ಲೇಷಣೆ",
        "doctor.airTox": "ಗಾಳಿ ಮತ್ತು ವಿಷಕಾರಿ ಲೋಡ್",
        "doctor.heatEx": "ಶಾಖ ಮತ್ತು ಉಷ್ಣದ ಒಡ್ಡಿಕೆ",

        // Admin Portal
        "admin.dashboardTitle": "ಮಾತೃಕವಚ AI ಅಡ್ಮಿನ್",
        "admin.dashboardSub": "ಏಜೆಂಟ್ ಸಿಸ್ಟಮ್ ಮತ್ತು ಪರಿಸರ ಏಕೀಕರಣ ನಿರ್ವಹಣೆ ಪ್ಯಾನಲ್",
        "admin.systemStatus": "ವ್ಯವಸ್ಥೆಯ ಕಾರ್ಯಾಚರಣೆಯ ಸ್ಥಿತಿ",
        "admin.totalMothers": "ಒಟ್ಟು ಮೇಲ್ವಿಚಾರಣೆಯಲ್ಲಿರುವ ತಾಯಂದಿರು",
        "admin.criticalCases": "ಗುರುತಿಸಲಾದ ಗಂಭೀರ ಪ್ರಕರಣಗಳು",
        "admin.envAlertsCount": "ಸಕ್ರಿಯ ಪರಿಸರ ಎಚ್ಚರಿಕೆಗಳು",
        "admin.agentMonitor": "ಬಹು-ಏಜೆಂಟ್ ವ್ಯವಸ್ಥೆಯ ಮಾನಿಟರ್",
        "admin.agentName": "ಏಜೆಂಟ್ ಹೆಸರು",
        "admin.agentStatus": "ಸ್ಥಿತಿ",
        "admin.agentTask": "ಪ್ರಸ್ತುತ ಕಾರ್ಯ",
        "admin.activeMothers": "ಸಕ್ರಿಯ ತಾಯಂದಿರ ನೋಂದಣಿ",
        "admin.seedDatabase": "ಮಾದರಿ ಡೇಟಾವನ್ನು ಲೋಡ್ ಮಾಡಿ",
        "admin.databaseSeeded": "ಡೇಟಾವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಲೋಡ್ ಮಾಡಲಾಗಿದೆ!",
        "admin.seeding": "ಡೇಟಾವನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
        "admin.name": "ಹೆಸರು",
        "admin.gestWeek": "ಗರ್ಭಾವಸ್ಥೆಯ ವಾರ",
        "admin.riskLevel": "ಅಪಾಯದ ಮಟ್ಟ",
        "admin.score": "ಸ್ಕೋರ್"
    },
    te: {
        // Navigation / Header
        "nav.logo": "మాతృకవచ్ AI",
        "nav.ashaPortal": "ఆశా పోర్టల్",
        "nav.doctorPortal": "వైద్యుల పోర్టల్",
        "nav.admin": "అడ్మిన్",
        "nav.signIn": "సైన్ ఇన్",
        "nav.signOut": "సైన్ అవుట్",
        
        // Footer
        "footer.tagline": "పర్యావరణ-అవగాహన విశ్లేషణ",
        "footer.products": "ఉత్పత్తులు",
        "footer.company": "కంపెనీ",
        "footer.socials": "సోషల్ మీడియా",
        "footer.aboutUs": "మా గురించి",
        "footer.blogs": "బ్లాగ్స్",
        "footer.careers": "కెరీర్స్",
        "footer.terms": "సేవా నిబంధనలు",
        "footer.privacy": "గోప్యతా విధానం",
        "footer.copyright": "కాపీరైట్ మాతృకవచ్ AI 2026",
        "footer.rights": "అన్ని హక్కులు ప్రత్యేకించబడ్డాయి, భారతదేశంలో నిర్మించబడింది",

        // Common
        "common.loading": "లోడ్ అవుతోంది...",
        "common.back": "వెనుకకు",
        "common.active": "సక్రియం",
        "common.inactive": "నిష్క్రియం",
        "common.location": "ప్రాంతం",
        "common.age": "వయస్సు",
        "common.weeks": "వారాలు",
        "common.submit": "సమర్పించు",
        "common.cancel": "రద్దు చేయి",
        "common.filter": "ఫిల్టర్",
        "common.status": "స్థితి",
        "common.phone": "ఫోన్ నెంబర్",
        "common.action": "చర్య",
        "common.delete": "తొలగించు",
        "common.download": "డೌన్‌లోడ్",
        "common.save": "భద్రపరచు",
        "common.riskScore": "అపాయ గుణకం",
        "common.riskLevel": "అపాయ స్థాయి",
        "common.clinicalFlags": "క్లినికల్ అపాయ సూచికలు",
        "common.environmentalFlags": "పర్యావరణ అపాయ సూచికలు",
        "common.nutritionalAdvice": "పోషకాహార సలహా",
        "common.medicationAdvice": "మందుల సలహా",

        // Home Page
        "home.heroTitle": "గ్రహాల మేధస్సుతో మాతృత్వ రక్షణ.",
        "home.heroSub": "అదృశ్య పర్యావరణ ముప్పులను అంచనా వేయడానికి నైజ సమయ కాలుష్యం, ఉష్ణోగ్రత మరియు వాతావరణ సమాచారంతో క్లినికల్ వైటల్స్‌ను అనుసంధానించే అధునాతన మాతృ ఆరోగ్య పర్యవేక్షణ.",
        "home.launchAsha": "ఆశా పోర్టల్‌ను ప్రారంభించండి",
        "home.sectionTitle": "సమగ్ర అపాయ నిర్వహణ",
        "home.card1Title": "క్లినికల్ + పర్యావరణం",
        "home.card1Desc": "మేము సంపూర్ణ అపాయ స్కోరును లెక్కించడానికి రక్తపోటు మరియు బరువు వివరాలను రియల్-టైమ్ ఏక్యూআই (AQI), హీట్ ఇండెక్స్‌తో అనుసంధానిస్తాము.",
        "home.card2Title": "AI అపాయ నిర్వహణ",
        "home.card2Desc": "మా బహుళ-ఏజెంట్ వ్యవస్థ నిరంతరం పర్యావరణ ముప్పులను పర్యవేక్షిస్తుంది మరియు ఆశా కార్యకర్తలను తక్షణమే అప్రమత్తం చేస్తుంది.",
        "home.card3Title": "సులభమైన సమన్వయం",
        "home.card3Desc": "ఏ తల్లి ఒంటరిగా మిగిలిపోకుండా చూడటానికి ఆశా కార్యకర్తలు, వైద్యులు మరియు అడ్మిన్‌ల కోసం సమగ్ర పోర్టల్స్.",

        // ASHA Dashboard
        "asha.dashboardTitle": "ఆశా డాష్‌బోర్డ్",
        "asha.dashboardSub": "గర్భిణీ తల్లుల ప్రొఫైల్స్ మరియు ఆరోగ్య అంచనాలను నిర్వహించండి",
        "asha.searchPlaceholder": "పేరు లేదా ఐడితో శోధించండి...",
        "asha.loadingProfiles": "రోగుల వివరాలు లోడ్ అవుతున్నాయి...",
        "asha.noRecords": "ఎటువంటి రికార్డులు లభించలేదు. దయచేసి డేటాబేస్ నింపండి లేదా కొత్త తల్లిని చేర్చండి.",
        "asha.newAssessment": "కొత్త ఆరోగ్య అంచనా",

        // ASHA Assessment Form
        "assess.title": "ఆరోగ్య అంచనా",
        "assess.location": "ప్రాంతం",
        "assess.temp": "ఉష్ణోగ్రత",
        "assess.feelsLike": "అనిపించే ఉష్ణోగ్రత",
        "assess.aqi": "గాలి నాణ్యత (AQI)",
        "assess.pmLevels": "PM2.5 స్థాయిలు",
        "assess.toxin": "విషాద కాలుష్య ప్రభావం",
        "assess.estRisk": "అంచనా వేసిన ముప్పు",
        "assess.clinicalForm": "క్లినికల్ ఫారమ్",
        "assess.bp": "రक्तపోటు (BP) (mmHg)",
        "assess.systolic": "సిస్టోలిక్ (ఉదా. 120)",
        "assess.diastolic": "డయాస్టోలిక్ (ఉదా. 80)",
        "assess.weight": "బరువు (కిలోలు)",
        "assess.hemoglobin": "హిమోగ్లోబిన్ (g/dL)",
        "assess.glucose": "గ్లూకోజ్ స్థాయి (mg/dL)",
        "assess.symptoms": "ఇతర లక్షణాలు / గమనికలు",
        "assess.symptomsPlaceholder": "తలనొప్పి, వాపులు, కంటి చూపు సమస్యలు మొదలైనవి.",
        "assess.analyzing": "AI విశ్లేషణ చేస్తోంది...",
        "assess.runAssessment": "AI ఆరోగ్య అంచనాను ప్రారంభించండి",
        
        // ASHA Assessment Results
        "assess.resultTitle": "AI విశ్లేషణ నివేదిక",
        "assess.riskScore": "మొత్తం అపాయ స్కోరు",
        "assess.clinicalFlags": "క్లినికల్ రిస్క్ ఫ్లాగ్స్",
        "assess.envFlags": "పర్యావరణ ముప్పులు గుర్తించబడ్డాయి",
        "assess.noFlags": "ఎటువంటి తీవ్రమైన అపాయాలు గుర్తించబడలేదు.",
        "assess.nutAdvice": "పోషకాహార మరియు సంరక్షణ ప్రణాళిక",
        "assess.medAdvice": "మందులు మరియు రిమైండర్లు",
        "assess.consultNote": "సమాలోచన గమనిక",
        "assess.consultationHelper": "AI రిస్క్ విశ్లేషణ ఆధారంగా తల్లికి ఇచ్చిన ప్రత్యక్ష పరిశీలనలు మరియు సలహాలను రికార్డ్ చేయండి.",
        "assess.consultPlaceholder": "వైద్యునికి పంపడానికి సందేశాలు లేదా పరిశీలనలు రాయండి...",
        "assess.saveNote": "సమాలోచన నోట్ భద్రపరచు",
        "assess.noteSaved": "నోట్ భద్రపరచబడింది మరియు వైద్యుల పోర్టల్‌లో అందుబాటులో ఉంది!",
        "assess.saving": "భద్రపరుస్తోంది...",

        // Mother Details Page
        "mother.detailTitle": "రోగి వివరాలు",
        "mother.vitalsSummary": "ఆరోగ్య సంకేతాల సారాంశం",
        "mother.gestationalAge": "గర్భధారణ వయస్సు",
        "mother.gravida": "గర్భాల సంఖ్య (Gravida)",
        "mother.lastAssessment": "చివరి అంచనా",
        "mother.updateProfile": "ప్రొఫైల్ అప్‌డేట్ చేయి",
        "mother.assessmentsTab": "ఆరోగ్య అంచనాలు",
        "mother.documentsTab": "పత్రాలు",
        "mother.chatTab": "AI తో చాట్",
        "mother.historyTitle": "ఆరోగ్య చరిత్ర",
        "mother.noDocs": "ఇంకా ఎటువంటి పత్రాలు అప్‌లోడ్ చేయలేదు.",
        "mother.uploadReport": "రిపోర్టును అప్‌లోడ్ చేయి",
        "mother.uploading": "అప్‌లోడ్ అవుతోంది...",
        "mother.recordsTitle": "ఆరోగ్య రికార్డులు & పత్రాలు",
        "mother.chatPlaceholder": "రోగి రికార్డులు లేదా పర్యావరణం గురించి ఏదైనా అడగండి...",
        "mother.patientNotFound": "రోగి వివరాలు కనుగొనబడలేదు",
        
        // Doctor Portal
        "doctor.dashboardTitle": "వైద్యుల క్లినికల్ వర్క్‌స్పేస్",
        "doctor.dashboardSub": "పర్యావరణ-క్లినికల్ రిస్క్ వర్గీకరణ",
        "doctor.activeCases": "చికిత్సలో ఉన్న గర్భిణీ రోగులు",
        "doctor.riskBreakdown": "పర్యావరణ అపాయ విశ్లేషణ",
        "doctor.envAlerts": "పర్యావరణ ముప్పుల ప్రవాహం",
        "doctor.patient": "రోగి",
        "doctor.risk": "అపాయం",
        "doctor.lastVitals": "చివరి ఆరోగ్య సంకేతాలు",
        "doctor.envThreats": "పర్యావరణ ముప్పులు",
        "doctor.details": "వివరాలు చూడు",
        "doctor.chatTitle": "ఆశా కార్యకర్త / AI తో సంభాషణ",
        "doctor.clinicalAlerts": "క్లినికల్ అలర్ట్స్",
        "doctor.recommendations": "వైద్యుల క్లినికల్ ఆదేశాలు",
        "doctor.recPlaceholder": "క్లినికల్ ఆదేశాలు లేదా మందుల ప్రిస్క్రిప్షన్ రాయండి...",
        "doctor.saveRec": "ఆదేశం జారీ చేయి",
        "doctor.recSaved": "ఆదేశాలు ఆశా పోర్టల్‌కు పంపబడ్డాయి!",
        "doctor.environmentalImpact": "పర్యావరణ ముప్పుల విశ్లేషణ",
        "doctor.airTox": "గాలి మరియు టాక్సిక్ లోడ్",
        "doctor.heatEx": "వేడి మరియు థర్మల్ ఎక్స్‌పోజర్",

        // Admin Portal
        "admin.dashboardTitle": "మాతృకవచ్ AI అడ్మిన్",
        "admin.dashboardSub": "ఏజెంట్ వ్యవస్థ మరియు పర్యావరణ సమన్వయ నిర్వాహక ప్యానెల్",
        "admin.systemStatus": "వ్యవస్థ పనితీరు స్థితి",
        "admin.totalMothers": "పర్యవేక్షణలో ఉన్న మొత్తం తల్లులు",
        "admin.criticalCases": "గుర్తించిన తీవ్రమైన కేసులు",
        "admin.envAlertsCount": "యాక్టివ్ పర్యావరణ అలర్ట్స్",
        "admin.agentMonitor": "మల్టీ-ఏజెంట్ వ్యవస్థ పర్యవేక్షణ",
        "admin.agentName": "ఏజెంట్ పేరు",
        "admin.agentStatus": "స్థితి",
        "admin.agentTask": "ప్రస్తుత పని",
        "admin.activeMothers": "యాక్టివ్ తల్లుల రిజిస్ట్రీ",
        "admin.seedDatabase": "నమూనా డేటాను లోడ్ చేయి",
        "admin.databaseSeeded": "డేటా విజయవంతంగా లోడ్ చేయబడింది!",
        "admin.seeding": "డేటా లోడ్ అవుతోంది...",
        "admin.name": "పేరు",
        "admin.gestWeek": "గర్భధారణ వారం",
        "admin.riskLevel": "అపాయ స్థాయి",
        "admin.score": "స్కోరు"
    },
    ta: {
        // Navigation / Header
        "nav.logo": "மாத்ருகவச் AI",
        "nav.ashaPortal": "ஆஷா போர்ட்டல்",
        "nav.doctorPortal": "மருத்துவர் போர்ட்டல்",
        "nav.admin": "அட்மின்",
        "nav.signIn": "உள்நுழைக",
        "nav.signOut": "வெளியேறுக",
        
        // Footer
        "footer.tagline": "சுற்றுச்சூழல் விழிப்புணர்வு பகுப்பாய்வு",
        "footer.products": "தயாரிப்புகள்",
        "footer.company": "நிறுவனம்",
        "footer.socials": "சமூக ஊடகம்",
        "footer.aboutUs": "எங்களைப் பற்றி",
        "footer.blogs": "வலைப்பதிவுகள்",
        "footer.careers": "வேலைவாய்ப்புகள்",
        "footer.terms": "சேவை விதிமுறைகள்",
        "footer.privacy": "தனியுரிமைக் கொள்கை",
        "footer.copyright": "பதிப்புரிமை மாத்ருகவச் AI 2026",
        "footer.rights": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை, இந்தியாவில் தயாரிக்கப்பட்டது",

        // Common
        "common.loading": "ஏற்றப்படுகிறது...",
        "common.back": "பின்னால்",
        "common.active": "செயலில் உள்ள",
        "common.inactive": "செயலற்ற",
        "common.location": "இடம்",
        "common.age": "வயது",
        "common.weeks": "வாரங்கள்",
        "common.submit": "சமர்ப்பி",
        "common.cancel": "ரத்துசெய்",
        "common.filter": "வடிகட்டி",
        "common.status": "நிலை",
        "common.phone": "தொலைபேசி",
        "common.action": "செயல்",
        "common.delete": "நீக்கு",
        "common.download": "பதிவிறக்கு",
        "common.save": "சேமி",
        "common.riskScore": "அபாய மதிப்பீடு",
        "common.riskLevel": "அபாய நிலை",
        "common.clinicalFlags": "மருத்துவ ஆபத்து குறிகள்",
        "common.environmentalFlags": "சுற்றுச்சூழல் ஆபத்து குறிகள்",
        "common.nutritionalAdvice": "ஊட்டச்சத்து ஆலோசனை",
        "common.medicationAdvice": "மருந்து ஆலோசனை",

        // Home Page
        "home.heroTitle": "பிரபஞ்ச புத்தி கூர்மையுடன் தாய்மை ஆரோக்கியத்தை பாதுகாத்தல்.",
        "home.heroSub": "கண்ணுக்குத் தெரியாத ஆபத்துகளைக் கணிக்க, மருத்துவ முக்கிய அறிகுறிகளை நிகழ்நேர காற்று மாசுபாடு, வெப்பம் மற்றும் வானிலை தரவுகளுடன் இணைக்கும் மேம்பட்ட தாய்வழி சுகாதார கண்காணிப்பு.",
        "home.launchAsha": "ஆஷா போர்ட்டலைத் தொடங்குங்கள்",
        "home.sectionTitle": "விரிவான அபாய மேலாண்மை",
        "home.card1Title": "மருத்துவ மற்றும் சுற்றுச்சூழல்",
        "home.card1Desc": "முழுமையான அபாய மதிப்பெண்ணை உருவாக்க இரத்த அழுத்தம் மற்றும் எடை தரவுகளை நிகழ்நேர ஏகியூஐ (AQI) மற்றும் வெப்பக் குறியீட்டுடன் இணைக்கிறோம்.",
        "home.card2Title": "AI அபாய மேலாண்மை",
        "home.card2Desc": "எங்கள் பல முகவர் அமைப்பு கண்ணுக்குத் தெரியாத அச்சுறுத்தல்களைத் தொடர்ந்து கண்காணித்து ஆஷா பணியாளர்களை உடனடியாக எச்சரிக்கிறது.",
        "home.card3Title": "தடையற்ற ஒருங்கிணைப்பு",
        "home.card3Desc": "எந்தத் தாயும் விடுபடாமல் இருப்பதை உறுதி செய்ய ஆஷா பணியாளர்கள், மருத்துவர்கள் மற்றும் அட்மின்களுக்கான ஒருங்கிணைந்த போர்ட்டல்கள்.",

        // ASHA Dashboard
        "asha.dashboardTitle": "ஆஷா டாஷ்போர்டு",
        "asha.dashboardSub": "தாய்களின் சுயவிவரங்கள் மற்றும் சுகாதார மதிப்பீடுகளை நிர்வகிக்கவும்",
        "asha.searchPlaceholder": "பெயர் அல்லது ஐடி மூலம் தேடுக...",
        "asha.loadingProfiles": "நோயாளிகளின் சுயவிவரங்கள் ஏற்றப்படுகின்றன...",
        "asha.noRecords": "பதிவுகள் எதுவும் கிடைக்கவில்லை. தரவுத்தளத்தை நிரப்பவும் அல்லது புதிய தாயைச் சேர்க்கவும்.",
        "asha.newAssessment": "புதிய சுகாதார மதிப்பீடு",

        // ASHA Assessment Form
        "assess.title": "சுகாதார மதிப்பீடு",
        "assess.location": "இடம்",
        "assess.temp": "வெப்பநிலை",
        "assess.feelsLike": "உணரப்படும் வெப்பநிலை",
        "assess.aqi": "காற்றின் தரம் (AQI)",
        "assess.pmLevels": "PM2.5 அளவுகள்",
        "assess.toxin": "நச்சு வெளிப்பாடு",
        "assess.estRisk": "மதிப்பிடப்பட்ட ஆபத்து",
        "assess.clinicalForm": "மருத்துவப் படிவம்",
        "assess.bp": "இரத்த அழுத்தம் (BP) (mmHg)",
        "assess.systolic": "சிஸ்டாலிக் (எ.கா. 120)",
        "assess.diastolic": "டயஸ்டாலிக் (எ.கா. 80)",
        "assess.weight": "எடை (கிலோ)",
        "assess.hemoglobin": "ஹீமோகுளோபின் (g/dL)",
        "assess.glucose": "சர்க்கரை அளவு (mg/dL)",
        "assess.symptoms": "இதர அறிகுறிகள் / குறிப்புகள்",
        "assess.symptomsPlaceholder": "தலைவலி, வீக்கம், பார்வை குறைப்பாடு போன்றவை.",
        "assess.analyzing": "AI பகுப்பாய்வு செய்கிறது...",
        "assess.runAssessment": "AI சுகாதார மதிப்பீட்டைத் தொடங்கு",
        
        // ASHA Assessment Results
        "assess.resultTitle": "AI பகுப்பாய்வு அறிக்கை",
        "assess.riskScore": "ஒட்டுமொத்த அபாய மதிப்பீடு",
        "assess.clinicalFlags": "மருத்துவ அபாயக் குறிகள்",
        "assess.envFlags": "கண்டறியப்பட்ட சுற்றுச்சூழல் அபாயங்கள்",
        "assess.noFlags": "முக்கியமான ஆபத்துகள் எதுவும் கண்டறியப்படவில்லை.",
        "assess.nutAdvice": "ஊட்டச்சத்து மற்றும் பராமரிப்பு திட்டம்",
        "assess.medAdvice": "மருந்துகள் மற்றும் நினைவூட்டல்கள்",
        "assess.consultNote": "ஆலோசனைக் குறிப்பு",
        "assess.consultationHelper": "AI இடர் பகுப்பாய்வின் அடிப்படையில் தாய்க்கு வழங்கப்பட்ட நேரடி அவதானிப்புகள் மற்றும் ஆலோசனைகளைப் பதிவு செய்யவும்.",
        "assess.consultPlaceholder": "மருத்துவருக்கு அனுப்ப வேண்டிய செய்திகள் அல்லது அவதானிப்புகளை எழுதுங்கள்...",
        "assess.saveNote": "ஆலோசனைக் குறிப்பைச் சேமி",
        "assess.noteSaved": "குறிப்பு சேமிக்கப்பட்டு மருத்துவர் போர்ட்டலுடன் இணைக்கப்பட்டுள்ளது!",
        "assess.saving": "சேமிக்கப்படுகிறது...",

        // Mother Details Page
        "mother.detailTitle": "நோயாளி ವಿವರங்கள்",
        "mother.vitalsSummary": "முக்கிய சுகாதார அறிகுறிகள்",
        "mother.gestationalAge": "கர்ப்ப காலம்",
        "mother.gravida": "கர்ப்பங்களின் எண்ணிக்கை (Gravida)",
        "mother.lastAssessment": "கடைசி மதிப்பீடு",
        "mother.updateProfile": "சுயவிவரத்தை புதுப்பி",
        "mother.assessmentsTab": "சுகாதார மதிப்பீடுகள்",
        "mother.documentsTab": "ஆவணங்கள்",
        "mother.chatTab": "AI அரட்டை",
        "mother.historyTitle": "மதிப்பீட்டு வரலாறு",
        "mother.noDocs": "இதுவரை ஆவணங்கள் எதுவும் பதிவேற்றப்படவில்லை.",
        "mother.uploadReport": "அறிக்கையைப் பதிவேற்று",
        "mother.uploading": "பதிவேற்றப்படுகிறது...",
        "mother.recordsTitle": "சுகாதார பதிவுகள் & ஆவணங்கள்",
        "mother.chatPlaceholder": "நோயாளியின் பதிவுகள் அல்லது சுற்றுச்சூழல் பற்றி ஏதேனும் கேளுங்கள்...",
        "mother.patientNotFound": "நோயாளி கண்டறியப்படவில்லை",
        
        // Doctor Portal
        "doctor.dashboardTitle": "மருத்துவர் மருத்துவ பணிமனை",
        "doctor.dashboardSub": "சுற்றுச்சூழல்-மருத்துவ அபாய வகைப்பாடு",
        "doctor.activeCases": "சிகிச்சையில் உள்ள தாய்கள்",
        "doctor.riskBreakdown": "சுற்றுச்சூழல் ஆபத்து பகுப்பாய்வு",
        "doctor.envAlerts": "சுற்றுச்சூழல் அச்சுறுத்தல் ஓட்டம்",
        "doctor.patient": "நோயாளி",
        "doctor.risk": "அபாயம்",
        "doctor.lastVitals": "கடைசி சுகாதார அறிகுறிகள்",
        "doctor.envThreats": "சுற்றுச்சூழல் அச்சுறுத்தல்கள்",
        "doctor.details": "விவரங்களை காண்",
        "doctor.chatTitle": "ஆஷா பணியாளர் / AI உடன் அரட்டை",
        "doctor.clinicalAlerts": "மருத்துவ எச்சரிக்கைகள்",
        "doctor.recommendations": "மருத்துவரின் மருத்துவ உத்தரவு",
        "doctor.recPlaceholder": "மருத்துவ உத்தரவு அல்லது மருந்துச் சீட்டை எழுதவும்...",
        "doctor.saveRec": "உத்தரவை வெளியிடுக",
        "doctor.recSaved": "உத்தரவு ஆஷா போர்ட்டலுக்கு அனுப்பப்பட்டது!",
        "doctor.environmentalImpact": "சுற்றுச்சூழல் அச்சுறுத்தல் பகுப்பாய்வு",
        "doctor.airTox": "காற்று மற்றும் நச்சு சுமை",
        "doctor.heatEx": "வெப்பம் மற்றும் வெப்ப வெளிப்பாடு",

        // Admin Portal
        "admin.dashboardTitle": "மாத்ருகவச் AI அட்மின்",
        "admin.dashboardSub": "முகவர் அமைப்பு மற்றும் சுற்றுச்சூழல் ஒருங்கிணைப்பு நிர்வாக குழு",
        "admin.systemStatus": "கணினி செயல்பாட்டு நிலை",
        "admin.totalMothers": "கண்காணிக்கப்படும் மொத்த தாய்கள்",
        "admin.criticalCases": "கண்டறியப்பட்ட ஆபத்தான வழக்குகள்",
        "admin.envAlertsCount": "செயலில் உள்ள சுற்றுச்சூழல் எச்சரிக்கைகள்",
        "admin.agentMonitor": "பல முகவர் அமைப்பு கண்காணிப்பு",
        "admin.agentName": "முகவர் பெயர்",
        "admin.agentStatus": "நிலை",
        "admin.agentTask": "தற்போதைய பணி",
        "admin.activeMothers": "செயலில் உள்ள தாய்கள் பதிவேடு",
        "admin.seedDatabase": "மாதிரி தரவை ஏற்றுக",
        "admin.databaseSeeded": "தரவு வெற்றிகரமாக ஏற்றப்பட்டது!",
        "admin.seeding": "தரவு ஏற்றப்படுகிறது...",
        "admin.name": "பெயர்",
        "admin.gestWeek": "கர்ப்ப வாரம்",
        "admin.riskLevel": "அபாய நிலை",
        "admin.score": "மதிப்பெண்"
    },
    bn: {
        // Navigation / Header
        "nav.logo": "মাতৃকবচ AI",
        "nav.ashaPortal": "আশা পোর্টাল",
        "nav.doctorPortal": "ডাক্তার পোর্টাল",
        "nav.admin": "অ্যাডমিন",
        "nav.signIn": "সাইন ইন",
        "nav.signOut": "সাইন আউট",
        
        // Footer
        "footer.tagline": "পরিবেশ-সচেতন বিশ্লেষণ",
        "footer.products": "পণ্যসমূহ",
        "footer.company": "কোম্পানি",
        "footer.socials": "সোশ্যাল মিডিয়া",
        "footer.aboutUs": "আমাদের সম্পর্কে",
        "footer.blogs": "ব্লগ",
        "footer.careers": "ক্যারিয়ার",
        "footer.terms": "পরিষেবার শর্তাবলী",
        "footer.privacy": "গোপনীয়তা নীতি",
        "footer.copyright": "কপিরাইট মাতৃকবচ AI 2026",
        "footer.rights": "সর্বস্বত্ব সংরক্ষিত, ভারতে তৈরি",

        // Common
        "common.loading": "লোড হচ্ছে...",
        "common.back": "ফিরে যান",
        "common.active": "সক্রিয়",
        "common.inactive": "নিষ্ক্রিয়",
        "common.location": "স্থান",
        "common.age": "বয়স",
        "common.weeks": "সপ্তাহ",
        "common.submit": "জমা দিন",
        "common.cancel": "বাতিল করুন",
        "common.filter": "ফিল্টার",
        "common.status": "অবস্থা",
        "common.phone": "ফোন নম্বর",
        "common.action": "পদক্ষেপ",
        "common.delete": "মুছে ফেলুন",
        "common.download": "ডাউনলোড",
        "common.save": "সংরक्षण করুন",
        "common.riskScore": "ঝুঁকি স্কোর",
        "common.riskLevel": "ঝুঁকি স্তর",
        "common.clinicalFlags": "ক্লিনিকাল ঝুঁকি সংকেত",
        "common.environmentalFlags": "পরিবেশগত ঝুঁকি সংকেত",
        "common.nutritionalAdvice": "পুষ্টি সংক্রান্ত পরামর্শ",
        "common.medicationAdvice": "ওষুধ সংক্রান্ত পরামর্শ",

        // Home Page
        "home.heroTitle": "মহাজাগতিক বুদ্ধিমত্তার সাথে মাতৃস্বাস্থ্য রক্ষা।",
        "home.heroSub": "অদৃশ্য পরিবেশগত ঝুঁকিগুলি অনুমান করতে ক্লিনিকাল ভাইটালগুলির সাথে রিয়েল-টাইম দূষণ, তাপমাত্রা এবং আবহাওয়ার ডেটা একত্রিত করে উন্নত মাতৃস্বাস্থ্য পর্যবেক্ষণ ব্যবস্থা।",
        "home.launchAsha": "আশা পোর্টাল শুরু করুন",
        "home.sectionTitle": "ব্যাপক ঝুঁকি সমন্বয়",
        "home.card1Title": "ক্লিনিকাল + পরিবেশগত",
        "home.card1Desc": "আমরা একটি সামগ্রিক ঝুঁকি স্কোর তৈরি করতে রিয়েল-টাইম একিউআই (AQI) এবং হিট ইনডেক্সের সাথে রক্তচাপ এবং ওজনের ডেটা একত্রিত করি।",
        "home.card2Title": "AI ঝুঁকি সমন্বয়",
        "home.card2Desc": "আমাদের মাল্টি-এজেন্ট সিস্টেম ক্রমাগত অদৃশ্য হুমকিগুলির উপর নজর রাখে এবং আশা কর্মীদের অবিলম্বে সতর্ক করে।",
        "home.card3Title": "নিরবচ্ছিন্ন সমন্বয়",
        "home.card3Desc": "আশা কর্মী, ডাক্তার এবং অ্যাডমিনদের জন্য সমন্বিত পোর্টাল যাতে কোনও মা অবহেলিত না থাকেন।",

        // ASHA Dashboard
        "asha.dashboardTitle": "আশা ড্যাশবোর্ড",
        "asha.dashboardSub": "গর্ভবতী মায়েদের প্রোফাইল এবং স্বাস্থ্য মূল্যায়ন পরিচালনা করুন",
        "asha.searchPlaceholder": "নাম বা আইডি দিয়ে খুঁজুন...",
        "asha.loadingProfiles": "রোগীদের প্রোফাইল লোড হচ্ছে...",
        "asha.noRecords": "কোনো রেকর্ড পাওয়া যায়নি। অনুগ্রহ করে ডাটাবেস পূরণ করুন বা নতুন মা যোগ করুন।",
        "asha.newAssessment": "নতুন স্বাস্থ্য মূল্যায়ন",

        // ASHA Assessment Form
        "assess.title": "স্বাস্থ্য মূল্যায়ন",
        "assess.location": "স্থান",
        "assess.temp": "তাপমাত্রা",
        "assess.feelsLike": "অনুভূত তাপমাত্রা",
        "assess.aqi": "বাতাসের মান (AQI)",
        "assess.pmLevels": "PM2.5 স্তর",
        "assess.toxin": "বিষাক্ত দূষণ প্রভাব",
        "assess.estRisk": "আনুমানিক ঝুঁকি",
        "assess.clinicalForm": "ক্লিনিকাল ফর্ম",
        "assess.bp": "রক্তচাপ (BP) (mmHg)",
        "assess.systolic": "সিস্টোলিক (যেমন ১২০)",
        "assess.diastolic": "ডায়াস্টোলিক (যেমন ৮০)",
        "assess.weight": "ওজন (কেজি)",
        "assess.hemoglobin": "হিমোগ্লোবিন (g/dL)",
        "assess.glucose": "র্যান্ডম গ্লুকোজ (mg/dL)",
        "assess.symptoms": "অন্যান্য উপসর্গ / মন্তব্য",
        "assess.symptomsPlaceholder": "মাথাব্যথা, ফোলাভাব, ঝাপসা দেখা ইত্যাদি।",
        "assess.analyzing": "AI বিশ্লেষণ করছে...",
        "assess.runAssessment": "AI স্বাস্থ্য মূল্যায়ন শুরু করুন",
        
        // ASHA Assessment Results
        "assess.resultTitle": "AI বিশ্লেষণ রিপোর্ট",
        "assess.riskScore": "মোট ঝুঁকি স্কোর",
        "assess.clinicalFlags": "ক্লিনিকাল ঝুঁকি সংকেতসমূহ",
        "assess.envFlags": "পরিবেশগত ঝুঁকি চিহ্নিত",
        "assess.noFlags": "কোনো গুরুতর ঝুঁকি পাওয়া যায়নি।",
        "assess.nutAdvice": "পুষ্টি ও যত্ন পরিকল্পনা",
        "assess.medAdvice": "ওষুধ এবং অনুস্মারক",
        "assess.consultNote": "পরামর্শ মন্তব্য",
        "assess.consultationHelper": "AI ঝুঁকি বিশ্লেষণের উপর ভিত্তি করে মাকে দেওয়া আপনার প্রত্যক্ষ পর্যবেক্ষণ এবং পরামর্শ রেকর্ড করুন।",
        "assess.consultPlaceholder": "ডাক্তারকে পাঠানোর জন্য বার্তা বা পর্যবেক্ষণ লিখুন...",
        "assess.saveNote": "পরামর্শ মন্তব্য সংরক্ষণ করুন",
        "assess.noteSaved": "মন্তব্যটি সংরক্ষিত হয়েছে এবং ডাক্তার পোর্টালে উপলব্ধ করা হয়েছে!",
        "assess.saving": "সংরক্ষণ করা হচ্ছে...",

        // Mother Details Page
        "mother.detailTitle": "রোগীর বিবরণ",
        "mother.vitalsSummary": "গুরুত্বপূর্ণ স্বাস্থ্য লক্ষণ",
        "mother.gestationalAge": "গর্ভধারণের সময়",
        "mother.gravida": "গর্ভধারণ সংখ্যা (Gravida)",
        "mother.lastAssessment": "সর্বশেষ মূল্যায়ন",
        "mother.updateProfile": "প্রোফাইল আপডেট করুন",
        "mother.assessmentsTab": "স্বাস্থ্য মূল্যায়নসমূহ",
        "mother.documentsTab": "নথিপত্র",
        "mother.chatTab": "AI চ্যাট",
        "mother.historyTitle": "মূল্যায়নের ইতিহাস",
        "mother.noDocs": "এখনও কোনও নথিপত্র আপলোড করা হয়নি।",
        "mother.uploadReport": "রিপোর্ট আপলোড করুন",
        "mother.uploading": "আপলোড হচ্ছে...",
        "mother.recordsTitle": "স্বাস্থ্য রেকর্ড ও নথিপত্র",
        "mother.chatPlaceholder": "রোগীর রেকর্ড বা পরিবেশ সম্পর্কে যেকোনো প্রশ্ন জিজ্ঞাসা করুন...",
        "mother.patientNotFound": "রোগী পাওয়া যায়নি",
        
        // Doctor Portal
        "doctor.dashboardTitle": "ডাক্তার ক্লিনিকাল ওয়ার্কস্পেস",
        "doctor.dashboardSub": "পরিবেশগত-ক্লিনিকাল ঝুঁকি শ্রেণীকরণ",
        "doctor.activeCases": "চিকিৎসাধীন গর্ভবতী মায়েরা",
        "doctor.riskBreakdown": "পরিবেশগত ঝুঁকি বিশ্লেষণ",
        "doctor.envAlerts": "পরিবেশগত হুমকি ধারা",
        "doctor.patient": "রোগী",
        "doctor.risk": "ঝুঁকি",
        "doctor.lastVitals": "সর্বশেষ গুরুত্বপূর্ণ স্বাস্থ্য লক্ষণ",
        "doctor.envThreats": "পরিবেশগত হুমকি",
        "doctor.details": "বিস্তারিত দেখুন",
        "doctor.chatTitle": "আশা কর্মী / AI এর সাথে চ্যাট",
        "doctor.clinicalAlerts": "ক্লিনিকাল অ্যালার্ট",
        "doctor.recommendations": "ডাক্তারের ক্লিনিকাল নির্দেশিকা",
        "doctor.recPlaceholder": "ক্লিনিকাল নির্দেশিকা বা ওষুধের প্রেসক্রিপশন লিখুন...",
        "doctor.saveRec": "নির্দেশিকা জারি করুন",
        "doctor.recSaved": "নির্দেশিকা আশা পোর্টালে পাঠানো হয়েছে!",
        "doctor.environmentalImpact": "পরিবেশগত হুমকি বিশ্লেষণ",
        "doctor.airTox": "বাতাস ও বিষাক্ত লোড",
        "doctor.heatEx": "তাপমাত্রা ও থার্মাল এক্সপোজার",

        // Admin Portal
        "admin.dashboardTitle": "মাতৃকবচ AI অ্যাডমিন",
        "admin.dashboardSub": "এজেন্ট সিস্টেম ও পরিবেশ সমন্বয় নিয়ন্ত্রণ প্যানেল",
        "admin.systemStatus": "সিস্টেমের কার্যকারিতা অবস্থা",
        "admin.totalMothers": "মোট চিকিৎসাধীন মায়েরা",
        "admin.criticalCases": "চিহ্নিত গুরুতর রোগী",
        "admin.envAlertsCount": "সক্রিয় পরিবেশগত অ্যালার্ট",
        "admin.agentMonitor": "মাল্টি-এজেন্ট সিস্টেম মনিটর",
        "admin.agentName": "এজেন্ট নাম",
        "admin.agentStatus": "অবস্থা",
        "admin.agentTask": "বর্তমান কাজ",
        "admin.activeMothers": "সক্রিয় মায়েদের তালিকা",
        "admin.seedDatabase": "নমুনা ডেটা লোড করুন",
        "admin.databaseSeeded": "ডেটা সফলভাবে লোড হয়েছে!",
        "admin.seeding": "ডেটা লোড হচ্ছে...",
        "admin.name": "নাম",
        "admin.gestWeek": "গর্ভধারণ সপ্তাহ",
        "admin.riskLevel": "ঝুঁকি স্তর",
        "admin.score": "স্কোর"
    }
};

const numDigits: Record<Language, string[]> = {
    en: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    hi: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
    mr: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
    kn: ["೦", "೧", "೨", "೩", "೪", "೫", "೬", "೭", "೮", "೯"],
    te: ["౦", "౧", "౨", "౩", "౪", "౫", "౬", "౭", "౮", "౯"],
    ta: ["௦", "௧", "௨", "௩", "௪", "௫", "௬", "௭", "௮", "௯"],
    bn: ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]
};

export function translateDynamic(text: string, lang: Language): string {
    if (!text) return text;
    const cleanText = text.trim().replace(/^"|"$/g, "");

    // Split compound strings (e.g. "Obstetrician • 9876543210" or "Dombivli • 9876543220")
    if (cleanText.includes(" • ")) {
        return cleanText.split(" • ").map(part => translateDynamic(part, lang)).join(" • ");
    }

    const mappings: Record<string, Record<string, string>> = {
        "Empowering Frontline Care with AI-Driven Maternal Health Intelligence": {
            en: "Empowering Frontline Care with AI-Driven Maternal Health Intelligence",
            hi: "एआई-संचालित मातृ स्वास्थ्य बुद्धिमत्ता के साथ अग्रिम पंक्ति की देखभाल को सशक्त बनाना",
            mr: "एआय-चालित मातृ आरोग्य बुद्धिमत्तेसह अग्रभागी काळजी सक्षम करणे",
            kn: "AI-ಚಾಲಿತ ಮಾತೃತ್ವ ಆರೋಗ್ಯ ಬುದ್ಧಿಮತ್ತೆಯೊಂದಿಗೆ ಮುಂಚೂಣಿ ಆರೈಕೆಯನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು",
            te: "AI-ఆధారిత మాతృ ఆరోగ్య మేధస్సుతో ఫ్రంట్‌లైన్ సంరక్షణను బలోపేతం చేయడం",
            ta: "AI-உந்துதல் தாய்வழி சுகாதார நுண்ணறிவுடன் முன்களப் பாதுகாப்பை மேம்படுத்துதல்",
            bn: "এআই-চালিত মাতৃস্বাস্থ্য বুদ্ধিমত্তার সাথে ফ্রন্টলাইন কেয়ারকে শক্তিশালী করা"
        },
        "A comprehensive public health platform integrating clinical vitals, real-time planetary exposures, voice intake, FHIR EHR syncs, and OR-Tools route optimizations to connect mothers, doctors, and ASHA workers.": {
            en: "A comprehensive public health platform integrating clinical vitals, real-time planetary exposures, voice intake, FHIR EHR syncs, and OR-Tools route optimizations to connect mothers, doctors, and ASHA workers.",
            hi: "माताओं, डॉक्टरों और आशा कार्यकर्ताओं को जोड़ने के लिए नैदानिक ​​महत्वपूर्ण अंगों, वास्तविक समय के ग्रहीय जोखिमों, आवाज सेवन, FHIR EHR सिंक और OR-Tools मार्ग अनुकूलन को एकीकृत करने वाला एक व्यापक सार्वजनिक स्वास्थ्य मंच।",
            mr: "माता, डॉक्टर आणि आशा कार्यकर्त्यांना जोडण्यासाठी क्लिनिकल वाइटल्स, रिअल-टाइम पर्यावरणीय एक्सपोजर, व्हॉइस इनटेक, FHIR EHR सिंक आणि OR-Tools मार्ग ऑप्टिमायझेशन एकत्रित करणारे एक व्यापक सार्वजनिक आरोग्य व्यासपीठ.",
            kn: "ತಾಯಂದಿರು, ವೈದ್ಯರು ಮತ್ತು ಆಶಾ ಕಾರ್ಯಕರ್ತರನ್ನು ಸಂಪರ್ಕಿಸಲು ಕ್ಲಿನಿಕಲ್ ವೈಟಲ್ಸ್, ನೈಜ-ಸಮಯದ ಗ್ರಹಗಳ ಒಡ್ಡುವಿಕೆಗಳು, ಧ್ವನಿ ಸೇವನೆ, FHIR EHR ಸಿಂಕ್‌ಗಳು ಮತ್ತು OR-ಟೂಲ್ಸ್ ಮಾರ್ಗ ಆಪ್ಟಿಮೈಸೇಶನ್‌ಗಳನ್ನು ಸಂಯೋಜಿಸುವ ಸಮಗ್ರ ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ವೇದಿಕೆ.",
            te: "తల్లులు, వైద్యులు మరియు ఆశా కార్యకర్తలను అనుసంధానించడానికి క్లినికల్ వైటల్స్, నిజ-సమయ గ్రహ ఎక్స్పోజర్‌లు, వాయిస్ ఇన్‌టేక్, FHIR EHR సింక్‌లు మరియు OR-టూల్స్ రూట్ ఆప్టిమైజేషన్‌లను అనుసంధానించే సమగ్ర ప్రజారోగ్య వేదక.",
            ta: "தாய்மார்கள், மருத்துவர்கள் மற்றும் ஆஷா பணியாளர்களை இணைக்க மருத்துவ முக்கிய அம்சங்கள், நிகழ்நேர கிரக வெளிப்பாடுகள், குரல் உட்கொள்ளல், FHIR EHR ஒத்திசைவுகள் மற்றும் OR-கருவிகள் வழி உகப்பாக்கல்களை ஒருங்கிணைக்கும் ஒரு விரிவான பொது சுகாதார தளம்.",
            bn: "মা, ডাক্তার এবং আশা কর্মীদের সংযুক্ত করতে ক্লিনিকাল ভাইটাল, রিয়েল-টাইম প্ল্যানেটারি এক্সপোজার, ভয়েস ইনটেক, FHIR EHR সিঙ্ক এবং OR-টুলস রুট অপ্টিমাইজেশানকে একীভূতকারী একটি ব্যাপক জনস্বাস্থ্য প্ল্যাটফর্ম।"
        },
        "About MatruKavach AI": {
            en: "About MatruKavach AI",
            hi: "मातृकवच एआई के बारे में",
            mr: "मातृकवच एआय बद्दल",
            kn: "ಮಾतೃಕವಚ AI ಬಗ್ಗೆ",
            te: "మాతృకవచ్ AI గురించి",
            ta: "மாத்ருகவச் AI பற்றி",
            bn: "মাতৃকবচ এআই সম্পর্কে"
        },
        "MatruKavach AI is an intelligent multi-agent maternal health system designed to reduce complications and maternal mortality in remote areas. Powered by autonomous agents that continuously monitor patient metrics in the background, the system automatically maps coordinates to local weather, air pollution (AQI), heat indices, and water indexes to compound clinical parameters with planetary factors. This builds a proactive care network where data is parsed using local speech dialects, synchronized with FHIR standards, and optimized for daily medical visits.": {
            en: "MatruKavach AI is an intelligent multi-agent maternal health system designed to reduce complications and maternal mortality in remote areas. Powered by autonomous agents that continuously monitor patient metrics in the background, the system automatically maps coordinates to local weather, air pollution (AQI), heat indices, and water indexes to compound clinical parameters with planetary factors. This builds a proactive care network where data is parsed using local speech dialects, synchronized with FHIR standards, and optimized for daily medical visits.",
            hi: "मातृकवच एआई एक बुद्धिमान मल्टी-एजेंट मातृ स्वास्थ्य प्रणाली है जिसे दूरदराज के क्षेत्रों में जटिलताओं और मातृ मृत्यु दर को कम करने के लिए डिज़ाइन किया गया है। स्वायत्त एजेंटों द्वारा संचालित जो पृष्ठभूमि में रोगी मेट्रिक्स की लगातार निगरानी करते हैं, प्रणाली नैदानिक ​​​​पैरामीटरों को ग्रहीय कारकों के साथ संयोजित करने के लिए स्थानीय मौसम, वायु प्रदूषण (एक्यूआई), गर्मी सूचकांकों और जल सूचकांकों से निर्देशांक को स्वचालित रूप से मैप करती है। इससे एक सक्रिय देखभाल नेटवर्क बनता है जहां स्थानीय भाषण बोलियों का उपयोग करके डेटा का विश्लेषण किया जाता है, FHIR मानकों के साथ सिंक्रनाइज़ किया जाता है, और दैनिक चिकित्सा यात्राओं के लिए अनुकूलित किया जाता है।",
            mr: "मातृकवच एआय ही एक बुद्धिमान मल्टी-एजंट मातृ आरोग्य प्रणाली आहे जी दुर्गम भागातील गुंतागुंत आणि माता मृत्यू कमी करण्यासाठी डिझाइन केलेली आहे. स्वायत्त एजंट्सद्वारे समर्थित जे पार्श्वभूमीत रुग्णांच्या मेट्रिक्सवर सतत लक्ष ठेवतात, ही प्रणाली स्थानिक हवामान, वायू प्रदूषण (AQI), उष्णता निर्देशांक आणि जल निर्देशांकांशी निर्देशांक स्वयंचलितपणे नकाशा बनवते. यामुळे एक सक्रिय काळजी नेटवर्क तयार होते जिथे स्थानिक भाषा बोली वापरून डेटा विश्लेषित केला जातो, FHIR मानकांशी समक्रमित केला जातो आणि दैनिक वैद्यकीय भेटींसाठी अनुकूल केला जातो.",
            kn: "ಮಾತೃಕವಚ AI ಎನ್ನುವುದು ಬುದ್ಧಿವಂತ ಮಲ್ಟಿ-ಏಜೆಂಟ್ ಮಾತೃತ್ವ ಆರೋಗ್ಯ ವ್ಯವಸ್ಥೆಯಾಗಿದ್ದು, ಇದು ದೂರದ ಪ್ರದೇಶಗಳಲ್ಲಿ ತೊಂದರೆಗಳನ್ನು ಮತ್ತು ಮಾತೃ ಮರಣ ಪ್ರಮಾಣವನ್ನು ಕಡಿಮೆ ಮಾಡಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ. ಹಿನ್ನೆಲೆಯಲ್ಲಿ ರೋಗಿಯ ಮೆಟ್ರಿಕ್‌ಗಳನ್ನು ನಿರन्तरವಾಗಿ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡುವ ಸ್ವಾಯತ್ತ ಏಜೆಂಟ್‌ಗಳಿಂದ ಚಾಲಿತವಾಗಿದೆ, ಸಿಸ್ಟಮ್ ಸ್ಥಳೀಯ ಹವಾಮಾನ, ವಾಯು ಮಾಲಿನ್ಯ (AQI), ಶಾಖದ ಸೂಚ್ಯಂಕಗಳು ಮತ್ತು ನೀರಿನ ಸೂಚ್ಯಂಕಗಳಿಗೆ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಮ್ಯಾಪ್ ಮಾಡುತ್ತದೆ. ಇದು ಪೂರ್ವಭಾವಿ ಆರೈಕೆ ಜಾಲವನ್ನು ನಿರ್ಮಿಸುತ್ತದೆ ಅಲ್ಲಿ ಸ್ಥಳೀಯ ಭಾಷಣ ಉಪಭಾಷೆಗಳನ್ನು ಬಳಸಿ ಡೇಟಾವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತದೆ, FHIR ಮಾನದಂಡಗಳೊಂದಿಗೆ ಸಿಂಕ್ ಮಾಡಲಾಗುತ್ತದೆ ಮತ್ತು ದೈನಂದಿನ ವೈದ್ಯಕೀಯ ಭೇಟಿಗಳಿಗಾಗಿ ಆಪ್ಟಿಮೈಸ್ ಮಾಡಲಾಗುತ್ತದೆ.",
            te: "మాతృకవచ్ AI అనేది రిమోట్ ప్రాంతాలలో సమస్యలను మరియు మాతృ మరణాలను తగ్గించడానికి రూపొందించబడిన ఒక తెలివైన మల్టి-ఏజెంట్ మాతృ సంరక్షణ వ్యవస్థ. నేపథ్యంలో రోగి కొలమానాలను నిరంతరం పర్యవేక్షించే స్వయంప్రతిపత్త ఏజెంట్ల ద్వారా ఆధారితం, ఈ వ్యవస్థ స్థానిక వాతావరణం, వాయు కాలుష్యం (AQI), ఉష్ణ సూచికలు మరియు నీటి సూచికలకు కోఆర్డినేట్లను స్వయంచాలకంగా మ్యాప్ చేస్తుంది. ఇది ఒక క్రియాశీల సంరక్షణ నెట్‌వర్క్‌ను నిర్మిస్తుంది, ఇక్కడ స్థానిక ప్రసంగ మాండలికాలను ఉపయోగించి డేటా విశ్లేషించబడుతుంది, FHIR ప్రమాణాలతో సమకాలీకరించబడుతుంది మరియు రోజువారీ వైద్య సందర్శనల కోసం ఆప్టిమైజ్ చేయబడుతుంది.",
            ta: "மாத்ருகவச் AI என்பது தொலைதூரப் பகுதிகளில் சிக்கல்கள் மற்றும் தாய்வழி மரணங்களைக் குறைக்க வடிவமைக்கப்பட்ட ஒரு அறிவார்ந்த பல முகவர் தாய்வழி சுகாதார அமைப்பாகும். பின்னணியில் நோயாளி அளவீடுகளை தொடர்ந்து கண்காணிக்கும் தன்னாட்சி முகவர்களால் இயக்கப்படுகிறது, கணினி உள்ளூர் வானிலை, காற்று மாசுபாடு (AQI), வெப்ப குறியீடுகள் மற்றும் நீர் குறியீடுகளுக்கு ஆயத்தொலைவுகளை தானாகவே வரைபடமாக்குகிறது. இது ஒரு முன்கூட்டிய பராமரிப்பு வலையமைப்பை உருவாக்குகிறது, அங்கு உள்ளூர் பேச்சு கிளைமொழிகளைப் பயன்படுத்தி தரவு அலசப்படுகிறது, FHIR தரநிலைகளுடன் ஒத்திசைக்கப்படுகிறது மற்றும் தினசரி மருத்துவ வருகைகளுக்கு உगந்ததாக இருக்கும்.",
            bn: "মাতৃকবচ এআই হল একটি বুদ্ধিমান মাল্টি-এজেন্ট মাতৃ স্বাস্থ্য ব্যবস্থা যা প্রত্যন্ত অঞ্চলে জটিলতা এবং মাতৃমৃত্যু কমানোর জন্য ডিজাইন করা হয়েছে। স্বায়ত্তশাসিত এজেন্টদের দ্বারা চালিত যা ব্যাকগ্রাউন্ডে রোগীর মেট্রিক্স ক্রমাগত নিরীক্ষণ করে, সিস্টেমটি স্বয়ংক্রিয়ভাবে স্থানীয় আবহাওয়া, বায়ু দূষণ (AQI), তাপ সূচক এবং জলের সূচকে স্থানাঙ্কগুলিকে মানচিত্র করে যাতে গ্রহের উপাদানগুলির সাথে ক্লিনিকাল প্যারামিটারগুলিকে যৌগিক করা যায়। এটি একটি সক্রিয় যত্ন নেটওয়ার্ক তৈরি করে যেখানে স্থানীয় স্পিচ উপভাষা ব্যবহার করে ডেটা পার্স করা হয়, FHIR মানদণ্ডের সাথে সিঙ্ক্রোনাইজ করা হয় এবং দৈনিক চিকিৎসা পরিদর্শনের জন্য অপ্টিমাইজ করা হয়।"
        },
        "The Ecosystem Connect": {
            en: "The Ecosystem Connect",
            hi: "पारिस्थितिकी तंत्र संबंद्ध",
            mr: "इकोसिस्टम कनेक्ट",
            kn: "ಪರಿಸರ ವ್ಯವಸ್ಥೆಯ ಸಂಪರ್ಕ",
            te: "పర్యావరణ వ్యవస్థ కనెక్ట్",
            ta: "சுற்றுச்சூழல் இணைப்பு",
            bn: "ইকোসিস্টেম সংযোগ"
        },
        "ASHA Frontline Workers": {
            en: "ASHA Frontline Workers",
            hi: "आशा फ्रंटलाइन कार्यकर्ता",
            mr: "आशा फ्रंटलाइन वर्कर्स",
            kn: "ಆಶಾ ಮುಂಚೂಣಿ ಕಾರ್ಯಕರ್ತರು",
            te: "ఆశా ఫ్రంట్‌లైన్ కార్మికులు",
            ta: "ஆஷா முன்களப் பணியாளர்கள்",
            bn: "আশা ফ্রন্টলাইন কর্মী"
        },
        "Vitals capture via voice inputs and optimized route navigation guides.": {
            en: "Vitals capture via voice inputs and optimized route navigation guides.",
            hi: "आवाज इनपुट और अनुकूलित मार्ग नेविगेशन गाइड के माध्यम से महत्वपूर्ण जानकारी कैप्चर करें।",
            mr: "व्हॉइस इनपुट आणि ऑप्टिमाइझ केलेल्या मार्ग नेव्हिगेशन मार्गदर्शकांद्वारे वाइटल्स कॅप्चर करा.",
            kn: "ಧ್ವನಿ ಇನ್‌ಪುಟ್‌ಗಳು ಮತ್ತು ಆಪ್ಟಿಮೈಸ್ಡ್ ರೂಟ್ ನ್ಯಾವಿಗೇಷನ್ ಗೈಡ್‌ಗಳ ಮೂಲಕ ವೈಟಲ್ಸ್ ಕ್ಯಾಪ್ಚರ್.",
            te: "వాయిస్ ఇన్‌పుట్‌లు మరియు ఆప్టిమైజ్ చేసిన రూట్ నావిగేషన్ గైడ్‌ల ద్వారా వైటల్స్ క్యాప్చర్.",
            ta: "குரல் உள்ளீடுகள் மற்றும் உகந்த வழி வழிசெலுத்தல் வழிகாட்டிகள் மூலம் முக்கிய அம்சங்கள் பிடிப்பு.",
            bn: "ভয়েস ইনপুট এবং অপ্টিমাইজড রুট নেভিগেশন গাইডের মাধ্যমে ভাইটাল ক্যাপচার।"
        },
        "Medical Practitioners": {
            en: "Medical Practitioners",
            hi: "चिकित्सक",
            mr: "वैद्यकीय व्यावसायिक",
            kn: "ವೈದ್ಯಕೀಯ ವೃತ್ತಿಪರರು",
            te: "వైద్య నిపుణులు",
            ta: "மருத்துவ பயிற்சியாளர்கள்",
            bn: "চিকিৎসক"
        },
        "Historical EHR baselines, risk assessments, and clinical prescription tools.": {
            en: "Historical EHR baselines, risk assessments, and clinical prescription tools.",
            hi: "ऐतिहासिक ईएचआर बेसलाइन, जोखिम मूल्यांकन और नैदानिक ​​प्रिस्क्रिप्शन उपकरण।",
            mr: "ऐतिहासिक EHR बेसलाइन, जोखीम मूल्यांकन आणि क्लिनिकल प्रिस्क्रिप्शन साधने.",
            kn: "ಐತಿಹಾಸಿಕ EHR ಬೇಸ್‌ಲೈನ್‌ಗಳು, ಅಪಾಯದ ಮೌಲ್ಯಮಾಪನಗಳು ಮತ್ತು ಕ್ಲಿನಿಕಲ್ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಪರಿಕರಗಳು.",
            te: "చారిత్రక EHR బేస్ లైన్లు, ప్రమాద అంచనాలు మరియు క్లినికల్ ప్రిస్క్రిప్షన్ సాధనాలు.",
            ta: "வரலாற்று EHR அடிப்படைகள், ஆபத்து மதிப்பீடுகள் மற்றும் மருத்துவ மருந்து சீட்டு கருவிகள்.",
            bn: "ঐতিহাসিক EHR বেসলাইন, ঝুঁকি মূল্যায়ন এবং ক্লিনিকাল প্রেসক্রিপশন সরঞ্জাম।"
        },
        "Mothers & Patients": {
            en: "Mothers & Patients",
            hi: "माताएं और मरीज",
            mr: "माता आणि रुग्ण",
            kn: "ತಾಯಂದಿರು ಮತ್ತು ರೋಗಿಗಳು",
            te: "తల్లులు & రోగులు",
            ta: "தாய்மார்கள் & நோயாளிகள்",
            bn: "মা ও রোগী"
        },
        "Real-time localized support, translation, and prescription deliveries on Telegram.": {
            en: "Real-time localized support, translation, and prescription deliveries on Telegram.",
            hi: "टेलीग्राम पर वास्तविक समय में स्थानीयकृत सहायता, अनुवाद और प्रिस्क्रिप्शन डिलीवरी।",
            mr: "टेलिग्रामवर रिअल-टाइम स्थानिक समर्थन, भाषांतर आणि प्रिस्क्रिप्शन वितरण.",
            kn: "ಟೆಲಿಗ್ರಾಮ್‌ನಲ್ಲಿ ನೈಜ-ಸಮಯದ ಸ್ಥಳೀಕರಿಸಿದ ಬೆಂಬಲ, ಅನುವಾದ ಮತ್ತು ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ವಿತರಣೆಗಳು.",
            te: "టెలిగ్రామ్‌లో నిజ-సమయ స్థానికీకరించిన మద్దతు, అనువాదం మరియు ప్రిస్క్రిప్షన్ డెలివరీలు.",
            ta: "டெலிகிராமில் நிகழ்நேர உள்ளூர்மயமாக்கப்பட்ட ஆதரவு, மொழிபெயர்ப்பு மற்றும் மருந்து வழங்கல்.",
            bn: "টেলিগ্রামে রিয়েল-টাইম স্থানীয়করণ সহায়তা, অনুবাদ এবং প্রেসক্রিপশন বিতরণ।"
        },
        "CORE SERVICES": {
            en: "CORE SERVICES",
            hi: "मुख्य सेवाएं",
            mr: "मुख्य सेवा",
            kn: "ಮುಖ್ಯ ಸೇವೆಗಳು",
            te: "కోర్ సర్వీసెస్",
            ta: "முக்கிய சேவைகள்",
            bn: "মূল সেবা"
        },
        "MatruKavach Core Features": {
            en: "MatruKavach Core Features",
            hi: "मातृकवच मुख्य विशेषताएं",
            mr: "मातृकवच मुख्य वैशिष्ट्ये",
            kn: "ಮಾತೃಕವಚ ಮುಖ್ಯ ವೈಶಿಷ್ಟ್ಯಗಳು",
            te: "మాతృకవచ్ ప్రధాన ఫీచర్లు",
            ta: "மாத்ருகவச் முக்கிய அம்சங்கள்",
            bn: "মাতৃকবচ মূল বৈশিষ্ট্য"
        },
        "Our feature stack implements standardized integration systems to provide comprehensive healthcare intelligence.": {
            en: "Our feature stack implements standardized integration systems to provide comprehensive healthcare intelligence.",
            hi: "हमारा फीचर स्टैक व्यापक स्वास्थ्य सेवा बुद्धिमत्ता प्रदान करने के लिए मानकीकृत एकीकरण प्रणाली लागू करता है।",
            mr: "आमचा फीचर स्टॅक सर्वसमावेशक आरोग्य सेवा बुद्धिमत्ता प्रदान करण्यासाठी मानकीकृत एकीकरण प्रणाली लागू करतो.",
            kn: "ಸಮಗ್ರ ಆರೋಗ್ಯ ಬುದ್ಧಿಮತ್ತೆಯನ್ನು ಒದಗಿಸಲು ನಮ್ಮ ವೈಶಿಷ್ಟ್ಯಗಳ ಸ್ಟ್ಯಾಕ್ ಪ್ರಮಾಣಿತ ಏಕೀಕರಣ ವ್ಯವಸ್ಥೆಗಳನ್ನು ಕಾರ್ಯಗತಗೊಳಿಸುತ್ತದೆ.",
            te: "సమగ్ర ఆరోగ్య సంరక్షణ మేధస్సును అందించడానికి మా ఫీచర్ స్టాక్ ప్రామాణిక ఏకీకరణ వ్యవస్థలను అమలు చేస్తుంది.",
            ta: "விரிவான சுகாதார நுண்ணறிவை வழங்க எங்கள் அம்ச அடுக்கு தரப்படுத்தப்பட்ட ஒருங்கிணைப்பு அமைப்புகளை செயல்படுத்துகிறது.",
            bn: "আমাদের ফিচার স্ট্যাক ব্যাপক স্বাস্থ্যসেবা বুদ্ধিমত্তা প্রদানের জন্য প্রমিত একীকরণ ব্যবস্থা প্রয়োগ করে।"
        },
        "Planetary AI Risk Engine": {
            en: "Planetary AI Risk Engine",
            hi: "ग्रहीय एआई जोखिम इंजन",
            mr: "प्लैनेटरी एआय रिस्क इंजिन",
            kn: "ಗ್ರಹಗಳ AI ಅಪಾಯದ ಎಂಜಿನ್",
            te: "ప్లానెటరీ AI రిస్క్ ఇంజిన్",
            ta: "கிரக AI ஆபத்து இயந்திரம்",
            bn: "প্ল্যানেটারি এআই ঝুঁকি ইঞ্জিন"
        },
        "LangGraph workflow compounding clinical parameters with geo-environmental variables (Air Quality, Heat Index, Toxins) to estimate risk thresholds.": {
            en: "LangGraph workflow compounding clinical parameters with geo-environmental variables (Air Quality, Heat Index, Toxins) to estimate risk thresholds.",
            hi: "जोखिम थ्रेसहोल्ड का अनुमान लगाने के लिए भू-पर्यावरणीय चर (वायु गुणवत्ता, गर्मी सूचकांक, विषाक्त पदार्थ) के साथ नैदानिक ​​मापदंडों को संयोजित करने वाला लैंगग्राफ वर्कफ़्लो।",
            mr: "जोखीम थ्रेशोल्डचा अंदाज लावण्यासाठी भू-पर्यावरणीय चलांसह (हवेची गुणवत्ता, उष्णता निर्देशांक, विषारी पदार्थ) क्लिनिकल पॅरामीटर्स एकत्रित करणारे लँगग्राफ वर्कफ्लो.",
            kn: "ಅಪಾಯದ ಮಿತಿಗಳನ್ನು ಅಂದಾಜು ಮಾಡಲು ಭೌಗೋಳಿಕ-ಪರಿಸರ ಅಸ್ಥಿರಗಳೊಂದಿಗೆ (ಗಾಳಿಯ ಗುಣಮಟ್ಟ, ಶಾಖ ಸೂಚ್ಯಂಕ, ಜೀವಾಣುಗಳು) ಕ್ಲಿನಿಕಲ್ ನಿಯತಾಂಕಗಳನ್ನು ಸಂಯೋಜಿಸುವ ಲ್ಯಾಂಗ್‌ಗ್ರಾಫ್ ವರ್ಕ್‌ಫ್ಲೋ.",
            te: "ప్రమాద పరిమితులను అంచనా వేయడానికి భౌగోళిక-పర్యావరణ వేరియబుల్స్ (గాలి నాణ्यత, ఉష్ణ సూచిక, టాక్సిన్స్) తో క్లినికల్ పారామితులను అనుసంధానించే లాంగ్‌గ్రాఫ్ వర్క్‌ఫ్లో.",
            ta: "ஆபத்து வரம்புகளை மதிப்பிடுவதற்கு புவி-சுற்றுச்சூழல் மாறிகளுடன் (காற்றின் தரம், வெப்பக் குறியீடு, நச்சுகள்) மருத்துவ அளவுருக்களை இணைக்கும் லேன்கிராப் பணிப்பாய்வு.",
            bn: "ঝুঁকির থ্রেশহোল্ড অনুমান করতে ভূ-পরিবেশগত ভেরিয়েবল (বায়ুর গুণমান, তাপ সূচক, টক্সিন) এর সাথে ক্লিনিকাল পরামিতিগুলিকে একত্রিত করে ল্যাংগ্রাফ ওয়ার্কফ্লো।"
        },
        "Vocal Guided Intake": {
            en: "Vocal Guided Intake",
            hi: "आवाज निर्देशित सेवन",
            mr: "व्होकल गायडेड इनटेक",
            kn: "ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ ಸೇವನೆ",
            te: "వోకల్ గైడెడ్ ఇన్‌టేక్",
            ta: "குரல் வழி உட்செலுத்துதல்",
            bn: "কণ্ঠ নির্দেশিত ইনটেক"
        },
        "Frontline form intakes using Sarvam AI's speech-to-text pipeline to capture clinical profiles securely with spoken local dialects.": {
            en: "Frontline form intakes using Sarvam AI's speech-to-text pipeline to capture clinical profiles securely with spoken local dialects.",
            hi: "बोली जाने वाली स्थानीय बोलियों के साथ नैदानिक ​​प्रोफाइल को सुरक्षित रूप से कैप्चर करने के लिए सर्वम एआई के स्पीच-टू-टेक्स्ट पाइपलाइन का उपयोग करके फ्रंटलाइन फॉर्म इनटेक।",
            mr: "बोलल्या जाणाऱ्या स्थानिक बोलींसह क्लिनिकल प्रोफाइल सुरक्षितपणे कॅप्चर करण्यासाठी सर्वम एआयच्या स्पीच-टू-टेक्स्ट पाइपलाइनचा वापर करून फ्रंटलाइन फॉर्म इनटेक.",
            kn: "ಮಾತನಾಡುವ ಸ್ಥಳೀಯ ಉಪಭಾಷೆಗಳೊಂದಿಗೆ ಕ್ಲಿನಿಕಲ್ ಪ್ರೊಫೈಲ್‌ಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಸೆರೆಹಿಡಿಯಲು ಸರ್ವಮ್ AI ನ ಸ್ಪೀಚ್-ಟು-ಟೆಕ್ಸ್ಟ್ ಪೈಪ್‌ಲೈನ್ ಬಳಸಿಕೊಂಡು ಮುಂಚೂಣಿ ಫಾರ್ಮ್ ಸೇವನೆಗಳು.",
            te: "మాట్లాడే స్థానిక మాండలికాలతో క్లినికల్ ప్రొఫైల్‌లను సురక్షิตంగా సంగ్రహించడానికి సర్వం AI యొక్క స్పీచ్-టు-టెక్స్ట్ పైప్‌లైన్‌ను ఉపయోగించి ఫ్రంట్‌లైన్ ఫారమ్ ఇన్‌టేక్‌లు.",
            ta: "பேசப்படும் உள்ளூர் பேச்சுவழக்குகளுடன் மருத்துவ விவரங்களை பாதுகாப்பாகப் பிடிக்க சர்வம் AI இன் பேச்சு-க்கு-உரை பைப்லைனைப் பயன்படுத்தி முன்களப் படிவ உட்கொள்ளல்.",
            bn: "কথ্য স্থানীয় উপভাষার সাথে ক্লিনিকাল প্রোফাইলগুলি সুরক্ষিতভাবে ক্যাপচার করতে সর্বম এআই-এর স্পিচ-টু-টেক্সট পাইপলাইন ব্যবহার করে ফ্রন্টলাইন ফর্ম ইনটেক।"
        },
        "Google OR-Tools Routing": {
            en: "Google OR-Tools Routing",
            hi: "गूगल ओआर-टूल्स रूटिंग",
            mr: "गुगल ओआर-टूल्स राऊटिंग",
            kn: "ಗೂಗಲ್ OR-ಟೂಲ್ಸ್ ರೂಟಿಂಗ್",
            te: "గూగుల్ OR-టూల్స్ రూటింగ్",
            ta: "கூகுள் OR-கருவிகள் ரூட்டிங்",
            bn: "கூகுள் ஒআর-টুলস রাউটিং"
        },
        "Vehicle Routing Problem (VRP) optimization matching ASHA worker locations to patient lists, organizing sequence steps and travel modes.": {
            en: "Vehicle Routing Problem (VRP) optimization matching ASHA worker locations to patient lists, organizing sequence steps and travel modes.",
            hi: "वाहन रूटिंग समस्या (वीआरपी) अनुकूलन आशा कार्यकर्ता स्थानों को रोगी सूचियों से मिलाता है, अनुक्रम चरणों और यात्रा मोड को व्यवस्थित करता है।",
            mr: "वाहन राऊटिंग समस्या (VRP) ऑप्टिमायझेशन आशा कार्यकर्त्याच्या ठिकाणांना रुग्णांच्या यादीशी जुळवणे, अनुक्रम पायऱ्या आणि प्रवास मोड व्यवस्थित करणे.",
            kn: "ವಾಹನ ರೂಟಿಂಗ್ ಸಮಸ್ಯೆ (VRP) ಆಪ್ಟಿಮೈಸೇಶನ್ ಆಶಾ ಕಾರ್ಯಕರ್ತರ ಸ್ಥಳಗಳನ್ನು ರೋಗಿಗಳ ಪಟ್ಟಿಗಳಿಗೆ ಹೊಂದಿಸುವುದು, ಅನುಕ್ರಮ ಹಂತಗಳು ಮತ್ತು ಪ್ರಯಾಣದ ವಿಧಾನಗಳನ್ನು ಸಂಘಟಿಸುವುದು.",
            te: "వెహికల్ రూటింగ్ ప్రాబ్లమ్ (VRP) ఆప్టిమైజేషన్ ఆశా కార్మికుల స్థానాలను రోగుల జాబिटीज సరిపోల్చడం, క్రమ పద్ధతి మరియు ప్రయాణ మార్గాలను నిర్వహించడం.",
            ta: "வாகன ரூட்டிங் சிக்கல் (VRP) தேர்வுமுறை ஆஷா பணியாளர் இடங்களை நோயாளி பட்டியல்களுடன் பொருத்துதல், வரிசை படிகள் மற்றும் பயண முறைகளை ஒழுங்கமைத்தல்.",
            bn: "ভেহিকেল রাউটিং প্রবলেম (VRP) অপ্টিমাইজেশান আশা কর্মীদের অবস্থানকে রোগীর তালিকার সাথে মেলাচ্ছে, সিকোয়েন্স স্টেপ এবং ভ্রমণ মোড সংগঠিত করছে।"
        },
        "FHIR EHR Integration": {
            en: "FHIR EHR Integration",
            hi: "FHIR EHR एकीकरण",
            mr: "FHIR EHR एकत्रीकरण",
            kn: "FHIR EHR ಏಕೀಕರಣ",
            te: "FHIR EHR ఇంటిగ్రేషన్",
            ta: "FHIR EHR ஒருங்கிணைப்பு",
            bn: "FHIR EHR ইন্টিগ্রেশন"
        },
        "Standardized HL7 FHIR Observations tracking Blood Pressure and Hemoglobin baselines to evaluate critical deterioration trends.": {
            en: "Standardized HL7 FHIR Observations tracking Blood Pressure and Hemoglobin baselines to evaluate critical deterioration trends.",
            hi: "गंभीर गिरावट के रुझानों का मूल्यांकन करने के लिए रक्तचाप और हीमोग्लोबिन बेसलाइन को ट्रैक करने वाले मानकीकृत HL7 FHIR अवलोकन।",
            mr: "गंभीर बिघाड प्रवृत्तींचे मूल्यमापन करण्यासाठी रक्तदाब आणि हिमोग्लोबिन बेसलाइन ट्रॅक करणारे मानकीकृत HL7 FHIR निरीक्षणे.",
            kn: "ನಿರ್ಣಾಯಕ ಕ್ಷೀಣತೆಯ ಪ್ರವೃತ್ತಿಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲು ರಕ್ತದೊತ್ತಡ ಮತ್ತು ಹಿಮೋಗ್ಲೋಬಿನ್ ಬೇಸ್‌ಲೈನ್‌ಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡುವ ಪ್ರಮಾಣೀಕೃತ HL7 FHIR ಅವಲೋಕನಗಳು.",
            te: "తీవ్రమైన క్షీణత ధోరణులను అంచనా వేయడానికి రక్తపోటు మరియు హిమోగ్లోబిన్ బేస్‌లైన్‌లను ట్రాక్ చేసే ప్రామాణిక HL7 FHIR పరిశీలనలు.",
            ta: "தீர்வுக்கான சரிவு போக்குகளை மதிப்பிடுவதற்கு இரத்த அழுத்தம் மற்றும் ஹீமோகுளோபின் அடிப்படைகளைக் கண்காணிக்கும் தரப்படுத்தப்பட்ட HL7 FHIR அவதானிப்புகள்.",
            bn: "গুরুতর অবনতির প্রবণতা মূল্যায়নের জন্য রক্তচাপ এবং হিমোগ্লোবিন বেসলাইন ট্র্যাকিং স্ট্যান্ডার্ডাইজড HL7 FHIR পর্যবেক্ষণ।"
        },
        "Patients Telegram Agent": {
            en: "Patients Telegram Agent",
            hi: "मरीज टेलीग्राम एजेंट",
            mr: "रुग्ण टेलिग्राम एजंट",
            kn: "ರೋಗಿಗಳ ಟೆಲಿಗ್ರಾಮ್ ಏಜೆಂಟ್",
            te: "రోగుల టెలిగ్రామ్ ఏజెంట్",
            ta: "நோயாளிகள் டெலிகிராம் முகவர்",
            bn: "রোগী টেলিগ্রাম এজেন্ট"
        },
        "Dual-channel text and audio assistant with Rate-Limit recovery, auto-translation for local languages, and critical symptom warnings.": {
            en: "Dual-channel text and audio assistant with Rate-Limit recovery, auto-translation for local languages, and critical symptom warnings.",
            hi: "रेट-लिमिट रिकवरी, स्थानीय भाषाओं के लिए ऑटो-अनुवाद और गंभीर लक्षण चेतावनियों के साथ दोहरे चैनल वाला टेक्स्ट और ऑडियो सहायक।",
            mr: "रेट-लिमिट रिकव्हरी, स्थानिक भाषांसाठी ऑटो-भाषांतर आणि गंभीर लक्षण चेतावणीसह ड्युअल-चॅनेल मजकूर आणि ऑडिओ सहाय्यक.",
            kn: "ದರ-ಮಿತಿ ಮರುಪಡೆಯುವಿಕೆ, ಸ್ಥಳೀಯ ಭಾಷೆಗಳಿಗೆ ಸ್ವಯಂ-ಅನುವಾದ ಮತ್ತು ನಿರ್ಣಾಯಕ ರೋಗಲಕ್ಷಣದ ಎಚ್ಚರಿಕೆಗಳೊಂದಿಗೆ ದ್ವಿ-ಚಾನಲ್ ಪಠ್ಯ ಮತ್ತು ಆಡಿಯೊ ಸಹಾಯಕ.",
            te: "రేట్-పరిమితి రికవరీ, స్థానిక భాషలకు స్వయం-అనువాదం మరియు క్లిష్టమైన లక్షణాల హెచ్చరికలతో ద్వంద్వ-ఛానల్ టెక్స్ట్ మరియు ఆడియో సంరక్షకుడు.",
            ta: "விகித-வரம்பு மீட்பு, உள்ளூர் மொழிகளுக்கான தானியங்கி மொழிபெயர்ப்பு மற்றும் முக்கியமான அறிகுறி எச்சரிக்கைகளுடன் கூடிய இரட்டை-சேனல் உரை மற்றும் ஆடியோ உதவியாளர்.",
            bn: "রেট-লিমিট রিকভারি, স্থানীয় ভাষার জন্য অটো-অনুবাদ এবং গুরুতর উপসর্গের সতর্কতা সহ ডুয়াল-চ্যানেল টেক্সট এবং অডিও সহকারী।"
        },
        "Care-Team Collaboration": {
            en: "Care-Team Collaboration",
            hi: "देखभाल-टीम सहयोग",
            mr: "केअर-टीम सहयोग",
            kn: "ಆರೈಕೆ-ತಂಡದ ಸಹಯೋಗ",
            te: "కేర్-టీమ్ సహకారం",
            ta: "பராமரிப்பு குழு ஒத்துழைப்பு",
            bn: "কেয়ার-টিম সহযোগিতা"
        },
        "Secure portals for ASHA workers, Doctors, and Admins offering real-time Socket.IO text chats, live alerts, and QR-based record sharing.": {
            en: "Secure portals for ASHA workers, Doctors, and Admins offering real-time Socket.IO text chats, live alerts, and QR-based record sharing.",
            hi: "आशा कार्यकर्ताओं, डॉक्टरों और एडमिन के लिए सुरक्षित पोर्टल जो वास्तविक समय में सॉकेट.आईओ टेक्स्ट चैट, लाइव अलर्ट और क्यूआर-आधारित रिकॉर्ड साझाकरण की सुविधा प्रदान करते हैं।",
            mr: "आशा कार्यकर्त्या, डॉक्टर आणि ॲडमिनसाठी सुरक्षित पोर्टल्स जे रिअल-टाइम Socket.IO मजकूर गप्पा, लाइव्ह अलर्ट आणि QR-आधारित रेकॉर्ड सामायिकरण देतात.",
            kn: "ಆಶಾ ಕಾರ್ಯಕರ್ತರು, ವೈದ್ಯರು ಮತ್ತು ನಿರ್ವಾಹಕರಿಗೆ ಸುರಕ್ಷಿತ ಪೋರ್ಟಲ್‌ಗಳು ನೈಜ-ಸಮಯದ ಸಾಕೆಟ್.ಐಒ ಪಠ್ಯ ಚಾಟ್‌ಗಳು, ಲైವ್ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಕ್ಯೂಆರ್-आधारित ದಾಖಲೆ ಹಂಚಿಕೆಯನ್ನು ನೀಡುತ್ತವೆ.",
            te: "ఆశా కార్మికులు, వైద్యులు మరియు నిర్వాహకుల కోసం సురక్షితమైన పోర్టల్స్ నిజ-సమయ సాకెట్.ఐఓ టెక్స్ట్ చాట్‌లు, ప్రత్యక్ష హెచ్చరికలు మరియు క్యూఆర్-ఆధారిత రికార్డు భాగస్వామ్యాన్ని అందిస్తాయి.",
            ta: "ஆஷா பணியாளர்கள், மருத்துவர்கள் மற்றும் நிர்வாகிகளுக்கான பாதுகாப்பான இணையதளங்கள் நிகழ்நேர சாக்கெட்.IO உரை அரட்டைகள், நேரடி எச்சரிக்கைகள் மற்றும் QR-அடிப்படையிலான பதிவு பகிர்வுகளை வழங்குகின்றன.",
            bn: "আশা কর্মী, ডাক্তার এবং অ্যাডমিনদের জন্য সুরক্ষিত পোর্টাল যা রিয়েল-টাইম সকেট.আইও টেক্সট চ্যাট, লাইভ অ্যালার্ট এবং কিউআর-ভিত্তিক রেকর্ড শেয়ারিং অফার করে।"
        },
        "Approvals": {
            en: "Approvals",
            hi: "स्वीकृतियां",
            mr: "मंजूरी",
            kn: "ಅನುಮೋದನೆಗಳು",
            te: "ఆమోదాలు",
            ta: "அங்கீகாரங்கள்",
            bn: "অনুমোদন"
        },
        "Refresh": {
            en: "Refresh",
            hi: "ताज़ा करें",
            mr: "पुन्हा लोड करा",
            kn: "ನವೀಕರಿಸಿ",
            te: "తాజా చేయి",
            ta: "புதுப்பி",
            bn: "রিফ্রেশ"
        },
        "System Overview": {
            en: "System Overview",
            hi: "सिस्टम अवलोकन",
            mr: "सिस्टम विहंगावलोकन",
            kn: "ವ್ಯವಸ್ಥೆಯ ಅವಲೋಕನ",
            te: "సిస్టమ్ అవలోకనం",
            ta: "அமைப்பு கண்ணோட்டம்",
            bn: "সিস্টেম পর্যালোচনা"
        },
        "Fully Assigned": {
            en: "Fully Assigned",
            hi: "पूर्णतः आवंटित",
            mr: "पूर्णपणे नियुक्त",
            kn: "ಪೂರ್ಣವಾಗಿ ನಿಯೋಜಿಸಲಾಗಿದೆ",
            te: "పూర్తిగా కేటాయించబడింది",
            ta: "முழுமையாக ஒதுக்கப்பட்டது",
            bn: "সম্পূর্ণ বরাদ্দ করা হয়েছে"
        },
        "Needs Assignment": {
            en: "Needs Assignment",
            hi: "आवंटन की आवश्यकता",
            mr: "नियुक्ती आवश्यक",
            kn: "ನಿಯೋಜನೆ ಅಗತ್ಯವಿದೆ",
            te: "కేటాయింపు అవసరం",
            ta: "ஒதுக்கீடு தேவை",
            bn: "বরাদ্দ প্রয়োজন"
        },
        "Doctor Workload": {
            en: "Doctor Workload",
            hi: "डॉक्टर कार्यभार",
            mr: "डॉक्टरांचा कार्यभार",
            kn: "ವೈದ್ಯರ ಕೆಲಸದ ಹೊರೆ",
            te: "వైద్యర పనిభారం",
            ta: "மருத்துவர் பணிச்சுமை",
            bn: "ডাক্তার কাজের চাপ"
        },
        "ASHA Worker Workload": {
            en: "ASHA Worker Workload",
            hi: "आशा कार्यकर्ता कार्यभार",
            mr: "आशा कार्यकर्त्यांचा कार्यभार",
            kn: "ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯ ಕೆಲಸದ ಹೊರೆ",
            te: "ఆశా కార్యకర్త పనిభారం",
            ta: "ஆஷா பணியாளர் பணிச்சுமை",
            bn: "আশা কর্মীর কাজের চাপ"
        },
        "Manage Doctors": {
            en: "Manage Doctors",
            hi: "डॉक्टरों का प्रबंधन",
            mr: "डॉक्टर व्यवस्थापन",
            kn: "ವೈದ್ಯರ ನಿರ್ವಹಣೆ",
            te: "వైద్యుల నిర్వహణ",
            ta: "மருத்துவர்களை நிர்வகி",
            bn: "ডাক্তার পরিচালনা"
        },
        "Manage ASHA Workers": {
            en: "Manage ASHA Workers",
            hi: "आशा कार्यकर्ताओं का प्रबंधन",
            mr: "आशा कार्यकर्त्या व्यवस्थापन",
            kn: "ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯರ ನಿರ್ವಹಣೆ",
            te: "ఆశా కార్యకర్తల నిర్వహణ",
            ta: "ஆஷா பணியாளர்களை நிர்வகி",
            bn: "আশা কর্মী পরিচালনা"
        },
        "Manage Mothers": {
            en: "Manage Mothers",
            hi: "माताओं का प्रबंधन",
            mr: "माता व्यवस्थापन",
            kn: "ತಾಯಂದಿರ ನಿರ್ವಹಣೆ",
            te: "తల్లుల నిర్వహణ",
            ta: "தாய்களை நிர்வகி",
            bn: "মায়েদের পরিচালনা"
        },
        "Overview": {
            en: "Overview",
            hi: "अवलोकन",
            mr: "विहंगावलोकन",
            kn: "ಅವಲೋಕನ",
            te: "అవలోకనం",
            ta: "கண்ணோட்டம்",
            bn: "পর্যালোচনা"
        },
        "Mothers": {
            en: "Mothers",
            hi: "माताएं",
            mr: "माता",
            kn: "ತಾಯಂದಿರು",
            te: "తల్లులు",
            ta: "தாய்கள்",
            bn: "মায়েরা"
        },
        "Doctors": {
            en: "Doctors",
            hi: "डॉक्टर",
            mr: "डॉक्टर",
            kn: "ವೈದ್ಯರು",
            te: "వైద్యులు",
            ta: "மருத்துவர்கள்",
            bn: "ডাক্তাররা"
        },
        "ASHA Workers": {
            en: "ASHA Workers",
            hi: "आशा कार्यकर्ता",
            mr: "आशा कार्यकर्त्या",
            kn: "ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯರು",
            te: "ఆశా కార్యಕರ್తలు",
            ta: "ஆஷா பணியாளர்கள்",
            bn: "আশা কর্মীরা"
        },
        "patients": {
            en: "patients",
            hi: "मरीज",
            mr: "रुग्ण",
            kn: "ರೋಗಿಗಳು",
            te: "రోగులు",
            ta: "நோயாளிகள்",
            bn: "রোগী"
        },
        "mothers": {
            en: "mothers",
            hi: "माताएं",
            mr: "माता",
            kn: "ತಾಯಂದಿರು",
            te: "తల్లులు",
            ta: "தாய்கள்",
            bn: "মায়েরা"
        },
        "Active": {
            en: "Active",
            hi: "सक्रिय",
            mr: "सक्रिय",
            kn: "ಸಕ್ರಿಯ",
            te: "సక్రియ",
            ta: "செயலில்",
            bn: "সक्रिय"
        },
        "OK": {
            en: "OK",
            hi: "ठीक",
            mr: "ठीक",
            kn: "ಸರಿ",
            te: "సరి",
            ta: "சரி",
            bn: "ঠিক"
        },
        "PEND": {
            en: "PEND",
            hi: "लंबित",
            mr: "प्रलंबित",
            kn: "ಬಾकी",
            te: "పెండింగ్",
            ta: "நிலுவையில்",
            bn: "পেন্ডিং"
        },
        "N/A": {
            en: "N/A",
            hi: "लागू नहीं",
            mr: "लागू नाही",
            kn: "ಅನ್ವಯಿಸುವುದಿಲ್ಲ",
            te: "వర్తించదు",
            ta: "பொருந்தாது",
            bn: "প্রযোজ্য নয়"
        },
        "-- Select --": {
            en: "-- Select --",
            hi: "-- चुनें --",
            mr: "-- निवडा --",
            kn: "-- ಆಯ್ಕೆ ಮಾಡಿ --",
            te: "-- ఎంచుకోండి --",
            ta: "-- தேர்ந்தெடுக்கவும் --",
            bn: "-- নির্বাচন করুন --"
        },
        // Specializations
        "Obstetrician": {
            en: "Obstetrician",
            hi: "प्रसूति रोग विशेषज्ञ",
            mr: "प्रसूतीतज्ज्ञ",
            kn: "ಪ್ರಸೂತಿ ತಜ್ಞರು",
            te: "ప్రసూతి నిపుణులు",
            ta: "மகப்பேறு மருத்துவர்",
            bn: "ধাত্রী ও স্ত্রীরোগ विशेषज्ञ"
        },
        "Gynecologist": {
            en: "Gynecologist",
            hi: "स्त्री रोग विशेषज्ञ",
            mr: "स्त्रीरोगतज्ज्ञ",
            kn: "ಸ್ತ್ರೀರೋಗ ತಜ್ಞರು",
            te: "స్త్రీ రోగ నిపుణులు",
            ta: "மகளிர் நோய் மருத்துவர்",
            bn: "স্ত্রীরোগ বিশেষজ্ঞ"
        },
        "General Physician": {
            en: "General Physician",
            hi: "सामान्य चिकित्सक",
            mr: "सामान्य फिजिशियन",
            kn: "ಸಾಮಾನ್ಯ ವೈದ್ಯರು",
            te: "సాధారణ వైద్యుడు",
            ta: "பொது மருத்துவர்",
            bn: "সাধারণ চিকিৎসক"
        },
        // Dynamic names
        "Dr. Arjun Rao": {
            en: "Dr. Arjun Rao",
            hi: "डॉ. अर्जुन राव",
            mr: "डॉ. अर्जुन राव",
            kn: "ಡಾ. ಅರ್ಜುನ್ ರಾವ್",
            te: "డా. అర్జున్ రావు",
            ta: "டாக்டர் அர்ஜுன் ராவ்",
            bn: "ডা. অর্জুন রাও"
        },
        "Dr. Meera Shah": {
            en: "Dr. Meera Shah",
            hi: "डॉ. मीरा शाह",
            mr: "डॉ. मीरा शाह",
            kn: "ಡಾ. ಮೀರಾ ಶಾ",
            te: "డా. మీరా షా",
            ta: "டாக்டர் மீரா ஷா",
            bn: "ডা. মীরা শাহ"
        },
        "Dr. Praful Dave": {
            en: "Dr. Praful Dave",
            hi: "डॉ. प्रफुल्ल दवे",
            mr: "डॉ. प्रफुल्ल दवे",
            kn: "ಡಾ. ಪ್ರಫುಲ್ ದವೆ",
            te: "డా. ప్రఫుల్ దవే",
            ta: "டாக்டர் பிரபுல் தவே",
            bn: "ডা. প্রফুল্ল দাবে"
        },
        "Dr. Test": {
            en: "Dr. Test",
            hi: "डॉ. टेस्ट",
            mr: "डॉ. टेस्ट",
            kn: "ಡಾ. ಟೆಸ್ಟ್",
            te: "డా. టెస్ట్",
            ta: "டாக்டர் டெஸ்ட்",
            bn: "ডা. टेस्ट"
        },
        "Dr. Rajesh Kumar": {
            en: "Dr. Rajesh Kumar",
            hi: "डॉ. राजेश कुमार",
            mr: "डॉ. राजेश कुमार",
            kn: "ಡಾ. ರಾಜೇಶ್ ಕುಮಾರ್",
            te: "డా. రాజేష్ కుమార్",
            ta: "டாக்டர் ராஜேஷ் குமார்",
            bn: "ডা. রাজেশ কুমার"
        },
        "Dr. Sneha Gupta": {
            en: "Dr. Sneha Gupta",
            hi: "डॉ. स्नेहा गुप्ता",
            mr: "डॉ. स्नेहा गुप्ता",
            kn: "ಡಾ. ಸ್ನೇಹಾ ಗುಪ್ತಾ",
            te: "డా. స్నేహ గుప్తా",
            ta: "டாக்டர் சினேகா குப்தா",
            bn: "ডা. স্নেহা গুপ্ত"
        },
        "Anita Joshi": {
            en: "Anita Joshi",
            hi: "अनीता जोशी",
            mr: "अनिता जोशी",
            kn: "ಅನಿತಾ ಜೋಶಿ",
            te: "అనిత జోషి",
            ta: "அனிதா ஜோஷி",
            bn: "অনিতা জোশী"
        },
        "Parth Rana": {
            en: "Parth Rana",
            hi: "पार्थ राणा",
            mr: "पार्थ राणा",
            kn: "ಪಾರ್ಥ್ ರಾಣಾ",
            te: "పార్థ్ రాణా",
            ta: "பார்த்த ரானா",
            bn: "পার্থ রানা"
        },
        "Axorra": {
            en: "Axorra",
            hi: "अक्सोरा",
            mr: "अक्सोरा",
            kn: "ಅಕ್ಸೋರಾ",
            te: "అక్సోరా",
            ta: "அக்ஸோரா",
            bn: "অ্যাক্সোরা"
        },
        "QWERTY": {
            en: "QWERTY",
            hi: "क्वर्टी",
            mr: "क्वर्टी",
            kn: "ಕ್ವೆರ್ಟಿ",
            te: "క్వెర్టీ",
            ta: "குவெர்ட்டி",
            bn: "কুয়ের্টি"
        },
        "Priya Sharma": {
            en: "Priya Sharma",
            hi: "प्रिया शर्मा",
            mr: "प्रिया शर्मा",
            kn: "ಪ್ರಿಯಾ ಶರ್ಮಾ",
            te: "ప్రియా శర్మ",
            ta: "பிரியா சர்மா",
            bn: "প্রিয়া শর্মা"
        },
        "Sunita Patel": {
            en: "Sunita Patel",
            hi: "सुनीता पटेल",
            mr: "सुनीता पटेल",
            kn: "ಸುನಿತಾ ಪಟೇಲ್",
            te: "సునీత పటేల్",
            ta: "சுனிதா படேல்",
            bn: "সুনীতা প্যাটেল"
        },
        "Kavita Desai": {
            en: "Kavita Desai",
            hi: "कविता देसाई",
            mr: "कविता देसाई",
            kn: "ಕವಿತಾ ದೇಸಾಯಿ",
            te: "కవిత దేశాయ్",
            ta: "கவிதா தேசாய்",
            bn: "কবিতা দেশাই"
        },
        "Lata Singh": {
            en: "Lata Singh",
            hi: "लता सिंह",
            mr: "लता सिंग",
            kn: "ಲತಾ ಸಿಂಗ್",
            te: "లతా సింగ్",
            ta: "லதா சிங்",
            bn: "লতা সিং"
        },
        "Meenakshi Iyer": {
            en: "Meenakshi Iyer",
            hi: "मीनाक्षी अय्यर",
            mr: "मीनाक्षी अय्यर",
            kn: "ಮೀನಾಕ್ಷಿ ಅಯ್ಯರ್",
            te: "మీనాక్షి అయ్యర్",
            ta: "மீனாக்ஷி ஐயர்",
            bn: "মীনাক্ষী আইয়ার"
        },
        "Jiya": {
            en: "Jiya",
            hi: "जिया",
            mr: "जिया",
            kn: "ಜಿಯಾ",
            te: "జియా",
            ta: "ஜியா",
            bn: "জিয়া"
        },
        "Priya": {
            en: "Priya",
            hi: "प्रिया",
            mr: "प्रिया",
            kn: "ಪ್ರಿಯಾ",
            te: "ప్రియా",
            ta: "பிரியா",
            bn: "প্রিয়া"
        },
        "Anjali": {
            en: "Anjali",
            hi: "अंजलि",
            mr: "अंजली",
            kn: "ಅಂಜಲಿ",
            te: "అంజలి",
            ta: "அஞ்சலி",
            bn: "অঞ্জলি"
        },
        "Kavita": {
            en: "Kavita",
            hi: "कविता",
            mr: "कविता",
            kn: "ಕವಿತಾ",
            te: "కవిత",
            ta: "கவிதா",
            bn: "কবিতা"
        },
        "Roshni Patil": {
            en: "Roshni Patil",
            hi: "रोशनी पाटिल",
            mr: "रोशनी पाटील",
            kn: "ರೋಶ್ನಿ ಪಾಟೀಲ್",
            te: "రోష్ని పాటిల్",
            ta: "ரோஷினி பாட்டீல்",
            bn: "রশ্নি পাতিল"
        },
        "Pooja Jadhav": {
            en: "Pooja Jadhav",
            hi: "पूजा जाधव",
            mr: "पूजा जाधव",
            kn: "ಪೂಜಾ ಜಾಧವ್",
            te: "పూజా జాదవ్",
            ta: "பூஜா ஜாதவ்",
            bn: "পূজা যাদব"
        },
        "Aarti Kadam": {
            en: "Aarti Kadam",
            hi: "आरती कदम",
            mr: "आरती कदम",
            kn: "ಆರತಿ ಕದಮ್",
            te: "ఆరతి కదమ్",
            ta: "ஆர்த்தி கடம்",
            bn: "আরতি কদম"
        },
        "Bhavna Shinde": {
            en: "Bhavna Shinde",
            hi: "भावना शिंदे",
            mr: "भावना शिंदे",
            kn: "ಭಾವನಾ ಶಿಂದೆ",
            te: "భావనా షిండే",
            ta: "பாவனா ஷிண்டே",
            bn: "ভাবনা শিন্ডে"
        },
        "Kajal More": {
            en: "Kajal More",
            hi: "काजल मोरे",
            mr: "काजल मोरे",
            kn: "ಕಾಜಲ್ ಮೋರೆ",
            te: "కాజల్ మోరే",
            ta: "காஜல் மோர்",
            bn: "কাজল মোরে"
        },
        "Deepa Pawar": {
            en: "Deepa Pawar",
            hi: "दीपा पवार",
            mr: "दीपा पवार",
            kn: "ದೀಪಾ ಪವಾರ್",
            te: "దీపా పవార్",
            ta: "தீபா பவார்",
            bn: "দীপা পাওয়ার"
        },
        "Dr. Amit Patel": {
            en: "Dr. Amit Patel",
            hi: "डॉ. अमित पटेल",
            mr: "डॉ. अमित पटेल",
            kn: "ಡಾ. ಅಮಿತ್ ಪಟೇಲ್",
            te: "డా. అమిత్ పటేల్",
            ta: "டாக்டர் அமித் படேல்",
            bn: "ডা. অমিত প্যাটেল"
        },
        "Dr. Sunita Krishnan": {
            en: "Dr. Sunita Krishnan",
            hi: "डॉ. सुनीता कृष्णन",
            mr: "डॉ. सुनीता कृष्णन",
            kn: "ಡಾ. ಸುನಿತಾ ಕೃಷ್ಣನ್",
            te: "డా. సునీత కృష్ణన్",
            ta: "டாக்டர் சுனிதா கிருஷ்ணன்",
            bn: "ডা. সুনীता कृष्णन"
        },
        "Dr. Vivek Sharma": {
            en: "Dr. Vivek Sharma",
            hi: "डॉ. विवेक शर्मा",
            mr: "डॉ. विवेक शर्मा",
            kn: "ಡಾ. ವಿವೇಕ್ ಶರ್ಮಾ",
            te: "డా. వివేక్ శర్మ",
            ta: "டாக்டர் விவேக் சர்மா",
            bn: "ডা. विवेक शर्मा"
        },
        "Dr. Priya Nair": {
            en: "Dr. Priya Nair",
            hi: "डॉ. प्रिया नायर",
            mr: "डॉ. प्रिया नायर",
            kn: "ಡಾ. ಪ್ರಿಯಾ ನಾಯರ್",
            te: "డా. ప్రియా నాయర్",
            ta: "டாக்டர் பிரியா நாயர்",
            bn: "ডা. প্রিয়া নায়ার"
        },
        "Dr. Vikram Joshi": {
            en: "Dr. Vikram Joshi",
            hi: "डॉ. विक्रम जोशी",
            mr: "डॉ. विक्रम जोशी",
            kn: "ಡಾ. ವಿಕ್ರಮ್ ಜೋಶಿ",
            te: "డా. విక్రమ్ జోషి",
            ta: "டாக்டர் விக்ரம் ஜோஷி",
            bn: "ডা. বিক্রম ஜோশী"
        },
        "Jiya Sharma": {
            en: "Jiya Sharma",
            hi: "जिया शर्मा",
            mr: "जिया शर्मा",
            kn: "ಜಿಯಾ ಶರ್ಮಾ",
            te: "జియా శర్మ",
            ta: "ஜியா சர்மா",
            bn: "জিয়া শর্মা"
        },
        "Priya Patel": {
            en: "Priya Patel",
            hi: "प्रिया पटेल",
            mr: "प्रिया पटेल",
            kn: "ಪ್ರಿಯಾ ಪಟೇಲ್",
            te: "ప్రియా పటేల్",
            ta: "பிரியா படேல்",
            bn: "प्रিয়া প্যাটেল"
        },
        "Anjali Desai": {
            en: "Anjali Desai",
            hi: "अंजलि देसाई",
            mr: "अंजली देसाई",
            kn: "ಅಂಜಲಿ ದೇಸಾಯಿ",
            te: "అంజలి దేశాయ్",
            ta: "அஞ்சலி தேசாய்",
            bn: "অঞ্জলি দেশাই"
        },
        "Kavita Singh": {
            en: "Kavita Singh",
            hi: "कविता सिंह",
            mr: "कविता सिंग",
            kn: "ಕವಿತಾ ಸಿಂಗ್",
            te: "కవిత సింగ్",
            ta: "கவிதா சிங்",
            bn: "কবিতা সিং"
        },
        "System fallback activated. Standard clinical rules applied without extended context.": {
            hi: "सिस्टम फ़ॉलबैक सक्रिय: विस्तारित संदर्भ के बिना मानक नैदानिक नियम लागू किए गए।",
            mr: "सिस्टम फॉलबॅक सक्रिय: विस्तारित संदर्भाशिवाय मानक क्लिनिकल नियम लागू केले.",
            kn: "ಸಿಸ್ಟಮ್ ಫಾಲ್ಬ್ಯಾಕ್ ಸಕ್ರಿಯವಾಗಿದೆ: ವಿಸ್ತೃತ ಸಂದರ್ಭವಿಲ್ಲದೆ ಪ್ರಮಾಣಿತ ಕ್ಲಿನಿಕಲ್ ನಿಯಮಗಳನ್ನು ಅನ್ವಯಿಸಲಾಗಿದೆ.",
            te: "సిస్టమ్ ఫాల్‌బ్యాక్ యాక్టివేట్ చేయబడింది: విస్తరించిన సందర్భం లేకుండా ప్రామాణిక క్లినికల్ నియమాలు వర్తింపజేయబడ్డాయి.",
            ta: "கணினி ஃபால்பேக் செயல்படுத்தப்பட்டது: விரிவாக்கப்பட்ட சூழல் இல்லாமல் நிலையான மருத்துவ விதிகள் பயன்படுத்தப்பட்டன.",
            bn: "সিস্টেম ফলব্যাক সক্রিয়: অতিরিক্ত তথ্য ছাড়াই সাধারণ চিকিৎসাগত নিয়ম প্রয়োগ করা হয়েছে।"
        },
        "System fallback activated: All provided Google Gemini API Keys have exceeded free-tier quota limits. Please upgrade or replace the GOOGLE_API_KEY.": {
            hi: "सिस्टम फ़ॉलबैक सक्रिय: सभी दिए गए Google Gemini API Keys ने मुफ़्त-टीयर कोटा सीमा पार कर ली है। कृपया GOOGLE_API_KEY को अपग्रेड या बदलें।",
            mr: "सिस्टम फॉलबॅक सक्रिय: सर्व प्रदान केलेल्या Google Gemini API Keys ने विनामूल्य-श्रेणी कोटा मर्यादा ओलांडली आहे. कृपया GOOGLE_API_KEY अपग्रेड करा किंवा बदला.",
            kn: "ಸಿಸ್ಟಮ್ ಫಾಲ್ಬ್ಯಾಕ್ ಸಕ್ರಿಯವಾಗಿದೆ: ಒದಗಿಸಲಾದ ಎಲ್ಲಾ Google Gemini API ಕೀಗಳು ಉಚಿತ-ಶ್ರೇಣಿಯ ಕೋಟಾ ಮಿತಿಗಳನ್ನು ಮೀರಿದೆ. ದಯವಿಟ್ಟು GOOGLE_API_KEY ಅನ್ನು ನವೀಕರಿಸಿ ಅಥವಾ ಬದಲಾಯಿಸಿ.",
            te: "సిస్టమ్ ఫాల్‌బ్యాక్ యాక్టివేట్ చేయబడింది: అందించిన అన్ని Google Gemini API కీలు ఉచిత-శ్రేణి కోటా పరిమితులను మించిపోయాయి. దయచేసి GOOGLE_API_KEYని అప్‌గ్రేడ్ చేయండి లేదా భర్తీ చేయండి.",
            ta: "கணினி ஃபால்பேக் செயல்படுத்தப்பட்டது: வழங்கப்பட்ட அனைத்து Google Gemini API விசைகளும் இலவச அடுக்கு ஒதுக்கீட்டு வரம்புகளை மீறிவிட்டன. GOOGLE_API_KEY ஐ மேம்படுத்தவும் அல்லது மாற்றவும்.",
            bn: "সিস্টেম ফলব্যাক সক্রিয়: সমস্ত প্রদত্ত Google Gemini API কীগুলি বিনামূল্যের কোটা সীমা অতিক্রম করেছে। অনুগ্রহ করে GOOGLE_API_KEY আপগ্রেড বা পরিবর্তন করুন।"
        },
        "System fallback activated. Standard clinical rules applied.": {
            hi: "सिस्टम फ़ॉलबैक सक्रिय। मानक नैदानिक नियम लागू।",
            mr: "सिस्टम फॉलबॅक सक्रिय. मानक क्लिनिकल नियम लागू.",
            kn: "ಸಿಸ್ಟಮ್ ಫಾಲ್ಬ್ಯಾಕ್ ಸಕ್ರಿಯವಾಗಿದೆ. ಪ್ರಮಾಣಿತ ಕ್ಲಿನಿಕಲ್ ನಿಯಮಗಳನ್ನು ಅನ್ವಯಿಸಲಾಗಿದೆ.",
            te: "సిస్టమ్ ఫాల్‌బ్యాక్ యాక్టివేట్ చేయబడింది. ప్రామాణిక క్లినికల్ నియమాలు వర్తించబడ్డాయి.",
            ta: "கணினி ஃபால்பேக் செயல்படுத்தப்பட்டது. நிலையான மருத்துவ விதிகள் பயன்படுத்தப்பட்டன.",
            bn: "সিস্টেম ফলব্যাক সক্রিয়। সাধারণ চিকিৎসাগত নিয়ম প্রয়োগ করা হয়েছে।"
        },
        "Standard clinical rules applied.": {
            hi: "मानक नैदानिक नियम लागू।",
            mr: "मानक क्लिनिकल नियम लागू.",
            kn: "ಪ್ರಮಾಣಿತ ಕ್ಲಿನಿಕಲ್ ನಿಯಮಗಳನ್ನು ಅನ್ವಯಿಸಲಾಗಿದೆ.",
            te: "ప్రామాణిక క్లినికల్ నియమాలు వర్తించబడ్డాయి.",
            ta: "நிலையான மருத்துவ விதிகள் பயன்படுத்தப்பட்டன.",
            bn: "সাধারণ চিকিৎসাগত নিয়ম প্রয়োগ করা হয়েছে।"
        },
        "Fallback Guidance": {
            hi: "फ़ॉलबैक मार्गदर्शन",
            mr: "फॉलबॅक मार्गदर्शन",
            kn: "ಫಾಲ್ಬ್ಯಾಕ್ ಮಾರ್ಗದರ್ಶನ",
            te: "ఫాల్‌బ్యాక్ మార్గదర్శకత్వం",
            ta: "மாற்று வழிகாட்டுதல்",
            bn: "জরুরি পরামর্শ"
        },
        "Clinical Dietary Plan": {
            hi: "नैदानिक आहार योजना",
            mr: "क्लिनिकल आहाराची योजना",
            kn: "ಕ್ಲಿನಿಕಲ್ ಡಯೆಟರಿ ಯೋಜನೆ",
            te: "క్లినికల్ డైటరీ ప్లాన్",
            ta: "மருத்துவ உணவு திட்டம்",
            bn: "ক্লিনিকাল ডায়েট প্ল্যান"
        },
        "Environmental Safety Protocols": {
            hi: "पर्यावरणीय सुरक्षा प्रोटोकॉल",
            mr: "पर्यावरणीय सुरक्षा प्रोटोकॉल",
            kn: "ಪರಿಸರ ಸುರಕ್ಷತಾ ಶಿಷ್ಟಾಚಾರಗಳು",
            te: "పర్యావరణ భద్రతా ప్రోటోకాల్‌లు",
            ta: "சுற்றுச்சூழல் பாதுகாப்பு நெறிமுறைகள்",
            bn: "পরিবেশগত সুরক্ষা প্রোটোকল"
        },
        "Medication & Monitoring": {
            hi: "दवा और निगरानी",
            mr: "औषधोपचार आणि देखरेख",
            kn: "ಔಷಧಿ ಮತ್ತು ಮೇಲ್ವಿಚಾರಣೆ",
            te: "ఔషధాలు & పర్యవేక్షణ",
            ta: "மருந்து மற்றும் கண்காணிப்பு",
            bn: "ওষুধ এবং পর্যবেক্ষণ"
        },
        "Maintain a balanced diet with plenty of seasonal vegetables and fruits.": {
            hi: "भरपूर मौसमी सब्जियों और फलों के साथ संतुलित आहार बनाए रखें।",
            mr: "पुष्कळ हंगामी भाज्या आणि फळांसह संतुलित आहार ठेवा.",
            kn: "ಸಾಕಷ್ಟು ಕಾಲೋಚಿತ ತರಕಾರಿಗಳು ಮತ್ತು ಹಣ್ಣುಗಳೊಂದಿಗೆ ಸಮತೋಲನ ಆಹಾರವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ.",
            te: "పుష్కలంగా సీజనల్ కూరగాయలు మరియు పండ్లతో కూడిన సమతుల్య ఆహారాన్ని తీసుకోండి.",
            ta: "ஏராளமான பருவகால காயறிகள் மற்றும் பழங்களுடன் சமச்சீரான உணவைப் பராமரிக்கவும்.",
            bn: "প্রচুর ঋতুভিত্তিক শাকসবজি এবং ফল সহ সুষম খাদ্য বজায় রাখুন।"
        },
        "Continue standard prenatal supplements as prescribed.": {
            hi: "निर्देशानुसार मानक प्रसवपूर्व सप्लीमेंट्स जारी रखें।",
            mr: "थोरल्या सूचनेनुसार प्रसवपूर्व सप्लीमेंट्स घेणे सुरू ठेवा.",
            kn: "ಸೂಚಿಸಿದಂತೆ ಪ್ರಮಾಣಿತ ಪ್ರಸವಪೂರ್ವ ಪೂರಕಗಳನ್ನು ಮುಂದುವರಿಸಿ.",
            te: "సూచించిన విధంగా ప్రామాణిక ప్రసవపూర్వక సప్లిమెంట్లను కొనసాగించండి.",
            ta: "பரிந்துரைக்கப்பட்டபடி நிலையான மகப்பேறுக்கு முந்தைய சப்ளிமெண்ட்ஸைத் தொடரவும்.",
            bn: "পরামর্শ অনুযায়ী সাধারণ প্রসবপূর্ব সাপ্লিমেন্ট নেওয়া বজায় রাখুন।"
        },
        "LOW": {
            hi: "कम",
            mr: "कमी",
            kn: "ಕಡಿಮೆ",
            te: "తక్కువ",
            ta: "குறைந்த",
            bn: "কম"
        },
        "MODERATE": {
            hi: "मध्यम",
            mr: "मध्यम",
            kn: "ಮಧ್ಯಮ",
            te: "మధ్యస్థ",
            ta: "மிதமான",
            bn: "মাঝারি"
        },
        "HIGH": {
            hi: "उच्च",
            mr: "उच्च",
            kn: "ಹೆಚ್ಚಿನ",
            te: "అధిక",
            ta: "அதிக",
            bn: "উচ্চ"
        },
        "CRITICAL": {
            hi: "गंभीर",
            mr: "गंभीर",
            kn: "ಅತಿ ಹೆಚ್ಚು",
            te: "తీవ్రమైన",
            ta: "மிக கடுமையான",
            bn: "অত্যন্ত ঝুঁকিপূর্ণ"
        },
        "AI Logic: Clinical x Environmental": {
            hi: "एआई लॉजिक: क्लिनिकल x एनवायरनमेंटल",
            mr: "एआय लॉजिक: क्लिनिकल x पर्यावरणीय",
            kn: "AI ಲಾಜಿಕ್: ಕ್ಲಿನಿಕಲ್ x ಪರಿಸರ",
            te: "AI లాజిక్: క్లినికల్ x పర్యావరణ",
            ta: "AI லாஜிக்: கிளினிக்கல் x சுற்றுச்சூழல்",
            bn: "এআই লজিক: ক্লিনিকাল x পরিবেশগত"
        },
        "AI Clinical Justification": {
            hi: "एआई नैदानिक औचित्य",
            mr: "एआय क्लिनिकल जस्टिफिकेशन",
            kn: "AI ಕ್ಲಿನಿಕಲ್ ಜಸ್ಟಿಫಿಕೇಶನ್",
            te: "AI క్లినికల్ జస్టిఫికేషన్",
            ta: "AI மருத்துவ நியாயப்படுத்துதல்",
            bn: "এআই ক্লিনিকাল জাস্টিফিকেশন"
        },
        "Environmental Impact": {
            hi: "पर्यावरणीय प्रभाव",
            mr: "पर्यावरणीय प्रभाव",
            kn: "ಪರಿಸರ ಪ್ರಭಾವ",
            te: "పర్యావరణ ప్రభావం",
            ta: "சுற்றுச்சூழல் பாதிப்பு",
            bn: "পরিবেশগত প্রভাব"
        },
        "Maintain hydration": {
            hi: "शरीर में पानी की कमी न होने दें (हाइड्रेशन बनाए रखें)।",
            mr: "हायड्रेशन टिकवून ठेवा (भरपूर पाणी प्या).",
            kn: "ದೇಹದಲ್ಲಿ ನೀರಿನಂಶವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ.",
            te: "శరీరంలో తగినంత నీటి శాతం ఉండేలా చూసుకోండి.",
            ta: "நீர்ச்சத்தை பராமரிக்கவும்.",
            bn: "শরীর হাইড্রেটেড রাখুন।"
        },
        "Regular walking": {
            hi: "नियमित रूप से टहलें।",
            mr: "नियमित चाला.",
            kn: "ನಿಯಮಿತವಾಗಿ ನಡಿಗೆ ಮಾಡಿ.",
            te: "క్రమం తప్పకుండా నడవండి.",
            ta: "வழக்கமான நடைப்பயிற்சி செய்யவும்.",
            bn: "নিয়মিত হাঁটাহাঁটি করুন।"
        },
        "Continue balanced diet": {
            hi: "संतुलित आहार जारी रखें।",
            mr: "संतुलित आहार सुरू ठेवा.",
            kn: "ಸಮತೋಲಿತ ಆಹಾರವನ್ನು ಮುಂದುವರಿಸಿ.",
            te: "సమతుల్య ఆహారాన్ని కొనసాగించండి.",
            ta: "சீரான உணவைத் தொடரவும்.",
            bn: "সুষম খাদ্য গ্রহণ অব্যাহত রাখুন।"
        },
        "Iron supplements": {
            hi: "आयरन सप्लीमेंट्स",
            mr: "लोहा (आयर्न) सप्लीमेंट्स",
            kn: "ಕಬ್ಬಿಣದ ಅಂಶದ ಸಪ್ಲಿಮೆಂಟ್ಸ್",
            te: "ఐరన్ సప్లిమెంట్లు",
            ta: "இரும்பு சத்து சப்ளிமெண்ட்ஸ்",
            bn: "আয়রন সাপ্লিমেন্ট"
        }
    };

    if (cleanText.startsWith("Reported Symptoms:")) {
        const symptomsPart = cleanText.replace("Reported Symptoms:", "").trim();
        const prefixMap: Record<Language, string> = {
            en: "Reported Symptoms",
            hi: "रिपोर्ट किए गए लक्षण",
            mr: "नोंदवलेली लक्षणे",
            kn: "ವರದಿಯಾದ ಲಕ್ಷಣಗಳು",
            te: "నివేదించబడిన లక్షణాలు",
            ta: "அறிவிக்கப்பட்ட அறிகுறிகள்",
            bn: "প্রতিবেদিত লক্ষণগুলি"
        };
        const prefix = prefixMap[lang] || "Reported Symptoms";
        
        const symptomMappings: Record<string, Partial<Record<Language, string>>> = {
            "Headaches": {
                hi: "सिरदर्द",
                mr: "डोकेदुखी",
                kn: "ತಲೆನೋವು",
                te: "తలనొప్పి",
                ta: "தலைவலி",
                bn: "মাথাব্যথা"
            },
            "Headache": {
                hi: "सिरदर्द",
                mr: "डोकेदुखी",
                kn: "ತಲೆನೋವು",
                te: "తలనొప్పి",
                ta: "தலைவலி",
                bn: "মাথাব্যথা"
            },
            "Swelling": {
                hi: "सूजन",
                mr: "सूज",
                kn: "ಊತ",
                te: "వాపు",
                ta: "வீக்கம்",
                bn: "ফোলা"
            },
            "Vision issues": {
                hi: "धुंधला दिखना या दृष्टि समस्याएं",
                mr: "दृष्टी समस्या",
                kn: "ದೃಷ್ಟಿ ತೊಂದರೆಗಳು",
                te: "దృష్టి సమస్యలు",
                ta: "பார்வை பிரச்சினைகள்",
                bn: "দৃষ্টিশক্তির সমস্যা"
            }
        };
        
        const translatedSymptom = symptomMappings[symptomsPart]?.[lang] || symptomsPart;
        return `${prefix}: ${translatedSymptom}`;
    }

    const clinicalFlagsMappings: Record<string, Partial<Record<Language, string>>> = {
        "Hypertension Level 1": {
            hi: "उच्च रक्तचाप स्तर 1",
            mr: "उच्च रक्तदाब पातळी १",
            kn: "ರಕ್ತದೊತ್ತಡ ಮಟ್ಟ 1",
            te: "అధిక రక్తపోటు స్థాయి 1",
            ta: "உயர் இரத்த அழுத்தம் நிலை 1",
            bn: "উচ্চ রক্তচাপ স্তর ১"
        },
        "Severe Hypertension (Preeclampsia Risk)": {
            hi: "गंभीर उच्च रक्तचाप (प्रीइमप्लेम्पसिया जोखिम)",
            mr: "गंभीर उच्च रक्तदाब (प्रीइक्लेम्पसिया जोखीम)",
            kn: "ತೀವ್ರ ರಕ್ತದೊತ್ತಡ (ಪ್ರಿಕ್ಲಾಂಪ್ಸಿಯಾ ಅಪಾಯ)",
            te: "తీవ్రమైన అధిక రక్తపోటు (ప్రీఎక్లాంప్సియా ముప్పు)",
            ta: "கடுமையான உயர் இரத்த அழுத்தம் (ப்ரீக்ளாம்ப்ஸியா ஆபத்து)",
            bn: "গুরুতর উচ্চ রক্তচাপ (প্রি-এক্লাম্পসিয়া ঝুঁকি)"
        },
        "Anemia Detected": {
            hi: "एनीमिया (खून की कमी) पाई गई",
            mr: "ॲनिमिया आढळला (रक्ताची कमतरता)",
            kn: "ರಕ್ತಹೀನತೆ ಪತ್ತೆಯಾಗಿದೆ",
            te: "రक्तహీనత గుర్తించబడింది",
            ta: "இரத்த சோகை கண்டறியப்பட்டது",
            bn: "রক্তাল্পতা সনাক্ত করা হয়েছে"
        },
        "Severe Anemia": {
            hi: "गंभीर एनीमिया (अत्यधिक खून की कमी)",
            mr: "गंभीर ॲनिमिया",
            kn: "ತೀವ್ರ ರಕ್ತಹೀನತೆ",
            te: "తీవ్రమైన రక్తహీనత",
            ta: "கடுமையான இரத்த சோகை",
            bn: "গুরুতর রক্তাল্পতা"
        },
        "Elevated Blood Glucose": {
            hi: "रक्त में ग्लूकोज का स्तर बढ़ा हुआ",
            mr: "रक्तातील ग्लुकोजची पातळी वाढली",
            kn: "ರಕ್ತದಲ್ಲಿನ ಗ್ಲೂಕೋಸ್ ಹೆಚ್ಚಾಗಿದೆ",
            te: "రक्तంలో గ్లూకోజ్ పెరిగింది",
            ta: "அதிகரித்த இரத்த குளுக்கோஸ்",
            bn: "রক্তে গ্লুকোজের মাত্রা বৃদ্ধি"
        },
        "Possible Gestational Diabetes": {
            hi: "गर्भावधि मधुमेह (डायबिटीज) की संभावना",
            mr: "गर्भधारणेदरम्यानचा मधुमेह शक्यता",
            kn: "ಗರ್ಭಾವಸ್ಥೆಯ ಮಧುಮೇಹದ ಸಾಧ್ಯತೆ",
            te: "గర్భధారణ మధుమేహం వచ్చే అవకాశం",
            ta: "கர்ப்பகால நீরিழிவு நோய் சாத்தியம்",
            bn: "গর্ভকালীন ডায়াবেটিসের সম্ভাবনা"
        }
    };

    const targetClinicalMap = clinicalFlagsMappings[cleanText];
    if (targetClinicalMap && targetClinicalMap[lang]) {
        return targetClinicalMap[lang];
    }

    const targetMap = mappings[cleanText];
    if (targetMap && targetMap[lang]) {
        return targetMap[lang];
    }

    const digits = numDigits[lang];
    if (digits && lang !== "en") {
        return cleanText.replace(/[0-9]/g, (match) => digits[parseInt(match, 10)]);
    }

    return text;
}
