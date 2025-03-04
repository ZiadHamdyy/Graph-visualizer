"use client"
import cytoscape from 'cytoscape';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// @ts-expect-error
import dagre from "cytoscape-dagre";
import { selectAllElements } from '../Redux/graphSlice';

cytoscape.use(dagre);

export default function Graph() {
  const cyRef = useRef<HTMLDivElement>(null);
  const [cy, setCy] = useState<cytoscape.Core | null>(null);
  const dispatch = useDispatch();
  const elements = useSelector(selectAllElements);

  // Initialize cytoscape instance
   // Initialize cytoscape instance
  useEffect(() => {
    if (!cyRef.current) return;

    const cyInstance = cytoscape({
      container: cyRef.current,
      elements: [],  // Start with empty elements
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#3498db",
            "border-width": 2,
            "border-color": "#2980b9",
            "width": 40,
            "height": 40,
            "text-valign": "center",
            "text-halign": "center",
            color: "#fff",
            "font-size": "14px",
            label: "data(id)",
          },
        },
        {
          selector: "edge",
          style: {
            width: 4,
            "line-color": "#2c3e50",
            "target-arrow-color": "#2c3e50",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          },
        },
      ],
      layout: {
        name: 'preset'  // Use preset layout initially
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: true,
      autounselectify: false,
      wheelSensitivity: 0.1,
    });

    setCy(cyInstance);
    return () => cyInstance.destroy();
  }, []);

  // Handle elements updates
  useEffect(() => {
    if (!cy) return;

    // Update elements with positions
    cy.elements().remove();
    const elemsWithPositions = elements.map(ele => ({
      ...ele,
      position: ele.position || { x: 0, y: 0 }
    }));
    cy.add(elemsWithPositions);

    // Run layout
    const layout = cy.layout({
      name: "dagre",
      rankdir: "TB",
      nodeSep: 70,
      edgeSep: 10,
      rankSep: 100,
      animate: true,
      fit: true,
      padding: 50
    });

    layout.run();
  }, [cy, elements]);

  return (
    <div ref={cyRef} className="w-full h-full" />
  );
}