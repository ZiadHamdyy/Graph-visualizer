import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Core, ElementDefinition } from "cytoscape";
import { RootState } from "./store";

import toast from "react-hot-toast";

interface GraphState {
  elements: ElementDefinition[];
  currentGraph: Core | null;
}

const initialState: GraphState = {
  elements: [],
  currentGraph: null,
};

export const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    setCurrentGraph: (state, action: PayloadAction<Core>) => {
      state.currentGraph = action.payload;
    },
    setElements: (state, action: PayloadAction<ElementDefinition[]>) => {
      state.elements = action.payload;
    },
    addElement: (state, action: PayloadAction<ElementDefinition>) => {
      const nodeExists = state.elements.some(
        (element) => element.data.id === action.payload.data.id
      );

      if (nodeExists) {
        toast.error(
          `Node "${action.payload.data.id}" already exists! must be unique`,
          {
            style: {
              backgroundColor: "#FEE2E2",
              border: "1px solid #EF4444",
              color: "#DC2626",
              fontWeight: "500",
            },
          }
        );
        return;
      }

      state.elements.push(action.payload);
    },
    deleteElement: (state, action: PayloadAction<string>) => {
      const elementExists = state.elements.some(
        (element) => element.data.id === action.payload
      );

      if (!elementExists) {
        toast.error("Node doesn't exist!", {
          style: {
            backgroundColor: "#FEE2E2",
            border: "1px solid #EF4444",
            color: "#DC2626",
            fontWeight: "500",
          },
        });
        return;
      }

      state.elements = state.elements.filter(
        (element) =>
          !(
            element.data.source === action.payload ||
            element.data.target === action.payload
          )
      );
      state.elements = state.elements.filter(
        (element) => element.data.id !== action.payload
      );
    },
    addEdge: (state, action: PayloadAction<ElementDefinition>) => {
      const sourceExists = state.elements.some(
        (el) => el.data.id === action.payload.data.source
      );
      const targetExists = state.elements.some(
        (el) => el.data.id === action.payload.data.target
      );

      const edgeExists = state.elements.some(
        (el) =>
          el.data.source === action.payload.data.source &&
          el.data.target === action.payload.data.target
      );

      if (edgeExists) {
        toast.error("Edge already exists!", {
          style: {
            backgroundColor: "#FEE2E2",
            border: "1px solid #EF4444",
            color: "#DC2626",
            fontWeight: "500",
          },
        });
        return;
      }

      if (sourceExists && targetExists) {
        state.elements.push(action.payload);
      } else {
        if (!sourceExists) {
          toast.error(
            `Source node "${action.payload.data.source}" doesn't exist`,
            {
              style: {
                backgroundColor: "#FEE2E2",
                border: "1px solid #EF4444",
                color: "#DC2626",
                fontWeight: "500",
              },
            }
          );
        }
        if (!targetExists) {
          toast.error(
            `Target node "${action.payload.data.target}" doesn't exist`,
            {
              style: {
                backgroundColor: "#FEE2E2",
                border: "1px solid #EF4444",
                color: "#DC2626",
                fontWeight: "500",
              },
            }
          );
        }
      }
    },
    deleteEdge: (state, action: PayloadAction<string>) => {
      const edgeExists = state.elements.some(
        (element) => element.data.id === action.payload
      );

      if (!edgeExists) {
        toast.error("Edge doesn't exist!", {
          style: {
            backgroundColor: "#FEE2E2",
            border: "1px solid #EF4444",
            color: "#DC2626",
            fontWeight: "500",
          },
        });
        return;
      }

      state.elements = state.elements.filter(
        (element) => element.data.id !== action.payload
      );
    },
  },
});
export const selectAllElements = (state: RootState) => state.graph.elements;
export const selectElementById = (state: RootState, id: string) =>
  state.graph.elements.find((element) => element.data.id === id);
export const selectCurrentGraph = (state: RootState) =>
  state.graph.currentGraph;

export const {
  setCurrentGraph,
  setElements,
  addElement,
  deleteElement,
  addEdge,
  deleteEdge,
} = graphSlice.actions;
export default graphSlice.reducer;
