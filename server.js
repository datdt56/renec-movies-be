const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authMiddleware = require("./common/authMiddleware");
const shareYoutubeVideo = require("./controller/shareYoutubeVideo");
const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true, parameterLimit: 50000}));

// Automatically allow cross-origin requests
app.use(cors({origin: true}));
// Add middleware to authenticate requests
app.use(authMiddleware);

app.post("/share-youtube-video", shareYoutubeVideo)

app.listen(PORT, function () {
    console.log('Server is running on Port:', PORT);
});