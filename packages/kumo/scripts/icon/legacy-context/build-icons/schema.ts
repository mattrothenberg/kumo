import { z } from "zod";

const isoDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const ComponentSchema = z.object({
  key: z.string(),
  file_key: z.string(),
  node_id: z.string(),
  thumbnail_url: z.string().url(),
  name: z.string(),
  description: z.string(),
  description_rt: z.string(),
  created_at: z.string().regex(isoDate),
  updated_at: z.string().regex(isoDate),
  containing_frame: z.union([
    z.object({
      name: z.string(),
      nodeId: z.string(),
      pageId: z.string(),
      pageName: z.string(),
      backgroundColor: z.string(),
      containingStateGroup: z.object({
        name: z.string(),
        nodeId: z.string(),
      }),
    }),
    z.object({
      pageId: z.string(),
      pageName: z.string(),
    }),
  ]),
  user: z.object({
    id: z.string(),
    handle: z.string(),
    img_url: z.string().url(),
  }),
});

export const GetComponentResponseSchema = z.object({
  error: z.boolean(),
  status: z.number(),
  meta: z.object({
    components: z.array(ComponentSchema),
  }),
});

export const GetSvgtResponseSchema = z.object({
  err: z.union([z.null(), z.string()]),
  images: z.record(z.string()),
});

export type ComponentType = z.infer<typeof ComponentSchema>;
export type GetSvgtResponseSchemaType = z.infer<typeof GetSvgtResponseSchema>;
export type ImagesType = GetSvgtResponseSchemaType["images"];

export type GetComponentResponseSchemaType = z.infer<
  typeof GetComponentResponseSchema
>;
