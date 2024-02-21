import express from "express";
import axios from 'axios'; // Import Axios
import bodyParser from "body-parser";
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(express.json());

app.use(express.static("public")); // Serve static files

app.use(bodyParser.urlencoded({ extended: true }));

// Serve the signup form at the root route
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + "/signup.html");
});

// Handle the form submission
app.post('/', async (req, res) => {
    const { email, firstName, lastName } = req.body; // Assuming your form has fields named email, firstName, and lastName

    // Mailchimp API credentials
    const apiKey = process.env.API_KEY;
    const audienceId = '892ca8ca7e';
    console.log(process.env)
    const serverPrefix = apiKey.split('-')[1]; // Extract server prefix from API key
    console.log(serverPrefix)

    // Mailchimp API URL
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

    // Subscriber data  
    const data = {
        email_address: email,
        status: 'subscribed', // Use 'pending' to send a confirmation email
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
        },
    };

    try {
        // Make API request
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            }
        });
        res.sendFile(process.cwd() + "/success.html");
    } catch (error) {
        console.log(error);
        res.sendFile(process.cwd() + "/failure.html");
    }
});

// const PORT = 3000;
app.listen(4000, () => {
    console.log(`Server is running on port 4000`);
});
