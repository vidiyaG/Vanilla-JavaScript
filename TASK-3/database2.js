const CSV_FILE = "../TASK-3/india-districts.csv";
const DB_CONNECTION_TIME = 1000;
const QUERY_DELEY = 100;

export class LocalDatabase {
    constructor() {
        connected: false;
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
    async loadRecords1() {
        try {
            await this.simulateDelay(); // Simulating async behavior
            const response = await fetch(CSV_FILE);
            const csvText = await response.text();
            const rows = csvText.split("\n").map((row) => row.split(","));
            const headers = rows[0];

            rows.slice(1).forEach((row) => {
                const record = {};
                row.forEach((cell, index) => {
                    record[headers[index].trim()] = cell.trim();
                });

                this.records.set(record.District_name, record);
            });
        } catch (error) {
            console.error("Error loading CSV:", error);
            throw new Error("Error loading CSV");
        }
    }

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

                    this.isReady = true;
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

    // Fetch records based on criteria
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
    const db = new LocalDatabase();
    await db.loadRecords(); // Ensure records are loaded before returning the db instance
    return db;
}
