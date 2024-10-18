// Intialize Database connection and Perform operaions
import { initializeDatabase } from "./database.js";
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

    // Fetch from index
    const indexedRecords = await db.fetch({ State_name: "Uttar Pradesh" });
    console.log("Indexed Records:", indexedRecords);
}

run()
    .then((data) => {
        console.log("OPERATIONS DONE");
    })
    .catch((e) => {
        console.log("OPERATIONS FAILED");
        console.log(e);
    });
