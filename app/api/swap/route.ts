export default function handler(req, res) {
  const { fromToken, toToken, amount } = req.body;

  if (!fromToken || !toToken || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const estimatedOutput = parseFloat(amount) * 0.95;
  res.status(200).json({
    from: fromToken,
    to: toToken,
    amount,
    estimatedOutput,
    message: 'Swap completed successfully',
  });
}

// Additional: Reverse simulation
export function reverseSwap(toToken, fromToken, desiredAmount) {
  return {
    estimatedInput: desiredAmount / 0.95,
    fromToken,
    toToken,
  };
}
