import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated : false,
    user : null,
    loading : true
}

const authSlice = createSlice({
    name : "auth",
    initialState,

    reducers :{
        login : (state, action)=>{
            state.isAuthenticated = true
            state.user = action.payload
            state.loading= false
        },
        logout : (state, action)=>{
            state.isAuthenticated = false
            state.user = null
            state.loading = false
        },
        finishAuthCheck: (state) => {
            state.loading = false;
        },
    }
})

export const {login, logout, finishAuthCheck} = authSlice.actions;
export default  authSlice.reducer;