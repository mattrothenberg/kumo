import 'dotenv/config';
import { createZodFetcher } from 'zod-fetch';
import {
  GetComponentResponseSchema,
  GetComponentResponseSchemaType,
  GetSvgtResponseSchema,
  GetSvgtResponseSchemaType,
} from './schema.js';

interface IAPIOptions {
  method: string;
  headers: {
    'content-type': string;
    'X-Figma-Token': string;
  };
}

export const Options: IAPIOptions = {
  method: 'GET',
  headers: {
    'content-type': 'application/json;charset=UTF-8',
    'X-Figma-Token': process.env.FIGMA_TOKEN!,
  },
};

export async function fetchComponents(
  fileId: string = process.env.FIGMA_ICONS_FILE_ID!,
  options: IAPIOptions = Options,
  schema = GetComponentResponseSchema,
): Promise<GetComponentResponseSchemaType> {
  if (!fileId) {
    throw new Error(
      'No File ID provided. Please set the FIGMA_ICONS_FILE_ID environment variable.',
    );
  }
  const fetchWithZod = createZodFetcher();
  const uri = `https://api.figma.com/v1/files/${fileId}/components`;
  return fetchWithZod(schema, uri, options);
}

export async function fetchSvg(
  ids: string,
  fileId: string = process.env.FIGMA_ICONS_FILE_ID!,
  options: IAPIOptions = Options,
  schema = GetSvgtResponseSchema,
): Promise<GetSvgtResponseSchemaType> {
  if (!fileId) {
    throw new Error(
      'No File ID provided. Please set the FIGMA_ICONS_FILE_ID environment variable.',
    );
  }
  const fetchWithZod = createZodFetcher();
  const uri = `https://api.figma.com/v1/images/${fileId}?ids=${ids}&format=svg`;
  return fetchWithZod(schema, uri, options);
}
