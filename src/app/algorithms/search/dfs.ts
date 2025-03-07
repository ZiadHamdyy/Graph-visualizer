import toast from "react-hot-toast";

export interface Graph {
  [key: string]: string[];
}
export interface Result {
  result: string[];
  found: boolean;
}
export function dfs(graph: Graph, startNode: string, searchNode: string): Result {
  if (!graph[startNode]) {
    toast.error('Start node does not exist in the graph', {
      style: {
        backgroundColor: "#FEE2E2",
        border: "1px solid #EF4444",
        color: "#DC2626",
        fontWeight: "500",
      },
    });
    return {result: [], found: false};
  }

  const visited = new Set<string>();
  const result: string[] = [];
  let found = false;

  function traverse(node: string) {
    if (!visited.has(node)) {
      visited.add(node);
      result.push(node);
      
      if (node === searchNode) {
        found = true;
        return;
      }
      
      for (const neighbor of graph[node]) {
        if (!found) {
          result.push(node + neighbor);
          traverse(neighbor);
        }
      }
    }
  }

  traverse(startNode);
  
  return {result, found};
}