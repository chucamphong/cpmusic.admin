export type Query = {
    model: string;
    filters?: Dictionary<string>;
    pagination?: {
        number?: number;
        size?: number;
    };
    includes?: string[];
    appends?: string[];
    sort?: string[];
};

function buildQuery({ model, filters, pagination, includes, appends, sort }: Query): string {
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

    if (includes) {
        query.push(`include=${includes.join(",")}`);
    }

    if (appends) {
        query.push(`append=${appends.join(",")}`);
    }

    if (sort) {
        query.push(`sort=${sort.join(",")}`);
    }

    return `${model}?${query.join("&")}`;
}

export default buildQuery;
