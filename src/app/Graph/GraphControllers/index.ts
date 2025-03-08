import { sleep } from "@/app/utils/sleep";
import cytoscape from "cytoscape";
import { useState, useRef } from "react";

export const useGraphHighlight = (cy: cytoscape.Core | null) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const isPausedRef = useRef(isPaused);
  const isRunningRef = useRef(isRunning);

  const togglePause = () => {
    setIsPaused((prev) => {
      isPausedRef.current = !prev;
      return !prev;
    });
  };

  const highlightElement = (elementId: string) => {
    if (!cy) return;
    cy.elements().removeClass("highlighte");
    cy.getElementById(elementId).addClass("highlighted highlighte");
  };

  const resetElement = () => {
    if (!cy) return;
    setIsPaused(false);
    setIsRunning(false);
    isPausedRef.current = false;
    isRunningRef.current = false;
    cy.elements().removeClass("highlighte highlighted found");
  };
  const elementFound = (searchNode: string) => {
    if (!cy) return;

    cy.elements().removeClass("found");

    const target = cy.getElementById(searchNode);

    if (target && target.length > 0) {
      target.addClass("found");
    }
  };

  const iterateAndHighlight = async (elementIds: string[], time: number) => {
    setIsRunning(true);
    isRunningRef.current = true;
    let complete = false;
    for (const id of elementIds) {
      if (!isRunningRef.current) return;

      while (isPausedRef.current) {
        await sleep(100);
        if (!isRunningRef.current) return;
      }

      highlightElement(id);
      await sleep(time);
    }
    highlightElement(elementIds[-1]);
    setIsRunning(false);
    isRunningRef.current = false;
    complete = true;
    return complete;
  };

  return {
    highlightElement,
    resetElement,
    iterateAndHighlight,
    togglePause,
    elementFound,
  };
};
