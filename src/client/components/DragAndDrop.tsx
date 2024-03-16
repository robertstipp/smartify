import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { PlaylistSourceNode } from './PlaylistSourceNode';
import FlowContext from './FlowContext';
import Sidebar from './Sidebar';

import './index.css';
import { TextUpdaterNode } from './TextUpdater';

const initialNodes = [
  {
    id: '1',
    type: 'playlistSource',
    data: { label: 'source node' },
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const nodeTypes = {playlistSource: PlaylistSourceNode, textUpdater: TextUpdaterNode}
const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );
  
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const sourceNodeData = {
        data : {label: `${type} node`}

      }
      const newNode = {
        id: getId(),
        type,
        position,
        data: {label: `${type} node`}
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  const buildGraph = (nodes,edges) => {
    const graph = {}
    for (const node of nodes) {
        graph[node.id] =  {id: node.data.sourceId, edges : [], type : node.data.type}
    }
    for (const edge of edges) {
        graph[edge.target].edges.push(edge.source)
    }
    
    const sources : any[] = [];
    const agg : any[] = [];
    const output = null;

    for (const node of nodes) {
        if (node.type === 'playlistSource') {

            sources.push({id: node.id, playlistId:node.data.playlistID})
        } else {
            agg.push({id: node.id, edges: graph[node.id].edges})
        }
    }
    
    fetchPipelineOutput(agg,sources)
}

const fetchPipelineOutput = async (agg, sources) => {
    const object = { agg, sources };
    console.log(object)
    try {
    const response = await fetch("/runPipeline", {
        method: "Post",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(object),
        });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }  
      // Assuming the response is also JSON
    const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

  const updateNodeData = (nodeId, newData) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  };
  
  return (
    <div style={{height: "100vh"}} className="dndflow">
      <button 
      style={{positon: "absolute"}}
      onClick={()=>console.log(nodes)}
      >
      CLICK
      </button>
      <button style={{position: "absolute", zIndex: "999"}} onClick={()=>buildGraph(nodes,edges)}>RUN PIPELINE</button>
      <FlowContext.Provider value={{ updateNodeData }}>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            
          >
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
      </FlowContext.Provider>
    </div>
  );
};

export default DnDFlow;
