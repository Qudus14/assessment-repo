
import mockData from '../data/mock_data.json';
import { normalizeRestaurant } from "./normalize";
import type { RawRestaurant, Restaurant, Transaction } from "../types";


const RESTAURANTS: Restaurant[] = (mockData.restaurants as RawRestaurant[]).map(
  normalizeRestaurant
);

export function fetchRestaurants(filters?: {
  cuisine?: string;
  minRating?: number;
}): Promise<Restaurant[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = RESTAURANTS;
      if (filters?.cuisine) {
        results = results.filter((r) =>
          r.cuisine.toLowerCase().includes(filters.cuisine!.toLowerCase())
        );
      }
      if (filters?.minRating) {
        results = results.filter((r) => r.avgRating >= filters.minRating!);
      }
      resolve(results);
    }, 800);
  });
}

export function toggleFavorite(restaurantId: string): Promise<{ success: boolean }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const failed = Math.random() < 0.2;
      if (failed) reject(new Error('Network error'));
      else resolve({ success: true });
    }, 500);
  });
}

export function fetchTransactions(userId: string): Promise<Transaction[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const history = (mockData.pointsLedger as Transaction[]).filter(
        (tx) => tx.userId === userId
      );
      resolve(history);
    }, 400);
  });
}

export function getPointsBalance(userId: string): number {
  return (mockData.pointsLedger as Transaction[])
    .filter((tx) => tx.userId === userId)
    .reduce((sum, tx) => sum + tx.points, 0);
}

export function redeemPoints(
  userId: string,
  points: number
): Promise<{ pointsRedeemed: number; newBalance: number; voucherCode: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (points % 50 !== 0) {
        reject(new Error('Points must be redeemed in multiples of 50'));
        return;
      }
      const currentBalance = getPointsBalance(userId);
      if (points > currentBalance) {
        reject(new Error('Insufficient balance'));
        return;
      }
      const voucherCode = `BUKA-DISC-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      resolve({
        pointsRedeemed: points,
        newBalance: currentBalance - points,
        voucherCode,
      });
    }, 600);
  });
}