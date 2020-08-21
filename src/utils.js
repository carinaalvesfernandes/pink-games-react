import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

/**
 * Returns a promise holding an array of our score objects
 * game parameter is eithet "memory", "snake" or "minesweeper(collection ID)"
 *
 */

export function fetchLeaderboard(game) {
  // detta finns doumenterat i firebase
  const auth = firebase.auth();
  const db = firebase.firestore();
  return auth
    .signInAnonymously() // async function
    .then(() => db.collection(game).orderBy("timeMs", "asc").get()) // call this when the signin is done
    .then((querySnapshot) => {
      // and then do this.
      let leaderboard = [];
      querySnapshot.forEach((document) => {
        leaderboard.push(document.data()); // printar ut data from databasen
      });
      return leaderboard;
    })
    .catch(function (error) {
      // if any of the then ore signin get a error this is going in here,
      console.log("Error getting leaderboard: ", error);
    });

  // any code that is here will be running in the same time as signin function.
}
/**
 * Returns a promise for saving the score
 */
export function saveScore(game, score) {
  const auth = firebase.auth();
  const db = firebase.firestore();
  return auth
    .signInAnonymously()
    .then(() => db.collection(game).add(score))
    .catch(function (error) {
      console.log("Error saving score: ", error);
    });
}
