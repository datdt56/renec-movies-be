const {adminFirestore} = require("../common/firebaseAdmin");
const ytdl = require('ytdl-core');
const sendWebsocketMessage = require("../common/sendWebsocketMessage");
const shareYoutubeVideo = async (req, res) => {
    try{
        const videoURL = req.body?.videoURL
        if (!videoURL) return res.status(400).send({ message: "videoURL is required"})

        const isUrlValid = ytdl.validateURL(videoURL)
        if (!isUrlValid) return res.status(400).send({ message: "not a valid youtube url"})

        const youtubeId = ytdl.getVideoID(videoURL)
        if (!youtubeId) return res.status(400).send({ message: "unable to get youtube video id"})

        const videoInfo = await ytdl.getInfo(videoURL)

        const email = req.user.email
        await adminFirestore.collection("videos").add({
            email,
            youtubeId,
            createdAt: new Date()
        })
        sendWebsocketMessage({
            email,
            title: videoInfo.videoDetails.title
        })
        return res.status(200).send("ok")
    }catch (e) {
        console.log(e)
        return res.status(400).send(e.message)
    }
}

module.exports = shareYoutubeVideo