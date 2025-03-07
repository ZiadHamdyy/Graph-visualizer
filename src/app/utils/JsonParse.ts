interface json {
  val: string;
  children: json[];
}

export interface GraphElement {
  data: {
    id: string;
    source?: string;
    target?: string;
  };
}

export function jsonToGraph(jsonData: json): GraphElement[] {
  const elements: GraphElement[] = [];
  
  function traverse(node: json) {
    // Add node
    elements.push({ data: { id: node.val } });
    
    // Add edges and process children
    for (const child of node.children) {
      traverse(child);
      // Add edge
      elements.push({
        data: {
          id: `${node.val}${child.val}`,
          source: node.val,
          target: child.val
        }
      });
    }
  }
  
  traverse(jsonData);
  return elements;
}

export function graphTojson(elements: GraphElement[]): json {
  // First, separate nodes and edges
  const nodes = elements.filter(el => !el.data.source);
  const edges = elements.filter(el => el.data.source);
  
  // Create a map of nodes with their children
  const nodeMap = new Map<string, string[]>();
  
  // Initialize empty arrays for all nodes
  nodes.forEach(node => {
    nodeMap.set(node.data.id, []);
  });
  
  // Add children based on edges
  edges.forEach(edge => {
    const source = edge.data.source!;
    const target = edge.data.target!;
    const children = nodeMap.get(source) || [];
    children.push(target);
    nodeMap.set(source, children);
  });
  
  function buildTree(nodeId: string): json {
    return {
      val: nodeId,
      children: (nodeMap.get(nodeId) || []).map(childId => buildTree(childId))
    };
  }
  
  const rootId = nodes.find(node => 
    !edges.some(edge => edge.data.target === node.data.id)
  )?.data.id;
  
  if (!rootId) return null
  
  return buildTree(rootId);
}