import toast from "react-hot-toast";
import { Graph, Result } from "./dfs";



export function bfs(graph: Graph, startNode: string, searchNode?: string): Result {
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
  const queue: string[] = [startNode];
  let found = false;
  
  visited.add(startNode);
  
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    
    if (searchNode && node === searchNode) {
      found = true;
      break;
    }
    
    for (const neighbor of graph[node]) {
      result.push(node + neighbor);
      
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  if (searchNode) {
    return {
      result,
      found
    };
  }
  
  return {result, found};
}