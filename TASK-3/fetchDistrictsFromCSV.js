export const allDistricts = [];
export const fetchDistricts = () => {
    return fetch("../TASK-3/india-districts.csv")
        .then((response) => response.text())
        .then((csvText) => {
            const rows = csvText.split("\n").map((row) => row.split(",")); // Split rows and columns
            const headers = rows[0]; // First row contains the headers
            const jsonData = rows.slice(1).map((row) => {
                const obj = {};
                row.forEach((cell, index) => {
                    obj[headers[index].trim()] = cell.trim(); // Assign each cell value to the respective header key
                });
                return obj;
            });
            // console.log(jsonData); // JSON array from CSV
            return jsonData;
        })
        .catch((error) => console.error("Error loading CSV:", error));
};

// getDistricts();
