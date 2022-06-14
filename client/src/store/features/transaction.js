import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	login: false,
	loading: true,
	redirectUrl: '',
	walletAddress: '',
	contract: {},
};

const userSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		updateAuth: (state, action) => {
			state[action.payload.key] = action.payload.value;
		},

		setAuth: (state, action) => {
			return { ...state, ...action.payload };
		},

		clearAuth: (state, action) => {
			return { ...initialState, loading: false, redirectUrl: action.payload || '' };
		},
	},
});

export const { clearAuth, setAuth, updateAuth } = userSlice.actions;
export default userSlice.reducer;
