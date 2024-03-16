import { getPlaylist } from '../controllers/playlist';

class Source {
  id: string;
  output: Promise<any>;
  constructor(id: string) {
    this.id = id;
    this.output = getPlaylist(id); // This is a promise.
  }
}

class Agg {
  output: Promise<any[]>;
  constructor(sources: (Source | Agg)[]) {
    // Extract the output promises whether the element is a Source or an Agg instance.
    const allPromises = sources.map(s => s instanceof Source ? s.output : s.output);
    this.output = Promise.all(allPromises).then(result => result.reduce((acc,curr) => acc.concat(...curr),[]))
  }
}

class Filter {
  output: Promise<any[]>;
  constructor(source: Agg, filterFunc: (item: any) => boolean) {
    // source.output is already a promise, no need for Promise.resolve
    this.output = source.output.then(items => items.filter(filterFunc));
  }
}

class Sort {
  output: Promise<any[]>
  constructor(source: (Filter | Agg), sortFunc: (a: any, b: any) => number) {
    this.output = source.output.then(items => items.sort(sortFunc))
  }
}

class Shuffle {
  output: Promise<any[]>
  constructor(source: (Filter | Agg)) {
    this.output = source.output.then(items=>this.shuffle(items))
  }

  shuffle (array : any[]) {
      let currentIndex = array.length, randomIndex;
    
      // While there remain elements to shuffle...
      while (currentIndex !== 0) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
    
      return array;
    }
    
    
}

// TODO Finish Pipeline Function
// Cant figure out why agg reduce function is calling output undefined
export const runPipeline = async (agg:any, sources : any) => {
  
  const sourceMap = sources.reduce((acc: any, curr : any)=>{
    acc.set(curr.id,new Source(curr.playlistId))
    return acc
  },new Map())
  

  const aggMap = agg.reduce((acc : any, curr : any)=>{
    const sources = curr.edges.map((edge:any)=>sourceMap.get(edge));
    acc.set(curr.id,new Agg(sources));
    return acc
  }, new Map())
  console.log(aggMap) 
  // temp
  // @ts-ignore
  // const output = Array.from(aggMap)[0][0]
  // return aggMap.get(output).output.then((tracks:any)=>tracks)
  // aggMap.get('3').then((tracks : any) =>console.log(tracks))
}




// Create Source instances with their respective IDs.
/*
const source0 = new Source("0mLh5cKvFyIyKh8llfT6rw?si=7e03f6f67ed44944");
const source1 = new Source("4kb4pj3xd7JnqAwujsGJqK?si=9300a3eab5614f5a");
// Combine source1 & source2
const source2 = new Agg([source0, source1]);
const source4 = new Source("07wGa4WpYsCtMy7KBLHpa8?si=ed0b799906204275")
// Create another Agg instance. This time we want to
const source3 = new Agg([source2,source4]);

const filterPopularity = (item : any) => item.track.popularity > 52;
const sortPopularity = (a: any, b: any) => a.track.popularity - b.track.popularity;
// If you want to log the combined tracks, you must wait for the promises to resolve.
const filtered = new Filter(source3, filterPopularity)
const sorted = new Sort(filtered,sortPopularity)
const shuffled = new Shuffle(sorted);
shuffled.output.then(combinedTracks=>{

const features = combinedTracks.map(t=>t.track.audio_features)
console.table(features,["danceability","tempo","energy"])
})
*/