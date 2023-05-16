const {firestore} = require("firebase-admin");
const shareYoutubeVideo = require("./controller/shareYoutubeVideo");
const authMiddleware = require("./common/authMiddleware");
const axios = require("axios");

describe('Share Youtube Video API', () => {

    afterEach(async () => {
        // Do cleanup tasks.
        // test.cleanup();
        const querySnap = await firestore().collection('videos').where("email", "==", "test-user@test.com").get()
        if (querySnap.size) {
            const id = querySnap.docs[0].id
            await firestore().collection('videos').doc(id).delete()
        }
    });

    it('should create a document in firestore db if the request is valid', async () => {
        // A fake request object
        const req = {
            body: {videoURL: 'https://www.youtube.com/watch?v=XPio9bh8nYI'} ,
            user: {email: "test-user@test.com"}
        };
        // A fake response object
        const res = {
            status: jest.fn(() => ({send: jest.fn()}))
        };

        await shareYoutubeVideo(req, res);
        const querySnap = await firestore().collection('videos').where("email", "==", "test-user@test.com").get()
        expect(querySnap.size).toBeTruthy()
        expect(res.status).toHaveBeenCalledWith(200);
    },5000);

    it('should return a 404 response if the request lacks videoURL', async () => {
        // A fake request object
        const req = {
            body: {} ,
            user: {email: "test-user@test.com"}
        };
        // A fake response object
        const res = {
            status: jest.fn(() => ({send: jest.fn()}))
        };

        await shareYoutubeVideo(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    },5000);

    it('should not create a document in firestore db and return a 404 response if the request includes invalid videoURL', async () => {
        // A fake request object
        const req = {
            body: {videoURL: 'https://google.com'} ,
            user: {email: "test-user@test.com"}
        };
        // A fake response object
        const res = {
            status: jest.fn(() => ({send: jest.fn()}))
        };

        await shareYoutubeVideo(req, res);
        const querySnap = await firestore().collection('videos').where("email", "==", "test-user@test.com").get()
        expect(res.status).toHaveBeenCalledWith(400);
        expect(querySnap.size).toBeFalsy()
    },5000);

    it('should not create a document in firestore db and return a 404 response if the videoURL includes invalid youtubeId', async () => {
        // A fake request object
        const req = {
            body: {videoURL: 'https://www.youtube.com/watch?v=123456'} ,
            user: {email: "test-user@test.com"}
        };
        // A fake response object
        const res = {
            status: jest.fn(() => ({send: jest.fn()}))
        };

        await shareYoutubeVideo(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    },5000);
})


describe("authMiddleware", () => {
    it("should return a 401 response when there's no token in request header", async () => {
        // A fake request object
        const req = {
            headers: {} ,
        };
        const res = {
            status: jest.fn(() => ({send: jest.fn()}))
        };
        await authMiddleware(req, res);
        expect(res.status).toHaveBeenCalledWith(401)
    })
    it("should return a 401 response and log a specified string when there's invalid token in request header", async () => {
        const logSpy = jest.spyOn(console, 'log');
        // A fake request object
        const req = {
            headers: { authorization : "123456" } ,
        };
        const res = {
            status: jest.fn(() => ({send: jest.fn()}))
        };
        await authMiddleware(req, res);
        expect(res.status).toHaveBeenCalledWith(401)
        expect(logSpy).toHaveBeenCalledWith("middleware error")
    })
    it("should forward the request and set user data in the request when the request includes a valid token", async () => {
        const {data} = await axios.post('https://securetoken.googleapis.com/v1/token?key=AIzaSyCuhITB31itgU5XFRcZoUZlbo2risU4YKo',{
            grant_type : "refresh_token",
            refresh_token: 'APJWN8eX6Hx7LvcFBRTccWwXkF6Wg0TxN_DOzyBXqfhOqfaB6zxie_YRurZ6wvODjEtoKgZvmEd0eQyw8odWBYnDsOVyjRnZlYdYSla0bpJ25AUJBMhLV0lO45K0QD43MH7k4xcRaKg38ESG9iZQdNG4G5AMh33h0SGdLx1oq3GA7GsmjEhMYa6zGAvM5nOyKYomcq1CX1kB1gAhm7z-w_CYtYBa3XbZhQ'
        })
        // A fake request object
        const req = {
            headers: { authorization : `Bearer ${data.access_token}` } ,
        };
        const res = {
            status: jest.fn(() => ({send: jest.fn()}))
        };
        const next = jest.fn()
        await authMiddleware(req, res, next);
        expect(req.user).toBeTruthy()
        expect(next).toBeCalledTimes(1)
    })
})