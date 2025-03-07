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

export function jsonToGraph(jsonData: json | json[]): GraphElement[] {
  const elements: GraphElement[] = [];
  
  function traverse(node: json) {
    elements.push({ data: { id: node.val } });
    
    for (const child of node.children) {
      traverse(child);
      elements.push({
        data: {
          id: `${node.val}${child.val}`,
          source: node.val,
          target: child.val
        }
      });
    }
  }
  
  if (Array.isArray(jsonData)) {
    jsonData.forEach(graph => traverse(graph));
  } else {
    traverse(jsonData);
  }
  
  return elements;
}

export function graphTojson(elements: GraphElement[]): json[] {
  const nodes = elements.filter(el => !el.data.source);
  const edges = elements.filter(el => el.data.source);
  
  const nodeMap = new Map<string, string[]>();
  
  nodes.forEach(node => {
    nodeMap.set(node.data.id, []);
  });
  
  edges.forEach(edge => {
    const source = edge.data.source!;
    const target = edge.data.target!;
    const children = nodeMap.get(source) || [];
    children.push(target);
    nodeMap.set(source, children);
  });
  
  function buildTree(nodeId: string, visited: Set<string>): json {
    visited.add(nodeId);
    return {
      val: nodeId,
      children: (nodeMap.get(nodeId) || [])
        .map(childId => buildTree(childId, visited))
    };
  }
  
  const rootNodes = nodes.filter(node => 
    !edges.some(edge => edge.data.target === node.data.id)
  );

  if (rootNodes.length === 0) return [];

  const visited = new Set<string>();
  const graphs: json[] = [];

  rootNodes.forEach(root => {
    if (!visited.has(root.data.id)) {
      graphs.push(buildTree(root.data.id, visited));
    }
  });

  nodes.forEach(node => {
    if (!visited.has(node.data.id)) {
      graphs.push(buildTree(node.data.id, visited));
    }
  });
  
  return graphs;
}