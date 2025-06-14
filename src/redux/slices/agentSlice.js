import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunk to fetch agent details

export const fetchAgentDetails = createAsyncThunk(
    'agent/fetchAgentDetails',
    async (_, thunkAPI) => {
        try {
            // Get agentId from AsyncStorage
            const agentId = await AsyncStorage.getItem('id');
            console.log("fetchAgentDetails calling....")
            if (!agentId) {
                throw new Error('Agent ID not found in storage');
            }

            // Fetch document from Firestore
            const docSnap = await firestore().collection('deliveryAgents').doc(agentId).get();

            if (docSnap.exists) {
                return { agentId, ...docSnap.data() };
            } else {
                throw new Error('No such document!');
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const agentSlice = createSlice({
    name: 'agent',
    initialState: {
        agentId: null,
        mobile: '',
        name: '',
        password: '',
        storeName: '',
        storeId: '',
        type: '',
        completedOrders: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        clearAgentDetails: (state) => {
            state.agentId = null;
            state.mobile = '';
            state.name = '';
            state.password = '';
            state.storeName = '';
            state.storeId = '';
            state.type = '';
            state.completedOrders = [];
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAgentDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAgentDetails.fulfilled, (state, action) => {
                const data = action.payload;
                state.status = 'succeeded';
                state.mobile = data.mobile;
                state.name = data.name;
                state.password = data.password;
                state.storeName = data.storeName;
                state.storeId = data.storeId;
                state.type = data.type;
                state.completedOrders = data.completedOrders || [];
                state.agentId = data.id
            })
            .addCase(fetchAgentDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { clearAgentDetails } = agentSlice.actions;

export default agentSlice.reducer;
