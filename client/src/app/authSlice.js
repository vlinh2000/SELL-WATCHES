import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { nguoidungApi } from 'api/nguoidungApi';
import { switch_screenLogin } from 'pages/User/userSlice';

export const login = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {

    try {
        const { result } = await nguoidungApi.login(data);
        return { token: result.token, refreshToken: result.refreshToken };

    } catch (error) {
        return rejectWithValue(error)
    }

})

export const getMe = createAsyncThunk("auth/getMe", async (data, { rejectWithValue, dispatch }) => {

    try {
        const { result } = await nguoidungApi.getMe();
        dispatch(switch_screenLogin(false));
        return result;

    } catch (error) {
        return rejectWithValue(error)
    }

})

export const getNewToken = createAsyncThunk("auth/getNewToken", async (refreshToken, { rejectWithValue, dispatch }) => {

    try {
        const { data: { result } } = await nguoidungApi.getNewToken(refreshToken);
        return { token: result.token, refreshToken: result.refreshToken };

    } catch (error) {
        return rejectWithValue(error)
    }

})



const initialState = {
    token: null,
    refreshToken: null,
    user: null,
    isAuth: false,
    errorMsg: '',
    isLoading: {
        login: false,
        getMe: false
    }
}


const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        //handle add to cart
        logout: (state, action) => {
            state.token = null;
            state.refreshToken = null;
            state.user = null;
            state.isAuth = false;
        }
    },
    extraReducers: {
        [login.pending]: (state, action) => {
            state.isLoading.login = true;
        },
        [login.fulfilled]: (state, action) => {
            const { token, refreshToken } = action.payload;
            state.isLoading.login = false;
            state.token = token;
            state.refreshToken = refreshToken;
        },
        [login.rejected]: (state, action) => {
            state.isLoading.login = false;
        },
        // get new token
        [getNewToken.fulfilled]: (state, action) => {
            const { token, refreshToken } = action.payload;
            state.token = token;
            state.refreshToken = refreshToken;
        },
        // getme
        [getMe.pending]: (state, action) => {
            state.isLoading.getMe = true;
        },
        [getMe.fulfilled]: (state, action) => {
            state.isLoading.getMe = false;
            state.user = action.payload;
            state.isAuth = true;
        },
        [getMe.rejected]: (state, action) => {
            state.isLoading.getMe = false;
            state.user = null;
            state.isAuth = false;
        }
    }
}
)

const { actions, reducer } = auth;
export const { logout } = actions;
export default reducer;