export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toISOString();
};

export const isValidUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const sanitizeString = (str, maxLength = 1000) => {
  if (typeof str !== 'string') return '';
  return str.trim().substring(0, maxLength);
};

export const createResponse = (success, data, error = null) => {
  const response = { success };
  
  if (success) {
    Object.assign(response, data);
  } else {
    response.error = error;
  }
  
  return response;
};
