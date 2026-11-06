import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronRight,
    Edit3,
    PackageCheck,
    ShieldCheck,
    Truck,
} from 'lucide-react';
import ProductCard from '@/components/product-card';
import ShopLayout from '@/layouts/shop-layout';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

type ShopShowProps = {
    product: Product;
    relatedProducts: Product[];
};

export default function ShopShow({ product, relatedProducts }: ShopShowProps) {
    const [quantity, setQuantity] = useState<number | ''>(1);

    const oldPriceNum =
        product.old_price !== null ? Number(product.old_price) : null;
    const newPriceNum = Number(product.new_price);
    const hasDiscount = oldPriceNum !== null && oldPriceNum > newPriceNum;

    return (
        <ShopLayout>
            <Head title={`${product.name} — Bangla Puzzle Mart`} />

            <div className="flex flex-col gap-10">
                {/* Breadcrumb Navigation */}
                <nav
                    className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
                    aria-label="Breadcrumb"
                >
                    <Link href="/" className="transition hover:text-foreground">
                        Home
                    </Link>
                    <ChevronRight className="h-4 w-4 shrink-0" />
                    {product.category && (
                        <>
                            <Link
                                href={`/categories/${product.category.slug}`}
                                className="transition hover:text-foreground"
                            >
                                {product.category.name}
                            </Link>
                            <ChevronRight className="h-4 w-4 shrink-0" />
                        </>
                    )}
                    {product.subcategory && (
                        <>
                            <Link
                                href={
                                    product.category
                                        ? `/categories/${product.category.slug}/${product.subcategory.slug}`
                                        : `/categories/${product.subcategory.slug}`
                                }
                                className="font-medium text-foreground/80 transition hover:text-foreground"
                            >
                                {product.subcategory.name}
                            </Link>
                            <ChevronRight className="h-4 w-4 shrink-0" />
                        </>
                    )}
                    <span className="max-w-[200px] truncate font-semibold text-foreground sm:max-w-xs">
                        {product.name}
                    </span>
                </nav>

                {/* Two-Column Product Detail View */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                    {/* Left: Large Product Image Card */}
                    <div className="lg:col-span-6">
                        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border bg-muted/30 shadow-sm">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                    </div>

                    {/* Right: Product Details & Purchase Actions */}
                    <div className="flex flex-col lg:col-span-6">

                        {/* Product Title */}
                        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                            {product.name}
                        </h1>

                        {/* Pricing Display (Strictly NO discount percentage badge) */}
                        <div className="mt-4 flex items-baseline gap-3 border-y py-4">
                            <span className="text-3xl font-extrabold text-foreground">
                                ${newPriceNum.toFixed(2)}
                            </span>
                            {hasDiscount && oldPriceNum !== null && (
                                <span className="text-base text-muted-foreground line-through">
                                    ${oldPriceNum.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mt-6">
                            <h2 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                                Product Description
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                                {product.description}
                            </p>
                        </div>

                        {/* Trust & Guarantee Badges */}
                        <div className="mt-8 grid grid-cols-1 gap-3 border-t pt-6 text-xs text-muted-foreground sm:grid-cols-3">
                            <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 shrink-0 text-primary" />
                                <span>Express Delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                                <span>Quality Guaranteed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <PackageCheck className="h-4 w-4 shrink-0 text-primary" />
                                <span>Authentic Products</span>
                            </div>
                        </div>

                        {/*inactive buy now button with quantity box*/}
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <div className="inline-flex h-11 items-center rounded-lg border w-20">

                                <Input
                                    type="number"
                                    min={1}
                                    value={quantity}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setQuantity(value === '' ? '' : Math.max(1, Number(value)));
                                    }}
                                    onBlur={() => {
                                        if (!quantity || quantity < 1) setQuantity(1);
                                    }}
                                    className="h-10 w-14 border-0 p-0 text-center text-sm font-semibold shadow-none focus-visible:ring-0"
                                />
                            </div>

                            <Button
                                type="button"
                                className="h-11 flex-1 gap-2 bg-green-600 px-8 font-semibold text-white hover:bg-green-700 sm:flex-none"
                                disabled
                            >
                                Buy Now
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 border-t pt-10">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    Related Products
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    More items in{' '}
                                    {product.subcategory?.name ??
                                        'this collection'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {relatedProducts.map((related) => (
                                <ProductCard
                                    key={related.id}
                                    product={related}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}
