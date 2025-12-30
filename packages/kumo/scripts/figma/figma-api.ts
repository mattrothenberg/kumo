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

export type SyncResult = {
  success: boolean;
  error?: string;
  tempIdToRealId?: Record<string, string>;
};

/**
 * Sync resolved tokens to Figma via Variables API
 */
export async function syncToFigma(
  tokens: ResolvedToken[],
  config: FigmaConfig,
): Promise<SyncResult> {
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

    const responseText = await response.text();
    let responseJson: unknown;

    try {
      responseJson = JSON.parse(responseText);
    } catch {
      responseJson = null;
    }

    if (!response.ok) {
      const errorMessage =
        responseJson &&
        typeof responseJson === "object" &&
        responseJson !== null
          ? (responseJson as Record<string, unknown>).message ||
            (responseJson as Record<string, unknown>).error ||
            responseText
          : responseText;

      return {
        success: false,
        error: `Figma API error (${response.status}): ${errorMessage}`,
      };
    }

    // Extract tempIdToRealId mapping from successful response
    const meta =
      responseJson &&
      typeof responseJson === "object" &&
      responseJson !== null &&
      "meta" in responseJson
        ? (
            responseJson as {
              meta: { tempIdToRealId?: Record<string, string> };
            }
          ).meta
        : null;

    return {
      success: true,
      tempIdToRealId: meta?.tempIdToRealId,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: `Network error: ${message}` };
  }
}

/**
 * Get local variables from a Figma file
 */
export async function getLocalVariables(
  fileKey: string,
  token: string,
): Promise<{
  success: boolean;
  error?: string;
  data?: {
    variables: Record<string, unknown>;
    variableCollections: Record<string, unknown>;
  };
}> {
  const url = `https://api.figma.com/v1/files/${fileKey}/variables/local`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Figma-Token": token,
      },
    });

    const responseText = await response.text();
    let responseJson: unknown;

    try {
      responseJson = JSON.parse(responseText);
    } catch {
      return {
        success: false,
        error: `Failed to parse response: ${responseText}`,
      };
    }

    if (!response.ok) {
      const errorMessage =
        responseJson &&
        typeof responseJson === "object" &&
        responseJson !== null
          ? (responseJson as Record<string, unknown>).message ||
            (responseJson as Record<string, unknown>).error ||
            responseText
          : responseText;

      return {
        success: false,
        error: `Figma API error (${response.status}): ${errorMessage}`,
      };
    }

    const meta =
      responseJson &&
      typeof responseJson === "object" &&
      responseJson !== null &&
      "meta" in responseJson
        ? (
            responseJson as {
              meta: {
                variables: Record<string, unknown>;
                variableCollections: Record<string, unknown>;
              };
            }
          ).meta
        : null;

    return {
      success: true,
      data: meta ?? { variables: {}, variableCollections: {} },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: `Network error: ${message}` };
  }
}
