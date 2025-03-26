import axios, { AxiosResponse } from "axios";
import express, { Request, Response } from "express";
import { JSDOM } from "jsdom";
import cors from "cors";

const app = express();

// Configure CORS (Cross-Origin Resource Sharing) on ​​an Express server
const corsOrigin = process.env.CORS_ORIGIN;
app.use(cors({ origin: corsOrigin }));

// Typing the Product object
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
    const amazonUrl = process.env.AMAZON_URL;
    const url = `${amazonUrl}${encodeURIComponent(keyword)}`;

    // Making the GET request with the 'User-Agent' header to avoid blocking
    const userAgent = process.env.USER_AGENT;
    const response: AxiosResponse = await axios.get(url, {
      headers: {
        userAgent,
      },
    });

    // Check if the response status is OK (200)
    if (response.status !== 200) {
      throw new Error(`Erro ao acessar a Amazon. Status: ${response.status}`);
    }

    // Loading the response HTML with JSDOM
    const dom = new JSDOM(response.data);
    const products: Product[] = [];

    // Getting all product listings on the page
    dom.window.document
      .querySelectorAll(".s-main-slot .s-result-item")
      .forEach((item) => {
        const title =
          item.querySelector("h2.a-size-base-plus span")?.textContent ||
          "Sem título";
        const rating =
          item.querySelector(".a-icon-alt")?.textContent || "Sem avaliação";
        const numReviews =
          item.querySelector(".s-link-style .a-size-base")?.textContent || "0";
        const imageUrl =
          item.querySelector(".s-image")?.getAttribute("src") || "";

        if (title && title !== "Sem título" && imageUrl) {
          products.push({
            title,
            rating: rating || "Sem avaliação",
            numReviews: numReviews || "0",
            imageUrl,
          });
        }
      });

    return products;
  } catch (error) {
    console.error("Erro ao tentar fazer o scraping da Amazon:", error);
    return [];
  }
};

// Route to start scraping
app.get("/api/scrape", async (req: Request, res: Response) => {
  const keyword = req.query.keyword as string;

  // Checking if the keyword was passed and its length
  if (!keyword || keyword.length < 2) {
    return res
      .status(400)
      .json({ error: "A palavra-chave deve ter pelo menos 2 caracteres!" });
  }

  try {
    // Getting the products with the scrapeAmazon function
    const products = await scrapeAmazon(keyword);

    // Returning the products as JSON
    if (products.length === 0) {
      return res.status(404).json({ message: "Nenhum produto encontrado." });
    }

    res.json(products);
  } catch (error) {
    // Returning a server error if something goes wrong
    res.status(500).json({ error: "Erro ao buscar os produtos." });
  }
});

export default app;
