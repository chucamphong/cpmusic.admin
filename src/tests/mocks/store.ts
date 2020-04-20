import faker from "faker";
import configureStore from "redux-mock-store";
import { RootState } from "store/types";

export const initialState: RootState = {
    auth: {},
    loading: { status: "nothing" },
};

export const mockState: RootState = {
    auth: {
        plainTextToken: faker.random.words(32),
        user: {
            id: faker.random.number(10),
            name: faker.name.findName(),
            email: faker.internet.email(),
            avatar: faker.image.avatar(),
            role: "member",
            email_verified_at: Date.now().toString(),
            permissions: [],
        },
    },
    loading: {
        status: "nothing",
    },
};

const mockStore = (state: RootState = initialState) => configureStore<RootState>()(state);

export default mockStore;
