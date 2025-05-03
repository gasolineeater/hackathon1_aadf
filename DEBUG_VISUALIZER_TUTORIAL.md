# Debug Visualizer Tutorial

This tutorial will guide you through using the Debug Visualizer extension in VS Code with your procurement platform project.

## What is Debug Visualizer?

Debug Visualizer is a VS Code extension that allows you to visualize data structures while debugging. It's like the VS Code's watch view, but with rich visualizations of the watched value.

## Setup

1. Make sure you have the Debug Visualizer extension installed in VS Code.
2. We've created a `.vscode/launch.json` file with a debugging configuration for your Next.js application.
3. We've also created a demo page at `/debug-visualizer` that contains examples of different visualizations.

## How to Use Debug Visualizer

### Step 1: Start a debugging session

1. Open VS Code and navigate to the Debug view (Ctrl+Shift+D or Cmd+Shift+D on Mac).
2. Select the "Next.js: debug" configuration from the dropdown.
3. Click the green play button to start debugging.

### Step 2: Open the Debug Visualizer view

1. While the application is running, open the command palette (Ctrl+Shift+P or Cmd+Shift+P on Mac).
2. Type "Debug Visualizer: New View" and select it.
3. A new panel will open where you can enter expressions to visualize.

### Step 3: Navigate to the demo page

1. Open your browser and go to `http://localhost:3000/debug-visualizer`.
2. Click the "Load Data" button to populate the state with sample data.

### Step 4: Set breakpoints and visualize data

1. In VS Code, open the `src/app/debug-visualizer-demo.tsx` file.
2. Set breakpoints inside any of the visualization functions (e.g., `createTenderGraph`, `createProposalsTable`, etc.).
3. Interact with the demo page to trigger these functions.
4. When the breakpoint is hit, the debugger will pause execution.
5. In the Debug Visualizer view, enter the expression for the function you want to visualize (e.g., `createTenderGraph()`).
6. The Debug Visualizer will show a visual representation of the data.

## Visualization Examples

### Graph Visualization

The `createTenderGraph()` function creates a graph showing the relationship between a tender and its proposals. When you enter this expression in the Debug Visualizer, you'll see a network graph with nodes and edges.

```javascript
// Example of what createTenderGraph() returns
{
  "kind": { "graph": true },
  "nodes": [
    { "id": "tender-1", "label": "Office Supplies", "group": "tender" },
    { "id": "proposal-1", "label": "Vendor A", "group": "proposal", "status": "submitted" },
    { "id": "proposal-2", "label": "Vendor B", "group": "proposal", "status": "submitted" }
  ],
  "edges": [
    { "from": "tender-1", "to": "proposal-1", "label": "5000 USD" },
    { "from": "tender-1", "to": "proposal-2", "label": "4800 USD" }
  ]
}
```

### Table Visualization

The `createProposalsTable()` function creates a table of proposals. When visualized, you'll see a neat table with columns for vendor, status, amount, etc.

```javascript
// Example of what createProposalsTable() returns
{
  "kind": { "table": true },
  "rows": [
    { "id": "proposal-1", "vendor": "Vendor A", "status": "submitted", "amount": "5000 USD", "submissionDate": "5/1/2023" },
    { "id": "proposal-2", "vendor": "Vendor B", "status": "submitted", "amount": "4800 USD", "submissionDate": "5/2/2023" }
  ]
}
```

### Tree Visualization

The `createTenderTree()` function creates a hierarchical tree of the tender structure. The visualization will show a tree with expandable nodes.

```javascript
// Example of what createTenderTree() returns
{
  "kind": { "tree": true },
  "root": {
    "name": "Office Supplies Tender",
    "children": [
      {
        "name": "Documents",
        "children": [
          { "name": "RFP Document", "value": 1048576 },
          { "name": "Terms and Conditions", "value": 524288 }
        ]
      },
      {
        "name": "Evaluation Criteria",
        "children": [
          { "name": "Price", "value": 40 },
          { "name": "Quality", "value": 30 },
          { "name": "Delivery Time", "value": 30 }
        ]
      }
    ]
  }
}
```

### Bar Chart Visualization

The `createEvaluationBarChart()` function creates a bar chart of evaluation scores. The visualization will show a grouped bar chart.

```javascript
// Example of what createEvaluationBarChart() returns
{
  "kind": { "plotly": true },
  "data": [
    {
      "type": "bar",
      "x": ["Vendor A", "Vendor B"],
      "y": [85, 82],
      "name": "Total Score"
    },
    {
      "type": "bar",
      "x": ["Vendor A", "Vendor B"],
      "y": [80, 85],
      "name": "Technical Score"
    },
    {
      "type": "bar",
      "x": ["Vendor A", "Vendor B"],
      "y": [90, 79],
      "name": "Financial Score"
    }
  ],
  "layout": {
    "title": "Proposal Evaluation Scores",
    "barmode": "group"
  }
}
```

## Advanced Usage

### Visualizing Your Own Data

You can visualize any data structure in your application by following these steps:

1. Format your data according to one of the supported visualization types (graph, table, tree, etc.).
2. Convert it to a JSON string.
3. When debugging, enter an expression in the Debug Visualizer that evaluates to this JSON string.

### Supported Visualization Types

Debug Visualizer supports various visualization types:

- **Graph**: Network graphs with nodes and edges
- **Table**: Tabular data with rows and columns
- **Tree**: Hierarchical tree structures
- **Plotly**: Various chart types (bar, line, scatter, etc.)
- **Text**: Simple text visualization
- **Image**: Base64-encoded images

### Using Data Extractors

For JavaScript/TypeScript, Debug Visualizer provides data extractors that can automatically convert certain data structures to visualizable formats:

- **ToString**: Calls `.toString()` on values
- **TypeScript AST**: Visualizes TypeScript AST nodes
- **Plotly y-Values**: Plots arrays of numbers
- **Object Graph**: Visualizes object relationships
- **Array Grid**: Creates grid visualizations for arrays

## Troubleshooting

- If the visualization doesn't appear, check that your expression evaluates to a valid JSON string matching one of the supported visualization formats.
- Make sure you're in an active debugging session when using Debug Visualizer.
- If using complex objects, try using the Object Graph data extractor to visualize their structure.

## Resources

- [Debug Visualizer Extension](https://marketplace.visualstudio.com/items?itemName=hediet.debug-visualizer)
- [Visualization Playground](https://hediet.github.io/visualization/) - Try out different visualizations
- [GitHub Repository](https://github.com/hediet/vscode-debug-visualizer) - Source code and documentation
