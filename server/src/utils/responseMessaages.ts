export enum MESSAGES {
  // -------------------- GENERAL --------------------
  ACCOUNT_BLOCKED = 'Account is blocked',
  ALL_FIELDS_REQUIRED = 'All fields are required',
  ID_REQUIRED = 'Id is required',
  ALREADY_EXISTS = 'Resource already exists',
  BAD_REQUEST = 'Bad request',
  CREATED = 'Created successfully',
  DELETED = 'Deleted successfully',
  FAILED = 'Operation failed',
  FORBIDDEN = 'Forbidden access',
  INVALID_ID = 'Invalid ID provided',
  INVALID_PROFILE_DATA = 'Invalid profile data',
  NO_DATA = 'No data available',
  NO_RESULTS_FOUND = 'No results found',
  NOT_FOUND = 'Resource not found',
  OTP_NOT_VALID = 'OTP not valid',
  PAGE_OUT_OF_RANGE = 'Page number out of range',
  SERVER_ERROR = 'Internal server error',
  SUCCESS = 'Operation completed successfully',
  TEMP_USER_DATA_MISSING = 'Temporary user data missing',
  UNAUTHORIZED = 'Unauthorized access',
  UPDATED = 'Updated successfully',
  USER_BLOCKED = 'User is blocked',
  VERIFY_EMAIL = 'Please verify your email',

  // -------------------- STATUS ACTIONS --------------------
  ACTIVATED = 'Activated successfully',
  APPROVED = 'Approved successfully',
  DEACTIVATED = 'Deactivated successfully',
  DISABLED = 'Disabled successfully',
  ENABLED = 'Enabled successfully',
  REJECTED = 'Rejected successfully',
  UNVERIFIED = 'Marked as unverified',
  VERIFIED = 'Verified successfully',

  // -------------------- AUTH --------------------
  EMAIL_OTP_REQUIRED = 'Email and OTP are required',
  EMAIL_PASSWORD_REQUIRED = 'Email and password are required',
  EMAIL_PURPOSE_REQUIRED = 'Email and purpose are required',
  EMAIL_REQUIRED = 'Email is required',
  GOOGLE_AUTH_REQUIRED = 'Google authentication details are required',
  INVALID_GOOGLE_DATA = 'Invalid authentication data',
  GOOGLE_AUTH_SUCCESS = 'Google authentication successfully',
  INVALID_CREDENTIALS = 'Invalid credentials',
  LOGIN_SUCCESS = 'Login successful',
  LOGOUT_SUCCESS = 'Logout successful',
  PASSWORD_CHANGED = 'Password changed successfully',
  PASSWORD_INCORRECT = 'Incorrect password',
  PASSWORD_RESET_FAILED = 'Password reset failed',
  PASSWORD_RESET_SUCCESS = 'Password reset successful',
  REGISTER_SUCCESS = 'Registration successful',
  TOKEN_EXPIRED = 'Authentication token has expired',
  TOKEN_INVALID = 'Authentication token is invalid',
  TOKEN_MISSING = 'Authentication token is missing',

  // -------------------- OTP --------------------
  NO_OTP_FOUND = 'No OTP found',
  OTP_EXPIRED = 'OTP has expired',
  OTP_INVALID = 'Invalid OTP',
  OTP_PURPOSE_MISMATCH = 'OTP purpose mismatch',
  OTP_RESENT = 'OTP resent successfully',
  OTP_SENT = 'OTP sent successfully',
  OTP_VERIFIED = 'OTP verified successfully',

  // -------------------- STUDENT --------------------
  STUDENT_ALREADY_EXISTS = 'Student already exists',
  STUDENT_BLOCKED = 'Student blocked successfully',
  STUDENT_CREATED = 'Student created successfully',
  STUDENT_DELETED = 'Student deleted successfully',
  STUDENT_DETAILS_FETCHED = 'Student details fetched successfully',
  STUDENT_NOT_FOUND = 'Student not found',
  STUDENT_UNBLOCKED = 'Student unblocked successfully',
  STUDENT_UPDATED = 'Student updated successfully',
  STUDENTS_FETCHED = 'Students fetched successfully',

  // -------------------- COMPANY --------------------
  COMPANIES_FETCHED = 'Companies fetched successfully',
  COMPANY_ALREADY_EXISTS = 'Company already exists',
  COMPANY_BLOCKED = 'Company blocked successfully',
  COMPANY_CREATED = 'Company created successfully',
  COMPANY_DELETED = 'Company deleted successfully',
  COMPANY_DETAILS_FETCHED = 'Company details fetched successfully',
  COMPANY_NOT_FOUND = 'Company not found',
  COMPANY_UNBLOCKED = 'Company unblocked successfully',
  COMPANY_UPDATED = 'Company updated successfully',
  UNVERIFIED_COMPANIES_FETCHED = 'Unverified company fetched successfully',

  // -------------------- TEACHER --------------------
  TEACHER_ALREADY_EXISTS = 'Teacher already exists',
  TEACHER_BLOCKED = 'Teacher blocked successfully',
  TEACHER_CREATED = 'Teacher created successfully',
  TEACHER_DELETED = 'Teacher deleted successfully',
  TEACHER_VERIFIED = 'Teacher verified successfully',
  TEACHER_NOT_VERIFIED = 'Teacher unverified successfully',
  TEACHER_DETAILS_FETCHED = 'Teacher details fetched successfully',
  TEACHER_COURSES_FETCHED = 'Teacher courses fetched successfully',
  TEACHER_NOT_FOUND = 'Teacher not found',
  TEACHER_UNBLOCKED = 'Teacher unblocked successfully',
  TEACHER_UPDATED = 'Teacher updated successfully',
  TEACHERS_FETCHED = 'Teachers fetched successfully',
  UNVERIFIED_TEACHERS_FETCHED = 'Unverified teachers fetched successfully',

  // -------------------- EMPLOYEE --------------------
  EMPLOYEE_ALREADY_EXISTS = 'Employee already exists',
  EMPLOYEE_BLOCKED = 'Employee blocked successfully',
  EMPLOYEE_CREATED = 'Employee created successfully',
  EMPLOYEE_DELETED = 'Employee deleted successfully',
  EMPLOYEE_DETAILS_FETCHED = 'Employee details fetched successfully',
  EMPLOYEE_NOT_FOUND = 'Employee not found',
  EMPLOYEE_UNBLOCKED = 'Employee unblocked successfully',
  EMPLOYEE_UPDATED = 'Employee updated successfully',
  EMPLOYEES_FETCHED = 'Employees fetched successfully',

  // -------------------- COURSE --------------------
  COURSE_ALREADY_EXISTS = 'Course already exists',
  COURSE_ASSIGNED = 'Course assigned successfully',
  COURSE_CREATED = 'Course created successfully',
  COURSE_CREATED_FAILED = 'Course created failed',
  COURSE_DELETED = 'Course deleted successfully',
  COURSE_DETAILS_FETCHED = 'Course details fetched successfully',
  COURSE_NOT_FOUND = 'Course not found',
  COURSE_UNASSIGNED = 'Course unassigned successfully',
  COURSE_UPDATED = 'Course updated successfully',
  COURSES_FETCHED = 'Courses fetched successfully',

  // -------------------- SUBSCRIPTION PLAN --------------------
  SUBSCRIPTION_PLANS_FETCHED = 'Subscription plans fetched successfully',
  SUBSCRIPTION_PLAN_CREATED = 'Subscription plan created successfully',
  SUBSCRIPTION_PLAN_FETCHED = 'Subscription plan fetched successfully',
  SUBSCRIPTION_PLAN_UPDATED = 'Subscription plan updated successfully',
  SUBSCRIPTION_PLAN_DELETED = 'Subscription plan deleted successfully',
  SUBSCRIPTION_PLAN_NOT_FOUND = 'Subscription plan not found',


  // -------------------- RELATIONSHIP ACTIONS --------------------
  ADDED_TO_GROUP = 'Added to group successfully',
  LINKED_SUCCESSFULLY = 'Linked successfully',
  REMOVED_FROM_GROUP = 'Removed from group successfully',
  UNLINKED_SUCCESSFULLY = 'Unlinked successfully',

  // -------------------- IMPORT/EXPORT --------------------
  EXPORT_FAILED = 'Data export failed',
  EXPORT_SUCCESS = 'Data exported successfully',
  IMPORT_FAILED = 'Data import failed',
  IMPORT_SUCCESS = 'Data imported successfully',

  // -------------------- SETTINGS --------------------
  PROFILE_PICTURE_UPDATED = 'Profile picture updated successfully',
  PROFILE_UPDATED = 'Profile updated successfully',
  SETTINGS_UPDATED = 'Settings updated successfully',

  // -------------------- NOTIFICATIONS --------------------
  NOTIFICATION_FAILED = 'Notification sending failed',
  NOTIFICATION_SENT = 'Notification sent successfully',

  // -------------------- VALIDATION --------------------
  INVALID_DATA = 'Invalid data provided',
  INVALID_EMAIL = 'Invalid email format',
  INVALID_PASSWORD = 'Invalid password format',
  REQUIRED_FIELDS_MISSING = 'Required fields are missing',
  VALIDATION_ERROR = 'Validation failed',

  // -------------------- FILE UPLOAD --------------------
  FILE_INVALID_TYPE = 'Invalid file type',
  FILE_TOO_LARGE = 'File size too large',
  FILE_UPLOADED = 'File uploaded successfully',
  FILE_UPLOAD_FAILED = 'File upload failed',

  // -------------------- SYSTEM --------------------
  DATABASE_ERROR = 'Database operation failed',
  RATE_LIMIT_EXCEEDED = 'Too many requests, please try again later',
  SERVICE_UNAVAILABLE = 'Service temporarily unavailable'


  , TITLE_DESCRIPTION_CATEGORY_REQUIRED= 'Title & description  & and category are required',
   AT_LEAST_ONE_MODULE_REQUIRED= 'At least one module is required',
}