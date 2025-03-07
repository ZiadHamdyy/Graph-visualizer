interface json {
  val: string;
  children: json[];
}

interface HashMap {
  [key: string]: string[];
}

export function jsonToHash(jsonData: json): HashMap {
  const hash: HashMap = {};

  function traverse(node: json) {
    hash[node.val] = node.children.map(child => child.val);
    
    for (const child of node.children) {
      traverse(child);
    }
  }

  traverse(jsonData);
  return hash;
}

export function hashTojson(hash: HashMap): json {
  function buildTree(nodeVal: string): json {
    return {
      val: nodeVal,
      children: (hash[nodeVal] || []).map(childVal => buildTree(childVal))
    };
  }

  const allNodes = new Set(Object.keys(hash));
  const allChildren = new Set(Object.values(hash).flat());
  const rootVal = Array.from(allNodes).find(node => !allChildren.has(node));

  if (!rootVal) {
    throw new Error("No root node found");
  }

  return buildTree(rootVal);
}