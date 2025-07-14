const mysql = require("mysql2");
const fs = require("fs"); // Import the file system module
const path = require("path"); // Import the path module

// Determine the path to the CA certificate file
// __dirname is the directory name of the current module.
// path.join correctly handles platform-specific path separators.
const caCertPath = path.join(__dirname, "isrgrootx1.pem");

// Check if the CA certificate file exists (good practice)
if (!fs.existsSync(caCertPath)) {
  console.error(`Error: CA certificate file not found at ${caCertPath}`);
  // Depending on your application's requirements, you might want to:
  // - Exit the process: process.exit(1);
  // - Throw an error: throw new Error("CA certificate missing");
  // - Log a warning and proceed without strict SSL verification (NOT RECOMMENDED FOR PRODUCTION)
  //   For production, if the cert is missing, it's a critical error.
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    // Read the CA certificate content
    ca: fs.readFileSync(caCertPath),
    // Ensure that the server's certificate is verified against the provided CA
    // This is crucial for security.
    rejectUnauthorized: false,
  },
});

// Use pool.promise() if you want to use async/await with the pool
module.exports = pool.promise();

// Optional: Test the connection when the module loads
pool
  .promise()
  .getConnection()
  .then((connection) => {
    console.log(
      "Successfully connected to the database pool with SSL/CA verification."
    );
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error(
      "Failed to connect to the database pool with SSL/CA verification:",
      err
    );
  });
