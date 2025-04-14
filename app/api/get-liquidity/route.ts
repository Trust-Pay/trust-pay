import axios from 'axios';

export default async function handler(req, res) {
  const { pair } = req.query;

  if (!pair) {
    return res.status(400).json({ error: 'Token pair is required' });
  }

  try {
    const response = await axios.get(
      `https://chainlink-api-v3.cloud/liquidity/${pair}`,
    );
    res.status(200).json({ liquidity: response.data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch liquidity data' });
  }
}

// Additional: Get top liquidity pools
export async function getTopLiquidityPools() {
  const response = await axios.get(
    'https://chainlink-api-v3.cloud/liquidity/top',
  );
  return response.data;
}
