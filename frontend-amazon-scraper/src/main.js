import "./style.css";

document.getElementById("searchButton").addEventListener("click", async () => {
  const keyword = document.getElementById("keyword").value.trim();
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";

  if (!keyword) {
    productsContainer.innerHTML = `<p class="error-message">Insira uma palavra antes de buscar.</p>`;
    return;
  }

  try {
    // Make the request to the backend
    const response = await fetch(
      `http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`
    );

    // HTTP error handling
    if (!response.ok) {
      if (response.status === 404) {
        productsContainer.innerHTML = `<p class="error-message">Nenhum produto encontrado.</p>`;
      } else {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      return;
    }

    let products;
    try {
      products = await response.json();
    } catch (jsonError) {
      throw new Error("Resposta inválida do servidor.");
    }

    // Validation: Ensures that products is a valid array
    if (!Array.isArray(products)) {
      throw new Error("Dados inválidos recebidos.");
    }

    // Check if products were found
    if (products.length === 0) {
      productsContainer.innerHTML = `<p class="error-message">Nenhum produto encontrado.</p>`;
      return;
    }

    // Displays the products on the screen
    products.forEach((product) => {
      if (!product.title || !product.imageUrl) return;

      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
        <h3>${product.title}</h3>
        <p>Avaliação: ${product.rating || "Sem avaliação"}</p>
        <p>Reviews: ${product.numReviews || "0"}</p>
        <img src="${product.imageUrl}" alt="${product.title}" />
      `;
      productsContainer.appendChild(productDiv);
    });

    // Add back button if there are products
    const backButton = document.createElement("button");
    backButton.innerText = "Voltar para busca";
    backButton.classList.add("back-button");
    backButton.addEventListener("click", () => {
      productsContainer.innerHTML = "";
      document.getElementById("keyword").value = "";
    });
    productsContainer.appendChild(backButton);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    productsContainer.innerHTML = `<p class="error">Erro ao buscar produtos: ${error.message}</p>`;
  }
});
