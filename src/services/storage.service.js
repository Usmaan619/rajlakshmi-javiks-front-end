export const setItem = (key, value) => sessionStorage.setItem(key, value);

export const removeItem = (key) => sessionStorage.removeItem(key);

export const getItem = (key) => sessionStorage.getItem(key);

export const clearCache = () => sessionStorage.clear();
