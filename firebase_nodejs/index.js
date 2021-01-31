var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chat-nodejs-cda17.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("server/saving-data/fireblog");
ref.once("value", function (snapshot) {
    console.log(snapshot.val());
});

ref.on("child_added", function (snapshot, prevChildKey) {
    var newPost = snapshot.val();
    console.log("child_added", newPost)
});

ref.on("child_changed", function (snapshot) {
    var changedPost = snapshot.val();
    console.log("The updated post title is ", changedPost);
});

var usersRef = ref.child("data");

usersRef.set("trongnv writing data", function (error) {
    if (error) {
        console.log("Data could not be saved." + error);
    } else {
        console.log("Data saved successfully.");
    }
});