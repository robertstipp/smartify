import express from 'express';
import {runPipeline} from '../server/utils/pipeline2'
// // import { createPlaylistURL, createPlaylist, addTracks } from './controllers/playlist';
// import { generateRecommendations } from './controllers/recommendations'
import { getPlayListInfo } from './controllers/playlist';

import { createCredentialsObject, createAuthURL, getToken, getNewToken } from './controllers/spotifyAuth';

export const router = express.Router();

// SEND Request to spotify
router.get("/login", createCredentialsObject, createAuthURL, (req, res) => {
    return res.redirect(res.locals.authURL)
})

// callback used by Spotify for OAuth process
router.get('/callback', getToken, async (req, res) => {
    return res.redirect("http://localhost:3000/homepage")
})

// refresh Spotify token
router.get('/refreshToken', getNewToken, async (req, res) => {
    return res.status(200).json(res.locals.newToken)
})
router.post('/runPipeline', async (req,res) => {
    const {agg, sources} = req.body;
    console.log({agg},{sources})
    const result = await runPipeline(agg, sources)
    // console.log(result.length)
    res.send(200);
})
router.post('/getPlaylist', async (req,res) => {
    const {playlistID} = req.body;
    const playlistInfo = await getPlayListInfo(playlistID);
    res.status(200).json(playlistInfo)
})

