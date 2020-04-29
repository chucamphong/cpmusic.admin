import { Artist } from "pages/Artists/types";

export type Song = {
    id: number;
    name: string;
    other_name?: string;
    thumbnail: string;
    url: string;
    year: number;
    views: number;
    category: Category;
    artists: Artist | Artist[]
};

export type Category = {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
};
