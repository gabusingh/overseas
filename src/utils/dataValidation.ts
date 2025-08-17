export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validatePhoneNumber = (phone: string): boolean => {
  // Indian phone number validation (10 digits)
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateEmail = (email: string): boolean => {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePinCode = (pin: string): boolean => {
  // Indian PIN code validation (6 digits)
  const pinRegex = /^[1-9][0-9]{5}$/;
  return pinRegex.test(pin);
};

export const validateDate = (dateStr: string): boolean => {
  if (!dateStr) return false;
  
  const date = new Date(dateStr);
  const now = new Date();
  
  // Check if date is valid
  if (isNaN(date.getTime())) return false;
  
  // Check if date is not in the future
  if (date > now) return false;
  
  // Check minimum age (18 years)
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(now.getFullYear() - 18);
  
  return date <= eighteenYearsAgo;
};

export const validateProfileData = (data: Record<string, any>): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Personal Details Validation
  if (!data.empName?.trim()) {
    errors.empName = 'Full name is required';
  } else if (data.empName.trim().length < 2) {
    errors.empName = 'Full name must be at least 2 characters';
  }
  
  if (!data.empDob) {
    errors.empDob = 'Date of birth is required';
  } else if (!validateDate(data.empDob)) {
    errors.empDob = 'Please enter a valid date of birth (must be 18+ years old)';
  }
  
  if (!data.empGender) {
    errors.empGender = 'Gender is required';
  }
  
  if (!data.empWhatsapp?.trim()) {
    errors.empWhatsapp = 'WhatsApp number is required';
  } else if (!validatePhoneNumber(data.empWhatsapp)) {
    errors.empWhatsapp = 'Please enter a valid 10-digit mobile number';
  }
  
  if (!data.empMS) {
    errors.empMS = 'Marital status is required';
  }
  
  if (data.empEmail && !validateEmail(data.empEmail)) {
    errors.empEmail = 'Please enter a valid email address';
  }
  
  // Education & Career Validation
  if (!data.empEdu) {
    errors.empEdu = 'Education level is required';
  }
  
  if (!data.empTechEdu) {
    errors.empTechEdu = 'Technical education information is required';
  }
  
  if (!data.empPassportQ) {
    errors.empPassportQ = 'Passport availability information is required';
  }
  
  if (!data.empSkill) {
    errors.empSkill = 'Preferred department is required';
  }
  
  if (!data.empOccuId) {
    errors.empOccuId = 'Preferred occupation is required';
  }
  
  if (!data.empInternationMigrationExp) {
    errors.empInternationMigrationExp = 'International migration experience is required';
  }
  
  if (!data.empDailyWage?.trim()) {
    errors.empDailyWage = 'Present monthly income is required';
  } else if (isNaN(Number(data.empDailyWage)) || Number(data.empDailyWage) < 0) {
    errors.empDailyWage = 'Please enter a valid income amount';
  }
  
  if (!data.empExpectedMonthlyIncome?.trim()) {
    errors.empExpectedMonthlyIncome = 'Expected monthly income is required';
  } else if (isNaN(Number(data.empExpectedMonthlyIncome)) || Number(data.empExpectedMonthlyIncome) < 0) {
    errors.empExpectedMonthlyIncome = 'Please enter a valid expected income amount';
  }
  
  if (!data.empRelocationIntQ) {
    errors.empRelocationIntQ = 'Job location preference is required';
  }
  
  // Address & References Validation
  if (!data.empState) {
    errors.empState = 'State is required';
  }
  
  if (!data.empDistrict) {
    errors.empDistrict = 'District is required';
  }
  
  if (!data.empPin?.trim()) {
    errors.empPin = 'PIN code is required';
  } else if (!validatePinCode(data.empPin)) {
    errors.empPin = 'Please enter a valid 6-digit PIN code';
  }
  
  if (!data.empRefName?.trim()) {
    errors.empRefName = 'Reference name is required';
  } else if (data.empRefName.trim().length < 2) {
    errors.empRefName = 'Reference name must be at least 2 characters';
  }
  
  if (!data.empRefPhone?.trim()) {
    errors.empRefPhone = 'Reference phone is required';
  } else if (!validatePhoneNumber(data.empRefPhone)) {
    errors.empRefPhone = 'Please enter a valid 10-digit mobile number for reference';
  }
  
  if (!data.empRefDistance) {
    errors.empRefDistance = 'Distance from reference is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const formatProfileData = (data: Record<string, any>): Record<string, any> => {
  const formatted = { ...data };
  
  // Trim string fields
  const stringFields = [
    'empName', 'empWhatsapp', 'empEmail', 'empDailyWage', 
    'empExpectedMonthlyIncome', 'empPin', 'empRefName', 
    'empRefPhone', 'empPSName', 'empPanchayat', 'empVillage'
  ];
  
  stringFields.forEach(field => {
    if (typeof formatted[field] === 'string') {
      formatted[field] = formatted[field].trim();
    }
  });
  
  // Format phone numbers (remove spaces and special characters)
  if (formatted.empWhatsapp) {
    formatted.empWhatsapp = formatted.empWhatsapp.replace(/\D/g, '');
  }
  
  if (formatted.empRefPhone) {
    formatted.empRefPhone = formatted.empRefPhone.replace(/\D/g, '');
  }
  
  // Ensure numeric fields are properly formatted
  if (formatted.empDailyWage) {
    formatted.empDailyWage = Math.abs(Number(formatted.empDailyWage)).toString();
  }
  
  if (formatted.empExpectedMonthlyIncome) {
    formatted.empExpectedMonthlyIncome = Math.abs(Number(formatted.empExpectedMonthlyIncome)).toString();
  }
  
  // Format email to lowercase
  if (formatted.empEmail) {
    formatted.empEmail = formatted.empEmail.toLowerCase();
  }
  
  // Ensure PIN code is string
  if (formatted.empPin) {
    formatted.empPin = formatted.empPin.toString();
  }
  
  return formatted;
};

export const sanitizeFormData = (formData: FormData): FormData => {
  const sanitized = new FormData();
  
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      sanitized.append(key, value);
    } else {
      const stringValue = value.toString().trim();
      if (stringValue !== '') {
        sanitized.append(key, stringValue);
      }
    }
  }
  
  return sanitized;
};
