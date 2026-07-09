import { useEffect, useState } from 'react';
import type { Transaction } from '../types';
import { fetchTransactions, getPointsBalance, redeemPoints } from '../services/mock-api';

export function usePointsLedger(userId: string) {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchTransactions(userId).then((tx) => {
      setHistory(tx);
      setBalance(getPointsBalance(userId));
      setLoading(false);
    });
  }, [userId]);

  const redeem = async (points: number) => {
    setError(null);

    // Optimistic update
    const previousBalance = balance;
    const previousHistory = history;
    const optimisticTx: Transaction = {
      id: `pending-${Date.now()}`,
      userId,
      action: 'redeem',
      points: -points,
      createdAt: new Date().toISOString(),
    };
    setBalance(previousBalance - points);
    setHistory([optimisticTx, ...previousHistory]);
    setRedeeming(true);

    try {
      const result = await redeemPoints(userId, points);
      // Reconcile optimistic entry with the real voucher code / confirmed values
      setHistory((curr) =>
        curr.map((tx) => (tx.id === optimisticTx.id ? { ...tx, id: `tx-${result.voucherCode}` } : tx))
      );
      setBalance(result.newBalance);
      return result;
    } catch (err) {
      // Rollback on failure
      setBalance(previousBalance);
      setHistory(previousHistory);
      setError(err instanceof Error ? err.message : 'Redemption failed');
      throw err;
    } finally {
      setRedeeming(false);
    }
  };

  return { balance, history, loading, redeeming, error, redeem };
}