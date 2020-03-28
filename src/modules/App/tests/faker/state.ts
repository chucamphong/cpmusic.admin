import faker from "faker";
import { RootState } from "store/types";

const state: RootState = {
    auth: {
        plainTextToken: faker.random.words(32),
        user: {
            id: faker.random.number(10),
            name: faker.name.findName(),
            email: faker.internet.email(),
            role: "mod",
            email_verified_at: Date.now().toString(),
            permissions: [],
        },
    },
    loading: {
        status: "nothing",
    },
};

export default state;
