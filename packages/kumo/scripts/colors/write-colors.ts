import fs from "fs";
import path from "path";
import process from "node:process";
import { fileURLToPath } from "url";

// Run with:
// pnpm dlx tsx packages/kumo/scripts/colors/write-colors.ts \
//   --file packages/kumo/src/components/button/button.tsx

type RoleName = string;

type TokenSourceEntry = {
  value: string;
};

type TokenClassRole = Record<string, TokenSourceEntry>;

type TokenClassEntry = Record<RoleName, TokenClassRole>;

type TokenFileEntry = Record<string, TokenClassEntry>;

type Token = {
  light: string;
  dark: string;
  source: Record<string, TokenFileEntry>;
  type: RoleName[];
};

type AnalyzeTokens = {
  tokens: Record<string, Token>;
};

type RoleMapping = {
  tokenId: string;
  role: RoleName;
  utilityNames: string[];
  tokenTypes: RoleName[];
};

type ClassMapping = Record<RoleName, RoleMapping>;

type FileClassMapping = Record<string, ClassMapping>;

type FilesMapping = Record<string, FileClassMapping>;

const SCRIPT_DIR = fileURLToPath(new URL(".", import.meta.url));
const ROOT_DIR = path.resolve(process.cwd());

function specificityScore(role: RoleName, tokenTypes: RoleName[]): number {
  if (!tokenTypes || tokenTypes.length === 0) return 0;
  const includesRole = tokenTypes.includes(role);
  if (!includesRole) return 0;
  return tokenTypes.length === 1 ? 2 : 1;
}

function shouldPreferNewMapping(
  existing: RoleMapping,
  nextTokenTypes: RoleName[],
  role: RoleName,
): boolean {
  const existingScore = specificityScore(role, existing.tokenTypes);
  const nextScore = specificityScore(role, nextTokenTypes);

  if (nextScore > existingScore) return true;
  return false;
}

function loadAnalyzeTokens(): AnalyzeTokens {
  const tokensPath = path.resolve(SCRIPT_DIR, "_output", "analyze-tokens.json");
  const raw = fs.readFileSync(tokensPath, "utf8");
  return JSON.parse(raw) as AnalyzeTokens;
}

function buildFilesMapping(data: AnalyzeTokens): FilesMapping {
  const filesMapping: FilesMapping = {};

  for (const [tokenId, token] of Object.entries(data.tokens)) {
    for (const [filePath, fileEntry] of Object.entries(token.source)) {
      const perFile = (filesMapping[filePath] ||= {});

      for (const [classString, classEntry] of Object.entries(fileEntry)) {
        const perClass = (perFile[classString] ||= {});

        for (const [role, roleEntry] of Object.entries(classEntry)) {
          const utilityNames = Object.keys(roleEntry);
          const tokenTypes = token.type;

          const existing = perClass[role];
          if (!existing) {
            perClass[role] = { tokenId, role, utilityNames, tokenTypes };
            continue;
          }

          const mergedUtilities = Array.from(
            new Set([...existing.utilityNames, ...utilityNames]),
          );

          if (!shouldPreferNewMapping(existing, tokenTypes, role)) {
            existing.utilityNames = mergedUtilities;
            perClass[role] = existing;
            continue;
          }

          perClass[role] = {
            tokenId,
            role,
            utilityNames: mergedUtilities,
            tokenTypes,
          };
        }
      }
    }
  }

  return filesMapping;
}

function buildSemanticClass(role: RoleName, tokenId: string): string {
  const suffix = tokenId.replace(/^kumo-/, "");
  return `${role}-kumo-${suffix}`;
}

function rewriteClassString(
  classString: string,
  classMapping: ClassMapping,
): string {
  const parts = classString.split(/\s+/).filter(Boolean);

  let changed = false;

  for (const mapping of Object.values(classMapping)) {
    const { role, tokenId, utilityNames } = mapping;
    const toRemove = new Set(utilityNames);

    let removed = false;
    for (let i = parts.length - 1; i >= 0; i -= 1) {
      if (toRemove.has(parts[i])) {
        parts.splice(i, 1);
        removed = true;
      }
    }

    if (!removed) {
      continue;
    }

    const semanticClass = buildSemanticClass(role, tokenId);
    if (!parts.includes(semanticClass)) {
      parts.push(semanticClass);
    }

    changed = true;
  }

  if (!changed) {
    return classString;
  }

  return parts.join(" ");
}

function rewriteFile(
  filePathKey: string,
  fileClassMapping: FileClassMapping,
): void {
  const absolutePath = path.resolve(ROOT_DIR, filePathKey);

  if (!fs.existsSync(absolutePath)) {
    return;
  }

  const original = fs.readFileSync(absolutePath, "utf8");
  let next = original;
  let changed = false;

  for (const [classString, classMapping] of Object.entries(fileClassMapping)) {
    const rewritten = rewriteClassString(classString, classMapping);
    if (rewritten === classString) {
      continue;
    }

    const singleQuoted = `'${classString}'`;
    const doubleQuoted = `"${classString}"`;

    if (next.includes(singleQuoted)) {
      next = next.split(singleQuoted).join(`'${rewritten}'`);
      changed = true;
    }

    if (next.includes(doubleQuoted)) {
      next = next.split(doubleQuoted).join(`"${rewritten}"`);
      changed = true;
    }
  }

  if (!changed || next === original) {
    return;
  }

  fs.writeFileSync(absolutePath, next, "utf8");
}

function parseArgs(argv: string[]): { file?: string } {
  const result: { file?: string } = {};

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--file" || arg === "-f") {
      const value = argv[i + 1];
      if (value && !value.startsWith("-")) {
        result.file = value;
        i += 1;
      }
    }
  }

  return result;
}

function main(): void {
  const data = loadAnalyzeTokens();
  const filesMapping = buildFilesMapping(data);
  const { file } = parseArgs(process.argv);

  if (file) {
    const normalizedFileKey = file.replace(/\\/g, "/");
    const fileEntry = filesMapping[normalizedFileKey];

    if (!fileEntry) {
      return;
    }

    rewriteFile(normalizedFileKey, fileEntry);
    return;
  }

  for (const [filePathKey, fileClassMapping] of Object.entries(filesMapping)) {
    rewriteFile(filePathKey, fileClassMapping);
  }
}

main();
