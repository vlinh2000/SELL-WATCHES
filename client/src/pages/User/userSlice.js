import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { donhangApi } from 'api/donhangApi';
import { loaisanphamApi } from 'api/loaisanphamApi';
import { thongkeApi } from 'api/thongkeApi';
import { user_uudaiApi } from 'api/user_uudaiApi';
import { yeuthichApi } from 'api/yeuthichApi';


export const fetch_favouriteList = createAsyncThunk("userPage/fetch_favouriteList", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await yeuthichApi.getAll(params);
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

export const fetch_productTypes = createAsyncThunk("userPage/fetch_productTypes", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await loaisanphamApi.getAll();
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

export const fetch_my_vouchers = createAsyncThunk("userPage/fetch_my_vouchers", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await user_uudaiApi.getAll();
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

export const fetch_my_orders = createAsyncThunk("userPage/fetch_my_orders", async (params, { rejectWithValue, dispatch }) => {

    try {
        const { result, totalRecord } = await donhangApi.getAll(params);
        dispatch(fetch_statistical_my_orders());
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

export const fetch_statistical_my_orders = createAsyncThunk("userPage/fetch_statistical_my_orders", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await thongkeApi.get_my_orders(params);
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})


const initialState = {
    isVisibleScreenLogin: false,
    isVisibleSuggestionModal: false,
    isVisibleChooseAddressModal: false,
    isVisibleVoucherModal: false,
    error: {},
    loading: {},
    data: {
        statisticalMyOrders: [0, 0, 0, 0]
    },
    cart: [],
    payments: {},
    groupFilter: {},
    sortBy: {},
    hadOrder: false,
    pagination: {
        productByCategoryScreen: { _page: 1, _limit: 9, _totalPage: 3 },
        myOrders: {
            _limit: 5,
            _page: 1,
            _totalPage: 1,
            _totalRecord: 0
        },
    }
}


const userPage = createSlice({
    name: 'userPage',
    initialState,
    reducers: {
        //handle add to cart
        switch_screenLogin: (state, action) => {
            state.isVisibleScreenLogin = action.payload
        },
        switch_suggestionModal: (state, action) => {
            state.isVisibleSuggestionModal = action.payload
        },
        switch_chooseAddressModal: (state, action) => {
            state.isVisibleChooseAddressModal = action.payload
        },
        switch_voucherModal: (state, action) => {
            state.isVisibleVoucherModal = action.payload
        },
        addToCart: (state, action) => {
            const { product, quantity } = action.payload;
            const index = state.cart.findIndex((sp) => sp.MA_SP === product.MA_SP);
            console.log({ index })
            if (index === -1) {
                state.cart.push(({ ...product, SL_TRONG_GIO: quantity || 1 }));
            } else {
                const currentProduct = state.cart[index];
                state.cart[index] = { ...currentProduct, SL_TRONG_GIO: currentProduct.SL_TRONG_GIO + (quantity || 1) }
            }
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            const index = state.cart.findIndex((sp) => sp.MA_SP === id);
            if (index === -1) return;
            state.cart.splice(index, 1);
        },
        resetCart: (state, action) => {
            state.cart = [];
        },
        changeQuantityInCart: (state, action) => {
            const { id, quantity } = action.payload
            const index = state.cart.findIndex((sp) => sp.MA_SP === id);
            if (index === -1) return;
            const currentProduct = state.cart[index];
            state.cart[index] = { ...currentProduct, SL_TRONG_GIO: currentProduct.SL_TRONG_GIO + quantity }
        },
        onFilter: (state, action) => {
            const { name, filterValue } = action.payload;
            state.groupFilter[name] = filterValue;
            state.pagination.productByCategoryScreen._page = 1;
        },
        onSort: (state, action) => {
            const { name, sortValue } = action.payload;
            state.sortBy.fieldName = name;
            state.sortBy.sortValue = sortValue;
            state.pagination.productByCategoryScreen._page = 1;
        },
        onSearch: (state, action) => {
            state.searchValue = action.payload;
            state.pagination.productByCategoryScreen._page = 1;
        },
        savePagination: (state, action) => {
            const { screen, _page, _totalPage } = action.payload;
            state.pagination[screen] = { ...state.pagination[screen], _page, _totalPage };
        },
        selectVoucher: (state, action) => {
            const voucher = action.payload;
            state.payments.voucher = voucher;
        },
    },
    extraReducers: {
        [fetch_favouriteList.pending]: (state, action) => {
            state.loading.favouriteList = true;
        },
        [fetch_favouriteList.fulfilled]: (state, action) => {
            state.loading.favouriteList = false;
            // state.data.favouriteList = action.payload.result.map((e, idx) => ({ ...e, key: idx }));
            state.data.favouriteList = action.payload.result;
            // const totalRecord = action.payload.totalRecord;
            // state.pagination.favouriteList._totalRecord = totalRecord;
            // state.pagination.favouriteList._totalPage = Math.ceil(totalRecord / state.pagination.favouriteList._limit);
        },
        [fetch_favouriteList.rejected]: (state, action) => {
            state.loading.favouriteList = false;
            state.error.favouriteList = action.error;
        },
        //fetch_productTypes
        [fetch_productTypes.pending]: (state, action) => {
            state.loading.productTypeList = true;
        },
        [fetch_productTypes.fulfilled]: (state, action) => {
            state.loading.productTypeList = false;
            state.data.productTypeList = action.payload.result;
        },
        [fetch_productTypes.rejected]: (state, action) => {
            state.loading.productTypeList = false;
            state.error.productTypeList = action.error;
        },
        //fetch_my_vouchers
        [fetch_my_vouchers.pending]: (state, action) => {
            state.loading.myVouchers = true;
        },
        [fetch_my_vouchers.fulfilled]: (state, action) => {
            state.loading.myVouchers = false;
            state.data.myVouchers = action.payload.result;
            state.data.myVouchersID = action.payload.result.map(voucher => voucher.MA_UU_DAI);
        },
        [fetch_my_vouchers.rejected]: (state, action) => {
            state.loading.myVouchers = false;
            state.error.myVouchers = action.error;
        },
        // orders
        [fetch_my_orders.pending]: (state, action) => {
            state.loading.myOrders = true;
        },
        [fetch_my_orders.fulfilled]: (state, action) => {
            state.loading.myOrders = false;
            state.data.myOrders = action.payload.result.map((e, idx) => ({ ...e, key: idx }));

            const totalRecord = action.payload.totalRecord;
            state.hadOrder = totalRecord > 0;
            state.pagination.myOrders._totalRecord = totalRecord;
            state.pagination.myOrders._totalPage = Math.ceil(totalRecord / state.pagination.myOrders._limit);
        },
        [fetch_my_orders.rejected]: (state, action) => {
            state.loading.myOrders = false;
            state.error.myOrders = action.error;
        },
        // statistical orders
        [fetch_statistical_my_orders.pending]: (state, action) => {
            state.loading.statisticalMyOrders = true;
        },
        [fetch_statistical_my_orders.fulfilled]: (state, action) => {
            state.loading.statisticalMyOrders = false;
            state.data.statisticalMyOrders = action.payload.result.THONG_KE;

        },
        [fetch_statistical_my_orders.rejected]: (state, action) => {
            state.loading.statisticalMyOrders = false;
            state.error.statisticalMyOrders = action.error;
        },
    }
})

const { actions, reducer } = userPage;
export const { switch_screenLogin, addToCart,
    removeFromCart, resetCart, changeQuantityInCart, onFilter, onSort, onSearch, savePagination, switch_suggestionModal,
    switch_chooseAddressModal, switch_voucherModal, selectVoucher } = actions;
export default reducer;