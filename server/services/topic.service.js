// Import all available GD topics
import { GD_TOPICS } from "../topics.js";

// Stores recently used topics so they don't repeat immediately
let recentlyUsedTopics = new Set();

// Maximum number of recently used topics to remember
const MAX_RECENT_TOPICS = 10;

// Detects the category of a topic based on keywords
function detectCategory(topic) {
  // Convert topic to lowercase for case-insensitive comparison
  const lowerTopic = topic.toLowerCase();

  // Technology related topics
  if (
    lowerTopic.includes("ai") ||
    lowerTopic.includes("technology") ||
    lowerTopic.includes("digital") ||
    lowerTopic.includes("blockchain") ||
    lowerTopic.includes("quantum") ||
    lowerTopic.includes("robotics") ||
    lowerTopic.includes("cloud") ||
    lowerTopic.includes("cyber") ||
    lowerTopic.includes("iot") ||
    lowerTopic.includes("machine")
  ) {
    return "Technology & Innovation";
  }

  // Environment related topics
  if (
    lowerTopic.includes("environment") ||
    lowerTopic.includes("green") ||
    lowerTopic.includes("pollution") ||
    lowerTopic.includes("water") ||
    lowerTopic.includes("plastic") ||
    lowerTopic.includes("waste") ||
    lowerTopic.includes("energy")
  ) {
    return "Environment & Sustainability";
  }

  // Economy related topics
  if (
    lowerTopic.includes("economy") ||
    lowerTopic.includes("startup") ||
    lowerTopic.includes("business") ||
    lowerTopic.includes("cashless") ||
    lowerTopic.includes("trade")
  ) {
    return "Business & Economy";
  }

  // Education related topics
  if (
    lowerTopic.includes("education") ||
    lowerTopic.includes("college") ||
    lowerTopic.includes("career") ||
    lowerTopic.includes("research") ||
    lowerTopic.includes("learning")
  ) {
    return "Education & Career";
  }

  // Health related topics
  if (
    lowerTopic.includes("health") ||
    lowerTopic.includes("mental") ||
    lowerTopic.includes("food") ||
    lowerTopic.includes("fitness") ||
    lowerTopic.includes("stress")
  ) {
    return "Health & Lifestyle";
  }

  // Politics related topics
  if (
    lowerTopic.includes("government") ||
    lowerTopic.includes("democracy") ||
    lowerTopic.includes("law") ||
    lowerTopic.includes("election") ||
    lowerTopic.includes("policy")
  ) {
    return "Politics & Governance";
  }

  // Default category if no keyword matches
  return "Current Affairs";
}

// Returns one random topic
export function getRandomTopic() {
  // Remove recently used topics from the available list
  let availableTopics = GD_TOPICS.filter(
    (topic) => !recentlyUsedTopics.has(topic)
  );

  // If every topic has been used recently, clear history
  if (availableTopics.length === 0) {
    recentlyUsedTopics.clear();
    availableTopics = [...GD_TOPICS];
  }

  // Pick a random topic
  const randomIndex = Math.floor(Math.random() * availableTopics.length);
  const topic = availableTopics[randomIndex];

  // Detect category of selected topic
  const category = detectCategory(topic);

  // Store topic as recently used
  recentlyUsedTopics.add(topic);

  // Remove oldest topic if limit exceeds
  if (recentlyUsedTopics.size > MAX_RECENT_TOPICS) {
    const oldestTopic = recentlyUsedTopics.values().next().value;
    recentlyUsedTopics.delete(oldestTopic);
  }

  // Return selected topic and its category
  return {
    topic,
    category,
  };
}

// Returns all topics or topics of a specific category
export function getTopics(category) {
  // If no category is provided, return all topics
  if (!category) {
    return GD_TOPICS.map((topic) => ({
      topic,
      category: detectCategory(topic),
    }));
  }

  // Return only matching category topics
  return GD_TOPICS.filter(
    (topic) => detectCategory(topic) === category
  ).map((topic) => ({
    topic,
    category,
  }));
}

// Returns statistics about topics
export function getTopicStats() {
  // Object to count topics in each category
  const categoryCount = {};

  // Count topics category-wise
  GD_TOPICS.forEach((topic) => {
    const category = detectCategory(topic);

    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  // Return statistics
  return {
    totalTopics: GD_TOPICS.length,
    categories: categoryCount,
    recentlyUsed: [...recentlyUsedTopics],
  };
}