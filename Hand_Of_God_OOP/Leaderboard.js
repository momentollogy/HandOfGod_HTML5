// leaderboard.js

// Import db from firebase initialization module
import { db } from './firebase.js';
import { collection, query, orderBy, limit, getDocs, where, addDoc,startAt, endBefore, startAfter } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";



export async function addScore(name, score, levelArrayDataObject) {
  try {
    // Add the score to the database.
    const docRef = await addDoc(collection(db, levelArrayDataObject.fireBaseLevelLeaderBoard), {
      name: name,
      score: score,
      timestamp: new Date()
    });

    // After adding the score, calculate the rank.
    const scoresQuery = query(collection(db, levelArrayDataObject.fireBaseLevelLeaderBoard), orderBy("score", "desc"));
    const scoresSnapshot = await getDocs(scoresQuery);
    
    // Initialize rank at 1.
    let rank = 1;
    for (const doc of scoresSnapshot.docs) {
      if (doc.id === docRef.id) {
        // This is the rank of the newly added score.
        break;
      }
      rank++; // Increment rank until the new score is found.
    }

    // Return the document reference ID and the rank.
    return { id: docRef.id, rank: rank };
  } catch (e) {
    console.error("Error adding score: ", e);
    throw e; // Re-throw the error to handle it in the calling function.
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


// Function to retrieve the most recent score, rank it, and show surrounding scores
export async function getLatestScore(leaderboardId) {
  // Query to get all scores ordered by score descending
  const allScoresQuery = query(collection(db, leaderboardId), orderBy("score", "desc"));
  const allScoresSnapshot = await getDocs(allScoresQuery);

  // Array to hold all scores
  let allScores = [];
  allScoresSnapshot.forEach(doc => {
      allScores.push(doc.data());
  });

  // Find the most recent score
  const recentScoreQuery = query(collection(db, leaderboardId), orderBy("timestamp", "desc"), limit(1));
  const recentScoreSnapshot = await getDocs(recentScoreQuery);
  const recentScoreData = recentScoreSnapshot.docs[0].data();
  
  // Find the rank of the recent score
  let rank = allScores.findIndex(score => score.timestamp.toMillis() === recentScoreData.timestamp.toMillis()) + 1;

  // Determine the range of scores to fetch based on the rank
  let startIndex = Math.max(0, rank - 5);
  let endIndex = startIndex + 9; // We want to display 10 scores
  endIndex = Math.min(endIndex, allScores.length - 1); // Make sure we don't exceed the array

  // Adjust startIndex if we are at the end of the array and we can't get 10 scores
  startIndex = endIndex - 9 >= 0 ? endIndex - 9 : 0;

  // Slice the array to get the desired scores
  let surroundingScores = allScores.slice(startIndex, endIndex + 1);

  // Assign ranks to surroundingScores
  surroundingScores = surroundingScores.map((score, index) => ({
      ...score,
      rank: startIndex + index + 1, // Assign the correct rank
      isLatest: score.timestamp.toMillis() === recentScoreData.timestamp.toMillis()
  }));

  return { surroundingScores, rank };
}







/*
//WOrking logging!
export async function getLatestScore(leaderboardId) {
  // console.log("Recent score data: ", recentScoreData);
 
   // Query to get the most recent score
   const recentScoreQuery = query(collection(db, leaderboardId), orderBy("timestamp", "desc"), limit(1));
   const recentScoreSnapshot = await getDocs(recentScoreQuery);
   const recentScoreData = recentScoreSnapshot.docs[0].data();
   recentScoreData.isLatest = true; // Add this line
 
 
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
where("score", "<", recentScoreData.score), limit(5));
const scoresBelowSnapshot = await getDocs(scoresBelowQuery);

// Combine the scores with the recent score in the middle
let surroundingScores = [];

// Corrected logging for scores above
const scoresAbove = [];
scoresAboveSnapshot.forEach(doc => {
scoresAbove.unshift(doc.data()); // This will reverse the order
});
for (let i = 0; i < scoresAbove.length; i++) {
console.log(`Rank for ${scoresAbove[i].name} with score ${scoresAbove[i].score}: ${rank - (scoresAbove.length - i)}`);
}

surroundingScores.push(...scoresAbove);
surroundingScores.push(recentScoreData); // Add the most recent score
console.log(`Rank for ${recentScoreData.name} with score ${recentScoreData.score}: ${rank}`);

// Corrected logging for scores below
const scoresBelow = scoresBelowSnapshot.docs.map(doc => doc.data());
for (let i = 0; i < scoresBelow.length; i++) {
console.log(`Rank for ${scoresBelow[i].name} with score ${scoresBelow[i].score}: ${rank + i + 1}`);
}

surroundingScores.push(...scoresBelow);

return { surroundingScores, rank };


}
*/





//Function to retrieve top 10 scores of the player with the latest timestamp
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

