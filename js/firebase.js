var config = {
  apiKey: "AIzaSyBsBpJixx7g1-wqUzSTR6LgFzcm0b5eSTo",
  authDomain: "banzia-personal-art-test.firebaseapp.com",
  projectId: "banzia-personal-art-test",
  storageBucket: "banzia-personal-art-test.appspot.com",
  messagingSenderId: "222615310866",
  appId: "1:222615310866:web:3c4882d3148881a4defecb",
  measurementId: "G-847FBTFN0F"
};

firebase.initializeApp(config);

const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true })

// export async function recordResult(answers) {
//     console.log(answers);
//     var resultsRef = collection(db, "results");
//     const docRef = await addDoc(
//         resultsRef, {
//             answer: {
//                 type1: {
//                     q1: "a2",
//                     q2: "a2",
//                     q3: "a1",
//                     q4: "a2",
//                     q5: "a4",
//                     q6: "a3"
//                 },
//                 type2: {
//                     "01": true,
//                     "02": false,
//                     "03": true,
//                     "04": true,
//                     "05": false
//                 }
//             },
//             score: {
//                 "01": 0,
//                 "02": 10,
//                 "03": 9,
//                 "04": 2,
//                 "05": 1
//             },
//             result: "01"
//         }
//     )
//     .catch((error)=> {
//         console.log("error: "+error);
//     })
// }
