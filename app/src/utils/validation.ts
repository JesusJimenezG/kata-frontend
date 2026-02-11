const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(email)) return "Invalid email format";
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return undefined;
}

export function validateRequired(
  value: string,
  fieldName: string,
): string | undefined {
  if (!value.trim()) return `${fieldName} is required`;
  return undefined;
}

export function validateDateRange(
  start: string,
  end: string,
): string | undefined {
  if (!start) return "Start time is required";
  if (!end) return "End time is required";
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (startDate >= endDate) return "Start time must be before end time";
  return undefined;
}
