# Task 3: Custom Local Database

## Description

This project implements a custom local database solution using vanilla JavaScript. It does not rely on any external database tools or libraries. The database supports insertion, update, and fetch operations with the ability to store records in a text file (csv) and retrieve them based on specific criteria.

## columns in the csv file: `District_code,State_name,District_name,Population,Male,Female,Literate,Male_Literate,Female_Literate`

## Requirements

-   Perform insertion of records as text or files.
-   Implement an update mechanism for modifying existing records.
-   Create a fetch function to retrieve records based on search criteria.
-   Simulate database functionality by directly interacting with the filesystem.
-   Implement a simple indexing system to speed up searches and retrieval.
-   Ensure scalability to handle thousands of records while maintaining good performance.
-   Provide logs of operations to track the time taken for each database action.

## Features

-   Asynchronous CRUD operations to simulate real database interactions with a delay.
-   Compound indexing to optimize fetch and update operations.
-   logs of operations to track the time taken for each database action

## Setup

1. **Clone the repository:**
    ```bash
    git clone git@github.com:vidiyaG/Vanilla-JavaScript.git
    cd TASK-3
    ```

## Run

1. **index.html:**
   Run the index.html using liveserver or open the file in a browser

## Output analysis

-   Open browser console and found the logs for operatons after Connectioning to Database

## Additional Features

-   The database supports compound indexing for optimized search capabilities.
