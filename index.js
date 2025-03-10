const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(express.json());

// DeepSeek API Key (replace with your actual key)
const DEEPSEEK_API_KEY = 'sk-1a2535e4ec0e4daa8c952d34a1e55fb8'; // Use your actual DeepSeek API key

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the BotSpace and DeepSeek integration server!');
});

// Webhook route to handle incoming messages from BotSpace
app.post('/webhook', async (req, res) => {
  const userMessage = req.body.message;  // Message from customer or agent
  const isAgent = req.body.is_agent || false;  // Check if it's an agent's message

  try {
    // Log the incoming message and sender type (agent or customer)
    console.log(`Message received: ${userMessage} from ${isAgent ? 'Agent' : 'Customer'}`);

    // Make a request to DeepSeek API with the user's message
    const responseMessage = await axios.post('https://api.deepsseek.com/v1/chat', {
      query: userMessage
    }, {
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,  // Include the DeepSeek API key in the header
        'Content-Type': 'application/json'
      }
    });

    // Send the response from DeepSeek back to BotSpace
    res.json({
      reply: responseMessage.data.response  // The response from DeepSeek
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to connect to DeepSeek' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
