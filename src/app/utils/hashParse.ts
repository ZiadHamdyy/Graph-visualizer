interface json {
  val: string;
  children: json[];
}

interface HashMap {
  [key: string]: string[];
}

export function jsonToHash(jsonData: json | json[]): HashMap {
  const hash: HashMap = {};

  function traverse(node: json) {
    hash[node.val] = node.children.map(child => child.val);
    
    for (const child of node.children) {
      traverse(child);
    }
  }

  if (Array.isArray(jsonData)) {
    jsonData.forEach(graph => traverse(graph));
  } else {
    traverse(jsonData);
  }
  
  return hash;
}

export function hashTojson(hash: HashMap): json[] {
  function buildTree(nodeVal: string, visited: Set<string>): json {
    visited.add(nodeVal);
    return {
      val: nodeVal,
      children: (hash[nodeVal] || [])
        .map(childVal => buildTree(childVal, visited))
    };
  }

  const allNodes = new Set(Object.keys(hash));
  const allChildren = new Set(Object.values(hash).flat());
  const rootNodes = Array.from(allNodes)
    .filter(node => !allChildren.has(node));

  if (rootNodes.length === 0 && allNodes.size > 0) {
    rootNodes.push(Array.from(allNodes)[0]);
  }

  const visited = new Set<string>();
  const graphs: json[] = [];

  rootNodes.forEach(rootVal => {
    if (!visited.has(rootVal)) {
      graphs.push(buildTree(rootVal, visited));
    }
  });

  allNodes.forEach(node => {
    if (!visited.has(node)) {
      graphs.push(buildTree(node, visited));
    }
  });

  return graphs;
}