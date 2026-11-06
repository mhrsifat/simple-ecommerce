import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    FilterX,
    Flame,
    Headphones,
    Layers,
    ShieldCheck,
    Truck,
    Zap,
} from 'lucide-react';
import ProductCard from '@/components/product-card';
import ShopLayout from '@/layouts/shop-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Category, Product, Subcategory } from '@/types';

type ShopIndexProps = {
    categories: Category[];
    subcategories: Subcategory[];
    latestProducts?: Product[];
    popularProducts?: Product[];
    featuredCategories?: Category[];
    filters: {
        search: string | null;
        category: string | null;
        subcategory: string | null;
    };
};

export default function ShopIndex({
    categories,
    subcategories,
    latestProducts = [],
    popularProducts = [],
    featuredCategories = [],
    filters,
}: ShopIndexProps) {
    const isHomePage = !filters.category && !filters.search;

    const handleReset = () => {
        router.get(
            '/',
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    // Calculate total visible products for catalog browsing
    const totalVisibleProducts = subcategories.reduce(
        (acc, subcat) => acc + (subcat.products?.length ?? 0),
        0,
    );

    return (
        <ShopLayout>
            <Head title="Online — Bangla Puzzle Mart" />

            <div className="flex flex-col gap-14">
                {/* 1. Hero Showcase Banner */}
                <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-6 sm:p-12">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs backdrop-blur">
                            <span>
                                Bangladesh's Trusted E-Commerce Platform for
                                Electronics, Fashion, and Home Essentials
                            </span>
                        </div>

                        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                            Discover Superior Products for Every Lifestyle
                        </h1>
                        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
                            Browse authentic electronics, modern fashion
                            apparel, and home essentials with verified quality
                            and nationwide shipping.
                        </p>
                    </div>
                </div>

                {/* 2. Industry Standard Homepage Sections (When not actively filtering) */}
                {isHomePage ? (
                    <div className="flex flex-col gap-16">
                        {/* Trust Proposition Bar */}
                        <div className="grid grid-cols-2 gap-4 rounded-2xl border bg-card/60 p-5 shadow-xs sm:grid-cols-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold tracking-wider uppercase">
                                        Fast Shipping
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        Orders over $50
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold tracking-wider uppercase">
                                        100% Genuine
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        Verified authenticity
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Flame className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold tracking-wider uppercase">
                                        Hot Deals
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        Direct discounts
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Headphones className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold tracking-wider uppercase">
                                        24/7 Support
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        Always ready to help
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Shop by Category Grid */}
                        <section className="flex flex-col gap-6">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        Shop by Category
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Explore our departments with authentic
                                        products
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/categories/${cat.slug}`}
                                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                                                    <Layers className="h-5 w-5" />
                                                </div>
                                                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                                                    {cat.products_count ?? 0}{' '}
                                                    items
                                                </span>
                                            </div>

                                            <h3 className="mt-4 text-lg font-bold tracking-tight transition group-hover:text-primary">
                                                {cat.name}
                                            </h3>

                                            {cat.subcategories &&
                                                cat.subcategories.length >
                                                    0 && (
                                                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                                        {cat.subcategories
                                                            .map((s) => s.name)
                                                            .join(', ')}
                                                    </p>
                                                )}
                                        </div>

                                        <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-primary">
                                            <span>View Products</span>
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* Most Popular / Best Deals Section */}
                        {popularProducts.length > 0 && (
                            <section className="flex flex-col gap-6">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                                            <Flame className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold tracking-tight">
                                                Most Popular & Hot Deals
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                Customer favorites and
                                                limited-time discounts
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {popularProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Latest Arrivals Section */}
                        {latestProducts.length > 0 && (
                            <section className="flex flex-col gap-6">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                            <Zap className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold tracking-tight">
                                                Latest Arrivals
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                Fresh additions just added to
                                                our catalog
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {latestProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Products by Category Showcases */}
                        {featuredCategories.map((cat) => {
                            const catProducts = cat.products ?? [];
                            if (catProducts.length === 0) return null;

                            return (
                                <section
                                    key={cat.id}
                                    className="flex flex-col gap-6"
                                >
                                    <div className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold tracking-tight">
                                                {cat.name}
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                Featured picks in {cat.name}
                                            </p>
                                        </div>

                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="gap-1.5 self-start text-xs sm:self-auto"
                                        >
                                            <Link
                                                href={`/categories/${cat.slug}`}
                                            >
                                                <span>
                                                    View All in {cat.name}
                                                </span>
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {catProducts.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                            />
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                ) : (
                    /* 3. Catalog Browse View (When Category or Search Filter is Active) */
                    <div>
                        {totalVisibleProducts === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                    <FilterX className="h-7 w-7" />
                                </div>
                                <h2 className="mt-4 text-lg font-bold tracking-tight">
                                    No products found
                                </h2>
                                <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
                                    We couldn't find any items matching your
                                    current search or category filter. Try
                                    clearing filters to see all products.
                                </p>
                                <Button
                                    onClick={handleReset}
                                    variant="outline"
                                    className="mt-5 gap-2"
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-12">
                                {subcategories.map((subcategory) => {
                                    const products = subcategory.products ?? [];
                                    if (products.length === 0) return null;

                                    return (
                                        <section
                                            key={subcategory.id}
                                            id={subcategory.slug}
                                            className="flex scroll-mt-20 flex-col gap-5 border-b pb-12 last:border-b-0 last:pb-0"
                                        >
                                            {/* Subcategory Section Header */}
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                        <Layers className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            {subcategory.category && (
                                                                <Link
                                                                    href={`/categories/${subcategory.category.slug}`}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs transition hover:bg-muted"
                                                                    >
                                                                        {
                                                                            subcategory
                                                                                .category
                                                                                .name
                                                                        }
                                                                    </Badge>
                                                                </Link>
                                                            )}
                                                            <span className="text-muted-foreground">
                                                                &rarr;
                                                            </span>
                                                            <Link
                                                                href={
                                                                    subcategory.category
                                                                        ? `/categories/${subcategory.category.slug}/${subcategory.slug}`
                                                                        : `/categories/${subcategory.slug}`
                                                                }
                                                                className="group/title cursor-pointer text-left"
                                                            >
                                                                <h2 className="text-xl font-bold tracking-tight text-foreground transition group-hover/title:text-primary">
                                                                    {
                                                                        subcategory.name
                                                                    }
                                                                </h2>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>

                                                <span className="self-start text-xs font-semibold text-muted-foreground sm:self-auto">
                                                    {products.length}{' '}
                                                    {products.length === 1
                                                        ? 'item'
                                                        : 'items'}
                                                </span>
                                            </div>

                                            {/* Responsive Product Cards Grid */}
                                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                                {products.map((product) => (
                                                    <ProductCard
                                                        key={product.id}
                                                        product={product}
                                                    />
                                                ))}
                                            </div>
                                        </section>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}
