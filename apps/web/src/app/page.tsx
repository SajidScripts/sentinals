import Link from 'next/link';
import { ArrowRight, Shield, Zap, BarChart3, Globe, Lock, Bell, Code, CheckCircle } from 'lucide-react';

/**
 * Marketing Landing Page
 *
 * Server Component — zero client JS for SEO performance.
 * All interactive elements use Link (no client-side routing needed).
 */

const features = [
    {
        icon: Shield,
        title: 'AI-Powered Monitoring',
        description: 'Intelligent anomaly detection that learns your system patterns and alerts before issues become incidents.',
    },
    {
        icon: Zap,
        title: 'Real-Time Alerts',
        description: 'Instant notifications across Slack, email, and webhooks with intelligent severity classification.',
    },
    {
        icon: BarChart3,
        title: 'Deep Analytics',
        description: 'Comprehensive dashboards with trend analysis, forecasting, and root cause identification.',
    },
    {
        icon: Globe,
        title: 'Multi-Region',
        description: 'Monitor infrastructure across regions with unified dashboards and correlated insights.',
    },
    {
        icon: Lock,
        title: 'Enterprise Security',
        description: 'SOC2-ready architecture with encryption at rest, RBAC, and complete audit trails.',
    },
    {
        icon: Bell,
        title: 'Smart Escalation',
        description: 'Configurable escalation policies with on-call schedules and automatic routing.',
    },
];

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for side projects',
        features: ['3 Projects', '1,000 Logs/month', 'Email support', '7-day retention'],
        cta: 'Get Started',
        highlight: false,
    },
    {
        name: 'Pro',
        price: '$29',
        period: '/month',
        description: 'For growing teams',
        features: ['Unlimited Projects', '100K Logs/month', 'Priority support', '90-day retention', 'API access', 'Custom alerts', 'Team collaboration'],
        cta: 'Start Free Trial',
        highlight: true,
    },
    {
        name: 'Enterprise',
        price: '$99',
        period: '/month',
        description: 'For organizations at scale',
        features: ['Unlimited Everything', 'Dedicated support', 'SLA guarantee', '1-year retention', 'SSO/SAML', 'Audit logs', 'Custom integrations', 'On-premise option'],
        cta: 'Contact Sales',
        highlight: false,
    },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* ─── Navigation ─────────────────────────── */}
            <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <Shield className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold">Sentinals</span>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
                            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Docs</a>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:shadow-md"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ─── Hero Section ───────────────────────── */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-8">
                        <Zap className="w-3.5 h-3.5 text-primary" />
                        <span>AI-Powered Monitoring Platform</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.1]">
                        Monitoring that{' '}
                        <span className="gradient-text">thinks ahead</span>
                        {' '}of your systems
                    </h1>

                    <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Sentinals uses AI to detect anomalies before they become incidents.
                        Real-time insights, intelligent alerts, and proactive monitoring
                        for modern infrastructure.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:shadow-xl hover:scale-[1.02]"
                        >
                            Start Free Trial
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="#features"
                            className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            <Code className="w-5 h-5" />
                            View Demo
                        </Link>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            <span>SOC2 Ready</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>99.9% Uptime</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span>Multi-Region</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Features Grid ──────────────────────── */}
            <section id="features" className="py-24 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            Everything you need for{' '}
                            <span className="gradient-text">intelligent monitoring</span>
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                            Built for teams who demand reliability. Every feature designed
                            to reduce noise and surface what matters.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="group relative rounded-xl border border-border/50 bg-card p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Pricing ────────────────────────────── */}
            <section id="pricing" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            Simple, transparent{' '}
                            <span className="gradient-text">pricing</span>
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Start free. Scale when you&apos;re ready.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative rounded-xl border p-8 ${plan.highlight
                                        ? 'border-primary bg-primary/5 shadow-xl scale-[1.02]'
                                        : 'border-border/50 bg-card'
                                    }`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-xl font-bold">{plan.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground">{plan.period}</span>
                                </div>
                                <Link
                                    href="/signup"
                                    className={`mt-6 block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${plan.highlight
                                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                            : 'border border-border hover:bg-muted'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                                <ul className="mt-6 space-y-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-sm">
                                            <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA Section ────────────────────────── */}
            <section className="py-24 bg-muted/30">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                        Ready to monitor{' '}
                        <span className="gradient-text">smarter</span>?
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of teams who trust Sentinals to keep their
                        infrastructure running smoothly.
                    </p>
                    <div className="mt-8">
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:shadow-xl"
                        >
                            Start Your Free Trial
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── Footer ─────────────────────────────── */}
            <footer className="border-t border-border py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-primary-foreground" />
                                </div>
                                <span className="font-bold">Sentinals</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Intelligent monitoring for modern infrastructure.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-3">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Changelog</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Docs</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-3">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-3">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Sentinals. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
