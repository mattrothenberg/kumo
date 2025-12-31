import { fetchComponents, fetchSvg } from './fetchers.js';
import { downloadAndWriteSVGs } from './file-operations.js';
import { combine, getIconNames } from './format-api.js';
import { ComponentType } from './schema.js';

export async function main() {
  try {
    const svgDir = 'dist/icons/svg';
    const components = await fetchComponents();
    const uniqueComponents = components.meta.components.filter(
      (component) => component.containing_frame.pageName === 'Icons',
    );

    const componentIds = uniqueComponents
      .map((component: ComponentType) => component.node_id)
      .join(',');

    const newNames = getIconNames(uniqueComponents);
    const svgs = await fetchSvg(componentIds);
    const output = combine(newNames, svgs.images);

    await downloadAndWriteSVGs(output, svgDir);

    const message = `SVG assets written to ${svgDir}`;
    console.log(message);
    return;
  } catch (error) {
    console.error('Error: could not retrieve icons', error);
    throw error;
  }
}

main();
