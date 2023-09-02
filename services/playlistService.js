const { client } = require('../database/connection');
const { ObjectId } = require('mongodb');
const { getTracksFromSpotify } = require('./spotifyService');

async function getPlaylistById(playlistId) {
  if (!ObjectId.isValid(playlistId)) {
    return null; // Restituisci null o gestisci l'errore in altro modo se l'ID non è valido
  }

  const db = client.db('test');
  const collection = db.collection('playlists');
  return await collection.findOne({ "_id": new ObjectId(playlistId) });
}


async function getPlaylistsByUserId(userId) {
  const db = client.db('test');
  const collection = db.collection('playlists');

  return await collection.find({ "createdBy": new ObjectId(userId) }).toArray();
}

async function getPublicPlaylistsByUserId(userId) {
  const db = client.db('test');
  const collection = db.collection('playlists');

  return await collection.find({ "createdBy": new ObjectId(userId), "isPublished": true }).toArray();
}


async function getTracksDetailsByPlaylistId(playlistId) {
  const playlist = await getPlaylistById(playlistId);

  if (!playlist) {
    throw new Error("Playlist not found");
  }

  return getTracksFromSpotify(playlist.songs);
}


module.exports = { getPlaylistsByUserId, getPlaylistById, getPublicPlaylistsByUserId, getTracksDetailsByPlaylistId };
