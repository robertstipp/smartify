import axios from 'axios';
import {getToken} from '../utils/token';

const getPlaylistAPIEndpoint = 'https://api.spotify.com/v1/playlists/'
const getAudioFeaturesAPIEndpoint = 'https://api.spotify.com/v1/audio-features?'

export const getPlaylist = async (playlistID : string) => {
  const playlistURL = getPlaylistAPIEndpoint + playlistID
  const accessToken = getToken();

  let response = await axios.get(playlistURL, { headers: { Authorization: 'Bearer ' + accessToken } });

  // Gets all tracks on playlist
  let {items, next} = response.data.tracks;
  const {name} = response.data;
  
  while (next) {
    response = await axios.get(next, {headers: {Authorization: 'Bearer ' + accessToken }});
    items = items.concat(response.data.items)
    next = response.data.next;
  } 
  const tracksWithFeatures = await getAudioFeatures(items);
  return tracksWithFeatures;
}


// REFACTOR to make more readable
export const getAudioFeatures = async (tracks : any) => {
  const accessToken = getToken();
  const chunkedTracks = [];
  let tempTracks : any = tracks;

  // Chunk tracks into groups of 100
  while (tempTracks.length > 0) {
    const first100 = tempTracks.slice(0,100);
    tempTracks = tempTracks.slice(100);
    chunkedTracks.push(first100);
  }

  const result = [];
  // Get AudioFeatures of chunks
  for (const chunk of chunkedTracks) {
    const trackIDs = chunk.map((singleTrack : any)=>singleTrack.track.id)
    const audioFeaturesURL = getAudioFeaturesAPIEndpoint + "ids=" + parseTrackIds(trackIDs);
    const response = await axios.get(audioFeaturesURL, {headers: {Authorization: 'Bearer ' + accessToken }})
    result.push(response.data.audio_features)
  }

  for (let i = 0; i < chunkedTracks.length; i++) {
    for (let j = 0; j < chunkedTracks[i].length; j++) {
      chunkedTracks[i][j].track.audio_features = result[i][j]
    }
  }

  return chunkedTracks.reduce((acc,curr)=>acc.concat(...curr), [])
}

const parseTrackIds = (trackIDs : string[]) => {
  return trackIDs.join("%2C")
}

export const getPlayListInfo = async (playlistID : string) => {
  const accessToken = getToken();
  const playlistInfoUrl = getPlaylistAPIEndpoint  + playlistID
  console.log(playlistInfoUrl)
  const response = await axios.get(playlistInfoUrl, {headers: {Authorization: 'Bearer ' + accessToken }})
  return response.data
}
