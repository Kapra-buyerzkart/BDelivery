import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunk to fetch agent details

export const fetchStoreDetails = createAsyncThunk(
    'store/fetchStoreDetails',
    async (_, thunkAPI) => {
        try {
            // Get agentId from AsyncStorage
            // console.log("1111")
            const storeId = await AsyncStorage.getItem('storeId');
            // console.log("storeId", storeId)
            // console.log("fetchStoreDetails calling....")
            if (!storeId) {
                throw new Error('Store ID not found in storage');
            }

            // Fetch document from Firestore
            const docSnap = await firestore().collection('stores').doc('stores').get();

            if (!docSnap.exists) {
                throw new Error('Stores document does not exist');
            }
            const allStores = docSnap.data().stores;
            // console.log('allStores', allStores)
            const agentsStore = allStores.find(store => store.id === storeId)
            // console.log('agentsStore', agentsStore)
            if (!agentsStore) {
                throw new Error('Store not found for the given ID');
            }

            return agentsStore

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const storeSlice = createSlice({
    name: 'store',
    initialState: {
        storeDetails: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        clearStoreDetails: (state) => {
            state.storeDetails = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStoreDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchStoreDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.storeDetails = action.payload;
            })
            .addCase(fetchStoreDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { clearStoreDetails } = storeSlice.actions;

export default storeSlice.reducer;
