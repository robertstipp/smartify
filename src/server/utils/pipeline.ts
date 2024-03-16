import {getPlaylist} from '../controllers/playlist'

interface Node {
  type: string;
  // input : PromiseArray<any>; 
  // output: Tracks[]
}

interface Aggregation {
  sources : Source[];
  output: any[];
}

interface Source {
  id: string;
  type: string;
  tracks : any[];
  name: string;
  output: Node;
}

class Source {
  constructor(id : string) {
    this.id = id;
    this.type = "playlist";
    this.tracks = [];
    this.name = "";
    this.output = null;
  }

  connect(node: Node) {
    this.output = node;
  }
}

class Node {
  constructor(type: string) {
    this.type = type;    
  }
}

class Aggregation extends Node {
  constructor(type: string,sources : Source[]) {
    super(type)
    this.sources = sources
    this.output = this.agg();
  }

  agg () {
    return this.sources.reduce((acc,curr)=>acc.concat(...curr.tracks),[])
  }
}

class Pipeline {
  nodes: Node[];
  sources: Source[];

  constructor() {
    this.nodes = [];
    this.sources = [];
  }

  // Example methods that might use the typed arrays
  addNode(node: Node) {
    this.nodes.push(node);
  }

  addSource(source: Source) {
    this.sources.push(source);
  }
  
  async resolveSources() {
    const promises = this.sources.map(async (source) => {
      const response = await getPlaylist(source.id);
      source.tracks = response.tracks;
      source.name = response.name;
      // source.tracks = await getPlaylist(source.id);
    });
    await Promise.all(promises);
  }

  
}

const pipeline = new Pipeline();

const source0 : Source = new Source("0mLh5cKvFyIyKh8llfT6rw?si=7e03f6f67ed44944") 
const source1 : Source = new Source("4kb4pj3xd7JnqAwujsGJqK?si=9300a3eab5614f5a")
const source3 : Source = new Source("4dHEviheRLwDUoUuwvvbPy?si=729aba9405c04153")
// const source1 = {id: "0mLh5cKvFyIyKh8llfT6rw?si=7e03f6f67ed44944", type: "playlist", tracks: []};
// const source2 : Source = {id: "4kb4pj3xd7JnqAwujsGJqK?si=9300a3eab5614f5a", type: "playlist", tracks: []}; 


/*
      Array of Nodes
  [
    {source1,agg1}
    {source2,agg1}
    {source3,filter1}
    {agg1,filter1}
  ]
*/
/*
parse Nodes
Sources
  loop through nodes
  if (source) sources.push(node)
  if (agg) nodes.push(agg)
  
*/
// resolve all sources
// travel to agg1 (resolve agg1)
// look at inputs as group and assign it outout



/*

setupPipeline(...sources) {

  for (const source of sources) {
    addPipeline(source); 
  }

  await.pipeline.resolveSources(); 
}
*/
async function setupPipeline() {
  pipeline.addSource(source0);
  pipeline.addSource(source1);
  pipeline.addSource(source3);
  await pipeline.resolveSources();

  // Aggregation
  const aggNode = new Aggregation("agg", [source0, source1])
  console.log(aggNode.output)
  // console.log(agg[0].track.audio_features.tempo)
  // const filter = agg.filter(t=>t.track.audio_features.tempo > 140);
  // console.log(agg.length);
  // console.log(filter.length);
  // console.log(pipeline);
}

setupPipeline().catch(console.error);


