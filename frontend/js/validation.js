const emailDomainTypos = {
  "gmal.co": "gmail.com", "gmal.com": "gmail.com", "gmial.com": "gmail.com",
  "gmai.com": "gmail.com", "gmail.co": "gmail.com", "gmail.con": "gmail.com",
  "yaho.com": "yahoo.com", "yahoo.co": "yahoo.com", "yahho.com": "yahoo.com",
  "outlok.com": "outlook.com", "outloo.com": "outlook.com",
  "hotmal.com": "hotmail.com"
};

function emailDomainError(email) {
  const domain = email.toLowerCase().split("@")[1];
  const suggestedDomain = emailDomainTypos[domain];
  return suggestedDomain ? `Check your email domain. Did you mean @${suggestedDomain}?` : "";
}

function validateApplication(formData) {
  const errors = {};
  const name = (formData.get("fullName") || "").trim();
  const email = (formData.get("email") || "").trim();
  const phone = (formData.get("phone") || "").trim();
  const resume = (formData.get("resumeUrl") || "").trim();
  const letter = (formData.get("coverLetter") || "").trim();
  if (name.length < 2 || name.length > 80) errors.fullName = "Enter a name between 2 and 80 characters.";
  if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(email) || email.length > 254) {
    errors.email = "Enter a valid email address.";
  } else {
    const domainError = emailDomainError(email);
    if (domainError) errors.email = domainError;
  }
  if (phone.length > 25) errors.phone = "Phone number is too long.";
  if (resume) {
    try { const url = new URL(resume); if (!["http:", "https:"].includes(url.protocol)) errors.resumeUrl = "Use an http or https link."; }
    catch { errors.resumeUrl = "Enter a valid URL."; }
  }
  if (letter.length > 2000) errors.coverLetter = "Keep your cover letter under 2,000 characters.";
  return errors;
}
