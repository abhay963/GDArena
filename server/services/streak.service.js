import { pool } from "../config/db.js";
import { differenceInCalendarDays } from "date-fns";

// Returns today's date with time removed (00:00:00)
function getLocalDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// Updates the user's streak after completing today's task
export async function updateUserStreak(uid, email) {
  // Get today's date
  const today = getLocalDate();

  // Check whether the user already exists in the database
  const { rows } = await pool.query(
    "SELECT * FROM user_streaks WHERE uid = $1",
    [uid]
  );

  // If user is new, create a new streak record
  if (rows.length === 0) {
    await pool.query(
      `INSERT INTO user_streaks
      (uid, email, current_streak, max_streak, last_active_date)
      VALUES ($1, $2, 1, 1, $3)`,
      [uid, email, today]
    );

    // First completed day = streak of 1
    return 1;
  }

  // Existing user data
  const user = rows[0];

  // Convert last active date into JavaScript Date object
  const last = user.last_active_date
    ? new Date(user.last_active_date)
    : null;

  // Start with current streak
  let newStreak = user.current_streak;

  // User has never been active before
  if (!last) {
    newStreak = 1;
  } else {
    // Calculate number of days between today and last active day
    const diff = differenceInCalendarDays(today, last);

    // Already updated today → don't increase streak
    if (diff === 0) {
      return newStreak;
    }

    // Consecutive day → increase streak
    if (diff === 1) {
      newStreak++;
    }

    // Missed one or more days → reset streak
    if (diff >= 2) {
      newStreak = 1;
    }
  }

  // Update maximum streak if needed
  const maxStreak = Math.max(newStreak, user.max_streak);

  // Save updated values in database
  await pool.query(
    `UPDATE user_streaks
     SET current_streak = $1,
         max_streak = $2,
         last_active_date = $3
     WHERE uid = $4`,
    [newStreak, maxStreak, today, uid]
  );

  // Return latest streak
  return newStreak;
}

// Returns streak without modifying it
export async function getUserStreak(uid) {
  // Get today's date
  const today = getLocalDate();

  // Find user
  const { rows } = await pool.query(
    "SELECT * FROM user_streaks WHERE uid = $1",
    [uid]
  );

  // User doesn't exist
  if (rows.length === 0) {
    return 0;
  }

  const user = rows[0];

  // User never completed any task
  if (!user.last_active_date) {
    return 0;
  }

  // Convert database date into JavaScript Date object
  const last = new Date(user.last_active_date);

  // Days between today and last completion
  const diff = differenceInCalendarDays(today, last);

  // If more than one day is missed, streak becomes 0 for display
  if (diff >= 2) {
    return 0;
  }

  // Otherwise return current streak
  return user.current_streak;
}