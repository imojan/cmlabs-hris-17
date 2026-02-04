// src/app/locales/en.js
// English translations
export default {
  // ============================================
  // COMMON / GENERAL
  // ============================================
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    export: "Export",
    import: "Import",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    confirm: "Confirm",
    close: "Close",
    loading: "Loading...",
    loadingData: "Loading data...",
    noData: "No data available",
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",
    yes: "Yes",
    no: "No",
    all: "All",
    actions: "Actions",
    status: "Status",
    date: "Date",
    time: "Time",
    locale: "en-US",
    name: "Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    description: "Description",
    view: "View",
    download: "Download",
    upload: "Upload",
    refresh: "Refresh",
    reset: "Reset",
    apply: "Apply",
    select: "Select",
    required: "Required",
    optional: "Optional",
    showMore: "Show More",
    showLess: "Show Less",
    total: "Total",
    seeDetails: "See Details",
    approved: "Approved",
    rejected: "Rejected",
    pending: "Pending",
    notes: "Notes",
    failedToExport: "Failed to export data",
    exportSuccess: "Data exported successfully",
    failedToLoad: "Failed to load data",
    tryAgain: "Try Again",
    none: "None",
  },

  // ============================================
  // NAVIGATION / SIDEBAR
  // ============================================
  nav: {
    dashboard: "Dashboard",
    employeeDatabase: "Employee Database",
    attendance: "Attendance",
    checkclock: "Attendance",
    workSchedule: "Work Schedule",
    settings: "Settings",
    faqHelp: "FAQ & Help",
    logout: "Logout",
    profile: "Profile",
    notifications: "Notifications",
  },

  // ============================================
  // AUTH PAGES
  // ============================================
  auth: {
    // Sign In
    signIn: "Sign In",
    signInTitle: "Sign In to Your Account",
    signInSubtitle: "Welcome back! Please enter your details.",
    signInWithGoogle: "Sign In with Google",
    signInWithEmail: "Sign In with Email",
    orContinueWith: "or continue with",
    emailOrUsername: "Email or Username",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    dontHaveAccount: "Don't have an account?",
    signUpNow: "Sign up now",
    signInHere: "Sign in here",
    
    // Sign Up
    signUp: "Sign Up",
    signUpTitle: "Create New Account",
    signUpSubtitle: "Create your account and streamline your employee management.",
    tryForFree: "Try for free!",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    companyName: "Company Name",
    confirmPassword: "Confirm Password",
    alreadyHaveAccount: "Already have an account?",
    signInNow: "Sign in now",
    agreeToTerms: "I agree to the",
    agreeTerms: "I agree with the terms of use of",
    termsAndConditions: "Terms & Conditions",
    privacyPolicy: "Privacy Policy",
    signingUp: "Signing up...",
    signingIn: "Signing in...",
    
    // Placeholders
    enterFirstName: "Enter Your First Name",
    enterLastName: "Enter Your Last Name",
    enterEmail: "Enter Your Email",
    enterPassword: "Enter Your Password",
    confirmYourPassword: "Confirm Your Password",
    enterCompanyName: "Enter Your Company",
    
    // Google
    continueWithGoogle: "Continue With Google",
    
    // Employee Sign In
    employeeSignIn: "Employee Sign In With ID",
    employeeSignInSubtitle: "Sign in using your Employee ID",
    companyUsername: "Company Username",
    employeeId: "Employee ID",
    
    // Forgot Password
    forgotPasswordTitle: "Forgot Password?",
    forgotPasswordSubtitle: "Enter your email and we'll send you a reset link",
    sendResetLink: "Send Reset Link",
    backToSignIn: "Back to sign in",
    
    // Reset Password
    resetPassword: "Reset Password",
    resetPasswordTitle: "Create New Password",
    newPassword: "New Password",
    resetPasswordSuccess: "Password successfully reset!",
    
    // Validation Messages
    emailRequired: "Email is required.",
    passwordRequired: "Password is required.",
    invalidEmail: "Please enter a valid email.",
    passwordMinLength: "Password must be at least 8 characters",
    passwordsNotMatch: "Passwords do not match",
    invalidCredentials: "Invalid email or password",
    accountNotFound: "Account not found",
    firstNameRequired: "First name is required.",
    lastNameRequired: "Last name is required.",
    confirmPasswordRequired: "Please confirm your password.",
    minCharacters: "Minimum {min} characters.",
    passwordMismatch: "Passwords do not match.",
    agreeRequired: "You must agree to the terms.",
    fillAllFields: "Please fill in all required fields correctly.",
    pleaseField: "Please fill in {field} field.",
    accountCreated: "Account created successfully! Redirecting to sign in...",
    accountCreatedPayment: "Account created! Redirecting to sign in to continue payment...",
    signUpFailed: "Failed to sign up. Please try again.",
  },

  // ============================================
  // DASHBOARD
  // ============================================
  dashboard: {
    title: "Dashboard",
    welcome: "Welcome",
    overview: "Overview",
    todayAttendance: "Today's Attendance",
    totalEmployees: "Total Employees",
    activeEmployees: "Active Employees",
    newEmployees: "New Employees",
    pastEmployees: "Past Employees",
    onLeave: "On Leave",
    present: "Present",
    absent: "Absent",
    late: "Late",
    earlyLeave: "Early Leave",
    onTime: "On Time",
    attendance: "Attendance",
    
    // User Dashboard specific
    workHours: "Work Hours",
    attendanceSummary: "Attendance Summary",
    leaveSummary: "Leave Summary",
    yourWorkHours: "Your Work Hours",
    totalQuotaAnnualLeave: "Total Quota Annual Leave",
    requestLeave: "Request Leave",
    taken: "Taken",
    remaining: "Remaining",
    viewBy: "view by",
    errorLoading: "Error loading dashboard",
    leaveHistory: "Leave History",
    noLeaveHistory: "No leave history found",
    
    // Chart data
    new: "New",
    active: "Active",
    resign: "Resign",
    
    // Stats Cards
    employeeStats: "Employee Statistics",
    attendanceStats: "Attendance Statistics",
    weeklyReport: "Weekly Report",
    monthlyReport: "Monthly Report",
    
    // Charts
    attendanceChart: "Attendance Chart",
    employeeDistribution: "Employee Distribution",
    departmentOverview: "Department Overview",
    employeeStatistics: "Employee Statistics",
    employeeStatus: "Employee Status",
    currentNumberEmployees: "Current Number of Employees",
    
    // Recent Activity
    recentActivity: "Recent Activity",
    viewAll: "View All",
    noRecentActivity: "No recent activity",
    
    // Quick Actions
    quickActions: "Quick Actions",
    addEmployee: "Add Employee",
    recordAttendance: "Record Attendance",
    createSchedule: "Create Schedule",
    generateReport: "Generate Report",
  },

  // ============================================
  // EMPLOYEE DATABASE
  // ============================================
  employee: {
    title: "Employee Database",
    subtitle: "Manage your company's employee data",
    allInfo: "All Employees Information",
    addEmployee: "Add Employee",
    addData: "Add Data",
    editEmployee: "Edit Employee",
    deleteEmployee: "Delete Employee",
    viewEmployee: "View Employee Details",
    employeeList: "Employee List",
    loadingData: "Loading employee data...",
    failedToLoad: "Failed to Load Data",
    tryAgain: "Try Again",
    noEmployeeData: "No Employee Data Yet",
    noEmployeeWithKeyword: "No employee found with keyword",
    startByAdding: "Start by adding your first employee",
    searchEmployee: "Search Employee",
    
    // Table Headers
    no: "No.",
    avatar: "Avatar",
    name: "Name",
    employeeId: "Employee ID",
    fullName: "Full Name",
    gender: "Gender",
    phoneNumber: "Phone Number",
    mobileNumber: "Mobile Number",
    branch: "Branch",
    position: "Position",
    department: "Department",
    joinDate: "Join Date",
    contractType: "Contract Type",
    contractStatus: "Contract Status",
    grade: "Grade",
    action: "Action",
    
    // Form Fields
    firstName: "First Name",
    lastName: "Last Name",
    birthDate: "Birth Date",
    birthPlace: "Birth Place",
    nik: "National ID (NIK)",
    religion: "Religion",
    maritalStatus: "Marital Status",
    education: "Last Education",
    
    // Form Section Titles
    accountLogin: "Employee Login Account",
    personalInfo: "Personal Information",
    employmentInfo: "Employment Information",
    bankInfo: "Bank Information",
    
    // Form labels
    addNewEmployee: "Add New Employee",
    email: "Email",
    password: "Password",
    spType: "SP Type",
    
    // Placeholders
    enterEmployeeId: "e.g. EMP001",
    enterEmail: "employee@company.com",
    enterPassword: "Minimum 6 characters",
    enterFirstName: "Enter first name",
    enterLastName: "Enter last name",
    enterMobileNumber: "Enter mobile number",
    enterNik: "Enter NIK",
    enterBirthPlace: "Enter birth place",
    enterPosition: "Enter position",
    enterBranch: "Enter branch",
    enterAccountNumber: "Enter account number",
    enterAccountName: "Enter account holder name",
    enterGrade: "Enter your grade",
    chooseGender: "Choose Gender",
    chooseEducation: "Choose Education",
    chooseContractType: "Choose Contract Type",
    chooseGrade: "Choose Grade",
    chooseBank: "Choose Bank",
    chooseSP: "Choose SP Status",
    
    // Helper texts
    idForLogin: "This ID will be used for employee login",
    forPasswordRecovery: "For password recovery",
    defaultPassword: "Default password for first time login",
    uploadAvatar: "Upload Avatar",
    selected: "Selected",
    noSP: "None",
    
    // Confirmation modal
    confirmAddData: "Confirm Add Data",
    confirmAddMessage: "Are you sure you want to add this new employee data?",
    confirmAddSubMessage: "Make sure all information entered is correct.",
    yesAdd: "Yes, Add",
    saving: "Saving...",
    
    // Validation messages
    fillRequiredFields: "Please fill in Employee ID, Email, and Password!",
    fillPersonalFields: "Please fill in all required fields (Name, NIK, Phone)!",
    invalidEmailFormat: "Invalid email format!",
    passwordMinLength: "Password must be at least 6 characters!",
    
    // Gender Options
    male: "Male",
    female: "Female",
    
    // Contract Types
    permanent: "Permanent",
    trial: "Trial",
    contract: "Contract (PKWT)",
    intern: "Internship",
    freelance: "Freelance",
    
    // Status
    active: "Active",
    inactive: "Inactive",
    resigned: "Resigned",
    terminated: "Terminated",
    new: "New",
    
    // Bank Info
    bankName: "Bank Name",
    accountNumber: "Account Number",
    accountHolder: "Account Holder",
    
    // Confirmations
    deleteConfirm: "Are you sure you want to delete this employee?",
    deleteSuccess: "Employee successfully deleted",
    saveSuccess: "Employee data successfully saved",
    updateSuccess: "Employee data successfully updated",
    
    // Filters
    filterByBranch: "Filter by Branch",
    filterByStatus: "Filter by Status",
    filterByDepartment: "Filter by Department",
    searchPlaceholder: "Search name or employee ID...",
    
    // Stats
    totalEmployees: "Total Employees",
    newThisMonth: "New This Month",
    byGender: "By Gender",
    byContract: "By Contract",
  },

  // ============================================
  // ATTENDANCE / CHECKCLOCK
  // ============================================
  attendance: {
    title: "Attendance",
    subtitle: "Manage employee attendance",
    overview: "Checkclock Overview",
    addCheckclock: "Add Checkclock",
    checkIn: "Check In",
    checkOut: "Check Out",
    checkInOut: "Check In/Out",
    clockIn: "Clock In",
    clockOut: "Clock Out",
    addAttendance: "Add Attendance",
    addData: "Add Data",
    loadingData: "Loading attendance data...",
    loadingEmployees: "Loading employee data...",
    noDataMatch: "No data matches your search",
    noAttendanceData: "No attendance data yet",
    clickAddData: "Click \"Add Data\" to add new attendance",
    searchEmployee: "Search Employee",
    
    // Form fields
    employee: "Employee",
    selectEmployee: "Select Employee",
    attendanceType: "Attendance Type",
    selectAttendanceType: "Select Attendance Type",
    realtimeAttendance: "Attendance Time (Realtime)",
    realtimeNote: "When you select attendance type, this time is saved as",
    realtimeNote2: "and can be sent to database.",
    location: "Location",
    selectLocation: "Select Location",
    locationMap: "Location Map",
    addressDetail: "Address Detail",
    addressPlaceholder: "Street Name, House/Apartment Number, etc.",
    latitude: "Latitude",
    longitude: "Longitude",
    latPlaceholder: "Location Lat",
    lngPlaceholder: "Location Long",
    mapClickNote: "Click on the map to select location or use \"My Location\" button",
    myLocation: "My Location",
    uploadProof: "Upload Supporting Document",
    dragDropHere: "Drag n Drop here",
    or: "Or",
    browse: "Browse",
    changeFile: "Change File",
    additionalNotes: "Additional Notes",
    notesPlaceholder: "Add additional notes if needed...",
    startDate: "Start Date",
    endDate: "End Date",
    remote: "Remote",
    other: "Other",
    loadingLocations: "Loading locations...",
    noLocationsRegistered: "No office locations registered yet. Add them in Settings → Office Locations",
    
    // Notifications
    mapRedirected: "Map redirected to",
    selectLocationOnMap: "Please select location on map or use My Location button",
    browserNoGeolocation: "Your browser does not support geolocation.",
    locationUpdated: "Location successfully updated!",
    locationFailed: "Failed to get location. Make sure location permission is allowed.",
    attendanceSaveSuccess: "Attendance data successfully saved!",
    attendanceSaveFailed: "Failed to save attendance data",
    loadEmployeesFailed: "Failed to load employee data",
    
    // Confirmation modal
    confirmSaveData: "Confirm Save Data",
    confirmSaveMessage: "Are you sure you want to submit this attendance data?",
    confirmSaveSubMessage: "Make sure all information entered is correct.",
    yesSend: "Yes, Submit",
    
    // Validation
    requiredEmployee: "Employee Name",
    requiredAttendanceType: "Attendance Type",
    requiredLocation: "Location",
    requiredCoordinates: "Location Coordinates (Select on map or use My Location)",
    requiredAddress: "Address Detail",
    fillAllRequired: "Please fill in all required fields:",
    
    // Status
    present: "Present",
    absent: "Absent",
    late: "Late",
    earlyLeave: "Early Leave",
    onTime: "On Time",
    onLeave: "On Leave",
    holiday: "Holiday",
    sickLeave: "Sick Leave",
    annualLeave: "Annual Leave",
    permit: "Permit",
    waitingApproval: "Waiting Approval",
    
    // Table Headers
    date: "Date",
    clockInTime: "Clock In Time",
    clockOutTime: "Clock Out Time",
    workHours: "Work Hours",
    overtime: "Overtime",
    proof: "Proof",
    
    // Form
    editAttendance: "Edit Attendance",
    selectDate: "Select Date",
    
    // Types
    wfo: "Work From Office",
    wfh: "Work From Home",
    businessTrip: "Business Trip",
    
    // Approval
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    approvalStatus: "Approval Status",
    approvedBy: "Approved By",
    rejectedBy: "Rejected By",
    approvalNotes: "Approval Notes",
    
    // Messages
    checkInSuccess: "Clock in successful",
    checkOutSuccess: "Clock out successful",
    attendanceSaved: "Attendance data successfully saved",
    
    // Stats
    todayPresent: "Present Today",
    todayAbsent: "Absent Today",
    monthlyAttendance: "Monthly Attendance",
    attendanceRate: "Attendance Rate",
  },

  // ============================================
  // WORK SCHEDULE
  // ============================================
  schedule: {
    title: "Work Schedule",
    pageTitle: "Employee Work Schedule",
    subtitle: "Manage work shifts and schedules",
    manageWeeklySchedule: "Manage weekly work schedule for all employees",
    searchEmployee: "Search Employee...",
    addSchedule: "Add Schedule",
    editSchedule: "Edit Schedule",
    deleteSchedule: "Delete Schedule",
    
    // Table Headers
    employeeColumn: "Employee",
    branchColumn: "Branch",
    shiftTypeColumn: "Shift Type",
    scheduleName: "Schedule Name",
    shiftName: "Shift Name",
    startTime: "Start Time",
    endTime: "End Time",
    workDays: "Work Days",
    breakTime: "Break Time",
    effectiveDate: "Effective Date",
    
    // Days
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    
    // Shift Types
    morningShift: "Morning Shift",
    afternoonShift: "Afternoon Shift",
    nightShift: "Night Shift",
    regularShift: "Regular Shift",
    
    // Messages
    scheduleCreated: "Schedule successfully created",
    scheduleUpdated: "Schedule successfully updated",
    scheduleDeleted: "Schedule successfully deleted",
    failedToLoadSchedule: "Failed to load schedule data",
    failedToDeleteSchedule: "Failed to delete schedule",
    failedToUpdateSchedule: "Failed to update schedule",
    failedToAddSchedule: "Failed to add schedule",
    noScheduleData: "No schedule data available",
    
    // Stats
    totalSchedules: "Total Schedules",
    activeSchedules: "Active Schedules",
    assignedEmployees: "Assigned Employees",
  },

  // ============================================
  // SETTINGS
  // ============================================
  settings: {
    title: "Settings",
    subtitle: "Manage your account and app preferences",
    
    // Profile Settings
    profileSettings: "Profile Settings",
    profileSettingsDesc: "Change profile information, photo, and personal data",
    editProfile: "Edit Profile",
    changePhoto: "Change Photo",
    deletePhoto: "Delete Photo",
    uploadPhoto: "Upload Photo",
    photoSizeLimit: "Photo Size: max 1mb",
    photoFormat: "Photo Format: JPEG, PNG",
    
    // Profile Form
    personalInfo: "Personal Information",
    bankInfo: "Bank Information",
    accountName: "Account Holder Name",
    
    // Location Settings
    locationSettings: "Location Settings",
    locationSettingsDesc: "Manage office locations for attendance",
    
    // General Settings
    generalSettings: "General Settings",
    language: "Language",
    languageDesc: "Select app display language",
    theme: "Display Theme",
    themeDesc: "Choose light or dark theme",
    lightTheme: "Light",
    darkTheme: "Dark",
    systemTheme: "System Default",
    
    // Notification Settings
    notificationSettings: "Notification Settings",
    emailNotifications: "Email Notifications",
    pushNotifications: "Push Notifications",
    
    // Security
    security: "Security",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    passwordChanged: "Password successfully changed",
    
    // About
    aboutSettings: "About Settings",
    aboutSettingsDesc: "Language and theme changes will be applied immediately. To change profile information such as name, photo, and other personal data, click on the \"Profile Settings\" menu above.",
    
    // Confirmations
    saveChanges: "Save Changes",
    discardChanges: "Discard Changes",
    unsavedChanges: "You have unsaved changes",
    confirmSave: "Are you sure you want to save changes?",
    profileUpdated: "Profile successfully updated!",
    photoDeleted: "Profile photo successfully deleted!",
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================
  notifications: {
    title: "Notifications",
    markAllRead: "Mark All as Read",
    noNotifications: "No notifications yet",
    newNotification: "New Notification",
    viewDetails: "View Details",
    
    // Types
    attendance: "Attendance",
    leave: "Leave",
    schedule: "Schedule",
    announcement: "Announcement",
    system: "System",
  },

  // ============================================
  // FAQ & HELP
  // ============================================
  faq: {
    title: "FAQ & Help",
    pageTitle: "FAQ & Help Center",
    subtitle: "Find answers to frequently asked questions or contact our support team",
    searchPlaceholder: "Search questions...",
    
    // Tabs
    adminTab: "Admin",
    employeeTab: "Employee",
    
    // Categories Admin
    dashboardNav: "Dashboard & Navigation",
    employeeManagement: "Employee Management",
    checkclockAttendance: "Checkclock & Attendance",
    workSchedule: "Work Schedule",
    troubleshooting: "Troubleshooting",
    
    // Categories User
    dashboardProfile: "Dashboard & Profile",
    attendanceCheckclock: "Attendance & Checkclock",
    scheduleLeave: "Schedule & Leave",
    
    // Admin FAQs - Dashboard & Navigation
    adminQ1: "How to access the admin dashboard?",
    adminA1: "After logging in with an admin account, you will be directed to the Dashboard page. The dashboard displays employee data summary, attendance statistics, and performance graphs. Use the sidebar on the left to navigate to other menus.",
    adminQ2: "What menus are available in the sidebar?",
    adminA2: "The admin sidebar consists of: Dashboard (data summary), Employee Database (manage employee data), Checkclock (manage attendance), Work Schedule (manage work schedules), FAQ & Help (assistance), and Settings (settings including language preferences).",
    adminQ3: "How to minimize/maximize the sidebar?",
    adminA3: "Click the sidebar area to toggle between expanded and collapsed modes. In collapsed mode, only icons are displayed to maximize workspace.",
    
    // Admin FAQs - Employee Management
    adminQ4: "How to add a new employee?",
    adminA4: "Open 'Employee Database' menu from the sidebar, then click 'Add Employee' button in the top right corner. Fill in the form with complete employee data such as name, email, phone number, position, department, and upload a photo if needed. Click 'Save' to save the data.",
    adminQ5: "How to edit employee data?",
    adminA5: "On the Employee Database page, find the employee you want to edit. Click the 'Edit' button (pencil icon) on that employee's row. Change the necessary data on the edit form, then click 'Update' to save changes.",
    adminQ6: "How to delete employee data?",
    adminA6: "On the Employee Database page, find the employee you want to delete. Click the 'Delete' button (trash icon) on that employee's row. Confirm deletion in the dialog that appears. Note: Deleted data cannot be recovered.",
    adminQ7: "How to search and filter employees?",
    adminA7: "Use the search bar above the table to search by name or ID. Use filter dropdowns to filter by department, position, or employee status.",
    
    // Admin FAQs - Checkclock
    adminQ8: "How to add manual checkclock data?",
    adminA8: "Open 'Checkclock' menu from the sidebar, then click 'Add Checkclock' button. Select the employee, set the clock-in/clock-out date and time, select the location on the map, and add notes if needed. Click 'Submit' to save.",
    adminQ9: "How to view employee attendance history?",
    adminA9: "On the Checkclock page, all attendance data is displayed in a table. Use the date filter to view attendance for a specific period. Click employee name for complete details.",
    adminQ10: "What do the different attendance statuses mean?",
    adminA10: "On-Time (green): Arrived on time. Late (yellow): Late from schedule. Absent (red): Not present without notice. Leave (blue): Approved leave. Sick (purple): Sick leave.",
    adminQ11: "How to export attendance data?",
    adminA11: "On the Checkclock page, click the 'Export' button in the top right corner. Select file format (Excel/PDF) and desired date range, then click 'Download'.",
    
    // Admin FAQs - Work Schedule
    adminQ12: "How to create a work schedule?",
    adminA12: "Open 'Work Schedule' menu from the sidebar. Click 'Add Schedule' to create a new schedule. Set the shift name, working hours, and applicable days. Assign employees to the appropriate schedule.",
    adminQ13: "How to change employee shift?",
    adminA13: "On the Work Schedule page, find the employee whose shift you want to change. Click on the schedule column and select a new shift from the dropdown. Changes will be automatically saved.",
    
    // Admin FAQs - Troubleshooting
    adminQ14: "Data not showing on dashboard, what should I do?",
    adminA14: "Try refreshing the page by pressing F5 or Ctrl+R. If still problematic, clear your browser cache. Make sure your internet connection is stable. If the problem persists, contact the support team.",
    adminQ15: "Failed to upload employee photo, what's the solution?",
    adminA15: "Make sure the file format is JPG, PNG, or WEBP with a maximum size of 2MB. Try compressing the image if it's too large. Use the latest browser for the best experience.",
    adminQ16: "Session expired and have to re-login repeatedly, why?",
    adminA16: "This can happen because: 1) Browser cookies are blocked - enable cookies for this site. 2) Multiple logins from different devices. 3) Didn't check 'Remember Me' when logging in. Check that option for a longer session.",
    
    // User FAQs - Dashboard & Profile
    userQ1: "How to access my dashboard?",
    userA1: "After logging in with an employee account, you will be directed to the Employee Dashboard. Here you can view attendance summary, work schedule, and latest announcements.",
    userQ2: "How to change profile photo?",
    userA2: "Click the profile icon in the top right corner, select 'Edit Profile'. Click the photo area to upload a new image. Supported formats: JPG, PNG, WEBP with maximum 2MB.",
    userQ3: "How to change password?",
    userA3: "Click the profile icon in the top right corner, select 'Settings'. Go to the 'Security' tab, enter your old password and new password, then click 'Update Password'.",
    
    // User FAQs - Attendance
    userQ4: "How to do clock-in?",
    userA4: "On the Checkclock page, click the 'Clock In' button. The system will request location access - allow it for GPS validation. Make sure you are in the registered office area. Click 'Confirm' to save attendance.",
    userQ5: "How to do clock-out?",
    userA5: "On the Checkclock page, click the 'Clock Out' button. Same as clock-in, make sure GPS location is active and you are in a valid area. The system will record your departure time.",
    userQ6: "I forgot to clock-in/clock-out, what's the solution?",
    userA6: "Contact your HR admin to request manual attendance data addition. Prepare a clear reason and supporting evidence (if any) for the verification process.",
    userQ7: "How to view my attendance history?",
    userA7: "On the Checkclock page, scroll down to see the attendance history table. Use the date filter to view a specific period. You can also download monthly reports.",
    userQ8: "GPS not detected, what should I do?",
    userA8: "1) Make sure GPS/Location Service on your device is active. 2) Grant location permission to the browser. 3) Try in an open area if signal is weak. 4) Refresh the page and try again. 5) If still failing, contact admin.",
    
    // User FAQs - Schedule & Leave
    userQ9: "How to view my work schedule?",
    userA9: "Open 'Work Schedule' menu from the sidebar. Your work schedule for this week and this month will be displayed in calendar format. Different shifts are marked with different colors.",
    userQ10: "How to apply for leave?",
    userA10: "In the 'Leave Request' menu, click 'New Request'. Select leave type (Annual Leave, Sick Leave, etc.), set start and end dates, add a reason, then submit. Admin will review and approve/reject your request.",
    userQ11: "How to check leave request status?",
    userA11: "In the 'Leave Request' menu, you can see all leave requests along with their status: Pending (waiting), Approved (approved), or Rejected (rejected).",
    
    // User FAQs - Troubleshooting
    userQ12: "Can't login, what should I do?",
    userA12: "1) Make sure email/username and password are correct (case-sensitive). 2) Click 'Forgot Password' if you forgot your password. 3) Clear browser cache and cookies. 4) Try another browser. 5) Contact admin if account is locked.",
    userQ13: "Page keeps loading without stopping?",
    userA13: "Try: 1) Refresh page (F5). 2) Clear browser cache. 3) Check internet connection. 4) Try incognito/private mode. 5) Update browser to latest version.",
    userQ14: "My attendance data is incorrect, how?",
    userA14: "Screenshot the incorrect data as evidence, then contact HR admin via WhatsApp or email. Include date and discrepancy details for faster checking.",
    
    // Contact Support
    needMoreHelp: "Need More Help?",
    supportTeamReady: "Our support team is ready to help you",
    whatsappSupport: "WhatsApp Support",
    emailSupport: "Email Support",
    operationalHours: "Operational Hours",
    support247: "24/7 Support",
    teamAlwaysReady: "Our team is ready to serve you anytime",
    quickTips: "Quick Tips",
    quickTipsText: "Include screenshots and problem details when contacting support for faster handling.",
  },

  // ============================================
  // LANDING PAGE
  // ============================================
  landing: {
    // Navigation
    home: "Home",
    solutions: "Solutions",
    about: "About",
    contact: "Contact",
    contactSales: "Contact Sales",
    tryFree: "Try Free for 14 Days",
    
    // Hero Section
    hrisApp: "HRIS Application",
    heroTitle: "Leave Physical Archives,\nUse Online HRIS Services",
    heroSubtitle: "Manage HR operations, from employee database systems to recruitment, in one secure cloud-based comprehensive HRIS application.",
    whatsappSales: "WhatsApp Sales",
    
    // Features Section
    featuresSubtitle: "Fast & Efficient HR Management Online by CMLABS",
    featuresTitle: "Integrated Data Management with\nOnline HRIS Application",
    feature1Title: "Access Data Online",
    feature1Desc: "Data is stored on internationally certified security servers and can be accessed anytime online.",
    feature2Title: "Reduce Miscommunication",
    feature2Desc: "Manage information flow, approvals, and work within the company comprehensively.",
    feature3Title: "Automate Recruitment",
    feature3Desc: "Ensure nothing is missed in the recruitment to offboarding process by reducing physical documents.",
    
    // Pricing Section
    pricingTitle: "HRIS Pricing Plans",
    pricingSubtitle: "Choose the plan that best suits your business! This HRIS offers both subscription and pay-as-you-go payment options, available in the following packages:",
    package: "Package",
    seat: "Seat",
    selectPackage: "Select Package",
    mostPopular: "Most Popular",
    
    // About Section
    aboutTitle: "What is HRIS software?",
    aboutP1: "HRIS (Human Resource Information System) application is an integrated platform used to manage all information and activities related to human resources within the company.",
    aboutP2: "Basically, HRIS functions as a technology-based employee data center, usually running in a cloud computing environment. With this approach, the system can be accessed anytime and through various devices.",
    aboutP3: "Through CMLABS HRIS, this concept is implemented to provide modern, responsive HR management solutions that suit the company's operational needs.",
    
    // About FAQ
    aboutFaq1Q: "Is the HRIS application online?",
    aboutFaq1A: "Yes, you can manage all company HR operations online. The application uses a cloud-based system that can be accessed via desktop or mobile.",
    aboutFaq2Q: "What are the features of online HRIS software?",
    aboutFaq2A: "Online HRIS features include employee data management, attendance, payroll, leave, recruitment, and comprehensive HR reporting.",
    aboutFaq3Q: "Is online HRIS software free?",
    aboutFaq3A: "We provide a free Basic package for small businesses. For more complete features, paid packages are available at competitive prices.",
    aboutFaq4Q: "What if I want to subscribe?",
    aboutFaq4A: "You can contact our sales team via WhatsApp or fill out the registration form to start subscribing.",
    aboutFaq5Q: "Why can companies trust the HRIS system?",
    aboutFaq5A: "Our system uses enterprise-level encryption and internationally certified security servers to protect your company data.",
    aboutFaq6Q: "What are the best HRIS applications for companies?",
    aboutFaq6A: "HRIS Online is one of the best solutions with complete features, affordable prices, and responsive technical support.",
    
    // CTA Section
    ctaTitle: "One solution for all your HR needs",
    ctaSubtitle: "Optimize your HR operations management with the help of integrated solutions.",
    tryFreeShort: "Try Free",
    
    // Footer
    features: "Features",
    businessSolutions: "Business Solutions",
    insight: "Insight",
    company: "Company",
  },

  // ============================================
  // VALIDATION / ERRORS
  // ============================================
  validation: {
    required: "This field is required",
    invalidEmail: "Invalid email format",
    minLength: "Minimum {min} characters",
    maxLength: "Maximum {max} characters",
    invalidPhone: "Invalid phone number format",
    invalidDate: "Invalid date format",
    passwordMismatch: "Passwords do not match",
    fileTooBig: "File size is too large",
    invalidFileType: "File type not supported",
  },

  // ============================================
  // TIME / DATE
  // ============================================
  time: {
    today: "Today",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    thisWeek: "This Week",
    lastWeek: "Last Week",
    thisMonth: "This Month",
    lastMonth: "Last Month",
    thisYear: "This Year",
    allTime: "All Time",
    timeRange: "Time Range",
    
    // Period
    day: "day",
    week: "week",
    month: "month",
    year: "year",
    days: "days",
    
    // Months
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",
  },
};
