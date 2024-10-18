//TASK 3: Perform Insertion, Update, and Fetch Operations on a Custom Local Database (No External Tools)

const CSV_FILE = "../TASK-3/india-districts.csv";
const DB_CONNECTION_TIME = 1000;
const QUERY_DELEY = 100;

export class LocalDatabase {
    constructor() {
        this.isConnected = false;
        this.records = new Map(); // Map for faster access
        this.index = {}; // Indexing for faster lookups
    }

    // Simulate a delay for asynchronous behavior (e.g., simulating a real database)
    simulateDelay() {
        return new Promise((resolve) => setTimeout(resolve, QUERY_DELEY)); // 5-second delay
    }

    logOperation(operation, startTime, sizeBefore, sizeAfter) {
        const endTime = Date.now();
        console.log(
            `Operation: ${operation} | Time Taken: ${
                endTime - startTime
            } ms | Records Before: ${sizeBefore} | Records After: ${sizeAfter}`
        );
    }

    // Load records from the CSV file
    async loadRecords() {
        return new Promise((resolve, reject) => {
            // Simulating async behavior
            setTimeout(async () => {
                try {
                    const response = await fetch(CSV_FILE);
                    const csvText = await response.text();
                    const rows = csvText
                        .split("\n")
                        .map((row) => row.split(","));
                    const headers = rows[0];

                    rows.slice(1).forEach((row) => {
                        const record = {};
                        row.forEach((cell, index) => {
                            record[headers[index].trim()] = cell.trim();
                        });

                        this.records.set(record.District_name, record);
                    });

                    this.isConnected = true;
                    resolve("Database connected successfully");
                } catch (error) {
                    reject("Error loading CSV:", error);
                    console.error("Error loading CSV:", error);
                }
            }, DB_CONNECTION_TIME); // Simulate a 10-second delay
        });
    }

    // Insert a new record
    async insert(record) {
        const startTime = Date.now();
        const sizeBefore = this.records.size;

        await this.simulateDelay();

        return new Promise((resolve) => {
            this.records.set(record.District_code, record);
            this.index[record.District_code] = record;

            this.logOperation(
                "Insert",
                startTime,
                sizeBefore,
                this.records.size
            );
            resolve(record);
        });
    }

    // Update an existing record
    async update(District_code, newRecord) {
        const startTime = Date.now();
        const sizeBefore = this.records.size;

        await this.simulateDelay();

        return new Promise((resolve, reject) => {
            if (this.records.has(District_code)) {
                this.records.set(District_code, newRecord);
                this.index[District_code] = newRecord;

                this.logOperation(
                    "Update",
                    startTime,
                    sizeBefore,
                    this.records.size
                );
                resolve(newRecord);
            } else {
                reject("Record not found for update.");
            }
        });
    }
    generateIndexKey(record) {
        return `${record.State_name}|${record.District_name}`; // Compound index using State and District
    }
    // Fetch records based on query
    async fetch(criteria = null, page = 0, limit = 10) {
        const startTime = Date.now();
        await this.simulateDelay();

        return new Promise((resolve) => {
            let results = [];

            if (
                criteria &&
                criteria.District_name &&
                this.index[criteria.District_name]
            ) {
                results = this.index[criteria.District_name]; // Fetch from the index
            } else {
                if (criteria) {
                    results = Array.from(this.records.values()).filter(
                        (record) => {
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
                        }
                    );
                    if (criteria.District_name) {
                        this.index[criteria.District_name] = results;
                    }
                } else {
                    results = Array.from(this.records.values());
                }
            }
            //Number of records per given query
            const sizeBefore = results?.length;

            // Handle pagination (offset and limit)
            const offset = page * limit;
            if (limit) {
                results = results.slice(offset, offset + limit);
            }

            this.logOperation("Fetch", startTime, sizeBefore, results.length);
            resolve(results);
        });
    }
}

export async function initializeDatabase() {
    try {
        const db = new LocalDatabase();
        await db.loadRecords(); // Ensure records are loaded before returning the db instance
        return db;
    } catch (error) {
        throw new Error("Failed to connect Database");
    }
}

// Intialize Database connection and Perform operaions
export async function run() {
    const db = await initializeDatabase();

    // Insert records
    await db.insert({
        District_code: "101",
        State_name: "Uttar Pradesh",
        District_name: "Agra",
        Population: 1585705,
        Male: 832394,
        Female: 753311,
        Literate: 929880,
        Male_Literate: 488025,
        Female_Literate: 441855,
    });

    await db.insert({
        District_code: "102",
        State_name: "Uttar Pradesh",
        District_name: "Lucknow",
        Population: 2815600,
        Male: 1482130,
        Female: 1333470,
        Literate: 1923820,
        Male_Literate: 1043100,
        Female_Literate: 880720,
    });

    // Update a record
    await db.update("101", {
        District_code: "101",
        State_name: "Uttar Pradesh",
        District_name: "Agra",
        Population: 1600000, // Updated population
        Male: 840000,
        Female: 760000,
        Literate: 930000,
        Male_Literate: 490000,
        Female_Literate: 440000,
    });

    // Fetch records
    const allRecords = await db.fetch();
    console.log("All Records:", allRecords);

    // Fetch with criteria
    const filteredRecords = await db.fetch({ State_name: "Uttar Pradesh" });
    console.log("Filtered Records:", filteredRecords);
}

run().then((data) => {
    console.log("OPERATIONS DONE");
});
