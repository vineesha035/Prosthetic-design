const dotenv = require("dotenv");
dotenv.config({ path: require("path").resolve(__dirname, ".env") });
console.log("API KEY:", process.env.ARCADE_API_KEY);
console.log("EMAIL:", process.env.SENDER_EMAIL);