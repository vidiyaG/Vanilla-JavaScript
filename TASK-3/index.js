const LocalDatabase = require("./database");

export const db = new LocalDatabase();

// Fetch the records for page 2 with a limit of 3 records per page
const page = 2;
const limit = 3;
const paginatedResults = db.fetch({}, limit, page);

console.log(`Results for Page ${page}:`, paginatedResults);
