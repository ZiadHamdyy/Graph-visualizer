import toast from "react-hot-toast";
import { Graph } from "../dfs";

export function inOrderTraversal(graph: Graph, startNode: string): string[] {
  if (!graph[startNode]) {
    toast.error("Start node does not exist in the graph", {
      style: {
        backgroundColor: "#FEE2E2",
        border: "1px solid #EF4444",
        color: "#DC2626",
        fontWeight: "500",
      },
    });
    return [];
  }

  const visited = new Set<string>();
  const result: string[] = [];

  function traverse(node: string) {
    visited.add(node);

    const neighbors = graph[node];
    if (neighbors.length > 0) {
      const leftNeighbor = neighbors[0];
      if (!visited.has(leftNeighbor)) {
        result.push(node + leftNeighbor);
        traverse(leftNeighbor);
      }
    }

    result.push(node);

    if (neighbors.length > 1) {
      for (let i = 1; i < neighbors.length; i++) {
        const rightNeighbor = neighbors[i];
        if (!visited.has(rightNeighbor)) {
          result.push(node + rightNeighbor);
          traverse(rightNeighbor);
        }
      }
    }
  }

  traverse(startNode);
  return result;
}
