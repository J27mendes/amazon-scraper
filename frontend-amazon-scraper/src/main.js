import "./style.css";

document.getElementById("searchButton").addEventListener("click", async () => {
  const keyword = document.getElementById("keyword").value;
  if (!keyword) {
    alert("Por favor, insira uma palavra-chave!");
    return;
  }

  try {
    // Make the request to the backend
    const response = await fetch(
      `http://localhost:3000/api/scrape?keyword=${keyword}`
    );
    const products = await response.json();

    // Displays the products
    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = "";

    //adds the items found on the screens
    if (products.length === 0) {
      productsContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
    } else {
      products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
          <h3>${product.title}</h3>
          <p>Avaliação: ${product.rating}</p>
          <p>Reviews: ${product.numReviews}</p>
          <img src="${product.imageUrl}" alt="${product.title}" />
        `;
        productsContainer.appendChild(productDiv);
      });

      if (products.length > 0) {
        // Creating a back button
        const backButton = document.createElement("button");
        backButton.innerText = "Voltar para busca";
        backButton.classList.add("back-button");

        // When the button is clicked, the page returns to its initial state
        backButton.addEventListener("click", () => {
          productsContainer.innerHTML = "";
          document.getElementById("keyword").value = "";
        });

        // Add the button AFTER all products
        productsContainer.appendChild(backButton);
      }
    }
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }
});
