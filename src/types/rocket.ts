import { z } from "zod";

export const rocketFirstStageSchema = z.object({
  thrust_sea_level: z.object({ kN: z.number(), lbf: z.number() }),
  thrust_vacuum: z.object({ kN: z.number(), lbf: z.number() }),
  reusable: z.boolean(),
  engines: z.number(),
  fuel_amount_tons: z.number(),
  burn_time_sec: z.number().nullable(),
});

export const rocketSecondStageSchema = z.object({
  thrust: z.object({ kN: z.number(), lbf: z.number() }),
  payloads: z.object({
    composite_fairing: z.object({
      height: z.object({ meters: z.number().nullable(), feet: z.number().nullable() }),
      diameter: z.object({ meters: z.number().nullable(), feet: z.number().nullable() }),
    }),
    option_1: z.string(),
  }),
  reusable: z.boolean(),
  engines: z.number(),
  fuel_amount_tons: z.number(),
  burn_time_sec: z.number().nullable(),
});

export const rocketEnginesSchema = z.object({
  isp: z.object({ sea_level: z.number().nullable(), vacuum: z.number().nullable() }),
  thrust_sea_level: z.object({ kN: z.number(), lbf: z.number() }),
  thrust_vacuum: z.object({ kN: z.number(), lbf: z.number() }),
  number: z.number(),
  type: z.string(),
  version: z.string(),
  layout: z.string().nullable(),
  engine_loss_max: z.number().nullable(),
  propellant_1: z.string(),
  propellant_2: z.string(),
  thrust_to_weight: z.number().nullable(),
});

export const rocketSchema = z.looseObject({
  height: z.object({ meters: z.number().nullable(), feet: z.number().nullable() }),
  diameter: z.object({ meters: z.number().nullable(), feet: z.number().nullable() }),
  mass: z.object({ kg: z.number(), lb: z.number() }),
  first_stage: rocketFirstStageSchema,
  second_stage: rocketSecondStageSchema,
  engines: rocketEnginesSchema,
  landing_legs: z.object({ number: z.number(), material: z.string().nullable() }),
  payload_weights: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      kg: z.number(),
      lb: z.number(),
    })
  ),
  flickr_images: z.array(z.string()),
  name: z.string(),
  type: z.string(),
  active: z.boolean(),
  stages: z.number(),
  boosters: z.number(),
  cost_per_launch: z.number(),
  success_rate_pct: z.number(),
  first_flight: z.string(),
  country: z.string(),
  company: z.string(),
  wikipedia: z.string().nullable(),
  description: z.string().nullable(),
  id: z.string(),
});

export type RocketFirstStage = z.infer<typeof rocketFirstStageSchema>;
export type RocketSecondStage = z.infer<typeof rocketSecondStageSchema>;
export type RocketEngines = z.infer<typeof rocketEnginesSchema>;
export type Rocket = z.infer<typeof rocketSchema>;
