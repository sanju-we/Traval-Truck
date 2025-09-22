export var MESSAGES;
(function (MESSAGES) {
    // -------------------- GENERAL --------------------
    MESSAGES["ACCOUNT_BLOCKED"] = "Account is blocked";
    MESSAGES["ALL_FIELDS_REQUIRED"] = "All fields are required";
    MESSAGES["ID_REQUIRED"] = "Id is required";
    MESSAGES["ALREADY_EXISTS"] = "Resource already exists";
    MESSAGES["BAD_REQUEST"] = "Bad request";
    MESSAGES["CREATED"] = "Created successfully";
    MESSAGES["DELETED"] = "Deleted successfully";
    MESSAGES["FAILED"] = "Operation failed";
    MESSAGES["FORBIDDEN"] = "Forbidden access";
    MESSAGES["INVALID_ID"] = "Invalid ID provided";
    MESSAGES["INVALID_PROFILE_DATA"] = "Invalid profile data";
    MESSAGES["NO_DATA"] = "No data available";
    MESSAGES["NO_RESULTS_FOUND"] = "No results found";
    MESSAGES["NOT_FOUND"] = "Resource not found";
    MESSAGES["OTP_NOT_VALID"] = "OTP not valid";
    MESSAGES["PAGE_OUT_OF_RANGE"] = "Page number out of range";
    MESSAGES["SERVER_ERROR"] = "Internal server error";
    MESSAGES["SUCCESS"] = "Operation completed successfully";
    MESSAGES["TEMP_USER_DATA_MISSING"] = "Temporary user data missing";
    MESSAGES["UNAUTHORIZED"] = "Unauthorized access";
    MESSAGES["UPDATED"] = "Updated successfully";
    MESSAGES["USER_BLOCKED"] = "User is blocked";
    MESSAGES["VERIFY_EMAIL"] = "Please verify your email";
    // -------------------- STATUS ACTIONS --------------------
    MESSAGES["ACTIVATED"] = "Activated successfully";
    MESSAGES["APPROVED"] = "Approved successfully";
    MESSAGES["DEACTIVATED"] = "Deactivated successfully";
    MESSAGES["DISABLED"] = "Disabled successfully";
    MESSAGES["ENABLED"] = "Enabled successfully";
    MESSAGES["REJECTED"] = "Rejected successfully";
    MESSAGES["UNVERIFIED"] = "Marked as unverified";
    MESSAGES["VERIFIED"] = "Verified successfully";
    // -------------------- AUTH --------------------
    MESSAGES["EMAIL_OTP_REQUIRED"] = "Email and OTP are required";
    MESSAGES["EMAIL_PASSWORD_REQUIRED"] = "Email and password are required";
    MESSAGES["EMAIL_PURPOSE_REQUIRED"] = "Email and purpose are required";
    MESSAGES["EMAIL_REQUIRED"] = "Email is required";
    MESSAGES["GOOGLE_AUTH_REQUIRED"] = "Google authentication details are required";
    MESSAGES["INVALID_GOOGLE_DATA"] = "Invalid authentication data";
    MESSAGES["GOOGLE_AUTH_SUCCESS"] = "Google authentication successfully";
    MESSAGES["INVALID_CREDENTIALS"] = "Invalid credentials";
    MESSAGES["LOGIN_SUCCESS"] = "Login successful";
    MESSAGES["LOGOUT_SUCCESS"] = "Logout successful";
    MESSAGES["PASSWORD_CHANGED"] = "Password changed successfully";
    MESSAGES["PASSWORD_INCORRECT"] = "Incorrect password";
    MESSAGES["PASSWORD_RESET_FAILED"] = "Password reset failed";
    MESSAGES["PASSWORD_RESET_SUCCESS"] = "Password reset successful";
    MESSAGES["REGISTER_SUCCESS"] = "Registration successful";
    MESSAGES["TOKEN_EXPIRED"] = "Authentication token has expired";
    MESSAGES["TOKEN_INVALID"] = "Authentication token is invalid";
    MESSAGES["TOKEN_MISSING"] = "Authentication token is missing";
    // -------------------- OTP --------------------
    MESSAGES["NO_OTP_FOUND"] = "No OTP found";
    MESSAGES["OTP_EXPIRED"] = "OTP has expired";
    MESSAGES["OTP_INVALID"] = "Invalid OTP";
    MESSAGES["OTP_PURPOSE_MISMATCH"] = "OTP purpose mismatch";
    MESSAGES["OTP_RESENT"] = "OTP resent successfully";
    MESSAGES["OTP_SENT"] = "OTP sent successfully";
    MESSAGES["OTP_VERIFIED"] = "OTP verified successfully";
    // -------------------- STUDENT --------------------
    MESSAGES["STUDENT_ALREADY_EXISTS"] = "Student already exists";
    MESSAGES["STUDENT_BLOCKED"] = "Student blocked successfully";
    MESSAGES["STUDENT_CREATED"] = "Student created successfully";
    MESSAGES["STUDENT_DELETED"] = "Student deleted successfully";
    MESSAGES["STUDENT_DETAILS_FETCHED"] = "Student details fetched successfully";
    MESSAGES["STUDENT_NOT_FOUND"] = "Student not found";
    MESSAGES["STUDENT_UNBLOCKED"] = "Student unblocked successfully";
    MESSAGES["STUDENT_UPDATED"] = "Student updated successfully";
    MESSAGES["STUDENTS_FETCHED"] = "Students fetched successfully";
    // -------------------- COMPANY --------------------
    MESSAGES["COMPANIES_FETCHED"] = "Companies fetched successfully";
    MESSAGES["COMPANY_ALREADY_EXISTS"] = "Company already exists";
    MESSAGES["COMPANY_BLOCKED"] = "Company blocked successfully";
    MESSAGES["COMPANY_CREATED"] = "Company created successfully";
    MESSAGES["COMPANY_DELETED"] = "Company deleted successfully";
    MESSAGES["COMPANY_DETAILS_FETCHED"] = "Company details fetched successfully";
    MESSAGES["COMPANY_NOT_FOUND"] = "Company not found";
    MESSAGES["COMPANY_UNBLOCKED"] = "Company unblocked successfully";
    MESSAGES["COMPANY_UPDATED"] = "Company updated successfully";
    MESSAGES["UNVERIFIED_COMPANIES_FETCHED"] = "Unverified company fetched successfully";
    // -------------------- TEACHER --------------------
    MESSAGES["TEACHER_ALREADY_EXISTS"] = "Teacher already exists";
    MESSAGES["TEACHER_BLOCKED"] = "Teacher blocked successfully";
    MESSAGES["TEACHER_CREATED"] = "Teacher created successfully";
    MESSAGES["TEACHER_DELETED"] = "Teacher deleted successfully";
    MESSAGES["TEACHER_VERIFIED"] = "Teacher verified successfully";
    MESSAGES["TEACHER_NOT_VERIFIED"] = "Teacher unverified successfully";
    MESSAGES["TEACHER_DETAILS_FETCHED"] = "Teacher details fetched successfully";
    MESSAGES["TEACHER_COURSES_FETCHED"] = "Teacher courses fetched successfully";
    MESSAGES["TEACHER_NOT_FOUND"] = "Teacher not found";
    MESSAGES["TEACHER_UNBLOCKED"] = "Teacher unblocked successfully";
    MESSAGES["TEACHER_UPDATED"] = "Teacher updated successfully";
    MESSAGES["TEACHERS_FETCHED"] = "Teachers fetched successfully";
    MESSAGES["UNVERIFIED_TEACHERS_FETCHED"] = "Unverified teachers fetched successfully";
    // -------------------- EMPLOYEE --------------------
    MESSAGES["EMPLOYEE_ALREADY_EXISTS"] = "Employee already exists";
    MESSAGES["EMPLOYEE_BLOCKED"] = "Employee blocked successfully";
    MESSAGES["EMPLOYEE_CREATED"] = "Employee created successfully";
    MESSAGES["EMPLOYEE_DELETED"] = "Employee deleted successfully";
    MESSAGES["EMPLOYEE_DETAILS_FETCHED"] = "Employee details fetched successfully";
    MESSAGES["EMPLOYEE_NOT_FOUND"] = "Employee not found";
    MESSAGES["EMPLOYEE_UNBLOCKED"] = "Employee unblocked successfully";
    MESSAGES["EMPLOYEE_UPDATED"] = "Employee updated successfully";
    MESSAGES["EMPLOYEES_FETCHED"] = "Employees fetched successfully";
    // -------------------- COURSE --------------------
    MESSAGES["COURSE_ALREADY_EXISTS"] = "Course already exists";
    MESSAGES["COURSE_ASSIGNED"] = "Course assigned successfully";
    MESSAGES["COURSE_CREATED"] = "Course created successfully";
    MESSAGES["COURSE_CREATED_FAILED"] = "Course created failed";
    MESSAGES["COURSE_DELETED"] = "Course deleted successfully";
    MESSAGES["COURSE_DETAILS_FETCHED"] = "Course details fetched successfully";
    MESSAGES["COURSE_NOT_FOUND"] = "Course not found";
    MESSAGES["COURSE_UNASSIGNED"] = "Course unassigned successfully";
    MESSAGES["COURSE_UPDATED"] = "Course updated successfully";
    MESSAGES["COURSES_FETCHED"] = "Courses fetched successfully";
    // -------------------- SUBSCRIPTION PLAN --------------------
    MESSAGES["SUBSCRIPTION_PLANS_FETCHED"] = "Subscription plans fetched successfully";
    MESSAGES["SUBSCRIPTION_PLAN_CREATED"] = "Subscription plan created successfully";
    MESSAGES["SUBSCRIPTION_PLAN_FETCHED"] = "Subscription plan fetched successfully";
    MESSAGES["SUBSCRIPTION_PLAN_UPDATED"] = "Subscription plan updated successfully";
    MESSAGES["SUBSCRIPTION_PLAN_DELETED"] = "Subscription plan deleted successfully";
    MESSAGES["SUBSCRIPTION_PLAN_NOT_FOUND"] = "Subscription plan not found";
    // -------------------- RELATIONSHIP ACTIONS --------------------
    MESSAGES["ADDED_TO_GROUP"] = "Added to group successfully";
    MESSAGES["LINKED_SUCCESSFULLY"] = "Linked successfully";
    MESSAGES["REMOVED_FROM_GROUP"] = "Removed from group successfully";
    MESSAGES["UNLINKED_SUCCESSFULLY"] = "Unlinked successfully";
    // -------------------- IMPORT/EXPORT --------------------
    MESSAGES["EXPORT_FAILED"] = "Data export failed";
    MESSAGES["EXPORT_SUCCESS"] = "Data exported successfully";
    MESSAGES["IMPORT_FAILED"] = "Data import failed";
    MESSAGES["IMPORT_SUCCESS"] = "Data imported successfully";
    // -------------------- SETTINGS --------------------
    MESSAGES["PROFILE_PICTURE_UPDATED"] = "Profile picture updated successfully";
    MESSAGES["PROFILE_UPDATED"] = "Profile updated successfully";
    MESSAGES["SETTINGS_UPDATED"] = "Settings updated successfully";
    // -------------------- NOTIFICATIONS --------------------
    MESSAGES["NOTIFICATION_FAILED"] = "Notification sending failed";
    MESSAGES["NOTIFICATION_SENT"] = "Notification sent successfully";
    // -------------------- VALIDATION --------------------
    MESSAGES["INVALID_DATA"] = "Invalid data provided";
    MESSAGES["INVALID_EMAIL"] = "Invalid email format";
    MESSAGES["INVALID_PASSWORD"] = "Invalid password format";
    MESSAGES["REQUIRED_FIELDS_MISSING"] = "Required fields are missing";
    MESSAGES["VALIDATION_ERROR"] = "Validation failed";
    // -------------------- FILE UPLOAD --------------------
    MESSAGES["FILE_INVALID_TYPE"] = "Invalid file type";
    MESSAGES["FILE_TOO_LARGE"] = "File size too large";
    MESSAGES["FILE_UPLOADED"] = "File uploaded successfully";
    MESSAGES["FILE_UPLOAD_FAILED"] = "File upload failed";
    // -------------------- SYSTEM --------------------
    MESSAGES["DATABASE_ERROR"] = "Database operation failed";
    MESSAGES["RATE_LIMIT_EXCEEDED"] = "Too many requests, please try again later";
    MESSAGES["SERVICE_UNAVAILABLE"] = "Service temporarily unavailable";
    MESSAGES["TITLE_DESCRIPTION_CATEGORY_REQUIRED"] = "Title & description  & and category are required";
    MESSAGES["AT_LEAST_ONE_MODULE_REQUIRED"] = "At least one module is required";
})(MESSAGES || (MESSAGES = {}));
