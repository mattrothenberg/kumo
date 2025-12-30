/**
 * Minimal Figma Plugin API type declarations
 * For full types, install @figma/plugin-typings
 */

declare const figma: PluginAPI;
declare const __html__: string;

interface PluginAPI {
  showUI(html: string, options?: { width?: number; height?: number }): void;
  closePlugin(message?: string): void;
  notify(
    message: string,
    options?: { error?: boolean; timeout?: number },
  ): void;
  ui: {
    onmessage: ((msg: any) => void) | ((msg: any) => Promise<void>);
  };
  root: DocumentNode;
  createFrame(): FrameNode;
  createText(): TextNode;
  createComponent(): ComponentNode;
  createComponentSet(): ComponentSetNode;
  createSection(): SectionNode;
  createPage(): PageNode;
  createRectangle(): RectangleNode;
  createEllipse(): EllipseNode;
  loadFontAsync(font: { family: string; style: string }): Promise<void>;
  variables: {
    getLocalVariableCollections(): VariableCollection[];
    getVariableById(id: string): Variable | null;
    createVariable(
      name: string,
      collection: VariableCollection,
      type: "COLOR" | "FLOAT" | "STRING",
    ): Variable;
    /**
     * Binds a variable to a paint's color property
     * @param paint - The paint to bind the variable to
     * @param field - The field to bind (currently only 'color' is supported)
     * @param variable - The variable to bind
     * @returns A new paint with the variable bound
     */
    setBoundVariableForPaint(
      paint: SolidPaint,
      field: "color",
      variable: Variable,
    ): SolidPaint;
  };
  currentPage: PageNode;
}

interface BaseNode {
  name: string;
  type: string;
  appendChild(child: SceneNode): void;
  findChild(callback: (node: BaseNode) => boolean): BaseNode | null;
  remove(): void;
}

interface DocumentNode {
  children: readonly PageNode[];
}

interface PageNode extends BaseNode {
  type: "PAGE";
  children: readonly SceneNode[];
}

interface SectionNode extends BaseNode {
  type: "SECTION";
  children: readonly SceneNode[];
}

interface SceneNode extends BaseNode {
  fills?: ReadonlyArray<Paint>;
  strokes?: ReadonlyArray<Paint>;
  strokeWeight?: number;
  setBoundVariable(
    field: string,
    variable: { type: "VARIABLE_ALIAS"; id: string },
  ): void;
}

interface FrameNode extends SceneNode {
  type: "FRAME";
  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL";
  primaryAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";
  counterAxisAlignItems?: "MIN" | "CENTER" | "MAX";
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  itemSpacing: number;
  primaryAxisSizingMode?: "FIXED" | "AUTO";
  counterAxisSizingMode?: "FIXED" | "AUTO";
  cornerRadius: number;
}

interface TextNode extends SceneNode {
  type: "TEXT";
  characters: string;
  fontSize: number;
  fontName: { family: string; style: string };
}

interface RectangleNode extends SceneNode {
  type: "RECTANGLE";
  cornerRadius: number;
}

interface EllipseNode extends SceneNode {
  type: "ELLIPSE";
  resize(width: number, height: number): void;
  x: number;
  y: number;
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
  dashPattern: number[];
}

interface ComponentNode extends SceneNode {
  type: "COMPONENT";
}

interface ComponentSetNode extends SceneNode {
  type: "COMPONENT_SET";
}

interface Paint {
  type: string;
  color?: RGB;
  opacity?: number;
}

interface SolidPaint extends Paint {
  type: "SOLID";
  color: RGB;
  boundVariables?: {
    color?: VariableAlias;
  };
}

interface VariableAlias {
  type: "VARIABLE_ALIAS";
  id: string;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface VariableCollection {
  name: string;
  variableIds: string[];
}

interface Variable {
  id: string;
  name: string;
}

type ComponentPropertyDefinition =
  | { type: "BOOLEAN"; defaultValue?: boolean }
  | { type: "TEXT"; defaultValue?: string }
  | { type: "VARIANT"; defaultValue?: string; variantOptions?: string[] }
  | { type: "INSTANCE_SWAP" };
