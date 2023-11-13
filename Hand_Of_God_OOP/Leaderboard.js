// leaderboard.js

// Import db from firebase initialization module
import { db } from './firebase.js';
import { collection, query, orderBy, limit, getDocs, where, addDoc,startAt, endBefore, startAfter } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";


// Function to add a score
export async function addScore(name, score,levelArrayDataObject) {
  console.log(levelArrayDataObject)
  console.log("Received for addScore:", { name, score, levelArrayDataObject });


  try {
    const docRef = await addDoc(collection(db,levelArrayDataObject.fireBaseLevelLeaderBoard), {
      name: name,
      score: score,
      timestamp: new Date() // Firestore will convert this into its Timestamp type
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}






//Function to retrieve top scores
export async function getTopScores(leaderboardId,limitCount = 10) {
  const scoresCollectionRef = collection(db, leaderboardId);
  const scoresQuery = query(scoresCollectionRef, orderBy("score", "desc"), limit(limitCount));

  try {
    const querySnapshot = await getDocs(scoresQuery);
    let scores = [];
    querySnapshot.forEach((doc) => {
      scores.push(doc.data());
    });
    return scores;
  } catch (e) {
    console.error("Error fetching scores: ", e);
    return []; // Return an empty array on error
  }
}







// Function to retrieve the most recent score, rank it and show surrounding scores
export async function getLatestScore(leaderboardId) {
  // Query to get the most recent score
  const recentScoreQuery = query(collection(db, leaderboardId), orderBy("timestamp", "desc"), limit(1));
  const recentScoreSnapshot = await getDocs(recentScoreQuery);
  const recentScoreData = recentScoreSnapshot.docs[0].data();

  // Compute the rank of the recent score
  const higherScoresQuery = query(collection(db, leaderboardId), orderBy("score", "desc"), where("score", ">", recentScoreData.score));
  const higherScoresSnapshot = await getDocs(higherScoresQuery);
  const rank = higherScoresSnapshot.size + 1;

  // Fetch scores above the recent score
  const scoresAboveQuery = query(collection(db, leaderboardId), orderBy("score", "desc"), 
      where("score", ">", recentScoreData.score), limit(5));
  const scoresAboveSnapshot = await getDocs(scoresAboveQuery);

  // Fetch scores below the recent score
  const scoresBelowQuery = query(collection(db, leaderboardId), orderBy("score"), 
      where("score", "<", recentScoreData.score), limit(4));
  const scoresBelowSnapshot = await getDocs(scoresBelowQuery);

  // Combine the scores with the recent score in the middle
  let surroundingScores = [];
  scoresAboveSnapshot.forEach(doc => surroundingScores.unshift(doc.data()));
  surroundingScores.push(recentScoreData); // Add the most recent score
  scoresBelowSnapshot.forEach(doc => surroundingScores.push(doc.data()));

  return { surroundingScores, rank };
}






// Function to retrieve top 10 scores of the player with the latest timestamp
export async function getPlayerTopScores(leaderboardId) {
  // Query to get the name of the player with the most recent score
  const recentPlayerQuery = query(collection(db, leaderboardId), orderBy("timestamp", "desc"), limit(1));
  const recentPlayerData = await getDocs(recentPlayerQuery);
  let playerName = null;
  recentPlayerData.forEach(doc => {
      playerName = doc.data().name;
  });

  // If no player name found, return empty array
  if (playerName === null) {
      return [];
  }

  // Query to get the top 10 scores of the player
  const playerScoresQuery = query(collection(db, leaderboardId), where("name", "==", playerName), 
      orderBy("score", "desc"), limit(10));
  const playerScoresData = await getDocs(playerScoresQuery);

  let scores = [];
  playerScoresData.forEach(doc => {
      scores.push(doc.data());
  });

  return scores;
}


/* OLD WOKING CODE which just retives top 10

// Function to retrieve top scores
export async function getTopScores(leaderboardId,limitCount = 10) {
  const scoresCollectionRef = collection(db, leaderboardId);
  const scoresQuery = query(scoresCollectionRef, orderBy("score", "desc"), limit(limitCount));

  try {
    const querySnapshot = await getDocs(scoresQuery);
    let scores = [];
    querySnapshot.forEach((doc) => {
      scores.push(doc.data());
    });
    return scores;
  } catch (e) {
    console.error("Error fetching scores: ", e);
    return []; // Return an empty array on error
  }
}




// Function to retrieve the most recent score, rank it and show surrounding scores
export async function getLatestScore(leaderboardId) {
  // Query to get the most recent score
  const recentScoreQuery = query(collection(db, leaderboardId), orderBy("timestamp", "desc"), limit(1));
  const recentScoreSnapshot = await getDocs(recentScoreQuery);
  const recentScoreData = recentScoreSnapshot.docs[0].data();

  // Compute the rank of the recent score
  const higherScoresQuery = query(collection(db, leaderboardId), orderBy("score", "desc"), where("score", ">", recentScoreData.score));
  const higherScoresSnapshot = await getDocs(higherScoresQuery);
  const rank = higherScoresSnapshot.size + 1;

  // Fetch scores above the recent score
  const scoresAboveQuery = query(collection(db, leaderboardId), orderBy("score", "desc"), 
      where("score", ">", recentScoreData.score), limit(4));
  const scoresAboveSnapshot = await getDocs(scoresAboveQuery);

  // Fetch scores below the recent score
  const scoresBelowQuery = query(collection(db, leaderboardId), orderBy("score"), 
      where("score", "<", recentScoreData.score), limit(4));
  const scoresBelowSnapshot = await getDocs(scoresBelowQuery);

  // Combine the scores with the recent score in the middle
  let surroundingScores = [];
  scoresAboveSnapshot.forEach(doc => surroundingScores.unshift(doc.data()));
  surroundingScores.push(recentScoreData); // Add the most recent score
  scoresBelowSnapshot.forEach(doc => surroundingScores.push(doc.data()));

  return { surroundingScores, rank };
}






// Function to retrieve top 10 scores of the player with the latest timestamp
export async function getPlayerTopScores(leaderboardId) {
  // Query to get the name of the player with the most recent score
  const recentPlayerQuery = query(collection(db, leaderboardId), orderBy("timestamp", "desc"), limit(1));
  const recentPlayerData = await getDocs(recentPlayerQuery);
  let playerName = null;
  recentPlayerData.forEach(doc => {
      playerName = doc.data().name;
  });

  // If no player name found, return empty array
  if (playerName === null) {
      return [];
  }

  // Query to get the top 10 scores of the player
  const playerScoresQuery = query(collection(db, leaderboardId), where("name", "==", playerName), 
      orderBy("score", "desc"), limit(10));
  const playerScoresData = await getDocs(playerScoresQuery);

  let scores = [];
  playerScoresData.forEach(doc => {
      scores.push(doc.data());
  });

  return scores;
}





// Test function to add a score
export async function testAddScore() {
  try {
    await addScore('momentology', 19600); // Use a test name and score
    console.log('Test score added successfully');
  } catch (error) {
    console.error('Error adding test score:', error);
  }
}
*/
