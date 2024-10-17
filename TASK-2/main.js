import { LocalDatabase } from "../TASK-3/database.js";
const searchInput = document.getElementById("search-input");
const suggestionsContainer = document.getElementById("suggestions-container");
const clearBtn = document.getElementById("clear-btn");
const spinner = document.getElementById("spinner-icon");

let db = null;
let suggestions = [];
const LIMIT = 10;
let currentPage = 0;
let currentQuery = null;

let abortController = null;
let debounceTimeout = null;
const debounceTime = 300;

const showSpinner = () => {
    spinner.style.display = "flex";
};
const hideSpinner = () => {
    spinner.style.display = "none";
};
const fetchSuggestions = async (searchQueryChanged) => {
    // if (isFetching) {
    //     return;
    // }
    if (searchQueryChanged) {
        suggestionsContainer.innerHTML = "";
    }

    try {
        isFetching = true;
        showSpinner();
        suggestions = await db.fetchData(currentQuery, currentPage, LIMIT);
        isFetching = false;
        if (suggestions?.length > 0) appendSuggestions(suggestions);
    } catch (e) {
        console.error("Error fetching Districts", e);
    } finally {
        isFetching = false;
        hideSpinner();
    }
};

const appendSuggestions = (suggestions) => {
    // suggestionsContainer.innerHTML = "";
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
    console.log(isFetching);
    if (isFetching) return;
    const scrollPercentage =
        (suggestionsContainer.scrollTop + suggestionsContainer.clientHeight) /
        suggestionsContainer.scrollHeight;

    if (scrollPercentage > 0.8) {
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
    console.log("----------- ", query);
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
    suggestionsContainer.innerHTML = "";

    fetchSuggestions(true);
};
searchInput.addEventListener("input", debounce(handleInput, 800));
// searchInput.addEventListener("focus", handleInput);

suggestionsContainer.addEventListener("scroll", debounce(handleScroll, 300));
clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    suggestionsContainer.innerHTML = "";
});
window.addEventListener("load", (event) => {
    // page is fully loaded
    db = new LocalDatabase();
    fetchSuggestions(true);
});
