# Voltify

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/Redux-%23593D88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234EA94B.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node.js&logoColor=white)

## Overview

This is a full-stack e-commerce portfolio application built using the MERN stack: MongoDB, Express.js, React, and Node.js, with Redux for state management on the frontend. It showcases my skills in developing a complete web application with user authentication, product catalog, shopping cart functionality, and order processing.

**Key Features:**

* **User Authentication:** Secure user registration and login with password hashing.
* **Product Catalog:** Browse a variety of products with detailed descriptions, images, and pricing.
* **Shopping Cart:** Add, remove, and manage items in a persistent shopping cart.
* **Order Processing:** Simulate the checkout process and order submission.
* **Admin Dashboard:** A separate interface for administrators to manage products, users, and orders.
* **Responsive Design:** The application is designed to be user-friendly across various devices.

## Technologies Used

**Frontend:**

* [React](https://react.dev/): A JavaScript library for building user interfaces.
* [Redux](https://redux.js.org/): A predictable state management library for JavaScript applications.
* [React Router](https://reactrouter.com/): For declarative routing in React applications.
* [Axios](https://axios-http.com/): For making HTTP requests to the backend API.
* [React Bootstrap](https://react-bootstrap.netlify.app/): For styling.

**Backend:**

* [Node.js](https://nodejs.org/): A JavaScript runtime built on Chrome's V8 JavaScript engine.
* [Express.js](https://expressjs.com/): A minimal and flexible Node.js web application framework.
* [MongoDB](https://www.mongodb.com/): A NoSQL database for storing application data.
* [Mongoose](https://mongoosejs.com/): An elegant MongoDB object modeling for Node.js.
* [bcrypt](https://www.npmjs.com/package/bcrypt): For password hashing.
* [jsonwebtoken](https://jwt.io/): For creating and verifying JSON Web Tokens for authentication.

## Setup and Installation

To run this application locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Configure MongoDB:**
    * Ensure you have MongoDB installed and running.
    * Create a `.env` file in the `backend` directory and add your MongoDB connection URI:
        ```env
        MONGODB_URI=mongodb://your_mongodb_uri
        JWT_SECRET=your_jwt_secret_key
        # Add any other environment variables
        ```

4.  **Run the backend server:**
    ```bash
    npm start
    ```
    The backend server will typically run on `http://localhost:5000` (or a port you configure).

5.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

6.  **Configure frontend environment variables (if any):**
    * Create a `.env.local` file in the `frontend` directory if you have any environment-specific configurations (like API URLs). For example:
        ```env
        REACT_APP_API_URL=http://localhost:5000/api
        ```

7.  **Run the frontend application:**
    ```bash
    npm start
    ```
    The frontend application will typically run on `http://localhost:3000`.

8.  **Open your browser:** Navigate to `http://localhost:3000` to view the application.

## Functionality and Features in Detail

* **User Authentication:**
    * Users can create new accounts by providing their name, email, and password.
    * Password security is ensured using bcrypt for hashing.
    * Registered users can log in using their email and password.
    * Authentication status is maintained using JSON Web Tokens (JWT).
* **Product Catalog:**
    * Displays a list of available products fetched from the backend.
    * Each product card shows the name, image, and price.
    * Clicking on a product opens a detailed view with more information.
* **Shopping Cart:**
    * Users can add products to their cart from the product list or detailed view.
    * The cart displays the selected items with their quantities and total price.
    * Users can update quantities or remove items from the cart.
    * The cart state is managed using Redux for global access and persistence.
* **Order Processing:**
    * A simplified checkout process allows users to review their order and submit it.
    * Order details (items, total, user information) are sent to the backend.
* **Admin Dashboard:**
    * Accessible through a separate route with admin authentication.
    * Allows administrators to create, read, update, and delete products.
    * Provides functionalities to manage user accounts and view order history.
    * Allows administrators to check statistics for orders, products and revenue.
* **Responsive Design:**
    * Utilizes React Bootstrap and a flexible layout to adapt to different screen sizes .


## Reflection and Learning

This project provided valuable experience in building a full-stack web application from scratch. I gained a deeper understanding of:

* Setting up and managing a MERN stack environment.
* Implementing user authentication and authorization.
* Designing and implementing a RESTful API using Express.js.
* Managing complex frontend state with Redux.
* Creating responsive and user-friendly interfaces with React.
* Working with MongoDB for data persistence.
* [Mention any specific challenges you overcame or new concepts you grasped.]

## Connect with Me

* [Portfolio](https://piotrtomaszek.onrender.com/)
* [LinkedIn](https://www.linkedin.com/in/piotr-tomaszek/)
* [GitHub](https://github.com/pitrekbond/)

## License

[MIT](LICENSE)

---

**Thank you for checking out my e-commerce portfolio application!**
