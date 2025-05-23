const newDominantSpeaker = (ds, room, io) => {
    // console.log('--- new Dominant speaker ----');
    // console.log(ds)

    // look through this room's aciveSpeakerList for this producer's pid
    // we KNOW that it is an audio pid

    const i = room.activeSpeakerList.findIndex(pid => pid === ds.producer.id);

    if (i > -1) {
        // this person is in the list, and need to moved to the front;

        const [pid] = room.activeSpeakerList.splice(i, 1);

        room.activeSpeakerList.unshift(pid);
    }else {
        // this is a new producer, just add to the front
        room.activeSpeakerList.unshift(ds.producer.id);
    }

    //PLACEHOLDER - the activeSpeakerList has changed!

    // updateActiveSpeakers = mute/unmute / get new transports



};

module.exports = newDominantSpeaker;