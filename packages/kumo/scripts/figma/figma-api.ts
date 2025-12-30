/**
 * Figma Variables API client for syncing design tokens
 */

export type ResolvedToken = {
  name: string;
  light: { r: number; g: number; b: number; a?: number };
  dark: { r: number; g: number; b: number; a?: number };
};

export type FigmaConfig = {
  fileKey: string;
  token: string;
  collectionName: string;
};

type FigmaColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type FigmaPayload = {
  variableCollections: Array<{
    action: "CREATE" | "UPDATE";
    id: string;
    name: string;
    initialModeId: string;
  }>;
  variableModes: Array<{
    action: "CREATE" | "UPDATE";
    id: string;
    name: string;
    variableCollectionId: string;
  }>;
  variables: Array<{
    action: "CREATE" | "UPDATE";
    id: string;
    name: string;
    variableCollectionId: string;
    resolvedType: "COLOR";
  }>;
  variableModeValues: Array<{
    variableId: string;
    modeId: string;
    value: FigmaColor;
  }>;
};

/**
 * Generate a stable ID for a variable based on its name
 */
function generateVariableId(name: string): string {
  return `var_${name.replace(/-/g, "_")}`;
}

/**
 * Normalize color to Figma format (0-1 range, always include alpha)
 */
function normalizeFigmaColor(color: {
  r: number;
  g: number;
  b: number;
  a?: number;
}): FigmaColor {
  return {
    r: color.r,
    g: color.g,
    b: color.b,
    a: color.a ?? 1,
  };
}

/**
 * Build Figma Variables API payload
 */
function buildFigmaPayload(
  tokens: ResolvedToken[],
  collectionName: string,
): FigmaPayload {
  const collectionId = "kumo_collection";
  const lightModeId = "light_mode";
  const darkModeId = "dark_mode";

  const variables = tokens.map((token) => ({
    action: "CREATE" as const,
    id: generateVariableId(token.name),
    name: token.name,
    variableCollectionId: collectionId,
    resolvedType: "COLOR" as const,
  }));

  const variableModeValues = tokens.flatMap((token) => {
    const varId = generateVariableId(token.name);
    return [
      {
        variableId: varId,
        modeId: lightModeId,
        value: normalizeFigmaColor(token.light),
      },
      {
        variableId: varId,
        modeId: darkModeId,
        value: normalizeFigmaColor(token.dark),
      },
    ];
  });

  return {
    variableCollections: [
      {
        action: "CREATE",
        id: collectionId,
        name: collectionName,
        initialModeId: lightModeId,
      },
    ],
    variableModes: [
      {
        action: "UPDATE",
        id: lightModeId,
        name: "Light",
        variableCollectionId: collectionId,
      },
      {
        action: "CREATE",
        id: darkModeId,
        name: "Dark",
        variableCollectionId: collectionId,
      },
    ],
    variables,
    variableModeValues,
  };
}

/**
 * Sync resolved tokens to Figma via Variables API
 */
export async function syncToFigma(
  tokens: ResolvedToken[],
  config: FigmaConfig,
): Promise<{ success: boolean; error?: string }> {
  const { fileKey, token, collectionName } = config;

  if (!tokens.length) {
    return { success: false, error: "No tokens to sync" };
  }

  const payload = buildFigmaPayload(tokens, collectionName);
  const url = `https://api.figma.com/v1/files/${fileKey}/variables`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-Figma-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage: string;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorText;
      } catch {
        errorMessage = errorText;
      }

      return {
        success: false,
        error: `Figma API error (${response.status}): ${errorMessage}`,
      };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: `Network error: ${message}` };
  }
}
