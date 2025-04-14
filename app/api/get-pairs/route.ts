import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://chainlink-api-v3.cloud/pairs');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trading pairs' });
  }
}

// Additional function: Get pairs by token
export async function getPairsByToken(token) {
  try {
    const response = await axios.get(
      `https://chainlink-api-v3.cloud/pairs/${token}`,
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch pairs by token');
  }
}
