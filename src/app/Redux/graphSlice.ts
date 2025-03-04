import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ElementDefinition } from "cytoscape";
import { RootState } from "./store";
import { addEdge } from "reactflow";
interface GraphState {
  elements: ElementDefinition[];
}

const initialState: GraphState = {
  elements: [],
};

export const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    setElements: (state, action: PayloadAction<ElementDefinition[]>) => {
      state.elements = action.payload;
    },
    addElement: (state, action: PayloadAction<ElementDefinition>) => {
      state.elements.push(action.payload);
    },
    deleteElement: (state, action: PayloadAction<string>) => {
      state.elements = state.elements.filter(element => 
        !(element.data.source === action.payload || element.data.target === action.payload)
      );
      state.elements = state.elements.filter(element => element.data.id !== action.payload);
    },
    addEdge: (state, action: PayloadAction<ElementDefinition>) => {
      state.elements.push(action.payload);
    },
    deleteEdge: (state, action: PayloadAction<string>) => {
      state.elements = state.elements.filter(element => element.data.id !== action.payload);
    },
  },
});
export const selectAllElements = (state: RootState) => state.graph.elements;
export const selectElementById = (state: RootState, id: string) => 
  state.graph.elements.find(element => element.data.id === id);

export const { setElements, addElement, deleteElement, addEdge, deleteEdge } = graphSlice.actions;
export default graphSlice.reducer;