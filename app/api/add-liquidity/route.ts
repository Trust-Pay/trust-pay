export default function handler(req, res) {
  const { tokenA, tokenB, amountA, amountB } = req.body;

  if (!tokenA || !tokenB || !amountA || !amountB) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  res.status(200).json({
    pool: `${tokenA}-${tokenB}`,
    amountAdded: { [tokenA]: amountA, [tokenB]: amountB },
    message: 'Liquidity added successfully',
  });
}

// Additional: Remove liquidity simulation
export function removeLiquidity(tokenA, tokenB, percent) {
  return {
    tokenA,
    tokenB,
    amountRemoved: {
      [tokenA]: `-${percent}%`,
      [tokenB]: `-${percent}%`,
    },
  };
}
