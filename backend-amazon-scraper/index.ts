import axios from "axios";
import express, { type Request, type Response } from "express";
import { JSDOM } from "jsdom";

const app = express();
const port = 3000;

interface Product {
  title: string;
  rating: string;
  numReviews: string;
  imageUrl: string;
}

// Function to extract information from Amazon
const scrapeAmazon = async (keyword: string): Promise<Product[]> => {
  try {
    // URL for Amazon search with keyword
    const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;

    // Making the GET request with the 'User-Agent' header to avoid blocking
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      },
    });

    // Loading the response HTML with JSDOM
    const dom = new JSDOM(response.data);
    const products: Product[] = [];

    // Getting all product listings on the page
    dom.window.document
      .querySelectorAll(".s-main-slot .s-result-item")
      .forEach((item) => {
        const title =
          item.querySelector("h2 .a-link-normal")?.textContent || "Sem título";
        const rating =
          item.querySelector(".a-icon-alt")?.textContent || "Sem avaliação";
        const numReviews =
          item.querySelector(".s-link-style .a-size-base")?.textContent || "0";
        const imageUrl =
          item.querySelector(".s-image")?.getAttribute("src") || "";

        products.push({
          title,
          rating,
          numReviews,
          imageUrl,
        });
      });

    return products;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Route to start scraping
app.get("/api/scrape", async (req: Request, res: Response) => {
  const keyword = req.query.keyword as string;

  // Getting the products with the scrapeAmazon function
  const products = await scrapeAmazon(keyword);

  // Returning the products as JSON
  res.json(products);
});

// Iniciando o servidor na porta 3000
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
