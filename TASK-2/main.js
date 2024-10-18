import { LocalDatabase, initializeDatabase } from "../TASK-3/database.js";
import {
    showElement,
    hideElement,
    spinnerId,
    messageElementId,
    messages,
    SCROLL_DEBOUNCE_TIME,
    SEARCH_DEBOUNCE_TIME,
} from "./utils.js";

const searchInput = document.getElementById("search-input");
const suggestionsContainer = document.getElementById("suggestions-container");
const clearBtn = document.getElementById("clear-btn");

let db = null;
const LIMIT = 50;
let currentPage = 0;
let currentQuery = null;

let hasMoreResults = true;

const fetchSuggestions = async (clearScrollContainer) => {
    if (!hasMoreResults) {
        return;
    } else {
        hideElement(messageElementId);
    }
    try {
        isFetching = true;
        showElement(spinnerId);
        const suggestions = await db.fetch(currentQuery, currentPage, LIMIT);
        onFetchSuccess(clearScrollContainer, suggestions);
    } catch (e) {
        console.error("Error fetching Districts", e);
    } finally {
        isFetching = false;
        hideElement(spinnerId);
    }
};
const onFetchSuccess = (clearScrollContainer, suggestions) => {
    isFetching = false;
    hideElement(spinnerId);

    if (clearScrollContainer) {
        suggestionsContainer.innerHTML = "";
    }
    if (suggestions?.length > 0) {
        appendSuggestions(suggestions);
    }

    //Check if all the suggestions are loaded per query
    if (
        suggestions?.length == 0 ||
        (suggestions?.length > 0 && suggestions?.length < LIMIT)
    ) {
        hasMoreResults = false;
        showElement(messageElementId, messages.ALL_RECORDS_LOADED);
    } else {
        hasMoreResults = true;
        hideElement(messageElementId);
    }
};
const appendSuggestions = (suggestions) => {
    if (isFetching) {
        return;
    }
    suggestions.forEach((suggestion) => {
        const liEl = document.createElement("li");
        const text = `${suggestion?.District_code} ${suggestion?.District_name}`;
        const query = searchInput?.value;

        const regex = new RegExp(`(${query})`, "gi");
        const highlightedText = text.replace(regex, "<strong>$1</strong>");

        liEl.innerHTML = highlightedText;
        liEl.classList.add("suggestion-item");
        liEl.classList.add("show");
        // requestAnimationFrame(() => {
        //     liEl.classList.add("suggestion-item");
        //     liEl.classList.add("show");
        // });

        suggestionsContainer.appendChild(liEl);
    });

    isFetching = false;
};

let isFetching = false;

const handleScroll = async () => {
    // if (isFetching) return;
    const scrollPercentage =
        (suggestionsContainer.scrollTop + suggestionsContainer.clientHeight) /
        suggestionsContainer.scrollHeight;

    if (scrollPercentage > 0.75) {
        currentPage++;
        fetchSuggestions(false);
    }
};

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

const handleInput = async (event) => {
    const query = event.target.value.trim();
    if (query === "") {
        // suggestionsContainer.style.display = "none";
        currentQuery = null;
    } else {
        currentQuery = {
            District_name: query,
        };
    }
    currentPage = 0;
    suggestionsContainer.scrollTop = 0;
    hasMoreResults = true;
    fetchSuggestions(true);
};
searchInput.addEventListener(
    "input",
    debounce(handleInput, SEARCH_DEBOUNCE_TIME)
);
// searchInput.addEventListener("focus", handleInput);

suggestionsContainer.addEventListener(
    "scroll",
    debounce(handleScroll, SCROLL_DEBOUNCE_TIME)
);
clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    suggestionsContainer.innerHTML = "";
});
window.addEventListener("load", async (event) => {
    // page is fully loaded
    hideElement(spinnerId);

    try {
        showElement(spinnerId);
        db = await initializeDatabase();
        if (db.isConnected) {
            console.log("connected to db");
            hideElement(spinnerId);
            await fetchSuggestions(true);
        }
    } catch (error) {
        showElement(messageElementId, error);
        hideElement(spinnerId);
        console.log(error);
    }
});
