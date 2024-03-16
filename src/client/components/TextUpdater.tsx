import React from 'react';
import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import './text-updater.node.css'


export const  TextUpdaterNode = ({ data }) => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);


  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>
        <label htmlFor="text">PlaylistID:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}