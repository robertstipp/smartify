import React from 'react'
import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar'
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';

import './components/index.css'

import { TextUpdaterNode } from './components/TextUpdater';
import CustomNode from './components/CustomNode'
import { PlaylistSourceNode } from './components/PlaylistSourceNode';

const nodeTypes = {textUpdater: TextUpdaterNode, customNode: CustomNode, playlistSource: PlaylistSourceNode}

import './components/text-updater.node.css'

const initNodes = [
    {
        id: '1',
        position: {x: 50, y: 100},
        className: 'customNode',
        type: 'playlistSource',
        style: {},
        data: {
            label: 'list1',
            sourceId: "0mLh5cKvFyIyKh8llfT6rw?si=7e03f6f67ed44944",
            type: "source"
        }
    },
    {
        id: '2',
        position: {x: 200, y: 100},
        data: {
            label: 'list2',
            sourceId: "0mLh5cKvFyIyKh8llfT6rw?si=7e03f6f67ed44944",
            type: "source"
        }
    },
    {
        id: '3',
        position: {x: 125, y: 200},
        data: {
            label: 'list3',
            type: "agg"
        }
    },
    {
        id: '4',
        position: {x: 200, y: 500},
        data: {
            label: 'list2',
            sourceId: "2uL4Jem8WFTw5M5LOQJuXy?si=39d41c5c8a99466e",
            type: "source"
        }
    },
]

const initEdges = [
    
    {id: 'edge2', source: '2', target: '3'},
]




export const App = () => {
    const [nodes,setNodes] = useState(initNodes)
    const [edges,setEdges] = useState(initEdges)
    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
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
            if (node.data.type === 'source') {
                sources.push({id: node.id, playlistId:node.data.sourceId})
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
    

    const addNode = () => {
        const newNode = {
            id: nodes.length + 1,
            position: {x: 200, y: 500},
            data: {
                label: 'list2',
                sourceId: "2uL4Jem8WFTw5M5LOQJuXy?si=39d41c5c8a99466e",
                type: "source"
            }
        }
        setNodes(prevNodes=>prevNodes.concat(newNode))
        console.log(nodes.length)
    }
    

    return (
        
            <div style={{ height: '90vh' }}>
                <div className="controlPanel">
                <button style={{position: "absolute", zIndex: "999"}} onClick={()=>buildGraph(nodes,edges)}>RUN PIPELINE</button>
                <button onClick={addNode} style={{position: "absolute",top:"20px", zIndex: "999"}}>Add Node</button>
                
                </div>
                

                <ReactFlow
                nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                >
                <Background />
                <Controls />
                </ReactFlow>
            </div>
        
    );
}