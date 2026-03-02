'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import api from '@/lib/api';
import { Plus, FolderOpen, MoreVertical, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/v1/projects?limit=50');
            setProjects(data?.data?.data || []);
        } catch {
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteProject = async (id: string) => {
        if (!confirm('Delete this project? This action cannot be undone.')) return;
        try {
            await api.delete(`/v1/projects/${id}`);
            setProjects((prev) => prev.filter((p) => p.id !== id));
            toast.success('Project deleted');
        } catch {
            toast.error('Failed to delete project');
        }
    };

    const filtered = projects.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your monitored projects and entities
                    </p>
                </div>
                <Link
                    href="/dashboard/projects/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Project
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
            </div>

            {/* Projects Grid */}
            {filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-12 text-center">
                    <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">
                        {search ? 'No projects match your search' : 'No projects yet'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((project, i) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                href={`/dashboard/projects/${project.id}`}
                                className="block rounded-xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/20 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${project.status === 'ACTIVE' ? 'bg-emerald-500' : project.status === 'PAUSED' ? 'bg-amber-500' : 'bg-muted-foreground'}`} />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            deleteProject(project.id);
                                        }}
                                        className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                                <h3 className="font-semibold text-sm mb-1">{project.name}</h3>
                                <p className="text-xs text-muted-foreground">
                                    {project._count?.logs || 0} logs · Created {new Date(project.createdAt).toLocaleDateString()}
                                </p>
                                <div className="mt-3 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                                    {project.status}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
