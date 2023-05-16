const admin = require("firebase-admin");
const serviceAccount = require("../funny-movies-c7515-firebase-adminsdk-qujpg-14e38a54ae.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const adminAuth = admin.auth()
const adminFirestore = admin.firestore()

module.exports = {
    adminFirestore,
    adminAuth
}