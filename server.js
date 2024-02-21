import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { weeklyDistribution, InvalidInputException } from './weeklyDistribution.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JavaScript)
app.use(express.static('public'));

// Define a route to handle POST requests
app.post('/submit', (req, res) => {
    const { rawInput } = req.body;
    
    try {
        // Call the weeklyDistribution function with the raw input
        const processedData = weeklyDistribution(rawInput);
        
        res.json(processedData);
    } catch (ex) {
        // Handle any errors
        if(ex instanceof InvalidInputException) {
          console.warn(ex);
          res.status(400).json({ error: ex.message });
        } else {
          console.error('Error processing data:', ex);
          res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});