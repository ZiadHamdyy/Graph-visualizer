import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface GraphState {
  json: string;
}
const initialState: GraphState = {
  json: "",
};
export const jsonSlice = createSlice({
  name: "json",
  initialState,
  reducers: {
    setJson: (state, action) => {
      state.json = action.payload;
    },
  },
});

export const selectJson = (state: RootState) => state.json.json;

export const { setJson } = jsonSlice.actions;
export default jsonSlice.reducer;
