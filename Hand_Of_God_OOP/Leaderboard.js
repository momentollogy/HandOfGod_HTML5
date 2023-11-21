// leaderboard.js

// Import db from firebase initialization module
import { db } from './firebase.js';
import { collection, query, orderBy, limit, getDocs, where, addDoc,startAt, endBefore, startAfter } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";


// Function to add a score
export async function addScore(name, score,levelArrayDataObject) {


  try {
    const docRef = await addDoc(collection(db,levelArrayDataObject.fireBaseLevelLeaderBoard), {
      name: name,
      score: score,
      timestamp: new Date() // Firestore will convert this into its Timestamp type
    });
    //console.log("Document written with ID: ", docRef.id);
  } catch (e) {
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







// OLD WOKING Function to retrieve the most recent score, rank it and show surrounding scores
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
   scoresAboveSnapshot.forEach(doc => surroundingScores.unshift(doc.data()));
   surroundingScores.push(recentScoreData); // Add the most recent score
   scoresBelowSnapshot.forEach(doc => surroundingScores.push(doc.data()));
 
  // console.log("Final surroundingScores array: ", surroundingScores);
 
   return { surroundingScores, rank };
   
 }
 


// medium Function to retrieve top 10 scores of the player with the latest timestamp
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




















 





/*



//medium try
export async function getLatestScore(leaderboardId) {
  // Fetch the most recent score
  const recentScoreQuery = query(collection(db, leaderboardId), orderBy("timestamp", "desc"), limit(1));
  const recentScoreSnapshot = await getDocs(recentScoreQuery);
  if (recentScoreSnapshot.empty) {
    console.error("No recent score found");
    return { surroundingScores: [], rank: 0 };
  }
  const recentScoreData = recentScoreSnapshot.docs[0].data();
  recentScoreData.isLatest = true;

  // Compute the rank of the recent score
  const allScoresQuery = query(collection(db, leaderboardId), orderBy("score", "desc"));
  const allScoresSnapshot = await getDocs(allScoresQuery);
  let allScores = allScoresSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

  // Ensure scores are sorted correctly
  allScores.sort((a, b) => b.score - a.score);


   /////// Logging all scores after sorting
   console.log("All Scores:", allScores.map(score => {
    return `Player: ${score.name}, Score: ${score.score}`;
}));



  // Find the index of the recent score in the array
  const recentScoreIndex = allScores.findIndex(score => score.id === recentScoreSnapshot.docs[0].id);
  const rank = recentScoreIndex + 1; // Rank is index + 1

  // Calculate the number of scores to display above and below the recent score
  let scoresAboveCount = Math.min(recentScoreIndex, 4);
  let scoresBelowCount = Math.min(allScores.length - rank, 5);

  // Adjust counts to always show up to 10 scores if available
  if (scoresAboveCount + scoresBelowCount < 9) {
    // If there are not enough scores below, add more to the above if available
    if (scoresBelowCount < 5) {
      let additionalScores = Math.min(5 - scoresBelowCount, scoresAboveCount);
      scoresAboveCount -= additionalScores;
      scoresBelowCount += additionalScores;
    }
  }

  // Slice the array to get the surrounding scores
  let startIndex = Math.max(recentScoreIndex - scoresAboveCount, 0);
  let endIndex = Math.min(recentScoreIndex + scoresBelowCount + 1, allScores.length); // +1 because slice is exclusive

  let surroundingScores = allScores.slice(startIndex, endIndex);

  // Mark the recent score
  surroundingScores.forEach(score => {
    if (score.id === recentScoreSnapshot.docs[0].id) {
      score.isLatest = true;
    } else {
      score.isLatest = false;
    }
  });

  // Return the surrounding scores and the rank of the recent score
  return { surroundingScores, rank };
}








//take 3 working as take 2 just in supercase
export async function getLatestScore(leaderboardId) {
  // Fetch the most recent score
  const recentScoreQuery = query(collection(db, leaderboardId), orderBy("timestamp", "desc"), limit(1));
  const recentScoreSnapshot = await getDocs(recentScoreQuery);
  if (recentScoreSnapshot.empty) {
    console.error("No recent score found");
    return { surroundingScores: [], rank: 0 };
  }
  const recentScoreData = recentScoreSnapshot.docs[0].data();
  recentScoreData.isLatest = true;

  // Fetch all scores ordered by score
  const allScoresQuery = query(collection(db, leaderboardId), orderBy("score", "desc"));
  const allScoresSnapshot = await getDocs(allScoresQuery);
  let allScores = allScoresSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

  // Sort scores to ensure correct order
  allScores.sort((a, b) => b.score - a.score);

  // Find the rank of the recent score
  const recentScoreIndex = allScores.findIndex(score => score.id === recentScoreSnapshot.docs[0].id);
  const rank = recentScoreIndex + 1;

  // Determine the slice of scores to display based on the rank
  let surroundingScores;
  if (allScores.length <= 10) {
    // If there are 10 or fewer scores, show all scores
    surroundingScores = allScores;
  } else if (rank <= 5) {
    // If the rank is within the top 5, show the top 10 scores
    surroundingScores = allScores.slice(0, 10);
  } else if (rank > allScores.length - 5) {
    // If the rank is within the bottom 5, show the last 10 scores
    surroundingScores = allScores.slice(-10);
  } else {
    // Otherwise, show 4 scores above and 5 scores below the recent score
    surroundingScores = allScores.slice(recentScoreIndex - 4, recentScoreIndex + 6);
  }

  // Assign ranks to the surrounding scores
  surroundingScores = surroundingScores.map((score, index, arr) => {
    return {
      ...score,
      rank: allScores.length > 10 ? index + 1 + recentScoreIndex - 4 : index + 1,
      isLatest: score.id === recentScoreSnapshot.docs[0].id
    };
  });

  // Return the surrounding scores and the static rank of the recent score
  return { surroundingScores, rank };
}



/*
//seccfully logging scores
export async function getLatestScore(leaderboardId) {
    // Fetch the most recent score
    const recentScoreQuery = query(collection(db, leaderboardId), orderBy("timestamp", "desc"), limit(1));
    const recentScoreSnapshot = await getDocs(recentScoreQuery);
    if (recentScoreSnapshot.empty) {
        console.error("No recent score found");
        return { surroundingScores: [], rank: 0 };
    }
    const recentScoreData = recentScoreSnapshot.docs[0].data();
    recentScoreData.isLatest = true;

    // Fetch all scores ordered by score
    const allScoresQuery = query(collection(db, leaderboardId), orderBy("score", "desc"));
    const allScoresSnapshot = await getDocs(allScoresQuery);
    let allScores = allScoresSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    // Sort scores just in case
    allScores.sort((a, b) => b.score - a.score);


      /////// Logging all scores after sorting
      console.log("All Scores:", allScores.map(score => {
        return `Player: ${score.name}, Score: ${score.score}`;
    }));

    
    // Find the index of the recent score in the array
    const recentScoreIndex = allScores.findIndex(score => score.id === recentScoreSnapshot.docs[0].id);

    // Determine the slice of scores to display based on the rank
    let start, end;
    const rank = recentScoreIndex + 1; // Rank is index + 1 in a zero-indexed array
    let surroundingScores;

    if (allScores.length <= 10) {
        // If there are 10 or fewer scores, show all scores
        surroundingScores = allScores;
    } else {
        // Calculate how many scores to show above and below the recent score
        const above = Math.min(recentScoreIndex, 4); // Scores above the recent score
        const below = Math.min(allScores.length - recentScoreIndex - 1, 5); // Scores below the recent score

        // Adjust indices to ensure we are showing 10 scores
        start = recentScoreIndex - above;
        end = start + 10; // Show 10 scores if available

        // Adjust the start index if we are near the end of the list
        if (end > allScores.length) {
            start -= end - allScores.length;
            end = allScores.length;
        }

        // Slice the array to get the surrounding scores
        surroundingScores = allScores.slice(start, end);
    }

    // Assign the actual rank to each surrounding score and mark the recent score
    surroundingScores = surroundingScores.map((score, index) => ({
        ...score,
        rank: start + index + 1, // Assign rank based on the full sorted list
        isLatest: score.id === recentScoreSnapshot.docs[0].id
    }));

    // Return the surrounding scores and the static rank of the recent score
    return { surroundingScores, rank };

}


*/
