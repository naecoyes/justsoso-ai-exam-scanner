const translations = {
  zh: {
    // Header
    appTitle: "AI 拍照答题",
    appSubtitle: "智能题库扫描与解析",
    
    // Camera
    cameraNotStarted: "相机未启动",
    cameraMessage: "请使用 HTTPS 访问并允许相机权限",
    analyzing: "正在分析图片...",
    capture: "拍照识别",
    startCamera: "启动相机",
    starting: "启动中...",
    stop: "停止",
    uploadImage: "上传图片",
    viewfinder: "横屏取景框",
    portraitViewfinder: "竖屏取景框",
    
    // Result
    waitingForImage: "等待图片输入",
    question: "题目",
    answer: "答案",
    explanation: "解析",
    references: "参考资料",
    noAnswer: "未检测到明确答案",
    noExplanation: "暂无解析",
    noReferences: "暂无匹配的参考资料",
    resultHint: "拍照或上传图片，即可识别题目、获取答案和解析",
    
    // Auto Scan
    autoScan: "自动扫描",
    waitingNext: "等待下次自动拍照",
    readyForCapture: "可手动或自动拍照",
    enableCamera: "请先启动相机",
    seconds: "秒",
    
    // Question Bank
    myQuestionBank: "我的题库",
    questions: "道题目",
    importBank: "导入题库",
    noBank: "暂无题库",
    supportedFormats: "支持 JSON、CSV、TXT、MD 格式",
    importSuccess: "成功导入 {count} 道题目",
    importFailed: "导入失败",
    noValidQuestions: "未找到有效题目",
    unsupportedFormat: "支持格式：JSON、CSV、TXT、MD",
    delete: "删除",
    
    // Question List
    questionList: "问题列表",
    noQuestions: "暂无问题记录",
    autoSaveHint: "扫描题目后自动保存",
    export: "导出",
    clearAll: "清空",
    confirmClear: "确定清空所有记录吗？",
    
    // History
    history: "历史记录",
    noHistory: "暂无历史记录",
    noAnswerFound: "未找到答案",
    records: "条记录",
    clearHistory: "清除历史",
    
    // Settings
    modelSettings: "模型设置",
    apiKey: "API Key",
    baseUrl: "Base URL（可选）",
    modelName: "模型名称（可选）",
    saveSettings: "保存设置",
    saved: "已保存",
    quickMode: "快速解题",
    quickModeDesc: "跳过引用和解析，直接给答案",
    
    // Errors
    analysisFailed: "分析失败，请重试",
    autoCaptureFailed: "自动拍照失败",
    pleaseStartCamera: "请先启动相机",
    
    // Language
    language: "语言",
    chinese: "中文",
    english: "English"
  },
  en: {
    // Header
    appTitle: "AI Exam Scanner",
    appSubtitle: "Smart Question Bank Scanning & Analysis",
    
    // Camera
    cameraNotStarted: "Camera Not Started",
    cameraMessage: "Use HTTPS on mobile and allow camera access",
    analyzing: "Analyzing image...",
    capture: "Capture",
    startCamera: "Start Camera",
    starting: "Starting...",
    stop: "Stop",
    uploadImage: "Upload Image",
    viewfinder: "Landscape Viewfinder",
    portraitViewfinder: "Portrait Viewfinder",
    
    // Result
    waitingForImage: "Waiting for image",
    question: "Question",
    answer: "Answer",
    explanation: "Explanation",
    references: "References",
    noAnswer: "No clear answer detected",
    noExplanation: "No explanation",
    noReferences: "No references matched",
    resultHint: "Capture or upload an image to see the question, answer, and explanation",
    
    // Auto Scan
    autoScan: "Auto Scan",
    waitingNext: "Waiting for next capture",
    readyForCapture: "Ready for manual or auto capture",
    enableCamera: "Enable camera to start",
    seconds: "s",
    
    // Question Bank
    myQuestionBank: "My Question Bank",
    questions: "questions",
    importBank: "Import",
    noBank: "No question bank",
    supportedFormats: "Supports JSON, CSV, TXT, MD",
    importSuccess: "Successfully imported {count} questions",
    importFailed: "Import failed",
    noValidQuestions: "No valid questions found",
    unsupportedFormat: "Supported: JSON, CSV, TXT, MD",
    delete: "Delete",
    
    // Question List
    questionList: "Question List",
    noQuestions: "No questions recorded",
    autoSaveHint: "Auto-saved after scanning",
    export: "Export",
    clearAll: "Clear All",
    confirmClear: "Are you sure to clear all records?",
    
    // History
    history: "History",
    noHistory: "No history yet",
    noAnswerFound: "No answer",
    records: "records",
    clearHistory: "Clear History",
    
    // Settings
    modelSettings: "Model Settings",
    apiKey: "API Key",
    baseUrl: "Base URL (optional)",
    modelName: "Model Name (optional)",
    saveSettings: "Save Settings",
    saved: "Saved!",
    quickMode: "Quick Mode",
    quickModeDesc: "Skip references & explanation",
    
    // Errors
    analysisFailed: "Analysis failed, please try again",
    autoCaptureFailed: "Auto capture failed",
    pleaseStartCamera: "Please start camera first",
    
    // Language
    language: "Language",
    chinese: "中文",
    english: "English"
  }
};

export default translations;