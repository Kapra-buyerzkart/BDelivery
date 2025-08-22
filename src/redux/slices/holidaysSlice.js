import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

export const fetchHolidays = createAsyncThunk('holidays/fetchHolidays', async (_, thunkAPI) => {
    try {
        const docSnap = await firestore().collection('holidays').doc('holidays').get();
        return docSnap.exists ? docSnap.data().holidays : [];
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const holidaysSlice = createSlice({
    name: 'holidays',
    initialState: {
        data: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHolidays.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchHolidays.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchHolidays.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default holidaysSlice.reducer;
