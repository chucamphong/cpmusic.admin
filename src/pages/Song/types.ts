import { Artist } from "pages/Artists/types";
import { Category } from "pages/Category/types";
import { Moment } from "moment";

export type Song = {
    id: number;
    name: string;
    other_name?: string;
    thumbnail: string;
    url: string;
    year: number | Moment;
    views: number;
    category: Category;
    country: string;
    artists: Artist[]
};
