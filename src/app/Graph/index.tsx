"use client"
import cytoscape from 'cytoscape';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// @ts-expect-error - cytoscape-dagre types are not available
import dagre from "cytoscape-dagre";
import { selectAllElements, setCurrentGraph } from '../Redux/graphSlice';

cytoscape.use(dagre);

export default function Graph() {
  const cyRef = useRef<HTMLDivElement>(null);
  const [cy, setCy] = useState<cytoscape.Core | null>(null);
  const elements = useSelector(selectAllElements);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cyRef.current) return;

    const cyInstance = cytoscape({
      container: cyRef.current,
      elements: [],
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
        {
          selector: '.highlighted',
          style: {
            'background-color': '#48bb78',
            'border-color': '#38a169',
            'line-color': '#38a169',
            'target-arrow-color': '#38a169',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': 300
          }
        },
        {
          selector: '.highlighte',
          style: {
            'background-color': '#e74c3c',
            'border-color': '#c0392b',
            'line-color': '#e74c3c',
            'target-arrow-color': '#e74c3c',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': 300
          }
        },
        {
          selector: '.found',
          style: {
            'background-color': '#9C27B0',
            'border-color': '#512DA8',
            'line-color': '#9C27B0',
            'target-arrow-color': '#9C27B0',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': 300
          }
        }
      ],
      layout: {
        name: 'preset'
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: true,
      autounselectify: false,
    });

    setCy(cyInstance);
    return () => cyInstance.destroy();
  }, []);

  useEffect(() => {
    if (!cy) return;

    cy.elements().remove();
    const elemsWithPositions = elements.map(ele => ({
      ...ele,
      position: ele.position || { x: 0, y: 0 }
    }));
    cy.add(elemsWithPositions);

    interface DagreLayoutOptions {
      name: string;
      rankdir: string;
      nodeSep: number;
      edgeSep: number;
      rankSep: number;
      animate: boolean;
      fit: boolean;
      padding: number;
      spacingFactor: number;
      componentSpacing: number;
    }
    const layoutOptions: DagreLayoutOptions = {
      name: "dagre",
      rankdir: "TB",
      nodeSep: 70,
      edgeSep: 10,
      rankSep: 100,
      animate: true,
      fit: true,
      padding: 50,
      spacingFactor: 1,
      componentSpacing: 80
    };
    const layout = cy.layout(layoutOptions);

    layout.run();
    dispatch(setCurrentGraph(cy));
  }, [cy, elements, dispatch]);

  return (
    <div ref={cyRef} className="w-full h-full" />
  );
}