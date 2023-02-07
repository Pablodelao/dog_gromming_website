const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

// Import the environment variables from the .env file
dotenv.config();

// Create an instance of the express app
const app = express();

// Use express.json() middleware to parse JSON bodies
app.use(express.json());

// Use express.urlencoded() middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Use EJS as the view engine
app.set('view engine', 'ejs');

// Use cors middleware to handle Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Set the port for the server to listen on
const port = process.env.PORT || 5000;

// Connect to the MongoDB database
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
useNewUrlParser: true,
useUnifiedTopology: true
});

// Create a Mongoose schema for service requests
const serviceRequestSchema = new mongoose.Schema({
name: { type: String, required: true },
phone: { type: String, required: true },
email: { type: String, required: true },
date: { type: Date, required: true },
service: { type: String, required: true },
time: { type: String, required: true },
notes: { type: String, required: true }
});

// Create a Mongoose model for service requests
const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);

// Endpoint to handle service requests
app.post("/servicerequest", async (req, res) => {
try {
// Create a new service request from the incoming data
const serviceRequest = new ServiceRequest({
name: req.body.name,
phone: req.body.phone,
email: req.body.email,
date: req.body.date,
service: req.body.service,
time: req.body.time,
notes: req.body.notes
});
// Save the service request to the database
await serviceRequest.save();
console.log(req.body)
// Redirect to the home page
res.redirect('/');
} catch (error) {
    // Log any errors that occur
    console.error(error);

// Send a server error response
res.status(500).json({ message: "Server error" });
}
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Endpoint to serve the home page
app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/admin', async (req, res) => {
    // Find all service requests in the database, sorted by date and time
    const serviceRequests = await ServiceRequest.find().sort({ date: 1, time: 1 });
  
    // Render the admin page and pass the service requests as a variable
    res.render('admin', { serviceRequests });
  });

// Start the server
app.listen(port, () => {
console.log(`Server running on port ${port}`);
});