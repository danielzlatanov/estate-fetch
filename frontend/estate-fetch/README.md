# Estate Fetch App

The **Estate Fetch App** is an educational web application that helps users quickly find real estate deals and listings. This application follows a monolithic structure where both the frontend and backend are hosted together in the same repository.

## Table of Contents

- [Features](#features)
- [Limitations and Future Features](#limitations-and-future-features)
- [Dependencies](#dependencies)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Getting Started

To run the Estate Fetch application, follow these steps:

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

3. Start the Express/Node.js server using the following command:

   ```bash
   npm start
   ```

4. The backend server will start and be accessible at http://localhost:8000/.

### MongoDB Atlas Database

Estate Fetch utilizes MongoDB Atlas, a cloud-based database service, to store and retrieve the scraped real estate data.

Currently using a free M0 512 MB cluster provided by MongoDB Atlas to host the database. This cluster offers a cost-effective solution for the project's needs.

## 🌐 Backend API Routes

Here are all of the available API routes for interacting with the backend server:

### Authentication Routes

| Route           | Description              | Method | Headers | Parameters / Request Body |
| --------------- | ------------------------ | ------ | ------- | ------------------------- |
| `/api/register` | Register a new user      | POST   | None    | JSON: {user data}         |
| `/api/login`    | Log in an existing user  | POST   | None    | JSON: {user credentials}  |
| `/api/logout`   | Log out the current user | POST   | None    | None                      |

## Features

### Web Scraping

- The app currently scrapes data from [imot.bg](https://www.imot.bg/), the largest Bulgarian real estate site.

### Backend Functionality

- The backend scrapes data from imot.bg and saves it to a MongoDB database.
- Data is processed and stored, including property details and realtor information.
- The backend serves as a central data repository for the frontend.

### Frontend Functionality

- Users can search through property titles to find listings matching their criteria.
- The frontend displays property details, including keen-slider image carousels, titles, prices, locations, descriptions, floors, construction types, square meters prices, areas, and realtor information.
- Catalog pages list property previews, including thumbnails, prices, descriptions, and buttons for viewing details and accessing external listings.

### Home Page

- The home page includes a hero section, scraper overview, features section, frequently asked questions (FAQ), and a data origins section.
- It provides an informative and engaging landing experience for users.

### User-Friendly Experience

- No registration or payment is required to access all features.
- The app is designed to be user-friendly and intuitive for quick real estate searches.

## Limitations and Future Features

### Upcoming Features

- **Search Filters:** Implement search filters for location, price range, property type, and more.
- **Scraping Enhancements:** Gather data from additional sources and improve the scraper to provide more comprehensive information.
- **Mini Navigation Bar:** Add a navigation bar with tags and filters for specific location searches.
- **Price Range Slider:** Include a min/max price slider range for search.
- **Sorting Options:** Enable sorting by floor, construction, area range, price ascending/descending, and realtor agencies.
- **Improved Search Queries:** Enhance search capabilities to include searching in the title/description.
- **Contact Us Form:** Implement a contact form for user inquiries.
- **Responsive FAQ Section:** Create a responsive FAQ section in the home or a separate view.
- **Loaders:** Add loading indicators to catalog and property details pages.
- **Pagination:** Implement pagination for the catalog page (currently displays all listings).
- **Dark Mode:** Add a light/dark mode switch button and optimize the app for dark mode.
- **Automated Scraping:** Use cheerio and node-cron to automate the scraping process (e.g., weekly updates).

### Known Limitations

- The app follows a monolithic architecture where the frontend and backend are tightly coupled and hosted together.
- Data scraping is currently limited to [imot.bg](https://www.imot.bg/), but more sources will be added in the future.

## Dependencies

The app relies on the following technologies and libraries:

- **Styling:** Tailwind CSS
- **Frontend:** Angular
- **Backend:** Node.js with Express
- **Data Storage:** MongoDB
- **Web Scraping:** Puppeteer (with plans to add cheerio)
- **HTTP Requests:** Angular’s HttpClient
- **Continuous Changes:** nodemon
- **CORS Handling:** cors

## Getting Started

[Include instructions on how to get started with your app, such as prerequisites, setup, and installation.]

## Usage

[Provide examples and usage scenarios for your app. Include screenshots or code samples to demonstrate how to use it.]

## Contributing

[Explain how others can contribute to your project, whether through bug reports, feature requests, or code contributions.]

## License

[Specify the license under which your app is distributed, e.g., MIT or Apache 2.0.]

Welcome to the SoftUni Forum project, an Angular Single Page Application (SPA). This comprehensive documentation will guide you through all four parts of the project, including key concepts, features, and instructions for each part.
