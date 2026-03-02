'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BillingPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [plansRes, subRes] = await Promise.all([
                    api.get('/v1/subscriptions/plans'),
                    api.get('/v1/subscriptions'),
                ]);
                setPlans(plansRes.data?.data?.plans || []);
                setSubscription(subRes.data?.data || null);
            } catch {
                setPlans([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCheckout = async (planId: string) => {
        try {
            const { data } = await api.post('/v1/subscriptions/checkout', { planId });
            toast.info(data?.data?.message || 'Checkout session created');
        } catch {
            toast.error('Failed to create checkout session');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Billing & Subscription</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your subscription plan
                </p>
            </div>

            {/* Current Plan */}
            {subscription && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold">Current Plan</h2>
                    </div>
                    <p className="text-2xl font-bold">{subscription.currentPlan?.name || 'Free'}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Status: <span className="font-medium text-foreground">{subscription.status}</span>
                    </p>
                </div>
            )}

            {/* Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan: any) => (
                    <div
                        key={plan.id}
                        className={`rounded-xl border p-6 ${plan.id === 'pro' ? 'border-primary shadow-lg' : 'border-border'
                            }`}
                    >
                        {plan.id === 'pro' && (
                            <div className="text-xs font-semibold text-primary mb-3">MOST POPULAR</div>
                        )}
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-3xl font-bold">${plan.price}</span>
                            <span className="text-muted-foreground">/{plan.interval}</span>
                        </div>
                        <button
                            onClick={() => handleCheckout(plan.id)}
                            className={`w-full mt-4 rounded-lg py-2 text-sm font-semibold transition-colors ${plan.id === 'pro'
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                    : 'border border-border hover:bg-muted'
                                }`}
                        >
                            {plan.price === 0 ? 'Current Plan' : 'Upgrade'}
                        </button>
                        <ul className="mt-4 space-y-2">
                            {plan.features.map((f: string) => (
                                <li key={f} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
