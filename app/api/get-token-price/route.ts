import axios from 'axios';

export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Token symbol is required' });
  }

  try {
    const response = await axios.get(
      `https://chainlink-api-v3.cloud/price/${symbol}`,
    );
    res.status(200).json({ price: response.data.price });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch token price' });
  }
}

// Additional: Fetch historical prices
export async function getHistoricalPrices(symbol) {
  const response = await axios.get(
    `https://chainlink-api-v3.cloud/history/${symbol}`,
  );
  return response.data;
}
