import { Category } from "pages/Category/types";
import { Service } from "services/service";

class CategoryService extends Service<Category> {
    constructor() {
        super("categories");
    }
}

export default CategoryService;
