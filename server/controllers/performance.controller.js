import { analyzeTranscript } from "../services/performance.service.js";
import { pool } from "../config/db.js";

export async function analyzePerformance(req, res) {
  try {
    const { uid, topic, history } = req.body;

    // Analyze using Groq
    const report = await analyzeTranscript(topic, history);

    // Calculate user statistics
    const userMessages = history.filter(
      (msg) => msg.speaker === "You"
    );

    const wordCount = userMessages.reduce((total, msg) => {
      return total + msg.text.trim().split(/\s+/).length;
    }, 0);

    // Save report to PostgreSQL
    await pool.query(
      `
      INSERT INTO performance
      (
        uid,
        topic,
        overall_score,
        communication,
        confidence,
        vocabulary,
        fluency,
        logic,
        participation,
        strengths,
        weaknesses,
        suggestions,
        word_count,
        user_message_count
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
      )
      `,
      [
        uid,
        topic,

        report.overall_score,
        report.communication,
        report.confidence,
        report.vocabulary,
        report.fluency,
        report.logic,
        report.participation,

        report.strengths,
        report.weaknesses,
        report.suggestions,

        wordCount,
        userMessages.length,
      ]
    );

    res.json({
      success: true,
      report,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}




export async function getPerformance(req, res) {
  try {
    const { uid } = req.params;

    // All reports
    const reports = await pool.query(
      `
      SELECT *
      FROM performance
      WHERE uid = $1
      ORDER BY created_at ASC
      `,
      [uid]
    );

    // Dashboard statistics
    const stats = await pool.query(
      `
      SELECT

      COUNT(*) AS total_sessions,

      COALESCE(SUM(word_count),0) AS total_words,

      COALESCE(SUM(user_message_count),0) AS total_messages,

      ROUND(AVG(overall_score),1) AS average_overall,

      MAX(overall_score) AS best_overall

      FROM performance

      WHERE uid=$1
      `,
      [uid]
    );

    const allReports = reports.rows;

    let improvement = 0;

    if (allReports.length >= 2) {
      const first = Number(allReports[0].overall_score);
      const latest = Number(allReports[allReports.length - 1].overall_score);

      improvement = (((latest - first) / first) * 100).toFixed(1);
    }

    res.json({
      reports: allReports,
      stats: {
        ...stats.rows[0],
        improvement,
      },
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
}