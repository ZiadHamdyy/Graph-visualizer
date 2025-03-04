import cytoscape from "cytoscape";

export interface GraphController {
  addNode: (nodeId: string) => void;
  deleteNode: (nodeId: string) => void;
  addEdge: (sourceId: string, targetId: string) => void;
  deleteEdge: (sourceId: string, targetId: string) => void;
}

export const createGraphController = (cy: cytoscape.Core): GraphController => {
  const addNode = (nodeId: string) => {
    if (!cy || nodeId.trim() === "") return;

    try {
      cy.add({
        group: "nodes",
        data: { id: nodeId },
      });
      cy.layout({ name: "dagre" }).run();
    } catch (error) {
      console.error("Error adding node:", error);
    }
  };

  const deleteNode = (nodeId: string) => {
    if (!cy) return;

    try {
      const nodeToRemove = cy.$(`#${nodeId}`);
      if (nodeToRemove.length > 0) {
        cy.remove(nodeToRemove);
        cy.layout({ name: "dagre" }).run();
      }
    } catch (error) {
      console.error("Error deleting node:", error);
    }
  };

  const addEdge = (sourceId: string, targetId: string) => {
    if (!cy || sourceId.trim() === "" || targetId.trim() === "") return;

    try {
      const sourceNode = cy.$(`#${sourceId}`);
      const targetNode = cy.$(`#${targetId}`);

      if (sourceNode.length > 0 && targetNode.length > 0) {
        cy.add({
          group: "edges",
          data: {
            id: `${sourceId}${targetId}`,
            source: sourceId,
            target: targetId,
          },
        });
        cy.layout({ name: "dagre" }).run();
      }
    } catch (error) {
      console.error("Error adding edge:", error);
    }
  };

  const deleteEdge = (sourceId: string, targetId: string) => {
    if (!cy) return;
    
    try {
      const edgeToRemove = cy.$(`edge[source = "${sourceId}"][target = "${targetId}"]`);
      if (edgeToRemove.length > 0) {
        cy.remove(edgeToRemove);
        cy.layout({ name: "dagre" }).run();
      }
    } catch (error) {
      console.error("Error deleting edge:", error);
    }
  };

  return {
    addNode,
    deleteNode,
    addEdge,
    deleteEdge,
  };
};