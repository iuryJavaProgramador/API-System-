const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration for the /api/scrape endpoint
app.get('/api/scrape', async (req, res) => {
  try {
    // Check if the query parameter ?keyword is provided
    const keyword = req.query.keyword;
    if (!keyword) {
      return res.status(400).json({ error: 'Missing keyword parameter' });
    }

    // Amazon search URL with the provided keyword
    const url = `https://www.amazon.com/s?k=${keyword}`;
    const response = await axios.get(url);

    // Create a new JSDOM object with the HTML content from the response
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Array to store product details
    const products = [];

    // Iterate over each search result item on the page
    document.querySelectorAll('.s-result-item').forEach(item => {
      // Extract product title
      const titleElement = item.querySelector('h2 a');
      const title = titleElement ? titleElement.textContent.trim() : 'N/A';

      // Extract product rating
      const ratingElement = item.querySelector('.a-icon-star .a-icon-alt');
      const rating = ratingElement ? parseFloat(ratingElement.textContent.split(' ')[0]) : 0;

      // Extract number of reviews
      const reviewsElement = item.querySelector('.a-size-base');
      const reviews = reviewsElement ? parseInt(reviewsElement.textContent.replace(/[^0-9]/g, '')) : 0;

      // Extract product image URL
      const imageElement = item.querySelector('.s-image');
      const imageURL = imageElement ? imageElement.getAttribute('src') : '';

      // Add product details to the array
      products.push({ title, rating, reviews, imageURL });
    });

    // Return product details in JSON format
    res.json(products);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});