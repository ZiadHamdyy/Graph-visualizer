import toast from "react-hot-toast";
import { Graph } from "../dfs";

export function postOrderTraversal(graph: Graph, startNode: string): string[] {
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

    for (const neighbor of graph[node]) {
      result.push(node + neighbor);
      if (!visited.has(neighbor)) {
        traverse(neighbor);
      }
    }

    result.push(node);
  }

  traverse(startNode);
  return result;
}
