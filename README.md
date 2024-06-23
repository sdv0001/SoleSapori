# Sole e Sapori

**Sole e Sapori** is a digital archive celebrating Italy's rich culinary traditions. It collects, organizes, and provides easy access to a wide range of Italian recipes, from traditional to modern. The platform caters to chefs, cooking enthusiasts, researchers, and students with advanced search features and a user-friendly interface.

## Key Features

- **Extensive Recipe Collection**: Explore a wide variety of Italian recipes categorized by region, dish type, preparation time, difficulty, and cost.
- **Advanced Search Filters**: Utilize filters to search recipes by ingredients, region, dish type, preparation time, and difficulty level to find the perfect recipe for any occasion.
- **User Authentication**: Secure user registration and login using bcrypt for password encryption and JSON Web Tokens (JWT) for authentication.
- **Favorite Recipes**: Save your favorite recipes for easy access later, and manage your collection with ease.
- **Admin Management**: Admins can add new recipes or edit existing ones through a dedicated interface, ensuring the recipe database is always up-to-date and accurate.
- **Responsive Design**: Enjoy a seamless experience on any device with a design that adapts to desktops, tablets, and mobile phones.

## Technologies Used

- **Frontend**: Built with React for a dynamic and responsive user interface.
- **Backend**: Powered by Express.js and MongoDB, providing robust data management and API services.
- **Security**: Passwords are encrypted using bcrypt, and JWTs are used for secure user authentication.
- **State Management**: Utilizes Redux for efficient and centralized state management.

## Installation and Setup

To set up the project locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/sole-e-sapori.git
    cd sole-e-sapori
    ```

2. **Install dependencies**:
    ```bash
    npm install
    cd client
    npm install
    cd ..
    ```

3. **Set up environment variables**: Create a `.env` file in the root directory with the following variables:
    ```
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. **Run the application**:
    ```bash
    npm run dev
    ```

## Project Structure

The project is organized into the following main directories:

- **client**: Contains the React frontend code.
- **server**: Contains the Express.js backend code.
- **models**: Contains MongoDB models.
- **routes**: Contains the API routes.

### Screenshots

#### Login/Signup Screen
![Login/Signup Screen](Img/to/Login.png)
![Login/Signup Screen](Img/to/SignUp.png)

#### Homepage
![Homepage](Img/to/HomePage.png)

#### Admin Management
![Login/Signup Screen](Img/to/ModificaRicetta.png)

## Contributing

We welcome contributions to improve this project. Here are some ways you can contribute:

- **Reporting Bugs**: If you find any bugs, please create an issue with detailed information on how to reproduce the problem.
- **Feature Requests**: If you have ideas for new features, feel free to open an issue to discuss them.
- **Pull Requests**: If you want to contribute code, please fork the repository, create a new branch for your changes, and submit a pull request. Make sure to provide a clear description of what your changes do and any relevant information.
- **Documentation**: Improving the documentation is always helpful. If you see something that can be improved or needs clarification, please open an issue or submit a pull request.

