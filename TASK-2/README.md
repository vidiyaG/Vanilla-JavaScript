# Task 2: Typeahead with Infinite Scroll

# Overview

-   This project implements a typeahead search feature with infinite scrolling, simulating a large dataset in a local environment. The main goal is to enhance user experience by providing real-time suggestions as the user types and loading additional data dynamically as they scroll.

## Features

-   Typeahead Search: Users receive suggestions based on their input, with results updating in real-time.
-   Infinite Scrolling: Additional results load automatically as the user scrolls to the bottom of the page.
-   Debouncing: Prevents excessive API calls by delaying the search function until the user stops typing for a specified period.
-   Custom Cancellation Logic: Ensures that only the latest search request is processed, effectively cancelling previous requests within the debounce timeframe.

## Setup

1. **Clone the repository:**
    ```bash
    git clone git@github.com:vidiyaG/Vanilla-JavaScript.git
    cd TASK-2
    ```

## Run

1. **index.html:**
   Run the index.html using liveserver or open the file in a browser

## Usage

-   Type in the Search Box: Start typing in the input field to see typeahead suggestions.
-   Scroll Down: As you reach the bottom of the list, more results will load automatically.
