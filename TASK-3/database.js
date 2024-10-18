// const fs = require("fs");
// const path = require("path");

// const TXT_FILE = path.join(__dirname, "india-districts.txt");
// const CSV_FILE = path.join(__dirname, "india-districts.csv");

const CSV_FILE = "../TASK-3/india-districts.csv";

export class LocalDatabase {
    constructor() {
        connected: false, (this.records = new Map()); // Map for faster access
        this.index = {}; // Indexing for faster lookups
        this.loadRecords();
    }

    logOperation(operation, startTime, sizeBefore, sizeAfter) {
        const endTime = Date.now();
        // console.log(
        //     `Operation: ${operation} | Time Taken: ${
        //         endTime - startTime
        //     } ms | Records Before: ${sizeBefore} | Records After: ${sizeAfter}`
        // );
    }

    // loadRecords1() {
    //     // Ensure CSV file exists and create it if it doesn't
    //     if (!fs.existsSync(CSV_FILE)) {
    //         fs.writeFileSync(
    //             CSV_FILE,
    //             "District_code,State_name,District_name,Population,Male,Female,Literate,Male_Literate,Female_Literate\n"
    //         );
    //     }

    //     const data = fs.readFileSync(CSV_FILE, "utf-8");
    //     const lines = data.split("\n").filter(Boolean); // Split into lines and remove empty lines
    //     const headers = lines[0].split(","); // First line is the header

    //     // Process each record line (skip headers)
    //     for (const line of lines.slice(1)) {
    //         const values = line.split(",");
    //         const record = {
    //             District_code: values[0],
    //             State_name: values[1],
    //             District_name: values[2],
    //             Population: parseInt(values[3]),
    //             Male: parseInt(values[4]),
    //             Female: parseInt(values[5]),
    //             Literate: parseInt(values[6]),
    //             Male_Literate: parseInt(values[7]),
    //             Female_Literate: parseInt(values[8]),
    //         };
    //         this.records.set(record.District_code, record); // Use District_code as unique key
    //         this.index[record.District_code] = record; // Add to index for quick lookups
    //     }
    // }

    loadRecords() {
        fetch("../TASK-3/india-districts.csv")
            .then((response) => response.text())
            .then((csvText) => {
                const rows = csvText.split("\n").map((row) => row.split(",")); // Split rows and columns
                const headers = rows[0]; // First row contains the headers
                rows.slice(1).forEach((row) => {
                    const record = {};
                    row.forEach((cell, index) => {
                        record[headers[index].trim()] = cell.trim(); // Assign each cell value to the respective header key
                    });

                    this.records.set(record.District_name, record); // Use District_code as unique key
                    // this.index[record.District_name] = record; // Add to index for quick lookups

                    // return obj;
                });
                // console.log(jsonData); // JSON array from CSV
                // return jsonData;
            })
            .catch((error) => console.error("Error loading CSV:", error));
    }

    saveRecordToTxt(record) {
        // const txtLine = JSON.stringify(record) + "\n";
        // fs.appendFileSync(TXT_FILE, txtLine); // Append to the .txt file
    }

    saveRecordToCsv(record) {
        const csvLine = `${record.District_code},${record.State_name},${record.District_name},${record.Population},${record.Male},${record.Female},${record.Literate},${record.Male_Literate},${record.Female_Literate}\n`;
        fs.appendFileSync(CSV_FILE, csvLine); // Append to the .csv file
    }

    rewriteFiles() {
        const recordsArray = Array.from(this.records.values());

        // Rewrite .txt file
        const txtData = recordsArray
            .map((record) => JSON.stringify(record))
            .join("\n");
        // fs.writeFileSync(TXT_FILE, txtData + "\n");

        // Rewrite .csv file
        const headers =
            "District_code,State_name,District_name,Population,Male,Female,Literate,Male_Literate,Female_Literate\n";
        const csvData = recordsArray
            .map(
                (record) =>
                    `${record.District_code},${record.State_name},${record.District_name},${record.Population},${record.Male},${record.Female},${record.Literate},${record.Male_Literate},${record.Female_Literate}`
            )
            .join("\n");
        fs.writeFileSync(CSV_FILE, headers + csvData + "\n");
    }

    insert(record) {
        const startTime = Date.now();
        const sizeBefore = this.records.size;

        this.records.set(record.District_code, record);
        this.index[record.District_code] = record; // Add to index

        // Save to both .txt and .csv files
        this.saveRecordToTxt(record);
        this.saveRecordToCsv(record);

        this.logOperation("Insert", startTime, sizeBefore, this.records.size);
    }

    update(District_code, newRecord) {
        const startTime = Date.now();
        const sizeBefore = this.records.size;

        if (this.records.has(District_code)) {
            this.records.set(District_code, newRecord);
            this.index[District_code] = newRecord; // Update index

            // Rewrite both .txt and .csv files to ensure consistency
            this.rewriteFiles();

            this.logOperation(
                "Update",
                startTime,
                sizeBefore,
                this.records.size
            );
        } else {
            console.error("Record not found for update.");
        }
    }

    simulateDelay() {
        return new Promise((resolve) => setTimeout(resolve, 5000)); // 5-second delay
    }
    async fetchData(criteria = null, page = 0, limit = 10) {
        const startTime = Date.now();
        await this.simulateDelay();
        const sizeBefore = this.records.size;
        let results = [];

        // Step 1: Check for criteria and whether we can fetch from index
        if (
            criteria &&
            criteria.District_name &&
            this.index[criteria.District_name]
        ) {
            results = this.index[criteria.District_name]; // Fetch from the index
        } else {
            // Step 2: If no direct index, perform filtering if criteria exist
            if (criteria) {
                results = Array.from(this.records.values()).filter((record) => {
                    for (let key in criteria) {
                        // If any criteria doesn't match, exit early
                        if (
                            !record[key]
                                ?.toLowerCase()
                                .includes(criteria[key].toLowerCase())
                        ) {
                            return false;
                        }
                    }
                    return true;
                });

                // Update the index with the new filtered results for the next call
                if (criteria.District_name) {
                    this.index[criteria.District_name] = results;
                }
            } else {
                // Step 3: If no criteria, fetch all records
                results = Array.from(this.records.values());
            }
        }

        // Step 4: Handle pagination (offset and limit) outside the filtering logic
        const offset = page * limit;
        console.log(
            `Records fetched ',${criteria?.District_name}  ${results.length}`
        );
        if (limit) {
            results = results.slice(offset, offset + limit);
        }

        // Step 5: Log the operation for monitoring performance
        this.logOperation("Fetch", startTime, sizeBefore, results.length);

        // Step 6: Return the results

        return results;
    }
}
