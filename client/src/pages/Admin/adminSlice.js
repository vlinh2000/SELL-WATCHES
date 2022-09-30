import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { chucvuApi } from 'api/chucvuApi';
import { donhangApi } from 'api/donhangApi';
import { loaisanphamApi } from 'api/loaisanphamApi';
import { nguoidungApi } from 'api/nguoidungApi';
import { nhacungcapApi } from 'api/nhacungcapApi';
import { nhanvienApi } from 'api/nhanvienApi';
import { phieunhapApi } from 'api/phieunhapApi';
import { quyenApi } from 'api/quyenApi';
import { sanphamApi } from 'api/sanphamApi';
import { sukienApi } from 'api/sukienApi';
import { thongkeApi } from 'api/thongkeApi';
import { thuonghieuApi } from 'api/thuonghieuApi';
import { uudaiApi } from 'api/uudaiApi';

export const fetch_positions = createAsyncThunk("adminPage/fetch_positions", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await chucvuApi.getAll(params);
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

export const fetch_vouchers = createAsyncThunk("adminPage/fetch_vouchers", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await uudaiApi.getAll(params);
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

export const fetch_productTypes = createAsyncThunk("adminPage/fetch_productTypes", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await loaisanphamApi.getAll(params);
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})


export const fetch_brands = createAsyncThunk("adminPage/fetch_brands", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await thuonghieuApi.getAll(params);
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

export const fetch_users = createAsyncThunk("adminPage/fetch_users", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await nguoidungApi.getAll(params);
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

export const fetch_suppliers = createAsyncThunk("adminPage/fetch_suppliers", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await nhacungcapApi.getAll(params);
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

export const fetch_employees = createAsyncThunk("adminPage/fetch_employees", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await nhanvienApi.getAll(params);
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

export const fetch_receipts = createAsyncThunk("adminPage/fetch_receipts", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await phieunhapApi.getAll(params);
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

export const fetch_products = createAsyncThunk("adminPage/fetch_products", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await sanphamApi.getAll(params);
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

export const fetch_orders = createAsyncThunk("adminPage/fetch_orders", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await donhangApi.getAll(params);
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

export const fetch_orders_pending = createAsyncThunk("adminPage/fetch_orders_pending", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await donhangApi.getAll(params);
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

export const fetch_rules = createAsyncThunk("adminPage/fetch_rules", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await quyenApi.getAll(params);
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

export const fetch_myRoles = createAsyncThunk("adminPage/fetch_myRoles", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await quyenApi.getAll({ action: 'get_user_rules' });
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

export const fetch_statistical = createAsyncThunk("adminPage/fetch_statistical", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await thongkeApi.getAll(params);
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

export const fetch_events = createAsyncThunk("adminPage/fetch_events", async (params, { rejectWithValue }) => {

    try {
        const { result, totalRecord } = await sukienApi.getAll(params);
        return { result, totalRecord };

    } catch (error) {
        return rejectWithValue(error.respone.data)
    }

})

const initialState = {
    screenUpdateOn: {
        employees: { mode: 'ADD' },
        positions: { mode: 'ADD' },
        categories: { mode: 'ADD' },
        productTypes: { mode: 'ADD' },
        brands: { mode: 'ADD' },
        users: { mode: 'ADD' },
        suppliers: { mode: 'ADD' },
        employees: { mode: 'ADD' },
        receipts: { mode: 'ADD' },
        products: { mode: 'ADD' },
        orders: { mode: 'ADD' },
        rules: { mode: 'ADD' },
        vouchers: { mode: 'ADD' },
        events: { mode: 'ADD' },
    },
    selectedKey: '1',
    loading: {},
    data: {
        statistical: {}
    },
    pagination: {
        positions: {
            _limit: 10,
            _page: 1,
            _totalPage: 1,
            _totalRecord: 0
        },
        productTypes: {
            _limit: 10,
            _page: 1,
            _totalPage: 1,
            _totalRecord: 0
        },
        categories: {
            _limit: 10,
            _page: 1,
            _totalPage: 1,
            _totalRecord: 0
        },
        brands: {
            _limit: 10,
            _page: 1,
            _totalPage: 1,
            _totalRecord: 0
        },
        users: {
            _limit: 10,
            _page: 1,
            _totalPage: 1,
            _totalRecord: 0
        },
        suppliers: {
            _limit: 10,
            _page: 1,
            _totalPage: 1,
            _totalRecord: 0
        },
        employees: {
            _limit: 10,
            _page: 1,
            _totalPage: 1,
            _totalRecord: 0
        },
        receipts: {
            _limit: 10,
            _page: 1,
            _totalPage: 1,
            _totalRecord: 0
        },
        products: {
            _limit: 5,
            _page: 1,
            _totalPage: 1,
            _totalRecord: 0
        },
        orders: {
            _limit: 10,
            _page: 1,
            _totalPage: 1,
            _totalRecord: 0
        },
        ordersConfirm: {
            _limit: 10,
            _page: 1,
            _totalPage: 1,
            _totalRecord: 0
        },
        rules: {
            _limit: 10,
            _page: 1,
            _totalPage: 1,
            _totalRecord: 0
        },
        vouchers: {
            _limit: 10,
            _page: 1,
            _totalPage: 1,
            _totalRecord: 0
        },
        events: {
            _limit: 10,
            _page: 1,
            _totalPage: 1,
            _totalRecord: 0
        },
    },
    error: {}
}


const adminPage = createSlice({
    name: 'adminPage',
    initialState,
    reducers: {
        //handle add to cart
        prepareDataEdit: (state, action) => {
            const { screen, data, mode } = action.payload;
            state.screenUpdateOn[screen].currentSelected = data;
            state.screenUpdateOn[screen].mode = mode;
        },
        savePagination: (state, action) => {
            const { screen, page } = action.payload;
            state.pagination[screen]._page = page;
        },
        saveSelectedKey: (state, action) => {
            const { key } = action.payload;
            state.selectedKey = key;
        },
    },
    extraReducers: {
        //positions
        [fetch_positions.pending]: (state, action) => {
            state.loading.positions = true;
        },
        [fetch_positions.fulfilled]: (state, action) => {
            state.loading.positions = false;
            state.data.positions = action.payload.result.map((e, idx) => ({ ...e, key: idx }));

            const totalRecord = action.payload.totalRecord;
            state.pagination.positions._totalRecord = totalRecord;
            state.pagination.positions._totalPage = Math.ceil(totalRecord / state.pagination.positions._limit);
        },
        [fetch_positions.rejected]: (state, action) => {
            state.loading.positions = false;
            state.error.positions = action.error;
        },
        // vouchers
        [fetch_vouchers.pending]: (state, action) => {
            state.loading.vouchers = true;
        },
        [fetch_vouchers.fulfilled]: (state, action) => {
            state.loading.vouchers = false;
            state.data.vouchers = action.payload.result.map((e, idx) => ({ ...e, key: idx }));

            const totalRecord = action.payload.totalRecord;
            state.pagination.vouchers._totalRecord = totalRecord;
            state.pagination.vouchers._totalPage = Math.ceil(totalRecord / state.pagination.vouchers._limit);
        },
        [fetch_vouchers.rejected]: (state, action) => {
            state.loading.vouchers = false;
            state.error.vouchers = action.error;
        },
        // productTypes
        [fetch_productTypes.pending]: (state, action) => {
            state.loading.productTypes = true;
        },
        [fetch_productTypes.fulfilled]: (state, action) => {
            state.loading.productTypes = false;
            state.data.productTypes = action.payload.result.map((e, idx) => ({ ...e, key: idx }));

            const totalRecord = action.payload.totalRecord;
            state.pagination.productTypes._totalRecord = totalRecord;
            state.pagination.productTypes._totalPage = Math.ceil(totalRecord / state.pagination.productTypes._limit);
        },
        [fetch_productTypes.rejected]: (state, action) => {
            state.loading.productTypes = false;
            state.error.productTypes = action.error;
        },
        // brands
        [fetch_brands.pending]: (state, action) => {
            state.loading.brands = true;
        },
        [fetch_brands.fulfilled]: (state, action) => {
            state.loading.brands = false;
            state.data.brands = action.payload.result.map((e, idx) => ({ ...e, key: idx }));

            const totalRecord = action.payload.totalRecord;
            state.pagination.brands._totalRecord = totalRecord;
            state.pagination.brands._totalPage = Math.ceil(totalRecord / state.pagination.brands._limit);
        },
        [fetch_brands.rejected]: (state, action) => {
            state.loading.brands = false;
            state.error.brands = action.error;
        },
        // users
        [fetch_users.pending]: (state, action) => {
            state.loading.users = true;
        },
        [fetch_users.fulfilled]: (state, action) => {
            state.loading.users = false;
            state.data.users = action.payload.result.map((e, idx) => ({ ...e, key: idx }));

            const totalRecord = action.payload.totalRecord;
            state.pagination.users._totalRecord = totalRecord;
            state.pagination.users._totalPage = Math.ceil(totalRecord / state.pagination.users._limit);
        },
        [fetch_users.rejected]: (state, action) => {
            state.loading.users = false;
            state.error.users = action.error;
        },
        // suppliers
        [fetch_suppliers.pending]: (state, action) => {
            state.loading.suppliers = true;
        },
        [fetch_suppliers.fulfilled]: (state, action) => {
            state.loading.suppliers = false;
            state.data.suppliers = action.payload.result.map((e, idx) => ({ ...e, key: idx }));

            const totalRecord = action.payload.totalRecord;
            state.pagination.suppliers._totalRecord = totalRecord;
            state.pagination.suppliers._totalPage = Math.ceil(totalRecord / state.pagination.suppliers._limit);
        },
        [fetch_suppliers.rejected]: (state, action) => {
            state.loading.suppliers = false;
            state.error.suppliers = action.error;
        },
        // employees
        [fetch_employees.pending]: (state, action) => {
            state.loading.employees = true;
        },
        [fetch_employees.fulfilled]: (state, action) => {
            state.loading.employees = false;
            state.data.employees = action.payload.result.map((e, idx) => ({ ...e, key: idx }));

            const totalRecord = action.payload.totalRecord;
            state.pagination.employees._totalRecord = totalRecord;
            state.pagination.employees._totalPage = Math.ceil(totalRecord / state.pagination.employees._limit);
        },
        [fetch_employees.rejected]: (state, action) => {
            state.loading.employees = false;
            state.error.employees = action.error;
        },
        // receipts
        [fetch_receipts.pending]: (state, action) => {
            state.loading.receipts = true;
        },
        [fetch_receipts.fulfilled]: (state, action) => {
            state.loading.receipts = false;
            state.data.receipts = action.payload.result.map((e, idx) => ({ ...e, key: idx }));

            const totalRecord = action.payload.totalRecord;
            state.pagination.receipts._totalRecord = totalRecord;
            state.pagination.receipts._totalPage = Math.ceil(totalRecord / state.pagination.receipts._limit);
        },
        [fetch_receipts.rejected]: (state, action) => {
            state.loading.receipts = false;
            state.error.receipts = action.error;
        },
        // products
        [fetch_products.pending]: (state, action) => {
            state.loading.products = true;
        },
        [fetch_products.fulfilled]: (state, action) => {
            state.loading.products = false;
            state.data.products = action.payload.result.map((e, idx) => ({ ...e, key: idx }));

            const totalRecord = action.payload.totalRecord;
            state.pagination.products._totalRecord = totalRecord;
            state.pagination.products._totalPage = Math.ceil(totalRecord / state.pagination.products._limit);
        },
        [fetch_products.rejected]: (state, action) => {
            state.loading.products = false;
            state.error.products = action.error;
        },
        // orders
        [fetch_orders.pending]: (state, action) => {
            state.loading.orders = true;
        },
        [fetch_orders.fulfilled]: (state, action) => {
            state.loading.orders = false;
            state.data.orders = action.payload.result.map((e, idx) => ({ ...e, key: idx }));

            const totalRecord = action.payload.totalRecord;
            state.pagination.orders._totalRecord = totalRecord;
            state.pagination.orders._totalPage = Math.ceil(totalRecord / state.pagination.orders._limit);
        },
        [fetch_orders.rejected]: (state, action) => {
            state.loading.orders = false;
            state.error.orders = action.error;
        },
        // orders confirm
        [fetch_orders_pending.pending]: (state, action) => {
            state.loading.ordersConfirm = true;
        },
        [fetch_orders_pending.fulfilled]: (state, action) => {
            state.loading.ordersConfirm = false;
            state.data.ordersConfirm = action.payload.result.map((e, idx) => ({ ...e, key: idx }));

            const totalRecord = action.payload.totalRecord;
            state.data.statistical.DH_CHO_XU_LY = totalRecord;
            state.pagination.ordersConfirm._totalRecord = totalRecord;
            state.pagination.ordersConfirm._totalPage = Math.ceil(totalRecord / state.pagination.ordersConfirm._limit);
        },
        [fetch_orders_pending.rejected]: (state, action) => {
            state.loading.ordersConfirm = false;
            state.error.ordersConfirm = action.error;
        },
        // rules
        [fetch_rules.pending]: (state, action) => {
            state.loading.rules = true;
        },
        [fetch_rules.fulfilled]: (state, action) => {
            state.loading.rules = false;
            state.data.rules = action.payload.result.map((e, idx) => ({ ...e, key: idx }));

            const totalRecord = action.payload.totalRecord;
            state.pagination.rules._totalRecord = totalRecord;
            state.pagination.rules._totalPage = Math.ceil(totalRecord / state.pagination.rules._limit);
        },
        [fetch_rules.rejected]: (state, action) => {
            state.loading.rules = false;
            state.error.rules = action.error;
        },
        // my rules
        [fetch_myRoles.fulfilled]: (state, action) => {
            state.data.myRoles = action.payload.result.map((e, idx) => ({ ...e, key: idx }));
        },
        // statistical
        [fetch_statistical.pending]: (state, action) => {
            state.loading.statistical = true;
        },
        [fetch_statistical.fulfilled]: (state, action) => {
            state.loading.statistical = false;
            state.data.statistical = action.payload.result;
        },
        [fetch_statistical.rejected]: (state, action) => {
            state.loading.statistical = false;
            state.error.statistical = action.error;
        },
        // events
        [fetch_events.pending]: (state, action) => {
            state.loading.events = true;
        },
        [fetch_events.fulfilled]: (state, action) => {
            state.loading.events = false;
            state.data.events = action.payload.result.map((e, idx) => ({ ...e, key: idx }));

            const totalRecord = action.payload.totalRecord;
            state.pagination.events._totalRecord = totalRecord;
            state.pagination.events._totalPage = Math.ceil(totalRecord / state.pagination.events._limit);
        },
        [fetch_events.rejected]: (state, action) => {
            state.loading.events = false;
            state.error.events = action.error;
        },

    }
})

const { actions, reducer } = adminPage;
export const { prepareDataEdit, savePagination, saveSelectedKey } = actions;
export default reducer;