import { useState } from "react";
import { usePointsLedger } from "../hooks/usePointsLedger";

const REDEEM_STEP = 50;

export function VoucherLedger({ userId }: { userId: string }) {
    const { balance, history, loading, redeeming, error, redeem } = usePointsLedger(userId);
    const [redeemAmount, setRedeemAmount] = useState(REDEEM_STEP);
    const [voucherCode, setVoucherCode] = useState<string | null>(null);

    const handleRedeem = async () => {
        setVoucherCode(null);
        try {
            const result = await redeem(redeemAmount);
            setVoucherCode(result.voucherCode);
        } catch { } // Error handled by hook
    };

    const canRedeem = !redeeming && redeemAmount <= balance && redeemAmount % REDEEM_STEP === 0 && redeemAmount > 0;

    return (
        <aside className="w-full bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3 mb-4">
                Points & Vouchers
            </h2>

            {loading ? (
                <div className="animate-pulse h-10 bg-gray-100 rounded-lg w-1/2 mb-2" />
            ) : (
                <div className="flex items-baseline gap-1 mb-2">
                    <p className="text-4xl font-black text-orange-600 tracking-tight">{balance}</p>
                    <span className="text-sm font-medium text-gray-500">pts</span>
                </div>
            )}

            <div className="mt-5 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Redeem Points
                </label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        step={REDEEM_STEP}
                        min={REDEEM_STEP}
                        value={redeemAmount}
                        onChange={(e) => setRedeemAmount(Number(e.target.value))}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none bg-white transition-all"
                    />
                    <button
                        onClick={handleRedeem}
                        disabled={!canRedeem}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm px-4 py-2 rounded-lg disabled:opacity-50 disabled:hover:bg-orange-600 transition-all active:scale-95 shrink-0"
                    >
                        {redeeming ? 'Wait...' : 'Redeem'}
                    </button>
                </div>

                {/* Feedback Messages */}
                {redeemAmount % REDEEM_STEP !== 0 && (
                    <p className="text-xs font-medium text-red-500 mt-2 flex items-center gap-1">
                        <span>⚠️</span> Must be a multiple of {REDEEM_STEP}
                    </p>
                )}
                {error && (
                    <p className="text-xs font-medium text-red-500 mt-2 bg-red-50 p-2 rounded-md">
                        {error}
                    </p>
                )}
                {voucherCode && (
                    <div className="mt-3 bg-green-50 border border-green-200 p-3 rounded-lg text-center">
                        <p className="text-xs text-green-700 font-medium mb-1">Success! Your code:</p>
                        <p className="text-sm font-mono font-bold text-green-900 bg-white border border-green-100 py-1 rounded">{voucherCode}</p>
                    </div>
                )}
            </div>

            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3">
                Recent Activity
            </h3>

            <ul className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <li key={i} className="animate-pulse h-10 bg-gray-50 rounded-lg" />
                    ))
                ) : history.length === 0 ? (
                    <li className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">No activity yet.</li>
                ) : (
                    history.map((tx) => (
                        <li key={tx.id} className="flex justify-between items-center text-sm py-2 border-b border-gray-50 last:border-0">
                            <span className="capitalize font-medium text-gray-700">{tx.action}</span>
                            <span className={`font-bold px-2 py-1 rounded-md ${tx.points >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {tx.points >= 0 ? '+' : ''}{tx.points}
                            </span>
                        </li>
                    ))
                )}
            </ul>
        </aside>
    );
}