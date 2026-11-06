export type Flash = {
    success?: string | null;
    error?: string | null;
};

export type Category = {
    id: number;
    name: string;
    slug: string;
    path?: string;
    subcategories_count?: number;
    products_count?: number;
    subcategories?: Subcategory[];
    products?: Product[];
    created_at?: string;
};

export type Subcategory = {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    path?: string;
    category?: Category;
    products_count?: number;
    products?: Product[];
    created_at?: string;
};

export type Product = {
    id: number;
    category_id: number;
    subcategory_id: number;
    name: string;
    slug: string;
    description: string;
    image: string;
    image_url: string;
    path?: string;
    old_price: string | number | null;
    new_price: string | number;
    category?: Category;
    subcategory?: Subcategory;
    created_at?: string;
};
