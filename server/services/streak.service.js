import { pool } from "../config/db.js";
import { differenceInCalendarDays } from "date-fns";

// Get today's date without time
function getToday() {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
}

// Update user's streak after completing a task
export async function updateUserStreak(uid, email) {
  const today = getToday();

  // Find user streak
  const { rows } = await pool.query(
    "SELECT * FROM user_streaks WHERE uid = $1",
    [uid]
  );

  // First activity
  if (rows.length === 0) {
    await pool.query(
      `INSERT INTO user_streaks
       (uid, email, current_streak, max_streak, last_active_date)
       VALUES ($1, $2, 1, 1, $3)`,
      [uid, email, today]
    );

    return 1;
  }

  const user = rows[0];

  // Calculate days since last activity
  const lastDate = new Date(user.last_active_date);

  const diff = differenceInCalendarDays(
    today,
    lastDate
  );

  // Already completed today's task
  if (diff === 0) {
    return user.current_streak;
  }

  // Consecutive day → increase
  // Missed days → reset to 1
  const currentStreak =
    diff === 1
      ? user.current_streak + 1
      : 1;

  // Update maximum streak
  const maxStreak = Math.max(
    currentStreak,
    user.max_streak
  );

  // Save streak
  await pool.query(
    `UPDATE user_streaks
     SET current_streak = $1,
         max_streak = $2,
         last_active_date = $3
     WHERE uid = $4`,
    [
      currentStreak,
      maxStreak,
      today,
      uid
    ]
  );

  return currentStreak;
}


// Get user's current streak
export async function getUserStreak(uid) {
  const today = getToday();

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

  // No activity yet
  if (!user.last_active_date) {
    return 0;
  }

  // Calculate days since last activity
  const diff = differenceInCalendarDays(
    today,
    new Date(user.last_active_date)
  );

  // Streak is still active if activity was today or yesterday
  if (diff <= 1) {
    return user.current_streak;
  }

  // Streak expired
  return 0;
}