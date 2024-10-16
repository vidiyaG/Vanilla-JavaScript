import { fetchDistricts } from "../TASK-3/fetchDistrictsFromCSV.js";
let suggestions = [];
const inputSearchEl = document.getElementById("search-input");
const suggestionsContainer = document.getElementById("suggestions-container");
let count = 0;
const fetchSuggestions = async () => {
    try {
        suggestions = await fetchDistricts();
    } catch (e) {
        console.error("Error fetching Districts", e);
    }
};
fetchSuggestions();

const loadRecordsIntoDom = () => {
    setInterval(() => {
        const liEl = document.createElement("li");
        const text = `${suggestions[count]?.District_code} ${suggestions[count]?.District_name}`;
        liEl.innerHTML = text;
        suggestionsContainer.appendChild(liEl);
        count++;
    }, 2000);
};

// loadRecordsIntoDom();
