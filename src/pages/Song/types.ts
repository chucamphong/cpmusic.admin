import { Artist } from "pages/Artists/types";
import { Category } from "pages/Category/types";

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
