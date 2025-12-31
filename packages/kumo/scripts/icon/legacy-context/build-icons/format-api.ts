import { ComponentType } from './schema.js';

export function warnDuplicateGlyph(glyph?: string, count?: number): void {
  console.warn(`WARNING: "${glyph}" is duplicated ${count} times.`);
}

export function warnModifyNameWithDash(str: string): void {
  console.warn(
    `WARNING: The component "${str}" will be converted to dash-case.`,
  );
}

export function toDashCase(
  str: string,
  warnFunction: (str: string) => void = warnModifyNameWithDash,
): string {
  if (/\s+/.test(str)) {
    warnFunction(str);
  }

  return str
    .replace(/\s+/g, '-')
    .replace(/[^-\w]+/g, '')
    .toLowerCase();
}

export function findDuplicates(strings: string[]) {
  const duplicates: Record<string, number> = {};
  strings.forEach((str) => {
    duplicates[str] = (duplicates[str] || 0) + 1;
  });

  return Object.entries(duplicates)
    .filter(([, count]) => count > 1)
    .map(([value, count]) => ({ value, count }));
}

export function getIconNames(
  components: ComponentType[],
  warnFunction: (
    value: string | undefined,
    count: number,
  ) => void = warnDuplicateGlyph,
) {
  const newNames = components.reduce(
    (accumulator: Record<string, string>, component: ComponentType) => {
      accumulator[component.node_id] = `${component.name.toLowerCase()}`;
      return accumulator;
    },
    {},
  );

  const duplicateReports = findDuplicates(Object.values(newNames));
  if (duplicateReports.length > 0) {
    duplicateReports.forEach((report) => {
      warnFunction(report.value, report.count);
    });
  }

  return newNames;
}

export function combine(
  names: Record<string, string>,
  urls: Record<string, string>,
) {
  const combined: Record<string, string> = {};

  for (const [nodeId, name] of Object.entries(names)) {
    const url = urls[nodeId];
    if (url !== undefined) {
      combined[name] = url;
    }
  }

  return combined;
}
