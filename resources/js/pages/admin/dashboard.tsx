import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, FolderTree, Layers, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { Product } from '@/types';

type DashboardProps = {
    stats: {
        totalCategories: number;
        totalSubcategories: number;
        totalProducts: number;
    };
    recentProducts: Product[];
};

export default function Dashboard({ stats, recentProducts }: DashboardProps) {
    const statCards = [
        {
            title: 'Total Categories',
            count: stats.totalCategories,
            icon: FolderTree,
            href: '/admin/categories',
            linkText: 'Manage Categories',
            description: 'Primary product divisions',
        },
        {
            title: 'Total Subcategories',
            count: stats.totalSubcategories,
            icon: Layers,
            href: '/admin/subcategories',
            linkText: 'Manage Subcategories',
            description: 'Classifications under categories',
        },
        {
            title: 'Total Products',
            count: stats.totalProducts,
            icon: Package,
            href: '/admin/products',
            linkText: 'Manage Products',
            description: 'Active items in catalog',
        },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-6">
                {/* Header Welcome Bar */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Dashboard Overview
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Welcome back! Monitor your store inventory and
                            manage catalog items.
                        </p>
                    </div>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Card
                                key={card.title}
                                className="overflow-hidden transition-all hover:border-primary/40"
                            >
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {card.title}
                                    </CardTitle>
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-extrabold tracking-tight">
                                        {card.count}
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {card.description}
                                    </p>
                                    <div className="mt-4 border-t pt-3">
                                        <Link
                                            href={card.href}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition hover:underline"
                                        >
                                            <span>{card.linkText}</span>
                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Recent Products Table */}
                <Card>
                    <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold">
                                Recently Added Products
                            </CardTitle>
                            <CardDescription>
                                Latest additions to your store catalog
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentProducts.length === 0 ? (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                                No products found. Click "Manage Products" to
                                add your first product.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b bg-muted/40 text-xs text-muted-foreground uppercase">
                                        <tr>
                                            <th className="px-4 py-3">
                                                Product
                                            </th>
                                            <th className="px-4 py-3">
                                                Category
                                            </th>
                                            <th className="px-4 py-3">
                                                Subcategory
                                            </th>
                                            <th className="px-4 py-3">Price</th>
                                            <th className="px-4 py-3 text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {recentProducts.map((product) => {
                                            const oldPrice =
                                                product.old_price !== null
                                                    ? Number(product.old_price)
                                                    : null;
                                            const newPrice = Number(
                                                product.new_price,
                                            );
                                            const hasDiscount =
                                                oldPrice !== null &&
                                                oldPrice > newPrice;

                                            return (
                                                <tr
                                                    key={product.id}
                                                    className="transition-colors hover:bg-muted/30"
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={
                                                                    product.image_url
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="h-10 w-10 shrink-0 rounded-lg border object-cover"
                                                            />
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-foreground">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </span>
                                                                <span className="font-mono text-xs text-muted-foreground">
                                                                    {product.path ??
                                                                        `/${product.slug}`}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {product.category
                                                                ?.name ?? '—'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {product.subcategory
                                                                ?.name ?? '—'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span className="font-semibold text-foreground">
                                                                $
                                                                {newPrice.toFixed(
                                                                    2,
                                                                )}
                                                            </span>
                                                            {hasDiscount &&
                                                                oldPrice !==
                                                                    null && (
                                                                    <span className="text-xs text-muted-foreground line-through">
                                                                        $
                                                                        {oldPrice.toFixed(
                                                                            2,
                                                                        )}
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Button
                                                            asChild
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-xs"
                                                        >
                                                            <Link
                                                                href={
                                                                    product.path ??
                                                                    `/products/${product.slug}`
                                                                }
                                                                target="_blank"
                                                            >
                                                                View on Live
                                                                Store
                                                            </Link>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '/admin',
        },
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
    ],
};
