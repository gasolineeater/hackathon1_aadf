/**
 * This file contains simple examples for testing Debug Visualizer
 * You can use these functions in the browser console or in a debugging session
 */

// Example 1: Simple array visualization
export function createSimpleArray() {
  const data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  
  // For Debug Visualizer, return a JSON string with the plotly format
  return JSON.stringify({
    kind: { plotly: true },
    data: [
      {
        x: Array.from({ length: data.length }, (_, i) => i + 1),
        y: data,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Sample Data'
      }
    ],
    layout: {
      title: 'Simple Array Visualization'
    }
  });
}

// Example 2: Simple graph visualization
export function createSimpleGraph() {
  // Create a simple graph with nodes and edges
  const graph = {
    kind: { graph: true },
    nodes: [
      { id: 'A', label: 'Node A' },
      { id: 'B', label: 'Node B' },
      { id: 'C', label: 'Node C' },
      { id: 'D', label: 'Node D' },
      { id: 'E', label: 'Node E' }
    ],
    edges: [
      { from: 'A', to: 'B', label: 'Link 1' },
      { from: 'A', to: 'C', label: 'Link 2' },
      { from: 'B', to: 'D', label: 'Link 3' },
      { from: 'C', to: 'E', label: 'Link 4' },
      { from: 'D', to: 'E', label: 'Link 5' }
    ]
  };
  
  return JSON.stringify(graph);
}

// Example 3: Simple table visualization
export function createSimpleTable() {
  const table = {
    kind: { table: true },
    rows: [
      { id: 1, name: 'John Doe', age: 30, role: 'Developer' },
      { id: 2, name: 'Jane Smith', age: 28, role: 'Designer' },
      { id: 3, name: 'Bob Johnson', age: 35, role: 'Manager' },
      { id: 4, name: 'Alice Brown', age: 26, role: 'Developer' },
      { id: 5, name: 'Charlie Davis', age: 40, role: 'CEO' }
    ]
  };
  
  return JSON.stringify(table);
}

// Example 4: Simple tree visualization
export function createSimpleTree() {
  const tree = {
    kind: { tree: true },
    root: {
      name: 'Root',
      children: [
        {
          name: 'Category A',
          children: [
            { name: 'Item 1', value: 10 },
            { name: 'Item 2', value: 20 }
          ]
        },
        {
          name: 'Category B',
          children: [
            { name: 'Item 3', value: 30 },
            { name: 'Item 4', value: 40 }
          ]
        }
      ]
    }
  };
  
  return JSON.stringify(tree);
}

// Example 5: Linked list visualization
export function createLinkedList() {
  // Create a linked list
  class Node {
    value: number;
    next: Node | null;
    
    constructor(value: number) {
      this.value = value;
      this.next = null;
    }
  }
  
  // Create a linked list: 1 -> 2 -> 3 -> 4 -> 5
  const head = new Node(1);
  let current = head;
  
  for (let i = 2; i <= 5; i++) {
    current.next = new Node(i);
    current = current.next;
  }
  
  // For visualization, convert to a graph
  const nodes = [];
  const edges = [];
  
  current = head;
  while (current) {
    nodes.push({
      id: `node-${current.value}`,
      label: `Node ${current.value}`,
      value: current.value
    });
    
    if (current.next) {
      edges.push({
        from: `node-${current.value}`,
        to: `node-${current.next.value}`,
        arrows: 'to'
      });
    }
    
    current = current.next;
  }
  
  const graph = {
    kind: { graph: true },
    nodes,
    edges,
    options: {
      layout: {
        hierarchical: {
          direction: 'LR',
          sortMethod: 'directed'
        }
      }
    }
  };
  
  return JSON.stringify(graph);
}

// Make these functions available globally when imported
(window as any).debugVisualizerDemo = {
  createSimpleArray,
  createSimpleGraph,
  createSimpleTable,
  createSimpleTree,
  createLinkedList
};
