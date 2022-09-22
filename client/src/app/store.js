import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { persistStore, persistReducer, } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import adminSlice from 'pages/Admin/adminSlice';
import userSlice from 'pages/User/userSlice';
import authSlice from './authSlice';


const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['token', 'refreshToken']
}

const userInfoConfig = {
    key: 'userInfo',
    storage,
    whitelist: ['cart']
}

const rootReducers = combineReducers({
    adminInfo: adminSlice,
    userInfo: persistReducer(userInfoConfig, userSlice),
    auth: persistReducer(authPersistConfig, authSlice),
});

//config persist without modals , if you wanna choose 1 slice then use whitelist

const store = configureStore({
    reducer: rootReducers,
    //handle when server respone with status faild but in respone have data that you want
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
});

export const persistor = persistStore(store);

export default store;