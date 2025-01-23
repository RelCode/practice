# Node Server with MySQL2 Integration

This project is a Node.js server that acts as an API endpoint. It includes the `mysql2` package for database integration, allowing for data persistence. The server features a self-updating database system, where tables have a version number suffix. On each server start, a script checks for new table versions and updates the database accordingly.

## Features

- Node.js server
- API endpoint
- MySQL2 integration
- Self-updating database tables

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/RelCode/practice.git
    ```
2. Navigate to the project directory:
    ```sh
    cd node > backend_db
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Usage

1. Start the server:
    ```sh
    npm start
    ```
2. The server will automatically check for database updates and apply them if necessary.

## Database Configuration

Ensure you have a MySQL database set up and update the configuration in `config.js` with your database credentials.

## Scripts

- `update-db.js`: Script to check and apply database updates.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.