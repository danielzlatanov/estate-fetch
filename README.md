# Estate Fetch

**Estate Fetch** is a comprehensive full-stack educational web application designed to assist users in efficiently discovering real estate deals and listings. This innovative platform seamlessly combines both frontend and backend functionalities, all housed within a single repository.

## Table of Contents

-   [API Routes](#-backend-api-routes)
-   [Features](#-features)
-   [Tech Stack](#-tech-stack-and-tools)
-   [Known Limitations](#-known-limitations)

## 🚀 Getting Started

**You can access the deployed application version by clicking here: [Estate Fetch](https://estate-fetch.vercel.app/)**

_If you wish to run Estate Fetch **locally**, follow these steps:_

### Frontend (Angular)

1. Open a terminal in the **root** of the project and navigate to the `frontend` folder, where the frontend code is located.

    ```bash
    cd frontend
    ```

    ```bash
    cd estate-fetch
    ```

2. Install the required dependencies by running the following command:

    ```bash
    npm install
    ```

3. Start the Angular development server using the following command:

    ```bash
    ng serve
    ```

4. Open your web browser and go to http://localhost:4200/ to access the frontend of the application.

### Backend (Express & Node.js)

1. Open a separate terminal in the **root** of the project and navigate to the `backend` folder, where the backend code is located.

    ```bash
    cd backend
    ```

2. Install the required dependencies by running the following command:

    ```bash
    npm install
    ```

3. Start the server using the following command:

    ```bash
    npm start
    ```

4. The backend server will start and be accessible at http://localhost:8000/.

### MongoDB Atlas Database

-   Estate Fetch utilizes MongoDB Atlas, a cloud-based database service, to store and retrieve the scraped real estate data.

-   Currently using a free M0 512 MB cluster provided by MongoDB Atlas to host the database. This cluster offers a cost-effective solution for the project's needs.

###### [Back to Top](#estate-fetch)

## 🌐 Backend API Routes

Here are all of the available API routes for interacting with the backend server:

| Route                 | Description                                  | Method | Headers          | Parameters / Request Body |
| --------------------- | -------------------------------------------- | ------ | ---------------- | ------------------------- |
| `/`                   | Welcome message                              | GET    | None             | None                      |
| `/api/scrape`         | Scrape and save data to DB (protected route) | GET    | `x-secret-token` | None                      |
| `/api/estates`        | Get all estates                              | GET    | None             | None                      |
| `/api/estates/search` | Search all estates                           | GET    | None             | None                      |
| `/api/estates/:id`    | Get estate by ID                             | GET    | None             | None                      |

###### [Back to Top](#estate-fetch)

## 🔑 Features

### Backend Functionality

-   The backend scrapes data from [imot.bg](https://www.imot.bg/) and saves it to MongoDB Atlas.
-   Data is processed and stored, including property details and realtor information.
-   The backend serves as a central data repository for the frontend.

#### Local Scraper Setup

To run the scraper **locally**, follow these steps:

1.  Copy the contents of the `.env.example` file to a new file named `.env` in the `backend` directory.

2.  Set your MongoDB connection string in the `MONGODB_URL` variable.

3.  Customize the `SECRET_TOKEN` in the `.env` file. This token is used to authenticate requests to initiate the scraping process.

4.  Open your terminal and navigate to the `backend` directory.

5.  Run the following commands to install dependencies and start the local server:

    ```bash
    npm install
    npm run dev
    ```

6.  Once the server is running and your database is connected, make a **GET** request to http://localhost:8000/api/scrape with your chosen API client (e.g., cURL or Postman) and include the **SECRET_TOKEN** in the request header. Ensure that the header is named `x-secret-token`.

#### Note: The scraping functionality is designed for personal and educational use. Please be responsible and do not misuse it. Be mindful of the legal considerations associated with web scraping.

### Frontend Functionality

-   Users can perform partial searches by keywords that match the **title**, **location**, and **description** fields to find listings matching their criteria.
-   The frontend displays property details, including keen-slider image carousel, title, price, location, description, floor, construction type, square meters price, area, and realtor information.
-   Catalog page displays property previews, including thumbnails, prices, descriptions, and buttons for viewing details/accessing external listings.

#### Search Filters

-   Price Range:

    -   Finds properties within the specified minimum and maximum price range (can be used separately or together).

-   Location:

    -   Provides a list of cities across Bulgaria to filter by.

-   Construction Type:

    -   Filters properties based on available construction types.

-   Area Size:

    -   Defines the minimum area size of properties.

-   Number of Rooms:

    -   Specifies the number of rooms.

-   **Apply / Reset Filters:**

    -   Click the **Apply** button to activate your selected filters _**or**_ use the **Reset** button to clear all filters.

#### Sort Options

-   Relevance:

    -   Properties based on relevance.

-   Price Ascending:

    -   Properties from the lowest to the highest price.

-   Price Descending:

    -   Properties from the highest to the lowest price.

-   Newest Listings:

    -   Latest property listings.

-   Oldest Listings:

    -   Earliest property listings.

-   Most Views:

    -   Properties based on the highest number of views.

-   Least Views:

    -   Properties based on the lowest number of views.

#### **The chosen filters/sorting preferences are encoded in the URL, allowing for sharing of searches with others.**

### Home Page

-   Home page includes a hero section, scraper overview, features section, frequently asked questions (FAQ), and data origins section.
-   It provides an informative and engaging landing experience for users.

### User-Friendly Experience

-   No registration or payment is required to access all features.
-   The app is designed to be user-friendly and intuitive for quick real estate searches.
-   It is fully responsive across all devices, thanks to Tailwind CSS.

###### [Back to Top](#estate-fetch)

## 📦 Tech Stack and Tools

The app relies on the following technologies and libraries:

-   **Frontend:** Angular
-   **HTTP Requests:** Angular’s HttpClient
-   **Image Carousel:** keen-slider
-   **Styling:** Tailwind CSS
-   **Backend:** Node.js with Express
-   **Web Scraping:** Puppeteer
-   **CORS Handling:** cors
-   **Data Storage:** MongoDB Atlas
-   **Deployment Platform:** Vercel

###### [Back to Top](#estate-fetch)

## ❗ Known Limitations

1. **Monolithic Architecture:** The application follows a monolithic architecture where the frontend and backend are tightly coupled within the same repository.

2. **Limited Data Sources:** Currently, the data scraping functionality is limited to [imot.bg](https://www.imot.bg/). Data sources will be expanded to provide a more comprehensive real estate dataset.

3. **Browser Compatibility:** Estate Fetch is optimized for modern web browsers. While it should work well in most browsers, some features may not function as expected in older or less common browsers.

4. **User Profiles and Authentication:** User profiles and authentication features are not yet implemented in the application. Users can access all features without the need for registration.

###### [Back to Top](#estate-fetch)
