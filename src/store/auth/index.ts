import { createSlice } from "@reduxjs/toolkit";
import { LoginI, User } from "../../_interfaces/login";

export interface AuthStateI {
  accessToken?: string;
  user?: User;
}

const initialState: AuthStateI = {
  accessToken: undefined,
  user: undefined,
};

type LoginInfoPayload = {
  payload: LoginI;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveTokenAuth: (state: AuthStateI, { payload }: LoginInfoPayload) => {
      state.accessToken = payload.token;
      state.user = payload.user;
    },
    deleteTokenAuth: (state) => {
      state.accessToken = undefined;
      state.user = undefined;
    },
  },
});

export const { saveTokenAuth, deleteTokenAuth } = authSlice.actions;

export default authSlice.reducer;
