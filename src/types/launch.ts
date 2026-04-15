import { z } from "zod";

export const launchFairingsSchema = z.object({
  reused: z.boolean().nullable(),
  recovery_attempt: z.boolean().nullable(),
  recovered: z.boolean().nullable(),
  ships: z.array(z.string()),
});

export const launchLinksSchema = z.object({
  patch: z.object({
    small: z.string().nullable(),
    large: z.string().nullable(),
  }),
  reddit: z.object({
    campaign: z.string().nullable(),
    launch: z.string().nullable(),
    media: z.string().nullable(),
    recovery: z.string().nullable(),
  }),
  flickr: z.object({
    small: z.array(z.string()),
    original: z.array(z.string()),
  }),
  presskit: z.string().nullable(),
  webcast: z.string().nullable(),
  youtube_id: z.string().nullable(),
  article: z.string().nullable(),
  wikipedia: z.string().nullable(),
});

export const launchCoreSchema = z.object({
  core: z.string().nullable(),
  flight: z.number().nullable(),
  gridfins: z.boolean().nullable(),
  legs: z.boolean().nullable(),
  reused: z.boolean().nullable(),
  landing_attempt: z.boolean().nullable(),
  landing_success: z.boolean().nullable(),
  landing_type: z.string().nullable(),
  landpad: z.string().nullable(),
});

export const launchFailureSchema = z.object({
  time: z.number().nullable(),
  altitude: z.number().nullable(),
  reason: z.string(),
});

export const launchSchema = z.looseObject({
  fairings: launchFairingsSchema.nullable(),
  links: launchLinksSchema,
  static_fire_date_utc: z.string().nullable(),
  static_fire_date_unix: z.number().nullable(),
  tbd: z.boolean().nullable(),
  net: z.boolean().nullable(),
  window: z.number().nullable(),
  rocket: z.string().nullable(),
  success: z.boolean().nullable(),
  failures: z.array(launchFailureSchema),
  details: z.string().nullable(),
  crew: z.array(z.string()),
  ships: z.array(z.string()),
  capsules: z.array(z.string()),
  payloads: z.array(z.string()),
  launchpad: z.string().nullable(),
  auto_update: z.boolean().nullable(),
  flight_number: z.number(),
  name: z.string(),
  date_utc: z.string().nullable(),
  date_unix: z.number().nullable(),
  date_local: z.string().nullable(),
  date_precision: z.string().nullable(),
  upcoming: z.boolean(),
  cores: z.array(launchCoreSchema),
  id: z.string(),
});

export type LaunchFairings = z.infer<typeof launchFairingsSchema>;
export type LaunchLinks = z.infer<typeof launchLinksSchema>;
export type LaunchCore = z.infer<typeof launchCoreSchema>;
export type LaunchFailure = z.infer<typeof launchFailureSchema>;
export type Launch = z.infer<typeof launchSchema>;
