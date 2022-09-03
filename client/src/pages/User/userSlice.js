import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    isVisibleScreenLogin: false,
    error: {}
}


const adminPage = createSlice({
    name: 'userPage',
    initialState,
    reducers: {
        //handle add to cart
        switch_screenLogin: (state, action) => {
            state.isVisibleScreenLogin = action.payload
        }
    },
    extraReducers: {
    }
})

const { actions, reducer } = adminPage;
export const { switch_screenLogin } = actions;
export default reducer;