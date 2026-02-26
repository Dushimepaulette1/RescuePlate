export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "Email is required";
  }
  if (!email.includes("@")) {
    return "Please enter a valid email address with @";
  }
  const emailParts = email.split("@");
  if (emailParts[1] === "" || !emailParts[1]) {
    return "Please enter the domain after @";
  }
  if (!emailParts[1].includes(".")) {
    return "Please enter a valid email domain (e.g., gmail.com)";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
};
