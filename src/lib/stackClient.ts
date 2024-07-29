"use client";
import { StackClient } from "@stackso/js-core";

// Initialize the client
export const stack = new StackClient({
  // Get your API key and point system id from the Stack dashboard (stack.so)
  apiKey: `${process.env.STACK_API_KEY}`,
  pointSystemId: 2839,
});

export const leaderboard = await stack?.getLeaderboard();
