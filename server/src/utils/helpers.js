export const generateRandomUsername = () => {
  const adjectives = [
    "Happy",
    "Lucky",
    "Smart",
    "Cool",
    "Fast",
    "Brave",
    "Kind",
    "Wise",
    "Strong",
    "Quick",
  ];
  const nouns = [
    "Cat",
    "Dog",
    "Lion",
    "Eagle",
    "Tiger",
    "Bear",
    "Wolf",
    "Fox",
    "Owl",
    "Shark",
  ];
  const randomNum = Math.floor(Math.random() * 1000);

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adjective}${noun}${randomNum}`;
};

export const generateUserId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const isExpired = (timestamp, expirationTime) => {
  return Date.now() > timestamp + expirationTime;
};

export const sanitizeMessage = (content) => {
  return content.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
};

export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toISOString();
};
