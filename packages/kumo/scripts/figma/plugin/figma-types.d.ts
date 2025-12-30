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
  createFrame(): FrameNode;
  createText(): TextNode;
  createComponent(): ComponentNode;
  createComponentSet(): ComponentSetNode;
  createSection(): SectionNode;
  createRectangle(): RectangleNode;
  loadFontAsync(font: { family: string; style: string }): Promise<void>;
  variables: {
    getLocalVariableCollections(): VariableCollection[];
    getVariableById(id: string): Variable | null;
    createVariable(
      name: string,
      collection: VariableCollection,
      type: "COLOR" | "FLOAT" | "STRING",
    ): Variable;
  };
  currentPage: PageNode;
}

interface BaseNode {
  name: string;
  type: string;
  appendChild(child: SceneNode): void;
  findChild(callback: (node: BaseNode) => boolean): BaseNode | null;
}

interface PageNode extends BaseNode {
  type: "PAGE";
}

interface SectionNode extends BaseNode {
  type: "SECTION";
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
