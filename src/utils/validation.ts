import validator from 'validator';

export const urlValidationMethod = (value: string) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

export const isValidUrl = (url: string) => {
  const urlRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9-]*\.[a-zA-Z0-9]*\b([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)#?/;
  return urlRegex.test(url);
};
