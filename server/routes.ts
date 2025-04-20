import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { topics } from "./topics";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get topics by theme
  app.get("/api/topics/:theme", (req, res) => {
    const { theme } = req.params;
    
    if (!theme || !topics[theme as keyof typeof topics]) {
      return res.status(400).json({ 
        message: "Invalid theme. Available themes: business, technology, social, philosophy, environment" 
      });
    }
    
    // Return the topics for the specified theme
    res.json(topics[theme as keyof typeof topics]);
  });

  const httpServer = createServer(app);
  return httpServer;
}
