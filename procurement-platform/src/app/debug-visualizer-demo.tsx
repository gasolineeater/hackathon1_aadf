'use client';

import { useState, useEffect } from 'react';
import { TenderService, ProposalService } from './services/procurement.service';
import { Tender, Proposal, TenderStatus } from './types/procurement';
import * as SimpleExamples from './debug-visualizer-simple';

export default function DebugVisualizerDemo() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);

  // Make simple examples available globally when component mounts
  useEffect(() => {
    // This makes the examples accessible in the browser console
    // You can test them by typing: debugVisualizerDemo.createSimpleGraph()
    (window as any).debugVisualizerDemo = SimpleExamples;
  }, []);

  // Load data for visualization
  const loadData = () => {
    // Get all tenders
    const allTenders = TenderService.getAllTenders();
    setTenders(allTenders);

    // Get first tender's proposals if available
    if (allTenders.length > 0) {
      const firstTender = allTenders[0];
      setSelectedTender(firstTender);

      const tenderProposals = ProposalService.getProposalsByTenderId(firstTender.id);
      setProposals(tenderProposals);
    }
  };

  // Create a graph structure for visualization
  const createTenderGraph = () => {
    if (!selectedTender) return null;

    // Create a graph structure that Debug Visualizer can render
    const tenderProposals = ProposalService.getProposalsByTenderId(selectedTender.id);

    // Create nodes for the graph
    const nodes = [
      { id: selectedTender.id, label: selectedTender.title, group: 'tender' }
    ];

    // Add proposal nodes
    tenderProposals.forEach(proposal => {
      nodes.push({
        id: proposal.id,
        label: proposal.vendorName,
        group: 'proposal',
        status: proposal.status
      });
    });

    // Create edges connecting tender to proposals
    const edges = tenderProposals.map(proposal => ({
      from: selectedTender.id,
      to: proposal.id,
      label: `${proposal.financialProposal.amount} ${proposal.financialProposal.currency}`
    }));

    // Create a visualization object for Debug Visualizer
    const graph = {
      kind: { graph: true },
      nodes,
      edges
    };

    // For Debug Visualizer, we need to return a JSON string
    return JSON.stringify(graph);
  };

  // Create a table visualization
  const createProposalsTable = () => {
    if (proposals.length === 0) return null;

    // Create a table structure for Debug Visualizer
    const table = {
      kind: { table: true },
      rows: proposals.map(proposal => ({
        id: proposal.id,
        vendor: proposal.vendorName,
        status: proposal.status,
        amount: `${proposal.financialProposal.amount} ${proposal.financialProposal.currency}`,
        submissionDate: proposal.submissionDate.toLocaleDateString()
      }))
    };

    return JSON.stringify(table);
  };

  // Create a tree visualization of tender structure
  const createTenderTree = () => {
    if (!selectedTender) return null;

    // Create a tree structure for Debug Visualizer
    const tree = {
      kind: { tree: true },
      root: {
        name: selectedTender.title,
        children: [
          {
            name: "Documents",
            children: selectedTender.documents.map(doc => ({
              name: doc.name,
              value: doc.fileSize
            }))
          },
          {
            name: "Evaluation Criteria",
            children: selectedTender.evaluationCriteria.map(criterion => ({
              name: criterion.name,
              value: criterion.weight
            }))
          },
          {
            name: "Timeline",
            children: [
              { name: "Publication", value: selectedTender.timeline.publicationDate.toLocaleDateString() },
              { name: "Submission Deadline", value: selectedTender.timeline.submissionDeadline.toLocaleDateString() }
            ]
          }
        ]
      }
    };

    return JSON.stringify(tree);
  };

  // Create a bar chart visualization
  const createEvaluationBarChart = () => {
    if (proposals.length === 0) return null;

    // Create random evaluation scores for demonstration
    const evaluatedProposals = proposals.map(proposal => {
      const technicalScore = Math.floor(Math.random() * 50) + 50; // 50-100
      const financialScore = Math.floor(Math.random() * 50) + 50; // 50-100
      const totalScore = (technicalScore + financialScore) / 2;

      return {
        vendor: proposal.vendorName,
        technicalScore,
        financialScore,
        totalScore
      };
    });

    // Create a plotly visualization for Debug Visualizer
    const plotData = {
      kind: { plotly: true },
      data: [
        {
          type: 'bar',
          x: evaluatedProposals.map(p => p.vendor),
          y: evaluatedProposals.map(p => p.totalScore),
          name: 'Total Score'
        },
        {
          type: 'bar',
          x: evaluatedProposals.map(p => p.vendor),
          y: evaluatedProposals.map(p => p.technicalScore),
          name: 'Technical Score'
        },
        {
          type: 'bar',
          x: evaluatedProposals.map(p => p.vendor),
          y: evaluatedProposals.map(p => p.financialScore),
          name: 'Financial Score'
        }
      ],
      layout: {
        title: 'Proposal Evaluation Scores',
        barmode: 'group'
      }
    };

    return JSON.stringify(plotData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Visualizer Demo</h1>

        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">How to Use Debug Visualizer</h2>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Method 1: Using the Browser Console (Easiest)</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Open Debug Visualizer by running the command "Debug Visualizer: New View" in VS Code</li>
              <li>Open your browser's developer console (F12 or right-click → Inspect → Console)</li>
              <li>Type one of the example expressions like <code>debugVisualizerDemo.createSimpleGraph()</code> in the console</li>
              <li>Copy the JSON string result from the console</li>
              <li>Paste the JSON string into the Debug Visualizer view</li>
            </ol>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Method 2: Using Breakpoints (More Advanced)</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Click the "Load Data" button below to populate the state with data</li>
              <li>Set a breakpoint on any of the visualization functions (createTenderGraph, createProposalsTable, etc.)</li>
              <li>Open Debug Visualizer by running the command "Debug Visualizer: New View"</li>
              <li>Start debugging using the "Next.js: debug" configuration</li>
              <li>When the breakpoint is hit, enter the expression in the Debug Visualizer view</li>
              <li>For example, when stopped at createTenderGraph, enter the expression "createTenderGraph()"</li>
            </ol>
          </div>

          <div className="mt-6">
            <button
              onClick={loadData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Load Data
            </button>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Visualization Functions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Graph Visualization</h3>
              <p className="text-gray-600">Visualizes the relationship between a tender and its proposals as a graph.</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">createTenderGraph()</pre>
            </div>

            <div>
              <h3 className="font-medium">Table Visualization</h3>
              <p className="text-gray-600">Displays proposals in a table format.</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">createProposalsTable()</pre>
            </div>

            <div>
              <h3 className="font-medium">Tree Visualization</h3>
              <p className="text-gray-600">Shows the tender structure as a hierarchical tree.</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">createTenderTree()</pre>
            </div>

            <div>
              <h3 className="font-medium">Bar Chart Visualization</h3>
              <p className="text-gray-600">Displays evaluation scores as a bar chart.</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">createEvaluationBarChart()</pre>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Simple Examples</h2>
          <p className="mb-4">These examples don't require loading data and can be used immediately in the Debug Visualizer:</p>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Simple Array Visualization</h3>
              <p className="text-gray-600">Visualizes a simple array as a line chart.</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">debugVisualizerDemo.createSimpleArray()</pre>
            </div>

            <div>
              <h3 className="font-medium">Simple Graph Visualization</h3>
              <p className="text-gray-600">Visualizes a simple graph with nodes and edges.</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">debugVisualizerDemo.createSimpleGraph()</pre>
            </div>

            <div>
              <h3 className="font-medium">Simple Table Visualization</h3>
              <p className="text-gray-600">Visualizes a simple table with rows and columns.</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">debugVisualizerDemo.createSimpleTable()</pre>
            </div>

            <div>
              <h3 className="font-medium">Simple Tree Visualization</h3>
              <p className="text-gray-600">Visualizes a simple hierarchical tree.</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">debugVisualizerDemo.createSimpleTree()</pre>
            </div>

            <div>
              <h3 className="font-medium">Linked List Visualization</h3>
              <p className="text-gray-600">Visualizes a linked list as a directed graph.</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">debugVisualizerDemo.createLinkedList()</pre>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Data Preview</h2>
          {tenders.length > 0 ? (
            <div>
              <p>Loaded {tenders.length} tenders and {proposals.length} proposals.</p>
              {selectedTender && (
                <div className="mt-4">
                  <h3 className="font-medium">Selected Tender: {selectedTender.title}</h3>
                  <p className="text-gray-600">Status: {selectedTender.status}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">No data loaded yet. Click the "Load Data" button above.</p>
          )}
        </div>
      </div>
    </div>
  );
}
