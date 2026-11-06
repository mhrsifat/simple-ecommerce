export type Flash = {
    success?: string | null;
    error?: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
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
