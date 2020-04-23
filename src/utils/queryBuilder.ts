export type Query = {
    model: string;
    filters?: Dictionary<string>;
    pagination?: {
        number?: number;
        size?: number;
    };
};

function buildQuery({ model, filters, pagination }: Query): string {
    let query: string[] = [];

    if (filters) {
        query.push(
            ...Object.keys(filters).map(key => `filter[${key}]=${filters[key]}`),
        );
    }

    if (pagination) {
        query.push(
            ...Object.keys(pagination).map(key => `page[${key}]=${pagination[key]}`),
        );
    }

    return `${model}?${query.join("&")}`;
}

export default buildQuery;
