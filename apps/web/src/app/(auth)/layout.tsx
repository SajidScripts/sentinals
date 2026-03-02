import type { Metadata } from 'next';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Sign In',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex">
            {/* Left panel — branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center p-12">
                <div className="max-w-md">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                            <Shield className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <span className="text-3xl font-bold">Sentinals</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">
                        Intelligent monitoring for modern infrastructure
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        AI-powered anomaly detection, real-time alerts, and deep analytics.
                        Keep your systems running smoothly with proactive monitoring.
                    </p>
                    <div className="mt-8 space-y-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-bold">1</span>
                            </div>
                            <span>Create your account in seconds</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-bold">2</span>
                            </div>
                            <span>Connect your infrastructure</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-bold">3</span>
                            </div>
                            <span>Get intelligent insights instantly</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}
