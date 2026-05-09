export const getLocalStorage = (key) => {
  const item = localStorage.getItem(key);
  if (item) {
    try {
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error parsing localStorage item for key: ${key}`, error);
      return null;
    }
  }
  return null;
};

export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const getSessionStorage = (key) => {
  const item = sessionStorage.getItem(key);
  if (item) {
    try {
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error parsing sessionStorage item for key: ${key}`, error);
      return null;
    }
  }
  return null;
};

export const setSessionStorage = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const removeSessionStorage = (key) => {
  sessionStorage.removeItem(key);
};
