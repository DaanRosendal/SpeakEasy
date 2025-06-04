import type { Express } from "express";
import { createServer, type Server } from "http";
import { topics } from "./topics";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get topics by theme
  app.get("/api/topics/:theme", (req, res) => {
    const { theme } = req.params;

    if (!theme || !topics[theme as keyof typeof topics]) {
      return res.status(400).json({
        message:
          "Invalid theme. Available themes: business, technology, politics, philosophy, environment, health, education, culture, science, sports",
      });
    }

    // Get all topics for the specified theme
    const allTopics = topics[theme as keyof typeof topics];

    // Return 3 random topics
    const shuffled = [...allTopics].sort(() => 0.5 - Math.random());
    const randomTopics = shuffled.slice(0, 3);

    res.json(randomTopics);
  });

  const httpServer = createServer(app);
  return httpServer;
}
