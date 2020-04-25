export type Song = {
    name: string;
    other_name?: string;
    thumbnail: string;
    url: string;
    year: number;
    views: number;
    category: Category;
};

export type Category = {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
};
