import React, {useState, useCallback, useContext} from 'react';
import { Handle, Position} from 'reactflow';
import FlowContext from './FlowContext';

const PlaylistInfo = ({numTracks,name}) => {
  return (
    <>
      <div>
        <p>{name} : {numTracks}</p>
      </div>
    </>
  )
}

export const PlaylistSourceNode = ({id, data}) => {
  const { updateNodeData } = useContext(FlowContext);
  const [input, setInput] = useState('')
  const [playlistInfo, setPlaylistInfo] = useState(null);
  
  const onChange = useCallback((e)=>{
    setInput(e.target.value)
  },[])

  const getPlaylist = async () => {
    const cleanURL = (url) => url.replace("https://open.spotify.com/playlist/","")

    const playlistID = cleanURL(input);
    const object = {
      playlistID
    }
    updateNodeData(id, {playlistID})
    try {
      const response = await fetch("/getPlaylist", {
          method: "Post",
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(object),
          });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }   
      const data = await response.json();
        
        setPlaylistInfo(data)
        
      } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
      }
      
      
  }
    


  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div style={{border: "1px solid black", padding: "8px"}}>
        <label htmlFor="text">PlayListID: {id}</label>
        <input type="text"  onChange={onChange} value={input} />
        <button onClick={getPlaylist} type="button">Load Playlist</button>
        
        {playlistInfo && <PlaylistInfo name={playlistInfo.name} numTracks={playlistInfo.tracks.total}/>}
        <button onClick={()=>{updateNodeData(id, {sourceId: input})}}>Click</button>
      </div>

      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  )
}
