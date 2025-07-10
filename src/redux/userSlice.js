import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const user = JSON.parse(localStorage.getItem('user')) || {};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: user,
    },
    reducers: {
        addUser(state, action) {
            const newUser = action.payload;
            state.user = newUser;
            localStorage.setItem('user', JSON.stringify(newUser));
        },

        updateUser(state, action) {
            const channel = action.payload;
            if (!state.user.channels) {
                state.user.channels = [];
            }
            state.user.channels.push(channel);
            localStorage.setItem('user', JSON.stringify(state.user));
        },

        updateUserInfo(state, action){
            const updatedUser = action.payload;
            state.user.username = updatedUser.name;
            state.user.avatar = updatedUser.profileImage;
            state.user.handle = updatedUser.handle;

            localStorage.setItem('user', JSON.stringify(state.user));
        },

        removeUser(state) {
            state.user = {};
            localStorage.removeItem('user');
        },
    },
});

export const { addUser,updateUser, removeUser, updateUserInfo } = userSlice.actions;
export default userSlice.reducer;
