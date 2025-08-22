import { configureStore } from '@reduxjs/toolkit';
import agentReducer from './slices/agentSlice';
import storeReducer from './slices/storeSlice';
import holidaysReducer from './slices/holidaysSlice';
import incentivesReducer from './slices/incentivesSlice';

const store = configureStore({
    reducer: {
        agent: agentReducer,
        store: storeReducer,
        holidays: holidaysReducer,
        incentives: incentivesReducer
    },
});

export default store;
