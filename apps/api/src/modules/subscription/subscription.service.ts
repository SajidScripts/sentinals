import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

/**
 * Subscription Service
 *
 * WHY: Placeholder for Stripe integration. Provides the API surface
 * that the frontend will consume. When Stripe is integrated, only
 * this service needs to change — controllers and frontend remain stable.
 *
 * STRIPE INTEGRATION GUIDE:
 * 1. Install @stripe/stripe-node
 * 2. Replace createCheckoutSession with Stripe Checkout Session creation
 * 3. Add webhook handler for payment events
 * 4. Update user.subscriptionStatus based on webhook events
 */
@Injectable()
export class SubscriptionService {
    private readonly logger = new Logger(SubscriptionService.name);

    constructor(private prisma: PrismaService) { }

    async getSubscription(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                subscriptionStatus: true,
                stripeCustomerId: true,
            },
        });

        return {
            status: user?.subscriptionStatus || 'FREE',
            stripeCustomerId: user?.stripeCustomerId,
            currentPlan: this.getPlanDetails(user?.subscriptionStatus || 'FREE'),
        };
    }

    listPlans() {
        return {
            plans: [
                {
                    id: 'free',
                    name: 'Free',
                    price: 0,
                    currency: 'USD',
                    interval: 'month',
                    features: ['3 Projects', '1,000 Logs/month', 'Email support'],
                },
                {
                    id: 'pro',
                    name: 'Pro',
                    price: 29,
                    currency: 'USD',
                    interval: 'month',
                    features: ['Unlimited Projects', '100,000 Logs/month', 'Priority support', 'API access', 'Custom alerts'],
                },
                {
                    id: 'enterprise',
                    name: 'Enterprise',
                    price: 99,
                    currency: 'USD',
                    interval: 'month',
                    features: ['Unlimited Everything', 'Dedicated support', 'SLA guarantee', 'SSO/SAML', 'Audit logs', 'Custom integrations'],
                },
            ],
        };
    }

    async createCheckoutSession(userId: string, planId: string) {
        this.logger.log(`Checkout session requested by user ${userId} for plan ${planId}`);

        // TODO: Replace with actual Stripe checkout session creation
        // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        // const session = await stripe.checkout.sessions.create({ ... });
        // return { url: session.url };

        return {
            message: 'Stripe integration placeholder',
            planId,
            checkoutUrl: `https://checkout.stripe.com/placeholder/${planId}`,
            note: 'Replace with actual Stripe Checkout Session in production',
        };
    }

    private getPlanDetails(status: string) {
        const plans: Record<string, any> = {
            FREE: { name: 'Free', projectLimit: 3, logLimit: 1000 },
            TRIAL: { name: 'Pro Trial', projectLimit: -1, logLimit: 100000 },
            ACTIVE: { name: 'Pro', projectLimit: -1, logLimit: 100000 },
            PAST_DUE: { name: 'Pro (Past Due)', projectLimit: -1, logLimit: 100000 },
            CANCELLED: { name: 'Free', projectLimit: 3, logLimit: 1000 },
        };
        return plans[status] || plans.FREE;
    }
}
