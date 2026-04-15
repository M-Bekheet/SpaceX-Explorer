import { z } from "zod";

export const launchpadSchema = z.object({
  name: z.string(),
  full_name: z.string(),
  locality: z.string(),
  region: z.string(),
  timezone: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  launch_attempts: z.number(),
  launch_successes: z.number(),
  rockets: z.array(z.string()),
  launches: z.array(z.string()),
  status: z.string(),
  details: z.string(),
  id: z.string(),
});

export type LaunchPad = z.infer<typeof launchpadSchema>;
