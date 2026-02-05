import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout';
import DashboardPadding from '@/Layouts/DashboardPadding';
import { Head, Link } from '@inertiajs/react';

export default function Homepage() {
    return (
        <AnalyticsDashboardLayout title="Welcome to Spontaine" description="Experience the next generation of AI-driven interactions">
            <DashboardPadding>
                Hi
            </DashboardPadding>
        </AnalyticsDashboardLayout>
    );
}
