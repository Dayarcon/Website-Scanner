# Website Scanner

This project is a simple web application that scans a given website and retrieves information such as server details and IP address.

## Features

- Input a URL to scan
- Retrieve server information and IP address
- Display results in a user-friendly format

## Project Structure

```
website-scanner
├── src
│   ├── index.js        # Entry point of the application
│   ├── scanner.js      # Contains the Scanner class for scanning websites
│   └── utils
│       └── helpers.js  # Utility functions for HTTP requests and response parsing
├── public
│   ├── index.html      # HTML structure of the web application
│   └── styles.css      # CSS styles for the web application
├── package.json        # npm configuration file
├── .gitignore          # Files and directories to be ignored by Git
└── README.md           # Documentation for the project
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/website-scanner.git
   ```
2. Navigate to the project directory:
   ```
   cd website-scanner
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```
2. Open your web browser and go to `http://localhost:3000`.
3. Enter the URL you want to scan and submit the form to view the results.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes. 

## License

This project is licensed under the MIT License.