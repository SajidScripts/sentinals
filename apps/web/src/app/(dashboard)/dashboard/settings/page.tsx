'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useState } from 'react';
import { User, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function SettingsPage() {
    const user = useAuthStore((s) => s.user);
    const setUser = useAuthStore((s) => s.setUser);
    const [name, setName] = useState(user?.name || '');
    const [saving, setSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await api.patch('/v1/users/me', { name });
            setUser({ ...user!, name: data?.data?.name || name });
            toast.success('Profile updated');
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account preferences</p>
            </div>

            {/* Profile */}
            <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile
                </h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Email</label>
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted text-sm text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            {user?.email}
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            {/* Account Info */}
            <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Account
                </h2>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Role</span>
                        <span className="font-medium inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs">
                            {user?.role}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Subscription</span>
                        <span className="font-medium">{user?.subscriptionStatus || 'FREE'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">User ID</span>
                        <span className="font-mono text-xs text-muted-foreground">{user?.id}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
