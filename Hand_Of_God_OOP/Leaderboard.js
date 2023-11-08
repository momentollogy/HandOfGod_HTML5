// leaderboard.js

// Import db from firebase initialization module
import { db } from './firebase.js';
import { collection, addDoc, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Function to add a score
export async function addScore(name, score,levelArrayDataObject) {
  console.log(levelArrayDataObject)

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

// Test function to add a score
export async function testAddScore() {
  try {
    await addScore('momentology', 19600); // Use a test name and score
    console.log('Test score added successfully');
  } catch (error) {
    console.error('Error adding test score:', error);
  }
}
