export const generateRandomUsername = (): string => {
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

export const generateUserId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const isMessageExpired = (message: {
  expiresAt?: number | null;
}): boolean => {
  return message.expiresAt ? Date.now() > message.expiresAt : false;
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const sanitizeMessage = (content: string): string => {
  return content.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
};

export const getExpirationTime = (minutes: number): number => {
  return Date.now() + minutes * 60 * 1000;
};

export const getAvatarUrl = (userId: string): string => {
  // Using a simple avatar service
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
};
