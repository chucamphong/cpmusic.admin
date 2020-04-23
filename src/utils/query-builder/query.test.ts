import buildQuery, { Query } from "utils/query-builder/query";

describe("Kiểm tra thư viện query-builder", () => {
    test.each([
        [{ name: "chuphong" }, "users?filter[name]=chuphong"],
        [{ name: "phong", email: "phong@gmail.com" }, "users?filter[name]=phong&filter[email]=phong@gmail.com"],
        [{ "author.name": "phong" }, "users?filter[author.name]=phong"],
    ])("Kiểm tra filters", (filters, expected) => {
        const query: Query = {
            model: "users",
            filters,
        };

        const url = buildQuery(query);

        expect(url).toEqual(expected);
    });

    test.each([
        [1, 2, "users?page[size]=1&page[number]=2"],
        [4, 5, "users?page[size]=4&page[number]=5"],
    ])("Kiểm tra pagination", (size, number, expected) => {
        const query: Query = {
            model: "users",
            pagination: { size, number },
        };

        const url = buildQuery(query);

        expect(url).toEqual(expected);
    });

    test("Kiểm tra tổng thể", () => {
        const query: Query = {
            model: "users",
            filters: {
                name: "Chu Cẩm Phong",
                email: "chucamphong1999@gmail.com",
            },
            pagination: {
                size: 1,
                number: 20,
            },
        };

        const url = buildQuery(query);

        expect(url).toEqual("users?filter[name]=Chu Cẩm Phong&filter[email]=chucamphong1999@gmail.com&page[size]=1&page[number]=20");
    });
});
