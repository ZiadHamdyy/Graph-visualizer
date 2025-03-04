interface TreeNode {
  val: string;
  children: TreeNode[];
}

export interface GraphElement {
  data: {
    id: string;
    source?: string;
    target?: string;
  };
}

export function treeToGraph(treeData: TreeNode): GraphElement[] {
  const elements: GraphElement[] = [];
  
  function traverse(node: TreeNode) {
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
  
  traverse(treeData);
  return elements;
}

export function graphToTree(elements: GraphElement[]): TreeNode {
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
  
  // Build tree recursively
  function buildTree(nodeId: string): TreeNode {
    return {
      val: nodeId,
      children: (nodeMap.get(nodeId) || []).map(childId => buildTree(childId))
    };
  }
  
  // Find root node (node with no incoming edges)
  const rootId = nodes.find(node => 
    !edges.some(edge => edge.data.target === node.data.id)
  )?.data.id;
  
  if (!rootId) return null
  
  return buildTree(rootId);
}

// Example usage:
/*
const treeData = {
  val: "a",
  children: [
    {
      val: "b",
      children: [
        { val: "d", children: [] },
        { val: "e", children: [] }
      ]
    },
    {
      val: "c",
      children: [
        { val: "f", children: [] }
      ]
    }
  ]
};

const graphElements = treeToGraph(treeData);
const backToTree = graphToTree(graphElements);
*/