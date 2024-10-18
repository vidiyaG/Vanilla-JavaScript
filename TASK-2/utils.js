export const spinnerId = "spinner-icon";
export const messageElementId = "message";
export const SEARCH_DEBOUNCE_TIME = 300;
export const SCROLL_DEBOUNCE_TIME = 100;
export const API_URL = "http://localhost:3000";
export const messages = {
    ALL_RECORDS_LOADED: "No more results",
    DB_CONNECTED: "Connected to Database successfully",
};

export const showElement = (elementId, text = "") => {
    if (!elementId) return;
    const el = document.getElementById(elementId);
    el.style.display = "flex";
    if (text) {
        el.innerHTML = text;
    }
};
export const hideElement = (elementId) => {
    if (!elementId) return;
    const el = document.getElementById(elementId);
    el.style.display = "none";
};
