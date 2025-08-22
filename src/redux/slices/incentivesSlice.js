// src/redux/slices/incentivesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";

export const fetchIncentives = createAsyncThunk(
    "incentives/fetchIncentives",
    async () => {
        try {
            const snap = await firestore()
                .collection("incentives")
                .doc("incentivesValues")
                .get();
            console.log("snap", snap)
            if (snap.exists) {
                return snap.data();
            }
            return null;
        } catch (error) {
            console.error("Error fetching incentives:", error);
            throw error;
        }
    }
);

const initialState = {
    data: {
        attendanceIncentives: { saturday: 0, sunday: 0 },
        compulsoryLoginHours: { full_time: "0 hrs", part_time: "0 hrs" },
        monthlySalary: { FULL_TIME: 0, PART_TIME: 0 },
        overtimeBonus: { per_hour_full_time: 0, per_hour_part_time: 0 },
        petrolAllowance: 0,
        referJoinEarn: { joining_bonus: 0, referral_bonus: 0 },
        weeklyTargetIncentives: {
            25: 0,
            35: 0,
            50: 0,
            60: 0,
            75: 0,
            110: 0,
            150: 0,
        },
    },
    loading: false,
    error: null,
};

const incentivesSlice = createSlice({
    name: "incentives",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchIncentives.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchIncentives.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.data = action.payload;
                }
            })
            .addCase(fetchIncentives.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default incentivesSlice.reducer;
