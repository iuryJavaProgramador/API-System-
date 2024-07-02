document.addEventListener('DOMContentLoaded', () => {
  const scrapeBtn = document.getElementById('scrapeBtn'); // Get the scrape button element
  const keywordInput = document.getElementById('keyword'); // Get the keyword input element
  const resultsDiv = document.getElementById('results'); // Get the results container element

  scrapeBtn.addEventListener('click', async () => {
    const keyword = keywordInput.value.trim(); // Get the keyword input value and trim any whitespace
    if (!keyword) {
      alert('Please enter a keyword'); // Display an alert if the keyword input is empty
      return;
    }

    try {
      const response = await fetch(`/api/scrape?keyword=${keyword}`); // Fetch data from the /api/scrape endpoint with the provided keyword
      const data = await response.json(); // Parse the JSON response

      resultsDiv.innerHTML = ''; // Clear previous results

      if (data.length === 0) {
        resultsDiv.innerHTML = 'No products found.'; // Display message if no products are found
      } else {
        data.forEach(product => {
          const productDiv = document.createElement('div'); // Create a new div for each product
          productDiv.innerHTML = `
            <h3>${product.title}</h3>
            <p>Rating: ${product.rating}</p>
            <p>Reviews: ${product.reviews}</p>
            <img src="${product.imageURL}" alt="Product Image" style="max-width: 100px;">
            <hr>
          `;
          resultsDiv.appendChild(productDiv); // Append the product information to the results container
        });
      }
    } catch (error) {
      console.error('Error during search:', error); // Log any errors to the console
      resultsDiv.innerHTML = 'Error fetching data.'; // Display an error message in the results container
    }
  });
});