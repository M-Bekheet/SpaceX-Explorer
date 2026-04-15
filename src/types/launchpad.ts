import { z } from "zod";

export const launchpadSchema = z.looseObject({
  name: z.string().nullable(),
  full_name: z.string().nullable(),
  locality: z.string().nullable(),
  region: z.string().nullable(),
  timezone: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  launch_attempts: z.number(),
  launch_successes: z.number(),
  rockets: z.array(z.string()),
  launches: z.array(z.string()),
  status: z.string(),
  details: z.string().nullable().optional(),
  id: z.string(),
});

export type LaunchPad = z.infer<typeof launchpadSchema>;
