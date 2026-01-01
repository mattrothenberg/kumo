"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // scripts/figma/plugin/generators/shared.ts
  var BORDER_RADIUS = {
    /** Small radius (2px) */
    sm: 2,
    /** Medium radius (6px) */
    md: 6,
    /** Large radius (8px) */
    lg: 8,
    /** Full rounded (9999px) */
    full: 9999
  };
  var FONT_SIZE = {
    /** Extra small (12px) */
    xs: 12,
    /** Base (16px) */
    base: 16,
    /** Large (20px) */
    lg: 20
  };
  function bindFillToVariable(node, variableId, opacity) {
    if (!("fills" in node)) return;
    const variable = figma.variables.getVariableById(variableId);
    if (!variable) {
      console.warn(`Variable not found: ${variableId}`);
      return;
    }
    let fill = {
      type: "SOLID",
      color: { r: 1, g: 1, b: 1 },
      opacity: opacity !== void 0 ? opacity : 1
    };
    fill = figma.variables.setBoundVariableForPaint(fill, "color", variable);
    node.fills = [fill];
  }
  function bindStrokeToVariable(node, variableId, weight = 1) {
    if (!("strokes" in node)) return;
    const variable = figma.variables.getVariableById(variableId);
    if (!variable) {
      console.warn(`Variable not found: ${variableId}`);
      return;
    }
    let stroke = {
      type: "SOLID",
      color: { r: 1, g: 1, b: 1 }
    };
    stroke = figma.variables.setBoundVariableForPaint(stroke, "color", variable);
    node.strokes = [stroke];
    node.strokeWeight = weight;
  }
  function createTextNode(text, fontSize, fontWeight = 400) {
    return __async(this, null, function* () {
      const textNode = figma.createText();
      yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
      textNode.characters = text;
      textNode.fontSize = fontSize;
      textNode.fontName = { family: "Inter", style: "Regular" };
      if (fontWeight >= 600) {
        yield figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
        textNode.fontName = { family: "Inter", style: "Semi Bold" };
      } else if (fontWeight >= 500) {
        yield figma.loadFontAsync({ family: "Inter", style: "Medium" });
        textNode.fontName = { family: "Inter", style: "Medium" };
      }
      return textNode;
    });
  }
  function createRowLabel(text, x, y) {
    return __async(this, null, function* () {
      const textNode = figma.createText();
      yield figma.loadFontAsync({ family: "Inter", style: "Medium" });
      textNode.characters = text;
      textNode.fontSize = 12;
      textNode.fontName = { family: "Inter", style: "Medium" };
      const mutedVar = getVariableByName("text-color-muted");
      if (mutedVar) {
        let fill = {
          type: "SOLID",
          color: { r: 0.5, g: 0.5, b: 0.5 }
        };
        fill = figma.variables.setBoundVariableForPaint(fill, "color", mutedVar);
        textNode.fills = [fill];
      } else {
        textNode.fills = [
          {
            type: "SOLID",
            color: { r: 0.5, g: 0.5, b: 0.5 }
          }
        ];
      }
      textNode.x = x;
      textNode.y = y;
      return textNode;
    });
  }
  function createColumnHeaders(headers, y, frame) {
    return __async(this, null, function* () {
      for (const header of headers) {
        const labelNode = yield createRowLabel(header.text, header.x, y);
        frame.appendChild(labelNode);
      }
    });
  }
  function getVariableByName(variableName) {
    const collections = figma.variables.getLocalVariableCollections();
    const kumoColors = collections.find((c) => c.name === "kumo-colors");
    if (!kumoColors) {
      console.warn(
        "kumo-colors collection not found. Available collections:",
        collections.map((c) => c.name).join(", ") || "none"
      );
      figma.notify("\u26A0\uFE0F kumo-colors collection not found", { error: true });
      return void 0;
    }
    const variables = kumoColors.variableIds.map((id) => figma.variables.getVariableById(id)).filter((v) => v !== null);
    const variable = variables.find((v) => v.name === variableName);
    if (!variable) {
      console.warn(
        `Variable "${variableName}" not found in kumo-colors collection`
      );
    }
    return variable;
  }
  function setWhiteTextColor(textNode) {
    const fill = {
      type: "SOLID",
      color: { r: 1, g: 1, b: 1 }
    };
    textNode.fills = [fill];
  }
  function bindTextColorToVariable(textNode, variableId) {
    const variable = figma.variables.getVariableById(variableId);
    if (!variable) {
      console.warn("Variable not found: " + variableId);
      figma.notify(`\u26A0\uFE0F Text color variable not found: ${variableId}`, {
        error: true
      });
      return;
    }
    let fill = {
      type: "SOLID",
      color: { r: 1, g: 1, b: 1 }
    };
    fill = figma.variables.setBoundVariableForPaint(fill, "color", variable);
    textNode.fills = [fill];
  }
  function getKumoColorsModes() {
    const collections = figma.variables.getLocalVariableCollections();
    const kumoColors = collections.find((c) => c.name === "kumo-colors");
    if (!kumoColors) {
      console.warn("kumo-colors collection not found");
      return null;
    }
    const lightMode = kumoColors.modes.find(
      (m) => m.name.toLowerCase() === "light"
    );
    const darkMode = kumoColors.modes.find(
      (m) => m.name.toLowerCase() === "dark"
    );
    if (!lightMode || !darkMode) {
      console.warn("Light or dark mode not found in kumo-colors collection");
      return null;
    }
    return {
      collection: kumoColors,
      lightModeId: lightMode.modeId,
      darkModeId: darkMode.modeId
    };
  }
  function createModeSection(page, sectionName, mode) {
    const section = figma.createSection();
    section.name = `${sectionName} (${mode})`;
    const frame = figma.createFrame();
    frame.name = "Content";
    frame.layoutMode = "NONE";
    const surfaceVar = getVariableByName("color-surface");
    if (surfaceVar) {
      let fill = {
        type: "SOLID",
        color: { r: 1, g: 1, b: 1 }
      };
      fill = figma.variables.setBoundVariableForPaint(fill, "color", surfaceVar);
      frame.fills = [fill];
    } else {
      frame.fills = [
        {
          type: "SOLID",
          color: mode === "light" ? { r: 1, g: 1, b: 1 } : { r: 0.067, g: 0.067, b: 0.067 }
          // #111111
        }
      ];
    }
    const modesInfo = getKumoColorsModes();
    if (modesInfo) {
      const modeId = mode === "light" ? modesInfo.lightModeId : modesInfo.darkModeId;
      frame.setExplicitVariableModeForCollection(modesInfo.collection, modeId);
    }
    section.appendChild(frame);
    frame.x = 0;
    frame.y = 0;
    section.fills = [];
    page.appendChild(section);
    return { section, frame };
  }
  function findComponentSet(componentSetName) {
    const componentsPage = figma.root.children.find(function(page) {
      return page.type === "PAGE" && page.name.trim().toLowerCase() === "components";
    });
    if (!componentsPage) {
      console.warn("Components page not found");
      return void 0;
    }
    function findInNode(node) {
      if (node.type === "COMPONENT_SET" && node.name === componentSetName) {
        return node;
      }
      if ("children" in node && node.children) {
        for (let i = 0; i < node.children.length; i++) {
          const found = findInNode(node.children[i]);
          if (found) return found;
        }
      }
      return void 0;
    }
    for (let i = 0; i < componentsPage.children.length; i++) {
      const found = findInNode(componentsPage.children[i]);
      if (found) return found;
    }
    console.warn("ComponentSet not found: " + componentSetName);
    return void 0;
  }
  function createComponentInstance(componentSetName, variantProps) {
    const componentSet = findComponentSet(componentSetName);
    if (!componentSet) {
      return void 0;
    }
    const variantName = Object.entries(variantProps).map(function(entry) {
      return entry[0] + "=" + entry[1];
    }).join(", ");
    const children = componentSet.children;
    if (!children) {
      return void 0;
    }
    const variant = children.find(function(child) {
      return child.type === "COMPONENT" && child.name === variantName;
    });
    if (!variant) {
      console.warn(
        "Variant not found in " + componentSetName + ": " + variantName
      );
      return void 0;
    }
    return variant.createInstance();
  }

  // scripts/figma/plugin/parsers/tailwind-to-figma.ts
  function getOrDefault(scale, key, fallback) {
    const value = scale[key];
    return value !== void 0 ? value : fallback;
  }
  var SPACING_SCALE = {
    "0": 0,
    px: 1,
    "0.5": 2,
    "1": 4,
    "1.5": 6,
    "2": 8,
    "2.5": 10,
    "3": 12,
    "3.5": 14,
    "4": 16,
    "5": 20,
    "6": 24,
    "6.5": 26,
    // Custom Kumo size
    "7": 28,
    "8": 32,
    "9": 36,
    "10": 40,
    "11": 44,
    "12": 48
  };
  var FONT_SIZE_SCALE = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30
  };
  var BORDER_RADIUS_SCALE = {
    none: 0,
    sm: 2,
    DEFAULT: 4,
    md: 6,
    lg: 8,
    xl: 12,
    "2xl": 16,
    "3xl": 24,
    full: 9999
  };
  var COLOR_TO_VARIABLE = {
    // Background colors
    "bg-primary": "color-primary",
    "bg-secondary": "color-secondary",
    "bg-surface": "color-surface",
    "bg-surface-inverse": "color-surface-inverse",
    "bg-error": "color-error",
    "bg-info": "color-info",
    "bg-alert": "color-alert",
    "bg-color": "color-color",
    "bg-accent": "color-accent",
    "bg-subtle": "color-subtle",
    "bg-transparent": null,
    // No fill
    "bg-inherit": null,
    // No fill
    // Text colors
    "text-white": null,
    // Hardcoded white
    "text-surface": "text-color-surface",
    "text-surface-inverse": "text-color-surface-inverse",
    "text-error": "text-color-error",
    "text-info": "text-color-info",
    "text-alert": "text-color-alert",
    "text-muted": "text-color-muted",
    "text-label": "text-color-label",
    "!text-white": null,
    // Hardcoded white (important)
    "!text-surface": "text-color-surface",
    "!text-error": "text-color-error",
    // Border colors
    "border-color": "color-color",
    "border-primary": "color-primary",
    "border-border": "color-border",
    "border-error": "color-error",
    "border-info": "color-info",
    "border-alert": "color-alert",
    "ring-border": "color-border"
  };
  function parseTailwindClasses(classes) {
    const result = {};
    const classList = classes.split(/\s+/).filter(Boolean);
    for (const cls of classList) {
      if (cls.includes(":") && !cls.startsWith("!")) {
        continue;
      }
      const heightMatch = cls.match(/^h-(\d+\.?\d*)$/);
      if (heightMatch) {
        result.height = getOrDefault(
          SPACING_SCALE,
          heightMatch[1],
          parseFloat(heightMatch[1]) * 4
        );
        continue;
      }
      const pxMatch = cls.match(/^px-(\d+\.?\d*)$/);
      if (pxMatch) {
        result.paddingX = getOrDefault(
          SPACING_SCALE,
          pxMatch[1],
          parseFloat(pxMatch[1]) * 4
        );
        continue;
      }
      const pyMatch = cls.match(/^py-(\d+\.?\d*)$/);
      if (pyMatch) {
        result.paddingY = getOrDefault(
          SPACING_SCALE,
          pyMatch[1],
          parseFloat(pyMatch[1]) * 4
        );
        continue;
      }
      const gapMatch = cls.match(/^gap-(\d+\.?\d*)$/);
      if (gapMatch) {
        result.gap = getOrDefault(
          SPACING_SCALE,
          gapMatch[1],
          parseFloat(gapMatch[1]) * 4
        );
        continue;
      }
      const radiusMatch = cls.match(/^rounded-?(\w*)$/);
      if (radiusMatch) {
        const key = radiusMatch[1] || "DEFAULT";
        result.borderRadius = getOrDefault(
          BORDER_RADIUS_SCALE,
          key,
          BORDER_RADIUS_SCALE.DEFAULT
        );
        continue;
      }
      const fontMatch = cls.match(/^text-(xs|sm|base|lg|xl|2xl|3xl)$/);
      if (fontMatch) {
        result.fontSize = FONT_SIZE_SCALE[fontMatch[1]];
        continue;
      }
      if (cls.startsWith("bg-")) {
        const opacityMatch = cls.match(/^(bg-[^/]+)\/([0-9]+)$/);
        if (opacityMatch) {
          const baseClass = opacityMatch[1];
          const opacityValue = opacityMatch[2];
          const varName = COLOR_TO_VARIABLE[baseClass];
          if (varName !== void 0) {
            result.fillVariable = `${varName}/${opacityValue}`;
          }
        } else {
          const varName = COLOR_TO_VARIABLE[cls];
          if (varName !== void 0) {
            result.fillVariable = varName;
          }
        }
        continue;
      }
      if (cls.startsWith("text-") || cls.startsWith("!text-")) {
        const varName = COLOR_TO_VARIABLE[cls];
        if (varName !== void 0) {
          result.textVariable = varName;
          if (cls === "text-white" || cls === "!text-white") {
            result.isWhiteText = true;
          }
        }
        continue;
      }
      if (cls === "border" || cls.startsWith("border-")) {
        result.hasBorder = true;
        if (cls === "border-dashed") {
          result.borderStyle = "dashed";
        } else if (cls.startsWith("border-") && !cls.includes("dashed")) {
          const varName = COLOR_TO_VARIABLE[cls];
          if (varName) {
            result.strokeVariable = varName;
          }
        }
        continue;
      }
      if (cls === "ring" || cls.startsWith("ring-")) {
        result.hasBorder = true;
        const varName = COLOR_TO_VARIABLE[cls];
        if (varName) {
          result.strokeVariable = varName;
        }
        continue;
      }
    }
    return result;
  }

  // ai/component-registry.json
  var component_registry_default = {
    version: "1.0.0",
    components: {
      Badge: {
        name: "Badge",
        type: "component",
        description: "Badge component",
        importPath: "@cloudflare/kumo",
        category: "Display",
        props: {
          variant: {
            type: "enum",
            optional: true,
            values: [
              "primary",
              "secondary",
              "destructive",
              "outline",
              "beta"
            ],
            descriptions: {
              primary: "Default high-emphasis badge for important labels",
              secondary: "Subtle badge for secondary information",
              destructive: "Error or danger state indicator",
              outline: "Bordered badge with transparent background",
              beta: "Indicates beta or experimental features"
            },
            classes: {
              primary: "bg-surface-inverse text-surface-inverse",
              secondary: "bg-color text-surface",
              destructive: "bg-error text-white",
              outline: "border border-color bg-transparent text-surface",
              beta: "border border-dashed border-primary bg-transparent text-info"
            },
            default: "primary"
          },
          className: {
            type: "string",
            optional: true
          },
          children: {
            type: "ReactNode",
            optional: true
          }
        },
        examples: [
          '<Badge variant="primary">Badge</Badge>',
          '<Badge variant="secondary">Badge</Badge>',
          '<Badge variant="destructive">Badge</Badge>',
          '<Badge variant="outline">Badge</Badge>',
          '<Badge variant="beta">Badge</Badge>'
        ],
        colors: [
          "bg-color",
          "bg-error",
          "bg-surface-inverse",
          "border-color",
          "border-primary",
          "text-info",
          "text-surface",
          "text-surface-inverse"
        ]
      },
      Banner: {
        name: "Banner",
        type: "component",
        description: "Banner component",
        importPath: "@cloudflare/kumo",
        category: "Feedback",
        props: {
          icon: {
            type: "ReactNode",
            optional: true
          },
          text: {
            type: "string",
            required: true
          },
          variant: {
            type: "enum",
            optional: true,
            values: [
              "default",
              "alert",
              "error"
            ],
            descriptions: {
              default: "Informational banner for general messages",
              alert: "Warning banner for cautionary messages",
              error: "Error banner for critical issues"
            },
            classes: {
              default: "bg-info/20 border-info text-info selection:bg-info-selection",
              alert: "bg-alert/20 border-alert text-alert selection:bg-alert-selection",
              error: "bg-error/20 border-error text-error selection:bg-error-selection"
            },
            default: "default"
          },
          className: {
            type: "string",
            optional: true
          }
        },
        examples: [
          '<Banner variant="default" text="This is a banner message" icon={<InfoIcon size={16} />} />',
          '<Banner variant="alert" text="This is a banner message" icon={<InfoIcon size={16} />} />',
          '<Banner variant="error" text="This is a banner message" icon={<InfoIcon size={16} />} />'
        ],
        colors: [
          "bg-alert",
          "bg-alert-selection",
          "bg-error",
          "bg-error-selection",
          "bg-info",
          "bg-info-selection",
          "border-alert",
          "border-error",
          "border-info",
          "text-alert",
          "text-error",
          "text-info"
        ]
      },
      Breadcrumbs: {
        name: "Breadcrumbs",
        type: "block",
        description: "Breadcrumbs component",
        importPath: "@cloudflare/kumo",
        category: "Block",
        props: {
          size: {
            type: "enum",
            optional: true,
            values: [
              "sm",
              "base"
            ],
            descriptions: {
              sm: "Compact breadcrumbs for dense UIs",
              base: "Default breadcrumbs size"
            },
            classes: {
              sm: "text-sm h-10 gap-0.5",
              base: "text-base h-12 gap-1"
            },
            default: "base"
          },
          children: {
            type: "ReactNode",
            optional: true
          },
          className: {
            type: "string",
            optional: true
          }
        },
        examples: [
          '<Breadcrumbs>\n      <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>\n      <Breadcrumbs.Separator />\n      <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>\n      <Breadcrumbs.Separator />\n      <Breadcrumbs.Current>Current Project</Breadcrumbs.Current>\n    </Breadcrumbs>',
          '<Breadcrumbs size="sm">\n  <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>\n  <Breadcrumbs.Separator />\n  <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>\n  <Breadcrumbs.Separator />\n  <Breadcrumbs.Current>Current Project</Breadcrumbs.Current>\n</Breadcrumbs>',
          '<Breadcrumbs size="base">\n  <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>\n  <Breadcrumbs.Separator />\n  <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>\n  <Breadcrumbs.Separator />\n  <Breadcrumbs.Current>Current Project</Breadcrumbs.Current>\n</Breadcrumbs>',
          '<Breadcrumbs>\n      <Breadcrumbs.Link href="/" icon={<House size={16} />}>\n        Home\n      </Breadcrumbs.Link>\n      <Breadcrumbs.Separator />\n      <Breadcrumbs.Link href="/documents" icon={<Folder size={16} />}>\n        Documents\n      </Breadcrumbs.Link>\n      <Breadcrumbs.Separator />\n      <Breadcrumbs.Current icon={<File size={16} />}>\n        File.txt\n      </Breadcrumbs.Current>\n    </Breadcrumbs>',
          '<Breadcrumbs>\n      <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>\n      <Breadcrumbs.Separator />\n      <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>\n      <Breadcrumbs.Separator />\n      <Breadcrumbs.Link href="/projects/web">Web Applications</Breadcrumbs.Link>\n      <Breadcrumbs.Separator />\n      <Breadcrumbs.Link href="/projects/web/dashboard">\n        Dashboard\n      </Breadcrumbs.Link>\n      <Breadcrumbs.Separator />\n      <Breadcrumbs.Current>Settings</Breadcrumbs.Current>\n    </Breadcrumbs>',
          "<Breadcrumbs>\n      <Breadcrumbs.Current>Home</Breadcrumbs.Current>\n    </Breadcrumbs>",
          '<Breadcrumbs>\n      <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>\n      <Breadcrumbs.Separator />\n      <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>\n      <Breadcrumbs.Separator />\n      <Breadcrumbs.Current>Current Project</Breadcrumbs.Current>\n      <Breadcrumbs.Clipboard text="https://example.com/projects/current-project" />\n    </Breadcrumbs>'
        ],
        colors: [
          "text-disabled",
          "text-green",
          "text-muted"
        ],
        subComponents: {
          Link: {
            name: "Link",
            description: "Link sub-component",
            props: {
              href: {
                type: "string",
                required: true
              },
              icon: {
                type: "React.ReactNode",
                optional: true
              }
            }
          },
          Current: {
            name: "Current",
            description: "Current sub-component",
            props: {
              loading: {
                type: "boolean",
                optional: true
              },
              icon: {
                type: "React.ReactNode",
                optional: true
              }
            }
          },
          Separator: {
            name: "Separator",
            description: "Separator sub-component",
            props: {}
          },
          Clipboard: {
            name: "Clipboard",
            description: "Clipboard sub-component",
            props: {
              text: {
                type: "string",
                required: true
              }
            }
          }
        }
      },
      Button: {
        name: "Button",
        type: "component",
        description: "Button component",
        importPath: "@cloudflare/kumo",
        category: "Action",
        props: {
          children: {
            type: "ReactNode",
            optional: true
          },
          className: {
            type: "string",
            optional: true
          },
          icon: {
            type: "ReactNode",
            optional: true
          },
          loading: {
            type: "boolean",
            optional: true
          },
          shape: {
            type: "enum",
            optional: true,
            values: [
              "base",
              "square",
              "circle"
            ],
            descriptions: {
              base: "Default rectangular button shape",
              square: "Square button for icon-only actions",
              circle: "Circular button for icon-only actions"
            },
            classes: {
              square: "items-center justify-center p-0",
              circle: "items-center justify-center p-0 rounded-full"
            },
            default: "base"
          },
          size: {
            type: "enum",
            optional: true,
            values: [
              "xs",
              "sm",
              "base",
              "lg"
            ],
            descriptions: {
              xs: "Extra small button for compact UIs",
              sm: "Small button for secondary actions",
              base: "Default button size",
              lg: "Large button for primary CTAs"
            },
            classes: {
              xs: "h-5 gap-1 rounded-sm px-1.5 text-xs",
              sm: "h-6.5 gap-1 rounded-md px-2 text-xs",
              base: "h-9 gap-1.5 rounded-lg px-3 text-base",
              lg: "h-10 gap-2 rounded-lg px-4 text-base"
            },
            default: "base"
          },
          variant: {
            type: "enum",
            optional: true,
            values: [
              "primary",
              "secondary",
              "ghost",
              "destructive",
              "secondary-destructive",
              "outline"
            ],
            descriptions: {
              primary: "High-emphasis button for primary actions",
              secondary: "Default button style for most actions",
              ghost: "Minimal button with no background",
              destructive: "Danger button for destructive actions like delete",
              "secondary-destructive": "Secondary button with destructive text for less prominent dangerous actions",
              outline: "Bordered button with transparent background"
            },
            classes: {
              primary: "bg-primary !text-white hover:bg-primary/70 disabled:bg-primary/50",
              secondary: "bg-secondary !text-surface ring not-disabled:hover:border-subtle! not-disabled:hover:bg-subtle disabled:bg-secondary/50 disabled:!text-surface/70 ring-border data-[state=open]:bg-subtle",
              ghost: "text-surface hover:bg-accent shadow-none bg-inherit",
              destructive: "bg-error !text-white hover:bg-error/70",
              "secondary-destructive": "bg-secondary !text-error ring not-disabled:hover:border-subtle! not-disabled:hover:bg-subtle disabled:bg-secondary/50 disabled:!text-error/70 ring-border data-[state=open]:bg-subtle",
              outline: "bg-surface text-surface ring ring-border"
            },
            stateClasses: {
              primary: {
                hover: "hover:bg-primary/70",
                disabled: "disabled:bg-primary/50"
              },
              secondary: {
                "not-disabled": "not-disabled:hover:border-subtle! not-disabled:hover:bg-subtle",
                disabled: "disabled:bg-secondary/50 disabled:!text-surface/70",
                "data-state": "data-[state=open]:bg-subtle"
              },
              ghost: {
                hover: "hover:bg-accent"
              },
              destructive: {
                hover: "hover:bg-error/70"
              },
              "secondary-destructive": {
                "not-disabled": "not-disabled:hover:border-subtle! not-disabled:hover:bg-subtle",
                disabled: "disabled:bg-secondary/50 disabled:!text-error/70",
                "data-state": "data-[state=open]:bg-subtle"
              }
            },
            default: "secondary"
          },
          onChange: {
            type: "React.FormEventHandler<HTMLButtonElement>",
            optional: true
          },
          onSubmit: {
            type: "React.FormEventHandler<HTMLButtonElement>",
            optional: true
          },
          onClick: {
            type: "React.MouseEventHandler<HTMLButtonElement>",
            optional: true
          },
          id: {
            type: "string",
            optional: true
          },
          lang: {
            type: "string",
            optional: true
          },
          title: {
            type: "string",
            optional: true
          },
          disabled: {
            type: "boolean",
            optional: true
          },
          name: {
            type: "string",
            optional: true
          },
          type: {
            type: "enum",
            optional: true,
            values: [
              "submit",
              "reset",
              "button"
            ]
          },
          value: {
            type: "string | string[] | number",
            optional: true
          }
        },
        examples: [
          '<Button variant="primary">Button</Button>',
          '<Button variant="secondary">Button</Button>',
          '<Button variant="ghost">Button</Button>',
          '<Button variant="destructive">Button</Button>',
          '<Button variant="secondary-destructive">Button</Button>',
          '<Button variant="outline">Button</Button>',
          '<Button size="xs">Button</Button>',
          '<Button size="sm">Button</Button>',
          '<Button size="base">Button</Button>',
          '<Button size="lg">Button</Button>',
          '<Button shape="base" icon={PlusIcon} />',
          '<Button shape="square" icon={PlusIcon} />',
          '<Button shape="circle" icon={PlusIcon} />',
          '<Button variant="primary" disabled={true}>Button</Button>',
          '<Button variant="secondary" disabled={true}>Button</Button>',
          '<Button variant="ghost" disabled={true}>Button</Button>',
          '<Button variant="destructive" disabled={true}>Button</Button>',
          '<Button variant="secondary-destructive" disabled={true}>Button</Button>',
          '<Button variant="outline" disabled={true}>Button</Button>',
          '<Button variant="primary" icon={PlusIcon}>Add Item</Button>',
          '<Button variant="primary" loading={true}>Loading...</Button>',
          '<div className="flex gap-2">\n      <RefreshButton />\n      <RefreshButton loading />\n    </div>',
          '<div className="flex gap-2">\n      <LinkButton href="#" variant="ghost">\n        Link Button\n      </LinkButton>\n      <LinkButton href="#" variant="primary" icon={PlusIcon}>\n        Link with Icon\n      </LinkButton>\n    </div>'
        ],
        colors: [
          "bg-accent",
          "bg-error",
          "bg-primary",
          "bg-secondary",
          "bg-subtle",
          "bg-surface",
          "border-subtle",
          "ring-active",
          "ring-border",
          "text-error",
          "text-muted",
          "text-surface"
        ]
      },
      Checkbox: {
        name: "Checkbox",
        type: "component",
        description: "Checkbox component",
        importPath: "@cloudflare/kumo",
        category: "Input",
        props: {
          variant: {
            type: "enum",
            optional: true,
            description: 'Visual variant: "default" or "error" for validation failures (visual only, no error text)',
            values: [
              "default",
              "error"
            ],
            descriptions: {
              default: "Default checkbox appearance",
              error: "Error state for validation failures"
            },
            classes: {
              default: "[&:focus-within>span]:ring-active [&:hover>span]:ring-active",
              error: "[&>span]:ring-error"
            },
            stateClasses: {
              default: {
                focus: "[&:focus-within>span]:ring-active",
                hover: "[&:hover>span]:ring-active"
              }
            },
            default: "default"
          },
          label: {
            type: "string",
            optional: true,
            description: "Label text for the checkbox (enables built-in Field wrapper)"
          },
          controlFirst: {
            type: "boolean",
            optional: true,
            description: "When true (default), checkbox appears before label. When false, label appears before checkbox."
          },
          checked: {
            type: "boolean",
            optional: true
          },
          indeterminate: {
            type: "boolean",
            optional: true
          },
          disabled: {
            type: "boolean",
            optional: true
          },
          name: {
            type: "string",
            optional: true
          },
          placeholder: {
            type: "string",
            optional: true
          },
          readOnly: {
            type: "boolean",
            optional: true
          },
          required: {
            type: "boolean",
            optional: true
          },
          size: {
            type: "number",
            optional: true
          },
          type: {
            type: "React.HTMLInputTypeAttribute",
            optional: true
          },
          value: {
            type: "string | string[] | number",
            optional: true
          },
          onChange: {
            type: "React.ChangeEventHandler<HTMLInputElement>",
            optional: true
          },
          className: {
            type: "string",
            optional: true
          },
          id: {
            type: "string",
            optional: true
          },
          lang: {
            type: "string",
            optional: true
          },
          title: {
            type: "string",
            optional: true
          },
          onSubmit: {
            type: "React.FormEventHandler<HTMLInputElement>",
            optional: true
          },
          onClick: {
            type: "React.MouseEventHandler<HTMLInputElement>",
            optional: true
          },
          onValueChange: {
            type: "(checked: boolean) => void",
            description: "Callback when checkbox value changes"
          }
        },
        examples: [
          '<div className="flex flex-col gap-4">\n      {Object.keys(KUMO_CHECKBOX_VARIANTS.variant).map((variant) => (\n        <div\n          key={variant}\n          className="border border-dotted border-color bg-surface p-4"\n        >\n          <div className="mb-2 font-sans text-sm leading-5 font-light tracking-wide text-muted uppercase">\n            {variant}\n          </div>\n          <Checkbox label="Checkbox variant" variant={variant as any} />\n        </div>\n      ))}\n    </div>',
          `<Checkbox label="I'm checked" checked={true} />`,
          '<Checkbox label="Indeterminate state" indeterminate={true} />',
          '<div className="flex flex-col gap-4">\n      {[false, true, "indeterminate"].map((state) => (\n        <Checkbox\n          key={String(state)}\n          label={`Disabled (${state === "indeterminate" ? "indeterminate" : state ? "checked" : "unchecked"})`}\n          checked={state === true}\n          indeterminate={state === "indeterminate"}\n          disabled\n        />\n      ))}\n    </div>',
          '<div className="flex flex-col gap-4">\n      {[false, true].map((checked) => (\n        <Checkbox\n          key={String(checked)}\n          label={`Error (${checked ? "checked" : "unchecked"})`}\n          variant="error"\n          checked={checked}\n        />\n      ))}\n    </div>',
          '<Checkbox label="Label first" controlFirst={false} />',
          '<Checkbox.Group legend="Choose your preferences">\n      <Checkbox.Item label="Email notifications" name="preferences" />\n      <Checkbox.Item label="SMS notifications" name="preferences" />\n      <Checkbox.Item label="Push notifications" name="preferences" />\n    </Checkbox.Group>',
          '<Checkbox.Group\n      legend="Required preferences"\n      error="You must select at least one notification method"\n    >\n      <Checkbox.Item label="Email notifications" name="preferences" />\n      <Checkbox.Item label="SMS notifications" name="preferences" />\n      <Checkbox.Item label="Push notifications" name="preferences" />\n    </Checkbox.Group>',
          '<Checkbox.Group\n      legend="Notification settings"\n      description="Choose how you want to be notified about important updates"\n    >\n      <Checkbox.Item label="Email notifications" value="email" />\n      <Checkbox.Item label="SMS notifications" value="sms" />\n      <Checkbox.Item label="Push notifications" value="push" />\n    </Checkbox.Group>',
          '<Checkbox.Group\n      legend="Marketing preferences"\n      description="Pre-selected with email notifications enabled"\n      defaultValue={["email"]}\n    >\n      <Checkbox.Item label="Email notifications" value="email" />\n      <Checkbox.Item label="SMS notifications" value="sms" />\n      <Checkbox.Item label="Push notifications" value="push" />\n    </Checkbox.Group>',
          '<div className="flex flex-col gap-4">\n        <Checkbox.Group\n          legend="Notification preferences"\n          description="Controlled state - selected values shown below"\n          value={value}\n          onValueChange={setValue}\n        >\n          <Checkbox.Item label="Email notifications" value="email" />\n          <Checkbox.Item label="SMS notifications" value="sms" />\n          <Checkbox.Item label="Push notifications" value="push" />\n        </Checkbox.Group>\n        <div className="rounded-md bg-surface-elevated p-4">\n          <div className="mb-2 text-sm font-medium text-surface">Selected:</div>\n          <code className="text-sm text-muted">{JSON.stringify(value)}</code>\n        </div>\n      </div>',
          '<div className="flex flex-col gap-8">\n      {/* English (LTR) - Control First: Checkbox \u2192 Label */}\n      <fieldset className="rounded border border-border p-4">\n        <legend className="px-2 text-base font-semibold text-surface">\n          English (Checkbox \u2192 Label)\n        </legend>\n        <div className="mt-4 flex flex-col gap-4">\n          <Checkbox label="Checkbox is unchecked" controlFirst={true} />\n          <Checkbox\n            label="Checkbox is unchecked and disabled"\n            disabled\n            controlFirst={true}\n          />\n          <Checkbox label="Checkbox is checked" checked controlFirst={true} />\n          <Checkbox\n            label="Checkbox is checked and disabled"\n            checked\n            disabled\n            controlFirst={true}\n          />\n        </div>\n      </fieldset>\n\n      {/* Spanish (LTR) - Label First: Label \u2192 Checkbox */}\n      <fieldset className="rounded border border-border p-4">\n        <legend className="px-2 text-base font-semibold text-surface">\n          Espa\xF1ol (Etiqueta \u2192 Casilla de verificaci\xF3n)\n        </legend>\n        <div className="mt-4 flex flex-col gap-4">\n          <Checkbox label="La casilla est\xE1 desmarcada" controlFirst={false} />\n          <Checkbox\n            label="La casilla est\xE1 desmarcada y deshabilitada"\n            disabled\n            controlFirst={false}\n          />\n          <Checkbox\n            label="La casilla est\xE1 marcada"\n            checked\n            controlFirst={false}\n          />\n          <Checkbox\n            label="La casilla est\xE1 marcada y deshabilitada"\n            checked\n            disabled\n            controlFirst={false}\n          />\n        </div>\n      </fieldset>\n\n      {/* Arabic (RTL) - Control First: Checkbox \u2192 Label */}\n      <fieldset className="rounded border border-border p-4" dir="rtl">\n        <legend className="px-2 text-base font-semibold text-surface">\n          \u0627\u0644\u0639\u0631\u0628\u064A\u0629 (\u0645\u0631\u0628\u0639 \u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u2190 \u0627\u0644\u062A\u0633\u0645\u064A\u0629)\n        </legend>\n        <div className="mt-4 flex flex-col gap-4">\n          <Checkbox label="\u0645\u0631\u0628\u0639 \u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u063A\u064A\u0631 \u0645\u062D\u062F\u062F" controlFirst={true} />\n          <Checkbox\n            label="\u0645\u0631\u0628\u0639 \u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u063A\u064A\u0631 \u0645\u062D\u062F\u062F \u0648\u0645\u0639\u0637\u0644"\n            disabled\n            controlFirst={true}\n          />\n          <Checkbox label="\u0645\u0631\u0628\u0639 \u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u0645\u062D\u062F\u062F" checked controlFirst={true} />\n          <Checkbox\n            label="\u0645\u0631\u0628\u0639 \u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u0645\u062D\u062F\u062F \u0648\u0645\u0639\u0637\u0644"\n            checked\n            disabled\n            controlFirst={true}\n          />\n        </div>\n      </fieldset>\n\n      {/* Hebrew (RTL) - Label First: Label \u2192 Checkbox */}\n      <fieldset className="rounded border border-border p-4" dir="rtl">\n        <legend className="px-2 text-base font-semibold text-surface">\n          \u05E2\u05D1\u05E8\u05D9\u05EA (\u05EA\u05D5\u05D5\u05D9\u05EA \u2190 \u05EA\u05D9\u05D1\u05EA \u05E1\u05D9\u05DE\u05D5\u05DF)\n        </legend>\n        <div className="mt-4 flex flex-col gap-4">\n          <Checkbox label="\u05EA\u05D9\u05D1\u05EA \u05D4\u05E1\u05D9\u05DE\u05D5\u05DF \u05DC\u05D0 \u05DE\u05E1\u05D5\u05DE\u05E0\u05EA" controlFirst={false} />\n          <Checkbox\n            label="\u05EA\u05D9\u05D1\u05EA \u05D4\u05E1\u05D9\u05DE\u05D5\u05DF \u05DC\u05D0 \u05DE\u05E1\u05D5\u05DE\u05E0\u05EA \u05D5\u05DE\u05D5\u05E9\u05D1\u05EA\u05EA"\n            disabled\n            controlFirst={false}\n          />\n          <Checkbox label="\u05EA\u05D9\u05D1\u05EA \u05D4\u05E1\u05D9\u05DE\u05D5\u05DF \u05DE\u05E1\u05D5\u05DE\u05E0\u05EA" checked controlFirst={false} />\n          <Checkbox\n            label="\u05EA\u05D9\u05D1\u05EA \u05D4\u05E1\u05D9\u05DE\u05D5\u05DF \u05DE\u05E1\u05D5\u05DE\u05E0\u05EA \u05D5\u05DE\u05D5\u05E9\u05D1\u05EA\u05EA"\n            checked\n            disabled\n            controlFirst={false}\n          />\n        </div>\n      </fieldset>\n    </div>',
          '<div className="flex flex-col gap-8">\n      {/* English (LTR) - Control First: Checkbox \u2192 Label */}\n      <div>\n        <Checkbox.Group legend="English (Checkbox \u2192 Label)" controlFirst={true}>\n          <Checkbox.Item label="Email notifications" value="email" />\n          <Checkbox.Item label="SMS notifications" value="sms" />\n          <Checkbox.Item label="Push notifications" value="push" />\n          <Checkbox.Item label="In-app notifications" value="in-app" disabled />\n        </Checkbox.Group>\n      </div>\n\n      {/* Spanish (LTR) - Label First: Label \u2192 Checkbox */}\n      <div>\n        <Checkbox.Group\n          legend="Espa\xF1ol (Etiqueta \u2192 Casilla de verificaci\xF3n)"\n          controlFirst={false}\n        >\n          <Checkbox.Item\n            label="Notificaciones por correo electr\xF3nico"\n            value="email"\n          />\n          <Checkbox.Item label="Notificaciones por SMS" value="sms" />\n          <Checkbox.Item label="Notificaciones push" value="push" />\n          <Checkbox.Item\n            label="Notificaciones en la aplicaci\xF3n"\n            value="in-app"\n            disabled\n          />\n        </Checkbox.Group>\n      </div>\n\n      {/* Arabic (RTL) - Control First: Checkbox \u2192 Label */}\n      <div dir="rtl">\n        <Checkbox.Group\n          legend="\u0627\u0644\u0639\u0631\u0628\u064A\u0629 (\u0645\u0631\u0628\u0639 \u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u2190 \u0627\u0644\u062A\u0633\u0645\u064A\u0629)"\n          controlFirst={true}\n        >\n          <Checkbox.Item label="\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A" value="email" />\n          <Checkbox.Item label="\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u0642\u0635\u064A\u0631\u0629" value="sms" />\n          <Checkbox.Item label="\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0641\u0648\u0631\u064A\u0629" value="push" />\n          <Checkbox.Item\n            label="\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u062F\u0627\u062E\u0644 \u0627\u0644\u062A\u0637\u0628\u064A\u0642"\n            value="in-app"\n            disabled\n          />\n        </Checkbox.Group>\n      </div>\n\n      {/* Hebrew (RTL) - Label First: Label \u2192 Checkbox */}\n      <div dir="rtl">\n        <Checkbox.Group\n          legend="\u05E2\u05D1\u05E8\u05D9\u05EA (\u05EA\u05D5\u05D5\u05D9\u05EA \u2190 \u05EA\u05D9\u05D1\u05EA \u05E1\u05D9\u05DE\u05D5\u05DF)"\n          controlFirst={false}\n        >\n          <Checkbox.Item label="\u05D4\u05EA\u05E8\u05D0\u05D5\u05EA \u05D0\u05D9\u05DE\u05D9\u05D9\u05DC" value="email" />\n          <Checkbox.Item label="\u05D4\u05EA\u05E8\u05D0\u05D5\u05EA SMS" value="sms" />\n          <Checkbox.Item label="\u05D4\u05EA\u05E8\u05D0\u05D5\u05EA \u05D3\u05D7\u05D9\u05E4\u05D4" value="push" />\n          <Checkbox.Item\n            label="\u05D4\u05EA\u05E8\u05D0\u05D5\u05EA \u05D1\u05EA\u05D5\u05DA \u05D4\u05D0\u05E4\u05DC\u05D9\u05E7\u05E6\u05D9\u05D4"\n            value="in-app"\n            disabled\n          />\n        </Checkbox.Group>\n      </div>\n    </div>'
        ],
        colors: [
          "bg-surface",
          "bg-surface-inverse",
          "border-border",
          "ring-active",
          "ring-border",
          "ring-error",
          "text-error",
          "text-muted",
          "text-surface",
          "text-surface-inverse"
        ],
        subComponents: {
          Item: {
            name: "Item",
            description: "Item sub-component",
            props: {}
          },
          Group: {
            name: "Group",
            description: "Group sub-component",
            props: {
              legend: {
                type: "string",
                required: true
              },
              children: {
                type: "ReactNode",
                required: true
              },
              error: {
                type: "string",
                optional: true
              },
              description: {
                type: "ReactNode",
                optional: true
              },
              value: {
                type: "string[]",
                optional: true
              },
              allValues: {
                type: "string[]",
                optional: true
              },
              disabled: {
                type: "boolean",
                optional: true
              },
              controlFirst: {
                type: "boolean",
                optional: true
              },
              className: {
                type: "string",
                optional: true
              }
            }
          }
        },
        styling: {
          dimensions: "h-4 w-4",
          borderRadius: "rounded-sm",
          baseTokens: [
            "bg-surface",
            "ring-border"
          ],
          states: {
            checked: [
              "bg-surface-inverse",
              "text-surface-inverse"
            ],
            indeterminate: [
              "bg-surface-inverse",
              "text-surface-inverse"
            ],
            error: [
              "ring-error"
            ],
            hover: [
              "ring-active"
            ],
            focus: [
              "ring-active"
            ],
            disabled: [
              "opacity-50",
              "cursor-not-allowed"
            ]
          },
          icons: [
            {
              name: "ph-check",
              state: "checked",
              size: 12
            },
            {
              name: "ph-minus",
              state: "indeterminate",
              size: 12
            }
          ]
        }
      },
      ClipboardText: {
        name: "ClipboardText",
        type: "component",
        description: "ClipboardText component",
        importPath: "@cloudflare/kumo",
        category: "Action",
        props: {
          size: {
            type: "enum",
            optional: true,
            values: [
              "sm",
              "base",
              "lg"
            ],
            descriptions: {
              sm: "Small clipboard text for compact UIs",
              base: "Default clipboard text size",
              lg: "Large clipboard text for prominent display"
            },
            classes: {
              sm: "text-xs",
              base: "text-sm",
              lg: "text-sm"
            },
            default: "lg"
          },
          text: {
            type: "string",
            required: true,
            description: "The text to display and copy to clipboard"
          },
          className: {
            type: "string",
            optional: true,
            description: "Additional CSS classes"
          }
        },
        examples: [
          '<ClipboardText size="sm" text="npm install @cloudflare/kumo" />',
          '<ClipboardText size="base" text="npm install @cloudflare/kumo" />',
          '<ClipboardText size="lg" text="npm install @cloudflare/kumo" />',
          '<ClipboardText text="sk_live_abc123xyz789" />',
          '<ClipboardText text="This is a much longer text that demonstrates how the clipboard text component handles overflow with extended content" />',
          '<ClipboardText text="npx create-cloudflare@latest my-app --template kumo" size="base" />'
        ],
        colors: [
          "bg-surface",
          "border-color"
        ]
      },
      Code: {
        name: "Code",
        type: "component",
        description: "Simple code component without syntax highlighting",
        importPath: "@cloudflare/kumo",
        category: "Display",
        props: {
          lang: {
            type: "enum",
            optional: true,
            values: [
              "ts",
              "tsx",
              "jsonc",
              "bash",
              "css"
            ],
            descriptions: {
              ts: "TypeScript code",
              tsx: "TypeScript JSX code",
              jsonc: "JSON with comments",
              bash: "Shell/Bash commands",
              css: "CSS styles"
            },
            default: "ts"
          },
          code: {
            type: "string",
            required: true,
            description: "The code content to display"
          },
          values: {
            type: "Record<string, { value: string; highlight?: boolean }>",
            optional: true,
            description: "Template values for interpolation"
          },
          className: {
            type: "string",
            optional: true,
            description: "Additional CSS classes"
          }
        },
        examples: [
          `<Code lang="ts" code='const hello = "world";' />`,
          `<Code lang="tsx" code='const hello = "world";' />`,
          `<Code lang="jsonc" code='const hello = "world";' />`,
          `<Code lang="bash" code='const hello = "world";' />`,
          `<Code lang="css" code='const hello = "world";' />`,
          '<Code lang="ts" code={`\\`interface User {\n  name: string;\n  email: string;\n}\n\nconst user: User = {\n  name: "John",\n  email: "john@example.com"\n};\\``} />',
          '<Code lang="bash" code="npm install @cloudflare/kumo" />',
          '<CodeBlock\n      lang="tsx"\n      code={`<Button variant="primary">\n  Click me\n</Button>`}\n    />'
        ],
        colors: [
          "bg-surface",
          "border-color",
          "text-label"
        ]
      },
      Collapsible: {
        name: "Collapsible",
        type: "component",
        description: 'Collapsible component for showing/hiding content. Features: - Animated chevron indicator (rotates 180\xB0 when open) - Accessible with aria-expanded and aria-controls - Content panel with left border accent ```tsx const [open, setOpen] = useState(false); <Collapsible label="Show details" open={open} onOpenChange={setOpen}> <Text>Hidden content revealed when expanded.</Text> </Collapsible> ``` ```tsx const [activeIndex, setActiveIndex] = useState<number | null>(null); {items.map((item, i) => ( <Collapsible key={i} label={item.title} open={activeIndex === i} onOpenChange={(open) => setActiveIndex(open ? i : null)} > {item.content} </Collapsible> ))} ```',
        importPath: "@cloudflare/kumo",
        category: "Display",
        props: {
          children: {
            type: "ReactNode",
            optional: true
          },
          label: {
            type: "string",
            required: true,
            description: "Text label displayed in the trigger button"
          },
          open: {
            type: "boolean",
            optional: true,
            description: "Whether the collapsible content is visible"
          },
          className: {
            type: "string",
            optional: true,
            description: "Additional CSS classes for the content panel"
          },
          onOpenChange: {
            type: "(open: boolean) => void",
            description: "Callback when collapsed state changes"
          }
        },
        examples: [
          '<Collapsible label="Click to expand" open={open} onOpenChange={setOpen}>\n        <Text>\n          This is the collapsible content that can be shown or hidden.\n        </Text>\n      </Collapsible>'
        ],
        colors: [
          "border-color",
          "text-info"
        ]
      },
      Combobox: {
        name: "Combobox",
        type: "component",
        description: "Combobox component",
        importPath: "@cloudflare/kumo",
        category: "Input",
        props: {
          inputSide: {
            type: "enum",
            optional: true,
            values: [
              "right",
              "top"
            ],
            descriptions: {
              right: "Input positioned inline to the right of chips",
              top: "Input positioned above chips"
            },
            default: "right"
          },
          items: {
            type: "T[]",
            required: true,
            description: "Array of items to display in the dropdown"
          },
          value: {
            type: "T | T[]",
            optional: true,
            description: "Currently selected value(s)"
          },
          children: {
            type: "ReactNode",
            optional: true,
            description: "Combobox content (trigger, content, items)"
          },
          className: {
            type: "string",
            optional: true,
            description: "Additional CSS classes"
          },
          label: {
            type: "string",
            optional: true,
            description: "Label text for the combobox (enables Field wrapper)"
          },
          description: {
            type: "ReactNode",
            optional: true,
            description: "Helper text displayed below the combobox"
          },
          error: {
            type: "string | object",
            optional: true,
            description: "Error message or validation error object"
          },
          onValueChange: {
            type: "(value: T | T[]) => void",
            description: "Callback when selection changes"
          },
          multiple: {
            type: "boolean",
            description: "Allow multiple selections"
          },
          isItemEqualToValue: {
            type: "(item: T, value: T) => boolean",
            description: "Custom equality function for comparing items"
          }
        },
        examples: [
          '<Combobox items={items} value={value} onValueChange={setValue}>\n        <Combobox.TriggerInput placeholder="Please select database" />\n        <Combobox.Content>\n          <Combobox.Empty />\n          <Combobox.List>\n            {(item: (typeof items)[number]) => {\n              return (\n                <Combobox.Item key={item.value} value={item}>\n                  {item.label}\n                </Combobox.Item>\n              );\n            }}\n          </Combobox.List>\n        </Combobox.Content>\n      </Combobox>',
          '<div className="flex gap-2">\n        <div>\n          <Combobox\n            value={value}\n            onValueChange={setValue}\n            items={botList}\n            isItemEqualToValue={(bot: BotType, selectedValue: BotType) =>\n              bot.value === selectedValue.value\n            }\n            multiple\n          >\n            <Combobox.TriggerMultipleWithInput\n              className="w-[400px]"\n              placeholder={args.placeholder}\n              renderItem={(selected: BotType) => (\n                <Combobox.Chip key={selected.value}>\n                  {selected.label}\n                </Combobox.Chip>\n              )}\n              inputSide={args.inputSide}\n            />\n            <Combobox.Content\n              className="max-h-[200px] min-w-auto overflow-y-auto"\n              side={args.inputSide === "top" ? "top" : "bottom"}\n            >\n              <Combobox.Empty />\n              <Combobox.List>\n                {(item: BotType) => (\n                  <Combobox.Item key={item.value} value={item}>\n                    <div className="flex gap-2">\n                      <Text>{item.label}</Text>\n                      <Text variant="secondary">{item.author}</Text>\n                    </div>\n                  </Combobox.Item>\n                )}\n              </Combobox.List>\n            </Combobox.Content>\n          </Combobox>\n        </div>\n        {/* Demonstrates that the multi-select combobox maintains consistent height with other Kumo components */}\n        <Button variant="primary">Submit</Button>\n      </div>',
          '<Combobox\n        value={value}\n        onValueChange={setValue}\n        items={INITIAL_BOT_LIST}\n        isItemEqualToValue={(bot: BotType, selectedValue: BotType) =>\n          bot.value === selectedValue.value\n        }\n        multiple\n      >\n        <Combobox.TriggerMultipleWithInput\n          className="w-[400px]"\n          placeholder="Select bot"\n          value={value}\n          renderItem={(selected: BotType) => (\n            <Combobox.Chip key={selected.value}>{selected.label}</Combobox.Chip>\n          )}\n          inputSide="top"\n        />\n        <Combobox.Content className="max-h-[200px] min-w-auto overflow-y-auto">\n          <Combobox.Empty />\n          <Combobox.List>\n            {(item: BotType) => (\n              <Combobox.Item key={item.value} value={item}>\n                <div className="flex gap-2">\n                  <Text>{item.label}</Text>\n                  <Text variant="secondary">{item.author}</Text>\n                </div>\n              </Combobox.Item>\n            )}\n          </Combobox.List>\n        </Combobox.Content>\n      </Combobox>',
          '<Combobox\n        items={items}\n        value={value}\n        onValueChange={setValue}\n        label="Country"\n        description="Select your country of residence"\n      >\n        <Combobox.TriggerInput placeholder="Select country" />\n        <Combobox.Content>\n          <Combobox.Empty />\n          <Combobox.List>\n            {(item: (typeof items)[number]) => {\n              return (\n                <Combobox.Item key={item.value} value={item}>\n                  {item.label}\n                </Combobox.Item>\n              );\n            }}\n          </Combobox.List>\n        </Combobox.Content>\n      </Combobox>',
          '<Combobox\n        items={items}\n        value={value}\n        onValueChange={setValue}\n        label="Subscription Plan"\n        description="Choose a plan that fits your needs"\n        error={{ message: "Please select a plan to continue", match: true }}\n      >\n        <Combobox.TriggerInput placeholder="Select plan" />\n        <Combobox.Content>\n          <Combobox.Empty />\n          <Combobox.List>\n            {(item: (typeof items)[number]) => {\n              return (\n                <Combobox.Item key={item.value} value={item}>\n                  {item.label}\n                </Combobox.Item>\n              );\n            }}\n          </Combobox.List>\n        </Combobox.Content>\n      </Combobox>',
          '<Combobox\n        value={value}\n        onValueChange={setValue}\n        items={botList}\n        isItemEqualToValue={(bot, selectedValue) =>\n          bot.value === selectedValue.value\n        }\n        multiple\n        label="Bot Management"\n        description="Select which bots are allowed to crawl your site"\n      >\n        <Combobox.TriggerMultipleWithInput\n          className="w-[400px]"\n          placeholder="Select bots"\n          renderItem={(selected: BotType) => (\n            <Combobox.Chip key={selected.value}>{selected.label}</Combobox.Chip>\n          )}\n          inputSide="right"\n        />\n        <Combobox.Content className="max-h-[200px] min-w-auto overflow-y-auto">\n          <Combobox.Empty />\n          <Combobox.List>\n            {(item: BotType) => (\n              <Combobox.Item key={item.value} value={item}>\n                <div className="flex gap-2">\n                  <Text>{item.label}</Text>\n                  <Text variant="secondary">{item.author}</Text>\n                </div>\n              </Combobox.Item>\n            )}\n          </Combobox.List>\n        </Combobox.Content>\n      </Combobox>'
        ],
        colors: [
          "bg-color-2",
          "bg-color-3",
          "bg-secondary",
          "fill-active",
          "ring-border",
          "text-surface"
        ],
        subComponents: {
          Content: {
            name: "Content",
            description: "Content sub-component",
            props: {
              className: {
                type: "string",
                optional: true
              },
              align: {
                type: 'ComboboxBase.Positioner.Props["align"]',
                optional: true
              },
              alignOffset: {
                type: 'ComboboxBase.Positioner.Props["alignOffset"]',
                optional: true
              },
              side: {
                type: 'ComboboxBase.Positioner.Props["side"]',
                optional: true
              },
              sideOffset: {
                type: 'ComboboxBase.Positioner.Props["sideOffset"]',
                optional: true
              }
            }
          },
          TriggerValue: {
            name: "TriggerValue",
            description: "TriggerValue sub-component",
            props: {}
          },
          TriggerInput: {
            name: "TriggerInput",
            description: "TriggerInput sub-component",
            props: {}
          },
          TriggerMultipleWithInput: {
            name: "TriggerMultipleWithInput",
            description: "TriggerMultipleWithInput sub-component",
            props: {}
          },
          Chip: {
            name: "Chip",
            description: "Chip sub-component",
            props: {}
          },
          Item: {
            name: "Item",
            description: "Item sub-component",
            props: {}
          },
          Input: {
            name: "Input",
            description: "Input sub-component",
            props: {}
          },
          Empty: {
            name: "Empty",
            description: "Empty sub-component",
            props: {}
          },
          GroupLabel: {
            name: "GroupLabel",
            description: "GroupLabel sub-component",
            props: {}
          },
          Group: {
            name: "Group",
            description: "Group sub-component",
            props: {}
          },
          List: {
            name: "List",
            description: "A container for combobox items. Supports render prop for custom item rendering.",
            props: {
              children: {
                type: "ReactNode | ((item: T, index: number) => ReactNode)",
                description: "Items to render, or a function that receives each item and returns a node"
              }
            },
            isPassThrough: true,
            baseComponent: "ComboboxBase.List",
            usageExamples: [
              "<Combobox.List>\n  {(item) => <Combobox.Item value={item}>{item.label}</Combobox.Item>}\n</Combobox.List>"
            ],
            renderElement: "<div>"
          },
          Collection: {
            name: "Collection",
            description: "Renders filtered list items. Use when you need more control over item rendering.",
            props: {
              children: {
                type: "(item: T, index: number) => ReactNode",
                required: true,
                description: "Function that receives each filtered item and returns a node"
              }
            },
            isPassThrough: true,
            baseComponent: "ComboboxBase.Collection",
            usageExamples: [
              "<Combobox.Collection>\n  {(item, index) => (\n    <Combobox.Item key={index} value={item}>\n      {item.label}\n    </Combobox.Item>\n  )}\n</Combobox.Collection>"
            ]
          }
        }
      },
      DateRangePicker: {
        name: "DateRangePicker",
        type: "component",
        description: "DateRangePicker component",
        importPath: "@cloudflare/kumo",
        category: "Input",
        props: {
          size: {
            type: "enum",
            optional: true,
            values: [
              "sm",
              "base",
              "lg"
            ],
            descriptions: {
              sm: "Compact calendar for tight spaces",
              base: "Default calendar size",
              lg: "Large calendar for prominent date selection"
            },
            classes: {
              sm: "p-3 gap-2",
              base: "p-4 gap-2.5",
              lg: "p-5 gap-3"
            },
            default: "base"
          },
          variant: {
            type: "enum",
            optional: true,
            values: [
              "default",
              "subtle"
            ],
            descriptions: {
              default: "Default calendar appearance",
              subtle: "Subtle calendar with minimal background"
            },
            classes: {
              default: "bg-calendar",
              subtle: "bg-surface"
            },
            default: "default"
          },
          timezone: {
            type: "string",
            optional: true,
            description: "Display timezone (display only)"
          },
          className: {
            type: "string",
            optional: true,
            description: "Additional CSS classes"
          },
          onStartDateChange: {
            type: "(date: Date | null) => void",
            description: "Callback when start date changes"
          },
          onEndDateChange: {
            type: "(date: Date | null) => void",
            description: "Callback when end date changes"
          }
        },
        examples: [
          '<DateRangePicker size="sm" onStartDateChange={() => {}} onEndDateChange={() => {}} />',
          '<DateRangePicker size="base" onStartDateChange={() => {}} onEndDateChange={() => {}} />',
          '<DateRangePicker size="lg" onStartDateChange={() => {}} onEndDateChange={() => {}} />',
          '<DateRangePicker variant="default" onStartDateChange={() => {}} onEndDateChange={() => {}} />',
          '<DateRangePicker variant="subtle" onStartDateChange={() => {}} onEndDateChange={() => {}} />',
          '<DateRangePicker timezone="UTC (GMT+0)" />'
        ],
        colors: [
          "bg-calendar",
          "bg-calendar-day-range-selected",
          "bg-calendar-day-range-selected-endpoints",
          "bg-calendar-day-range-selected-out-of-range",
          "bg-hover",
          "bg-surface",
          "text-label",
          "text-muted",
          "text-surface",
          "text-surface-inverse"
        ]
      },
      Dialog: {
        name: "Dialog",
        type: "component",
        description: "Dialog component",
        importPath: "@cloudflare/kumo",
        category: "Overlay",
        props: {
          className: {
            type: "string",
            optional: true
          },
          children: {
            type: "ReactNode",
            optional: true
          },
          size: {
            type: "enum",
            optional: true,
            values: [
              "base",
              "sm",
              "lg",
              "xl"
            ],
            descriptions: {
              base: "Default dialog width",
              sm: "Small dialog for simple confirmations",
              lg: "Large dialog for complex content",
              xl: "Extra large dialog for detailed views"
            },
            classes: {
              base: "min-w-96",
              sm: "min-w-72",
              lg: "min-w-[32rem]",
              xl: "min-w-[48rem]"
            },
            default: "base"
          }
        },
        examples: [
          '<Dialog.Root>\n      <Dialog.Trigger render={<Button>Open Dialog</Button>} />\n      <Dialog className="p-6" size={args.size}>\n        <Dialog.Title className="mb-2 text-xl font-semibold">\n          Dialog Title\n        </Dialog.Title>\n        <Dialog.Description className="mb-4 text-muted">\n          This is a dialog description with some content.\n        </Dialog.Description>\n        <Dialog.Close render={<Button>Close</Button>} />\n      </Dialog>\n    </Dialog.Root>',
          '<Dialog.Root>\n      <Dialog.Trigger render={<Button>Open Dialog</Button>} />\n      <Dialog className="p-6" size={args.size}>\n        <div className="mb-4 flex items-center justify-between">\n          <Dialog.Title className="text-xl font-semibold">\n            Dialog Title\n          </Dialog.Title>\n          <Dialog.Close\n            render={\n              <button className="text-muted transition-colors hover:text-surface">\n                <Icon glyph="ph-x" size="sm" />\n              </button>\n            }\n          />\n        </div>\n        <Dialog.Description className="mb-4 text-muted">\n          This is a dialog description with some content explaining the purpose\n          of this dialog.\n        </Dialog.Description>\n        <div className="flex justify-end gap-3">\n          <Dialog.Close render={<Button variant="secondary">Cancel</Button>} />\n          <Button variant="primary">Confirm</Button>\n        </div>\n      </Dialog>\n    </Dialog.Root>',
          '<Dialog.Root>\n      <Dialog.Trigger render={<Button variant="destructive">Delete</Button>} />\n      <Dialog className="p-6" size="sm">\n        <div className="mb-4 flex items-center justify-between">\n          <Dialog.Title className="text-lg font-semibold">\n            Delete Item\n          </Dialog.Title>\n          <Dialog.Close\n            render={\n              <button className="text-muted transition-colors hover:text-surface">\n                <Icon glyph="ph-x" size="sm" />\n              </button>\n            }\n          />\n        </div>\n        <Dialog.Description className="mb-4 text-muted">\n          Are you sure you want to delete this item? This action cannot be\n          undone.\n        </Dialog.Description>\n        <div className="flex justify-end gap-3">\n          <Dialog.Close render={<Button variant="secondary">Cancel</Button>} />\n          <Button variant="destructive">Delete</Button>\n        </div>\n      </Dialog>\n    </Dialog.Root>',
          '<div className="flex flex-wrap gap-4">\n      <Dialog.Root>\n        <Dialog.Trigger render={<Button>Small (sm)</Button>} />\n        <Dialog className="p-6" size="sm">\n          <div className="mb-4 flex items-center justify-between">\n            <Dialog.Title className="text-lg font-semibold">\n              Small Dialog\n            </Dialog.Title>\n            <Dialog.Close\n              render={\n                <button className="text-muted transition-colors hover:text-surface">\n                  <Icon glyph="ph-x" size="sm" />\n                </button>\n              }\n            />\n          </div>\n          <Dialog.Description className="mb-4 text-muted">\n            This is a small dialog for simple confirmations.\n          </Dialog.Description>\n          <div className="flex justify-end gap-2">\n            <Dialog.Close\n              render={<Button variant="secondary">Cancel</Button>}\n            />\n            <Button variant="primary">Confirm</Button>\n          </div>\n        </Dialog>\n      </Dialog.Root>\n\n      <Dialog.Root>\n        <Dialog.Trigger render={<Button>Base (default)</Button>} />\n        <Dialog className="p-6" size="base">\n          <div className="mb-4 flex items-center justify-between">\n            <Dialog.Title className="text-xl font-semibold">\n              Base Dialog\n            </Dialog.Title>\n            <Dialog.Close\n              render={\n                <button className="text-muted transition-colors hover:text-surface">\n                  <Icon glyph="ph-x" size="sm" />\n                </button>\n              }\n            />\n          </div>\n          <Dialog.Description className="mb-4 text-muted">\n            This is the default dialog size for most use cases.\n          </Dialog.Description>\n          <div className="flex justify-end gap-3">\n            <Dialog.Close\n              render={<Button variant="secondary">Cancel</Button>}\n            />\n            <Button variant="primary">Confirm</Button>\n          </div>\n        </Dialog>\n      </Dialog.Root>\n\n      <Dialog.Root>\n        <Dialog.Trigger render={<Button>Large (lg)</Button>} />\n        <Dialog className="p-6" size="lg">\n          <div className="mb-4 flex items-center justify-between">\n            <Dialog.Title className="text-xl font-semibold">\n              Large Dialog\n            </Dialog.Title>\n            <Dialog.Close\n              render={\n                <button className="text-muted transition-colors hover:text-surface">\n                  <Icon glyph="ph-x" size="sm" />\n                </button>\n              }\n            />\n          </div>\n          <Dialog.Description className="mb-4 text-muted">\n            This is a large dialog for complex content that needs more space.\n          </Dialog.Description>\n          <div className="flex justify-end gap-3">\n            <Dialog.Close\n              render={<Button variant="secondary">Cancel</Button>}\n            />\n            <Button variant="primary">Confirm</Button>\n          </div>\n        </Dialog>\n      </Dialog.Root>\n\n      <Dialog.Root>\n        <Dialog.Trigger render={<Button>Extra Large (xl)</Button>} />\n        <Dialog className="p-6" size="xl">\n          <div className="mb-4 flex items-center justify-between">\n            <Dialog.Title className="text-xl font-semibold">\n              Extra Large Dialog\n            </Dialog.Title>\n            <Dialog.Close\n              render={\n                <button className="text-muted transition-colors hover:text-surface">\n                  <Icon glyph="ph-x" size="sm" />\n                </button>\n              }\n            />\n          </div>\n          <Dialog.Description className="mb-4 text-muted">\n            This is an extra large dialog for detailed views and complex forms.\n          </Dialog.Description>\n          <div className="flex justify-end gap-3">\n            <Dialog.Close\n              render={<Button variant="secondary">Cancel</Button>}\n            />\n            <Button variant="primary">Confirm</Button>\n          </div>\n        </Dialog>\n      </Dialog.Root>\n    </div>',
          '<Dialog.Root>\n      <Dialog.Trigger render={<Button>Edit Profile</Button>} />\n      <Dialog className="p-6" size="base">\n        <div className="mb-4 flex items-center justify-between">\n          <Dialog.Title className="text-xl font-semibold">\n            Edit Profile\n          </Dialog.Title>\n          <Dialog.Close\n            render={\n              <button className="text-muted transition-colors hover:text-surface">\n                <Icon glyph="ph-x" size="sm" />\n              </button>\n            }\n          />\n        </div>\n        <Dialog.Description className="mb-4 text-muted">\n          Update your profile information below.\n        </Dialog.Description>\n        <form className="space-y-4">\n          <div>\n            <label htmlFor="name" className="mb-1 block text-sm font-medium">\n              Name\n            </label>\n            <input\n              id="name"\n              type="text"\n              className="w-full rounded-lg bg-secondary px-3 py-2 ring ring-border focus:ring-active"\n              placeholder="Enter your name"\n            />\n          </div>\n          <div>\n            <label htmlFor="email" className="mb-1 block text-sm font-medium">\n              Email\n            </label>\n            <input\n              id="email"\n              type="email"\n              className="w-full rounded-lg bg-secondary px-3 py-2 ring ring-border focus:ring-active"\n              placeholder="Enter your email"\n            />\n          </div>\n          <div className="flex justify-end gap-3 pt-2">\n            <Dialog.Close\n              render={<Button variant="secondary">Cancel</Button>}\n            />\n            <Button variant="primary">Save Changes</Button>\n          </div>\n        </form>\n      </Dialog>\n    </Dialog.Root>'
        ],
        colors: [
          "bg-color-3",
          "bg-surface",
          "text-surface"
        ],
        subComponents: {
          Root: {
            name: "Root",
            description: "Controls the open state of the dialog. Doesn't render its own HTML element.",
            props: {
              open: {
                type: "boolean",
                description: "Whether the dialog is currently open (controlled mode)"
              },
              defaultOpen: {
                type: "boolean",
                description: "Whether the dialog is initially open (uncontrolled mode)",
                default: "false"
              },
              onOpenChange: {
                type: "(open: boolean, event: Event) => void",
                description: "Callback fired when the dialog opens or closes"
              },
              modal: {
                type: "boolean | 'trap-focus'",
                description: "Whether the dialog is modal. When true, focus is trapped and page scroll is locked",
                default: "true"
              },
              dismissible: {
                type: "boolean",
                description: "Whether clicking outside closes the dialog",
                default: "true"
              }
            },
            isPassThrough: true,
            baseComponent: "DialogBase.Root",
            usageExamples: [
              "<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>",
              "<Dialog.Root defaultOpen={false}>"
            ]
          },
          Trigger: {
            name: "Trigger",
            description: "A button that opens the dialog when clicked.",
            props: {
              render: {
                type: "ReactElement | ((props, state) => ReactElement)",
                description: "Custom element to render instead of the default button"
              },
              disabled: {
                type: "boolean",
                description: "Whether the trigger is disabled"
              }
            },
            isPassThrough: true,
            baseComponent: "DialogBase.Trigger",
            usageExamples: [
              "<Dialog.Trigger render={<Button>Open</Button>} />",
              "<Dialog.Trigger>Open Dialog</Dialog.Trigger>"
            ],
            renderElement: "<button>"
          },
          Title: {
            name: "Title",
            description: "A heading that labels the dialog for accessibility.",
            props: {
              render: {
                type: "ReactElement | ((props, state) => ReactElement)",
                description: "Custom element to render instead of the default h2"
              }
            },
            isPassThrough: true,
            baseComponent: "DialogBase.Title",
            usageExamples: [
              "<Dialog.Title>Confirm Action</Dialog.Title>",
              "<Dialog.Title render={<h3 />}>Custom Heading</Dialog.Title>"
            ],
            renderElement: "<h2>"
          },
          Description: {
            name: "Description",
            description: "A paragraph providing additional context about the dialog.",
            props: {
              render: {
                type: "ReactElement | ((props, state) => ReactElement)",
                description: "Custom element to render instead of the default p"
              }
            },
            isPassThrough: true,
            baseComponent: "DialogBase.Description",
            usageExamples: [
              "<Dialog.Description>Are you sure you want to proceed?</Dialog.Description>"
            ],
            renderElement: "<p>"
          },
          Close: {
            name: "Close",
            description: "A button that closes the dialog when clicked.",
            props: {
              render: {
                type: "ReactElement | ((props, state) => ReactElement)",
                description: "Custom element to render instead of the default button"
              },
              disabled: {
                type: "boolean",
                description: "Whether the close button is disabled"
              }
            },
            isPassThrough: true,
            baseComponent: "DialogBase.Close",
            usageExamples: [
              "<Dialog.Close render={<Button>Cancel</Button>} />",
              "<Dialog.Close>\xD7</Dialog.Close>"
            ],
            renderElement: "<button>"
          }
        }
      },
      DropdownMenu: {
        name: "DropdownMenu",
        type: "component",
        description: "DropdownMenu component",
        importPath: "@cloudflare/kumo",
        category: "Overlay",
        props: {
          variant: {
            type: "enum",
            optional: true,
            values: [
              "default",
              "danger"
            ],
            descriptions: {
              default: "Default dropdown item appearance",
              danger: "Destructive action item"
            },
            classes: {
              danger: "text-error data-highlighted:bg-error-selection data-highlighted:text-error"
            },
            default: "default"
          }
        },
        examples: [],
        colors: [
          "bg-accent",
          "bg-color-3",
          "bg-error-selection",
          "bg-muted",
          "bg-secondary",
          "ring-border",
          "text-error",
          "text-surface"
        ],
        subComponents: {
          Trigger: {
            name: "Trigger",
            description: "Trigger sub-component",
            props: {}
          },
          Portal: {
            name: "Portal",
            description: "Portal sub-component (wraps DropdownMenuPrimitive)",
            props: {},
            isPassThrough: true,
            baseComponent: "DropdownMenuPrimitive.Portal"
          },
          Sub: {
            name: "Sub",
            description: "Sub sub-component (wraps DropdownMenuPrimitive)",
            props: {},
            isPassThrough: true,
            baseComponent: "DropdownMenuPrimitive.SubmenuRoot"
          },
          SubTrigger: {
            name: "SubTrigger",
            description: "SubTrigger sub-component",
            props: {}
          },
          SubContent: {
            name: "SubContent",
            description: "SubContent sub-component",
            props: {}
          },
          Content: {
            name: "Content",
            description: "Content sub-component",
            props: {}
          },
          Item: {
            name: "Item",
            description: "Item sub-component",
            props: {}
          },
          CheckboxItem: {
            name: "CheckboxItem",
            description: "CheckboxItem sub-component",
            props: {}
          },
          Label: {
            name: "Label",
            description: "Label sub-component",
            props: {}
          },
          Separator: {
            name: "Separator",
            description: "Separator sub-component",
            props: {}
          },
          Shortcut: {
            name: "Shortcut",
            description: "Shortcut sub-component",
            props: {}
          },
          Group: {
            name: "Group",
            description: "Group sub-component (wraps DropdownMenuPrimitive)",
            props: {},
            isPassThrough: true,
            baseComponent: "DropdownMenuPrimitive.Group"
          }
        }
      },
      Empty: {
        name: "Empty",
        type: "block",
        description: "Empty component",
        importPath: "@cloudflare/kumo",
        category: "Block",
        props: {
          size: {
            type: "enum",
            optional: true,
            values: [
              "sm",
              "base",
              "lg"
            ],
            descriptions: {
              sm: "Compact empty state for smaller containers",
              base: "Default empty state size",
              lg: "Large empty state for prominent placement"
            },
            classes: {
              sm: "px-6 py-8 gap-4",
              base: "px-10 py-16 gap-6",
              lg: "px-12 py-20 gap-8"
            },
            default: "base"
          },
          icon: {
            type: "ReactNode",
            optional: true
          },
          title: {
            type: "string",
            required: true
          },
          description: {
            type: "string",
            optional: true
          },
          commandLine: {
            type: "string",
            optional: true
          },
          contents: {
            type: "ReactNode",
            optional: true
          },
          className: {
            type: "string",
            optional: true
          }
        },
        examples: [
          '<Empty icon={<DatabaseIcon size={48} className="text-disabled" />} title="No data available" description="There is no data to display at the moment. Try creating a new item to get started." />',
          '<Empty size="sm" icon={<DatabaseIcon size={48} className="text-disabled" />} title="No data available" description="There is no data to display at the moment." />',
          '<Empty size="base" icon={<DatabaseIcon size={48} className="text-disabled" />} title="No data available" description="There is no data to display at the moment." />',
          '<Empty size="lg" icon={<DatabaseIcon size={48} className="text-disabled" />} title="No data available" description="There is no data to display at the moment." />',
          '<Empty icon={<FolderOpenIcon size={48} className="text-disabled" />} title="No projects found" description="Get started by creating your first project using the command below." commandLine="npm create kumo-project" />',
          '<Empty icon={<FolderOpenIcon size={48} className="text-disabled" />} title="Long command example" description="Demonstrates how long commands scroll horizontally inside the command line area." commandLine="npx create-app --template edge-worker --name my-very-long-project-name-with-extra-flags --region us-west-2" />',
          '<Empty icon={<CloudSlashIcon size={48} className="text-disabled" />} title="No connection" description="Unable to connect to the server. Please check your connection and try again." contents={<div className="flex gap-2">\n        <Button variant="primary">Retry</Button>\n        <Button variant="outline">Go Back</Button>\n      </div>} />',
          '<Empty title="Nothing here" />'
        ],
        colors: [
          "bg-secondary",
          "bg-surface-secondary",
          "border-border-2",
          "border-color",
          "border-hover-border",
          "text-brand",
          "text-disabled",
          "text-green",
          "text-label",
          "text-surface"
        ]
      },
      Field: {
        name: "Field",
        type: "component",
        description: "Field component",
        importPath: "@cloudflare/kumo",
        category: "Input",
        props: {
          controlFirst: {
            type: "boolean",
            optional: true,
            description: "When true, places the control (checkbox/switch) before the label visually. When false (default), places the label before the control. Used to support different layout patterns (e.g., iOS-style toggles on the right)."
          },
          children: {
            type: "ReactNode",
            optional: true
          },
          label: {
            type: "string",
            required: true
          },
          error: {
            type: "object",
            optional: true
          },
          description: {
            type: "ReactNode",
            optional: true
          }
        },
        examples: [],
        colors: [
          "text-error",
          "text-muted",
          "text-surface"
        ]
      },
      Icon: {
        name: "Icon",
        type: "component",
        description: 'Icon component variants configuration / export const KUMO_ICON_VARIANTS = { size: { xs: { classes: "size-3", description: "12px - small UI elements", }, sm: { classes: "size-4", description: "16px - standard inline icons", }, base: { classes: "size-5", description: "20px - default size", }, lg: { classes: "size-6", description: "24px - prominent icons", }, xl: { classes: "size-8", description: "32px - hero sections", }, }, } as const; /** Default variant values for Icon component / export const KUMO_ICON_DEFAULT_VARIANTS = { size: "base", } as const; /** Generate className string for icon variants / export function iconVariants({ size = KUMO_ICON_DEFAULT_VARIANTS.size, }: KumoIconVariantsProps = {}) { return cn( // Base styles - no default color, inherits currentColor from parent // This matches Phosphor icon behavior "inline-block shrink-0 fill-current", // Apply size variant KUMO_ICON_VARIANTS.size[size].classes, ); } /** Icon component using SVG sprite with <use> pattern Color is inherited from parent\'s text color (currentColor), matching Phosphor icon behavior. Override with text-* classes when needed. ```tsx // Basic usage - inherits color from parent <Icon glyph="ph-check" /> // With explicit color and size <Icon glyph="ph-arrow-right" className="text-brand" size="lg" /> // Accessible icon with title <Icon glyph="cf-cloudflare-workers-outline" title="Cloudflare Workers" /> // Error state <Icon glyph="ph-warning" className="text-error" /> // Success state <Icon glyph="ph-check" className="text-green" /> ```',
        importPath: "@cloudflare/kumo",
        category: "Other",
        props: {
          glyph: {
            type: "IconGlyph",
            required: true,
            description: 'Icon glyph identifier (e.g., "ph-check", "cf-workers")'
          },
          title: {
            type: "string",
            optional: true,
            description: "Accessible title for the icon (makes it non-decorative)"
          },
          size: {
            type: "enum",
            optional: true,
            values: [
              "xs",
              "sm",
              "base",
              "lg",
              "xl"
            ],
            descriptions: {
              xs: "12px - small UI elements",
              sm: "16px - standard inline icons",
              base: "20px - default size",
              lg: "24px - prominent icons",
              xl: "32px - hero sections"
            },
            classes: {
              xs: "size-3",
              sm: "size-4",
              base: "size-5",
              lg: "size-6",
              xl: "size-8"
            },
            default: "base"
          },
          children: {
            type: "ReactNode",
            optional: true
          },
          onChange: {
            type: "React.FormEventHandler<SVGSVGElement>",
            optional: true
          },
          onSubmit: {
            type: "React.FormEventHandler<SVGSVGElement>",
            optional: true
          },
          onClick: {
            type: "React.MouseEventHandler<SVGSVGElement>",
            optional: true
          },
          className: {
            type: "string",
            optional: true
          },
          id: {
            type: "string",
            optional: true
          },
          lang: {
            type: "string",
            optional: true
          },
          name: {
            type: "string",
            optional: true
          },
          type: {
            type: "string",
            optional: true
          },
          crossOrigin: {
            type: "enum",
            optional: true,
            values: [
              "anonymous",
              "use-credentials",
              ""
            ]
          },
          accentHeight: {
            type: "number | string",
            optional: true
          },
          accumulate: {
            type: "enum",
            optional: true,
            values: [
              "none",
              "sum"
            ]
          },
          additive: {
            type: "enum",
            optional: true,
            values: [
              "replace",
              "sum"
            ]
          },
          alignmentBaseline: {
            type: "enum",
            optional: true,
            values: [
              "auto",
              "baseline",
              "before-edge",
              "text-before-edge",
              "middle",
              "central",
              "after-edge",
              "text-after-edge",
              "ideographic",
              "alphabetic",
              "hanging",
              "mathematical",
              "inherit"
            ]
          },
          allowReorder: {
            type: "enum",
            optional: true,
            values: [
              "no",
              "yes"
            ]
          },
          alphabetic: {
            type: "number | string",
            optional: true
          },
          amplitude: {
            type: "number | string",
            optional: true
          },
          arabicForm: {
            type: "enum",
            optional: true,
            values: [
              "initial",
              "medial",
              "terminal",
              "isolated"
            ]
          },
          ascent: {
            type: "number | string",
            optional: true
          },
          attributeName: {
            type: "string",
            optional: true
          },
          attributeType: {
            type: "string",
            optional: true
          },
          autoReverse: {
            type: "Booleanish",
            optional: true
          },
          azimuth: {
            type: "number | string",
            optional: true
          },
          baseFrequency: {
            type: "number | string",
            optional: true
          },
          baselineShift: {
            type: "number | string",
            optional: true
          },
          baseProfile: {
            type: "number | string",
            optional: true
          },
          bbox: {
            type: "number | string",
            optional: true
          },
          begin: {
            type: "number | string",
            optional: true
          },
          bias: {
            type: "number | string",
            optional: true
          },
          by: {
            type: "number | string",
            optional: true
          },
          calcMode: {
            type: "number | string",
            optional: true
          },
          capHeight: {
            type: "number | string",
            optional: true
          },
          clip: {
            type: "number | string",
            optional: true
          },
          clipPath: {
            type: "string",
            optional: true
          },
          clipPathUnits: {
            type: "number | string",
            optional: true
          },
          clipRule: {
            type: "number | string",
            optional: true
          },
          colorInterpolation: {
            type: "number | string",
            optional: true
          },
          colorInterpolationFilters: {
            type: "enum",
            optional: true,
            values: [
              "auto",
              "sRGB",
              "linearRGB",
              "inherit"
            ]
          },
          colorProfile: {
            type: "number | string",
            optional: true
          },
          colorRendering: {
            type: "number | string",
            optional: true
          },
          contentScriptType: {
            type: "number | string",
            optional: true
          },
          contentStyleType: {
            type: "number | string",
            optional: true
          },
          cursor: {
            type: "number | string",
            optional: true
          },
          cx: {
            type: "number | string",
            optional: true
          },
          cy: {
            type: "number | string",
            optional: true
          },
          d: {
            type: "string",
            optional: true
          },
          decelerate: {
            type: "number | string",
            optional: true
          },
          descent: {
            type: "number | string",
            optional: true
          },
          diffuseConstant: {
            type: "number | string",
            optional: true
          },
          direction: {
            type: "number | string",
            optional: true
          },
          display: {
            type: "number | string",
            optional: true
          },
          divisor: {
            type: "number | string",
            optional: true
          },
          dominantBaseline: {
            type: "enum",
            optional: true,
            values: [
              "auto",
              "use-script",
              "no-change",
              "reset-size",
              "ideographic",
              "alphabetic",
              "hanging",
              "mathematical",
              "central",
              "middle",
              "text-after-edge",
              "text-before-edge",
              "inherit"
            ]
          },
          dur: {
            type: "number | string",
            optional: true
          },
          dx: {
            type: "number | string",
            optional: true
          },
          dy: {
            type: "number | string",
            optional: true
          },
          edgeMode: {
            type: "number | string",
            optional: true
          },
          elevation: {
            type: "number | string",
            optional: true
          },
          enableBackground: {
            type: "number | string",
            optional: true
          },
          end: {
            type: "number | string",
            optional: true
          },
          exponent: {
            type: "number | string",
            optional: true
          },
          externalResourcesRequired: {
            type: "Booleanish",
            optional: true
          },
          fill: {
            type: "string",
            optional: true
          },
          fillOpacity: {
            type: "number | string",
            optional: true
          },
          fillRule: {
            type: "enum",
            optional: true,
            values: [
              "nonzero",
              "evenodd",
              "inherit"
            ]
          },
          filter: {
            type: "string",
            optional: true
          },
          filterRes: {
            type: "number | string",
            optional: true
          },
          filterUnits: {
            type: "number | string",
            optional: true
          },
          floodColor: {
            type: "number | string",
            optional: true
          },
          floodOpacity: {
            type: "number | string",
            optional: true
          },
          focusable: {
            type: "Booleanish | string",
            optional: true
          },
          fontFamily: {
            type: "string",
            optional: true
          },
          fontSize: {
            type: "number | string",
            optional: true
          },
          fontSizeAdjust: {
            type: "number | string",
            optional: true
          },
          fontStretch: {
            type: "number | string",
            optional: true
          },
          fontStyle: {
            type: "number | string",
            optional: true
          },
          fontVariant: {
            type: "number | string",
            optional: true
          },
          fontWeight: {
            type: "number | string",
            optional: true
          },
          format: {
            type: "number | string",
            optional: true
          },
          fr: {
            type: "number | string",
            optional: true
          },
          from: {
            type: "number | string",
            optional: true
          },
          fx: {
            type: "number | string",
            optional: true
          },
          fy: {
            type: "number | string",
            optional: true
          },
          g1: {
            type: "number | string",
            optional: true
          },
          g2: {
            type: "number | string",
            optional: true
          },
          glyphName: {
            type: "number | string",
            optional: true
          },
          glyphOrientationHorizontal: {
            type: "number | string",
            optional: true
          },
          glyphOrientationVertical: {
            type: "number | string",
            optional: true
          },
          glyphRef: {
            type: "number | string",
            optional: true
          },
          gradientTransform: {
            type: "string",
            optional: true
          },
          gradientUnits: {
            type: "string",
            optional: true
          },
          hanging: {
            type: "number | string",
            optional: true
          },
          horizAdvX: {
            type: "number | string",
            optional: true
          },
          horizOriginX: {
            type: "number | string",
            optional: true
          },
          href: {
            type: "string",
            optional: true
          },
          ideographic: {
            type: "number | string",
            optional: true
          },
          imageRendering: {
            type: "number | string",
            optional: true
          },
          in2: {
            type: "number | string",
            optional: true
          },
          in: {
            type: "string",
            optional: true
          },
          intercept: {
            type: "number | string",
            optional: true
          },
          k1: {
            type: "number | string",
            optional: true
          },
          k2: {
            type: "number | string",
            optional: true
          },
          k3: {
            type: "number | string",
            optional: true
          },
          k4: {
            type: "number | string",
            optional: true
          },
          k: {
            type: "number | string",
            optional: true
          },
          kernelMatrix: {
            type: "number | string",
            optional: true
          },
          kernelUnitLength: {
            type: "number | string",
            optional: true
          },
          kerning: {
            type: "number | string",
            optional: true
          },
          keyPoints: {
            type: "number | string",
            optional: true
          },
          keySplines: {
            type: "number | string",
            optional: true
          },
          keyTimes: {
            type: "number | string",
            optional: true
          },
          lengthAdjust: {
            type: "number | string",
            optional: true
          },
          letterSpacing: {
            type: "number | string",
            optional: true
          },
          lightingColor: {
            type: "number | string",
            optional: true
          },
          limitingConeAngle: {
            type: "number | string",
            optional: true
          },
          local: {
            type: "number | string",
            optional: true
          },
          markerEnd: {
            type: "string",
            optional: true
          },
          markerHeight: {
            type: "number | string",
            optional: true
          },
          markerMid: {
            type: "string",
            optional: true
          },
          markerStart: {
            type: "string",
            optional: true
          },
          markerUnits: {
            type: "number | string",
            optional: true
          },
          markerWidth: {
            type: "number | string",
            optional: true
          },
          mask: {
            type: "string",
            optional: true
          },
          maskContentUnits: {
            type: "number | string",
            optional: true
          },
          maskUnits: {
            type: "number | string",
            optional: true
          },
          mathematical: {
            type: "number | string",
            optional: true
          },
          mode: {
            type: "number | string",
            optional: true
          },
          numOctaves: {
            type: "number | string",
            optional: true
          },
          offset: {
            type: "number | string",
            optional: true
          },
          opacity: {
            type: "number | string",
            optional: true
          },
          operator: {
            type: "number | string",
            optional: true
          },
          order: {
            type: "number | string",
            optional: true
          },
          orient: {
            type: "number | string",
            optional: true
          },
          orientation: {
            type: "number | string",
            optional: true
          },
          origin: {
            type: "number | string",
            optional: true
          },
          overflow: {
            type: "number | string",
            optional: true
          },
          overlinePosition: {
            type: "number | string",
            optional: true
          },
          overlineThickness: {
            type: "number | string",
            optional: true
          },
          paintOrder: {
            type: "number | string",
            optional: true
          },
          panose1: {
            type: "number | string",
            optional: true
          },
          path: {
            type: "string",
            optional: true
          },
          pathLength: {
            type: "number | string",
            optional: true
          },
          patternContentUnits: {
            type: "string",
            optional: true
          },
          patternTransform: {
            type: "number | string",
            optional: true
          },
          patternUnits: {
            type: "string",
            optional: true
          },
          pointerEvents: {
            type: "number | string",
            optional: true
          },
          points: {
            type: "string",
            optional: true
          },
          pointsAtX: {
            type: "number | string",
            optional: true
          },
          pointsAtY: {
            type: "number | string",
            optional: true
          },
          pointsAtZ: {
            type: "number | string",
            optional: true
          },
          preserveAlpha: {
            type: "Booleanish",
            optional: true
          },
          preserveAspectRatio: {
            type: "string",
            optional: true
          },
          primitiveUnits: {
            type: "number | string",
            optional: true
          },
          r: {
            type: "number | string",
            optional: true
          },
          radius: {
            type: "number | string",
            optional: true
          },
          refX: {
            type: "number | string",
            optional: true
          },
          refY: {
            type: "number | string",
            optional: true
          },
          renderingIntent: {
            type: "number | string",
            optional: true
          },
          repeatCount: {
            type: "number | string",
            optional: true
          },
          repeatDur: {
            type: "number | string",
            optional: true
          },
          requiredExtensions: {
            type: "number | string",
            optional: true
          },
          requiredFeatures: {
            type: "number | string",
            optional: true
          },
          restart: {
            type: "number | string",
            optional: true
          },
          result: {
            type: "string",
            optional: true
          },
          rotate: {
            type: "number | string",
            optional: true
          },
          rx: {
            type: "number | string",
            optional: true
          },
          ry: {
            type: "number | string",
            optional: true
          },
          scale: {
            type: "number | string",
            optional: true
          },
          seed: {
            type: "number | string",
            optional: true
          },
          shapeRendering: {
            type: "number | string",
            optional: true
          },
          slope: {
            type: "number | string",
            optional: true
          },
          spacing: {
            type: "number | string",
            optional: true
          },
          specularConstant: {
            type: "number | string",
            optional: true
          },
          specularExponent: {
            type: "number | string",
            optional: true
          },
          speed: {
            type: "number | string",
            optional: true
          },
          spreadMethod: {
            type: "string",
            optional: true
          },
          startOffset: {
            type: "number | string",
            optional: true
          },
          stdDeviation: {
            type: "number | string",
            optional: true
          },
          stemh: {
            type: "number | string",
            optional: true
          },
          stemv: {
            type: "number | string",
            optional: true
          },
          stitchTiles: {
            type: "number | string",
            optional: true
          },
          stopColor: {
            type: "string",
            optional: true
          },
          stopOpacity: {
            type: "number | string",
            optional: true
          },
          strikethroughPosition: {
            type: "number | string",
            optional: true
          },
          strikethroughThickness: {
            type: "number | string",
            optional: true
          },
          string: {
            type: "number | string",
            optional: true
          },
          stroke: {
            type: "string",
            optional: true
          },
          strokeDasharray: {
            type: "string | number",
            optional: true
          },
          strokeDashoffset: {
            type: "string | number",
            optional: true
          },
          strokeLinecap: {
            type: "enum",
            optional: true,
            values: [
              "butt",
              "round",
              "square",
              "inherit"
            ]
          },
          strokeLinejoin: {
            type: "enum",
            optional: true,
            values: [
              "miter",
              "round",
              "bevel",
              "inherit"
            ]
          },
          strokeMiterlimit: {
            type: "number | string",
            optional: true
          },
          strokeOpacity: {
            type: "number | string",
            optional: true
          },
          strokeWidth: {
            type: "number | string",
            optional: true
          },
          surfaceScale: {
            type: "number | string",
            optional: true
          },
          systemLanguage: {
            type: "number | string",
            optional: true
          },
          tableValues: {
            type: "number | string",
            optional: true
          },
          targetX: {
            type: "number | string",
            optional: true
          },
          targetY: {
            type: "number | string",
            optional: true
          },
          textAnchor: {
            type: "enum",
            optional: true,
            values: [
              "start",
              "middle",
              "end",
              "inherit"
            ]
          },
          textDecoration: {
            type: "number | string",
            optional: true
          },
          textLength: {
            type: "number | string",
            optional: true
          },
          textRendering: {
            type: "number | string",
            optional: true
          },
          to: {
            type: "number | string",
            optional: true
          },
          transform: {
            type: "string",
            optional: true
          },
          u1: {
            type: "number | string",
            optional: true
          },
          u2: {
            type: "number | string",
            optional: true
          },
          underlinePosition: {
            type: "number | string",
            optional: true
          },
          underlineThickness: {
            type: "number | string",
            optional: true
          },
          unicode: {
            type: "number | string",
            optional: true
          },
          unicodeBidi: {
            type: "number | string",
            optional: true
          },
          unicodeRange: {
            type: "number | string",
            optional: true
          },
          unitsPerEm: {
            type: "number | string",
            optional: true
          },
          vAlphabetic: {
            type: "number | string",
            optional: true
          },
          values: {
            type: "string",
            optional: true
          },
          vectorEffect: {
            type: "number | string",
            optional: true
          },
          version: {
            type: "string",
            optional: true
          },
          vertAdvY: {
            type: "number | string",
            optional: true
          },
          vertOriginX: {
            type: "number | string",
            optional: true
          },
          vertOriginY: {
            type: "number | string",
            optional: true
          },
          vHanging: {
            type: "number | string",
            optional: true
          },
          vIdeographic: {
            type: "number | string",
            optional: true
          },
          viewBox: {
            type: "string",
            optional: true
          },
          viewTarget: {
            type: "number | string",
            optional: true
          },
          visibility: {
            type: "number | string",
            optional: true
          },
          vMathematical: {
            type: "number | string",
            optional: true
          },
          widths: {
            type: "number | string",
            optional: true
          },
          wordSpacing: {
            type: "number | string",
            optional: true
          },
          writingMode: {
            type: "number | string",
            optional: true
          },
          x1: {
            type: "number | string",
            optional: true
          },
          x2: {
            type: "number | string",
            optional: true
          },
          x: {
            type: "number | string",
            optional: true
          },
          xChannelSelector: {
            type: "string",
            optional: true
          },
          xHeight: {
            type: "number | string",
            optional: true
          },
          xlinkActuate: {
            type: "string",
            optional: true
          },
          xlinkArcrole: {
            type: "string",
            optional: true
          },
          xlinkHref: {
            type: "string",
            optional: true
          },
          xlinkRole: {
            type: "string",
            optional: true
          },
          xlinkShow: {
            type: "string",
            optional: true
          },
          xlinkTitle: {
            type: "string",
            optional: true
          },
          xlinkType: {
            type: "string",
            optional: true
          },
          xmlBase: {
            type: "string",
            optional: true
          },
          xmlLang: {
            type: "string",
            optional: true
          },
          xmlns: {
            type: "string",
            optional: true
          },
          xmlnsXlink: {
            type: "string",
            optional: true
          },
          xmlSpace: {
            type: "string",
            optional: true
          },
          y1: {
            type: "number | string",
            optional: true
          },
          y2: {
            type: "number | string",
            optional: true
          },
          y: {
            type: "number | string",
            optional: true
          },
          yChannelSelector: {
            type: "string",
            optional: true
          },
          z: {
            type: "number | string",
            optional: true
          },
          zoomAndPan: {
            type: "string",
            optional: true
          }
        },
        examples: [
          '<Icon size="xs" glyph="ph-check" />',
          '<Icon size="sm" glyph="ph-check" />',
          '<Icon size="base" glyph="ph-check" />',
          '<Icon size="lg" glyph="ph-check" />',
          '<Icon size="xl" glyph="ph-check" />',
          '<div className="grid grid-cols-8 gap-4">\n      {ALL_ICON_GLYPHS.map((glyph) => (\n        <div key={glyph} className="flex flex-col items-center gap-2">\n          <Icon glyph={glyph} size="lg" />\n          <span className="text-xs text-muted">{glyph}</span>\n        </div>\n      ))}\n    </div>',
          '<Icon glyph="ph-check" title={Success} />',
          '<div className="flex gap-4">\n      <Icon glyph="ph-check" className="text-green" size="lg" />\n      <Icon glyph="ph-warning" className="text-alert" size="lg" />\n      <Icon glyph="ph-x" className="text-error" size="lg" />\n      <Icon glyph="ph-info" className="text-info" size="lg" />\n      <Icon glyph="ph-check" className="text-brand" size="lg" />\n      <Icon glyph="ph-gear" className="text-label" size="lg" />\n      <Icon\n        glyph="cf-cloudflare-workers-outline"\n        className="text-green"\n        size="lg"\n      />\n      <Icon\n        glyph="cf-security-shield-protection-1-outline"\n        className="text-alert"\n        size="lg"\n      />\n      <Icon\n        glyph="cf-cloudflare-pages-outline"\n        className="text-error"\n        size="lg"\n      />\n      <Icon\n        glyph="cf-cloudflare-zero-trust-outline"\n        className="text-info"\n        size="lg"\n      />\n      <Icon glyph="cf-r2-outline" className="text-brand" size="lg" />\n      <Icon glyph="cf-d1-outline" className="text-label" size="lg" />\n    </div>'
        ],
        colors: [
          "text-brand",
          "text-error",
          "text-green"
        ]
      },
      Input: {
        name: "Input",
        type: "component",
        description: "Input component",
        importPath: "@cloudflare/kumo",
        category: "Input",
        props: {
          label: {
            type: "string",
            optional: true,
            description: "Label text for the input (enables Field wrapper)"
          },
          description: {
            type: "ReactNode",
            optional: true,
            description: "Helper text displayed below the input"
          },
          error: {
            type: "string | object",
            optional: true,
            description: "Error message or validation error object"
          },
          size: {
            type: "enum",
            optional: true,
            values: [
              "xs",
              "sm",
              "base",
              "lg"
            ],
            descriptions: {
              xs: "Extra small input for compact UIs",
              sm: "Small input for secondary fields",
              base: "Default input size",
              lg: "Large input for prominent fields"
            },
            classes: {
              xs: "h-5 gap-1 rounded-sm px-1.5 text-xs",
              sm: "h-6.5 gap-1 rounded-md px-2 text-xs",
              base: "h-9 gap-1.5 rounded-lg px-3 text-base",
              lg: "h-10 gap-2 rounded-lg px-4 text-base"
            },
            default: "base"
          },
          variant: {
            type: "enum",
            optional: true,
            values: [
              "default",
              "error"
            ],
            descriptions: {
              default: "Default input appearance",
              error: "Error state for validation failures"
            },
            classes: {
              default: "focus:ring-active",
              error: "!ring-error focus:ring-error"
            },
            stateClasses: {
              default: {
                focus: "focus:ring-active"
              },
              error: {
                focus: "focus:ring-error"
              }
            },
            default: "default"
          }
        },
        examples: [
          '<Input placeholder="Enter text..." />',
          `<Input
      label="Email"
      placeholder="Enter your email"
      description="We'll never share your email with anyone else"
    />`,
          '<Input\n      label="Email"\n      placeholder="Invalid input"\n      defaultValue="error@example.com"\n      variant="error"\n      error="Please enter a valid email address"\n    />',
          '<Input\n      label="Email"\n      placeholder="Enter your email"\n      defaultValue="not-an-email"\n      variant="error"\n      error={{\n        message: "Please enter a valid email address",\n        match: "typeMismatch",\n      }}\n    />',
          '<Input label="Disabled Field" placeholder="Disabled input" disabled />',
          'function InputGroupExamplesRender() {\n    const [username, setUsername] = React.useState("");\n    const [status, setStatus] = React.useState<\n      "idle" | "checking" | "available" | "taken" | "error"\n    >("idle");\n\n    const checkAvailability = () => {\n      if (!username) {\n        setStatus("error");\n        return;\n      }\n      setStatus("checking");\n      // Simulate API call\n      setTimeout(() => {\n        setStatus(username.length > 3 ? "available" : "taken");\n      }, 800);\n    };\n\n    const statusText = {\n      idle: "",\n      checking: "Checking...",\n      available: "\u2713 Available",\n      taken: "\u2717 Taken",\n      error: "Please enter a username",\n    };\n\n    return (\n      <div className="space-y-6">\n        {/* Prefix label - common for URLs, usernames, currencies */}\n        <div className="space-y-1">\n          <p className="text-center text-sm text-muted">Prefix label</p>\n          <InputGroup>\n            <InputGroup.Label>https://</InputGroup.Label>\n            <InputGroup.Input placeholder="example.com" />\n          </InputGroup>\n        </div>\n\n        {/* Prefix label with suffix description - common for currency inputs */}\n        <div className="space-y-1">\n          <p className="text-center text-sm text-muted">\n            Label with description\n          </p>\n          <InputGroup>\n            <InputGroup.Label>$</InputGroup.Label>\n            <InputGroup.Input placeholder="0.00" type="number" />\n            <InputGroup.Description>USD</InputGroup.Description>\n          </InputGroup>\n        </div>\n\n        {/* With action button - interactive example */}\n        <div className="space-y-1">\n          <p className="text-center text-sm text-muted">\n            With action button (4+ chars = available, fewer = taken)\n          </p>\n          <InputGroup>\n            <InputGroup.Label>@</InputGroup.Label>\n            <InputGroup.Input\n              placeholder="username"\n              value={username}\n              onChange={(e) => {\n                setUsername(e.target.value);\n                setStatus("idle");\n              }}\n              onKeyDown={(e) => {\n                if (e.key === "Enter") {\n                  checkAvailability();\n                }\n              }}\n            />\n            <InputGroup.Button onClick={checkAvailability}>\n              {status === "checking" ? "Checking..." : "Check"}\n            </InputGroup.Button>\n          </InputGroup>\n          <p\n            aria-live="polite"\n            className={`text-sm ${status === "available" ? "text-info" : status === "error" || status === "taken" ? "text-error" : "text-muted"}`}\n          >\n            {statusText[status]}\n          </p>\n        </div>\n      </div>\n    );\n  }',
          '<div className="space-y-4">\n      <div className="space-y-1">\n        <p className="text-center text-sm text-muted">Size: xs</p>\n        <InputGroup size="xs">\n          <InputGroup.Label>@</InputGroup.Label>\n          <InputGroup.Input placeholder="username" />\n          <InputGroup.Button>Submit</InputGroup.Button>\n        </InputGroup>\n      </div>\n\n      <div className="space-y-1">\n        <p className="text-center text-sm text-muted">Size: sm</p>\n        <InputGroup size="sm">\n          <InputGroup.Label>@</InputGroup.Label>\n          <InputGroup.Input placeholder="username" />\n          <InputGroup.Button>Submit</InputGroup.Button>\n        </InputGroup>\n      </div>\n\n      <div className="space-y-1">\n        <p className="text-center text-sm text-muted">Size: base (default)</p>\n        <InputGroup size="base">\n          <InputGroup.Label>@</InputGroup.Label>\n          <InputGroup.Input placeholder="username" />\n          <InputGroup.Button>Submit</InputGroup.Button>\n        </InputGroup>\n      </div>\n\n      <div className="space-y-1">\n        <p className="text-center text-sm text-muted">Size: lg</p>\n        <InputGroup size="lg">\n          <InputGroup.Label>@</InputGroup.Label>\n          <InputGroup.Input placeholder="username" />\n          <InputGroup.Button>Submit</InputGroup.Button>\n        </InputGroup>\n      </div>\n    </div>'
        ],
        colors: [
          "bg-secondary",
          "ring-active",
          "ring-border",
          "ring-error",
          "text-muted",
          "text-surface"
        ]
      },
      LayerCard: {
        name: "LayerCard",
        type: "component",
        description: "LayerCard component",
        importPath: "@cloudflare/kumo",
        category: "Display",
        props: {
          children: {
            type: "ReactNode",
            optional: true
          },
          className: {
            type: "string",
            optional: true
          }
        },
        examples: [
          '<LayerCard className="w-[250px]">\n      <LayerCard.Secondary className="flex items-center justify-between">\n        <div>Next Steps</div>\n        <Button variant="ghost" size="sm" shape="square">\n          <ArrowRightIcon size={16} />\n        </Button>\n      </LayerCard.Secondary>\n\n      <LayerCard.Primary>\n        <Text>Get started with Kumo</Text>\n      </LayerCard.Primary>\n    </LayerCard>'
        ],
        colors: [
          "bg-layer-card-primary",
          "bg-surface-2",
          "ring-border",
          "ring-color",
          "text-label"
        ],
        subComponents: {
          Primary: {
            name: "Primary",
            description: "Primary sub-component",
            props: {}
          },
          Secondary: {
            name: "Secondary",
            description: "Secondary sub-component",
            props: {}
          }
        }
      },
      Loader: {
        name: "Loader",
        type: "component",
        description: "Loader component",
        importPath: "@cloudflare/kumo",
        category: "Feedback",
        props: {
          className: {
            type: "string",
            optional: true
          },
          size: {
            type: "enum",
            optional: true,
            values: [
              "sm",
              "base",
              "lg"
            ],
            descriptions: {
              sm: "Small loader for inline use",
              base: "Default loader size",
              lg: "Large loader for prominent loading states"
            },
            default: "base"
          }
        },
        examples: [
          '<Loader size="sm" className="text-surface" />',
          '<Loader size="base" className="text-surface" />',
          '<Loader size="lg" className="text-surface" />',
          '<Loader size={48} className="text-surface" />'
        ],
        colors: []
      },
      MenuBar: {
        name: "MenuBar",
        type: "component",
        description: "MenuBar component",
        importPath: "@cloudflare/kumo",
        category: "Navigation",
        props: {
          className: {
            type: "string",
            optional: true
          },
          isActive: {
            type: "number | boolean | string",
            optional: true
          },
          options: {
            type: "MenuOptionProps[]",
            required: true
          },
          optionIds: {
            type: "boolean",
            optional: true
          }
        },
        examples: [],
        colors: [
          "bg-color",
          "bg-surface",
          "border-color"
        ]
      },
      Meter: {
        name: "Meter",
        type: "component",
        description: "Meter component",
        importPath: "@cloudflare/kumo",
        category: "Display",
        props: {
          customValue: {
            type: "string",
            optional: true
          },
          label: {
            type: "string",
            required: true
          },
          showValue: {
            type: "boolean",
            optional: true
          },
          trackClassName: {
            type: "string",
            optional: true
          },
          indicatorClassName: {
            type: "string",
            optional: true
          },
          value: {
            type: "number",
            description: "Current value of the meter"
          },
          max: {
            type: "number",
            description: "Maximum value of the meter (default: 100)"
          },
          min: {
            type: "number",
            description: "Minimum value of the meter (default: 0)"
          }
        },
        examples: [
          "<Meter label={Progress} value={50} max={100} />",
          '<div className="flex w-64 flex-col gap-4">\n      <Meter label="Low" value={25} max={100} />\n      <Meter label="Medium" value={50} max={100} />\n      <Meter label="High" value={75} max={100} />\n      <Meter label="Complete" value={100} max={100} />\n    </div>'
        ],
        colors: [
          "bg-color",
          "text-label",
          "text-surface"
        ]
      },
      PageHeader: {
        name: "PageHeader",
        type: "block",
        description: "PageHeader component",
        importPath: "@cloudflare/kumo",
        category: "Block",
        props: {
          spacing: {
            type: "enum",
            optional: true,
            values: [
              "compact",
              "base",
              "relaxed"
            ],
            descriptions: {
              compact: "Compact spacing between header elements",
              base: "Default spacing between header elements",
              relaxed: "Relaxed spacing for more prominent headers"
            },
            classes: {
              compact: "gap-1",
              base: "gap-2",
              relaxed: "gap-4"
            },
            default: "base"
          },
          breadcrumbs: {
            type: "ReactNode",
            optional: true
          },
          tabs: {
            type: "TabsItem[]",
            optional: true
          },
          defaultTab: {
            type: "string",
            optional: true
          },
          className: {
            type: "string",
            optional: true
          },
          children: {
            type: "ReactNode",
            optional: true
          }
        },
        examples: [
          '<PageHeader\n      breadcrumbs={\n        <Breadcrumbs>\n          <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>\n          <Breadcrumbs.Separator />\n          <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>\n          <Breadcrumbs.Separator />\n          <Breadcrumbs.Current>Current Project</Breadcrumbs.Current>\n        </Breadcrumbs>\n      }\n    />',
          '<PageHeader spacing="compact" breadcrumbs={<Breadcrumbs>\n              <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>\n              <Breadcrumbs.Separator />\n              <Breadcrumbs.Current>Current</Breadcrumbs.Current>\n            </Breadcrumbs>} tabs={[\n            { label: "General", value: "general" },\n            { label: "Settings", value: "settings" },\n          ]} defaultTab="general" />',
          '<PageHeader spacing="base" breadcrumbs={<Breadcrumbs>\n              <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>\n              <Breadcrumbs.Separator />\n              <Breadcrumbs.Current>Current</Breadcrumbs.Current>\n            </Breadcrumbs>} tabs={[\n            { label: "General", value: "general" },\n            { label: "Settings", value: "settings" },\n          ]} defaultTab="general" />',
          '<PageHeader spacing="relaxed" breadcrumbs={<Breadcrumbs>\n              <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>\n              <Breadcrumbs.Separator />\n              <Breadcrumbs.Current>Current</Breadcrumbs.Current>\n            </Breadcrumbs>} tabs={[\n            { label: "General", value: "general" },\n            { label: "Settings", value: "settings" },\n          ]} defaultTab="general" />',
          '<PageHeader\n      breadcrumbs={\n        <Breadcrumbs>\n          <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>\n          <Breadcrumbs.Separator />\n          <Breadcrumbs.Current>Settings</Breadcrumbs.Current>\n        </Breadcrumbs>\n      }\n      tabs={[\n        { label: "General", value: "general" },\n        { label: "Security", value: "security" },\n        { label: "Notifications", value: "notifications" },\n        { label: "Billing", value: "billing" },\n      ]}\n      defaultTab="general"\n    />',
          '<PageHeader\n      breadcrumbs={\n        <Breadcrumbs>\n          <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>\n          <Breadcrumbs.Separator />\n          <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>\n          <Breadcrumbs.Separator />\n          <Breadcrumbs.Current>My Project</Breadcrumbs.Current>\n        </Breadcrumbs>\n      }\n      tabs={[\n        { label: "Overview", value: "overview" },\n        { label: "Analytics", value: "analytics" },\n        { label: "Settings", value: "settings" },\n      ]}\n      defaultTab="overview"\n    >\n      <Button variant="outline" size="sm">\n        Export\n      </Button>\n      <Button variant="primary" size="sm">\n        <PlusIcon size={16} />\n        New Item\n      </Button>\n    </PageHeader>'
        ],
        colors: [
          "border-color-4"
        ]
      },
      Pagination: {
        name: "Pagination",
        type: "component",
        description: "Pagination component",
        importPath: "@cloudflare/kumo",
        category: "Navigation",
        props: {
          setPage: {
            type: "(page: number) => void",
            required: true,
            description: "Callback when page changes"
          },
          page: {
            type: "number",
            optional: true
          },
          perPage: {
            type: "number",
            optional: true
          },
          totalCount: {
            type: "number",
            optional: true
          }
        },
        examples: [
          '<Pagination page={1} perPage={10} totalCount={100} setPage="() => {}" />',
          '<Pagination page={5} perPage={10} totalCount={100} setPage="() => {}" />'
        ],
        colors: [
          "text-label"
        ]
      },
      Select: {
        name: "Select",
        type: "component",
        description: "Select component",
        importPath: "@cloudflare/kumo",
        category: "Input",
        props: {
          className: {
            type: "string",
            optional: true,
            description: "Additional CSS classes"
          },
          label: {
            type: "string",
            optional: true,
            description: "Label text for the select (enables Field wrapper)"
          },
          hideLabel: {
            type: "boolean",
            optional: true,
            description: "Whether to visually hide the label (still accessible to screen readers)"
          },
          placeholder: {
            type: "string",
            optional: true,
            description: "Placeholder text when no value is selected"
          },
          loading: {
            type: "boolean",
            optional: true,
            description: "Whether the select is in a loading state"
          },
          disabled: {
            type: "boolean",
            optional: true,
            description: "Whether the select is disabled"
          },
          value: {
            type: "string",
            optional: true,
            description: "The currently selected value"
          },
          children: {
            type: "ReactNode",
            optional: true,
            description: "Child elements (Select.Option components)"
          },
          description: {
            type: "ReactNode",
            optional: true,
            description: "Helper text displayed below the select"
          },
          error: {
            type: "string | object",
            optional: true,
            description: "Error message or validation error object"
          },
          onValueChange: {
            type: "(value: string) => void",
            description: "Callback when selection changes"
          },
          defaultValue: {
            type: "string",
            description: "Initial value for uncontrolled mode"
          }
        },
        examples: [
          '<Select defaultValue="1" placeholder="Select an option">\n      <Select.Option value="1">Option 1</Select.Option>\n      <Select.Option value="2">Option 2</Select.Option>\n      <Select.Option value="3">Option 3</Select.Option>\n    </Select>',
          '<Select\n      label="Country"\n      hideLabel={false}\n      placeholder="Select a country"\n      description="Choose your country of residence"\n    >\n      <Select.Option value="us">United States</Select.Option>\n      <Select.Option value="uk">United Kingdom</Select.Option>\n      <Select.Option value="ca">Canada</Select.Option>\n      <Select.Option value="au">Australia</Select.Option>\n    </Select>',
          '<Select\n      label="Account Type"\n      hideLabel={false}\n      placeholder="Select an account type"\n      error="Please select an account type to continue"\n    >\n      <Select.Option value="personal">Personal</Select.Option>\n      <Select.Option value="business">Business</Select.Option>\n      <Select.Option value="enterprise">Enterprise</Select.Option>\n    </Select>',
          '<Select label="Language" hideLabel={true} placeholder="Select language">\n      <Select.Option value="en">English</Select.Option>\n      <Select.Option value="es">Spanish</Select.Option>\n      <Select.Option value="fr">French</Select.Option>\n      <Select.Option value="de">German</Select.Option>\n    </Select>',
          '<Select\n      label="Options"\n      hideLabel={false}\n      placeholder="Loading options..."\n      loading\n    >\n      <Select.Option value="1">Option 1</Select.Option>\n      <Select.Option value="2">Option 2</Select.Option>\n    </Select>',
          '<Select\n      label="Status"\n      hideLabel={false}\n      placeholder="Select status"\n      disabled\n      defaultValue="active"\n    >\n      <Select.Option value="active">Active</Select.Option>\n      <Select.Option value="inactive">Inactive</Select.Option>\n    </Select>'
        ],
        colors: [
          "bg-color-3",
          "bg-secondary",
          "ring-active",
          "ring-border",
          "text-surface"
        ],
        subComponents: {
          Option: {
            name: "Option",
            description: "Option sub-component",
            props: {}
          }
        }
      },
      SensitiveInput: {
        name: "SensitiveInput",
        type: "component",
        description: "SensitiveInput component",
        importPath: "@cloudflare/kumo",
        category: "Other",
        props: {
          checked: {
            type: "boolean",
            optional: true
          },
          disabled: {
            type: "boolean",
            optional: true
          },
          name: {
            type: "string",
            optional: true
          },
          placeholder: {
            type: "string",
            optional: true
          },
          readOnly: {
            type: "boolean",
            optional: true
          },
          required: {
            type: "boolean",
            optional: true
          },
          onChange: {
            type: "React.ChangeEventHandler<HTMLInputElement>",
            optional: true
          },
          className: {
            type: "string",
            optional: true
          },
          id: {
            type: "string",
            optional: true
          },
          lang: {
            type: "string",
            optional: true
          },
          title: {
            type: "string",
            optional: true
          },
          children: {
            type: "ReactNode",
            optional: true
          },
          onSubmit: {
            type: "React.FormEventHandler<HTMLInputElement>",
            optional: true
          },
          onClick: {
            type: "React.MouseEventHandler<HTMLInputElement>",
            optional: true
          },
          value: {
            type: "string",
            optional: true,
            description: "Controlled value"
          },
          size: {
            type: "enum",
            optional: true,
            description: "Size variant",
            values: [
              "xs",
              "sm",
              "base",
              "lg"
            ],
            default: "base"
          },
          variant: {
            type: "enum",
            optional: true,
            description: "Style variant",
            values: [
              "default",
              "error"
            ],
            default: "default"
          },
          label: {
            type: "string",
            optional: true,
            description: "Label text for the input (enables Field wrapper and sets masked state label)"
          },
          description: {
            type: "ReactNode",
            optional: true,
            description: "Helper text displayed below the input"
          },
          error: {
            type: "string | object",
            optional: true,
            description: "Error message or validation error object"
          }
        },
        examples: [
          '<SensitiveInput label="API Key" defaultValue="sk_live_abc123xyz789" />',
          '<div className="flex flex-col gap-4">\n      {sizes.map((size) => (\n        <div key={size} className="flex items-center gap-2">\n          <span className="w-12 text-sm text-muted">{size}</span>\n          <SensitiveInput\n            label={`${size} size`}\n            size={size}\n            defaultValue="secret-api-key-123"\n          />\n        </div>\n      ))}\n    </div>',
          '<SensitiveInput label="API Key" defaultValue="sk_live_abc123xyz789" />',
          '<SensitiveInput label="Secret" placeholder="Enter your secret..." />',
          '<div className="flex flex-col gap-4">\n        <SensitiveInput\n          label="Controlled Secret"\n          value={value}\n          onValueChange={setValue}\n        />\n        <div className="text-sm text-muted">\n          Current value: <code className="text-surface">{value}</code>\n        </div>\n        <div className="flex gap-2">\n          <button\n            onClick={() => setValue("new-secret-" + Date.now())}\n            className="rounded bg-primary px-2 py-1 text-sm text-white"\n          >\n            Change value\n          </button>\n          <button\n            onClick={() => setValue("")}\n            className="rounded bg-secondary px-2 py-1 text-sm text-surface ring ring-border"\n          >\n            Clear\n          </button>\n        </div>\n      </div>',
          '<SensitiveInput\n      label="Invalid Key"\n      variant="error"\n      defaultValue="invalid-key"\n      error="This API key is not valid"\n    />',
          '<SensitiveInput\n      label="Disabled Secret"\n      defaultValue="cannot-edit"\n      disabled\n    />',
          '<SensitiveInput\n      label="Read-only Secret"\n      defaultValue="view-only-secret-key"\n      readOnly\n    />',
          `<SensitiveInput
      label="Password"
      defaultValue="my-secret-value"
      description="Keep this password secure and don't share it"
    />`,
          '<SensitiveInput\n      label="API Key"\n      defaultValue="copyable-secret-key"\n      onCopy={() => console.log("Value copied!")}\n    />',
          '<SensitiveInput\n      defaultValue="sk_live_abc123xyz789"\n      placeholder="Input without Field wrapper"\n    />'
        ],
        colors: [
          "bg-primary",
          "bg-secondary",
          "outline-active",
          "text-muted",
          "text-surface"
        ]
      },
      Surface: {
        name: "Surface",
        type: "component",
        description: "Surface component",
        importPath: "@cloudflare/kumo",
        category: "Layout",
        props: {
          as: {
            type: "React.ElementType",
            optional: true,
            description: 'The element type to render as (default: "div")'
          },
          className: {
            type: "string",
            optional: true,
            description: "Additional CSS classes"
          },
          children: {
            type: "ReactNode",
            optional: true,
            description: "Child elements"
          }
        },
        examples: [
          "<Surface  />"
        ],
        colors: [
          "ring-border"
        ]
      },
      Switch: {
        name: "Switch",
        type: "component",
        description: "Switch component",
        importPath: "@cloudflare/kumo",
        category: "Input",
        props: {
          variant: {
            type: "enum",
            optional: true,
            description: 'Visual variant: "default" or "error" for validation failures (visual only, no error text)',
            values: [
              "default",
              "error"
            ],
            descriptions: {
              default: "Default switch appearance",
              error: "Error state for validation failures"
            },
            classes: {
              error: "ring-error"
            },
            default: "default"
          },
          label: {
            type: "string",
            optional: true,
            description: "Label text for the switch (Field wrapper is built-in). Optional when used standalone for visual-only purposes."
          },
          controlFirst: {
            type: "boolean",
            optional: true,
            description: "When true (default), switch appears before label. When false, label appears before switch."
          },
          size: {
            type: "enum",
            optional: true,
            values: [
              "sm",
              "base",
              "lg"
            ],
            descriptions: {
              sm: "Small switch for compact UIs",
              base: "Default switch size",
              lg: "Large switch for prominent toggles"
            },
            classes: {
              sm: "h-5.5 w-8.5",
              base: "h-6.5 w-10.5",
              lg: "h-7.5 w-12.5"
            },
            default: "base"
          },
          checked: {
            type: "boolean",
            optional: true
          },
          disabled: {
            type: "boolean",
            optional: true
          },
          transitioning: {
            type: "boolean",
            optional: true
          },
          name: {
            type: "string",
            optional: true
          },
          type: {
            type: "enum",
            optional: true,
            values: [
              "submit",
              "reset",
              "button"
            ]
          },
          value: {
            type: "string | string[] | number",
            optional: true
          },
          className: {
            type: "string",
            optional: true
          },
          id: {
            type: "string",
            optional: true
          },
          lang: {
            type: "string",
            optional: true
          },
          title: {
            type: "string",
            optional: true
          },
          onChange: {
            type: "React.FormEventHandler<HTMLButtonElement>",
            optional: true
          },
          onSubmit: {
            type: "React.FormEventHandler<HTMLButtonElement>",
            optional: true
          },
          onClick: {
            type: "(event: React.MouseEvent) => void",
            optional: true,
            description: "Callback when switch is clicked"
          }
        },
        examples: [
          '<div className="flex flex-col gap-4">\n      {Object.keys(KUMO_SWITCH_VARIANTS.variant).map((variant) => (\n        <div\n          key={variant}\n          className="border border-dotted border-color bg-surface p-4"\n        >\n          <div className="mb-2 font-sans text-sm leading-5 font-light tracking-wide text-muted uppercase">\n            {variant}\n          </div>\n          <Switch label="Switch variant" variant={variant as any} />\n        </div>\n      ))}\n    </div>',
          `<Switch label="I'm checked" checked={true} />`,
          `<Switch label="I'm unchecked" checked={false} />`,
          '<div className="flex flex-col gap-4">\n      {[false, true].map((checked) => (\n        <Switch\n          key={String(checked)}\n          label={`Disabled (${checked ? "checked" : "unchecked"})`}\n          checked={checked}\n          disabled\n        />\n      ))}\n    </div>',
          '<div className="flex flex-col gap-4">\n      {[false, true].map((checked) => (\n        <Switch\n          key={String(checked)}\n          label={`Error (${checked ? "checked" : "unchecked"})`}\n          variant="error"\n          checked={checked}\n        />\n      ))}\n    </div>',
          '<Switch label="Label first" controlFirst={false} />',
          '<div className="flex flex-col gap-4">\n        <Switch\n          label="Controlled switch"\n          checked={checked}\n          onCheckedChange={setChecked}\n        />\n        <div className="rounded-md bg-surface-elevated p-4">\n          <div className="mb-2 text-sm font-medium text-surface">State:</div>\n          <code className="text-sm text-muted">\n            {checked ? "checked" : "unchecked"}\n          </code>\n        </div>\n      </div>',
          '<Switch.Group legend="Privacy settings">\n      <Switch.Item label="Email notifications" />\n      <Switch.Item label="SMS notifications" />\n      <Switch.Item label="Push notifications" />\n    </Switch.Group>',
          '<Switch.Group\n      legend="Required settings"\n      error="You must enable at least one notification method"\n    >\n      <Switch.Item label="Email notifications" />\n      <Switch.Item label="SMS notifications" />\n      <Switch.Item label="Push notifications" />\n    </Switch.Group>',
          '<Switch.Group\n      legend="Notification settings"\n      description="Choose how you want to be notified about important updates"\n    >\n      <Switch.Item label="Email notifications" checked />\n      <Switch.Item label="SMS notifications" />\n      <Switch.Item label="Push notifications" checked />\n    </Switch.Group>',
          '<Switch.Group legend="Notification preferences" controlFirst={false}>\n      <Switch.Item label="Email notifications" checked />\n      <Switch.Item label="SMS notifications" />\n      <Switch.Item label="Push notifications" checked />\n    </Switch.Group>',
          '<div className="flex flex-col gap-8">\n      {/* English (LTR) - Control First: Switch \u2192 Label */}\n      <fieldset className="rounded border border-border p-4">\n        <legend className="px-2 text-base font-semibold text-surface">\n          English (Switch \u2192 Label)\n        </legend>\n        <div className="mt-4 flex flex-col gap-4">\n          <Switch label="Switch is unchecked" controlFirst={true} />\n          <Switch\n            label="Switch is unchecked and disabled"\n            disabled\n            controlFirst={true}\n          />\n          <Switch label="Switch is checked" checked controlFirst={true} />\n          <Switch\n            label="Switch is checked and disabled"\n            checked\n            disabled\n            controlFirst={true}\n          />\n        </div>\n      </fieldset>\n\n      {/* Spanish (LTR) - Label First: Label \u2192 Switch */}\n      <fieldset className="rounded border border-border p-4">\n        <legend className="px-2 text-base font-semibold text-surface">\n          Espa\xF1ol (Etiqueta \u2192 Interruptor)\n        </legend>\n        <div className="mt-4 flex flex-col gap-4">\n          <Switch label="El interruptor est\xE1 desmarcado" controlFirst={false} />\n          <Switch\n            label="El interruptor est\xE1 desmarcado y deshabilitado"\n            disabled\n            controlFirst={false}\n          />\n          <Switch\n            label="El interruptor est\xE1 marcado"\n            checked\n            controlFirst={false}\n          />\n          <Switch\n            label="El interruptor est\xE1 marcado y deshabilitado"\n            checked\n            disabled\n            controlFirst={false}\n          />\n        </div>\n      </fieldset>\n\n      {/* Arabic (RTL) - Control First: Switch \u2192 Label */}\n      <fieldset className="rounded border border-border p-4" dir="rtl">\n        <legend className="px-2 text-base font-semibold text-surface">\n          \u0627\u0644\u0639\u0631\u0628\u064A\u0629 (\u0627\u0644\u0645\u0641\u062A\u0627\u062D \u2190 \u0627\u0644\u062A\u0633\u0645\u064A\u0629)\n        </legend>\n        <div className="mt-4 flex flex-col gap-4">\n          <Switch label="\u0627\u0644\u0645\u0641\u062A\u0627\u062D \u063A\u064A\u0631 \u0645\u062D\u062F\u062F" controlFirst={true} />\n          <Switch label="\u0627\u0644\u0645\u0641\u062A\u0627\u062D \u063A\u064A\u0631 \u0645\u062D\u062F\u062F \u0648\u0645\u0639\u0637\u0644" disabled controlFirst={true} />\n          <Switch label="\u0627\u0644\u0645\u0641\u062A\u0627\u062D \u0645\u062D\u062F\u062F" checked controlFirst={true} />\n          <Switch\n            label="\u0627\u0644\u0645\u0641\u062A\u0627\u062D \u0645\u062D\u062F\u062F \u0648\u0645\u0639\u0637\u0644"\n            checked\n            disabled\n            controlFirst={true}\n          />\n        </div>\n      </fieldset>\n\n      {/* Hebrew (RTL) - Label First: Label \u2192 Switch */}\n      <fieldset className="rounded border border-border p-4" dir="rtl">\n        <legend className="px-2 text-base font-semibold text-surface">\n          \u05E2\u05D1\u05E8\u05D9\u05EA (\u05EA\u05D5\u05D5\u05D9\u05EA \u2190 \u05DE\u05EA\u05D2)\n        </legend>\n        <div className="mt-4 flex flex-col gap-4">\n          <Switch label="\u05D4\u05DE\u05EA\u05D2 \u05DC\u05D0 \u05DE\u05E1\u05D5\u05DE\u05DF" controlFirst={false} />\n          <Switch label="\u05D4\u05DE\u05EA\u05D2 \u05DC\u05D0 \u05DE\u05E1\u05D5\u05DE\u05DF \u05D5\u05DE\u05D5\u05E9\u05D1\u05EA" disabled controlFirst={false} />\n          <Switch label="\u05D4\u05DE\u05EA\u05D2 \u05DE\u05E1\u05D5\u05DE\u05DF" checked controlFirst={false} />\n          <Switch\n            label="\u05D4\u05DE\u05EA\u05D2 \u05DE\u05E1\u05D5\u05DE\u05DF \u05D5\u05DE\u05D5\u05E9\u05D1\u05EA"\n            checked\n            disabled\n            controlFirst={false}\n          />\n        </div>\n      </fieldset>\n    </div>',
          '<div className="flex flex-col gap-8">\n      {/* English (LTR) - Control First: Switch \u2192 Label */}\n      <div>\n        <Switch.Group legend="English (Switch \u2192 Label)" controlFirst={true}>\n          <Switch.Item label="Email notifications" checked />\n          <Switch.Item label="SMS notifications" />\n          <Switch.Item label="Push notifications" checked />\n          <Switch.Item label="In-app notifications" disabled />\n        </Switch.Group>\n      </div>\n\n      {/* Spanish (LTR) - Label First: Label \u2192 Switch */}\n      <div>\n        <Switch.Group\n          legend="Espa\xF1ol (Etiqueta \u2192 Interruptor)"\n          controlFirst={false}\n        >\n          <Switch.Item label="Notificaciones por correo electr\xF3nico" checked />\n          <Switch.Item label="Notificaciones por SMS" />\n          <Switch.Item label="Notificaciones push" checked />\n          <Switch.Item label="Notificaciones en la aplicaci\xF3n" disabled />\n        </Switch.Group>\n      </div>\n\n      {/* Arabic (RTL) - Control First: Switch \u2192 Label */}\n      <div dir="rtl">\n        <Switch.Group legend="\u0627\u0644\u0639\u0631\u0628\u064A\u0629 (\u0627\u0644\u0645\u0641\u062A\u0627\u062D \u2190 \u0627\u0644\u062A\u0633\u0645\u064A\u0629)" controlFirst={true}>\n          <Switch.Item label="\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A" checked />\n          <Switch.Item label="\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u0642\u0635\u064A\u0631\u0629" />\n          <Switch.Item label="\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0641\u0648\u0631\u064A\u0629" checked />\n          <Switch.Item label="\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u062F\u0627\u062E\u0644 \u0627\u0644\u062A\u0637\u0628\u064A\u0642" disabled />\n        </Switch.Group>\n      </div>\n\n      {/* Hebrew (RTL) - Label First: Label \u2192 Switch */}\n      <div dir="rtl">\n        <Switch.Group legend="\u05E2\u05D1\u05E8\u05D9\u05EA (\u05EA\u05D5\u05D5\u05D9\u05EA \u2190 \u05DE\u05EA\u05D2)" controlFirst={false}>\n          <Switch.Item label="\u05D4\u05EA\u05E8\u05D0\u05D5\u05EA \u05D0\u05D9\u05DE\u05D9\u05D9\u05DC" checked />\n          <Switch.Item label="\u05D4\u05EA\u05E8\u05D0\u05D5\u05EA SMS" />\n          <Switch.Item label="\u05D4\u05EA\u05E8\u05D0\u05D5\u05EA \u05D3\u05D7\u05D9\u05E4\u05D4" checked />\n          <Switch.Item label="\u05D4\u05EA\u05E8\u05D0\u05D5\u05EA \u05D1\u05EA\u05D5\u05DA \u05D4\u05D0\u05E4\u05DC\u05D9\u05E7\u05E6\u05D9\u05D4" disabled />\n        </Switch.Group>\n      </div>\n    </div>'
        ],
        colors: [
          "bg-error",
          "bg-hover",
          "bg-hover-selected",
          "bg-primary",
          "bg-surface-3",
          "border-border",
          "ring-error",
          "text-error",
          "text-muted",
          "text-surface"
        ],
        subComponents: {
          Item: {
            name: "Item",
            description: "Item sub-component",
            props: {}
          },
          Group: {
            name: "Group",
            description: "Group sub-component",
            props: {
              legend: {
                type: "string",
                required: true
              },
              children: {
                type: "ReactNode",
                required: true
              },
              error: {
                type: "string",
                optional: true
              },
              description: {
                type: "ReactNode",
                optional: true
              },
              disabled: {
                type: "boolean",
                optional: true
              },
              controlFirst: {
                type: "boolean",
                optional: true
              },
              className: {
                type: "string",
                optional: true
              }
            }
          }
        }
      },
      Tabs: {
        name: "Tabs",
        type: "component",
        description: "Tabs component",
        importPath: "@cloudflare/kumo",
        category: "Navigation",
        props: {
          tabs: {
            type: "TabsItem[]",
            optional: true
          },
          value: {
            type: "string",
            optional: true
          },
          selectedValue: {
            type: "string",
            optional: true
          },
          className: {
            type: "string",
            optional: true
          },
          listClassName: {
            type: "string",
            optional: true
          },
          indicatorClassName: {
            type: "string",
            optional: true
          },
          onValueChange: {
            type: "(value: string) => void",
            description: "Callback when active tab changes"
          }
        },
        examples: [
          '<Tabs tabs={`[\n      { value: "tab1", label: "Tab 1" },\n      { value: "tab2", label: "Tab 2" },\n      { value: "tab3", label: "Tab 3" },\n    ]`} selectedValue="tab1" />'
        ],
        colors: [
          "bg-accent",
          "bg-surface-elevated",
          "ring-color-2",
          "text-label",
          "text-surface"
        ]
      },
      Text: {
        name: "Text",
        type: "component",
        description: "Text component",
        importPath: "@cloudflare/kumo",
        category: "Display",
        props: {
          variant: {
            type: "enum",
            optional: true,
            description: "Text style variant",
            values: [
              "heading1",
              "heading2",
              "heading3",
              "body",
              "secondary",
              "success",
              "error",
              "mono",
              "mono-secondary"
            ],
            descriptions: {
              heading1: "Large heading for page titles",
              heading2: "Medium heading for section titles",
              heading3: "Small heading for subsections",
              body: "Default body text",
              secondary: "Muted text for secondary information",
              success: "Success state text",
              error: "Error state text",
              mono: "Monospace text for code",
              "mono-secondary": "Muted monospace text"
            },
            classes: {
              heading1: "text-3xl font-semibold",
              heading2: "text-2xl font-semibold",
              heading3: "text-lg font-semibold",
              body: "text-surface",
              secondary: "text-muted",
              success: "text-info",
              error: "text-error",
              mono: "font-mono",
              "mono-secondary": "font-mono text-muted"
            },
            default: "body"
          },
          size: {
            type: "enum",
            optional: true,
            description: "Text size (only applies to body/secondary/success/error variants)",
            values: [
              "xs",
              "sm",
              "base",
              "lg"
            ],
            descriptions: {
              xs: "Extra small text",
              sm: "Small text",
              base: "Default text size",
              lg: "Large text"
            },
            classes: {
              xs: "text-xs",
              sm: "text-sm",
              base: "text-base",
              lg: "text-lg"
            },
            default: "base"
          },
          bold: {
            type: "boolean",
            optional: true,
            description: "Whether to use bold font weight (only applies to body variants)"
          },
          as: {
            type: "React.ElementType",
            optional: true,
            description: "The element type to render as"
          },
          children: {
            type: "ReactNode",
            optional: true,
            description: "Child text content"
          }
        },
        examples: [
          '<Text variant="heading1">Sample text</Text>',
          '<Text variant="heading2">Sample text</Text>',
          '<Text variant="heading3">Sample text</Text>',
          '<Text variant="body">Sample text</Text>',
          '<Text variant="secondary">Sample text</Text>',
          '<Text variant="success">Sample text</Text>',
          '<Text variant="error">Sample text</Text>',
          '<Text variant="mono">Sample text</Text>',
          '<Text variant="mono-secondary">Sample text</Text>',
          '<Text size="xs">Sample text</Text>',
          '<Text size="sm">Sample text</Text>',
          '<Text size="base">Sample text</Text>',
          '<Text size="lg">Sample text</Text>',
          "<Text bold={true}>Bold text</Text>"
        ],
        colors: [
          "text-error",
          "text-info",
          "text-muted",
          "text-surface"
        ]
      },
      Toasty: {
        name: "Toasty",
        type: "component",
        description: "Toasty component",
        importPath: "@cloudflare/kumo",
        category: "Feedback",
        props: {
          children: {
            type: "ReactNode",
            optional: true
          }
        },
        examples: [],
        colors: [
          "bg-toast",
          "bg-toast-button-hover",
          "border-color",
          "text-label",
          "text-muted",
          "text-surface"
        ]
      },
      Tooltip: {
        name: "Tooltip",
        type: "component",
        description: "Tooltip component",
        importPath: "@cloudflare/kumo",
        category: "Overlay",
        props: {
          align: {
            type: "enum",
            optional: true,
            values: [
              "start",
              "center",
              "end"
            ]
          },
          asChild: {
            type: "boolean",
            optional: true
          },
          className: {
            type: "string",
            optional: true
          },
          side: {
            type: "enum",
            optional: true,
            values: [
              "top",
              "bottom",
              "left",
              "right"
            ],
            descriptions: {
              top: "Tooltip appears above the trigger",
              bottom: "Tooltip appears below the trigger",
              left: "Tooltip appears to the left of the trigger",
              right: "Tooltip appears to the right of the trigger"
            },
            default: "top"
          },
          content: {
            type: "ReactNode",
            required: true,
            description: "Content to display in the tooltip"
          }
        },
        examples: [
          '<Tooltip content="This is a tooltip" asChild>\n      <Button>Hover me</Button>\n    </Tooltip>'
        ],
        colors: [
          "bg-black-icon",
          "fill-black-icon",
          "fill-icon-path"
        ]
      }
    },
    search: {
      byCategory: {
        Display: [
          "Badge",
          "Code",
          "Collapsible",
          "LayerCard",
          "Meter",
          "Text"
        ],
        Feedback: [
          "Banner",
          "Loader",
          "Toasty"
        ],
        Block: [
          "Breadcrumbs",
          "Empty",
          "PageHeader"
        ],
        Action: [
          "Button",
          "ClipboardText"
        ],
        Input: [
          "Checkbox",
          "Combobox",
          "DateRangePicker",
          "Field",
          "Input",
          "Select",
          "Switch"
        ],
        Overlay: [
          "Dialog",
          "DropdownMenu",
          "Tooltip"
        ],
        Other: [
          "Icon",
          "SensitiveInput"
        ],
        Navigation: [
          "MenuBar",
          "Pagination",
          "Tabs"
        ],
        Layout: [
          "Surface"
        ]
      },
      byName: [
        "Badge",
        "Banner",
        "Breadcrumbs",
        "Button",
        "Checkbox",
        "ClipboardText",
        "Code",
        "Collapsible",
        "Combobox",
        "DateRangePicker",
        "Dialog",
        "DropdownMenu",
        "Empty",
        "Field",
        "Icon",
        "Input",
        "LayerCard",
        "Loader",
        "MenuBar",
        "Meter",
        "PageHeader",
        "Pagination",
        "Select",
        "SensitiveInput",
        "Surface",
        "Switch",
        "Tabs",
        "Text",
        "Toasty",
        "Tooltip"
      ]
    }
  };

  // scripts/figma/plugin/generators/badge.ts
  var badgeProps = component_registry_default.components.Badge.props;
  var variantProp = badgeProps.variant;
  var BADGE_BASE_STYLES = "rounded-full px-2 py-0.5 text-xs";
  function createBadgeComponent(variant) {
    return __async(this, null, function* () {
      const classes = variantProp.classes[variant] || "";
      const description = variantProp.descriptions[variant] || "";
      const baseStyles = parseTailwindClasses(BADGE_BASE_STYLES);
      const variantStyles = parseTailwindClasses(classes);
      const component = figma.createComponent();
      component.name = "variant=" + variant;
      component.description = description;
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisAlignItems = "CENTER";
      component.counterAxisAlignItems = "CENTER";
      component.paddingLeft = baseStyles.paddingX || 8;
      component.paddingRight = baseStyles.paddingX || 8;
      component.paddingTop = baseStyles.paddingY || 2;
      component.paddingBottom = baseStyles.paddingY || 2;
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.cornerRadius = baseStyles.borderRadius || 9999;
      if (variantStyles.fillVariable) {
        const fillVar = getVariableByName(variantStyles.fillVariable);
        if (fillVar) {
          bindFillToVariable(component, fillVar.id);
        }
      } else {
        component.fills = [];
      }
      if (variantStyles.hasBorder && variantStyles.strokeVariable) {
        const strokeVar = getVariableByName(variantStyles.strokeVariable);
        if (strokeVar) {
          bindStrokeToVariable(component, strokeVar.id, 1);
          if (variantStyles.borderStyle === "dashed") {
            component.dashPattern = [4, 4];
          }
        }
      }
      const textNode = yield createTextNode(
        "Badge",
        baseStyles.fontSize || 12,
        500
        // font-medium
      );
      textNode.name = "Label";
      if (variantStyles.isWhiteText) {
        setWhiteTextColor(textNode);
      } else if (variantStyles.textVariable) {
        const textVar = getVariableByName(variantStyles.textVariable);
        if (textVar) {
          bindTextColorToVariable(textNode, textVar.id);
        }
      }
      component.appendChild(textNode);
      return component;
    });
  }
  var SECTION_PADDING = 48;
  var SECTION_GAP = 160;
  function generateBadgeComponents(startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      let componentsPage = figma.root.children.find(function(page) {
        return page.type === "PAGE" && page.name === "Components";
      });
      if (!componentsPage) {
        componentsPage = figma.createPage();
        componentsPage.name = "Components";
      }
      figma.currentPage = componentsPage;
      const variants = variantProp.values;
      const components = [];
      const rowLabels = [];
      const rowGap = 40;
      const labelColumnWidth = 180;
      let currentY = 0;
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        const component = yield createBadgeComponent(variant);
        rowLabels.push({ y: currentY, text: "variant=" + variant });
        component.x = labelColumnWidth;
        component.y = currentY;
        currentY += component.height + rowGap;
        components.push(component);
      }
      const componentSet = figma.combineAsVariants(components, componentsPage);
      componentSet.name = "Badge";
      componentSet.description = "Badge component with variant styles";
      const contentWidth = componentSet.width + labelColumnWidth;
      const contentHeight = componentSet.height;
      const lightSection = createModeSection(componentsPage, "Badge", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING * 2,
        contentHeight + SECTION_PADDING * 2
      );
      const darkSection = createModeSection(componentsPage, "Badge", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING * 2,
        contentHeight + SECTION_PADDING * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING + labelColumnWidth;
      componentSet.y = SECTION_PADDING;
      for (const label of rowLabels) {
        const labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING,
          SECTION_PADDING + label.y + 4
          // +4 to vertically center with badge
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (const component of components) {
        const instance = component.createInstance();
        instance.x = component.x + SECTION_PADDING + labelColumnWidth;
        instance.y = component.y + SECTION_PADDING;
        darkSection.frame.appendChild(instance);
      }
      for (const label of rowLabels) {
        const labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING,
          SECTION_PADDING + label.y + 4
        );
        darkSection.frame.appendChild(labelNode);
      }
      const totalWidth = contentWidth + SECTION_PADDING * 2;
      const totalHeight = contentHeight + SECTION_PADDING * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      console.log(
        "\u2705 Generated Badge ComponentSet with " + variants.length + " variants (light + dark)"
      );
      return startY + totalHeight + SECTION_GAP;
    });
  }

  // scripts/figma/plugin/generators/icon-utils.ts
  var ICON_SIZE_MAP = {
    xs: 12,
    sm: 16,
    base: 20,
    lg: 20
  };
  var DEFAULT_ICONS = {
    /** Plus icon for add buttons */
    plus: "ph-plus",
    /** Refresh/arrows clockwise for refresh button */
    refresh: "ph-arrows-clockwise",
    /** Check icon for checkboxes */
    check: "ph-check",
    /** Minus icon for indeterminate checkbox */
    minus: "ph-minus",
    /** Arrow right for link buttons */
    arrowRight: "ph-arrow-right"
  };
  function findIconComponent(iconId) {
    var iconLibraryPage = figma.root.children.find(function(page) {
      return page.type === "PAGE" && page.name === "Icon Library";
    });
    if (!iconLibraryPage) {
      console.warn("Icon Library page not found. Run icon generation first.");
      return void 0;
    }
    var iconsFrame = iconLibraryPage.children.find(function(node) {
      return node.type === "FRAME" && node.name === "Icons";
    });
    if (!iconsFrame) {
      console.warn("Icons frame not found in Icon Library page.");
      return void 0;
    }
    var componentName = "Icon/" + iconId;
    var iconComponent = iconsFrame.children.find(function(node) {
      return node.type === "COMPONENT" && node.name === componentName;
    });
    if (!iconComponent) {
      console.warn("Icon component not found: " + componentName);
    }
    return iconComponent;
  }
  function createIconInstance(iconId, size) {
    var iconComponent = findIconComponent(iconId);
    if (!iconComponent) {
      return void 0;
    }
    var instance = iconComponent.createInstance();
    instance.resize(size, size);
    return instance;
  }
  function createPlaceholderIcon(size) {
    var frame = figma.createFrame();
    frame.name = "Placeholder Icon";
    frame.resize(size, size);
    frame.fills = [];
    var rect = figma.createRectangle();
    rect.resize(size, size);
    rect.x = 0;
    rect.y = 0;
    rect.cornerRadius = size * 0.2;
    rect.fills = [{ type: "SOLID", color: { r: 0.6, g: 0.6, b: 0.6 } }];
    frame.appendChild(rect);
    return frame;
  }
  function getButtonIcon(iconId, size) {
    var iconSize = ICON_SIZE_MAP[size] || 20;
    var instance = createIconInstance(iconId, iconSize);
    if (instance) {
      return instance;
    }
    console.warn(
      "Using placeholder for icon: " + iconId + ". Generate Icon Library first."
    );
    return createPlaceholderIcon(iconSize);
  }
  function createLoader(size) {
    if (size === void 0) size = 16;
    var frame = figma.createFrame();
    frame.name = "Loader";
    frame.resize(size, size);
    frame.fills = [];
    var spinner = figma.createEllipse();
    spinner.resize(size, size);
    spinner.x = 0;
    spinner.y = 0;
    spinner.fills = [];
    spinner.strokes = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.4 } }];
    spinner.strokeWeight = 2;
    spinner.strokeAlign = "CENTER";
    spinner.dashPattern = [4, 4];
    frame.appendChild(spinner);
    return frame;
  }
  function bindIconColor(icon, colorVariableName) {
    var isHardcodedWhite = colorVariableName === "text-white" || colorVariableName === "!text-white";
    var figmaVariableName = colorVariableName;
    if (colorVariableName === "text-surface") {
      figmaVariableName = "text-color-surface";
    } else if (colorVariableName === "text-surface-inverse") {
      figmaVariableName = "text-color-surface-inverse";
    } else if (colorVariableName === "fill-surface-inverse") {
      figmaVariableName = "color-surface-inverse";
    } else if (colorVariableName === "text-muted") {
      figmaVariableName = "text-color-muted";
    } else if (colorVariableName === "text-error") {
      figmaVariableName = "text-color-error";
    } else if (colorVariableName === "text-info") {
      figmaVariableName = "text-color-info";
    } else if (colorVariableName === "text-disabled") {
      figmaVariableName = "text-color-disabled";
    } else if (colorVariableName === "text-label") {
      figmaVariableName = "text-color-label";
    }
    var variable;
    if (!isHardcodedWhite) {
      variable = getVariableByName(figmaVariableName);
      if (!variable) {
        console.warn(
          "Failed to bind icon color: variable '" + figmaVariableName + "' not found (from '" + colorVariableName + "')"
        );
        figma.notify("\u26A0\uFE0F Icon color variable not found: " + figmaVariableName, {
          error: true
        });
        return;
      }
    }
    function traverseAndBind(node) {
      if (node.type === "VECTOR" || node.type === "ELLIPSE" || node.type === "RECTANGLE" || node.type === "POLYGON" || node.type === "STAR" || node.type === "LINE") {
        if (isHardcodedWhite) {
          var whiteFill = {
            type: "SOLID",
            color: { r: 1, g: 1, b: 1 }
          };
          node.fills = [whiteFill];
        } else if (variable) {
          bindFillToVariable(node, variable.id);
        }
      }
      if ("children" in node && node.children) {
        for (var i = 0; i < node.children.length; i++) {
          traverseAndBind(node.children[i]);
        }
      }
    }
    traverseAndBind(icon);
  }

  // scripts/figma/plugin/generators/banner.ts
  var bannerProps = component_registry_default.components.Banner.props;
  var variantProp2 = bannerProps.variant;
  var BANNER_BASE_STYLES = "flex w-full items-center gap-2 rounded-lg border px-4 py-1.5 text-base";
  function createBannerComponent(variant) {
    return __async(this, null, function* () {
      const classes = variantProp2.classes[variant] || "";
      const description = variantProp2.descriptions[variant] || "";
      const baseStyles = parseTailwindClasses(BANNER_BASE_STYLES);
      const variantStyles = parseTailwindClasses(classes);
      const component = figma.createComponent();
      component.name = "variant=" + variant;
      component.description = description;
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisAlignItems = "CENTER";
      component.counterAxisAlignItems = "CENTER";
      component.itemSpacing = baseStyles.gap || 8;
      component.paddingLeft = baseStyles.paddingX || 16;
      component.paddingRight = baseStyles.paddingX || 16;
      component.paddingTop = baseStyles.paddingY || 6;
      component.paddingBottom = baseStyles.paddingY || 6;
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.cornerRadius = baseStyles.borderRadius || 8;
      if (variantStyles.fillVariable) {
        const fillVar = getVariableByName(variantStyles.fillVariable);
        if (fillVar) {
          bindFillToVariable(component, fillVar.id);
        }
      } else {
        component.fills = [];
      }
      if (variantStyles.strokeVariable) {
        const strokeVar = getVariableByName(variantStyles.strokeVariable);
        if (strokeVar) {
          bindStrokeToVariable(component, strokeVar.id, 1);
        }
      }
      const BANNER_ICONS = {
        default: "ph-info",
        alert: "ph-warning",
        error: "ph-warning"
      };
      const iconId = BANNER_ICONS[variant] || "ph-info";
      const iconSize = 16;
      const iconInstance = createIconInstance(iconId, iconSize);
      if (iconInstance) {
        iconInstance.name = "Icon";
        if (variantStyles.textVariable) {
          bindIconColor(iconInstance, variantStyles.textVariable);
        }
        component.appendChild(iconInstance);
      } else {
        const iconPlaceholder = figma.createRectangle();
        iconPlaceholder.name = "Icon (placeholder)";
        iconPlaceholder.resize(iconSize, iconSize);
        iconPlaceholder.cornerRadius = 2;
        if (variantStyles.textVariable) {
          const iconColorVar = getVariableByName(variantStyles.textVariable);
          if (iconColorVar) {
            bindFillToVariable(iconPlaceholder, iconColorVar.id);
          }
        }
        component.appendChild(iconPlaceholder);
      }
      const textNode = yield createTextNode(
        "This is a banner message",
        baseStyles.fontSize || 16,
        // text-base = 16px
        400
        // normal weight
      );
      textNode.name = "Text";
      if (variantStyles.textVariable) {
        const textVar = getVariableByName(variantStyles.textVariable);
        if (textVar) {
          bindTextColorToVariable(textNode, textVar.id);
        }
      }
      component.appendChild(textNode);
      return component;
    });
  }
  var SECTION_PADDING2 = 48;
  var SECTION_GAP2 = 160;
  function generateBannerComponents(startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      let componentsPage = figma.root.children.find(function(page) {
        return page.type === "PAGE" && page.name === "Components";
      });
      if (!componentsPage) {
        componentsPage = figma.createPage();
        componentsPage.name = "Components";
      }
      figma.currentPage = componentsPage;
      const variants = variantProp2.values;
      const components = [];
      const rowLabels = [];
      const rowGap = 48;
      const labelColumnWidth = 160;
      let currentY = 0;
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        const component = yield createBannerComponent(variant);
        rowLabels.push({ y: currentY, text: "variant=" + variant });
        component.x = labelColumnWidth;
        component.y = currentY;
        currentY += component.height + rowGap;
        components.push(component);
      }
      const componentSet = figma.combineAsVariants(components, componentsPage);
      componentSet.name = "Banner";
      componentSet.description = "Banner component with variant styles";
      const contentWidth = componentSet.width + labelColumnWidth;
      const contentHeight = componentSet.height;
      const lightSection = createModeSection(componentsPage, "Banner", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING2 * 2,
        contentHeight + SECTION_PADDING2 * 2
      );
      const darkSection = createModeSection(componentsPage, "Banner", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING2 * 2,
        contentHeight + SECTION_PADDING2 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING2 + labelColumnWidth;
      componentSet.y = SECTION_PADDING2;
      for (const label of rowLabels) {
        const labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING2,
          SECTION_PADDING2 + label.y + 8
          // +8 to vertically center with banner
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (const component of components) {
        const instance = component.createInstance();
        instance.x = component.x + SECTION_PADDING2 + labelColumnWidth;
        instance.y = component.y + SECTION_PADDING2;
        darkSection.frame.appendChild(instance);
      }
      for (const label of rowLabels) {
        const labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING2,
          SECTION_PADDING2 + label.y + 8
        );
        darkSection.frame.appendChild(labelNode);
      }
      const totalWidth = contentWidth + SECTION_PADDING2 * 2;
      const totalHeight = contentHeight + SECTION_PADDING2 * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      console.log(
        "\u2705 Generated Banner ComponentSet with " + variants.length + " variants (light + dark)"
      );
      return startY + totalHeight + SECTION_GAP2;
    });
  }

  // scripts/figma/plugin/generators/button.ts
  var buttonProps = component_registry_default.components.Button.props;
  var variantProp3 = buttonProps.variant;
  var sizeProp = buttonProps.size;
  var shapeProp = buttonProps.shape;
  var COMPACT_SIZE_MAP_LOCAL = {
    xs: 14,
    // size-3.5 = 14px
    sm: 26,
    // size-6.5 = 26px
    base: 36,
    // size-9 = 36px
    lg: 40
    // size-10 = 40px
  };
  var SECTION_PADDING3 = 48;
  var SECTION_GAP3 = 160;
  var STATE_STYLES = {
    primary: {
      // hover:bg-primary/70
      hover: { fillVariable: "color-primary/70" },
      focus: { addRing: true },
      pressed: { fillVariable: "color-primary/70" }
    },
    secondary: {
      // not-disabled:hover:bg-subtle, not-disabled:hover:border-subtle!
      hover: { fillVariable: "color-subtle", strokeVariable: "color-subtle" },
      focus: { addRing: true },
      // data-[state=open]:bg-subtle
      pressed: { fillVariable: "color-subtle" }
    },
    ghost: {
      // hover:bg-accent
      hover: { fillVariable: "color-accent" },
      focus: { addRing: true },
      pressed: { fillVariable: "color-accent" }
    },
    destructive: {
      // hover:bg-error/70
      hover: { fillVariable: "color-error/70" },
      focus: { addRing: true },
      pressed: { fillVariable: "color-error/70" }
    },
    "secondary-destructive": {
      // not-disabled:hover:bg-subtle, not-disabled:hover:border-subtle!
      hover: { fillVariable: "color-subtle", strokeVariable: "color-subtle" },
      focus: { addRing: true },
      pressed: { fillVariable: "color-subtle" }
    },
    outline: {
      hover: { fillVariable: "color-subtle" },
      focus: { addRing: true },
      pressed: { fillVariable: "color-subtle" }
    }
  };
  function createButtonComponent(variant, size, shape, disabled, loading, state) {
    return __async(this, null, function* () {
      var variantClasses = variantProp3.classes[variant] || "";
      var sizeClasses = sizeProp.classes[size] || "";
      var variantStyles = parseTailwindClasses(variantClasses);
      var sizeStyles = parseTailwindClasses(sizeClasses);
      var component = figma.createComponent();
      component.name = "variant=" + variant + ", size=" + size + ", shape=" + shape + ", disabled=" + disabled + ", loading=" + loading + ", state=" + state;
      var isCompactShape = shape === "square" || shape === "circle";
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisAlignItems = "CENTER";
      component.counterAxisAlignItems = "CENTER";
      if (isCompactShape) {
        var buttonSize = COMPACT_SIZE_MAP_LOCAL[size] || 36;
        component.primaryAxisSizingMode = "FIXED";
        component.counterAxisSizingMode = "FIXED";
        component.resize(buttonSize, buttonSize);
        component.paddingLeft = 0;
        component.paddingRight = 0;
      } else {
        component.primaryAxisSizingMode = "AUTO";
        component.counterAxisSizingMode = "FIXED";
        component.paddingLeft = sizeStyles.paddingX || 12;
        component.paddingRight = sizeStyles.paddingX || 12;
        component.resize(100, sizeStyles.height || 36);
      }
      component.paddingTop = 0;
      component.paddingBottom = 0;
      component.itemSpacing = sizeStyles.gap || 6;
      if (shape === "circle") {
        component.cornerRadius = BORDER_RADIUS.full;
      } else {
        component.cornerRadius = sizeStyles.borderRadius !== void 0 ? sizeStyles.borderRadius : BORDER_RADIUS.lg;
      }
      if (variantStyles.fillVariable) {
        var fillVar = getVariableByName(variantStyles.fillVariable);
        if (fillVar) {
          bindFillToVariable(component, fillVar.id);
        }
      } else {
        component.fills = [];
      }
      if (variantStyles.hasBorder && variantStyles.strokeVariable) {
        var strokeVar = getVariableByName(variantStyles.strokeVariable);
        if (strokeVar) {
          bindStrokeToVariable(component, strokeVar.id, 1);
        }
      }
      if (state !== "default" && !disabled && !loading) {
        var stateStyle = STATE_STYLES[variant] && STATE_STYLES[variant][state];
        if (stateStyle) {
          if (stateStyle.fillVariable) {
            var stateFillVar = getVariableByName(stateStyle.fillVariable);
            if (stateFillVar) {
              bindFillToVariable(component, stateFillVar.id);
            } else {
              var baseVarName = stateStyle.fillVariable.split("/")[0];
              var opacityMatch = stateStyle.fillVariable.match(/\/(\d+)$/);
              var baseFillVar = getVariableByName(baseVarName);
              if (baseFillVar) {
                bindFillToVariable(component, baseFillVar.id);
                if (opacityMatch) {
                  var opacityValue = parseInt(opacityMatch[1], 10) / 100;
                  var fills = component.fills;
                  if (fills && fills.length > 0) {
                    var newFills = [];
                    for (var fi = 0; fi < fills.length; fi++) {
                      var fill = Object.assign({}, fills[fi]);
                      fill.opacity = opacityValue;
                      newFills.push(fill);
                    }
                    component.fills = newFills;
                  }
                }
              }
            }
          }
          if (stateStyle.strokeVariable) {
            var stateStrokeVar = getVariableByName(stateStyle.strokeVariable);
            if (stateStrokeVar) {
              bindStrokeToVariable(component, stateStrokeVar.id, 1);
            }
          }
          if (stateStyle.addRing) {
            var ringVar = getVariableByName("color-active");
            if (ringVar) {
              bindStrokeToVariable(component, ringVar.id, 2);
            }
          }
        }
      }
      if (disabled) {
        component.opacity = 0.5;
      }
      if (loading) {
        var loaderSize = size === "lg" ? 16 : 14;
        var loader = createLoader(loaderSize);
        component.appendChild(loader);
      }
      if (isCompactShape && !loading) {
        var icon = getButtonIcon(DEFAULT_ICONS.plus, size);
        if (variantStyles.isWhiteText) {
          bindIconColor(icon, "text-white");
        } else if (variantStyles.textVariable) {
          bindIconColor(icon, variantStyles.textVariable);
        } else {
          bindIconColor(icon, "text-surface");
        }
        component.appendChild(icon);
      }
      if (shape === "base") {
        var fontWeight = 500;
        var labelText = loading ? "Loading..." : "Button";
        var textNode = yield createTextNode(
          labelText,
          sizeStyles.fontSize || 16,
          fontWeight
        );
        textNode.name = "Label";
        if (variantStyles.isWhiteText) {
          setWhiteTextColor(textNode);
        } else if (variantStyles.textVariable) {
          var textVar = getVariableByName(variantStyles.textVariable);
          if (textVar) {
            bindTextColorToVariable(textNode, textVar.id);
          }
        }
        component.appendChild(textNode);
      }
      return component;
    });
  }
  function generateButtonComponents(page, startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      figma.currentPage = page;
      var variants = variantProp3.values;
      var sizes = sizeProp.values;
      var components = [];
      var rowLabels = [];
      var componentGap = 16;
      var rowGap = 80;
      var headerRowHeight = 24;
      var labelColumnWidth = 220;
      var rowComponents = /* @__PURE__ */ new Map();
      var rowLabelTexts = /* @__PURE__ */ new Map();
      var columnHeaders = [];
      var baseShapeColumnOrder = [
        { state: "default", disabled: false, loading: false },
        { state: "hover", disabled: false, loading: false },
        { state: "focus", disabled: false, loading: false },
        { state: "pressed", disabled: false, loading: false },
        { state: "default", disabled: true, loading: false },
        { state: "default", disabled: false, loading: true }
      ];
      for (var vi = 0; vi < variants.length; vi++) {
        var variant = variants[vi];
        var rowIndex = vi;
        rowLabelTexts.set(rowIndex, "variant=" + variant);
        if (!rowComponents.has(rowIndex)) {
          rowComponents.set(rowIndex, []);
        }
        for (var ci = 0; ci < baseShapeColumnOrder.length; ci++) {
          var colConfig = baseShapeColumnOrder[ci];
          var component = yield createButtonComponent(
            variant,
            "base",
            // Always base size for variant rows
            "base",
            // Always base shape
            colConfig.disabled,
            colConfig.loading,
            colConfig.state
          );
          rowComponents.get(rowIndex).push(component);
          components.push(component);
        }
      }
      var sizeRowIndex = variants.length;
      rowLabelTexts.set(sizeRowIndex, "shape=base (sizes)");
      if (!rowComponents.has(sizeRowIndex)) {
        rowComponents.set(sizeRowIndex, []);
      }
      for (var sizeIdx = 0; sizeIdx < sizes.length; sizeIdx++) {
        var sizeVal = sizes[sizeIdx];
        var sizeComponent = yield createButtonComponent(
          "secondary",
          sizeVal,
          "base",
          // base shape = text button
          false,
          false,
          "default"
        );
        rowComponents.get(sizeRowIndex).push(sizeComponent);
        components.push(sizeComponent);
      }
      var squareRowIndex = variants.length + 1;
      rowLabelTexts.set(squareRowIndex, "shape=square");
      if (!rowComponents.has(squareRowIndex)) {
        rowComponents.set(squareRowIndex, []);
      }
      for (var si = 0; si < sizes.length; si++) {
        var size = sizes[si];
        var squareComponent = yield createButtonComponent(
          "secondary",
          size,
          "square",
          false,
          false,
          "default"
        );
        rowComponents.get(squareRowIndex).push(squareComponent);
        components.push(squareComponent);
      }
      var circleRowIndex = variants.length + 2;
      rowLabelTexts.set(circleRowIndex, "shape=circle");
      if (!rowComponents.has(circleRowIndex)) {
        rowComponents.set(circleRowIndex, []);
      }
      for (var si2 = 0; si2 < sizes.length; si2++) {
        var size2 = sizes[si2];
        var circleComponent = yield createButtonComponent(
          "secondary",
          size2,
          "circle",
          false,
          false,
          "default"
        );
        rowComponents.get(circleRowIndex).push(circleComponent);
        components.push(circleComponent);
      }
      var variantColumnHeaders = [
        "default",
        "hover",
        "focus",
        "pressed",
        "disabled",
        "loading"
      ];
      var shapeColumnHeaders = ["xs", "sm", "base", "lg"];
      var shapeColumnHeaderPositions = [];
      var shapeColumnXPositions = [];
      var yOffset = headerRowHeight;
      var variantRowCount = variants.length;
      var totalRows = variantRowCount + 3;
      var sectionGap = 60;
      var firstShapeRowIndex = variantRowCount;
      for (var i = 0; i < totalRows; i++) {
        var row = rowComponents.get(i) || [];
        var xOffset = labelColumnWidth;
        if (i === variantRowCount) {
          yOffset += sectionGap;
        }
        var labelText = rowLabelTexts.get(i);
        if (labelText && row.length > 0) {
          rowLabels.push({ y: yOffset, text: labelText });
        }
        if (i === 0) {
          for (var hi = 0; hi < variantColumnHeaders.length; hi++) {
            columnHeaders.push({
              x: xOffset + hi * (100 + componentGap),
              // Approximate width
              text: variantColumnHeaders[hi]
            });
          }
        }
        var isShapeRow = i >= firstShapeRowIndex;
        var isFirstShapeRow = i === firstShapeRowIndex;
        for (var j = 0; j < row.length; j++) {
          var comp = row[j];
          if (isShapeRow && !isFirstShapeRow && j < shapeColumnXPositions.length) {
            comp.x = shapeColumnXPositions[j];
          } else {
            comp.x = xOffset;
          }
          comp.y = yOffset;
          if (isFirstShapeRow && j < shapeColumnHeaders.length) {
            shapeColumnXPositions.push(xOffset);
            shapeColumnHeaderPositions.push({
              x: xOffset,
              text: shapeColumnHeaders[j]
            });
          }
          xOffset += comp.width + componentGap;
        }
        if (row.length > 0) {
          yOffset += rowGap;
        }
      }
      var firstRow = rowComponents.get(0) || [];
      if (firstRow.length > 0) {
        columnHeaders = [];
        var headerXOffset = labelColumnWidth;
        for (var chi = 0; chi < firstRow.length; chi++) {
          var headerComp = firstRow[chi];
          columnHeaders.push({
            x: headerXOffset,
            text: variantColumnHeaders[chi] || ""
          });
          headerXOffset += headerComp.width + componentGap;
        }
      }
      var shapeHeaderY = 0;
      var squareRow = rowComponents.get(variantRowCount) || [];
      if (squareRow.length > 0) {
        shapeHeaderY = squareRow[0].y - headerRowHeight - 8;
      }
      var componentSet = figma.combineAsVariants(components, page);
      componentSet.name = "Button";
      componentSet.description = "Button component with variant, size, shape, disabled, loading, and state properties";
      componentSet.layoutMode = "NONE";
      var contentWidth = componentSet.width + labelColumnWidth;
      var contentHeight = componentSet.height + headerRowHeight;
      var lightSection = createModeSection(page, "Button", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING3 * 2,
        contentHeight + SECTION_PADDING3 * 2
      );
      var darkSection = createModeSection(page, "Button", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING3 * 2,
        contentHeight + SECTION_PADDING3 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING3 + labelColumnWidth;
      componentSet.y = SECTION_PADDING3 + headerRowHeight;
      yield createColumnHeaders(
        columnHeaders.map(function(h) {
          return { x: h.x + SECTION_PADDING3, text: h.text };
        }),
        SECTION_PADDING3,
        lightSection.frame
      );
      if (shapeColumnHeaderPositions.length > 0 && shapeHeaderY > 0) {
        yield createColumnHeaders(
          shapeColumnHeaderPositions.map(function(h) {
            return { x: h.x + SECTION_PADDING3, text: h.text };
          }),
          SECTION_PADDING3 + shapeHeaderY,
          lightSection.frame
        );
      }
      for (var li = 0; li < rowLabels.length; li++) {
        var label = rowLabels[li];
        var labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING3,
          SECTION_PADDING3 + label.y + 12
          // +12 to vertically center with button
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (var k = 0; k < components.length; k++) {
        var origComp = components[k];
        var instance = origComp.createInstance();
        instance.x = origComp.x + SECTION_PADDING3 + labelColumnWidth;
        instance.y = origComp.y + SECTION_PADDING3 + headerRowHeight;
        darkSection.frame.appendChild(instance);
      }
      yield createColumnHeaders(
        columnHeaders.map(function(h) {
          return { x: h.x + SECTION_PADDING3, text: h.text };
        }),
        SECTION_PADDING3,
        darkSection.frame
      );
      if (shapeColumnHeaderPositions.length > 0 && shapeHeaderY > 0) {
        yield createColumnHeaders(
          shapeColumnHeaderPositions.map(function(h) {
            return { x: h.x + SECTION_PADDING3, text: h.text };
          }),
          SECTION_PADDING3 + shapeHeaderY,
          darkSection.frame
        );
      }
      for (var di = 0; di < rowLabels.length; di++) {
        var darkLabel = rowLabels[di];
        var darkLabelNode = yield createRowLabel(
          darkLabel.text,
          SECTION_PADDING3,
          SECTION_PADDING3 + darkLabel.y + 12
        );
        darkSection.frame.appendChild(darkLabelNode);
      }
      var totalWidth = contentWidth + SECTION_PADDING3 * 2;
      var totalHeight = contentHeight + SECTION_PADDING3 * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      console.log(
        "\u2705 Generated Button ComponentSet with " + components.length + " variants (light + dark)"
      );
      return startY + totalHeight + SECTION_GAP3;
    });
  }
  var BUTTON_VARIANTS_EXPORT = variantProp3.values;
  var BUTTON_SIZES_EXPORT = sizeProp.values;
  var BUTTON_SHAPES_EXPORT = shapeProp.values;

  // scripts/figma/plugin/generators/checkbox.ts
  var checkboxProps = component_registry_default.components.Checkbox.props;
  var variantProp4 = checkboxProps.variant;
  var CHECKBOX_BOX_SIZE = 16;
  var ICON_SIZE = 12;
  var CHECKBOX_LABEL_GAP = 8;
  var SECTION_PADDING4 = 48;
  var SECTION_GAP4 = 160;
  function createCheckboxBox(state, variant, _disabled) {
    const box = figma.createFrame();
    box.name = "Checkbox Box";
    box.resize(CHECKBOX_BOX_SIZE, CHECKBOX_BOX_SIZE);
    box.layoutMode = "HORIZONTAL";
    box.primaryAxisAlignItems = "CENTER";
    box.counterAxisAlignItems = "CENTER";
    box.primaryAxisSizingMode = "FIXED";
    box.counterAxisSizingMode = "FIXED";
    box.cornerRadius = BORDER_RADIUS.sm;
    const isActive = state === "checked" || state === "indeterminate";
    const bgVariable = isActive ? "color-surface-inverse" : "color-surface";
    const bgVar = getVariableByName(bgVariable);
    if (bgVar) {
      bindFillToVariable(box, bgVar.id);
    }
    const ringVariable = variant === "error" ? "color-error" : "color-border";
    const ringVar = getVariableByName(ringVariable);
    if (ringVar) {
      bindStrokeToVariable(box, ringVar.id, 1);
    }
    if (state === "indeterminate") {
      const minusIcon = createIconInstance("ph-minus", ICON_SIZE);
      if (minusIcon) {
        bindIconColor(minusIcon, "text-white");
        box.appendChild(minusIcon);
      }
    } else if (state === "checked") {
      const checkIcon = createIconInstance("ph-check", ICON_SIZE);
      if (checkIcon) {
        bindIconColor(checkIcon, "text-white");
        box.appendChild(checkIcon);
      }
    }
    return box;
  }
  function createCheckboxComponent(state, variant, disabled, labelText) {
    return __async(this, null, function* () {
      const component = figma.createComponent();
      component.name = `state=${state}, variant=${variant}, disabled=${disabled}`;
      const variantDesc = variantProp4.descriptions[variant] || "";
      component.description = variantDesc;
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisAlignItems = "MIN";
      component.counterAxisAlignItems = "CENTER";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.itemSpacing = CHECKBOX_LABEL_GAP;
      component.fills = [];
      const checkboxBox = createCheckboxBox(state, variant, disabled);
      component.appendChild(checkboxBox);
      const label = yield createTextNode(labelText, FONT_SIZE.base, 500);
      const textVar = getVariableByName("text-color-surface");
      if (textVar) {
        bindTextColorToVariable(label, textVar.id);
      }
      component.appendChild(label);
      if (disabled) {
        component.opacity = 0.5;
      }
      return component;
    });
  }
  function getCheckboxLabel() {
    return "Label";
  }
  function generateCheckboxComponents(page, startY = 100) {
    return __async(this, null, function* () {
      figma.currentPage = page;
      const states = ["unchecked", "checked", "indeterminate"];
      const components = [];
      const rowLabels = [];
      const componentGap = 24;
      const rowGap = 48;
      const headerRowHeight = 24;
      const labelColumnWidth = 180;
      const columnHeaderTexts = ["Unchecked", "Checked", "Indeterminate"];
      let currentY = headerRowHeight;
      rowLabels.push({ y: currentY, text: "variant=default" });
      let currentX = labelColumnWidth;
      for (const state of states) {
        const component = yield createCheckboxComponent(
          state,
          "default",
          false,
          getCheckboxLabel()
        );
        component.x = currentX;
        component.y = currentY;
        currentX += component.width + componentGap;
        components.push(component);
      }
      currentY += rowGap;
      rowLabels.push({ y: currentY, text: "variant=default, disabled=true" });
      currentX = labelColumnWidth;
      for (const state of states) {
        const component = yield createCheckboxComponent(
          state,
          "default",
          true,
          getCheckboxLabel()
        );
        component.x = currentX;
        component.y = currentY;
        currentX += component.width + componentGap;
        components.push(component);
      }
      currentY += rowGap;
      rowLabels.push({ y: currentY, text: "variant=error" });
      currentX = labelColumnWidth;
      for (const state of states) {
        const component = yield createCheckboxComponent(
          state,
          "error",
          false,
          getCheckboxLabel()
        );
        component.x = currentX;
        component.y = currentY;
        currentX += component.width + componentGap;
        components.push(component);
      }
      currentY += rowGap;
      rowLabels.push({ y: currentY, text: "variant=error, disabled=true" });
      currentX = labelColumnWidth;
      for (const state of states) {
        const component = yield createCheckboxComponent(
          state,
          "error",
          true,
          getCheckboxLabel()
        );
        component.x = currentX;
        component.y = currentY;
        currentX += component.width + componentGap;
        components.push(component);
      }
      const componentSet = figma.combineAsVariants(components, page);
      componentSet.name = "Checkbox";
      componentSet.description = "Checkbox component with state (unchecked/checked/indeterminate), variant (default/error), and disabled properties. Includes label text.";
      componentSet.layoutMode = "NONE";
      const contentWidth = componentSet.width + labelColumnWidth;
      const contentHeight = componentSet.height + headerRowHeight;
      const lightSection = createModeSection(page, "Checkbox", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING4 * 2,
        contentHeight + SECTION_PADDING4 * 2
      );
      const darkSection = createModeSection(page, "Checkbox", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING4 * 2,
        contentHeight + SECTION_PADDING4 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING4 + labelColumnWidth;
      componentSet.y = SECTION_PADDING4 + headerRowHeight;
      const columnHeaders = [];
      for (let i = 0; i < Math.min(3, components.length); i++) {
        columnHeaders.push({
          x: components[i].x + SECTION_PADDING4,
          text: columnHeaderTexts[i]
        });
      }
      yield createColumnHeaders(columnHeaders, SECTION_PADDING4, lightSection.frame);
      for (const label of rowLabels) {
        const labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING4,
          SECTION_PADDING4 + label.y + 4
          // +4 to vertically center with checkbox
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (const component of components) {
        const instance = component.createInstance();
        instance.x = component.x + SECTION_PADDING4 + labelColumnWidth;
        instance.y = component.y + SECTION_PADDING4 + headerRowHeight;
        darkSection.frame.appendChild(instance);
      }
      yield createColumnHeaders(columnHeaders, SECTION_PADDING4, darkSection.frame);
      for (const label of rowLabels) {
        const labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING4,
          SECTION_PADDING4 + label.y + 4
        );
        darkSection.frame.appendChild(labelNode);
      }
      const totalWidth = contentWidth + SECTION_PADDING4 * 2;
      const totalHeight = contentHeight + SECTION_PADDING4 * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      console.log(
        `\u2705 Generated Checkbox ComponentSet with ${components.length} variants (light + dark)`
      );
      return startY + totalHeight + SECTION_GAP4;
    });
  }
  var CHECKBOX_VARIANTS_EXPORT = variantProp4.values;

  // scripts/figma/plugin/generators/clipboard-text.ts
  var clipboardTextProps = component_registry_default.components.ClipboardText.props;
  var sizeProp2 = clipboardTextProps.size;
  var INPUT_BASE_STYLES = "bg-secondary text-surface ring ring-border";
  var CLIPBOARD_TEXT_BASE_STYLES = "bg-surface font-mono";
  var INPUT_SIZE_CLASSES = {
    xs: "h-5 gap-1 rounded-sm px-1.5 text-xs",
    sm: "h-6.5 gap-1 rounded-md px-2 text-xs",
    base: "h-9 gap-1.5 rounded-lg px-3 text-base",
    lg: "h-10 gap-2 rounded-lg px-4 text-base"
  };
  var SIZE_TO_BUTTON_SIZE = {
    sm: "sm",
    base: "base",
    lg: "lg"
  };
  var SECTION_PADDING5 = 48;
  var SECTION_GAP5 = 160;
  function createClipboardTextComponent(size) {
    return __async(this, null, function* () {
      const sizeClasses = sizeProp2.classes[size] || "";
      const description = sizeProp2.descriptions[size] || "";
      const buttonSize = SIZE_TO_BUTTON_SIZE[size] || "base";
      const inputSizeClasses = INPUT_SIZE_CLASSES[buttonSize] || INPUT_SIZE_CLASSES.base;
      const inputBaseStyles = parseTailwindClasses(INPUT_BASE_STYLES);
      const inputSizeStyles = parseTailwindClasses(inputSizeClasses);
      const clipboardStyles = parseTailwindClasses(CLIPBOARD_TEXT_BASE_STYLES);
      const textSizeStyles = parseTailwindClasses(sizeClasses);
      const component = figma.createComponent();
      component.name = "size=" + size;
      component.description = description;
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisAlignItems = "CENTER";
      component.counterAxisAlignItems = "CENTER";
      component.itemSpacing = 0;
      component.paddingLeft = 0;
      component.paddingRight = 0;
      component.paddingTop = 0;
      component.paddingBottom = 0;
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.cornerRadius = inputSizeStyles.borderRadius || 8;
      if (clipboardStyles.fillVariable) {
        const fillVar = getVariableByName(clipboardStyles.fillVariable);
        if (fillVar) {
          bindFillToVariable(component, fillVar.id);
        }
      } else if (inputBaseStyles.fillVariable) {
        const fillVar = getVariableByName(inputBaseStyles.fillVariable);
        if (fillVar) {
          bindFillToVariable(component, fillVar.id);
        }
      }
      if (inputBaseStyles.strokeVariable) {
        const strokeVar = getVariableByName(inputBaseStyles.strokeVariable);
        if (strokeVar) {
          bindStrokeToVariable(component, strokeVar.id, 1);
        }
      }
      const textFrame = figma.createFrame();
      textFrame.name = "TextContainer";
      textFrame.layoutMode = "HORIZONTAL";
      textFrame.primaryAxisAlignItems = "CENTER";
      textFrame.counterAxisAlignItems = "CENTER";
      textFrame.primaryAxisSizingMode = "AUTO";
      textFrame.counterAxisSizingMode = "FIXED";
      textFrame.fills = [];
      textFrame.paddingLeft = inputSizeStyles.paddingX || 16;
      textFrame.paddingRight = inputSizeStyles.paddingX || 16;
      const heights = {
        xs: 20,
        sm: 26,
        base: 36,
        lg: 40
      };
      textFrame.resize(100, heights[buttonSize] || 36);
      const fontSize = textSizeStyles.fontSize || inputSizeStyles.fontSize || 14;
      const textNode = figma.createText();
      yield figma.loadFontAsync({ family: "Roboto Mono", style: "Regular" });
      textNode.characters = "npm install @cloudflare/kumo";
      textNode.fontSize = fontSize;
      textNode.fontName = { family: "Roboto Mono", style: "Regular" };
      textNode.name = "Text";
      if (inputBaseStyles.textVariable) {
        const textVar = getVariableByName(inputBaseStyles.textVariable);
        if (textVar) {
          bindTextColorToVariable(textNode, textVar.id);
        }
      }
      textFrame.appendChild(textNode);
      component.appendChild(textFrame);
      const buttonFrame = figma.createFrame();
      buttonFrame.name = "CopyButton";
      buttonFrame.layoutMode = "HORIZONTAL";
      buttonFrame.primaryAxisAlignItems = "CENTER";
      buttonFrame.counterAxisAlignItems = "CENTER";
      buttonFrame.primaryAxisSizingMode = "FIXED";
      buttonFrame.counterAxisSizingMode = "FIXED";
      buttonFrame.fills = [];
      const buttonPadding = 12;
      buttonFrame.paddingLeft = buttonPadding;
      buttonFrame.paddingRight = buttonPadding;
      buttonFrame.resize(
        buttonPadding * 2 + 16,
        // padding + icon size
        heights[buttonSize] || 36
      );
      const borderColorVar = getVariableByName("color-color");
      if (borderColorVar) {
        buttonFrame.strokeLeftWeight = 1;
        buttonFrame.strokeTopWeight = 0;
        buttonFrame.strokeRightWeight = 0;
        buttonFrame.strokeBottomWeight = 0;
        buttonFrame.strokes = [
          {
            type: "SOLID",
            color: { r: 0.8, g: 0.8, b: 0.8 }
          }
        ];
        var stroke = {
          type: "SOLID",
          color: { r: 0.8, g: 0.8, b: 0.8 }
        };
        stroke = figma.variables.setBoundVariableForPaint(
          stroke,
          "color",
          borderColorVar
        );
        buttonFrame.strokes = [stroke];
      }
      const iconSize = 16;
      const iconInstance = createIconInstance("ph-clipboard", iconSize);
      if (iconInstance) {
        iconInstance.name = "Icon";
        bindIconColor(iconInstance, "text-color-surface");
        buttonFrame.appendChild(iconInstance);
      } else {
        const iconPlaceholder = figma.createRectangle();
        iconPlaceholder.name = "Icon (placeholder)";
        iconPlaceholder.resize(iconSize, iconSize);
        iconPlaceholder.cornerRadius = 2;
        iconPlaceholder.fills = [
          { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
        ];
        buttonFrame.appendChild(iconPlaceholder);
      }
      component.appendChild(buttonFrame);
      return component;
    });
  }
  function generateClipboardTextComponents(startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      let componentsPage = figma.root.children.find(function(page) {
        return page.type === "PAGE" && page.name === "Components";
      });
      if (!componentsPage) {
        componentsPage = figma.createPage();
        componentsPage.name = "Components";
      }
      figma.currentPage = componentsPage;
      const sizes = sizeProp2.values;
      const components = [];
      const rowLabels = [];
      const rowGap = 24;
      const labelColumnWidth = 140;
      let currentY = 0;
      for (let i = 0; i < sizes.length; i++) {
        const size = sizes[i];
        const component = yield createClipboardTextComponent(size);
        rowLabels.push({ y: currentY, text: "size=" + size });
        component.x = labelColumnWidth;
        component.y = currentY;
        currentY += component.height + rowGap;
        components.push(component);
      }
      const componentSet = figma.combineAsVariants(components, componentsPage);
      componentSet.name = "ClipboardText";
      componentSet.description = "ClipboardText component for displaying and copying text";
      const contentWidth = componentSet.width + labelColumnWidth;
      const contentHeight = componentSet.height;
      const lightSection = createModeSection(
        componentsPage,
        "ClipboardText",
        "light"
      );
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING5 * 2,
        contentHeight + SECTION_PADDING5 * 2
      );
      const darkSection = createModeSection(
        componentsPage,
        "ClipboardText",
        "dark"
      );
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING5 * 2,
        contentHeight + SECTION_PADDING5 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING5 + labelColumnWidth;
      componentSet.y = SECTION_PADDING5;
      for (const label of rowLabels) {
        const labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING5,
          SECTION_PADDING5 + label.y + 8
          // +8 to vertically center
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (const component of components) {
        const instance = component.createInstance();
        instance.x = component.x + SECTION_PADDING5 + labelColumnWidth;
        instance.y = component.y + SECTION_PADDING5;
        darkSection.frame.appendChild(instance);
      }
      for (const label of rowLabels) {
        const labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING5,
          SECTION_PADDING5 + label.y + 8
        );
        darkSection.frame.appendChild(labelNode);
      }
      const totalWidth = contentWidth + SECTION_PADDING5 * 2;
      const totalHeight = contentHeight + SECTION_PADDING5 * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      console.log(
        "\u2705 Generated ClipboardText ComponentSet with " + sizes.length + " sizes (light + dark)"
      );
      return startY + totalHeight + SECTION_GAP5;
    });
  }

  // scripts/figma/plugin/generators/code.ts
  var codeProps = component_registry_default.components.Code.props;
  var langProp = codeProps.lang;
  var SECTION_PADDING6 = 48;
  var SECTION_GAP6 = 160;
  function getPlaceholderText(lang) {
    if (lang === "bash") {
      return "npm install @cloudflare/kumo";
    }
    if (lang === "jsonc") {
      return '{ "key": "value" }';
    }
    if (lang === "css") {
      return ".class { color: blue; }";
    }
    if (lang === "tsx") {
      return "<Button>Click</Button>";
    }
    return 'const hello = "world";';
  }
  function createCodeComponent(lang) {
    return __async(this, null, function* () {
      var langDesc = langProp.descriptions[lang] || "";
      var component = figma.createComponent();
      component.name = "lang=" + lang;
      component.description = langDesc;
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisAlignItems = "MIN";
      component.counterAxisAlignItems = "MIN";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.fills = [];
      var fontSize = 14;
      var fontWeight = 400;
      var textNode = yield createTextNode(
        getPlaceholderText(lang),
        fontSize,
        fontWeight
      );
      textNode.name = "Text";
      yield figma.loadFontAsync({ family: "Roboto Mono", style: "Regular" });
      textNode.fontName = { family: "Roboto Mono", style: "Regular" };
      var labelVar = getVariableByName("text-color-label");
      if (labelVar) {
        bindTextColorToVariable(textNode, labelVar.id);
      } else {
        var surfaceVar = getVariableByName("text-color-surface");
        if (surfaceVar) {
          bindTextColorToVariable(textNode, surfaceVar.id);
        }
      }
      component.appendChild(textNode);
      return component;
    });
  }
  function generateCodeComponents(page, startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      figma.currentPage = page;
      var langs = langProp.values;
      var components = [];
      var rowLabels = [];
      var rowHeight = 40;
      var labelColumnWidth = 160;
      for (var i = 0; i < langs.length; i++) {
        var lang = langs[i];
        rowLabels.push({
          y: i * rowHeight,
          text: "lang=" + lang
        });
        var component = yield createCodeComponent(lang);
        component.x = labelColumnWidth;
        component.y = i * rowHeight;
        components.push(component);
      }
      var componentSet = figma.combineAsVariants(components, page);
      componentSet.name = "Code";
      componentSet.description = "Code component with lang property for displaying code snippets";
      componentSet.layoutMode = "NONE";
      var contentWidth = componentSet.width + labelColumnWidth;
      var contentHeight = componentSet.height;
      var lightSection = createModeSection(page, "Code", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING6 * 2,
        contentHeight + SECTION_PADDING6 * 2
      );
      var darkSection = createModeSection(page, "Code", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING6 * 2,
        contentHeight + SECTION_PADDING6 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING6 + labelColumnWidth;
      componentSet.y = SECTION_PADDING6;
      for (var li = 0; li < rowLabels.length; li++) {
        var label = rowLabels[li];
        var labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING6,
          SECTION_PADDING6 + label.y + 8
          // +8 to vertically center with text
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (var ci = 0; ci < components.length; ci++) {
        var comp = components[ci];
        var instance = comp.createInstance();
        instance.x = comp.x + SECTION_PADDING6 + labelColumnWidth;
        instance.y = comp.y + SECTION_PADDING6;
        darkSection.frame.appendChild(instance);
      }
      for (var di = 0; di < rowLabels.length; di++) {
        var darkLabel = rowLabels[di];
        var darkLabelNode = yield createRowLabel(
          darkLabel.text,
          SECTION_PADDING6,
          SECTION_PADDING6 + darkLabel.y + 8
        );
        darkSection.frame.appendChild(darkLabelNode);
      }
      var totalWidth = contentWidth + SECTION_PADDING6 * 2;
      var totalHeight = contentHeight + SECTION_PADDING6 * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      console.log(
        "\u2705 Generated Code ComponentSet with " + components.length + " variants (light + dark)"
      );
      return startY + totalHeight + SECTION_GAP6;
    });
  }
  var CODE_LANGS_EXPORT = langProp.values;

  // scripts/figma/plugin/generators/code-block.ts
  var codeProps2 = component_registry_default.components.Code.props;
  var langProp2 = codeProps2.lang;
  var CODE_BLOCK_WRAPPER_STYLES = "min-w-0 rounded-md border border-color bg-surface";
  var CODE_INNER_PADDING = 10;
  var SECTION_PADDING7 = 48;
  var SECTION_GAP7 = 160;
  function getPlaceholderText2(lang) {
    if (lang === "bash") {
      return "npm install @cloudflare/kumo";
    }
    if (lang === "jsonc") {
      return '{ "key": "value" }';
    }
    if (lang === "css") {
      return ".class { color: blue; }";
    }
    if (lang === "tsx") {
      return "<Button>Click</Button>";
    }
    return 'const hello = "world";';
  }
  function createCodeBlockComponent(lang) {
    return __async(this, null, function* () {
      var description = langProp2.descriptions[lang] || "";
      var wrapperStyles = parseTailwindClasses(CODE_BLOCK_WRAPPER_STYLES);
      var component = figma.createComponent();
      component.name = "lang=" + lang;
      component.description = description;
      component.layoutMode = "VERTICAL";
      component.primaryAxisAlignItems = "MIN";
      component.counterAxisAlignItems = "MIN";
      component.paddingLeft = CODE_INNER_PADDING;
      component.paddingRight = CODE_INNER_PADDING;
      component.paddingTop = CODE_INNER_PADDING;
      component.paddingBottom = CODE_INNER_PADDING;
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.cornerRadius = wrapperStyles.borderRadius || 6;
      if (wrapperStyles.fillVariable) {
        var fillVar = getVariableByName(wrapperStyles.fillVariable);
        if (fillVar) {
          bindFillToVariable(component, fillVar.id);
        }
      }
      if (wrapperStyles.strokeVariable) {
        var strokeVar = getVariableByName(wrapperStyles.strokeVariable);
        if (strokeVar) {
          bindStrokeToVariable(component, strokeVar.id, 1);
        }
      }
      var textNode = yield createTextNode(getPlaceholderText2(lang), 14, 400);
      textNode.name = "Code";
      yield figma.loadFontAsync({ family: "Roboto Mono", style: "Regular" });
      textNode.fontName = { family: "Roboto Mono", style: "Regular" };
      var labelVar = getVariableByName("text-color-label");
      if (labelVar) {
        bindTextColorToVariable(textNode, labelVar.id);
      } else {
        var surfaceVar = getVariableByName("text-color-surface");
        if (surfaceVar) {
          bindTextColorToVariable(textNode, surfaceVar.id);
        }
      }
      textNode.lineHeight = { value: 20, unit: "PIXELS" };
      component.appendChild(textNode);
      return component;
    });
  }
  function generateCodeBlockComponents(page, startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      figma.currentPage = page;
      var langs = langProp2.values;
      var components = [];
      var rowLabels = [];
      var rowGap = 50;
      var labelColumnWidth = 160;
      var currentY = 0;
      for (var i = 0; i < langs.length; i++) {
        var lang = langs[i];
        var component = yield createCodeBlockComponent(lang);
        rowLabels.push({ y: currentY, text: "lang=" + lang });
        component.x = labelColumnWidth;
        component.y = currentY;
        currentY = currentY + component.height + rowGap;
        components.push(component);
      }
      var componentSet = figma.combineAsVariants(components, page);
      componentSet.name = "CodeBlock";
      componentSet.description = "CodeBlock component with lang variants";
      componentSet.layoutMode = "NONE";
      var contentWidth = componentSet.width + labelColumnWidth;
      var contentHeight = componentSet.height;
      var lightSection = createModeSection(page, "CodeBlock", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING7 * 2,
        contentHeight + SECTION_PADDING7 * 2
      );
      var darkSection = createModeSection(page, "CodeBlock", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING7 * 2,
        contentHeight + SECTION_PADDING7 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING7 + labelColumnWidth;
      componentSet.y = SECTION_PADDING7;
      for (var li = 0; li < rowLabels.length; li++) {
        var label = rowLabels[li];
        var labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING7,
          SECTION_PADDING7 + label.y + 8
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (var ci = 0; ci < components.length; ci++) {
        var comp = components[ci];
        var instance = comp.createInstance();
        instance.x = comp.x + SECTION_PADDING7 + labelColumnWidth;
        instance.y = comp.y + SECTION_PADDING7;
        darkSection.frame.appendChild(instance);
      }
      for (var di = 0; di < rowLabels.length; di++) {
        var darkLabel = rowLabels[di];
        var darkLabelNode = yield createRowLabel(
          darkLabel.text,
          SECTION_PADDING7,
          SECTION_PADDING7 + darkLabel.y + 8
        );
        darkSection.frame.appendChild(darkLabelNode);
      }
      var totalWidth = contentWidth + SECTION_PADDING7 * 2;
      var totalHeight = contentHeight + SECTION_PADDING7 * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      console.log(
        "\u2705 Generated CodeBlock ComponentSet with " + langs.length + " variants (light + dark)"
      );
      return startY + totalHeight + SECTION_GAP7;
    });
  }

  // scripts/figma/plugin/generators/collapsible.ts
  var TRIGGER_BASE_STYLES = "flex items-center gap-1 text-sm text-info";
  var CONTENT_PANEL_STYLES = "my-2 border-l-2 border-color pl-4";
  var SECTION_PADDING8 = 48;
  var SECTION_GAP8 = 160;
  var OPEN_VALUES = [false, true];
  var STATE_VALUES = ["default", "hover", "focus", "disabled"];
  var STATE_STYLES2 = {
    default: {
      textVariable: "text-color-info"
    },
    hover: {
      textVariable: "text-color-info"
      // Could add underline or different color on hover
    },
    focus: {
      textVariable: "text-color-info",
      addRing: true
    },
    disabled: {
      textVariable: "text-color-disabled",
      opacity: 0.5
    }
  };
  function createCollapsibleComponent(open, state) {
    return __async(this, null, function* () {
      var triggerStyles = parseTailwindClasses(TRIGGER_BASE_STYLES);
      var contentStyles = parseTailwindClasses(CONTENT_PANEL_STYLES);
      var component = figma.createComponent();
      component.name = "open=" + open + ", state=" + state;
      component.description = "Collapsible " + (open ? "expanded" : "collapsed") + " in " + state + " state";
      component.layoutMode = "VERTICAL";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.itemSpacing = 8;
      component.fills = [];
      var stateStyle = STATE_STYLES2[state] || STATE_STYLES2["default"];
      if (stateStyle.opacity !== void 0) {
        component.opacity = stateStyle.opacity;
      }
      var trigger = figma.createFrame();
      trigger.name = "Trigger";
      trigger.layoutMode = "HORIZONTAL";
      trigger.primaryAxisAlignItems = "CENTER";
      trigger.counterAxisAlignItems = "CENTER";
      trigger.primaryAxisSizingMode = "AUTO";
      trigger.counterAxisSizingMode = "AUTO";
      trigger.itemSpacing = triggerStyles.gap || 4;
      trigger.fills = [];
      trigger.paddingTop = 4;
      trigger.paddingBottom = 4;
      trigger.paddingLeft = 4;
      trigger.paddingRight = 4;
      trigger.cornerRadius = BORDER_RADIUS.sm;
      if (stateStyle.addRing) {
        var ringVar = getVariableByName("color-active");
        if (ringVar) {
          bindStrokeToVariable(trigger, ringVar.id, 2);
        }
      }
      var labelText = yield createTextNode(
        "Click to expand",
        triggerStyles.fontSize || 14,
        400
      );
      labelText.name = "Label";
      var textVar = getVariableByName(stateStyle.textVariable || "text-color-info");
      if (textVar) {
        bindTextColorToVariable(labelText, textVar.id);
      }
      trigger.appendChild(labelText);
      var chevronIconName = "ph-caret-down";
      var chevron = getButtonIcon(chevronIconName, "sm");
      chevron.name = "Chevron";
      if (open) {
        chevron.rotation = 180;
      }
      var iconColorToken = state === "disabled" ? "text-disabled" : "text-info";
      bindIconColor(chevron, iconColorToken);
      trigger.appendChild(chevron);
      component.appendChild(trigger);
      if (open) {
        var contentPanel = figma.createFrame();
        contentPanel.name = "Content";
        contentPanel.layoutMode = "VERTICAL";
        contentPanel.primaryAxisSizingMode = "AUTO";
        contentPanel.counterAxisSizingMode = "AUTO";
        contentPanel.itemSpacing = 16;
        contentPanel.paddingLeft = contentStyles.paddingX || 16;
        contentPanel.paddingTop = 8;
        contentPanel.paddingBottom = 8;
        contentPanel.fills = [];
        var borderVar = getVariableByName("color-border");
        if (borderVar) {
          bindStrokeToVariable(contentPanel, borderVar.id, 2);
          contentPanel.strokeLeftWeight = 2;
          contentPanel.strokeTopWeight = 0;
          contentPanel.strokeRightWeight = 0;
          contentPanel.strokeBottomWeight = 0;
        }
        var contentText = yield createTextNode(
          "This is the collapsible content that can be shown or hidden.",
          14,
          400
        );
        contentText.name = "Content Text";
        contentText.layoutSizingHorizontal = "FIXED";
        contentText.resize(280, contentText.height);
        contentText.textAutoResize = "HEIGHT";
        var contentTextVar = getVariableByName("text-color-surface");
        if (contentTextVar) {
          bindTextColorToVariable(contentText, contentTextVar.id);
        }
        contentPanel.appendChild(contentText);
        component.appendChild(contentPanel);
      }
      return component;
    });
  }
  function generateCollapsibleComponents(startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      var componentsPage = figma.root.children.find(function(page) {
        return page.type === "PAGE" && page.name === "Components";
      });
      if (!componentsPage) {
        componentsPage = figma.createPage();
        componentsPage.name = "Components";
      }
      figma.currentPage = componentsPage;
      var components = [];
      var rowLabels = [];
      var columnHeaders = [];
      var componentGapX = 24;
      var componentGapY = 40;
      var headerRowHeight = 24;
      var labelColumnWidth = 120;
      var rowComponents = /* @__PURE__ */ new Map();
      for (var oi = 0; oi < OPEN_VALUES.length; oi++) {
        var open = OPEN_VALUES[oi];
        rowComponents.set(oi, []);
        for (var si = 0; si < STATE_VALUES.length; si++) {
          var state = STATE_VALUES[si];
          var component = yield createCollapsibleComponent(open, state);
          rowComponents.get(oi).push(component);
          components.push(component);
        }
      }
      var columnWidths = [];
      var rowHeights = [];
      for (var colIdx = 0; colIdx < STATE_VALUES.length; colIdx++) {
        var maxColWidth = 0;
        for (var rowIdx = 0; rowIdx < OPEN_VALUES.length; rowIdx++) {
          var row = rowComponents.get(rowIdx) || [];
          var comp = row[colIdx];
          if (comp && comp.width > maxColWidth) {
            maxColWidth = comp.width;
          }
        }
        columnWidths.push(maxColWidth);
      }
      for (var rowIdx = 0; rowIdx < OPEN_VALUES.length; rowIdx++) {
        var row = rowComponents.get(rowIdx) || [];
        var maxRowHeight = 0;
        for (var colIdx = 0; colIdx < row.length; colIdx++) {
          var comp = row[colIdx];
          if (comp && comp.height > maxRowHeight) {
            maxRowHeight = comp.height;
          }
        }
        rowHeights.push(maxRowHeight);
      }
      var yOffset = headerRowHeight;
      for (var rowIdx = 0; rowIdx < OPEN_VALUES.length; rowIdx++) {
        var row = rowComponents.get(rowIdx) || [];
        var xOffset = labelColumnWidth;
        var openValue = OPEN_VALUES[rowIdx];
        rowLabels.push({
          y: yOffset,
          text: "open=" + openValue
        });
        for (var colIdx = 0; colIdx < row.length; colIdx++) {
          var comp = row[colIdx];
          comp.x = xOffset;
          comp.y = yOffset;
          if (rowIdx === 0) {
            columnHeaders.push({
              x: xOffset,
              text: "state=" + STATE_VALUES[colIdx]
            });
          }
          xOffset += columnWidths[colIdx] + componentGapX;
        }
        yOffset += rowHeights[rowIdx] + componentGapY;
      }
      var componentSet = figma.combineAsVariants(components, componentsPage);
      componentSet.name = "Collapsible";
      componentSet.description = "Collapsible component with open and state properties. Use to show/hide content with an animated chevron indicator.";
      componentSet.layoutMode = "NONE";
      var contentWidth = componentSet.width + labelColumnWidth;
      var contentHeight = componentSet.height + headerRowHeight;
      var lightSection = createModeSection(componentsPage, "Collapsible", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING8 * 2,
        contentHeight + SECTION_PADDING8 * 2
      );
      var darkSection = createModeSection(componentsPage, "Collapsible", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING8 * 2,
        contentHeight + SECTION_PADDING8 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING8 + labelColumnWidth;
      componentSet.y = SECTION_PADDING8 + headerRowHeight;
      yield createColumnHeaders(
        columnHeaders.map(function(h) {
          return { x: h.x + SECTION_PADDING8, text: h.text };
        }),
        SECTION_PADDING8,
        lightSection.frame
      );
      for (var li = 0; li < rowLabels.length; li++) {
        var label = rowLabels[li];
        var labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING8,
          SECTION_PADDING8 + label.y + 8
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (var k = 0; k < components.length; k++) {
        var origComp = components[k];
        var instance = origComp.createInstance();
        instance.x = origComp.x + SECTION_PADDING8 + labelColumnWidth;
        instance.y = origComp.y + SECTION_PADDING8 + headerRowHeight;
        darkSection.frame.appendChild(instance);
      }
      yield createColumnHeaders(
        columnHeaders.map(function(h) {
          return { x: h.x + SECTION_PADDING8, text: h.text };
        }),
        SECTION_PADDING8,
        darkSection.frame
      );
      for (var di = 0; di < rowLabels.length; di++) {
        var darkLabel = rowLabels[di];
        var darkLabelNode = yield createRowLabel(
          darkLabel.text,
          SECTION_PADDING8,
          SECTION_PADDING8 + darkLabel.y + 8
        );
        darkSection.frame.appendChild(darkLabelNode);
      }
      var totalWidth = contentWidth + SECTION_PADDING8 * 2;
      var totalHeight = contentHeight + SECTION_PADDING8 * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      console.log(
        "\u2705 Generated Collapsible ComponentSet with " + components.length + " variants (light + dark)"
      );
      return startY + totalHeight + SECTION_GAP8;
    });
  }

  // scripts/figma/plugin/generators/combobox.ts
  var TRIGGER_BASE_STYLES2 = "bg-secondary ring ring-border rounded-lg";
  var DROPDOWN_PANEL_STYLES = "bg-surface border border-border";
  var SECTION_PADDING9 = 48;
  var SECTION_GAP9 = 160;
  var VARIANT_VALUES = ["default", "withLabel", "withError"];
  var OPEN_VALUES2 = [false, true];
  var STATE_VALUES2 = ["default", "focus", "disabled"];
  var STATE_STYLES3 = {
    default: {
      ringVariable: "color-border"
    },
    focus: {
      ringVariable: "color-active"
    },
    disabled: {
      ringVariable: "color-border",
      opacity: 0.5
    }
  };
  var VARIANT_CONFIG = {
    default: {},
    withLabel: {
      label: "Country",
      description: "Select your country of residence"
    },
    withError: {
      label: "Subscription Plan",
      errorMessage: "Please select a plan to continue",
      useErrorRing: true
    }
  };
  function createComboboxComponent(variant, open, state) {
    return __async(this, null, function* () {
      var _triggerStyles = parseTailwindClasses(TRIGGER_BASE_STYLES2);
      var _dropdownStyles = parseTailwindClasses(DROPDOWN_PANEL_STYLES);
      var variantConfig = VARIANT_CONFIG[variant] || VARIANT_CONFIG["default"];
      var component = figma.createComponent();
      component.name = "variant=" + variant + ", open=" + open + ", state=" + state;
      component.description = "Combobox " + variant + " " + (open ? "open" : "closed") + " in " + state + " state";
      component.layoutMode = "VERTICAL";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.counterAxisAlignItems = "MIN";
      component.itemSpacing = 4;
      component.fills = [];
      var stateStyle = STATE_STYLES3[state] || STATE_STYLES3["default"];
      if (stateStyle.opacity !== void 0) {
        component.opacity = stateStyle.opacity;
      }
      if (variantConfig.label) {
        var labelText = yield createTextNode(variantConfig.label, 14, 500);
        labelText.name = "Label";
        labelText.textAutoResize = "WIDTH_AND_HEIGHT";
        var labelVar = getVariableByName("text-color-label");
        if (labelVar) {
          bindTextColorToVariable(labelText, labelVar.id);
        }
        component.appendChild(labelText);
      }
      var trigger = figma.createFrame();
      trigger.name = "TriggerInput";
      trigger.layoutMode = "HORIZONTAL";
      trigger.primaryAxisAlignItems = "SPACE_BETWEEN";
      trigger.counterAxisAlignItems = "CENTER";
      trigger.primaryAxisSizingMode = "FIXED";
      trigger.counterAxisSizingMode = "FIXED";
      trigger.resize(280, 36);
      trigger.itemSpacing = 8;
      trigger.paddingLeft = 12;
      trigger.paddingRight = 12;
      trigger.paddingTop = 0;
      trigger.paddingBottom = 0;
      trigger.cornerRadius = BORDER_RADIUS.lg;
      var bgVar = getVariableByName("color-secondary");
      if (bgVar) {
        bindFillToVariable(trigger, bgVar.id);
      }
      var ringVarName = variantConfig.useErrorRing ? "color-error" : stateStyle.ringVariable || "color-border";
      var ringVar = getVariableByName(ringVarName);
      if (ringVar) {
        bindStrokeToVariable(trigger, ringVar.id, 1);
      }
      var placeholderText = yield createTextNode("Select item...", 16, 400);
      placeholderText.name = "Placeholder";
      placeholderText.textAutoResize = "WIDTH_AND_HEIGHT";
      var mutedVar = getVariableByName("text-color-muted");
      if (mutedVar) {
        bindTextColorToVariable(placeholderText, mutedVar.id);
      }
      trigger.appendChild(placeholderText);
      var chevronIconName = "ph-caret-down";
      var chevron = getButtonIcon(chevronIconName, "sm");
      chevron.name = "Chevron";
      if (open) {
        chevron.rotation = 180;
      }
      var iconColorToken = state === "disabled" ? "text-disabled" : "text-surface";
      bindIconColor(chevron, iconColorToken);
      trigger.appendChild(chevron);
      component.appendChild(trigger);
      if (variantConfig.description) {
        var descText = yield createTextNode(variantConfig.description, 12, 400);
        descText.name = "Description";
        descText.textAutoResize = "WIDTH_AND_HEIGHT";
        var descVar = getVariableByName("text-color-muted");
        if (descVar) {
          bindTextColorToVariable(descText, descVar.id);
        }
        component.appendChild(descText);
      }
      if (variantConfig.errorMessage) {
        var errorText = yield createTextNode(variantConfig.errorMessage, 12, 400);
        errorText.name = "Error";
        errorText.textAutoResize = "WIDTH_AND_HEIGHT";
        var errorVar = getVariableByName("text-color-error");
        if (errorVar) {
          bindTextColorToVariable(errorText, errorVar.id);
        }
        component.appendChild(errorText);
      }
      if (open) {
        var dropdownPanel = figma.createFrame();
        dropdownPanel.name = "Dropdown";
        dropdownPanel.layoutMode = "VERTICAL";
        dropdownPanel.primaryAxisSizingMode = "FIXED";
        dropdownPanel.counterAxisSizingMode = "AUTO";
        dropdownPanel.resize(280, 120);
        dropdownPanel.itemSpacing = 0;
        dropdownPanel.paddingLeft = 0;
        dropdownPanel.paddingRight = 0;
        dropdownPanel.paddingTop = 4;
        dropdownPanel.paddingBottom = 4;
        dropdownPanel.cornerRadius = BORDER_RADIUS.lg;
        var dropdownBgVar = getVariableByName("color-secondary");
        if (dropdownBgVar) {
          bindFillToVariable(dropdownPanel, dropdownBgVar.id);
        }
        var borderVar = getVariableByName("color-border");
        if (borderVar) {
          bindStrokeToVariable(dropdownPanel, borderVar.id, 1);
        }
        var itemLabels = ["Option 1", "Option 2", "Option 3"];
        for (var i = 0; i < itemLabels.length; i++) {
          var itemFrame = figma.createFrame();
          itemFrame.name = "Item " + (i + 1);
          itemFrame.layoutMode = "HORIZONTAL";
          itemFrame.primaryAxisAlignItems = "MIN";
          itemFrame.counterAxisAlignItems = "CENTER";
          itemFrame.primaryAxisSizingMode = "FIXED";
          itemFrame.counterAxisSizingMode = "AUTO";
          itemFrame.resize(280, 32);
          itemFrame.itemSpacing = 8;
          itemFrame.paddingLeft = 12;
          itemFrame.paddingRight = 12;
          itemFrame.paddingTop = 8;
          itemFrame.paddingBottom = 8;
          itemFrame.fills = [];
          if (i === 1) {
            var accentVar = getVariableByName("color-color-3");
            if (accentVar) {
              bindFillToVariable(itemFrame, accentVar.id);
            }
          }
          var itemText = yield createTextNode(itemLabels[i], 14, 400);
          itemText.name = "Label";
          itemText.textAutoResize = "WIDTH_AND_HEIGHT";
          var textVar = getVariableByName("text-color-surface");
          if (textVar) {
            bindTextColorToVariable(itemText, textVar.id);
          }
          itemFrame.appendChild(itemText);
          dropdownPanel.appendChild(itemFrame);
        }
        component.appendChild(dropdownPanel);
      }
      return component;
    });
  }
  function generateComboboxComponents(startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      var componentsPage = figma.root.children.find(function(page) {
        return page.type === "PAGE" && page.name === "Components";
      });
      if (!componentsPage) {
        componentsPage = figma.createPage();
        componentsPage.name = "Components";
      }
      figma.currentPage = componentsPage;
      var components = [];
      var rowLabels = [];
      var columnHeaders = [];
      var componentGapX = 24;
      var componentGapY = 40;
      var headerRowHeight = 24;
      var labelColumnWidth = 150;
      var rowComponents = /* @__PURE__ */ new Map();
      for (var vi = 0; vi < VARIANT_VALUES.length; vi++) {
        var variant = VARIANT_VALUES[vi];
        rowComponents.set(vi, []);
        for (var oi = 0; oi < OPEN_VALUES2.length; oi++) {
          var open = OPEN_VALUES2[oi];
          for (var si = 0; si < STATE_VALUES2.length; si++) {
            var state = STATE_VALUES2[si];
            var component = yield createComboboxComponent(variant, open, state);
            rowComponents.get(vi).push(component);
            components.push(component);
          }
        }
      }
      var columnWidths = [];
      var rowHeights = [];
      var numColumns = OPEN_VALUES2.length * STATE_VALUES2.length;
      for (var colIdx = 0; colIdx < numColumns; colIdx++) {
        var maxColWidth = 0;
        for (var rowIdx = 0; rowIdx < VARIANT_VALUES.length; rowIdx++) {
          var row = rowComponents.get(rowIdx) || [];
          var comp = row[colIdx];
          if (comp && comp.width > maxColWidth) {
            maxColWidth = comp.width;
          }
        }
        columnWidths.push(maxColWidth);
      }
      for (var rowIdx = 0; rowIdx < VARIANT_VALUES.length; rowIdx++) {
        var row = rowComponents.get(rowIdx) || [];
        var maxRowHeight = 0;
        for (var colIdx = 0; colIdx < row.length; colIdx++) {
          var comp = row[colIdx];
          if (comp && comp.height > maxRowHeight) {
            maxRowHeight = comp.height;
          }
        }
        rowHeights.push(maxRowHeight);
      }
      var yOffset = headerRowHeight;
      for (var rowIdx = 0; rowIdx < VARIANT_VALUES.length; rowIdx++) {
        var row = rowComponents.get(rowIdx) || [];
        var xOffset = labelColumnWidth;
        var variantValue = VARIANT_VALUES[rowIdx];
        rowLabels.push({
          y: yOffset,
          text: "variant=" + variantValue
        });
        for (var colIdx = 0; colIdx < row.length; colIdx++) {
          var comp = row[colIdx];
          comp.x = xOffset;
          comp.y = yOffset;
          if (rowIdx === 0) {
            var openIdx = Math.floor(colIdx / STATE_VALUES2.length);
            var stateIdx = colIdx % STATE_VALUES2.length;
            var openVal = OPEN_VALUES2[openIdx];
            var stateVal = STATE_VALUES2[stateIdx];
            columnHeaders.push({
              x: xOffset,
              text: "open=" + openVal + ", state=" + stateVal
            });
          }
          xOffset += columnWidths[colIdx] + componentGapX;
        }
        yOffset += rowHeights[rowIdx] + componentGapY;
      }
      var componentSet = figma.combineAsVariants(components, componentsPage);
      componentSet.name = "Combobox";
      componentSet.description = "Combobox component with variant, open, and state properties. Use for searchable select dropdowns with filtering.";
      componentSet.layoutMode = "NONE";
      var contentWidth = componentSet.width + labelColumnWidth;
      var contentHeight = componentSet.height + headerRowHeight;
      var lightSection = createModeSection(componentsPage, "Combobox", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING9 * 2,
        contentHeight + SECTION_PADDING9 * 2
      );
      var darkSection = createModeSection(componentsPage, "Combobox", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING9 * 2,
        contentHeight + SECTION_PADDING9 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING9 + labelColumnWidth;
      componentSet.y = SECTION_PADDING9 + headerRowHeight;
      yield createColumnHeaders(
        columnHeaders.map(function(h) {
          return { x: h.x + SECTION_PADDING9, text: h.text };
        }),
        SECTION_PADDING9,
        lightSection.frame
      );
      for (var li = 0; li < rowLabels.length; li++) {
        var label = rowLabels[li];
        var labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING9,
          SECTION_PADDING9 + label.y + 8
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (var k = 0; k < components.length; k++) {
        var origComp = components[k];
        var instance = origComp.createInstance();
        instance.x = origComp.x + SECTION_PADDING9 + labelColumnWidth;
        instance.y = origComp.y + SECTION_PADDING9 + headerRowHeight;
        darkSection.frame.appendChild(instance);
      }
      yield createColumnHeaders(
        columnHeaders.map(function(h) {
          return { x: h.x + SECTION_PADDING9, text: h.text };
        }),
        SECTION_PADDING9,
        darkSection.frame
      );
      for (var di = 0; di < rowLabels.length; di++) {
        var darkLabel = rowLabels[di];
        var darkLabelNode = yield createRowLabel(
          darkLabel.text,
          SECTION_PADDING9,
          SECTION_PADDING9 + darkLabel.y + 8
        );
        darkSection.frame.appendChild(darkLabelNode);
      }
      var totalWidth = contentWidth + SECTION_PADDING9 * 2;
      var totalHeight = contentHeight + SECTION_PADDING9 * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      console.log(
        "\u2705 Generated Combobox ComponentSet with " + components.length + " variants (light + dark)"
      );
      return startY + totalHeight + SECTION_GAP9;
    });
  }

  // scripts/figma/plugin/generators/date-range-picker.ts
  var SECTION_PADDING10 = 48;
  var SECTION_GAP10 = 160;
  var VARIANT_VALUES2 = ["default", "subtle"];
  var SELECTED_VALUES = [false, true];
  var SIZE_CONFIG = {
    sm: {
      calendarWidth: 168,
      cellHeight: 22,
      cellWidth: 24,
      textSize: 12,
      iconSize: 14,
      padding: 12,
      gap: 8
    },
    base: {
      calendarWidth: 196,
      cellHeight: 26,
      cellWidth: 28,
      textSize: 14,
      iconSize: 16,
      padding: 16,
      gap: 10
    },
    lg: {
      calendarWidth: 252,
      cellHeight: 32,
      cellWidth: 36,
      textSize: 16,
      iconSize: 18,
      padding: 20,
      gap: 12
    }
  };
  var VARIANT_CONFIG2 = {
    default: { bgVariable: "color-calendar" },
    subtle: { bgVariable: "color-surface" }
  };
  var DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  function createDayHeaders(size, sizeConfig) {
    return __async(this, null, function* () {
      var headerRow = figma.createFrame();
      headerRow.name = "Day Headers";
      headerRow.layoutMode = "HORIZONTAL";
      headerRow.primaryAxisSizingMode = "AUTO";
      headerRow.counterAxisSizingMode = "AUTO";
      headerRow.itemSpacing = 4;
      headerRow.fills = [];
      for (var i = 0; i < DAYS_OF_WEEK.length; i++) {
        var dayLabel = yield createTextNode(
          DAYS_OF_WEEK[i],
          sizeConfig.textSize,
          400
        );
        dayLabel.name = DAYS_OF_WEEK[i];
        dayLabel.textAlignHorizontal = "CENTER";
        dayLabel.resize(sizeConfig.cellWidth, 22);
        var mutedVar = getVariableByName("text-color-muted");
        if (mutedVar) {
          bindTextColorToVariable(dayLabel, mutedVar.id);
        }
        headerRow.appendChild(dayLabel);
      }
      return headerRow;
    });
  }
  function createDayCell(dayNumber, mode, sizeConfig) {
    return __async(this, null, function* () {
      var cell = figma.createFrame();
      cell.name = "Day " + dayNumber;
      cell.layoutMode = "HORIZONTAL";
      cell.primaryAxisAlignItems = "CENTER";
      cell.counterAxisAlignItems = "CENTER";
      cell.primaryAxisSizingMode = "FIXED";
      cell.counterAxisSizingMode = "FIXED";
      cell.resize(sizeConfig.cellWidth, sizeConfig.cellHeight);
      cell.fills = [];
      if (mode === "selected") {
        var selectedVar = getVariableByName("color-calendar-day-range-selected");
        if (selectedVar) {
          bindFillToVariable(cell, selectedVar.id);
        }
      } else if (mode === "start" || mode === "end") {
        var endpointVar = getVariableByName(
          "color-calendar-day-range-selected-endpoints"
        );
        if (endpointVar) {
          bindFillToVariable(cell, endpointVar.id);
        }
        if (mode === "start") {
          cell.topLeftRadius = 5;
          cell.bottomLeftRadius = 5;
        } else {
          cell.topRightRadius = 5;
          cell.bottomRightRadius = 5;
        }
      }
      var dayText = yield createTextNode(
        String(dayNumber),
        sizeConfig.textSize,
        400
      );
      dayText.name = "Day Number";
      dayText.textAlignHorizontal = "CENTER";
      if (mode === "start" || mode === "end") {
        var inverseVar = getVariableByName("text-color-surface-inverse");
        if (inverseVar) {
          bindTextColorToVariable(dayText, inverseVar.id);
        }
      } else if (mode === "outOfRange") {
        var labelVar = getVariableByName("text-color-label");
        if (labelVar) {
          bindTextColorToVariable(dayText, labelVar.id);
        }
      } else {
        var surfaceVar = getVariableByName("text-color-surface");
        if (surfaceVar) {
          bindTextColorToVariable(dayText, surfaceVar.id);
        }
      }
      cell.appendChild(dayText);
      return cell;
    });
  }
  var MONTH_CONFIG = {
    December: { startDay: 1, daysInMonth: 31, prevMonthDays: 30 },
    // Mon, Nov has 30
    January: { startDay: 4, daysInMonth: 31, prevMonthDays: 31 }
    // Thu, Dec has 31
  };
  function createCalendarGrid(monthName, selected, sizeConfig) {
    return __async(this, null, function* () {
      var grid = figma.createFrame();
      grid.name = "Calendar Grid";
      grid.layoutMode = "VERTICAL";
      grid.primaryAxisSizingMode = "AUTO";
      grid.counterAxisSizingMode = "AUTO";
      grid.itemSpacing = 2;
      grid.fills = [];
      var config = MONTH_CONFIG[monthName] || MONTH_CONFIG["January"];
      var startDay = config.startDay;
      var daysInMonth = config.daysInMonth;
      var prevMonthDays = config.prevMonthDays;
      for (var row = 0; row < 6; row++) {
        var rowFrame = figma.createFrame();
        rowFrame.name = "Row " + (row + 1);
        rowFrame.layoutMode = "HORIZONTAL";
        rowFrame.primaryAxisSizingMode = "AUTO";
        rowFrame.counterAxisSizingMode = "AUTO";
        rowFrame.itemSpacing = 0;
        rowFrame.fills = [];
        for (var col = 0; col < 7; col++) {
          var cellIndex = row * 7 + col;
          var dayNumber;
          var isOutOfRange = false;
          if (cellIndex < startDay) {
            dayNumber = prevMonthDays - startDay + cellIndex + 1;
            isOutOfRange = true;
          } else if (cellIndex >= startDay + daysInMonth) {
            dayNumber = cellIndex - startDay - daysInMonth + 1;
            isOutOfRange = true;
          } else {
            dayNumber = cellIndex - startDay + 1;
          }
          var cellMode = isOutOfRange ? "outOfRange" : "normal";
          if (selected && !isOutOfRange) {
            if (dayNumber === 15) {
              cellMode = "start";
            } else if (dayNumber === 22) {
              cellMode = "end";
            } else if (dayNumber > 15 && dayNumber < 22) {
              cellMode = "selected";
            }
          }
          var cell = yield createDayCell(dayNumber, cellMode, sizeConfig);
          rowFrame.appendChild(cell);
        }
        grid.appendChild(rowFrame);
      }
      return grid;
    });
  }
  function createMonthHeader(monthName, year, showLeftNav, showRightNav, sizeConfig) {
    return __async(this, null, function* () {
      var header = figma.createFrame();
      header.name = "Month Header";
      header.layoutMode = "HORIZONTAL";
      header.primaryAxisAlignItems = "SPACE_BETWEEN";
      header.counterAxisAlignItems = "CENTER";
      header.primaryAxisSizingMode = "FIXED";
      header.counterAxisSizingMode = "AUTO";
      header.resize(sizeConfig.calendarWidth, 32);
      header.fills = [];
      if (showLeftNav) {
        var leftButton = figma.createFrame();
        leftButton.name = "Prev Month";
        leftButton.layoutMode = "HORIZONTAL";
        leftButton.primaryAxisAlignItems = "CENTER";
        leftButton.counterAxisAlignItems = "CENTER";
        leftButton.primaryAxisSizingMode = "AUTO";
        leftButton.counterAxisSizingMode = "AUTO";
        leftButton.paddingLeft = 6;
        leftButton.paddingRight = 6;
        leftButton.paddingTop = 6;
        leftButton.paddingBottom = 6;
        leftButton.cornerRadius = BORDER_RADIUS.md;
        var selectedOpacityVar = getVariableByName(
          "color-calendar-day-range-selected/85"
        );
        if (selectedOpacityVar) {
          bindFillToVariable(leftButton, selectedOpacityVar.id);
        }
        var leftIcon = getButtonIcon("ph-caret-left", "sm");
        bindIconColor(leftIcon, "text-surface");
        leftButton.appendChild(leftIcon);
        header.appendChild(leftButton);
      } else {
        var spacer = figma.createFrame();
        spacer.resize(1, 1);
        spacer.fills = [];
        header.appendChild(spacer);
      }
      var titleText = yield createTextNode(
        monthName + " " + year,
        sizeConfig.textSize,
        600
      );
      titleText.name = "Month Year";
      titleText.textAlignHorizontal = "CENTER";
      var surfaceVar = getVariableByName("text-color-surface");
      if (surfaceVar) {
        bindTextColorToVariable(titleText, surfaceVar.id);
      }
      header.appendChild(titleText);
      if (showRightNav) {
        var rightButton = figma.createFrame();
        rightButton.name = "Next Month";
        rightButton.layoutMode = "HORIZONTAL";
        rightButton.primaryAxisAlignItems = "CENTER";
        rightButton.counterAxisAlignItems = "CENTER";
        rightButton.primaryAxisSizingMode = "AUTO";
        rightButton.counterAxisSizingMode = "AUTO";
        rightButton.paddingLeft = 6;
        rightButton.paddingRight = 6;
        rightButton.paddingTop = 6;
        rightButton.paddingBottom = 6;
        rightButton.cornerRadius = BORDER_RADIUS.md;
        var selectedOpacityVar2 = getVariableByName(
          "color-calendar-day-range-selected/85"
        );
        if (selectedOpacityVar2) {
          bindFillToVariable(rightButton, selectedOpacityVar2.id);
        }
        var rightIcon = getButtonIcon("ph-caret-right", "sm");
        bindIconColor(rightIcon, "text-surface");
        rightButton.appendChild(rightIcon);
        header.appendChild(rightButton);
      } else {
        var spacer2 = figma.createFrame();
        spacer2.resize(1, 1);
        spacer2.fills = [];
        header.appendChild(spacer2);
      }
      return header;
    });
  }
  function createCalendar(monthName, year, showLeftNav, showRightNav, selected, sizeConfig) {
    return __async(this, null, function* () {
      var calendar = figma.createFrame();
      calendar.name = monthName + " Calendar";
      calendar.layoutMode = "VERTICAL";
      calendar.primaryAxisSizingMode = "AUTO";
      calendar.counterAxisSizingMode = "AUTO";
      calendar.itemSpacing = 12;
      calendar.fills = [];
      var monthHeader = yield createMonthHeader(
        monthName,
        year,
        showLeftNav,
        showRightNav,
        sizeConfig
      );
      calendar.appendChild(monthHeader);
      var dayHeaders = yield createDayHeaders("base", sizeConfig);
      calendar.appendChild(dayHeaders);
      var grid = yield createCalendarGrid(monthName, selected, sizeConfig);
      calendar.appendChild(grid);
      return calendar;
    });
  }
  function createFooter(sizeConfig) {
    return __async(this, null, function* () {
      var footer = figma.createFrame();
      footer.name = "Footer";
      footer.layoutMode = "HORIZONTAL";
      footer.primaryAxisAlignItems = "SPACE_BETWEEN";
      footer.counterAxisAlignItems = "CENTER";
      footer.primaryAxisSizingMode = "FIXED";
      footer.counterAxisSizingMode = "AUTO";
      footer.resize(sizeConfig.calendarWidth * 2 + 16, 32);
      footer.itemSpacing = 8;
      footer.fills = [];
      var timezoneSection = figma.createFrame();
      timezoneSection.name = "Timezone";
      timezoneSection.layoutMode = "HORIZONTAL";
      timezoneSection.primaryAxisAlignItems = "MIN";
      timezoneSection.counterAxisAlignItems = "CENTER";
      timezoneSection.primaryAxisSizingMode = "AUTO";
      timezoneSection.counterAxisSizingMode = "AUTO";
      timezoneSection.itemSpacing = 8;
      timezoneSection.fills = [];
      var globeIcon = getButtonIcon("ph-globe-hemisphere-west", "sm");
      bindIconColor(globeIcon, "text-label");
      timezoneSection.appendChild(globeIcon);
      var timezoneText = yield createTextNode(
        "Timezone: New York, NY, USA (GMT-4)",
        sizeConfig.textSize,
        400
      );
      timezoneText.name = "Timezone Text";
      var labelVar = getVariableByName("text-color-label");
      if (labelVar) {
        bindTextColorToVariable(timezoneText, labelVar.id);
      }
      timezoneSection.appendChild(timezoneText);
      footer.appendChild(timezoneSection);
      var resetButton = yield createTextNode(
        "Reset Dates",
        sizeConfig.textSize,
        600
      );
      resetButton.name = "Reset Button";
      resetButton.textDecoration = "UNDERLINE";
      var surfaceVar = getVariableByName("text-color-surface");
      if (surfaceVar) {
        bindTextColorToVariable(resetButton, surfaceVar.id);
      }
      footer.appendChild(resetButton);
      return footer;
    });
  }
  function createDateRangePickerComponent(size, variant, selected) {
    return __async(this, null, function* () {
      var sizeConfig = SIZE_CONFIG[size] || SIZE_CONFIG["base"];
      var variantConfig = VARIANT_CONFIG2[variant] || VARIANT_CONFIG2["default"];
      var component = figma.createComponent();
      component.name = "size=" + size + ", variant=" + variant + ", selected=" + selected;
      component.description = "DateRangePicker " + size + " " + variant + " " + (selected ? "with selected range" : "no selection");
      component.layoutMode = "VERTICAL";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.itemSpacing = sizeConfig.gap;
      component.paddingLeft = sizeConfig.padding;
      component.paddingRight = sizeConfig.padding;
      component.paddingTop = sizeConfig.padding;
      component.paddingBottom = sizeConfig.padding;
      component.cornerRadius = BORDER_RADIUS.lg;
      var bgVar = getVariableByName(variantConfig.bgVariable);
      if (bgVar) {
        bindFillToVariable(component, bgVar.id);
      }
      var calendarsContainer = figma.createFrame();
      calendarsContainer.name = "Calendars";
      calendarsContainer.layoutMode = "HORIZONTAL";
      calendarsContainer.primaryAxisSizingMode = "AUTO";
      calendarsContainer.counterAxisSizingMode = "AUTO";
      calendarsContainer.itemSpacing = 16;
      calendarsContainer.fills = [];
      var leftCalendar = yield createCalendar(
        "December",
        "2025",
        true,
        false,
        selected,
        sizeConfig
      );
      calendarsContainer.appendChild(leftCalendar);
      var rightCalendar = yield createCalendar(
        "January",
        "2026",
        false,
        true,
        false,
        sizeConfig
      );
      calendarsContainer.appendChild(rightCalendar);
      component.appendChild(calendarsContainer);
      var footer = yield createFooter(sizeConfig);
      component.appendChild(footer);
      return component;
    });
  }
  function generateDateRangePickerComponents(page, startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      figma.currentPage = page;
      var sizesToGenerate = ["base"];
      var components = [];
      var rowLabels = [];
      var columnHeaders = [];
      var componentGapX = 24;
      var componentGapY = 40;
      var headerRowHeight = 24;
      var labelColumnWidth = 150;
      var rowComponents = /* @__PURE__ */ new Map();
      for (var si = 0; si < sizesToGenerate.length; si++) {
        var size = sizesToGenerate[si];
        rowComponents.set(si, []);
        for (var vi = 0; vi < VARIANT_VALUES2.length; vi++) {
          var variant = VARIANT_VALUES2[vi];
          for (var seli = 0; seli < SELECTED_VALUES.length; seli++) {
            var selected = SELECTED_VALUES[seli];
            var component = yield createDateRangePickerComponent(
              size,
              variant,
              selected
            );
            var row = rowComponents.get(si);
            if (row) {
              row.push(component);
            }
            components.push(component);
          }
        }
      }
      var columnWidths = [];
      var rowHeights = [];
      var numColumns = VARIANT_VALUES2.length * SELECTED_VALUES.length;
      for (var colIdx = 0; colIdx < numColumns; colIdx++) {
        var maxColWidth = 0;
        for (var rowIdx = 0; rowIdx < sizesToGenerate.length; rowIdx++) {
          var row = rowComponents.get(rowIdx);
          if (row) {
            var comp = row[colIdx];
            if (comp && comp.width > maxColWidth) {
              maxColWidth = comp.width;
            }
          }
        }
        columnWidths.push(maxColWidth);
      }
      for (var rowIdx = 0; rowIdx < sizesToGenerate.length; rowIdx++) {
        var row = rowComponents.get(rowIdx);
        if (row) {
          var maxRowHeight = 0;
          for (var colIdx = 0; colIdx < row.length; colIdx++) {
            var comp = row[colIdx];
            if (comp && comp.height > maxRowHeight) {
              maxRowHeight = comp.height;
            }
          }
          rowHeights.push(maxRowHeight);
        }
      }
      var yOffset = headerRowHeight;
      for (var rowIdx = 0; rowIdx < sizesToGenerate.length; rowIdx++) {
        var row = rowComponents.get(rowIdx);
        if (row) {
          var xOffset = labelColumnWidth;
          var sizeValue = sizesToGenerate[rowIdx];
          rowLabels.push({
            y: yOffset,
            text: "size=" + sizeValue
          });
          for (var colIdx = 0; colIdx < row.length; colIdx++) {
            var comp = row[colIdx];
            comp.x = xOffset;
            comp.y = yOffset;
            if (rowIdx === 0) {
              var variantIdx = Math.floor(colIdx / SELECTED_VALUES.length);
              var selectedIdx = colIdx % SELECTED_VALUES.length;
              var variantVal = VARIANT_VALUES2[variantIdx];
              var selectedVal = SELECTED_VALUES[selectedIdx];
              columnHeaders.push({
                x: xOffset,
                text: "variant=" + variantVal + ", selected=" + selectedVal
              });
            }
            xOffset = xOffset + columnWidths[colIdx] + componentGapX;
          }
          yOffset = yOffset + rowHeights[rowIdx] + componentGapY;
        }
      }
      var componentSet = figma.combineAsVariants(components, page);
      componentSet.name = "DateRangePicker";
      componentSet.description = "DateRangePicker component with variant and selected properties. Showing base size only. Additional sizes (sm, lg) available in code.";
      componentSet.layoutMode = "NONE";
      var contentWidth = componentSet.width + labelColumnWidth;
      var contentHeight = componentSet.height + headerRowHeight;
      var lightSection = createModeSection(page, "DateRangePicker", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING10 * 2,
        contentHeight + SECTION_PADDING10 * 2
      );
      var darkSection = createModeSection(page, "DateRangePicker", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING10 * 2,
        contentHeight + SECTION_PADDING10 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING10 + labelColumnWidth;
      componentSet.y = SECTION_PADDING10 + headerRowHeight;
      yield createColumnHeaders(
        columnHeaders.map(function(h) {
          return { x: h.x + SECTION_PADDING10, text: h.text };
        }),
        SECTION_PADDING10,
        lightSection.frame
      );
      for (var li = 0; li < rowLabels.length; li++) {
        var label = rowLabels[li];
        var labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING10,
          SECTION_PADDING10 + label.y + 8
        );
        lightSection.frame.appendChild(labelNode);
      }
      var noteText = yield createTextNode(
        "Note: sm and lg sizes also available in code",
        12,
        400
      );
      noteText.name = "Size Note";
      var mutedVar = getVariableByName("text-color-muted");
      if (mutedVar) {
        bindTextColorToVariable(noteText, mutedVar.id);
      }
      noteText.x = SECTION_PADDING10;
      noteText.y = SECTION_PADDING10 + yOffset + 16;
      lightSection.frame.appendChild(noteText);
      for (var k = 0; k < components.length; k++) {
        var origComp = components[k];
        var instance = origComp.createInstance();
        instance.x = origComp.x + SECTION_PADDING10 + labelColumnWidth;
        instance.y = origComp.y + SECTION_PADDING10 + headerRowHeight;
        darkSection.frame.appendChild(instance);
      }
      yield createColumnHeaders(
        columnHeaders.map(function(h) {
          return { x: h.x + SECTION_PADDING10, text: h.text };
        }),
        SECTION_PADDING10,
        darkSection.frame
      );
      for (var di = 0; di < rowLabels.length; di++) {
        var darkLabel = rowLabels[di];
        var darkLabelNode = yield createRowLabel(
          darkLabel.text,
          SECTION_PADDING10,
          SECTION_PADDING10 + darkLabel.y + 8
        );
        darkSection.frame.appendChild(darkLabelNode);
      }
      var darkNoteText = yield createTextNode(
        "Note: sm and lg sizes also available in code",
        12,
        400
      );
      darkNoteText.name = "Size Note";
      if (mutedVar) {
        bindTextColorToVariable(darkNoteText, mutedVar.id);
      }
      darkNoteText.x = SECTION_PADDING10;
      darkNoteText.y = SECTION_PADDING10 + yOffset + 16;
      darkSection.frame.appendChild(darkNoteText);
      var totalWidth = contentWidth + SECTION_PADDING10 * 2;
      var totalHeight = contentHeight + SECTION_PADDING10 * 2 + 40;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      console.log(
        "\u2705 Generated DateRangePicker ComponentSet with " + components.length + " variants (base size only, light + dark)"
      );
      return startY + totalHeight + SECTION_GAP10;
    });
  }

  // scripts/figma/plugin/generators/dialog.ts
  var dialogProps = component_registry_default.components.Dialog.props;
  var sizeProp3 = dialogProps.size;
  var SECTION_PADDING11 = 48;
  var SECTION_GAP11 = 160;
  var SIZE_VALUES = sizeProp3.values;
  var SIZE_CONFIG2 = {
    sm: {
      width: 350,
      titleSize: 20,
      titleWeight: 600,
      descSize: 16,
      padding: 16,
      gap: 8,
      buttonSize: "sm"
    },
    base: {
      width: 384,
      // min-w-96 = 24rem = 384px
      titleSize: 20,
      titleWeight: 600,
      descSize: 16,
      padding: 24,
      gap: 16,
      buttonSize: "base"
    },
    lg: {
      width: 512,
      // min-w-[32rem] = 512px
      titleSize: 20,
      titleWeight: 600,
      descSize: 16,
      padding: 24,
      gap: 16,
      buttonSize: "base"
    },
    xl: {
      width: 768,
      // min-w-[48rem] = 768px
      titleSize: 20,
      titleWeight: 600,
      descSize: 16,
      padding: 24,
      gap: 16,
      buttonSize: "base"
    }
  };
  function createButton(label, isPrimary, size) {
    return __async(this, null, function* () {
      var button = figma.createFrame();
      button.name = isPrimary ? "Primary Button" : "Secondary Button";
      button.layoutMode = "HORIZONTAL";
      button.primaryAxisAlignItems = "CENTER";
      button.counterAxisAlignItems = "CENTER";
      button.primaryAxisSizingMode = "AUTO";
      button.counterAxisSizingMode = "AUTO";
      if (size === "sm") {
        button.paddingLeft = 12;
        button.paddingRight = 12;
        button.paddingTop = 8;
        button.paddingBottom = 8;
        button.minWidth = 70;
      } else {
        button.paddingLeft = 16;
        button.paddingRight = 16;
        button.paddingTop = 8;
        button.paddingBottom = 8;
        button.minWidth = 100;
      }
      button.itemSpacing = size === "sm" ? 4 : 8;
      button.cornerRadius = BORDER_RADIUS.md;
      if (isPrimary) {
        var primaryBgVar = getVariableByName("color-primary");
        if (primaryBgVar) {
          bindFillToVariable(button, primaryBgVar.id);
        }
      } else {
        button.fills = [];
        var borderVar = getVariableByName("color-border");
        if (borderVar) {
          bindStrokeToVariable(button, borderVar.id, 1);
        }
      }
      var fontSize = size === "sm" ? 14 : 16;
      var buttonLabel = yield createTextNode(label, fontSize, 600);
      buttonLabel.name = "Label";
      buttonLabel.textAutoResize = "WIDTH_AND_HEIGHT";
      if (isPrimary) {
        buttonLabel.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
      } else {
        var textVar = getVariableByName("text-color-surface");
        if (textVar) {
          bindTextColorToVariable(buttonLabel, textVar.id);
        }
      }
      button.appendChild(buttonLabel);
      return button;
    });
  }
  function createDialogComponent(size) {
    return __async(this, null, function* () {
      var config = SIZE_CONFIG2[size] || SIZE_CONFIG2["base"];
      var component = figma.createComponent();
      component.name = "size=" + size;
      component.description = sizeProp3.descriptions[size] || "Dialog " + size + " variant";
      component.layoutMode = "VERTICAL";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "FIXED";
      component.resize(config.width, 100);
      component.itemSpacing = config.gap;
      component.paddingLeft = config.padding;
      component.paddingRight = config.padding;
      component.paddingTop = config.padding;
      component.paddingBottom = config.padding;
      component.cornerRadius = BORDER_RADIUS.lg;
      var bgVar = getVariableByName("color-surface");
      if (bgVar) {
        bindFillToVariable(component, bgVar.id);
      }
      component.effects = [
        {
          type: "DROP_SHADOW",
          color: { r: 0, g: 0, b: 0, a: 0.16 },
          offset: { x: 0, y: 8 },
          radius: 32,
          spread: 0,
          visible: true,
          blendMode: "NORMAL"
        }
      ];
      var header = figma.createFrame();
      header.name = "Header";
      header.layoutMode = "HORIZONTAL";
      header.primaryAxisAlignItems = "SPACE_BETWEEN";
      header.counterAxisAlignItems = "CENTER";
      header.primaryAxisSizingMode = "FIXED";
      header.counterAxisSizingMode = "AUTO";
      header.resize(config.width - config.padding * 2, 24);
      header.layoutAlign = "STRETCH";
      header.layoutGrow = 0;
      header.fills = [];
      header.itemSpacing = 8;
      var title = yield createTextNode(
        "Dialog Title",
        config.titleSize,
        config.titleWeight
      );
      title.name = "Title";
      title.textAutoResize = "WIDTH_AND_HEIGHT";
      title.layoutGrow = 1;
      var titleVar = getVariableByName("text-color-surface");
      if (titleVar) {
        bindTextColorToVariable(title, titleVar.id);
      }
      header.appendChild(title);
      var closeIconName = "ph-x";
      var closeIcon = getButtonIcon(closeIconName, "base");
      closeIcon.name = "Close";
      bindIconColor(closeIcon, "text-muted");
      header.appendChild(closeIcon);
      component.appendChild(header);
      var description = yield createTextNode(
        "This is a dialog description with some content explaining the purpose of this dialog.",
        config.descSize,
        400
      );
      description.name = "Description";
      description.textAutoResize = "HEIGHT";
      description.layoutAlign = "STRETCH";
      description.resize(config.width - config.padding * 2, description.height);
      var descVar = getVariableByName("text-color-muted");
      if (descVar) {
        bindTextColorToVariable(description, descVar.id);
      }
      component.appendChild(description);
      var actions = figma.createFrame();
      actions.name = "Actions";
      actions.layoutMode = "HORIZONTAL";
      actions.primaryAxisAlignItems = "MAX";
      actions.counterAxisAlignItems = "CENTER";
      actions.primaryAxisSizingMode = "AUTO";
      actions.counterAxisSizingMode = "AUTO";
      actions.layoutAlign = "STRETCH";
      actions.layoutGrow = 0;
      actions.fills = [];
      actions.itemSpacing = 12;
      var cancelButton = yield createButton("Cancel", false, config.buttonSize);
      actions.appendChild(cancelButton);
      var primaryButton = yield createButton("Confirm", true, config.buttonSize);
      actions.appendChild(primaryButton);
      component.appendChild(actions);
      return component;
    });
  }
  function generateDialogComponents(page, startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      figma.currentPage = page;
      var components = [];
      var rowLabels = [];
      var componentGapY = 40;
      var labelColumnWidth = 120;
      var yOffset = 0;
      var maxWidth = 0;
      for (var i = 0; i < SIZE_VALUES.length; i++) {
        var size = SIZE_VALUES[i];
        var component = yield createDialogComponent(size);
        component.x = labelColumnWidth;
        component.y = yOffset;
        rowLabels.push({
          y: yOffset,
          text: "size=" + size
        });
        if (component.width > maxWidth) {
          maxWidth = component.width;
        }
        yOffset += component.height + componentGapY;
        components.push(component);
      }
      var componentSet = figma.combineAsVariants(components, page);
      componentSet.name = "Dialog";
      componentSet.description = "Dialog component with size variants. Use for modal dialogs, confirmations, and forms.";
      componentSet.layoutMode = "NONE";
      var contentWidth = componentSet.width + labelColumnWidth;
      var contentHeight = componentSet.height;
      var lightSection = createModeSection(page, "Dialog", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING11 * 2,
        contentHeight + SECTION_PADDING11 * 2
      );
      var darkSection = createModeSection(page, "Dialog", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING11 * 2,
        contentHeight + SECTION_PADDING11 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING11 + labelColumnWidth;
      componentSet.y = SECTION_PADDING11;
      for (var li = 0; li < rowLabels.length; li++) {
        var label = rowLabels[li];
        var labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING11,
          SECTION_PADDING11 + label.y + 8
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (var k = 0; k < components.length; k++) {
        var origComp = components[k];
        var instance = origComp.createInstance();
        instance.x = origComp.x + SECTION_PADDING11 + labelColumnWidth;
        instance.y = origComp.y + SECTION_PADDING11;
        darkSection.frame.appendChild(instance);
      }
      for (var di = 0; di < rowLabels.length; di++) {
        var darkLabel = rowLabels[di];
        var darkLabelNode = yield createRowLabel(
          darkLabel.text,
          SECTION_PADDING11,
          SECTION_PADDING11 + darkLabel.y + 8
        );
        darkSection.frame.appendChild(darkLabelNode);
      }
      var totalWidth = contentWidth + SECTION_PADDING11 * 2;
      var totalHeight = contentHeight + SECTION_PADDING11 * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      console.log(
        "Generated Dialog ComponentSet with " + components.length + " variants (light + dark)"
      );
      return startY + totalHeight + SECTION_GAP11;
    });
  }

  // scripts/figma/plugin/generators/dropdown.ts
  var SECTION_PADDING12 = 48;
  var SECTION_GAP12 = 160;
  var OPEN_VALUES3 = [false, true];
  var VARIANT_VALUES3 = [
    "default",
    "withIcons",
    "withDanger",
    "withGroups",
    "withCheckbox",
    "withShortcuts"
  ];
  var DROPDOWN_WIDTH = 200;
  function createMenuItem(label, options) {
    return __async(this, null, function* () {
      var opts = options || {};
      var itemFrame = figma.createFrame();
      itemFrame.name = "Item: " + label;
      itemFrame.layoutMode = "HORIZONTAL";
      itemFrame.primaryAxisAlignItems = opts.shortcut ? "SPACE_BETWEEN" : "MIN";
      itemFrame.counterAxisAlignItems = "CENTER";
      itemFrame.primaryAxisSizingMode = "FIXED";
      itemFrame.counterAxisSizingMode = "AUTO";
      itemFrame.layoutAlign = "STRETCH";
      itemFrame.resize(DROPDOWN_WIDTH - 12, 32);
      itemFrame.itemSpacing = 8;
      itemFrame.paddingLeft = 8;
      itemFrame.paddingRight = 8;
      itemFrame.paddingTop = 6;
      itemFrame.paddingBottom = 6;
      itemFrame.cornerRadius = 6;
      itemFrame.fills = [];
      if (opts.highlighted) {
        var highlightVar = getVariableByName("color-color-3");
        if (highlightVar) {
          bindFillToVariable(itemFrame, highlightVar.id);
        }
      }
      if (opts.disabled) {
        itemFrame.opacity = 0.5;
      }
      var leftContainer = figma.createFrame();
      leftContainer.name = "Left";
      leftContainer.layoutMode = "HORIZONTAL";
      leftContainer.primaryAxisSizingMode = "AUTO";
      leftContainer.counterAxisSizingMode = "AUTO";
      leftContainer.counterAxisAlignItems = "CENTER";
      leftContainer.itemSpacing = 8;
      leftContainer.fills = [];
      if (opts.icon) {
        var icon = getButtonIcon(opts.icon, "sm");
        icon.name = "Icon";
        var iconColorToken = opts.variant === "danger" ? "text-error" : "text-surface";
        bindIconColor(icon, iconColorToken);
        leftContainer.appendChild(icon);
      }
      var labelText = yield createTextNode(label, 14, 400);
      labelText.name = "Label";
      labelText.textAutoResize = "WIDTH_AND_HEIGHT";
      var textColorToken = opts.variant === "danger" ? "text-color-error" : "text-color-surface";
      var textVar = getVariableByName(textColorToken);
      if (textVar) {
        bindTextColorToVariable(labelText, textVar.id);
      }
      leftContainer.appendChild(labelText);
      itemFrame.appendChild(leftContainer);
      if (opts.shortcut) {
        var shortcutText = yield createTextNode(opts.shortcut, 12, 400);
        shortcutText.name = "Shortcut";
        shortcutText.textAutoResize = "WIDTH_AND_HEIGHT";
        shortcutText.opacity = 0.6;
        var shortcutVar = getVariableByName("text-color-muted");
        if (shortcutVar) {
          bindTextColorToVariable(shortcutText, shortcutVar.id);
        }
        itemFrame.appendChild(shortcutText);
      }
      return itemFrame;
    });
  }
  function createCheckboxItem(label, checked) {
    return __async(this, null, function* () {
      var itemFrame = figma.createFrame();
      itemFrame.name = "CheckboxItem: " + label;
      itemFrame.layoutMode = "HORIZONTAL";
      itemFrame.primaryAxisAlignItems = "MIN";
      itemFrame.counterAxisAlignItems = "CENTER";
      itemFrame.primaryAxisSizingMode = "FIXED";
      itemFrame.counterAxisSizingMode = "AUTO";
      itemFrame.layoutAlign = "STRETCH";
      itemFrame.resize(DROPDOWN_WIDTH - 12, 32);
      itemFrame.itemSpacing = 8;
      itemFrame.paddingLeft = 8;
      itemFrame.paddingRight = 8;
      itemFrame.paddingTop = 6;
      itemFrame.paddingBottom = 6;
      itemFrame.cornerRadius = 6;
      itemFrame.fills = [];
      var checkboxState = checked ? "checked" : "unchecked";
      var checkboxInstance = createComponentInstance("Checkbox", {
        state: checkboxState,
        variant: "default",
        disabled: "false"
      });
      if (checkboxInstance) {
        checkboxInstance.name = "Checkbox";
        itemFrame.appendChild(checkboxInstance);
      } else {
        var checkboxFrame = figma.createFrame();
        checkboxFrame.name = "Checkbox";
        checkboxFrame.resize(16, 16);
        checkboxFrame.cornerRadius = 4;
        if (checked) {
          var primaryVar = getVariableByName("color-primary");
          if (primaryVar) {
            bindFillToVariable(checkboxFrame, primaryVar.id);
          }
          var checkIcon = getButtonIcon("ph-check", "xs");
          checkIcon.name = "Check";
          bindIconColor(checkIcon, "text-white");
          checkboxFrame.layoutMode = "HORIZONTAL";
          checkboxFrame.primaryAxisAlignItems = "CENTER";
          checkboxFrame.counterAxisAlignItems = "CENTER";
          checkboxFrame.appendChild(checkIcon);
        } else {
          var borderVar = getVariableByName("color-border");
          if (borderVar) {
            bindStrokeToVariable(checkboxFrame, borderVar.id, 1);
          }
          checkboxFrame.fills = [];
        }
        itemFrame.appendChild(checkboxFrame);
      }
      var labelText = yield createTextNode(label, 14, 400);
      labelText.name = "Label";
      labelText.textAutoResize = "WIDTH_AND_HEIGHT";
      var textVar = getVariableByName("text-color-surface");
      if (textVar) {
        bindTextColorToVariable(labelText, textVar.id);
      }
      itemFrame.appendChild(labelText);
      return itemFrame;
    });
  }
  function createSeparator() {
    var separator = figma.createFrame();
    separator.name = "Separator";
    separator.layoutMode = "HORIZONTAL";
    separator.primaryAxisSizingMode = "FIXED";
    separator.counterAxisSizingMode = "FIXED";
    separator.layoutAlign = "STRETCH";
    separator.resize(DROPDOWN_WIDTH - 12, 9);
    separator.fills = [];
    var line = figma.createFrame();
    line.name = "Line";
    line.layoutMode = "HORIZONTAL";
    line.primaryAxisSizingMode = "FIXED";
    line.counterAxisSizingMode = "FIXED";
    line.layoutAlign = "STRETCH";
    line.resize(DROPDOWN_WIDTH - 12, 1);
    var mutedVar = getVariableByName("color-muted");
    if (mutedVar) {
      bindFillToVariable(line, mutedVar.id);
    }
    separator.appendChild(line);
    separator.paddingTop = 4;
    separator.paddingBottom = 4;
    return separator;
  }
  function createGroupLabel(label) {
    return __async(this, null, function* () {
      var labelFrame = figma.createFrame();
      labelFrame.name = "GroupLabel: " + label;
      labelFrame.layoutMode = "HORIZONTAL";
      labelFrame.primaryAxisSizingMode = "FIXED";
      labelFrame.counterAxisSizingMode = "AUTO";
      labelFrame.layoutAlign = "STRETCH";
      labelFrame.resize(DROPDOWN_WIDTH - 12, 24);
      labelFrame.paddingLeft = 8;
      labelFrame.paddingRight = 8;
      labelFrame.paddingTop = 6;
      labelFrame.paddingBottom = 2;
      labelFrame.fills = [];
      var labelText = yield createTextNode(label, 14, 600);
      labelText.name = "Label";
      labelText.textAutoResize = "WIDTH_AND_HEIGHT";
      var textVar = getVariableByName("text-color-surface");
      if (textVar) {
        bindTextColorToVariable(labelText, textVar.id);
      }
      labelFrame.appendChild(labelText);
      return labelFrame;
    });
  }
  function createTriggerButton(label) {
    return __async(this, null, function* () {
      var button = figma.createFrame();
      button.name = "Trigger";
      button.layoutMode = "HORIZONTAL";
      button.primaryAxisAlignItems = "CENTER";
      button.counterAxisAlignItems = "CENTER";
      button.primaryAxisSizingMode = "AUTO";
      button.counterAxisSizingMode = "AUTO";
      button.itemSpacing = 8;
      button.paddingLeft = 12;
      button.paddingRight = 12;
      button.paddingTop = 8;
      button.paddingBottom = 8;
      button.cornerRadius = BORDER_RADIUS.lg;
      var bgVar = getVariableByName("color-secondary");
      if (bgVar) {
        bindFillToVariable(button, bgVar.id);
      }
      var borderVar = getVariableByName("color-border");
      if (borderVar) {
        bindStrokeToVariable(button, borderVar.id, 1);
      }
      var buttonText = yield createTextNode(label, 14, 500);
      buttonText.name = "Label";
      buttonText.textAutoResize = "WIDTH_AND_HEIGHT";
      var textVar = getVariableByName("text-color-surface");
      if (textVar) {
        bindTextColorToVariable(buttonText, textVar.id);
      }
      button.appendChild(buttonText);
      return button;
    });
  }
  function createDropdownPanel(variant) {
    return __async(this, null, function* () {
      var panel = figma.createFrame();
      panel.name = "Dropdown";
      panel.layoutMode = "VERTICAL";
      panel.primaryAxisSizingMode = "AUTO";
      panel.counterAxisSizingMode = "FIXED";
      panel.counterAxisAlignItems = "MIN";
      panel.resize(DROPDOWN_WIDTH, 100);
      panel.itemSpacing = 2;
      panel.paddingLeft = 6;
      panel.paddingRight = 6;
      panel.paddingTop = 6;
      panel.paddingBottom = 6;
      panel.cornerRadius = BORDER_RADIUS.lg;
      var bgVar = getVariableByName("color-secondary");
      if (bgVar) {
        bindFillToVariable(panel, bgVar.id);
      }
      var borderVar = getVariableByName("color-border");
      if (borderVar) {
        bindStrokeToVariable(panel, borderVar.id, 1);
      }
      if (variant === "default") {
        var item1 = yield createMenuItem("Item 1");
        var item2 = yield createMenuItem("Item 2", { highlighted: true });
        var item3 = yield createMenuItem("Item 3");
        panel.appendChild(item1);
        panel.appendChild(item2);
        panel.appendChild(item3);
      } else if (variant === "withIcons") {
        var editItem = yield createMenuItem("Edit", { icon: "ph-pencil" });
        var copyItem = yield createMenuItem("Copy", {
          icon: "ph-copy",
          highlighted: true
        });
        var shareItem = yield createMenuItem("Share", { icon: "ph-share" });
        var downloadItem = yield createMenuItem("Download", {
          icon: "ph-download"
        });
        panel.appendChild(editItem);
        panel.appendChild(copyItem);
        panel.appendChild(shareItem);
        panel.appendChild(downloadItem);
      } else if (variant === "withDanger") {
        var editItem2 = yield createMenuItem("Edit", { icon: "ph-pencil" });
        var duplicateItem = yield createMenuItem("Duplicate", { icon: "ph-copy" });
        var sep1 = createSeparator();
        var deleteItem = yield createMenuItem("Delete", {
          icon: "ph-trash",
          variant: "danger"
        });
        panel.appendChild(editItem2);
        panel.appendChild(duplicateItem);
        panel.appendChild(sep1);
        panel.appendChild(deleteItem);
      } else if (variant === "withGroups") {
        var accountLabel = yield createGroupLabel("Account");
        var profileItem = yield createMenuItem("Profile", { icon: "ph-user" });
        var settingsItem = yield createMenuItem("Settings", { icon: "ph-gear" });
        var sep2 = createSeparator();
        var signOutItem = yield createMenuItem("Sign out", {
          icon: "ph-sign-out",
          variant: "danger"
        });
        panel.appendChild(accountLabel);
        panel.appendChild(profileItem);
        panel.appendChild(settingsItem);
        panel.appendChild(sep2);
        panel.appendChild(signOutItem);
      } else if (variant === "withCheckbox") {
        var displayLabel = yield createGroupLabel("Display");
        var sidebarItem = yield createCheckboxItem("Show sidebar", true);
        var lineNumItem = yield createCheckboxItem("Show line numbers", false);
        var wrapItem = yield createCheckboxItem("Word wrap", true);
        panel.appendChild(displayLabel);
        panel.appendChild(sidebarItem);
        panel.appendChild(lineNumItem);
        panel.appendChild(wrapItem);
      } else if (variant === "withShortcuts") {
        var copyShortcut = yield createMenuItem("Copy", {
          icon: "ph-copy",
          shortcut: "\u2318C"
        });
        var editShortcut = yield createMenuItem("Edit", {
          icon: "ph-pencil",
          shortcut: "\u2318E",
          highlighted: true
        });
        var sep3 = createSeparator();
        var deleteShortcut = yield createMenuItem("Delete", {
          icon: "ph-trash",
          variant: "danger",
          shortcut: "\u2318\u232B"
        });
        panel.appendChild(copyShortcut);
        panel.appendChild(editShortcut);
        panel.appendChild(sep3);
        panel.appendChild(deleteShortcut);
      }
      return panel;
    });
  }
  function createDropdownComponent(open, variant) {
    return __async(this, null, function* () {
      var component = figma.createComponent();
      component.name = "open=" + open + ", variant=" + variant;
      component.description = "Dropdown " + variant + " " + (open ? "open" : "closed");
      component.layoutMode = "VERTICAL";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.counterAxisAlignItems = "MIN";
      component.itemSpacing = 4;
      component.fills = [];
      var triggerLabel = variant === "withCheckbox" ? "View Options" : variant === "withGroups" ? "User Menu" : variant === "withShortcuts" ? "Edit" : "Open Menu";
      var trigger = yield createTriggerButton(triggerLabel);
      component.appendChild(trigger);
      if (open) {
        var panel = yield createDropdownPanel(variant);
        component.appendChild(panel);
      }
      return component;
    });
  }
  function generateDropdownComponents(page, startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      figma.currentPage = page;
      var components = [];
      var rowLabels = [];
      var columnHeaders = [];
      var componentGapX = 24;
      var componentGapY = 40;
      var headerRowHeight = 24;
      var labelColumnWidth = 180;
      var rowComponents = /* @__PURE__ */ new Map();
      for (var vi = 0; vi < VARIANT_VALUES3.length; vi++) {
        var variant = VARIANT_VALUES3[vi];
        rowComponents.set(vi, []);
        for (var oi = 0; oi < OPEN_VALUES3.length; oi++) {
          var open = OPEN_VALUES3[oi];
          var component = yield createDropdownComponent(open, variant);
          rowComponents.get(vi).push(component);
          components.push(component);
        }
      }
      var columnWidths = [];
      var rowHeights = [];
      var numColumns = OPEN_VALUES3.length;
      for (var colIdx = 0; colIdx < numColumns; colIdx++) {
        var maxColWidth = 0;
        for (var rowIdx = 0; rowIdx < VARIANT_VALUES3.length; rowIdx++) {
          var row = rowComponents.get(rowIdx) || [];
          var comp = row[colIdx];
          if (comp && comp.width > maxColWidth) {
            maxColWidth = comp.width;
          }
        }
        columnWidths.push(maxColWidth);
      }
      for (var rowIdx = 0; rowIdx < VARIANT_VALUES3.length; rowIdx++) {
        var row = rowComponents.get(rowIdx) || [];
        var maxRowHeight = 0;
        for (var colIdx = 0; colIdx < row.length; colIdx++) {
          var comp = row[colIdx];
          if (comp && comp.height > maxRowHeight) {
            maxRowHeight = comp.height;
          }
        }
        rowHeights.push(maxRowHeight);
      }
      var yOffset = headerRowHeight;
      for (var rowIdx = 0; rowIdx < VARIANT_VALUES3.length; rowIdx++) {
        var row = rowComponents.get(rowIdx) || [];
        var xOffset = labelColumnWidth;
        var variantValue = VARIANT_VALUES3[rowIdx];
        rowLabels.push({
          y: yOffset,
          text: "variant=" + variantValue
        });
        for (var colIdx = 0; colIdx < row.length; colIdx++) {
          var comp = row[colIdx];
          comp.x = xOffset;
          comp.y = yOffset;
          if (rowIdx === 0) {
            var openVal = OPEN_VALUES3[colIdx];
            columnHeaders.push({
              x: xOffset,
              text: "open=" + openVal
            });
          }
          xOffset += columnWidths[colIdx] + componentGapX;
        }
        yOffset += rowHeights[rowIdx] + componentGapY;
      }
      var componentSet = figma.combineAsVariants(components, page);
      componentSet.name = "Dropdown";
      componentSet.description = "Dropdown menu component with trigger button and menu items. Supports icons, danger variants, groups, checkboxes, and keyboard shortcuts.";
      componentSet.layoutMode = "NONE";
      var contentWidth = componentSet.width + labelColumnWidth;
      var contentHeight = componentSet.height + headerRowHeight;
      var lightSection = createModeSection(page, "Dropdown", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING12 * 2,
        contentHeight + SECTION_PADDING12 * 2
      );
      var darkSection = createModeSection(page, "Dropdown", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING12 * 2,
        contentHeight + SECTION_PADDING12 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING12 + labelColumnWidth;
      componentSet.y = SECTION_PADDING12 + headerRowHeight;
      yield createColumnHeaders(
        columnHeaders.map(function(h) {
          return { x: h.x + SECTION_PADDING12, text: h.text };
        }),
        SECTION_PADDING12,
        lightSection.frame
      );
      for (var li = 0; li < rowLabels.length; li++) {
        var label = rowLabels[li];
        var labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING12,
          SECTION_PADDING12 + label.y + 8
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (var k = 0; k < components.length; k++) {
        var origComp = components[k];
        var instance = origComp.createInstance();
        instance.x = origComp.x + SECTION_PADDING12 + labelColumnWidth;
        instance.y = origComp.y + SECTION_PADDING12 + headerRowHeight;
        darkSection.frame.appendChild(instance);
      }
      yield createColumnHeaders(
        columnHeaders.map(function(h) {
          return { x: h.x + SECTION_PADDING12, text: h.text };
        }),
        SECTION_PADDING12,
        darkSection.frame
      );
      for (var di = 0; di < rowLabels.length; di++) {
        var darkLabel = rowLabels[di];
        var darkLabelNode = yield createRowLabel(
          darkLabel.text,
          SECTION_PADDING12,
          SECTION_PADDING12 + darkLabel.y + 8
        );
        darkSection.frame.appendChild(darkLabelNode);
      }
      var totalWidth = contentWidth + SECTION_PADDING12 * 2;
      var totalHeight = contentHeight + SECTION_PADDING12 * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      console.log(
        "Generated Dropdown ComponentSet with " + components.length + " variants (light + dark)"
      );
      return startY + totalHeight + SECTION_GAP12;
    });
  }

  // scripts/figma/plugin/generators/input.ts
  var SECTION_PADDING13 = 48;
  var SECTION_GAP13 = 160;
  var SIZE_CONFIG3 = {
    xs: {
      height: 20,
      // h-5
      paddingX: 6,
      // px-1.5
      fontSize: 12,
      // text-xs
      borderRadius: BORDER_RADIUS.sm,
      width: 160
    },
    sm: {
      height: 26,
      // h-6.5
      paddingX: 8,
      // px-2
      fontSize: 12,
      // text-xs
      borderRadius: BORDER_RADIUS.md,
      width: 200
    },
    base: {
      height: 36,
      // h-9
      paddingX: 12,
      // px-3
      fontSize: 16,
      // text-base
      borderRadius: BORDER_RADIUS.lg,
      width: 280
    },
    lg: {
      height: 40,
      // h-10
      paddingX: 16,
      // px-4
      fontSize: 16,
      // text-base
      borderRadius: BORDER_RADIUS.lg,
      width: 320
    }
  };
  var SIZE_VALUES2 = ["xs", "sm", "base", "lg"];
  var VARIANT_VALUES4 = ["default", "error"];
  var STATE_VALUES3 = ["default", "focus", "disabled"];
  var WITH_LABEL_VALUES = [false, true];
  var STATE_STYLES4 = {
    default: {
      ringVariable: "color-border",
      textColorVariable: "text-color-muted"
    },
    focus: {
      ringVariable: "color-active",
      textColorVariable: "text-color-muted"
    },
    disabled: {
      ringVariable: "color-border",
      opacity: 0.5,
      textColorVariable: "text-color-muted"
    }
  };
  var VARIANT_CONFIG3 = {
    default: {
      ringVariable: "color-border",
      label: "Email",
      description: "Enter your email address"
    },
    error: {
      ringVariable: "color-error",
      label: "Email",
      errorMessage: "Please enter a valid email address"
    }
  };
  function createInputComponent(size, variant, state, withLabel) {
    return __async(this, null, function* () {
      var sizeConfig = SIZE_CONFIG3[size] || SIZE_CONFIG3["base"];
      var variantConfig = VARIANT_CONFIG3[variant] || VARIANT_CONFIG3["default"];
      var stateStyle = STATE_STYLES4[state] || STATE_STYLES4["default"];
      var component = figma.createComponent();
      component.name = "size=" + size + ", variant=" + variant + ", state=" + state + ", withLabel=" + withLabel;
      component.description = "Input " + size + " " + variant + " in " + state + " state" + (withLabel ? " with Field wrapper" : " bare");
      component.layoutMode = "VERTICAL";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.counterAxisAlignItems = "MIN";
      component.itemSpacing = 4;
      component.fills = [];
      if (stateStyle.opacity !== void 0) {
        component.opacity = stateStyle.opacity;
      }
      if (withLabel && variantConfig.label) {
        var labelText = yield createTextNode(variantConfig.label, 14, 500);
        labelText.name = "Label";
        labelText.textAutoResize = "WIDTH_AND_HEIGHT";
        var labelVar = getVariableByName("text-color-label");
        if (labelVar) {
          bindTextColorToVariable(labelText, labelVar.id);
        }
        component.appendChild(labelText);
      }
      var inputFrame = figma.createFrame();
      inputFrame.name = "Input";
      inputFrame.layoutMode = "HORIZONTAL";
      inputFrame.primaryAxisAlignItems = "MIN";
      inputFrame.counterAxisAlignItems = "CENTER";
      inputFrame.primaryAxisSizingMode = "FIXED";
      inputFrame.counterAxisSizingMode = "FIXED";
      inputFrame.resize(sizeConfig.width, sizeConfig.height);
      inputFrame.itemSpacing = 8;
      inputFrame.paddingLeft = sizeConfig.paddingX;
      inputFrame.paddingRight = sizeConfig.paddingX;
      inputFrame.paddingTop = 0;
      inputFrame.paddingBottom = 0;
      inputFrame.cornerRadius = sizeConfig.borderRadius;
      var bgVar = getVariableByName("color-secondary");
      if (bgVar) {
        bindFillToVariable(inputFrame, bgVar.id);
      }
      var ringVarName = variantConfig.ringVariable;
      if (state === "focus" && variant === "default") {
        ringVarName = "color-active";
      } else if (state === "focus" && variant === "error") {
        ringVarName = "color-error";
      }
      var ringVar = getVariableByName(ringVarName);
      if (ringVar) {
        bindStrokeToVariable(inputFrame, ringVar.id, 1);
      }
      var placeholderValue = variant === "error" ? "invalid@example" : "you@example.com";
      var placeholderText = yield createTextNode(
        placeholderValue,
        sizeConfig.fontSize,
        400
      );
      placeholderText.name = "Placeholder";
      placeholderText.textAutoResize = "WIDTH_AND_HEIGHT";
      var textColorVar = variant === "error" ? getVariableByName("text-color-surface") : getVariableByName("text-color-muted");
      if (textColorVar) {
        bindTextColorToVariable(placeholderText, textColorVar.id);
      }
      inputFrame.appendChild(placeholderText);
      component.appendChild(inputFrame);
      if (withLabel && variantConfig.description && variant === "default") {
        var descText = yield createTextNode(variantConfig.description, 12, 400);
        descText.name = "Description";
        descText.textAutoResize = "WIDTH_AND_HEIGHT";
        var descVar = getVariableByName("text-color-muted");
        if (descVar) {
          bindTextColorToVariable(descText, descVar.id);
        }
        component.appendChild(descText);
      }
      if (withLabel && variantConfig.errorMessage && variant === "error") {
        var errorText = yield createTextNode(variantConfig.errorMessage, 12, 400);
        errorText.name = "Error";
        errorText.textAutoResize = "WIDTH_AND_HEIGHT";
        var errorVar = getVariableByName("text-color-error");
        if (errorVar) {
          bindTextColorToVariable(errorText, errorVar.id);
        }
        component.appendChild(errorText);
      }
      return component;
    });
  }
  function generateInputComponents(page, startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      figma.currentPage = page;
      var components = [];
      var rowLabels = [];
      var columnHeaders = [];
      var componentGapX = 24;
      var componentGapY = 40;
      var headerRowHeight = 24;
      var labelColumnWidth = 200;
      var rowComponents = /* @__PURE__ */ new Map();
      var rowIndex = 0;
      for (var si = 0; si < SIZE_VALUES2.length; si++) {
        var size = SIZE_VALUES2[si];
        for (var wli = 0; wli < WITH_LABEL_VALUES.length; wli++) {
          var withLabel = WITH_LABEL_VALUES[wli];
          rowComponents.set(rowIndex, []);
          for (var vi = 0; vi < VARIANT_VALUES4.length; vi++) {
            var variant = VARIANT_VALUES4[vi];
            for (var sti = 0; sti < STATE_VALUES3.length; sti++) {
              var state = STATE_VALUES3[sti];
              var component = yield createInputComponent(
                size,
                variant,
                state,
                withLabel
              );
              rowComponents.get(rowIndex).push(component);
              components.push(component);
            }
          }
          rowIndex++;
        }
      }
      var columnWidths = [];
      var rowHeights = [];
      var numColumns = VARIANT_VALUES4.length * STATE_VALUES3.length;
      var totalRows = SIZE_VALUES2.length * WITH_LABEL_VALUES.length;
      for (var colIdx = 0; colIdx < numColumns; colIdx++) {
        var maxColWidth = 0;
        for (var rowIdx = 0; rowIdx < totalRows; rowIdx++) {
          var row = rowComponents.get(rowIdx) || [];
          var comp = row[colIdx];
          if (comp && comp.width > maxColWidth) {
            maxColWidth = comp.width;
          }
        }
        columnWidths.push(maxColWidth);
      }
      for (var rowIdx = 0; rowIdx < totalRows; rowIdx++) {
        var row = rowComponents.get(rowIdx) || [];
        var maxRowHeight = 0;
        for (var colIdx = 0; colIdx < row.length; colIdx++) {
          var comp = row[colIdx];
          if (comp && comp.height > maxRowHeight) {
            maxRowHeight = comp.height;
          }
        }
        rowHeights.push(maxRowHeight);
      }
      var yOffset = headerRowHeight;
      var currentRowIndex = 0;
      for (var si2 = 0; si2 < SIZE_VALUES2.length; si2++) {
        var sizeValue = SIZE_VALUES2[si2];
        for (var wli2 = 0; wli2 < WITH_LABEL_VALUES.length; wli2++) {
          var withLabelValue = WITH_LABEL_VALUES[wli2];
          var row = rowComponents.get(currentRowIndex) || [];
          var xOffset = labelColumnWidth;
          rowLabels.push({
            y: yOffset,
            text: "size=" + sizeValue + ", withLabel=" + withLabelValue
          });
          for (var colIdx = 0; colIdx < row.length; colIdx++) {
            var comp = row[colIdx];
            comp.x = xOffset;
            comp.y = yOffset;
            if (currentRowIndex === 0) {
              var variantIdx = Math.floor(colIdx / STATE_VALUES3.length);
              var stateIdx = colIdx % STATE_VALUES3.length;
              var variantVal = VARIANT_VALUES4[variantIdx];
              var stateVal = STATE_VALUES3[stateIdx];
              columnHeaders.push({
                x: xOffset,
                text: "variant=" + variantVal + ", state=" + stateVal
              });
            }
            xOffset += columnWidths[colIdx] + componentGapX;
          }
          yOffset += rowHeights[currentRowIndex] + componentGapY;
          currentRowIndex++;
        }
      }
      var componentSet = figma.combineAsVariants(components, page);
      componentSet.name = "Input";
      componentSet.description = "Input component with size, variant, state, and withLabel properties. Use withLabel=false for bare inputs, withLabel=true for inputs with Field wrapper (label, description, error).";
      componentSet.layoutMode = "NONE";
      var contentWidth = componentSet.width + labelColumnWidth;
      var contentHeight = componentSet.height + headerRowHeight;
      var lightSection = createModeSection(page, "Input", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING13 * 2,
        contentHeight + SECTION_PADDING13 * 2
      );
      var darkSection = createModeSection(page, "Input", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING13 * 2,
        contentHeight + SECTION_PADDING13 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING13 + labelColumnWidth;
      componentSet.y = SECTION_PADDING13 + headerRowHeight;
      yield createColumnHeaders(
        columnHeaders.map(function(h) {
          return { x: h.x + SECTION_PADDING13, text: h.text };
        }),
        SECTION_PADDING13,
        lightSection.frame
      );
      for (var li = 0; li < rowLabels.length; li++) {
        var label = rowLabels[li];
        var labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING13,
          SECTION_PADDING13 + label.y + 8
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (var k = 0; k < components.length; k++) {
        var origComp = components[k];
        var instance = origComp.createInstance();
        instance.x = origComp.x + SECTION_PADDING13 + labelColumnWidth;
        instance.y = origComp.y + SECTION_PADDING13 + headerRowHeight;
        darkSection.frame.appendChild(instance);
      }
      yield createColumnHeaders(
        columnHeaders.map(function(h) {
          return { x: h.x + SECTION_PADDING13, text: h.text };
        }),
        SECTION_PADDING13,
        darkSection.frame
      );
      for (var di = 0; di < rowLabels.length; di++) {
        var darkLabel = rowLabels[di];
        var darkLabelNode = yield createRowLabel(
          darkLabel.text,
          SECTION_PADDING13,
          SECTION_PADDING13 + darkLabel.y + 8
        );
        darkSection.frame.appendChild(darkLabelNode);
      }
      var totalWidth = contentWidth + SECTION_PADDING13 * 2;
      var totalHeight = contentHeight + SECTION_PADDING13 * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      console.log(
        "Generated Input ComponentSet with " + components.length + " variants (light + dark)"
      );
      return startY + totalHeight + SECTION_GAP13;
    });
  }

  // scripts/figma/plugin/generators/input-area.ts
  var SECTION_PADDING14 = 48;
  var SECTION_GAP14 = 160;
  var SIZE_CONFIG4 = {
    xs: {
      minHeight: 60,
      // Taller than input for multi-line
      paddingX: 6,
      // px-1.5
      paddingY: 8,
      // py-2
      fontSize: 12,
      // text-xs
      borderRadius: BORDER_RADIUS.sm,
      width: 200
    },
    sm: {
      minHeight: 72,
      // Taller than input for multi-line
      paddingX: 8,
      // px-2
      paddingY: 8,
      // py-2
      fontSize: 12,
      // text-xs
      borderRadius: BORDER_RADIUS.md,
      width: 240
    },
    base: {
      minHeight: 88,
      // Taller than input for multi-line
      paddingX: 12,
      // px-3
      paddingY: 8,
      // py-2
      fontSize: 16,
      // text-base
      borderRadius: BORDER_RADIUS.lg,
      width: 320
    },
    lg: {
      minHeight: 100,
      // Taller than input for multi-line
      paddingX: 16,
      // px-4
      paddingY: 8,
      // py-2
      fontSize: 16,
      // text-base
      borderRadius: BORDER_RADIUS.lg,
      width: 360
    }
  };
  var SIZE_VALUES3 = ["xs", "sm", "base", "lg"];
  var VARIANT_VALUES5 = ["default", "error"];
  var STATE_VALUES4 = ["default", "focus", "disabled"];
  var WITH_LABEL_VALUES2 = [false, true];
  var STATE_STYLES5 = {
    default: {
      ringVariable: "color-border",
      textColorVariable: "text-color-muted"
    },
    focus: {
      ringVariable: "color-active",
      textColorVariable: "text-color-muted"
    },
    disabled: {
      ringVariable: "color-border",
      opacity: 0.5,
      textColorVariable: "text-color-muted"
    }
  };
  var VARIANT_CONFIG4 = {
    default: {
      ringVariable: "color-border",
      label: "Message",
      description: "Enter your message here"
    },
    error: {
      ringVariable: "color-error",
      label: "Message",
      errorMessage: "Please enter a valid message"
    }
  };
  function createInputAreaComponent(size, variant, state, withLabel) {
    return __async(this, null, function* () {
      var sizeConfig = SIZE_CONFIG4[size] || SIZE_CONFIG4["base"];
      var variantConfig = VARIANT_CONFIG4[variant] || VARIANT_CONFIG4["default"];
      var stateStyle = STATE_STYLES5[state] || STATE_STYLES5["default"];
      var component = figma.createComponent();
      component.name = "size=" + size + ", variant=" + variant + ", state=" + state + ", withLabel=" + withLabel;
      component.description = "InputArea " + size + " " + variant + " in " + state + " state" + (withLabel ? " with Field wrapper" : " bare");
      component.layoutMode = "VERTICAL";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.counterAxisAlignItems = "MIN";
      component.itemSpacing = 4;
      component.fills = [];
      if (stateStyle.opacity !== void 0) {
        component.opacity = stateStyle.opacity;
      }
      if (withLabel && variantConfig.label) {
        var labelText = yield createTextNode(variantConfig.label, 14, 500);
        labelText.name = "Label";
        labelText.textAutoResize = "WIDTH_AND_HEIGHT";
        var labelVar = getVariableByName("text-color-label");
        if (labelVar) {
          bindTextColorToVariable(labelText, labelVar.id);
        }
        component.appendChild(labelText);
      }
      var textareaFrame = figma.createFrame();
      textareaFrame.name = "Textarea";
      textareaFrame.layoutMode = "HORIZONTAL";
      textareaFrame.primaryAxisAlignItems = "MIN";
      textareaFrame.counterAxisAlignItems = "MIN";
      textareaFrame.primaryAxisSizingMode = "FIXED";
      textareaFrame.counterAxisSizingMode = "FIXED";
      textareaFrame.resize(sizeConfig.width, sizeConfig.minHeight);
      textareaFrame.itemSpacing = 8;
      textareaFrame.paddingLeft = sizeConfig.paddingX;
      textareaFrame.paddingRight = sizeConfig.paddingX;
      textareaFrame.paddingTop = sizeConfig.paddingY;
      textareaFrame.paddingBottom = sizeConfig.paddingY;
      textareaFrame.cornerRadius = sizeConfig.borderRadius;
      var bgVar = getVariableByName("color-secondary");
      if (bgVar) {
        bindFillToVariable(textareaFrame, bgVar.id);
      }
      var ringVarName = variantConfig.ringVariable;
      if (state === "focus" && variant === "default") {
        ringVarName = "color-active";
      } else if (state === "focus" && variant === "error") {
        ringVarName = "color-error";
      }
      var ringVar = getVariableByName(ringVarName);
      if (ringVar) {
        bindStrokeToVariable(textareaFrame, ringVar.id, 1);
      }
      var placeholderValue = variant === "error" ? "Invalid content here..." : "Enter your message here...";
      var placeholderText = yield createTextNode(
        placeholderValue,
        sizeConfig.fontSize,
        400
      );
      placeholderText.name = "Placeholder";
      placeholderText.textAutoResize = "WIDTH_AND_HEIGHT";
      var textColorVar = variant === "error" ? getVariableByName("text-color-surface") : getVariableByName("text-color-muted");
      if (textColorVar) {
        bindTextColorToVariable(placeholderText, textColorVar.id);
      }
      textareaFrame.appendChild(placeholderText);
      component.appendChild(textareaFrame);
      if (withLabel && variantConfig.description && variant === "default") {
        var descText = yield createTextNode(variantConfig.description, 12, 400);
        descText.name = "Description";
        descText.textAutoResize = "WIDTH_AND_HEIGHT";
        var descVar = getVariableByName("text-color-muted");
        if (descVar) {
          bindTextColorToVariable(descText, descVar.id);
        }
        component.appendChild(descText);
      }
      if (withLabel && variantConfig.errorMessage && variant === "error") {
        var errorText = yield createTextNode(variantConfig.errorMessage, 12, 400);
        errorText.name = "Error";
        errorText.textAutoResize = "WIDTH_AND_HEIGHT";
        var errorVar = getVariableByName("text-color-error");
        if (errorVar) {
          bindTextColorToVariable(errorText, errorVar.id);
        }
        component.appendChild(errorText);
      }
      return component;
    });
  }
  function generateInputAreaComponents(page, startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      figma.currentPage = page;
      var components = [];
      var rowLabels = [];
      var columnHeaders = [];
      var componentGapX = 24;
      var componentGapY = 40;
      var headerRowHeight = 24;
      var labelColumnWidth = 200;
      var rowComponents = /* @__PURE__ */ new Map();
      var rowIndex = 0;
      for (var si = 0; si < SIZE_VALUES3.length; si++) {
        var size = SIZE_VALUES3[si];
        for (var wli = 0; wli < WITH_LABEL_VALUES2.length; wli++) {
          var withLabel = WITH_LABEL_VALUES2[wli];
          rowComponents.set(rowIndex, []);
          for (var vi = 0; vi < VARIANT_VALUES5.length; vi++) {
            var variant = VARIANT_VALUES5[vi];
            for (var sti = 0; sti < STATE_VALUES4.length; sti++) {
              var state = STATE_VALUES4[sti];
              var component = yield createInputAreaComponent(
                size,
                variant,
                state,
                withLabel
              );
              rowComponents.get(rowIndex).push(component);
              components.push(component);
            }
          }
          rowIndex++;
        }
      }
      var columnWidths = [];
      var rowHeights = [];
      var numColumns = VARIANT_VALUES5.length * STATE_VALUES4.length;
      var totalRows = SIZE_VALUES3.length * WITH_LABEL_VALUES2.length;
      for (var colIdx = 0; colIdx < numColumns; colIdx++) {
        var maxColWidth = 0;
        for (var rowIdx = 0; rowIdx < totalRows; rowIdx++) {
          var row = rowComponents.get(rowIdx) || [];
          var comp = row[colIdx];
          if (comp && comp.width > maxColWidth) {
            maxColWidth = comp.width;
          }
        }
        columnWidths.push(maxColWidth);
      }
      for (var rowIdx = 0; rowIdx < totalRows; rowIdx++) {
        var row = rowComponents.get(rowIdx) || [];
        var maxRowHeight = 0;
        for (var colIdx = 0; colIdx < row.length; colIdx++) {
          var comp = row[colIdx];
          if (comp && comp.height > maxRowHeight) {
            maxRowHeight = comp.height;
          }
        }
        rowHeights.push(maxRowHeight);
      }
      var yOffset = headerRowHeight;
      var currentRowIndex = 0;
      for (var si2 = 0; si2 < SIZE_VALUES3.length; si2++) {
        var sizeValue = SIZE_VALUES3[si2];
        for (var wli2 = 0; wli2 < WITH_LABEL_VALUES2.length; wli2++) {
          var withLabelValue = WITH_LABEL_VALUES2[wli2];
          var row = rowComponents.get(currentRowIndex) || [];
          var xOffset = labelColumnWidth;
          rowLabels.push({
            y: yOffset,
            text: "size=" + sizeValue + ", withLabel=" + withLabelValue
          });
          for (var colIdx = 0; colIdx < row.length; colIdx++) {
            var comp = row[colIdx];
            comp.x = xOffset;
            comp.y = yOffset;
            if (currentRowIndex === 0) {
              var variantIdx = Math.floor(colIdx / STATE_VALUES4.length);
              var stateIdx = colIdx % STATE_VALUES4.length;
              var variantVal = VARIANT_VALUES5[variantIdx];
              var stateVal = STATE_VALUES4[stateIdx];
              columnHeaders.push({
                x: xOffset,
                text: "variant=" + variantVal + ", state=" + stateVal
              });
            }
            xOffset += columnWidths[colIdx] + componentGapX;
          }
          yOffset += rowHeights[currentRowIndex] + componentGapY;
          currentRowIndex++;
        }
      }
      var componentSet = figma.combineAsVariants(components, page);
      componentSet.name = "InputArea";
      componentSet.description = "InputArea (textarea) component with size, variant, state, and withLabel properties. Use withLabel=false for bare textareas, withLabel=true for textareas with Field wrapper (label, description, error).";
      componentSet.layoutMode = "NONE";
      var contentWidth = componentSet.width + labelColumnWidth;
      var contentHeight = componentSet.height + headerRowHeight;
      var lightSection = createModeSection(page, "InputArea", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING14 * 2,
        contentHeight + SECTION_PADDING14 * 2
      );
      var darkSection = createModeSection(page, "InputArea", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING14 * 2,
        contentHeight + SECTION_PADDING14 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING14 + labelColumnWidth;
      componentSet.y = SECTION_PADDING14 + headerRowHeight;
      yield createColumnHeaders(
        columnHeaders.map(function(h) {
          return { x: h.x + SECTION_PADDING14, text: h.text };
        }),
        SECTION_PADDING14,
        lightSection.frame
      );
      for (var li = 0; li < rowLabels.length; li++) {
        var label = rowLabels[li];
        var labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING14,
          SECTION_PADDING14 + label.y + 8
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (var k = 0; k < components.length; k++) {
        var origComp = components[k];
        var instance = origComp.createInstance();
        instance.x = origComp.x + SECTION_PADDING14 + labelColumnWidth;
        instance.y = origComp.y + SECTION_PADDING14 + headerRowHeight;
        darkSection.frame.appendChild(instance);
      }
      yield createColumnHeaders(
        columnHeaders.map(function(h) {
          return { x: h.x + SECTION_PADDING14, text: h.text };
        }),
        SECTION_PADDING14,
        darkSection.frame
      );
      for (var di = 0; di < rowLabels.length; di++) {
        var darkLabel = rowLabels[di];
        var darkLabelNode = yield createRowLabel(
          darkLabel.text,
          SECTION_PADDING14,
          SECTION_PADDING14 + darkLabel.y + 8
        );
        darkSection.frame.appendChild(darkLabelNode);
      }
      var totalWidth = contentWidth + SECTION_PADDING14 * 2;
      var totalHeight = contentHeight + SECTION_PADDING14 * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      console.log(
        "Generated InputArea ComponentSet with " + components.length + " variants (light + dark)"
      );
      return startY + totalHeight + SECTION_GAP14;
    });
  }

  // scripts/figma/plugin/generators/layer-card.ts
  var SECTION_PADDING15 = 48;
  var SECTION_GAP15 = 160;
  var LAYER_CARD_CONFIG = {
    width: 280,
    borderRadius: BORDER_RADIUS.lg,
    secondary: {
      paddingX: 8,
      paddingY: 8,
      gap: 8,
      fontSize: 16,
      fontWeight: 500
    },
    primary: {
      paddingX: 16,
      paddingY: 16,
      paddingRight: 12,
      gap: 8,
      fontSize: 16,
      fontWeight: 400,
      borderRadius: BORDER_RADIUS.lg
    }
  };
  function createLayerCardComponent() {
    return __async(this, null, function* () {
      console.log("LayerCard: Creating component...");
      var config = LAYER_CARD_CONFIG;
      var component = figma.createComponent();
      console.log("LayerCard: Component created");
      component.name = "default";
      component.description = "LayerCard - A layered card component with secondary header and primary content area";
      component.layoutMode = "VERTICAL";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "FIXED";
      component.resizeWithoutConstraints(config.width, 100);
      component.itemSpacing = 0;
      component.cornerRadius = config.borderRadius;
      var rootBgVar = getVariableByName("color-surface-2");
      if (rootBgVar) {
        bindFillToVariable(component, rootBgVar.id);
      } else {
        console.log(
          "LayerCard: color-surface-2 variable not found, using fallback"
        );
        var fallbackBgVar = getVariableByName("color-surface");
        if (fallbackBgVar) {
          bindFillToVariable(component, fallbackBgVar.id);
        }
      }
      var rootRingVar = getVariableByName("color-border");
      if (rootRingVar) {
        bindStrokeToVariable(component, rootRingVar.id, 1);
      }
      var secondaryFrame = figma.createFrame();
      secondaryFrame.name = "Secondary";
      secondaryFrame.layoutMode = "HORIZONTAL";
      secondaryFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
      secondaryFrame.counterAxisAlignItems = "CENTER";
      secondaryFrame.primaryAxisSizingMode = "FIXED";
      secondaryFrame.counterAxisSizingMode = "AUTO";
      secondaryFrame.paddingLeft = config.secondary.paddingX;
      secondaryFrame.paddingRight = config.secondary.paddingX;
      secondaryFrame.paddingTop = config.secondary.paddingY;
      secondaryFrame.paddingBottom = config.secondary.paddingY;
      secondaryFrame.itemSpacing = config.secondary.gap;
      secondaryFrame.fills = [];
      console.log("LayerCard: Creating secondary text...");
      var secondaryText = yield createTextNode(
        "Next Steps",
        config.secondary.fontSize,
        config.secondary.fontWeight
      );
      console.log("LayerCard: Secondary text created");
      secondaryText.name = "Title";
      secondaryText.textAutoResize = "WIDTH_AND_HEIGHT";
      var secondaryTextVar = getVariableByName("text-color-label");
      if (secondaryTextVar) {
        bindTextColorToVariable(secondaryText, secondaryTextVar.id);
      }
      var iconButtonFrame = figma.createFrame();
      iconButtonFrame.name = "Action Button";
      iconButtonFrame.layoutMode = "HORIZONTAL";
      iconButtonFrame.primaryAxisAlignItems = "CENTER";
      iconButtonFrame.counterAxisAlignItems = "CENTER";
      iconButtonFrame.resize(28, 28);
      iconButtonFrame.cornerRadius = 4;
      iconButtonFrame.fills = [];
      var arrowIcon = createIconInstance(DEFAULT_ICONS.arrowRight, 16);
      if (arrowIcon) {
        arrowIcon.name = "Icon";
        bindIconColor(arrowIcon, "text-label");
        iconButtonFrame.appendChild(arrowIcon);
      } else {
        console.log("LayerCard: Arrow icon not found, using placeholder");
        var arrowPlaceholder = figma.createFrame();
        arrowPlaceholder.name = "Arrow Placeholder";
        arrowPlaceholder.resize(16, 16);
        arrowPlaceholder.fills = [];
        var arrowBorderVar = getVariableByName("color-border");
        if (arrowBorderVar) {
          bindStrokeToVariable(arrowPlaceholder, arrowBorderVar.id, 1);
        }
        iconButtonFrame.appendChild(arrowPlaceholder);
      }
      secondaryFrame.appendChild(secondaryText);
      secondaryFrame.appendChild(iconButtonFrame);
      component.appendChild(secondaryFrame);
      secondaryFrame.layoutSizingHorizontal = "FILL";
      var primaryFrame = figma.createFrame();
      primaryFrame.name = "Primary";
      primaryFrame.layoutMode = "VERTICAL";
      primaryFrame.primaryAxisAlignItems = "MIN";
      primaryFrame.counterAxisAlignItems = "MIN";
      primaryFrame.primaryAxisSizingMode = "AUTO";
      primaryFrame.counterAxisSizingMode = "AUTO";
      primaryFrame.paddingLeft = config.primary.paddingX;
      primaryFrame.paddingRight = config.primary.paddingRight;
      primaryFrame.paddingTop = config.primary.paddingY;
      primaryFrame.paddingBottom = config.primary.paddingY;
      primaryFrame.itemSpacing = config.primary.gap;
      primaryFrame.cornerRadius = config.primary.borderRadius;
      var primaryBgVar = getVariableByName("color-layer-card-primary");
      if (!primaryBgVar) {
        primaryBgVar = getVariableByName("color-surface");
      }
      if (primaryBgVar) {
        bindFillToVariable(primaryFrame, primaryBgVar.id);
      }
      var primaryRingVar = getVariableByName("color-color");
      if (!primaryRingVar) {
        console.log("LayerCard: color-color not found, trying color-border");
        primaryRingVar = getVariableByName("color-border");
      }
      if (primaryRingVar) {
        bindStrokeToVariable(primaryFrame, primaryRingVar.id, 1);
      } else {
        console.log("LayerCard: No ring variable found for primary section");
      }
      console.log("LayerCard: Creating primary text...");
      var primaryText = yield createTextNode(
        "Get started with Kumo",
        config.primary.fontSize,
        config.primary.fontWeight
      );
      console.log("LayerCard: Primary text created");
      primaryText.name = "Content";
      primaryText.textAutoResize = "WIDTH_AND_HEIGHT";
      var primaryTextVar = getVariableByName("text-color-surface");
      if (primaryTextVar) {
        bindTextColorToVariable(primaryText, primaryTextVar.id);
      }
      primaryFrame.appendChild(primaryText);
      component.appendChild(primaryFrame);
      primaryFrame.layoutSizingHorizontal = "FILL";
      console.log("LayerCard: Component assembly complete");
      return component;
    });
  }
  function generateLayerCardComponents(page, startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      console.log("LayerCard: Starting generation at Y=" + startY);
      try {
        figma.currentPage = page;
        var components = [];
        var rowLabels = [];
        var labelColumnWidth = 160;
        console.log("LayerCard: Calling createLayerCardComponent...");
        var component = yield createLayerCardComponent();
        console.log("LayerCard: Component returned, setting position...");
        component.x = labelColumnWidth;
        component.y = 0;
        rowLabels.push({ y: 0, text: "LayerCard" });
        components.push(component);
        console.log("LayerCard: Combining as variants...");
        var componentSet = figma.combineAsVariants(components, page);
        console.log("LayerCard: ComponentSet created");
        componentSet.name = "LayerCard";
        componentSet.description = "LayerCard - A layered card component with Secondary (header) and Primary (content) sections. Use LayerCard.Secondary for the header area and LayerCard.Primary for the main content.";
        componentSet.layoutMode = "NONE";
        var contentWidth = componentSet.width + labelColumnWidth;
        var contentHeight = componentSet.height;
        var lightSection = createModeSection(page, "LayerCard", "light");
        lightSection.frame.resize(
          contentWidth + SECTION_PADDING15 * 2,
          contentHeight + SECTION_PADDING15 * 2
        );
        var darkSection = createModeSection(page, "LayerCard", "dark");
        darkSection.frame.resize(
          contentWidth + SECTION_PADDING15 * 2,
          contentHeight + SECTION_PADDING15 * 2
        );
        lightSection.frame.appendChild(componentSet);
        componentSet.x = SECTION_PADDING15 + labelColumnWidth;
        componentSet.y = SECTION_PADDING15;
        for (var li = 0; li < rowLabels.length; li++) {
          var label = rowLabels[li];
          var labelNode = yield createRowLabel(
            label.text,
            SECTION_PADDING15,
            SECTION_PADDING15 + label.y + 8
          );
          lightSection.frame.appendChild(labelNode);
        }
        for (var k = 0; k < components.length; k++) {
          var origComp = components[k];
          var instance = origComp.createInstance();
          instance.x = origComp.x + SECTION_PADDING15 + labelColumnWidth;
          instance.y = origComp.y + SECTION_PADDING15;
          darkSection.frame.appendChild(instance);
        }
        for (var di = 0; di < rowLabels.length; di++) {
          var darkLabel = rowLabels[di];
          var darkLabelNode = yield createRowLabel(
            darkLabel.text,
            SECTION_PADDING15,
            SECTION_PADDING15 + darkLabel.y + 8
          );
          darkSection.frame.appendChild(darkLabelNode);
        }
        var totalWidth = contentWidth + SECTION_PADDING15 * 2;
        var totalHeight = contentHeight + SECTION_PADDING15 * 2;
        lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
        darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
        lightSection.section.x = 100;
        lightSection.section.y = startY;
        darkSection.section.x = 100 + totalWidth + 50;
        darkSection.section.y = startY;
        console.log("Generated LayerCard ComponentSet (light + dark)");
        console.log(
          "LayerCard dimensions: " + totalWidth + "x" + totalHeight + " at Y=" + startY
        );
        return startY + totalHeight + SECTION_GAP15;
      } catch (error) {
        var errorMessage = error instanceof Error ? error.message : String(error);
        var errorStack = error instanceof Error ? error.stack : "";
        console.error("LayerCard generation failed: " + errorMessage);
        console.error("Stack: " + errorStack);
        throw error;
      }
    });
  }

  // scripts/figma/plugin/generated/loader-data.json
  var loader_data_default = {
    viewBox: "0 0 24 24",
    width: 24,
    height: 24,
    circles: [
      {
        cx: 12,
        cy: 12,
        r: 9.5,
        fill: "none",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeDasharray: "42 150",
        strokeDashoffset: "-16"
      },
      {
        cx: 12,
        cy: 12,
        r: 9.5,
        fill: "none",
        opacity: 0.1,
        strokeWidth: 2,
        strokeLinecap: "round"
      }
    ],
    sizes: {
      sm: {
        value: 16,
        description: "Small loader for inline use"
      },
      base: {
        value: 24,
        description: "Default loader size"
      },
      lg: {
        value: 32,
        description: "Large loader for prominent loading states"
      }
    },
    svgString: '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n  <circle\n    cx="12"\n    cy="12"\n    r="9.5"\n    fill="none"\n    stroke="currentColor"\n    stroke-width="2"\n    stroke-linecap="round"\n    opacity="0.1"\n  />\n  <path\n    d="M 12 2.5 A 9.5 9.5 0 1 1 3.072920102533871 15.249191361593855"\n    fill="none"\n    stroke="currentColor"\n    stroke-width="2"\n    stroke-linecap="round"\n  />\n</svg>'
  };

  // scripts/figma/plugin/generators/loader.ts
  var SECTION_PADDING16 = 48;
  var SECTION_GAP16 = 160;
  function createLoaderComponent(size) {
    return __async(this, null, function* () {
      var sizeConfig = loader_data_default.sizes[size];
      var sizeValue = sizeConfig.value;
      var component = figma.createComponent();
      component.name = "size=" + size;
      component.description = sizeConfig.description;
      component.resize(sizeValue, sizeValue);
      component.fills = [];
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisAlignItems = "CENTER";
      component.counterAxisAlignItems = "CENTER";
      var svgString = loader_data_default.svgString;
      try {
        var svgNode = figma.createNodeFromSvg(svgString);
        svgNode.name = "Spinner";
        svgNode.resize(sizeValue, sizeValue);
        svgNode.constraints = {
          horizontal: "SCALE",
          vertical: "SCALE"
        };
        var strokeVar = getVariableByName("text-color-surface");
        if (strokeVar) {
          traverseAndBindStrokes(svgNode, strokeVar.id);
        }
        component.appendChild(svgNode);
      } catch (error) {
        console.error("Failed to create SVG node for Loader:", error);
        var fallbackCircle = figma.createEllipse();
        fallbackCircle.name = "Fallback";
        fallbackCircle.resize(sizeValue - 4, sizeValue - 4);
        fallbackCircle.x = 2;
        fallbackCircle.y = 2;
        fallbackCircle.fills = [];
        fallbackCircle.strokes = [
          { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
        ];
        fallbackCircle.strokeWeight = 2;
        component.appendChild(fallbackCircle);
      }
      return component;
    });
  }
  function traverseAndBindStrokes(node, variableId) {
    if (node.type === "VECTOR" || node.type === "ELLIPSE" || node.type === "RECTANGLE" || node.type === "LINE" || node.type === "POLYGON" || node.type === "STAR") {
      var strokeNode = node;
      if (strokeNode.strokes && strokeNode.strokes.length > 0) {
        var strokeWeight = typeof strokeNode.strokeWeight === "number" ? strokeNode.strokeWeight : 1;
        bindStrokeToVariable(node, variableId, strokeWeight);
      }
    }
    if (node.type === "FRAME" || node.type === "GROUP") {
      var containerNode = node;
      for (var i = 0; i < containerNode.children.length; i++) {
        traverseAndBindStrokes(containerNode.children[i], variableId);
      }
    }
  }
  function generateLoaderComponents(page, startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      console.log("Loader: Starting generation at Y=" + startY);
      try {
        figma.currentPage = page;
        var sizes = Object.keys(loader_data_default.sizes);
        var components = [];
        var rowLabels = [];
        var labelColumnWidth = 120;
        var componentGap = 24;
        var currentY = 0;
        for (var i = 0; i < sizes.length; i++) {
          var size = sizes[i];
          var sizeValue = loader_data_default.sizes[size].value;
          console.log("Loader: Creating size=" + size);
          var component = yield createLoaderComponent(size);
          component.x = labelColumnWidth;
          component.y = currentY;
          rowLabels.push({ y: currentY, text: "size=" + size });
          components.push(component);
          currentY += sizeValue + componentGap;
        }
        console.log("Loader: Combining as variants...");
        var componentSet = figma.combineAsVariants(components, page);
        componentSet.name = "Loader";
        componentSet.description = "Loader - Circular loading spinner. Sizes: sm (16px), base (24px), lg (32px). Uses currentColor for stroke, so set text color on parent to change color. Static representation of animated spinner from loader.tsx.";
        componentSet.layoutMode = "NONE";
        var contentWidth = componentSet.width + labelColumnWidth;
        var contentHeight = componentSet.height;
        var lightSection = createModeSection(page, "Loader", "light");
        lightSection.frame.resize(
          contentWidth + SECTION_PADDING16 * 2,
          contentHeight + SECTION_PADDING16 * 2
        );
        var darkSection = createModeSection(page, "Loader", "dark");
        darkSection.frame.resize(
          contentWidth + SECTION_PADDING16 * 2,
          contentHeight + SECTION_PADDING16 * 2
        );
        lightSection.frame.appendChild(componentSet);
        componentSet.x = SECTION_PADDING16 + labelColumnWidth;
        componentSet.y = SECTION_PADDING16;
        for (var li = 0; li < rowLabels.length; li++) {
          var label = rowLabels[li];
          var labelNode = yield createRowLabel(
            label.text,
            SECTION_PADDING16,
            SECTION_PADDING16 + label.y + 4
          );
          lightSection.frame.appendChild(labelNode);
        }
        for (var k = 0; k < components.length; k++) {
          var origComp = components[k];
          var instance = origComp.createInstance();
          instance.x = SECTION_PADDING16 + labelColumnWidth;
          instance.y = origComp.y + SECTION_PADDING16;
          darkSection.frame.appendChild(instance);
        }
        for (var di = 0; di < rowLabels.length; di++) {
          var darkLabel = rowLabels[di];
          var darkLabelNode = yield createRowLabel(
            darkLabel.text,
            SECTION_PADDING16,
            SECTION_PADDING16 + darkLabel.y + 4
          );
          darkSection.frame.appendChild(darkLabelNode);
        }
        var totalWidth = contentWidth + SECTION_PADDING16 * 2;
        var totalHeight = contentHeight + SECTION_PADDING16 * 2;
        lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
        darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
        lightSection.section.x = 100;
        lightSection.section.y = startY;
        darkSection.section.x = 100 + totalWidth + 50;
        darkSection.section.y = startY;
        console.log(
          "Generated Loader ComponentSet with " + sizes.length + " variants (light + dark)"
        );
        return startY + totalHeight + SECTION_GAP16;
      } catch (error) {
        var errorMessage = error instanceof Error ? error.message : String(error);
        var errorStack = error instanceof Error ? error.stack : "";
        console.error("Loader generation failed: " + errorMessage);
        console.error("Stack: " + errorStack);
        throw error;
      }
    });
  }

  // scripts/figma/plugin/generators/link-button.ts
  var buttonProps2 = component_registry_default.components.Button.props;
  var variantProp5 = buttonProps2.variant;
  var sizeProp4 = buttonProps2.size;
  var SECTION_PADDING17 = 48;
  var SECTION_GAP17 = 160;
  function createLinkButtonComponent(variant, size, hasIcon) {
    return __async(this, null, function* () {
      var variantClasses = variantProp5.classes[variant] || "";
      var sizeClasses = sizeProp4.classes[size] || "";
      var variantDesc = variantProp5.descriptions[variant] || "";
      var sizeDesc = sizeProp4.descriptions[size] || "";
      var variantStyles = parseTailwindClasses(variantClasses);
      var sizeStyles = parseTailwindClasses(sizeClasses);
      var component = figma.createComponent();
      component.name = "variant=" + variant + ", size=" + size + ", hasIcon=" + hasIcon;
      component.description = variantDesc + ". " + sizeDesc;
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisAlignItems = "CENTER";
      component.counterAxisAlignItems = "CENTER";
      component.paddingLeft = sizeStyles.paddingX || 12;
      component.paddingRight = sizeStyles.paddingX || 12;
      component.paddingTop = 0;
      component.paddingBottom = 0;
      component.itemSpacing = sizeStyles.gap || 6;
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "FIXED";
      component.resize(100, sizeStyles.height || 36);
      var cornerRadius = sizeStyles.borderRadius !== void 0 ? sizeStyles.borderRadius : 8;
      component.cornerRadius = cornerRadius;
      if (variantStyles.fillVariable) {
        var fillVar = getVariableByName(variantStyles.fillVariable);
        if (fillVar) {
          bindFillToVariable(component, fillVar.id);
        }
      } else {
        component.fills = [];
      }
      if (variantStyles.hasBorder && variantStyles.strokeVariable) {
        var strokeVar = getVariableByName(variantStyles.strokeVariable);
        if (strokeVar) {
          bindStrokeToVariable(component, strokeVar.id, 1);
        }
      }
      if (hasIcon) {
        var icon = getButtonIcon(DEFAULT_ICONS.arrowRight, size);
        if (variantStyles.isWhiteText) {
          bindIconColor(icon, "text-white");
        } else if (variantStyles.textVariable) {
          bindIconColor(icon, variantStyles.textVariable);
        } else {
          bindIconColor(icon, "text-surface");
        }
        component.appendChild(icon);
      }
      var fontWeight = 500;
      var textNode = yield createTextNode(
        "Link Button",
        sizeStyles.fontSize || 16,
        fontWeight
      );
      textNode.name = "Label";
      if (variantStyles.isWhiteText) {
        setWhiteTextColor(textNode);
      } else if (variantStyles.textVariable) {
        var textVar = getVariableByName(variantStyles.textVariable);
        if (textVar) {
          bindTextColorToVariable(textNode, textVar.id);
        }
      }
      component.appendChild(textNode);
      return component;
    });
  }
  function generateLinkButtonComponents(page, startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      figma.currentPage = page;
      var variants = variantProp5.values;
      var sizes = sizeProp4.values;
      var hasIconOptions = [false, true];
      var components = [];
      var rowLabels = [];
      var columnHeaders = [];
      var columnHeadersRecorded = false;
      var componentGap = 20;
      var iconGap = 40;
      var rowGap = 80;
      var headerRowHeight = 24;
      var labelColumnWidth = 220;
      for (var v = 0; v < variants.length; v++) {
        rowLabels.push({
          y: v * rowGap + headerRowHeight,
          text: "variant=" + variants[v]
        });
        for (var hi = 0; hi < hasIconOptions.length; hi++) {
          var currentX = labelColumnWidth + hi * (sizes.length * 140 + iconGap);
          for (var sz = 0; sz < sizes.length; sz++) {
            var component = yield createLinkButtonComponent(
              variants[v],
              sizes[sz],
              hasIconOptions[hi]
            );
            component.x = currentX;
            component.y = v * rowGap + headerRowHeight;
            if (!columnHeadersRecorded) {
              var headerText = "size=" + sizes[sz] + (hasIconOptions[hi] ? " +icon" : "");
              columnHeaders.push({ x: currentX, text: headerText });
            }
            currentX = currentX + component.width + componentGap;
            components.push(component);
          }
        }
        if (!columnHeadersRecorded) {
          columnHeadersRecorded = true;
        }
      }
      var componentSet = figma.combineAsVariants(components, page);
      componentSet.name = "LinkButton";
      componentSet.description = "LinkButton component for navigation with variant, size, and icon options";
      componentSet.layoutMode = "NONE";
      var contentWidth = componentSet.width + labelColumnWidth;
      var contentHeight = componentSet.height + headerRowHeight;
      var lightSection = createModeSection(page, "LinkButton", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING17 * 2,
        contentHeight + SECTION_PADDING17 * 2
      );
      var darkSection = createModeSection(page, "LinkButton", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING17 * 2,
        contentHeight + SECTION_PADDING17 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING17 + labelColumnWidth;
      componentSet.y = SECTION_PADDING17 + headerRowHeight;
      yield createColumnHeaders(
        columnHeaders.map(function(h) {
          return { x: h.x + SECTION_PADDING17, text: h.text };
        }),
        SECTION_PADDING17,
        lightSection.frame
      );
      for (var li = 0; li < rowLabels.length; li++) {
        var label = rowLabels[li];
        var labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING17,
          SECTION_PADDING17 + label.y + 12
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (var i = 0; i < components.length; i++) {
        var comp = components[i];
        var instance = comp.createInstance();
        instance.x = comp.x + SECTION_PADDING17 + labelColumnWidth;
        instance.y = comp.y + SECTION_PADDING17 + headerRowHeight;
        darkSection.frame.appendChild(instance);
      }
      yield createColumnHeaders(
        columnHeaders.map(function(h) {
          return { x: h.x + SECTION_PADDING17, text: h.text };
        }),
        SECTION_PADDING17,
        darkSection.frame
      );
      for (var di = 0; di < rowLabels.length; di++) {
        var darkLabel = rowLabels[di];
        var darkLabelNode = yield createRowLabel(
          darkLabel.text,
          SECTION_PADDING17,
          SECTION_PADDING17 + darkLabel.y + 12
        );
        darkSection.frame.appendChild(darkLabelNode);
      }
      var totalWidth = contentWidth + SECTION_PADDING17 * 2;
      var totalHeight = contentHeight + SECTION_PADDING17 * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      var totalComponents = variants.length * sizes.length * hasIconOptions.length;
      console.log(
        "\u2705 Generated LinkButton ComponentSet with " + totalComponents + " variants (light + dark)"
      );
      return startY + totalHeight + SECTION_GAP17;
    });
  }
  var LINK_BUTTON_VARIANTS_EXPORT = variantProp5.values;
  var LINK_BUTTON_SIZES_EXPORT = sizeProp4.values;

  // scripts/figma/plugin/generators/menubar.ts
  var SECTION_PADDING18 = 48;
  var SECTION_GAP18 = 160;
  var MENUBAR_CONFIG = {
    /** Height of the menubar - compact, just enough for icon + small padding */
    height: 32,
    /** Width of each menu option button (w-11 = 44px, but visually looks ~36px) */
    buttonWidth: 36,
    /** Icon size inside buttons */
    iconSize: 18,
    /** Border radius for the container (rounded-lg = 8px) */
    borderRadius: 8,
    /** Border radius for individual buttons (rounded-md = 6px) */
    buttonBorderRadius: 6
  };
  var DEFAULT_OPTIONS = [
    { icon: "ph-house", tooltip: "Home", id: "home" },
    { icon: "ph-magnifying-glass", tooltip: "Search", id: "search" },
    { icon: "ph-bell", tooltip: "Notifications", id: "notifications" },
    { icon: "ph-gear", tooltip: "Settings", id: "settings" }
  ];
  function createMenuOption(iconId, isActive) {
    var button = figma.createFrame();
    button.name = isActive ? "Option (active)" : "Option";
    button.resize(MENUBAR_CONFIG.buttonWidth, MENUBAR_CONFIG.height);
    button.layoutMode = "HORIZONTAL";
    button.primaryAxisAlignItems = "CENTER";
    button.counterAxisAlignItems = "CENTER";
    button.primaryAxisSizingMode = "FIXED";
    button.counterAxisSizingMode = "FIXED";
    button.paddingTop = 0;
    button.paddingBottom = 0;
    button.paddingLeft = 0;
    button.paddingRight = 0;
    button.cornerRadius = MENUBAR_CONFIG.buttonBorderRadius;
    if (isActive) {
      var surfaceVar = getVariableByName("color-surface");
      if (surfaceVar) {
        bindFillToVariable(button, surfaceVar.id);
      }
    } else {
      var colorVar = getVariableByName("color-color");
      if (colorVar) {
        bindFillToVariable(button, colorVar.id);
      }
    }
    var icon = createIconInstance(iconId, MENUBAR_CONFIG.iconSize);
    if (icon) {
      icon.name = "Icon";
      bindIconColor(icon, "fill-surface-inverse");
      button.appendChild(icon);
    }
    return button;
  }
  function createMenuBarComponent(activeIndex) {
    return __async(this, null, function* () {
      var component = figma.createComponent();
      if (activeIndex >= 0 && activeIndex < DEFAULT_OPTIONS.length) {
        component.name = "active=" + DEFAULT_OPTIONS[activeIndex].id;
      } else {
        component.name = "active=none";
      }
      component.description = 'MenuBar navigation component with icon buttons. Active button shows elevated background. Note: This is the fit-content version; React component uses className="w-fit" for this behavior.';
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "FIXED";
      component.resize(100, MENUBAR_CONFIG.height);
      component.itemSpacing = 0;
      component.paddingLeft = 1;
      component.paddingRight = 0;
      component.paddingTop = 0;
      component.paddingBottom = 0;
      component.cornerRadius = MENUBAR_CONFIG.borderRadius;
      var borderVar = getVariableByName("color-color");
      if (borderVar) {
        bindStrokeToVariable(component, borderVar.id, 1);
      }
      var bgVar = getVariableByName("color-color");
      if (bgVar) {
        bindFillToVariable(component, bgVar.id);
      }
      component.effects = [
        {
          type: "DROP_SHADOW",
          color: { r: 0, g: 0, b: 0, a: 0.05 },
          offset: { x: 0, y: 1 },
          radius: 2,
          spread: 0,
          visible: true,
          blendMode: "NORMAL"
        }
      ];
      for (var i = 0; i < DEFAULT_OPTIONS.length; i++) {
        var option = DEFAULT_OPTIONS[i];
        var isActive = i === activeIndex;
        var button = createMenuOption(option.icon, isActive);
        button.name = option.id;
        component.appendChild(button);
      }
      return component;
    });
  }
  function generateMenuBarComponents(page, startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      console.log("MenuBar: Starting generation at Y=" + startY);
      try {
        figma.currentPage = page;
        var components = [];
        var rowLabels = [];
        var labelColumnWidth = 160;
        var rowGap = 24;
        var currentY = 0;
        for (var i = 0; i < DEFAULT_OPTIONS.length; i++) {
          var option = DEFAULT_OPTIONS[i];
          console.log("MenuBar: Creating active=" + option.id);
          var component = yield createMenuBarComponent(i);
          component.x = labelColumnWidth;
          component.y = currentY;
          rowLabels.push({ y: currentY, text: "active=" + option.id });
          components.push(component);
          currentY += MENUBAR_CONFIG.height + rowGap;
        }
        console.log("MenuBar: Combining as variants...");
        var componentSet = figma.combineAsVariants(components, page);
        componentSet.name = "MenuBar";
        componentSet.description = 'MenuBar - Horizontal icon navigation bar. Shows active state with elevated button background. Icons: Home, Search, Notifications, Settings. Note: Figma version uses fit-content width; React equivalent is className="w-fit".';
        componentSet.layoutMode = "NONE";
        var contentWidth = componentSet.width + labelColumnWidth;
        var contentHeight = componentSet.height;
        var lightSection = createModeSection(page, "MenuBar", "light");
        lightSection.frame.resize(
          contentWidth + SECTION_PADDING18 * 2,
          contentHeight + SECTION_PADDING18 * 2
        );
        var darkSection = createModeSection(page, "MenuBar", "dark");
        darkSection.frame.resize(
          contentWidth + SECTION_PADDING18 * 2,
          contentHeight + SECTION_PADDING18 * 2
        );
        lightSection.frame.appendChild(componentSet);
        componentSet.x = SECTION_PADDING18 + labelColumnWidth;
        componentSet.y = SECTION_PADDING18;
        for (var li = 0; li < rowLabels.length; li++) {
          var label = rowLabels[li];
          var labelNode = yield createRowLabel(
            label.text,
            SECTION_PADDING18,
            SECTION_PADDING18 + label.y + 12
            // Center vertically with menubar
          );
          lightSection.frame.appendChild(labelNode);
        }
        for (var k = 0; k < components.length; k++) {
          var origComp = components[k];
          var instance = origComp.createInstance();
          instance.x = SECTION_PADDING18 + labelColumnWidth;
          instance.y = origComp.y + SECTION_PADDING18;
          darkSection.frame.appendChild(instance);
        }
        for (var di = 0; di < rowLabels.length; di++) {
          var darkLabel = rowLabels[di];
          var darkLabelNode = yield createRowLabel(
            darkLabel.text,
            SECTION_PADDING18,
            SECTION_PADDING18 + darkLabel.y + 12
          );
          darkSection.frame.appendChild(darkLabelNode);
        }
        var totalWidth = contentWidth + SECTION_PADDING18 * 2;
        var totalHeight = contentHeight + SECTION_PADDING18 * 2;
        lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
        darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
        lightSection.section.x = 100;
        lightSection.section.y = startY;
        darkSection.section.x = 100 + totalWidth + 50;
        darkSection.section.y = startY;
        console.log(
          "Generated MenuBar ComponentSet with " + DEFAULT_OPTIONS.length + " variants (light + dark)"
        );
        return startY + totalHeight + SECTION_GAP18;
      } catch (error) {
        var errorMessage = error instanceof Error ? error.message : String(error);
        var errorStack = error instanceof Error ? error.stack : "";
        console.error("MenuBar generation failed: " + errorMessage);
        console.error("Stack: " + errorStack);
        throw error;
      }
    });
  }

  // scripts/figma/plugin/generators/meter.ts
  var METER_WIDTH = 240;
  var METER_TRACK_HEIGHT = 8;
  var METER_GAP = 8;
  var SECTION_PADDING19 = 48;
  var SECTION_GAP19 = 160;
  function createMeterComponent(label, fillPercentage) {
    return __async(this, null, function* () {
      const component = figma.createComponent();
      component.name = "fill=" + fillPercentage;
      component.description = "Meter at " + fillPercentage + "% fill";
      component.layoutMode = "VERTICAL";
      component.primaryAxisAlignItems = "MIN";
      component.counterAxisAlignItems = "MIN";
      component.itemSpacing = METER_GAP;
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      const headerRow = figma.createFrame();
      headerRow.name = "Header";
      headerRow.layoutMode = "HORIZONTAL";
      headerRow.primaryAxisAlignItems = "SPACE_BETWEEN";
      headerRow.counterAxisAlignItems = "CENTER";
      headerRow.primaryAxisSizingMode = "FIXED";
      headerRow.counterAxisSizingMode = "AUTO";
      headerRow.resize(METER_WIDTH, 20);
      headerRow.fills = [];
      const labelText = yield createTextNode(label, 12, 400);
      labelText.name = "Label";
      const labelVar = getVariableByName("text-color-label");
      if (labelVar) {
        bindTextColorToVariable(labelText, labelVar.id);
      }
      const valueText = yield createTextNode(fillPercentage + "%", 14, 500);
      valueText.name = "Value";
      const surfaceTextVar = getVariableByName("text-color-surface");
      if (surfaceTextVar) {
        bindTextColorToVariable(valueText, surfaceTextVar.id);
      }
      headerRow.appendChild(labelText);
      headerRow.appendChild(valueText);
      const track = figma.createFrame();
      track.name = "Track";
      track.layoutMode = "NONE";
      track.resize(METER_WIDTH, METER_TRACK_HEIGHT);
      track.cornerRadius = 9999;
      const bgColorVar = getVariableByName("color-color-4");
      if (bgColorVar) {
        bindFillToVariable(track, bgColorVar.id);
      } else {
        track.fills = [
          {
            type: "SOLID",
            color: { r: 0.9, g: 0.9, b: 0.9 }
          }
        ];
      }
      const indicator = figma.createFrame();
      indicator.name = "Indicator";
      indicator.layoutMode = "NONE";
      const indicatorWidth = METER_WIDTH * fillPercentage / 100;
      indicator.resize(indicatorWidth, METER_TRACK_HEIGHT);
      indicator.cornerRadius = 9999;
      const primaryVar = getVariableByName("color-primary");
      if (primaryVar) {
        bindFillToVariable(indicator, primaryVar.id);
      } else {
        indicator.fills = [
          {
            type: "SOLID",
            color: { r: 0, g: 0.5, b: 1 }
          }
        ];
      }
      indicator.x = 0;
      indicator.y = 0;
      track.appendChild(indicator);
      component.appendChild(headerRow);
      component.appendChild(track);
      return component;
    });
  }
  function generateMeterComponents(startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      var componentsPage = figma.root.children.find(function(page) {
        return page.type === "PAGE" && page.name === "Components";
      });
      if (!componentsPage) {
        componentsPage = figma.createPage();
        componentsPage.name = "Components";
      }
      figma.currentPage = componentsPage;
      const fillLevels = [0, 25, 50, 75, 100];
      const components = [];
      const rowLabels = [];
      const rowGap = 40;
      const labelColumnWidth = 180;
      var currentY = 0;
      for (var i = 0; i < fillLevels.length; i++) {
        const fillLevel = fillLevels[i];
        const component = yield createMeterComponent("Progress", fillLevel);
        rowLabels.push({ y: currentY, text: "fill=" + fillLevel });
        component.x = labelColumnWidth;
        component.y = currentY;
        currentY += component.height + rowGap;
        components.push(component);
      }
      const componentSet = figma.combineAsVariants(components, componentsPage);
      componentSet.name = "Meter";
      componentSet.description = "Meter component showing progress at different fill levels";
      const contentWidth = componentSet.width + labelColumnWidth;
      const contentHeight = componentSet.height;
      const lightSection = createModeSection(componentsPage, "Meter", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING19 * 2,
        contentHeight + SECTION_PADDING19 * 2
      );
      const darkSection = createModeSection(componentsPage, "Meter", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING19 * 2,
        contentHeight + SECTION_PADDING19 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING19 + labelColumnWidth;
      componentSet.y = SECTION_PADDING19;
      for (var j = 0; j < rowLabels.length; j++) {
        const label = rowLabels[j];
        const labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING19,
          SECTION_PADDING19 + label.y + 8
          // +8 to vertically center with meter
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (var k = 0; k < components.length; k++) {
        const component = components[k];
        const instance = component.createInstance();
        instance.x = component.x + SECTION_PADDING19 + labelColumnWidth;
        instance.y = component.y + SECTION_PADDING19;
        darkSection.frame.appendChild(instance);
      }
      for (var m = 0; m < rowLabels.length; m++) {
        const label = rowLabels[m];
        const labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING19,
          SECTION_PADDING19 + label.y + 8
        );
        darkSection.frame.appendChild(labelNode);
      }
      const totalWidth = contentWidth + SECTION_PADDING19 * 2;
      const totalHeight = contentHeight + SECTION_PADDING19 * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      console.log(
        "\u2705 Generated Meter ComponentSet with " + fillLevels.length + " fill levels (light + dark)"
      );
      return startY + totalHeight + SECTION_GAP19;
    });
  }

  // scripts/figma/plugin/generators/pagination.ts
  var PAGINATION_HEIGHT = 36;
  var BUTTON_SIZE = 36;
  var INPUT_WIDTH = 50;
  var ICON_SIZE2 = 16;
  var GAP = 0;
  var BORDER_RADIUS2 = 6;
  var SECTION_PADDING20 = 48;
  var SECTION_GAP20 = 160;
  function createNavButton(iconId, ariaLabel, position, disabled) {
    return __async(this, null, function* () {
      var button = figma.createFrame();
      button.name = ariaLabel;
      button.layoutMode = "HORIZONTAL";
      button.primaryAxisAlignItems = "CENTER";
      button.counterAxisAlignItems = "CENTER";
      button.primaryAxisSizingMode = "FIXED";
      button.counterAxisSizingMode = "FIXED";
      button.resize(BUTTON_SIZE, BUTTON_SIZE);
      if (position === "first") {
        button.topLeftRadius = BORDER_RADIUS2;
        button.bottomLeftRadius = BORDER_RADIUS2;
        button.topRightRadius = 0;
        button.bottomRightRadius = 0;
      } else if (position === "last") {
        button.topLeftRadius = 0;
        button.bottomLeftRadius = 0;
        button.topRightRadius = BORDER_RADIUS2;
        button.bottomRightRadius = BORDER_RADIUS2;
      } else if (position === "single") {
        button.cornerRadius = BORDER_RADIUS2;
      } else {
        button.cornerRadius = 0;
      }
      var bgVar = getVariableByName("color-surface-2");
      if (bgVar) {
        bindFillToVariable(button, bgVar.id);
      }
      var borderVar = getVariableByName("color-border");
      if (borderVar) {
        bindStrokeToVariable(button, borderVar.id, 1);
      }
      var icon = createIconInstance(iconId, ICON_SIZE2);
      if (icon) {
        var iconColorVar = disabled ? "text-color-disabled" : "text-color-surface";
        bindIconColor(icon, iconColorVar);
        button.appendChild(icon);
      }
      return button;
    });
  }
  function createPageInput(pageNumber) {
    return __async(this, null, function* () {
      var input = figma.createFrame();
      input.name = "Page Input";
      input.layoutMode = "HORIZONTAL";
      input.primaryAxisAlignItems = "CENTER";
      input.counterAxisAlignItems = "CENTER";
      input.primaryAxisSizingMode = "FIXED";
      input.counterAxisSizingMode = "FIXED";
      input.resize(INPUT_WIDTH, BUTTON_SIZE);
      input.cornerRadius = 0;
      var bgVar = getVariableByName("color-surface-2");
      if (bgVar) {
        bindFillToVariable(input, bgVar.id);
      }
      var borderVar = getVariableByName("color-border");
      if (borderVar) {
        bindStrokeToVariable(input, borderVar.id, 1);
      }
      var text = yield createTextNode(pageNumber, 14, 400);
      text.name = "Page Number";
      text.textAlignHorizontal = "CENTER";
      var textColorVar = getVariableByName("text-color-surface");
      if (textColorVar) {
        bindTextColorToVariable(text, textColorVar.id);
      }
      input.appendChild(text);
      return input;
    });
  }
  function createShowingText(lower, upper, total) {
    return __async(this, null, function* () {
      var text = yield createTextNode(
        "Showing " + lower + "-" + upper + " of " + total,
        14,
        400
      );
      text.name = "Showing Text";
      var labelVar = getVariableByName("text-color-label");
      if (labelVar) {
        bindTextColorToVariable(text, labelVar.id);
      }
      return text;
    });
  }
  function createInputGroup(currentPage, maxPage) {
    return __async(this, null, function* () {
      var group = figma.createFrame();
      group.name = "InputGroup";
      group.layoutMode = "HORIZONTAL";
      group.primaryAxisAlignItems = "MIN";
      group.counterAxisAlignItems = "CENTER";
      group.primaryAxisSizingMode = "AUTO";
      group.counterAxisSizingMode = "AUTO";
      group.itemSpacing = GAP;
      group.fills = [];
      var isFirstPage = currentPage <= 1;
      var isLastPage = currentPage >= maxPage;
      var firstBtn = yield createNavButton(
        "ph-caret-double-left",
        "First page",
        "first",
        isFirstPage
      );
      group.appendChild(firstBtn);
      var prevBtn = yield createNavButton(
        "ph-caret-left",
        "Previous page",
        "middle",
        isFirstPage
      );
      group.appendChild(prevBtn);
      var pageInput = yield createPageInput(String(currentPage));
      group.appendChild(pageInput);
      var nextBtn = yield createNavButton(
        "ph-caret-right",
        "Next page",
        "middle",
        isLastPage
      );
      group.appendChild(nextBtn);
      var lastBtn = yield createNavButton(
        "ph-caret-double-right",
        "Last page",
        "last",
        isLastPage
      );
      group.appendChild(lastBtn);
      return group;
    });
  }
  function createPaginationComponent(page, perPage, totalCount, variantLabel) {
    return __async(this, null, function* () {
      var component = figma.createComponent();
      component.name = variantLabel;
      component.description = "Pagination at page " + page;
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisAlignItems = "SPACE_BETWEEN";
      component.counterAxisAlignItems = "CENTER";
      component.primaryAxisSizingMode = "FIXED";
      component.counterAxisSizingMode = "AUTO";
      component.itemSpacing = 8;
      component.resize(400, PAGINATION_HEIGHT);
      component.fills = [];
      var lower = page * perPage - perPage + 1;
      var upper = Math.min(page * perPage, totalCount);
      var maxPage = Math.ceil(totalCount / perPage);
      var showingText = yield createShowingText(lower, upper, totalCount);
      component.appendChild(showingText);
      var inputGroup = yield createInputGroup(page, maxPage);
      component.appendChild(inputGroup);
      return component;
    });
  }
  function generatePaginationComponents(startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      var componentsPage = figma.root.children.find(function(page) {
        return page.type === "PAGE" && page.name === "Components";
      });
      if (!componentsPage) {
        componentsPage = figma.createPage();
        componentsPage.name = "Components";
      }
      figma.currentPage = componentsPage;
      var pageStates = [
        { page: 1, label: "state=first" },
        // First page (prev disabled)
        { page: 5, label: "state=middle" },
        // Middle page (all enabled)
        { page: 10, label: "state=last" }
        // Last page (next disabled)
      ];
      var perPage = 10;
      var totalCount = 100;
      var components = [];
      var rowLabels = [];
      var rowGap = 48;
      var labelColumnWidth = 180;
      var currentY = 0;
      for (var i = 0; i < pageStates.length; i++) {
        var state = pageStates[i];
        var component = yield createPaginationComponent(
          state.page,
          perPage,
          totalCount,
          state.label
        );
        rowLabels.push({ y: currentY, text: state.label });
        component.x = labelColumnWidth;
        component.y = currentY;
        currentY += component.height + rowGap;
        components.push(component);
      }
      var componentSet = figma.combineAsVariants(components, componentsPage);
      componentSet.name = "Pagination";
      componentSet.description = "Pagination component showing page navigation at different states";
      var contentWidth = componentSet.width + labelColumnWidth;
      var contentHeight = componentSet.height;
      var lightSection = createModeSection(componentsPage, "Pagination", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING20 * 2,
        contentHeight + SECTION_PADDING20 * 2
      );
      var darkSection = createModeSection(componentsPage, "Pagination", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING20 * 2,
        contentHeight + SECTION_PADDING20 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING20 + labelColumnWidth;
      componentSet.y = SECTION_PADDING20;
      for (var j = 0; j < rowLabels.length; j++) {
        var label = rowLabels[j];
        var labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING20,
          SECTION_PADDING20 + label.y + 10
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (var k = 0; k < components.length; k++) {
        var comp = components[k];
        var instance = comp.createInstance();
        instance.x = comp.x + SECTION_PADDING20 + labelColumnWidth;
        instance.y = comp.y + SECTION_PADDING20;
        darkSection.frame.appendChild(instance);
      }
      for (var m = 0; m < rowLabels.length; m++) {
        var darkLabel = rowLabels[m];
        var darkLabelNode = yield createRowLabel(
          darkLabel.text,
          SECTION_PADDING20,
          SECTION_PADDING20 + darkLabel.y + 10
        );
        darkSection.frame.appendChild(darkLabelNode);
      }
      var totalWidth = contentWidth + SECTION_PADDING20 * 2;
      var totalHeight = contentHeight + SECTION_PADDING20 * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      console.log(
        "\u2705 Generated Pagination ComponentSet with " + pageStates.length + " states (light + dark)"
      );
      return startY + totalHeight + SECTION_GAP20;
    });
  }

  // scripts/figma/plugin/generators/refresh-button.ts
  var buttonProps3 = component_registry_default.components.Button.props;
  var variantProp6 = buttonProps3.variant;
  var sizeProp5 = buttonProps3.size;
  var COMPACT_SIZE_MAP = {
    xs: 14,
    sm: 26,
    base: 36,
    lg: 40
  };
  var REFRESH_ICON_SIZE = {
    xs: 12,
    sm: 16,
    // size-4
    base: 18,
    // size-4.5
    lg: 20
    // size-5
  };
  function getBorderRadiusForSize(size) {
    var sizeClasses = sizeProp5.classes[size] || "";
    var parsed = parseTailwindClasses(sizeClasses);
    return parsed.borderRadius !== void 0 ? parsed.borderRadius : BORDER_RADIUS.lg;
  }
  var SECTION_PADDING21 = 48;
  var SECTION_GAP21 = 160;
  function createRefreshButtonComponent(size, loading) {
    var variant = variantProp6.default;
    var variantClasses = variantProp6.classes[variant] || "";
    var variantStyles = parseTailwindClasses(variantClasses);
    var component = figma.createComponent();
    component.name = "size=" + size + ", loading=" + loading;
    component.description = "Refresh button for triggering data refresh";
    var buttonSize = COMPACT_SIZE_MAP[size] || 36;
    component.layoutMode = "HORIZONTAL";
    component.primaryAxisAlignItems = "CENTER";
    component.counterAxisAlignItems = "CENTER";
    component.primaryAxisSizingMode = "FIXED";
    component.counterAxisSizingMode = "FIXED";
    component.resize(buttonSize, buttonSize);
    component.cornerRadius = getBorderRadiusForSize(size);
    if (variantStyles.fillVariable) {
      var fillVar = getVariableByName(variantStyles.fillVariable);
      if (fillVar) {
        bindFillToVariable(component, fillVar.id);
      }
    }
    if (variantStyles.hasBorder && variantStyles.strokeVariable) {
      var strokeVar = getVariableByName(variantStyles.strokeVariable);
      if (strokeVar) {
        bindStrokeToVariable(component, strokeVar.id, 1);
      }
    }
    var iconSize = REFRESH_ICON_SIZE[size] || 18;
    if (loading) {
      var loader = createLoader(iconSize);
      component.appendChild(loader);
    } else {
      var icon = getButtonIcon(DEFAULT_ICONS.refresh, size);
      if ("resize" in icon) {
        icon.resize(iconSize, iconSize);
      }
      if (variantStyles.isWhiteText) {
        bindIconColor(icon, "text-white");
      } else if (variantStyles.textVariable) {
        bindIconColor(icon, variantStyles.textVariable);
      } else {
        bindIconColor(icon, "text-surface");
      }
      component.appendChild(icon);
    }
    return component;
  }
  function generateRefreshButtonComponents(page, startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      figma.currentPage = page;
      var sizes = sizeProp5.values;
      var loadingOptions = [false, true];
      var components = [];
      var rowLabels = [];
      var componentGap = 20;
      var rowGap = 60;
      var labelColumnWidth = 140;
      var currentY = 0;
      for (var lo = 0; lo < loadingOptions.length; lo++) {
        var loading = loadingOptions[lo];
        rowLabels.push({ y: currentY, text: "loading=" + loading });
        var currentX = labelColumnWidth;
        for (var sz = 0; sz < sizes.length; sz++) {
          var component = createRefreshButtonComponent(sizes[sz], loading);
          component.x = currentX;
          component.y = currentY;
          currentX = currentX + component.width + componentGap;
          components.push(component);
        }
        currentY += rowGap;
      }
      var componentSet = figma.combineAsVariants(components, page);
      componentSet.name = "RefreshButton";
      componentSet.description = "RefreshButton component with size and loading state";
      componentSet.layoutMode = "NONE";
      var contentWidth = componentSet.width + labelColumnWidth;
      var contentHeight = componentSet.height;
      var lightSection = createModeSection(page, "RefreshButton", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING21 * 2,
        contentHeight + SECTION_PADDING21 * 2
      );
      var darkSection = createModeSection(page, "RefreshButton", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING21 * 2,
        contentHeight + SECTION_PADDING21 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING21 + labelColumnWidth;
      componentSet.y = SECTION_PADDING21;
      for (var li = 0; li < rowLabels.length; li++) {
        var label = rowLabels[li];
        var labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING21,
          SECTION_PADDING21 + label.y + 10
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (var i = 0; i < components.length; i++) {
        var comp = components[i];
        var instance = comp.createInstance();
        instance.x = comp.x + SECTION_PADDING21 + labelColumnWidth;
        instance.y = comp.y + SECTION_PADDING21;
        darkSection.frame.appendChild(instance);
      }
      for (var di = 0; di < rowLabels.length; di++) {
        var darkLabel = rowLabels[di];
        var darkLabelNode = yield createRowLabel(
          darkLabel.text,
          SECTION_PADDING21,
          SECTION_PADDING21 + darkLabel.y + 10
        );
        darkSection.frame.appendChild(darkLabelNode);
      }
      var totalWidth = contentWidth + SECTION_PADDING21 * 2;
      var totalHeight = contentHeight + SECTION_PADDING21 * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      var totalComponents = sizes.length * loadingOptions.length;
      console.log(
        "\u2705 Generated RefreshButton ComponentSet with " + totalComponents + " variants (light + dark)"
      );
      return startY + totalHeight + SECTION_GAP21;
    });
  }
  var REFRESH_BUTTON_SIZES_EXPORT = sizeProp5.values;

  // scripts/figma/plugin/generators/text.ts
  var textProps = component_registry_default.components.Text.props;
  var variantProp7 = textProps.variant;
  var sizeProp6 = textProps.size;
  var SECTION_PADDING22 = 48;
  var SECTION_GAP22 = 160;
  var TEXT_BASE_CLASS = "text-surface";
  var COPY_VARIANTS = ["body", "secondary", "success", "error"];
  var MONO_VARIANTS = ["mono", "mono-secondary"];
  function isCopyVariant(variant) {
    return COPY_VARIANTS.includes(variant);
  }
  function isMonoVariant(variant) {
    return MONO_VARIANTS.includes(variant);
  }
  function getPlaceholderText3(variant) {
    if (variant.startsWith("heading")) {
      return variant.charAt(0).toUpperCase() + variant.slice(1).replace(/(\d)/, " $1");
    }
    if (isMonoVariant(variant)) {
      return "const code = true;";
    }
    return "Text content";
  }
  function createTextComponent(variant, size) {
    return __async(this, null, function* () {
      const variantClasses = variantProp7.classes[variant] || "";
      const variantDesc = variantProp7.descriptions[variant] || "";
      let effectiveSizeClasses = "";
      let sizeDesc = "";
      if (isCopyVariant(variant) && size) {
        effectiveSizeClasses = sizeProp6.classes[size] || "";
        sizeDesc = sizeProp6.descriptions[size] || "";
      } else if (isMonoVariant(variant)) {
        if (size === "lg") {
          effectiveSizeClasses = sizeProp6.classes["base"] || "";
          sizeDesc = "Large text (optically adjusted to base)";
        } else {
          effectiveSizeClasses = sizeProp6.classes["sm"] || "";
          sizeDesc = "Default text (optically adjusted to small)";
        }
      }
      const combinedClasses = `${TEXT_BASE_CLASS} ${variantClasses} ${effectiveSizeClasses}`.trim();
      const styles = parseTailwindClasses(combinedClasses);
      const component = figma.createComponent();
      if (size) {
        component.name = "variant=" + variant + ", size=" + size;
        component.description = variantDesc + ". " + sizeDesc;
      } else {
        component.name = "variant=" + variant;
        component.description = variantDesc;
      }
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisAlignItems = "MIN";
      component.counterAxisAlignItems = "MIN";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.fills = [];
      let fontWeight = 400;
      if (variantClasses.includes("font-semibold")) {
        fontWeight = 600;
      } else if (variantClasses.includes("font-medium")) {
        fontWeight = 500;
      }
      const fontSize = styles.fontSize || 16;
      const textNode = yield createTextNode(
        getPlaceholderText3(variant),
        fontSize,
        fontWeight
      );
      textNode.name = "Text";
      if (styles.textVariable) {
        const textVar = getVariableByName(styles.textVariable);
        if (textVar) {
          bindTextColorToVariable(textNode, textVar.id);
        }
      } else {
        const surfaceVar = getVariableByName("text-color-surface");
        if (surfaceVar) {
          bindTextColorToVariable(textNode, surfaceVar.id);
        }
      }
      component.appendChild(textNode);
      return component;
    });
  }
  function generateTextComponents(page, startY) {
    return __async(this, null, function* () {
      if (startY === void 0) startY = 100;
      figma.currentPage = page;
      const variants = variantProp7.values;
      const sizes = sizeProp6.values;
      const components = [];
      const rowLabels = [];
      const columnHeaders = [];
      let columnHeadersRecorded = false;
      const componentGap = 20;
      const rowHeight = 50;
      const headerRowHeight = 24;
      const labelColumnWidth = 160;
      let currentRow = 0;
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        rowLabels.push({
          y: currentRow * rowHeight + headerRowHeight,
          text: "variant=" + variant
        });
        if (isCopyVariant(variant)) {
          let currentX = labelColumnWidth;
          for (let j = 0; j < sizes.length; j++) {
            const component = yield createTextComponent(variant, sizes[j]);
            component.x = currentX;
            component.y = currentRow * rowHeight + headerRowHeight;
            if (!columnHeadersRecorded) {
              columnHeaders.push({ x: currentX, text: "size=" + sizes[j] });
            }
            currentX = currentX + component.width + componentGap;
            components.push(component);
          }
          if (!columnHeadersRecorded) {
            columnHeadersRecorded = true;
          }
          currentRow++;
        } else if (isMonoVariant(variant)) {
          let currentX = labelColumnWidth;
          const defaultComponent = yield createTextComponent(variant, null);
          defaultComponent.x = currentX;
          defaultComponent.y = currentRow * rowHeight + headerRowHeight;
          currentX = currentX + defaultComponent.width + componentGap;
          components.push(defaultComponent);
          const lgComponent = yield createTextComponent(variant, "lg");
          lgComponent.x = currentX;
          lgComponent.y = currentRow * rowHeight + headerRowHeight;
          components.push(lgComponent);
          currentRow++;
        } else {
          const component = yield createTextComponent(variant, null);
          component.x = labelColumnWidth;
          component.y = currentRow * rowHeight + headerRowHeight;
          components.push(component);
          currentRow++;
        }
      }
      const componentSet = figma.combineAsVariants(components, page);
      componentSet.name = "Text";
      componentSet.description = "Text component with variant and size properties for typography";
      componentSet.layoutMode = "NONE";
      const contentWidth = componentSet.width + labelColumnWidth;
      const contentHeight = componentSet.height + headerRowHeight;
      const lightSection = createModeSection(page, "Text", "light");
      lightSection.frame.resize(
        contentWidth + SECTION_PADDING22 * 2,
        contentHeight + SECTION_PADDING22 * 2
      );
      const darkSection = createModeSection(page, "Text", "dark");
      darkSection.frame.resize(
        contentWidth + SECTION_PADDING22 * 2,
        contentHeight + SECTION_PADDING22 * 2
      );
      lightSection.frame.appendChild(componentSet);
      componentSet.x = SECTION_PADDING22 + labelColumnWidth;
      componentSet.y = SECTION_PADDING22 + headerRowHeight;
      yield createColumnHeaders(
        columnHeaders.map((h) => ({ x: h.x + SECTION_PADDING22, text: h.text })),
        SECTION_PADDING22,
        lightSection.frame
      );
      for (const label of rowLabels) {
        const labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING22,
          SECTION_PADDING22 + label.y + 8
          // +8 to vertically center with text
        );
        lightSection.frame.appendChild(labelNode);
      }
      for (const component of components) {
        const instance = component.createInstance();
        instance.x = component.x + SECTION_PADDING22 + labelColumnWidth;
        instance.y = component.y + SECTION_PADDING22 + headerRowHeight;
        darkSection.frame.appendChild(instance);
      }
      yield createColumnHeaders(
        columnHeaders.map((h) => ({ x: h.x + SECTION_PADDING22, text: h.text })),
        SECTION_PADDING22,
        darkSection.frame
      );
      for (const label of rowLabels) {
        const labelNode = yield createRowLabel(
          label.text,
          SECTION_PADDING22,
          SECTION_PADDING22 + label.y + 8
        );
        darkSection.frame.appendChild(labelNode);
      }
      const totalWidth = contentWidth + SECTION_PADDING22 * 2;
      const totalHeight = contentHeight + SECTION_PADDING22 * 2;
      lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
      lightSection.section.x = 100;
      lightSection.section.y = startY;
      darkSection.section.x = 100 + totalWidth + 50;
      darkSection.section.y = startY;
      console.log(
        "\u2705 Generated Text ComponentSet with " + components.length + " variants (light + dark)"
      );
      return startY + totalHeight + SECTION_GAP22;
    });
  }
  var TEXT_VARIANTS_EXPORT = variantProp7.values;
  var TEXT_SIZES_EXPORT = sizeProp6.values;

  // scripts/figma/plugin/generated/icon-data.json
  var icon_data_default = [
    {
      id: "ph-arrow-right",
      viewBox: "0 0 256 256",
      content: '<path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/>'
    },
    {
      id: "ph-arrows-clockwise",
      viewBox: "0 0 256 256",
      content: '<path d="M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h28.69L182.06,73.37a79.56,79.56,0,0,0-56.13-23.43h-.45A79.52,79.52,0,0,0,69.59,72.71,8,8,0,0,1,58.41,61.27a96,96,0,0,1,135,.79L208,76.69V48a8,8,0,0,1,16,0ZM186.41,183.29a80,80,0,0,1-112.47-.66L59.31,168H88a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V179.31l14.63,14.63A95.43,95.43,0,0,0,130,222.06h.53a95.36,95.36,0,0,0,67.07-27.33,8,8,0,0,0-11.18-11.44Z"/>'
    },
    {
      id: "ph-bell",
      viewBox: "0 0 256 256",
      content: '<path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"/>'
    },
    {
      id: "ph-caret-double-left",
      viewBox: "0 0 256 256",
      content: '<path d="M205.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L131.31,128ZM51.31,128l74.35-74.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,0,11.32l80,80a8,8,0,0,0,11.32-11.32Z"/>'
    },
    {
      id: "ph-caret-double-right",
      viewBox: "0 0 256 256",
      content: '<path d="M141.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L124.69,128,50.34,53.66A8,8,0,0,1,61.66,42.34l80,80A8,8,0,0,1,141.66,133.66Zm80-11.32-80-80a8,8,0,0,0-11.32,11.32L204.69,128l-74.35,74.34a8,8,0,0,0,11.32,11.32l80-80A8,8,0,0,0,221.66,122.34Z"/>'
    },
    {
      id: "ph-caret-down",
      viewBox: "0 0 256 256",
      content: '<path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/>'
    },
    {
      id: "ph-caret-left",
      viewBox: "0 0 256 256",
      content: '<path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"/>'
    },
    {
      id: "ph-caret-right",
      viewBox: "0 0 256 256",
      content: '<path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/>'
    },
    {
      id: "ph-caret-up-down",
      viewBox: "0 0 256 256",
      content: '<path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"/>'
    },
    {
      id: "ph-check",
      viewBox: "0 0 256 256",
      content: '<path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/>'
    },
    {
      id: "ph-clipboard",
      viewBox: "0 0 256 256",
      content: '<path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200Z"/>'
    },
    {
      id: "ph-cloud-slash",
      viewBox: "0 0 256 256",
      content: '<path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L81.32,88.55l-.06.12A65,65,0,0,0,72,88a64,64,0,0,0,0,128h88a87.34,87.34,0,0,0,31.8-5.93l10.28,11.31a8,8,0,1,0,11.84-10.76ZM160,200H72a48,48,0,0,1,0-96c1.1,0,2.2,0,3.3.12A88.4,88.4,0,0,0,72,128a8,8,0,0,0,16,0,72.25,72.25,0,0,1,5.06-26.54l87,95.7A71.66,71.66,0,0,1,160,200Zm88-72a87.89,87.89,0,0,1-22.35,58.61A8,8,0,0,1,213.71,176,72,72,0,0,0,117.37,70a8,8,0,0,1-9.48-12.89A88,88,0,0,1,248,128Z"/>'
    },
    {
      id: "ph-copy",
      viewBox: "0 0 256 256",
      content: '<path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"/>'
    },
    {
      id: "ph-database",
      viewBox: "0 0 256 256",
      content: '<path d="M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z"/>'
    },
    {
      id: "ph-download",
      viewBox: "0 0 256 256",
      content: '<path d="M240,136v64a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V136a16,16,0,0,1,16-16H72a8,8,0,0,1,0,16H32v64H224V136H184a8,8,0,0,1,0-16h40A16,16,0,0,1,240,136Zm-117.66-2.34a8,8,0,0,0,11.32,0l48-48a8,8,0,0,0-11.32-11.32L136,108.69V24a8,8,0,0,0-16,0v84.69L85.66,74.34A8,8,0,0,0,74.34,85.66ZM200,168a12,12,0,1,0-12,12A12,12,0,0,0,200,168Z"/>'
    },
    {
      id: "ph-eye",
      viewBox: "0 0 256 256",
      content: '<path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/>'
    },
    {
      id: "ph-eye-slash",
      viewBox: "0 0 256 256",
      content: '<path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z"/>'
    },
    {
      id: "ph-file",
      viewBox: "0 0 256 256",
      content: '<path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"/>'
    },
    {
      id: "ph-folder",
      viewBox: "0 0 256 256",
      content: '<path d="M216,72H131.31L104,44.69A15.86,15.86,0,0,0,92.69,40H40A16,16,0,0,0,24,56V200.62A15.4,15.4,0,0,0,39.38,216H216.89A15.13,15.13,0,0,0,232,200.89V88A16,16,0,0,0,216,72ZM40,56H92.69l16,16H40ZM216,200H40V88H216Z"/>'
    },
    {
      id: "ph-folder-open",
      viewBox: "0 0 256 256",
      content: '<path d="M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208h0a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64,123.2,86.4A8,8,0,0,0,128,88h72v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Zm112,136H43.1l26.67-80H232Z"/>'
    },
    {
      id: "ph-gear",
      viewBox: "0 0 256 256",
      content: '<path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"/>'
    },
    {
      id: "ph-globe-hemisphere-west",
      viewBox: "0 0 256 256",
      content: '<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.62,87.62,0,0,1-6.4,32.94l-44.7-27.49a15.92,15.92,0,0,0-6.24-2.23l-22.82-3.08a16.11,16.11,0,0,0-16,7.86h-8.72l-3.8-7.86a15.91,15.91,0,0,0-11-8.67l-8-1.73L96.14,104h16.71a16.06,16.06,0,0,0,7.73-2l12.25-6.76a16.62,16.62,0,0,0,3-2.14l26.91-24.34A15.93,15.93,0,0,0,166,49.1l-.36-.65A88.11,88.11,0,0,1,216,128ZM143.31,41.34,152,56.9,125.09,81.24,112.85,88H96.14a16,16,0,0,0-13.88,8l-8.73,15.23L63.38,84.19,74.32,58.32a87.87,87.87,0,0,1,69-17ZM40,128a87.53,87.53,0,0,1,8.54-37.8l11.34,30.27a16,16,0,0,0,11.62,10l21.43,4.61L96.74,143a16.09,16.09,0,0,0,14.4,9h1.48l-7.23,16.23a16,16,0,0,0,2.86,17.37l.14.14L128,205.94l-1.94,10A88.11,88.11,0,0,1,40,128Zm102.58,86.78,1.13-5.81a16.09,16.09,0,0,0-4-13.9,1.85,1.85,0,0,1-.14-.14L120,174.74,133.7,144l22.82,3.08,45.72,28.12A88.18,88.18,0,0,1,142.58,214.78Z"/>'
    },
    {
      id: "ph-house",
      viewBox: "0 0 256 256",
      content: '<path d="M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48V120l80-80,80,80Z"/>'
    },
    {
      id: "ph-info",
      viewBox: "0 0 256 256",
      content: '<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"/>'
    },
    {
      id: "ph-magnifying-glass",
      viewBox: "0 0 256 256",
      content: '<path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/>'
    },
    {
      id: "ph-minus",
      viewBox: "0 0 256 256",
      content: '<path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"/>'
    },
    {
      id: "ph-pencil",
      viewBox: "0 0 256 256",
      content: '<path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM51.31,160,136,75.31,152.69,92,68,176.68ZM48,179.31,76.69,208H48Zm48,25.38L79.31,188,164,103.31,180.69,120Zm96-96L147.31,64l24-24L216,84.68Z"/>'
    },
    {
      id: "ph-plus",
      viewBox: "0 0 256 256",
      content: '<path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/>'
    },
    {
      id: "ph-share",
      viewBox: "0 0 256 256",
      content: '<path d="M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L204.69,112H165a88,88,0,0,0-85.23,66,8,8,0,0,1-15.5-4A103.94,103.94,0,0,1,165,96h39.71L170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66ZM192,208H40V88a8,8,0,0,0-16,0V216a8,8,0,0,0,8,8H192a8,8,0,0,0,0-16Z"/>'
    },
    {
      id: "ph-sign-out",
      viewBox: "0 0 256 256",
      content: '<path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z"/>'
    },
    {
      id: "ph-trash",
      viewBox: "0 0 256 256",
      content: '<path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/>'
    },
    {
      id: "ph-user",
      viewBox: "0 0 256 256",
      content: '<path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/>'
    },
    {
      id: "ph-warning",
      viewBox: "0 0 256 256",
      content: '<path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"/>'
    },
    {
      id: "ph-x",
      viewBox: "0 0 256 256",
      content: '<path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>'
    },
    {
      id: "cf-ai-audit-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M4.693 9.41a.843.843 0 0 0 .853-.833.843.843 0 0 0-.853-.833.843.843 0 0 0-.853.833c0 .46.382.832.853.832m4.329.001a.843.843 0 0 0 .853-.833.843.843 0 0 0-.853-.833.843.843 0 0 0-.853.833c0 .46.382.832.853.832m-.522.958H5.25v1H8.5zm5.023-5.614L15 5.498l-.41.672-1.434-.816.04 1.561h-.832l.04-1.561-1.434.816-.41-.672 1.477-.745-1.477-.745.41-.672 1.434.817-.04-1.562h.831l-.04 1.562 1.434-.817.41.671-.112.059z"/><path fill="currentColor" fill-rule="evenodd" d="m13.195 6.915-.04-1.561 1.434.816.411-.672-1.477-.745 1.364-.687.112-.059-.41-.67-1.433.816.04-1.562h-.832l.04 1.562-1.434-.817-.41.672 1.477.745-1.477.745.41.672 1.434-.816-.04 1.561zM9.75 5.117h-2.5l.006-1.25c.196-.11.35-.28.436-.484a.98.98 0 0 0 .043-.641 1 1 0 0 0-.367-.535 1.045 1.045 0 0 0-1.251 0 1 1 0 0 0-.367.535.98.98 0 0 0 .043.641c.087.204.24.374.436.484l.021 1.25H1.5l-.5.5v7.75l.5.5h10.75l.5-.5V7.742c-.014 0 0 .005-.014.005a3.3 3.3 0 0 1-.986-.13v5.25H2v-6.75h8.034a3 3 0 0 1-.284-1" clip-rule="evenodd"/>'
    },
    {
      id: "cf-airplane-paper-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13.864 1.499 1.625 5.819l-.125.878 4.552 3.252L9.303 14.5l.878-.125 4.32-12.24zm-11 4.943 9.254-3.267-5.762 5.762zm6.694 6.695L7.063 9.644l5.762-5.762z"/>'
    },
    {
      id: "cf-airplane-paper-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m13.834 1.528-12.21 4.29-.125.879 4.14 2.957 4.278-4.279.707.707-4.278 4.279 2.957 4.14.878-.125 4.29-12.21z"/>'
    },
    {
      id: "cf-analytics-bots-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M15.5 6.556h-3.257V5.81a.65.65 0 1 0-.625 0v.747h-1.372v-2.56l-.5-.5H.5l-.5.5v6.506l.5.5h7.362v1.002l.5.5H15.5l.5-.5V7.056zm-7.638.5v2.946H1V4.496h8.246v2.06h-.885zM15 11.504H8.861V7.556H15z"/><path fill="currentColor" d="M10.417 9.471a.54.54 0 1 0 0-1.078.54.54 0 0 0 0 1.078m3.028 0a.54.54 0 1 0 0-1.078.54.54 0 0 0 0 1.078m-.488.704h-2.053v.625h2.053zM3.5 7.807h-1v1.431h1zm1.591-1.405h-1v2.836h1zm1.591-1.185h-1v4.021h1z"/>'
    },
    {
      id: "cf-analytics-bots-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m0 3.996.5-.5h9.246l.5.5v2.54H8.878l-1 1v3.467H.5l-.5-.5zm6.682 1.222v4.02h-1v-4.02zm-1.59 4.02V6.404h-1V9.24zm-1.592 0v-1.43h-1v1.43z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="m8.878 7.538-.263.264v4.202l.5.5H15.5l.5-.5V7.802l-.5-.5h-2.88v-.738a.65.65 0 1 0-.625 0v.738h-2.88zm4.943 2.24a.54.54 0 1 0 0-1.079.54.54 0 0 0 0 1.079m-3.027 0a.54.54 0 1 0 0-1.079.54.54 0 0 0 0 1.079m.487 1.329h2.053v-.625H11.28z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-analytics-data-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.75 3a1.75 1.75 0 0 0-1.17 3.05L10.137 9a1.14 1.14 0 0 0-.672.23L6.75 7.875a1.125 1.125 0 1 0-2.037.655L3.408 11a2 2 0 0 0-.183 0 1.75 1.75 0 1 0 1.11.398L5.598 9h.027c.245 0 .484-.082.678-.232l2.715 1.347a1.125 1.125 0 1 0 2.015-.68l1.447-2.95a2 2 0 0 0 .27.015 1.75 1.75 0 1 0 0-3.5M3.225 13.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5m9.525-8a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5"/>'
    },
    {
      id: "cf-analytics-data-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.758 3.008A1.748 1.748 0 0 0 11.58 6.05l-1.443 2.94a1.1 1.1 0 0 0-.67.231L6.75 7.875a1.125 1.125 0 1 0-2.037.655L3.41 11a1.752 1.752 0 1 0 .926.388l1.263-2.39.027.003a1.12 1.12 0 0 0 .677-.232l2.716 1.347a1.125 1.125 0 1 0 2.015-.68l1.447-2.95q.138.022.278.024a1.75 1.75 0 0 0 0-3.5z"/>'
    },
    {
      id: "cf-analytics-network-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13.875 11.025a.525.525 0 1 0 0-1.05.525.525 0 0 0 0 1.05"/><path fill="currentColor" d="M15.5 8.525h-5.25v-4.75l-.5-.5H.5l-.5.5v6.5l.5.5H3v1.45l.5.5h12l.5-.5v-3.2zm-12.5.5v.75H1v-5.5h8.25v4.25H3.5zm12 2.7H4v-2.2h11z"/><path fill="currentColor" d="M4.025 7.075h-1v.93h1zm1.6-1.15h-1V8.01h1zM7.225 5h-1v3.02h1z"/>'
    },
    {
      id: "cf-analytics-network-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M10.25 3.775V8.5H4l-1 1v1.275H.5l-.5-.5v-6.5l.5-.5h9.25zM3.025 6.817h1v.93h-1zm2.6-1.15h-1v2.085h1zm.6-.925h1v3.02h-1z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M4.25 9.25H15.5l.5.5v2.5l-.5.5H4.25l-.5-.5v-2.5zm9.625 2.3a.525.525 0 1 0 0-1.05.525.525 0 0 0 0 1.05" clip-rule="evenodd"/>'
    },
    {
      id: "cf-analytics-pie-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7.75 13A4.749 4.749 0 0 1 6.5 3.67V2.638A5.75 5.75 0 1 0 13.363 9.5H12.33A4.77 4.77 0 0 1 7.75 13"/><path fill="currentColor" d="m8 1.5-.5.5v6l.5.5h6l.5-.5A6.507 6.507 0 0 0 8 1.5m.5 6V2.523A5.51 5.51 0 0 1 13.477 7.5z"/>'
    },
    {
      id: "cf-analytics-pie-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M7.427 2.153a5.75 5.75 0 1 0 5.994 5.995H7.927l-.5-.5zm5.951 4.995h.32l.479-.48a5.27 5.27 0 0 0-5.271-5.27l-.48.479v5.27z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-api-security-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M6.098 5.182a.9.9 0 0 0-.3.405 1.8 1.8 0 0 0-.102.668v.615a.77.77 0 0 1-.163.546.78.78 0 0 1-.573.168v.81a.78.78 0 0 1 .573.167.77.77 0 0 1 .163.546v.613a1.8 1.8 0 0 0 .102.667.9.9 0 0 0 .3.405c.144.102.309.17.482.2q.32.06.646.057v-.666a.96.96 0 0 1-.436-.08.42.42 0 0 1-.208-.24 1.3 1.3 0 0 1-.057-.413v-.791a1 1 0 0 0-.063-.345.64.64 0 0 0-.229-.283 1.3 1.3 0 0 0-.509-.197v-.09l.017-.004q.01 0 .019-.003c.169-.031.33-.096.473-.19a.64.64 0 0 0 .23-.284 1 1 0 0 0 .062-.347v-.791q-.006-.211.057-.412a.42.42 0 0 1 .208-.24 1 1 0 0 1 .436-.079v-.67a3.3 3.3 0 0 0-.646.057c-.173.031-.338.1-.482.201m4.206 1.688a.77.77 0 0 0 .163.546c.161.13.367.19.572.168v.81a.78.78 0 0 0-.572.168.76.76 0 0 0-.163.546v.612c.007.227-.027.454-.102.668a.9.9 0 0 1-.3.405c-.144.101-.309.17-.482.2q-.32.06-.647.057v-.667c.15.008.3-.02.437-.08a.42.42 0 0 0 .208-.24q.063-.202.057-.413v-.791q0-.179.063-.345a.64.64 0 0 1 .229-.283 1.25 1.25 0 0 1 .473-.19l.021-.004.014-.003v-.091l-.017-.003-.018-.003a1.3 1.3 0 0 1-.473-.19.64.64 0 0 1-.23-.284 1 1 0 0 1-.062-.347v-.791a1.3 1.3 0 0 0-.057-.41.42.42 0 0 0-.208-.24 1 1 0 0 0-.437-.079v-.67a3.3 3.3 0 0 1 .647.056c.173.031.338.1.482.2a.9.9 0 0 1 .3.405c.075.215.11.441.102.668z"/><path fill="currentColor" fill-rule="evenodd" d="M7.627 1.165h.745l.289.32a6.9 6.9 0 0 0 3.852 1.912l.343.05.428.495v3.534c0 2.463-1.191 4.292-2.375 5.498-1.182 1.204-2.387 1.822-2.507 1.882l-.179.09-.447-.001-.177-.089c-.12-.06-1.326-.678-2.507-1.882-1.184-1.207-2.375-3.035-2.375-5.498V3.941l.428-.495.343-.05a6.9 6.9 0 0 0 3.852-1.91zM8 2.239a7.9 7.9 0 0 1-4.283 2.134v3.103c0 2.115 1.018 3.706 2.089 4.798A9.4 9.4 0 0 0 8 13.938a9.4 9.4 0 0 0 2.195-1.664c1.071-1.092 2.089-2.683 2.089-4.798V4.374A7.9 7.9 0 0 1 8 2.239" clip-rule="evenodd"/>'
    },
    {
      id: "cf-apple-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.476 2.36a3.7 3.7 0 0 1 3.334-1.046 3.71 3.71 0 0 1-1.115 3.696c1.873.4 3.155 2.079 3.155 4.088 0 2.308-1.69 5.572-4.024 5.572-.64 0-1.323-.246-1.976-.65-.653.404-1.335.65-1.975.65-2.334 0-4.025-3.264-4.025-5.572S3.54 4.92 5.874 4.92c.441 0 .902.066 1.36.19-.055-1.092-.535-2.042-1.275-2.661l.642-.767c.509.426.916.965 1.197 1.58a4 4 0 0 1 .678-.903m1.35 3.56c-.5 0-1.06.11-1.616.325l-.36.14-.36-.14a4.7 4.7 0 0 0-1.521-.324l-.095-.001c-1.728 0-3.024 1.368-3.024 3.178 0 .944.357 2.15.977 3.108.634.98 1.375 1.464 2.048 1.464.393 0 .892-.156 1.449-.501l.526-.326.526.326.104.063c.515.3.977.438 1.346.438.672 0 1.413-.484 2.047-1.464.6-.928.955-2.089.976-3.019l.001-.089c0-1.81-1.296-3.178-3.024-3.178m1.102-3.663a2.7 2.7 0 0 0-1.679.746l-.065.063a3 3 0 0 0-.879 1.984 3 3 0 0 0 1.807-.864 2.7 2.7 0 0 0 .816-1.93"/>'
    },
    {
      id: "cf-applications-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M5.894 3.495a.419.419 0 1 0 0-.838.419.419 0 0 0 0 .838m1.34 0a.419.419 0 1 0 0-.838.419.419 0 0 0 0 .838m1.341 0a.419.419 0 1 0 0-.838.419.419 0 0 0 0 .838"/><path fill="currentColor" d="M14.202 1.488H4.594l-.5.5v2.377h-.925l-.5.5v1.408h-.914l-.5.5v7.213l.5.5h8.685l.5-.5v-1.408h.914l.5-.5V10.47h1.848l.5-.5V1.988zm-.5 1v1.178H5.094V2.488zM4.094 5.365v.969h-.425v-.969zM2.669 7.273v.968h-.414v-.968zm7.27 6.213H2.255V9.241h.415v2.838l.5.5h6.77zm1.415-1.908H3.67V7.335h.425V9.97l.5.5h6.76zM5.094 9.47V4.666h8.608v4.803z"/>'
    },
    {
      id: "cf-arrow-backward-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14 7.5H3.439l4.29-4.387-.714-.7L1.55 8l5.465 5.586.714-.7L3.44 8.5H14z"/>'
    },
    {
      id: "cf-arrow-down-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m13.7 8.803-.712-.698-4.38 4.467V1.3h-1v11.272l-4.38-4.467-.715.698 5.595 5.71z"/>'
    },
    {
      id: "cf-arrow-external-link-1-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m3.996 4.065.008 1 6.779-.055-7.137 7.137.707.707 7.137-7.137-.055 6.779 1 .008.07-8.508z"/>'
    },
    {
      id: "cf-arrow-external-link-2-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m9.996 1.532.008 1 2.779-.022-4.136 4.136.707.707 4.136-4.136-.023 2.779 1 .008.037-4.508z"/><path fill="currentColor" d="M12 12H4V4h4.5V3h-5l-.5.5v9l.5.5h9l.5-.5v-5h-1z"/>'
    },
    {
      id: "cf-arrow-external-link-2-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m10.004 2.533-.008-1 4.508-.037-.037 4.508-1-.008.023-2.779L9.957 6.75l-.707-.707 3.533-3.533z"/><path fill="currentColor" d="M3.5 3h5v4.5H13v5l-.5.5h-9l-.5-.5v-9z"/>'
    },
    {
      id: "cf-arrow-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m9.005 2.407-.698.713 4.468 4.38H1.502v1h11.273l-4.468 4.38.698.715L14.715 8z"/>'
    },
    {
      id: "cf-arrow-twoway-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m11.557 8.272-.7.714 1.677 1.643H2.009v1h10.525l-1.677 1.643.7.714 2.916-2.857zM5.151 6.989 3.475 5.346H14v-1H3.475l1.676-1.643-.7-.714-2.915 2.857L4.45 7.703z"/>'
    },
    {
      id: "cf-arrow-up-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m2.55 7.01.712.698 4.38-4.468v11.272h1V3.24l4.38 4.468.715-.698L8.142 1.3z"/>'
    },
    {
      id: "cf-attacker-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M11.489 6.527c-.037.481-.12.965-.304 1.365-.137.3-.31.584-.508.845h.319l.188.037c1.16.47 2.002 1.207 2.548 2.156.542.942.775 2.06.775 3.276l-.501.5H2l-.501-.5c0-1.216.233-2.334.775-3.276.546-.949 1.388-1.686 2.547-2.156l.189-.037h.346a4.5 4.5 0 0 1-.508-.845c-.339-.738-.335-1.761-.332-2.529v-.191c0-2.066 1.434-3.922 3.5-3.922s3.5 1.856 3.5 3.922v.191a15 15 0 0 1-.028 1.164m-1.212-.781C9.929 5.19 9.166 4.74 8.027 4.74s-1.911.451-2.263 1.005zm.202.535-.456.94h-1.53l-.482-.995-.502.994h-1.5l-.452-.931a1 1 0 0 0-.012.168c.033.433.104.777.214 1.017.497 1.083 1.485 1.769 2.258 1.769s1.761-.686 2.258-1.769c.11-.242.181-.589.215-1.026l.002-.019a1 1 0 0 0-.013-.148m-.032-1.803c-.262-1.309-1.257-2.226-2.43-2.226-1.176 0-2.173.922-2.432 2.236.632-.473 1.499-.749 2.442-.749.938 0 1.794.272 2.42.74m-1.952 5.72c.383-.075.76-.234 1.108-.46h1.293c.918.393 1.553.972 1.968 1.692.364.632.57 1.396.626 2.275h-1.495v-2.467l-.492-.492H8.495zm-2.064-.46c.34.22.707.378 1.081.454v.554H4.503l-.491.492v2.467H2.517c.056-.88.262-1.643.626-2.275.414-.72 1.05-1.3 1.968-1.691zm4.581 3.967V11.73H4.995v1.976z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-attention-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.442 1.95h-.885l-6 11.343.443.732h12l.443-.732zM2.828 13.025 8 3.25l5.172 9.775z"/><path fill="currentColor" d="M8.48 6.63h-1v3.44h1zm0 4.098h-1v1.145h1z"/>'
    },
    {
      id: "cf-attention-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.442 1.95h-.885L1.555 13.293l.442.732h12.005l.443-.732zm.038 9.923h-1v-1.146h1zm0-1.803h-1V6.63h1z"/>'
    },
    {
      id: "cf-auto-rag-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.432 2.012V4.38h-1V2.51H2.358v10.977h1.807v1H1.858l-.5-.5V2.012l.5-.5h10.074zm-4.99 12.476h-1v-1.683h1zM6.43 10.383l-.705.706v.999l.705.706-.794.794-.707-.707.793-.793h-1.68v-1h1.68l-.793-.792.707-.707zm2.52-.087-.792.792h1.683v1H8.158l.793.793-.707.707-.795-.794.707-.708.002.002v-1l-.002.002-.707-.707.795-.794zm1.768-5.023a2.267 2.267 0 0 1 1.968 3.388l1.656 1.503-.672.74L12.011 9.4a2.266 2.266 0 1 1-1.293-4.127m-3.277 5.099h-1V8.688h1zm3.277-4.1a1.266 1.266 0 1 0 0 2.534 1.266 1.266 0 0 0 0-2.533M5.844 8.44H3.422v-1h2.422zm1.877-1.927h-4.3v-1h4.3zm1.963-1.927H3.422v-1h6.262z"/>'
    },
    {
      id: "cf-benefits-healthcare-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M10.779 2.113A4.05 4.05 0 0 0 8.002 3.15 4.1 4.1 0 0 0 5.22 2.113 4.225 4.225 0 0 0 1 6.335c0 1.056.57 2.206 1.135 2.878 1.215 1.447 5.364 5.004 5.54 5.155h.65c.175-.15 4.325-3.708 5.54-5.155C14.43 8.541 15 7.391 15 6.335a4.225 4.225 0 0 0-4.221-4.222M13.1 8.57c-.974 1.158-4.083 3.877-5.1 4.758-1.017-.88-4.126-3.6-5.1-4.757-.434-.516-.9-1.436-.9-2.235a3.225 3.225 0 0 1 3.22-3.222 3.02 3.02 0 0 1 2.397 1.075l.762.005a3.07 3.07 0 0 1 2.4-1.078A3.225 3.225 0 0 1 14 6.335c0 .8-.467 1.719-.9 2.234"/><path fill="currentColor" d="M8.5 5.25h-1V7.5H5.25v1H7.5v2.25h1V8.5h2.25v-1H8.5z"/>'
    },
    {
      id: "cf-benefits-healthcare-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M8.002 3.15a4.05 4.05 0 0 1 2.777-1.037A4.225 4.225 0 0 1 15 6.335c0 1.056-.57 2.206-1.134 2.878-1.216 1.447-5.366 5.005-5.541 5.155h-.65c-.176-.152-4.325-3.708-5.54-5.155C1.57 8.541 1 7.391 1 6.335a4.225 4.225 0 0 1 4.22-4.222A4.1 4.1 0 0 1 8.003 3.15M7.5 5.25h1V7.5h2.25v1H8.5v2.25h-1V8.5H5.25v-1H7.5z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-benefits-paid-vacation-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m13.975 1.362-.001.5.5-.001v.026a6 6 0 0 1-.008.298 10 10 0 0 1-.059.741 5.6 5.6 0 0 1-.17.881c-.078.27-.204.586-.425.808h-.001l-1.94 1.961.09 6.16-.143.356-1.203 1.232-.853-.278-.673-4.66-1.717 1.735.082 1.632-.092.315-.88 1.234-.891-.162-.813-3.075-3.09-.827-.156-.893 1.249-.867.31-.089 1.631.082L6.47 6.738l-4.777-.755-.243-.877 1.325-1.11.328-.117 6.158.09 1.959-1.944h.001c.222-.222.537-.348.807-.427.286-.083.6-.136.881-.17a10 10 0 0 1 1.04-.066zM9.97 8.496l.636 4.404.35-.358-.072-4.97zm4.003-6.634.5-.001-.5-.5zM8.268 4.954l-.918.91-4.415-.697.34-.286zm5.186-2.572c-.13.009-.276.021-.426.04-.253.03-.507.074-.72.136-.228.067-.342.135-.38.174l-.002.001L5.27 9.336l-.378.145-1.681-.084-.222.154 2.327.623.354.355.615 2.326.162-.226-.084-1.678.144-.377 6.595-6.664.002-.002c.038-.038.107-.153.174-.38.062-.214.106-.467.136-.72a10 10 0 0 0 .04-.426" clip-rule="evenodd"/>'
    },
    {
      id: "cf-benefits-paid-vacation-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m13.962 1.503.085-.003.49.49-.004.085a10 10 0 0 1-.06.762c-.035.29-.088.605-.17.887-.08.275-.197.552-.38.736l-6.935 6.934.065 2.14-.682.978-.709-.125-.94-3.06-3.09-.957-.122-.691 1.003-.688 2.13.058 6.934-6.934c.183-.184.46-.301.735-.381a5.6 5.6 0 0 1 .887-.17 10 10 0 0 1 .763-.06"/><path fill="currentColor" d="m9.59 10.207 2.103-2.103-.05 5.31-.024.073-.746 1.004-.62-.166zM7.958 4.318 5.85 6.426l-4.166-.742-.185-.692.929-.695.076-.025z"/>'
    },
    {
      id: "cf-benefits-parental-leave-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13.487 5.503a2.42 2.42 0 0 0-1.495.489 2.4 2.4 0 0 0-1.229-.474 3.31 3.31 0 0 0-3.218-2.511 3.2 3.2 0 0 0-2.103.746 3.23 3.23 0 0 0-2.11-.746 3.325 3.325 0 0 0-3.32 3.32c.044.83.356 1.623.89 2.26.928 1.106 4.077 3.806 4.21 3.92h.65A96 96 0 0 0 8.76 9.823c.767.85 2.814 2.606 2.905 2.684h.65c.096-.082 2.343-2.009 3.01-2.802a2.86 2.86 0 0 0 .665-1.699 2.506 2.506 0 0 0-2.503-2.503M7.991 8.007c.006.332.08.66.217.962a85 85 0 0 1-2.77 2.498c-.838-.729-3.062-2.68-3.772-3.526a2.86 2.86 0 0 1-.653-1.614 2.323 2.323 0 0 1 2.32-2.32 2.18 2.18 0 0 1 1.725.772l.761.004a2.2 2.2 0 0 1 1.725-.776 2.32 2.32 0 0 1 2.21 1.608A2.51 2.51 0 0 0 7.99 8.007m6.57 1.055c-.473.563-1.918 1.838-2.57 2.404-.652-.566-2.097-1.841-2.57-2.404a1.9 1.9 0 0 1-.43-1.055 1.505 1.505 0 0 1 1.504-1.504A1.4 1.4 0 0 1 11.608 7l.762.005a1.41 1.41 0 0 1 1.117-.5 1.505 1.505 0 0 1 1.504 1.503 1.9 1.9 0 0 1-.43 1.054"/>'
    },
    {
      id: "cf-benefits-parental-leave-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M4.7 3.287c-.431-.194-.9-.29-1.373-.28a3.32 3.32 0 0 0-3.314 3.32v.03c.05.82.362 1.6.89 2.23.483.575 1.55 1.566 2.467 2.389q.863.774 1.742 1.531h.65a100 100 0 0 0 2.647-2.354 3.5 3.5 0 0 1-.424-1.475l-.003-.093a3.22 3.22 0 0 1 2.75-3.188 3.32 3.32 0 0 0-3.182-2.39 3.2 3.2 0 0 0-2.109.747 3.2 3.2 0 0 0-.741-.467"/><path fill="currentColor" d="M11.199 6.363a2.13 2.13 0 0 1 1.293.404 2.15 2.15 0 0 1 1.29-.404 2.22 2.22 0 0 1 2.217 2.222v.031a2.54 2.54 0 0 1-.587 1.473v.001c-.307.364-.97.978-1.528 1.479a69 69 0 0 1-1.045.918l-.023.02h-.65l-.024-.02-.064-.055a61 61 0 0 1-.981-.863c-.558-.5-1.221-1.115-1.527-1.479l-.001-.001a2.54 2.54 0 0 1-.586-1.473l-.001-.03a2.22 2.22 0 0 1 2.217-2.223"/>'
    },
    {
      id: "cf-benefits-returnship-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M12.985 8.67a3.003 3.003 0 0 0-3 3v.833h1v-.833a2 2 0 1 1 2 2h-.707l.56-.561-.707-.707-1.768 1.768 1.768 1.768.707-.707-.56-.561h.707a3 3 0 1 0 0-6"/><path d="M5 4.518h5.94v3.925l1-.513V4.518h1.56V7.93l1 .5V4.018l-.5-.5h-3.5V2l-.5-.5H6l-.5.5v1.518H2l-.5.5V12l.5.5h7.152v-1H5zM6.5 2.5h3v1h-3zm-4 2.018H4V11.5H2.5z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-benefits-returnship-solid",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M13 7.75q-.385 0-.75.07V4H14l.5.5v3.54a4 4 0 0 0-1.5-.29M11.25 4v4.152A4 4 0 0 0 9.07 12.5H4.5V4zM2 4h1.5v8.5H2l-.5-.5V4.5zm3.635-1h4.75V2l-.5-.5h-3.75l-.5.5zm5.245 6.63A3 3 0 1 1 13 14.75h-.707l.56.561-.707.707-1.767-1.768 1.768-1.768.707.707-.561.561H13a2 2 0 1 0-2-2v.833h-1v-.833c0-.795.317-1.558.88-2.12"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-benefits-salary-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13.02 6.428v-2.41l-.5-.5h-12l-.5.5V12l.5.5h9.455a3.557 3.557 0 1 0 3.045-6.072m-6.5 2.238L1.839 4.517H11.2zm-2.25-.658-3.25 2.88v-5.76zm.755.668 1.164 1.032h.663l1.164-1.033.898.795a3.44 3.44 0 0 0 .332 2.03H1.838zm4.203-.263-.457-.405 3.25-2.88v1.275a3.57 3.57 0 0 0-2.794 2.01m3.212 4.083a2.56 2.56 0 1 1 0-5.12 2.56 2.56 0 0 1 0 5.12"/><path fill="currentColor" d="M13.375 10.055a1.2 1.2 0 0 0-.3-.18 2 2 0 0 0-.348-.114l-.103-.025.006-.888a.6.6 0 0 1 .252.098.43.43 0 0 1 .183.317h.556a.83.83 0 0 0-.15-.477 1 1 0 0 0-.403-.325 1.3 1.3 0 0 0-.434-.11l.002-.362h-.33l-.004.361c-.148.013-.294.05-.43.11a1 1 0 0 0-.418.329.8.8 0 0 0-.154.493.7.7 0 0 0 .228.55c.18.152.393.257.622.308l.14.036-.005.941a1 1 0 0 1-.162-.042.54.54 0 0 1-.236-.164.5.5 0 0 1-.103-.278h-.568c.002.192.06.38.166.539a.96.96 0 0 0 .427.336q.227.093.473.109l-.002.357h.33l.002-.357a1.5 1.5 0 0 0 .495-.113.94.94 0 0 0 .413-.331.86.86 0 0 0 .144-.493.8.8 0 0 0-.079-.361.8.8 0 0 0-.21-.264m-1.08-.408-.062-.018a1 1 0 0 1-.175-.085.4.4 0 0 1-.125-.124.36.36 0 0 1 .024-.386.46.46 0 0 1 .198-.148.7.7 0 0 1 .146-.041zm.709 1.267a.5.5 0 0 1-.224.159 1 1 0 0 1-.165.043l.005-.852q.099.029.193.068.115.046.2.136a.3.3 0 0 1 .073.207c0 .087-.028.17-.082.239"/>'
    },
    {
      id: "cf-benefits-salary-solid",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="m-.073 4.066 4.26 3.803-4.26 3.795zm.753-.668h11.493L6.426 8.53zm12.247.667-4.26 3.802.798.705a3.81 3.81 0 0 1 3.462-2.07zM7.916 8.538l1.197 1.057a3.8 3.8 0 0 0 .526 2.76H.655l4.283-3.816 1.157 1.033h.662zm4.807 1.461-.027-.008-.034-.01a1 1 0 0 1-.175-.085.4.4 0 0 1-.125-.124.36.36 0 0 1 .024-.386.46.46 0 0 1 .197-.148.7.7 0 0 1 .146-.041zm.709 1.267a.5.5 0 0 1-.223.158 1 1 0 0 1-.165.044l.005-.852q.099.028.193.067.115.047.2.137a.3.3 0 0 1 .073.207.38.38 0 0 1-.083.239"/><path fill-rule="evenodd" d="M10.261 11.935a3.06 3.06 0 1 1 .004.006zm3.543-1.528a1.2 1.2 0 0 0-.3-.18 2 2 0 0 0-.348-.114l-.103-.025.005-.888a.6.6 0 0 1 .253.098.43.43 0 0 1 .182.317h.556a.83.83 0 0 0-.15-.477 1 1 0 0 0-.402-.325 1.3 1.3 0 0 0-.434-.11l.002-.362h-.33l-.004.36q-.225.02-.43.11a1 1 0 0 0-.419.33.8.8 0 0 0-.153.493.7.7 0 0 0 .228.55c.18.152.393.257.622.308l.14.036-.005.94a1 1 0 0 1-.162-.04.54.54 0 0 1-.236-.166.5.5 0 0 1-.103-.277h-.568c.002.192.06.379.165.539a.96.96 0 0 0 .427.336q.227.092.473.109l-.002.357h.33l.002-.357q.257-.014.496-.113a.94.94 0 0 0 .413-.331.86.86 0 0 0 .143-.493.8.8 0 0 0-.078-.361.8.8 0 0 0-.21-.264" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-bookmark-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path fill-rule="evenodd" d="M3.5 1 4 .5l8 .003.5.5v14.25l-.82.383-3.681-3.07-3.679 3.07-.82-.383zm1 .5v12.684l3.178-2.654h.64l3.182 2.654V1.502z" clip-rule="evenodd"/><path d="M7.881 2.711 7.404 4.18H5.86l-.073.226 1.249.907-.477 1.469.192.14L8 6.013l1.249.907.192-.14-.477-1.468 1.25-.907-.074-.226H8.596L8.119 2.71z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-bookmark-solid",
      viewBox: "0 0 16 16",
      content: '<g clip-path="url(#a)"><path fill="currentColor" fill-rule="evenodd" d="m4 .5-.5.5v14.253l.82.383L8 12.566l3.68 3.07.821-.383V1.002l-.5-.5zm3.881 2.211L7.404 4.18H5.86l-.073.226 1.249.907-.477 1.469.192.14L8 6.013l1.249.907.192-.14-.477-1.468 1.25-.907-.074-.226H8.596L8.119 2.71z" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-bug-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M11.25 5.25h2V3.5h1v2.25l-.5.5h-1.5V8h2v1h-2v1.75h1.5l.5.5v2.25h-1v-1.75h-1.118a4.252 4.252 0 0 1-8.264 0H2.75v1.75h-1v-2.25l.5-.5h1.5V9h-2V8h2V6.25h-1.5l-.5-.5V3.5h1v1.75h2v-1a3.25 3.25 0 1 1 6.5 0zm-1-1a2.25 2.25 0 0 0-4.5 0v1h4.5zm-5.5 6.5v-4.5H7.5v7.712a3.25 3.25 0 0 1-2.75-3.212m3.75 3.212V6.25h2.75v4.5a3.25 3.25 0 0 1-2.75 3.212" clip-rule="evenodd"/>'
    },
    {
      id: "cf-bug-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M5 4.75v-.941C5 2.119 6.343.75 8 .75s3 1.37 3 3.059v.941zm-3.25 1.5V4h1v1.75H7.5v9.22a4 4 0 0 1-3.43-3.22H2.75v1.75h-1v-2.25l.5-.5H4v-1.5H1.75v-1H4v-1.5H2.25zm12.5 0V4h-1v1.75H8.5v9.22a4 4 0 0 0 3.43-3.22h1.32v1.75h1v-2.25l-.5-.5H12v-1.5h2.25v-1H12v-1.5h1.75z"/>'
    },
    {
      id: "cf-calendar-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14 3h-2.75V2h-1v1h-4.5V2h-1v1H2l-.5.5v9.978l.5.5h12l.5-.5V3.5zM4.75 4v1h1V4h4.5v1h1V4h2.25v1.72h-11V4zM2.5 12.978v-6.25h11v6.25z"/><path fill="currentColor" d="M5.25 9.39a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m0 2.445a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m5.5-2.445a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m0 .945a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5M8 9.39a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m0 2.445a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5"/>'
    },
    {
      id: "cf-calendar-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M14 3h-2.75V2h-1v1h-4.5V2h-1v1H2l-.5.5v9.978l.5.5h12l.5-.5V3.5zM4.75 4v1h1V4h4.5v1h1V4h2.25v1.72h-11V4zm.5 5.39a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M6 11.085a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m4.75-1.695a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m-.417 1.071a.75.75 0 1 1 .833 1.247.75.75 0 0 1-.833-1.247M8 9.39a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m.75 1.695a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0" clip-rule="evenodd"/>'
    },
    {
      id: "cf-call-outline",
      viewBox: "0 0 16 16",
      content: '<g clip-path="url(#a)"><path fill="currentColor" fill-rule="evenodd" d="M6.082 9.918c1.08 1.08 2.335 2.01 3.39 2.707 1.17.773 2.698.69 3.907-.123l1.693-1.199-3.25-2.375-1.625 1.5h-.75L5.572 6.553v-.75l1.533-1.62L4.572.928 3.498 2.621c-.814 1.21-.896 2.736-.123 3.907.696 1.055 1.627 2.31 2.707 3.39m2.84 3.542c-1.088-.718-2.402-1.69-3.547-2.835S3.258 8.165 2.54 7.079c-1.025-1.552-.88-3.519.128-5.016L4.197-.072h.75l3.125 4v.75l-1.5 1.5 3.25 3.25 1.5-1.5h.75l4 3v.75l-2.135 1.654c-1.497 1.007-3.464 1.153-5.016.128" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-captcha-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M10.379 3.957a4.995 4.995 0 0 0-6.54 1.619l-.833-.555a5.995 5.995 0 1 1-.853 1.98l.974.225a4.995 4.995 0 1 0 7.252-3.27" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M3.793 4.577 4.201 1.9l-.989-.15-.558 3.665 3.666.558.15-.99zm7.061 2.352L7.25 10.532 5.396 8.68l.708-.707L7.25 9.118l2.896-2.896z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-caret-double-left-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m8.688 8 5.796 5.797-.707.707L7.274 8l6.503-6.504.707.708z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="m2.91 8 5.797 5.797-.707.707L1.496 8 8 1.496l.707.708z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-caret-double-right-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M7.293 8 1.496 2.204l.708-.708L8.707 8l-6.503 6.504-.708-.707z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M13.07 8 7.274 2.204l.707-.708L14.484 8l-6.503 6.504-.707-.707z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-caret-down-1-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m3.146 6.177.354-.854h9l.354.854-4.5 4.5h-.708z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-caret-down-2-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m3.5 5.043 4.5 4.5 4.5-4.5.707.707L8 10.957 2.793 5.75z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-caret-left-1-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m9.823 3.146.854.354v9l-.854.354-4.5-4.5v-.708z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-caret-left-2-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M10.957 3.5 6.457 8l4.5 4.5-.707.707L5.043 8l5.207-5.207z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-caret-reorder-2-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M8 2.707 3.854 6.854l-.708-.708 4.5-4.5h.708l4.5 4.5-.708.708zm0 10.586L3.854 9.146l-.708.708 4.5 4.5h.708l4.5-4.5-.708-.708z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-caret-reorder-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m13.479 6.636-.354.854H2.875l-.354-.854 5.125-5.125h.708zM2.877 8.504h10.25l.353.853-5.125 5.125h-.707L2.523 9.357z"/>'
    },
    {
      id: "cf-caret-resize-horizontal-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m9.362 13.475-.854-.354V2.871l.854-.354 5.124 5.125v.707zM7.494 2.873v10.25l-.853.353-5.125-5.125v-.707L6.64 2.52z"/>'
    },
    {
      id: "cf-caret-right-1-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m6.177 12.854-.854-.354v-9l.854-.354 4.5 4.5v.708z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-caret-right-2-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M5.75 2.793 10.957 8 5.75 13.207l-.707-.707 4.5-4.5-4.5-4.5z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-caret-up-1-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m3.146 9.823 4.5-4.5h.708l4.5 4.5-.354.854h-9z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-caret-up-2-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m8 5.043 5.207 5.207-.707.707-4.5-4.5-4.5 4.5-.707-.707z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-case-study-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m13.853 5.648-4-4L9.5 1.5h-5L4 2v2h1V2.5h4V6l.5.5H13v7H5V12H4v2l.5.5h9l.5-.5V6zM10 5.5V3.21l1.145 1.145L12.293 5.5z"/><path fill="currentColor" d="m6.565 10.448 2.208 2 .672-.75-2.208-2a3.132 3.132 0 1 0-.672.737zM2.5 8a2.125 2.125 0 1 1 4.25 0A2.125 2.125 0 0 1 2.5 8"/>'
    },
    {
      id: "cf-case-study-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M9.49 5.49V1.5H4.5L4 2v3.212a3.132 3.132 0 0 0 0 5.841V14l.5.5h8.963l.5-.5V5.99H9.99zM4 9.941v1.112a3.13 3.13 0 0 0 3.081-.468v.012l2.208 2 .672-.75-2.207-2A3.133 3.133 0 0 0 4 5.212v1.145a2.125 2.125 0 0 0 0 3.584m0 0V6.357a2.124 2.124 0 1 1 0 3.584m6.49-4.951V2.002l2.975 2.988z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cell-tower-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M6.39 3.827a1.145 1.145 0 0 1 0-1.612L5.683 1.5a2.145 2.145 0 0 0 0 3.027z"/><path d="M4.978 5.25a3.143 3.143 0 0 1 0-4.438L4.273.095a4.14 4.14 0 0 0 0 5.852zm5.34-.715a2.145 2.145 0 0 0 0-3.035l-.708.715a1.145 1.145 0 0 1 0 1.612z"/><path d="M11.728 5.947a4.14 4.14 0 0 0 0-5.852l-.705.707a3.14 3.14 0 0 1 0 4.438zM9 3.025a1 1 0 1 0-1.482.875L3.5 16h1l.675-2h5.648l.677 2h1L8.467 3.907A1 1 0 0 0 9 3.025M8 5.632 8.793 8H7.195zM9.64 10.5H6.352l.5-1.5h2.275zM5.5 13l.5-1.5h3.977l.5 1.5z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-certificate-manager-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M7.993 7.677a2.167 2.167 0 1 0 0-4.334 2.167 2.167 0 0 0 0 4.334m0-3.334a1.167 1.167 0 1 1 0 2.333 1.167 1.167 0 0 1 0-2.333"/><path d="m13.396 7.013-1.553-1.5 1.536-1.485-1.416-2.453-2.01.575L9.415 0h-2.83l-.539 2.15-2.01-.575-1.415 2.452L4.164 5.52 2.621 7.013l1.415 2.452.166-.048v6.229l.853.352 2.957-2.957 2.96 2.957.853-.352V9.421l.155.044zm-9.519.176 1.341-1.297v-.743L3.878 3.85l.634-1.1 1.81.518.594-.475L7.365 1h1.27l.45 1.794.593.475 1.81-.518.636 1.1-1.344 1.3.021.744 1.34 1.295-.635 1.1-1.803-.516-.617.425L8.634 10H7.365l-.45-1.8-.599-.427-1.804.516zm6.948 7.25-2.46-2.457-.353-.357-.352.355-2.458 2.457V9.131l.854-.244L6.584 11h2.831l.53-2.117.88.252z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-certificate-manager-solid",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M9.803 11.078h-3.66L5.63 9.05l-.88.249v6.347l.853.354L8 13.61 10.397 16l.853-.354V9.309l-.933-.264z"/><path fill-rule="evenodd" d="M4.15 8.43 3.1 6.625l1.507-1.443.175-.163-.175-.162L3.1 3.415 4.15 1.61l1.988.563.195.047.073-.258.515-2.041h2.104l.515 2.04.06.262.207-.05 1.988-.563 1.052 1.803-1.504 1.44-.171.162.18.162 1.512 1.447-1.052 1.803-2.001-.565-.21-.059-.064.246-.513 2.028H6.921l-.513-2.031-.065-.236-.194.052zm3.831-1.867a1.562 1.562 0 1 0 0-3.125 1.562 1.562 0 0 0 0 3.125" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-certificate-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7.813 3.96H4.01v1h3.803z"/><path fill="currentColor" d="M14.5 8.127A3.04 3.04 0 0 0 12 5.142V2.44l-.5-.5H2.45l-.5.5v10.985l.5.5h6.5v.575l.868.34 1.632-1.765 1.633 1.765.874-.34V9.847a3 3 0 0 0 .543-1.72m-1 0a2.037 2.037 0 1 1-4.075 0 2.037 2.037 0 0 1 4.075 0M2.95 12.925V2.94H11v2.19A3.04 3.04 0 0 0 9.295 6h-5.27v1H8.64a3 3 0 0 0-.212 1H4.025v1H8.55a3 3 0 0 0 .408.852v3.073zM11.822 12l-.364-.395-.366.395-1.134 1.225v-2.46a3.01 3.01 0 0 0 3 0v2.457z"/>'
    },
    {
      id: "cf-certificate-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m2 2.5.5-.5h9.047l.5.5v2.342h-.045A3.25 3.25 0 0 0 9.512 6H4.015v1h4.924a3.3 3.3 0 0 0-.187.998H4.015v1H8.88c.105.363.273.704.495 1.008v3.978H2.5l-.5-.5zm5.803 2.461H4v-1h3.803z" clip-rule="evenodd"/><path fill="currentColor" d="M10.125 11.356v-.002 3.001l.435.17L12 12.95l1.441 1.574.435-.169v-3.61a3.25 3.25 0 0 1-3.75 0zm1.922-5.763A2.54 2.54 0 0 1 14.5 8.128v.03A2.5 2.5 0 1 1 12 5.59z"/>'
    },
    {
      id: "cf-challenges",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m12.848 10.366-2.31 2.336-1.392-1.453.722-.69.68.71 1.589-1.606z"/><path fill="currentColor" fill-rule="evenodd" d="M11 7.5a3.503 3.503 0 0 1 3.5 3.5l-.002.13a3.5 3.5 0 0 1-6.796 1.043H2l-.5-.5A4.17 4.17 0 0 1 5.671 7.5h1.854l.103.002a4.2 4.2 0 0 1 1.714.415A3.5 3.5 0 0 1 11 7.5v.393zm0 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5m-5.408.002a3.17 3.17 0 0 0-3.052 2.67h4.964a3.5 3.5 0 0 1 .919-2.54 3.2 3.2 0 0 0-.82-.13h-2.01M6.597 1.5a2.798 2.798 0 1 1 0 5.597 2.798 2.798 0 0 1 0-5.597m0 1a1.798 1.798 0 1 0 0 3.596 1.798 1.798 0 0 0 0-3.596" clip-rule="evenodd"/>'
    },
    {
      id: "cf-change-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14.354 8.499v.022c0 2.145-1.618 3.969-3.847 3.969l-7.157.01 1.75 1.75-.75.75-3-3 3-3 .75.75-1.75 1.75 7.16-.02c1.505 0 2.846-1.372 2.846-2.959V8.5zM1.35 7.5c0-2.145 1.654-4.017 3.883-4.017l7.117.017-1.75-1.75.75-.75 3.004 2.989L11.35 7l-.75-.75 1.75-1.757H5.23c-1.505 0-2.88 1.42-2.88 3.007z"/>'
    },
    {
      id: "cf-chat-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m2.25 3 .5-.5H13.5l.5.5v7.5l-.5.5H5.707l-2.603 2.604-.854-.354zm1 .5v8.543l1.896-1.897L5.5 10H13V3.5z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-chat-social-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m2.25 3 .5-.5H13.5l.5.5v7.5l-.5.5H5.707l-2.603 2.604-.854-.354zm1 .5v8.543l1.896-1.897L5.5 10H13V3.5z" clip-rule="evenodd"/><path fill="currentColor" d="M10.478 7.06c-.415.49-1.739 1.64-2.172 2.013-.433-.373-1.758-1.524-2.173-2.014-.184-.218-.383-.607-.383-.945 0-.362.145-.708.402-.964.257-.255.606-.399.97-.4a1.3 1.3 0 0 1 1.02.455l.165.188.16-.186a1.3 1.3 0 0 1 1.023-.456c.363 0 .712.144.97.4.256.255.401.601.402.963 0 .338-.2.727-.384.945"/>'
    },
    {
      id: "cf-cloud-hybrid-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.374 4.481a.523.523 0 1 0 0-1.046.523.523 0 0 0 0 1.046"/><path fill="currentColor" d="M14 1.964H2l-.5.5v3.213l.5.5h12l.5-.5V2.464zm-.5 3.213h-11V2.964h11zm-1.126 4.198a.523.523 0 1 0 0-1.047.523.523 0 0 0 0 1.047"/><path fill="currentColor" d="m2 6.857-.5.5v3.213l.5.5h.462a2.5 2.5 0 0 0-.034.386 2.57 2.57 0 0 0 2.566 2.566h6.398a2.183 2.183 0 0 0 2.18-2.18q0-.398-.136-.772H14l.5-.5V7.357l-.5-.5zm.842 3.213H2.5V7.857h3.207a3.4 3.4 0 0 0-.704 1.03 2.45 2.45 0 0 0-1.638.58 2.6 2.6 0 0 0-.524.603m8.55 2.952H4.989a1.57 1.57 0 0 1-1.561-1.565 1.65 1.65 0 0 1 .58-1.224c.265-.225.602-.348.95-.347q.147 0 .292.025l.434.075.13-.422a2.422 2.422 0 0 1 4.736.646l.016.57.563-.09a1.24 1.24 0 0 1 1.039.237 1.2 1.2 0 0 1 .404.915 1.18 1.18 0 0 1-1.18 1.18M13.5 10.07h-.817a2.15 2.15 0 0 0-1.185-.401 3.4 3.4 0 0 0-.941-1.812H13.5z"/>'
    },
    {
      id: "cf-cloud-hybrid-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M2 2h12l.5.5v3.213l-.5.5H2l-.5-.5V2.5zm10.374 2.546a.523.523 0 1 0 0-1.046.523.523 0 0 0 0 1.046M2 6.862h12l.5.5v3.213l-.5.5h-.889l-.054-.053a2.34 2.34 0 0 0-1.354-.612 3.672 3.672 0 0 0-6.862-.788 2.82 2.82 0 0 0-2.314 1.453H2l-.5-.5V7.362zm10.897 2.023a.523.523 0 1 1-1.046 0 .523.523 0 0 1 1.046 0" clip-rule="evenodd"/><path fill="currentColor" d="M10.303 9.303c.462.515.727 1.178.747 1.87 1.29-.208 2.022.718 2.022 1.646a1.68 1.68 0 0 1-1.68 1.68H4.988a2.065 2.065 0 1 1 .348-4.102 2.922 2.922 0 0 1 4.967-1.094"/>'
    },
    {
      id: "cf-cloud-internet-outline",
      viewBox: "0 0 16 16",
      content: '<g clip-path="url(#a)"><path fill="currentColor" d="M13.015 12.825h-9.46A3.56 3.56 0 0 1 0 9.27a3.65 3.65 0 0 1 1.3-2.757 3.4 3.4 0 0 1 2.423-.798 4.822 4.822 0 0 1 9.244 1.147 2.9 2.9 0 0 1 2 .681 3.01 3.01 0 0 1-1.95 5.282zM3.498 6.708c-.57-.002-1.121.2-1.555.57A2.64 2.64 0 0 0 1 9.27a2.56 2.56 0 0 0 2.547 2.555h9.468A1.99 1.99 0 0 0 15 9.839a2.03 2.03 0 0 0-.682-1.535 2.07 2.07 0 0 0-1.729-.404l-.563.09-.016-.57a3.822 3.822 0 0 0-7.47-1.015l-.13.422-.434-.077a3 3 0 0 0-.477-.042"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-cloud-internet-solid",
      viewBox: "0 0 16 16",
      content: '<g clip-path="url(#a)"><path fill="currentColor" d="M13.015 12.825h-9.46A3.56 3.56 0 0 1 0 9.27a3.65 3.65 0 0 1 1.3-2.757 3.4 3.4 0 0 1 2.423-.798 4.822 4.822 0 0 1 9.244 1.147 2.9 2.9 0 0 1 2 .681 3.01 3.01 0 0 1-1.95 5.282z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-cloud-multi-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M15.13 6.94a2.47 2.47 0 0 0-1.597-.571 3.99 3.99 0 0 0-6.726-2.227l-.087-.004a3.97 3.97 0 0 0-3.676 2.429 2.87 2.87 0 0 0-1.958.67A3.05 3.05 0 0 0 0 9.54a2.977 2.977 0 0 0 2.97 2.97h7.65a2.51 2.51 0 0 0 2.095-1.13h.775a2.531 2.531 0 0 0 1.64-4.44m-4.509 4.57H2.965A1.974 1.974 0 0 1 1 9.54a2.04 2.04 0 0 1 .729-1.537 1.84 1.84 0 0 1 1.196-.44q.185.001.368.034l.434.075.13-.422a2.995 2.995 0 0 1 5.857.796l.015.57.564-.09a1.58 1.58 0 0 1 1.32.305A1.54 1.54 0 0 1 12.132 10a1.51 1.51 0 0 1-1.51 1.51m2.868-1.13h-.39a2.53 2.53 0 0 0-.838-2.31 2.47 2.47 0 0 0-1.596-.572 3.96 3.96 0 0 0-2.54-3.109 2.995 2.995 0 0 1 4.455 2.528l.016.57.564-.09a1.58 1.58 0 0 1 1.32.305 1.546 1.546 0 0 1 .076 2.236 1.5 1.5 0 0 1-1.068.443"/>'
    },
    {
      id: "cf-cloud-multi-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M13.582 6.895a3.495 3.495 0 0 0-5.83-2.498 4.5 4.5 0 0 1 2.824 3.119l2.555 2.974q0 .193-.024.382h.883A2.01 2.01 0 0 0 16 8.862c0-1.11-.876-2.216-2.418-1.967m-3.006.62a2.9 2.9 0 0 1 1.607.75 3.05 3.05 0 0 1 .948 2.225z" clip-rule="evenodd"/><path fill="currentColor" d="M10.246 8.49c1.21.053 1.885 1.025 1.885 2a2.01 2.01 0 0 1-2.01 2.01H2.465a2.47 2.47 0 1 1 .416-4.906 3.495 3.495 0 0 1 6.833.928 3 3 0 0 1 .533-.033"/>'
    },
    {
      id: "cf-cloud-security-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M9.174.75h.768l.297.336a7.07 7.07 0 0 0 3.973 2.002l.354.052.44.518v3.7c0 2.578-1.227 4.493-2.449 5.756-1.218 1.26-2.461 1.907-2.584 1.97l-.185.093h-.461l-.183-.093a8 8 0 0 1-.813-.49c.431-.1.84-.263 1.216-.477l.011.006a9.7 9.7 0 0 0 2.264-1.742c1.104-1.143 2.154-2.809 2.154-5.023V4.11a8.1 8.1 0 0 1-4.418-2.235 8.1 8.1 0 0 1-4.417 2.234v1.794a4.6 4.6 0 0 0-1.031.756V3.657l.44-.518.355-.052a7.07 7.07 0 0 0 3.972-2z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M4.916 7.463a2.88 2.88 0 0 1 2.955 1.623c.487.004.958.178 1.333.493A2.23 2.23 0 0 1 10 11.263v.003a2.18 2.18 0 0 1-2.179 2.175h-5.25a1.88 1.88 0 0 1-1.704-1.226 1.875 1.875 0 0 1 .53-2.068l.001-.002h.001c.3-.252.67-.4 1.056-.424a2.87 2.87 0 0 1 2.461-2.258m1.367 1.274a1.886 1.886 0 0 0-2.41.326c-.298.33-.468.753-.48 1.195l-.016.57-.568-.091-.006-.001a.92.92 0 0 0-.76.174.9.9 0 0 0-.295.666v.002a.86.86 0 0 0 .253.608.87.87 0 0 0 .615.254h5.208c.314-.002.613-.127.834-.347s.343-.517.344-.826a1.22 1.22 0 0 0-.437-.92h-.002a1.1 1.1 0 0 0-.71-.26h-.001q-.113 0-.224.02l-.433.076-.13-.42a1.87 1.87 0 0 0-.782-1.026" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloud-upload-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M14.967 7.211a2.9 2.9 0 0 0-2-.68 4.822 4.822 0 0 0-9.244-1.147A3.4 3.4 0 0 0 1.3 6.18 3.65 3.65 0 0 0 0 8.94a3.563 3.563 0 0 0 3.555 3.554H6.5v-1H3.547A2.56 2.56 0 0 1 1 8.939a2.64 2.64 0 0 1 .943-1.992 2.41 2.41 0 0 1 2.032-.528l.435.075.13-.422a3.821 3.821 0 0 1 7.47 1.016l.017.57.563-.091a2.07 2.07 0 0 1 1.729.405A2.03 2.03 0 0 1 15 9.508a1.987 1.987 0 0 1-1.985 1.985h-.032c-.061.001-.428.006-2.483.006v1c1.93 0 2.392-.004 2.515-.007a3.011 3.011 0 0 0 1.951-5.281"/><path d="m10.95 9.456-2.46-2.5-2.46 2.5.712.701L7.99 8.89v3.62h1V8.89l1.248 1.268z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-cloud-upload-solid",
      viewBox: "0 0 16 16",
      content: '<g clip-path="url(#a)"><path fill="currentColor" d="M12.967 6.53a2.9 2.9 0 0 1 2 .681 3.01 3.01 0 0 1-1.952 5.281c-.082.002-2.113.004-4.025.006V8.89l1.248 1.268.713-.7L8.49 6.954 6.03 9.456l.713.701L7.99 8.89v3.61H6.5v-.006H3.555A3.56 3.56 0 0 1 0 8.939 3.65 3.65 0 0 1 1.3 6.18a3.4 3.4 0 0 1 2.423-.797 4.822 4.822 0 0 1 9.244 1.147"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-cloudflare-access-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M9.2 2.698a5.3 5.3 0 0 0-5.04 3.657l-.035.11H5.1l.022-.052a4.375 4.375 0 1 1 .308 3.835l-.05-.088H4.358l.06.123q.138.297.317.575A5.303 5.303 0 1 0 9.2 2.698"/><path fill="currentColor" d="M9.448 7.272 7.59 5.415l-.617.617 1.08 1.083H0l.52.872h8.63zm-.013 3.941-.618-.618 1.08-1.082H1.425l-.518-.875h10.088l.298.717z"/>'
    },
    {
      id: "cf-cloudflare-access-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M9.203 13.3a5.3 5.3 0 1 0-5.227-6.185H0l.52.873h3.382a5 5 0 0 0 .038.65H.907l.518.875H4.12A5.3 5.3 0 0 0 9.203 13.3M4.121 9.514h5.776l-1.08 1.082.618.618 1.857-1.858-.297-.717H3.94q.055.45.181.875m-.219-1.525H9.15l.297-.715L7.59 5.415l-.617.618 1.08 1.082H3.976a5.3 5.3 0 0 0-.074.873" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-account-analytics-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m3.01 2.01.5-.5h4.98l.353.146h.002l.1.102 3.908 3.888L13 6v2h-1V6.52H8.49l-.5-.5V2.51H4.01v11H7v1H3.51l-.5-.5zm5.98 1.212V5.52h2.282z" clip-rule="evenodd"/><path fill="currentColor" d="M13 14.5V9h-1v5.5zm-2 0v-4.125h-1V14.5zm-2 0v-2.062H8V14.5z"/>'
    },
    {
      id: "cf-cloudflare-api-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13.5 2h-11l-.5.5v11l.5.5h11l.5-.5v-11zM13 13H3V3h10z"/><path fill="currentColor" d="M4.656 9.125h1.387l.284.875h.87L5.873 6.158H4.826L3.5 10h.87zm.679-2.088h.03l.472 1.454h-.975zM8.42 8.754h.682c.261.008.52-.048.755-.163.201-.101.367-.26.478-.456.113-.207.17-.44.165-.675a1.4 1.4 0 0 0-.162-.676 1.15 1.15 0 0 0-.47-.459 1.55 1.55 0 0 0-.745-.166H7.607V10h.813zm0-1.932h.547a.85.85 0 0 1 .39.08.53.53 0 0 1 .23.223.78.78 0 0 1 0 .67.53.53 0 0 1-.229.227.8.8 0 0 1-.387.082h-.55zM12 6.158h-.812V10H12z"/>'
    },
    {
      id: "cf-cloudflare-api-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M5.365 7.037h-.03l-.473 1.454h.975zm3.055-.215h.548a.85.85 0 0 1 .39.08.53.53 0 0 1 .23.223.78.78 0 0 1 0 .67.53.53 0 0 1-.229.227.8.8 0 0 1-.387.082h-.55z"/><path fill="currentColor" fill-rule="evenodd" d="M2.5 2h11l.5.5v11l-.5.5h-11l-.5-.5v-11zm3.543 7.125H4.655L4.37 10H3.5l1.326-3.842h1.047L7.196 10h-.87zm2.377-.37h.683c.261.007.52-.049.755-.164.2-.101.367-.26.478-.456.113-.206.17-.44.165-.675a1.4 1.4 0 0 0-.163-.676 1.14 1.14 0 0 0-.47-.459 1.55 1.55 0 0 0-.744-.166H7.608V10h.812zm2.768-2.597H12V10h-.812z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-area1-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M9.623 1.167h-.747l-.285.322a6.83 6.83 0 0 1-3.823 1.91l-.34.05L4 3.942V5.25H1.5l-.5.5v6l.5.5h4.22c1.336 1.684 2.987 2.537 3.128 2.607l.177.09h.449l.178-.09c.119-.06 1.316-.677 2.49-1.882C13.318 11.768 14.5 9.94 14.5 7.478V3.944l-.427-.495-.34-.05a6.83 6.83 0 0 1-3.824-1.91zM7.048 12.25a9.4 9.4 0 0 0 2.202 1.69 9.4 9.4 0 0 0 2.176-1.663c1.063-1.091 2.074-2.682 2.074-4.799V4.375a7.83 7.83 0 0 1-4.25-2.132A7.83 7.83 0 0 1 5 4.374v.876h5.022l.5.5v6l-.5.5zM5.761 9.003 2.779 6.25h5.964zm1.771-.274 1.99-1.837v3.703zm-.737.68 1.963 1.84H2.764l1.963-1.84.695.642H6.1zM2 6.892v3.703L3.99 8.73z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-argo-smart-routing-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M1.27 3.25c0-.97.804-1.75 1.787-1.75.984 0 1.787.78 1.787 1.75S4.041 5 3.057 5 1.27 4.22 1.27 3.25m1.787-.75a.76.76 0 0 0-.771.75c0 .41.341.75.771.75a.76.76 0 0 0 .772-.75.76.76 0 0 0-.772-.75" clip-rule="evenodd"/><path fill="currentColor" d="m9.578 7.478.095-1.1L5.601 4.08l-.51.866zM3.556 10.25v-4.5H2.54v4.5zm5.042-1.224.506.863 1.155-.652-.474-.88zm-1.256 1.858-.507-.864 1.102-.621.506.863zm-.661.373-1.101.623-.508-.866 1.102-.621zm5.844-3.555c.287 0 .52-.23.52-.512a.517.517 0 0 0-.52-.513c-.287 0-.52.23-.52.513s.232.512.52.512"/><path fill="currentColor" fill-rule="evenodd" d="M12.525 5c-.58 0-1.137.225-1.55.627a2.15 2.15 0 0 0-.655 1.518v.006c0 .405.134.84.301 1.234a9 9 0 0 0 .612 1.16 15 15 0 0 0 .877 1.266h.796l.08-.101c.048-.063.118-.154.201-.267.166-.225.388-.54.61-.895.222-.354.45-.757.625-1.16.17-.394.308-.83.308-1.237v-.006a2.15 2.15 0 0 0-.655-1.518A2.22 2.22 0 0 0 12.525 5m.408 4.023a13 13 0 0 1-.42.629c-.126-.18-.268-.394-.41-.625-.203-.33-.4-.687-.544-1.027-.148-.348-.223-.638-.224-.846.005-.307.132-.6.354-.816a1.2 1.2 0 0 1 1.672 0c.222.216.349.509.353.816 0 .206-.077.495-.227.842a8 8 0 0 1-.554 1.027M3.057 14.5c-.983 0-1.787-.78-1.787-1.75S2.074 11 3.057 11c.984 0 1.787.78 1.787 1.75s-.803 1.75-1.787 1.75m-.771-1.75c0 .41.341.75.771.75a.76.76 0 0 0 .772-.75.76.76 0 0 0-.772-.75.76.76 0 0 0-.771.75" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-browser-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.625 5.375a.525.525 0 1 0 0-1.05.525.525 0 0 0 0 1.05m1.675 0a.525.525 0 1 0 0-1.05.525.525 0 0 0 0 1.05m1.675 0a.525.525 0 1 0 0-1.05.525.525 0 0 0 0 1.05"/><path fill="currentColor" d="M14 2.975H2l-.5.5v9.975l.5.5h12l.5-.5V3.475zm-.5 1V5.7h-11V3.975zm-11 8.975V6.7h11v6.25z"/><path fill="currentColor" d="m9.9 9.15.1-.05-.375-.65-1.275.8.025-1.525h-.75L7.65 9.25l-1.275-.8L6 9.1l1.325.725L6 10.55l.375.65 1.275-.8-.025 1.5h.75l-.025-1.5 1.275.8.375-.65-1.325-.725z"/>'
    },
    {
      id: "cf-cloudflare-browser-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.625 5.375a.525.525 0 1 0 0-1.05.525.525 0 0 0 0 1.05m1.675 0a.525.525 0 1 0 0-1.05.525.525 0 0 0 0 1.05m2.2-.525a.525.525 0 1 1-1.05 0 .525.525 0 0 1 1.05 0"/><path fill="currentColor" fill-rule="evenodd" d="M14 2.975H2l-.5.5v9.975l.5.5h12l.5-.5V3.475zm-.5 1V5.7h-11V3.975zM10 9.1l-.1.05-1.225.675L10 10.55l-.375.65-1.275-.8.025 1.5h-.75l.025-1.5-1.275.8L6 10.55l1.325-.725L6 9.1l.375-.65 1.275.8-.025-1.525h.75L8.35 9.25l1.275-.8z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-bundled-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M6.069 1.92h1.239l4.466 6.103-4.355 5.896H6.176l4.357-5.9z"/><path fill="currentColor" d="m3.029 7.991 3.213 4.303-.62.84-3.62-4.847.003-.603 3.604-4.711.616.841zm6.67-6.071H8.448l4.53 6.026-4.532 5.973h1.256l4.301-5.67.002-.602z"/><path fill="currentColor" d="M7.25 6v1.5h1.5v1h-1.5V10h-1V8.5h-1.5v-1h1.5V6z"/>'
    },
    {
      id: "cf-cloudflare-byoip-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m.5 2.24-.5.5v10.5l.5.5h10l.5-.5v-2.902h-1v2.401H1v-9.5h9v2.402h1V2.739l-.5-.5zm13.525 5.25-1.122-1.1.7-.714 2.361 2.313-2.36 2.314-.7-.714 1.121-1.1H12v-1z"/><path fill="currentColor" d="M8 8.016a.57.57 0 1 0 1.14 0 .57.57 0 0 0-1.14 0m2.483.569a.57.57 0 1 1 0-1.14.57.57 0 0 1 0 1.14M3.25 6.171h-.807V9.99h.807z"/><path fill="currentColor" fill-rule="evenodd" d="M4.25 9.99h.807V8.75h.679c.878 0 1.389-.523 1.389-1.286 0-.759-.502-1.294-1.369-1.294H4.25zm.807-1.886V6.831h.545c.466 0 .691.254.691.634 0 .378-.225.64-.688.64z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-carbon-impact-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m10.142 5.468-.005-.053q-.004-.053-.01-.102a.1.1 0 0 0-.005-.028l-.002-.027c-.025-.263-.06-.52-.095-.768q-.006.001-.008.005-.464.178-.948.4.027.2.05.415l.003.003q.01.071.015.142.014.12.025.243c.002.04.01.08.01.122 0 .043.007.085.01.125l.005-.002c.332-.16.655-.3.96-.423h.002zm-1.458.317a4 4 0 0 0-.22-.12 10 10 0 0 0-.47-.247q0-.007-.002-.003-.53.274-1.06.583h-.01l-.058.035-.06.035q-.539.311-1.04.637h-.002q-.514.333-.983.665-.436.311-.825.625a14 14 0 0 0-1.122.983c-1.163 1.14-1.565 2.047-1.193 2.693h.003c.37.642 1.355.745 2.925.31q.39-.109.815-.258a22 22 0 0 1-.133-1.015c-1.545.563-2.555.66-2.742.465a.62.62 0 0 1 .12-.402c.275-.473.99-1.25 2.15-2.153.11-.083.217-.168.335-.25q.056-.045.117-.085l.198-.143.11-.08.092-.067.103-.073.002.003a22 22 0 0 1 1.63-1.025c.215-.125.425-.24.63-.353q.557-.298 1.073-.547-.192-.109-.383-.213m-1.807 4.898a15 15 0 0 1-.063-.633 19 19 0 0 1-.967.425q.051.534.13 1.028s0-.002.005-.002q.46-.18.945-.405c-.015-.133-.035-.271-.05-.413m7.483-6.358h-.003c-.37-.645-1.357-.75-2.927-.315q-.39.107-.813.257v.005q.076.488.132 1.013c1.535-.558 2.543-.653 2.743-.46.075.305-.678 1.31-2.275 2.55a7 7 0 0 1-.333.25q-.242.184-.514.372h-.003l-.103.07q-.466.322-1.007.658-.3.183-.623.37-.323.186-.632.352-.559.302-1.073.548.187.11.375.21.082.05.165.09a19 19 0 0 0 .53.28l.003.003c.352-.18.707-.378 1.065-.58l.005-.003.002-.003.12-.07V9.92l.068-.038c.102-.06.202-.117.302-.18q.082-.045.16-.097a1 1 0 0 0 .08-.05q.095-.056.185-.113.11-.067.215-.137l.028-.02h.003a8 8 0 0 0 .86-.577q.054-.04.11-.078l.007-.008.002.003.003-.005.002-.003q.215-.155.42-.307.027-.022.053-.04.183-.133.35-.27.588-.462 1.123-.985A6.2 6.2 0 0 0 14.2 5.75c.146-.237.243-.502.285-.778a1.06 1.06 0 0 0-.125-.647"/><path fill="currentColor" d="M10.265 7.928v-.003q0-.217-.006-.43v-.003q0-.092-.005-.185 0-.049-.002-.095-.003-.169-.013-.335l-.002-.092-.005-.075v-.005l-.002-.075-.005-.07-.005-.135a26 26 0 0 0-.04-.558l-.023-.247-.008-.083-.002-.015.002-.002-.007-.053-.005-.052q-.004-.053-.01-.103l-.005-.027q0-.015-.002-.028c-.025-.262-.06-.52-.095-.767q-.109-.738-.293-1.46C9.324 1.452 8.742.652 7.999.652c-.742 0-1.327.803-1.735 2.38q-.1.394-.185.835.464.18.948.393a7.7 7.7 0 0 1 .687-2.3c.105-.18.203-.283.285-.305.303.085.795 1.24 1.07 3.24q.027.2.05.415l.003.002q.01.071.015.143.014.12.025.242c.002.04.01.08.01.123s.007.085.01.125q.004.06.012.125v.002q.046.57.063 1.203.009.352.01.722 0 .371-.01.728c-.013.42-.03.817-.063 1.195v.002l.068-.04c.102-.06.202-.117.302-.18q.082-.045.16-.097a1 1 0 0 0 .08-.05q.095-.056.185-.113c.06-.037.123-.075.18-.112l.035-.025.028-.02h.003q.03-.593.03-1.213v-.005l.002-.072v-.063zm-.496 2.382c-.19-.08-.382-.17-.582-.262l-.003.002q-.047.559-.112 1.045a20 20 0 0 0 .95.403l.002-.002q.076-.492.126-1.028-.186-.07-.38-.158m.148 1.818q-.462-.18-.943-.393c-.287 1.62-.71 2.538-.97 2.606-.302-.073-.802-1.228-1.077-3.245-.015-.133-.035-.27-.05-.413a15 15 0 0 1-.063-.633l-.012-.127a25 25 0 0 1-.073-1.928c-.002-.25.005-.49.01-.727q.018-.626.065-1.193v-.007q-.539.311-1.04.637h-.002l.002.005q-.031.592-.032 1.21l.002.003h-.001l-.001.002v.14c-.003.413.01.82.03 1.218v.005q.027.61.085 1.188.051.532.13 1.027.1.737.287 1.457c.405 1.58.993 2.38 1.733 2.38H8c.445 0 .827-.284 1.155-.85.258-.482.452-.995.577-1.527q.104-.397.188-.835zm-3.47-7.44-.24-.098q-.117-.049-.233-.095l-.002.003q-.071.491-.123 1.025l.38.162h.003q.28.121.58.265v-.007q.048-.557.115-1.043c-.163-.075-.32-.142-.48-.212"/><path fill="currentColor" d="M13.145 8.968c-.188-.188-.39-.373-.61-.565h-.003a23 23 0 0 1-.807.62l-.003.002-.005.005c1.245 1.043 1.822 1.86 1.75 2.118-.213.225-1.45.082-3.318-.68q-.186-.07-.38-.158-.284-.122-.582-.262l-.113-.055-.002.002A28 28 0 0 1 6.739 8.72q-.536-.333-1.005-.652l-.002-.003c-.003.413.01.82.03 1.218v.005l.005-.003q.498.326 1.035.638l.127.072q.187.11.375.21.082.05.165.09a19 19 0 0 0 .53.28l.003.003.067.035q.229.12.458.228a25 25 0 0 0 .542.255h.003a20 20 0 0 0 1.308.537l.372.13c.112.037.223.075.327.105q.169.055.333.1.146.04.285.072c.093.023.188.046.275.063q.147.031.285.055.279.046.52.063.444.036.878-.073.147-.041.282-.112c.164-.09.3-.222.393-.383.372-.643-.028-1.545-1.185-2.685m-8.36-1.593h-.003v-.003l-.003-.002q-.436.31-.825.625L3.962 8q.384.307.815.617c.11-.082.217-.167.335-.25q.056-.044.117-.085.097-.071.198-.142.048-.036.1-.07c.035-.023.065-.048.1-.073l.002-.002v-.003a19 19 0 0 1-.845-.617m5.474.12v-.003q0-.092-.005-.185 0-.049-.002-.095-.003-.169-.013-.335l-.002-.092-.005-.075c-.333-.218-.68-.428-1.035-.638h-.003V6.07l-.127-.073a29 29 0 0 0-.603-.332 10 10 0 0 0-.47-.248q0-.007-.002-.002a14 14 0 0 0-.52-.26q-.274-.135-.543-.255h-.002c-.163-.075-.32-.143-.48-.213l-.24-.097q-.117-.05-.233-.095-.363-.144-.712-.258-.35-.12-.678-.212a8 8 0 0 0-.282-.07q-.143-.035-.278-.065a5.4 5.4 0 0 0-.82-.115q-.151-.01-.287-.008-.13.001-.26.018l-.003-.003q-.166.021-.327.068l-.11.037a1 1 0 0 0-.173.083 1 1 0 0 0-.212.162 1 1 0 0 0-.165.21c-.373.643.027 1.545 1.185 2.685.192.185.395.375.617.563q.385-.31.808-.62l.005-.003c-1.238-1.04-1.818-1.857-1.75-2.125.225-.217 1.46-.075 3.317.68l.38.163h.003q.28.121.58.265l.11.047.006.003q.513.248 1.067.545.314.17.635.355a27 27 0 0 1 1.635 1.027v-.002q0-.216-.005-.43m1.778.5a22 22 0 0 0-.82-.62 7 7 0 0 1-.333.25q-.242.184-.514.372h-.003l.002.003q.455.319.843.622l.002.003.003-.005.002-.003q.215-.155.42-.307.027-.022.053-.04.183-.133.35-.27z"/>'
    },
    {
      id: "cf-cloudflare-casb-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M4.5 2A2.5 2.5 0 0 0 2 4.5v2.289l-.648-.644-.705.71 1.864 1.852 1.844-1.855-.71-.704L3 6.797V4.5A1.5 1.5 0 0 1 4.5 3h7A1.5 1.5 0 0 1 13 4.5v1.25h1V4.5A2.5 2.5 0 0 0 11.5 2zM13 8.703V11.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5V9.766H2V11.5A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5V8.711l.648.644.704-.71-1.863-1.852-1.844 1.855.71.704z"/><path fill="currentColor" d="m4.845 8.25.855-.825 1.645 1.718 3.465-3.496.845.835-4.31 4.37z"/>'
    },
    {
      id: "cf-cloudflare-d-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M12.152 2.048a1.8 1.8 0 0 0-1.043.067 1.76 1.76 0 0 0-.82.64 1.73 1.73 0 0 0-.003 1.976l-.045.054L8.76 6.53a1.722 1.722 0 0 0-2.38 1.155 1.7 1.7 0 0 0 .247 1.355l-1.535 1.807a2 2 0 0 0-.165-.038 1.78 1.78 0 0 0-1.2.134 1.744 1.744 0 0 0-.902 2.062c.119.394.374.733.721.959a1.775 1.775 0 0 0 2.253-.266 1.74 1.74 0 0 0 .12-2.244L7.35 9.737l.06-.07q.115.046.238.075a1.72 1.72 0 0 0 2.078-1.257 1.7 1.7 0 0 0-.21-1.297l1.55-1.824q.126.048.258.077c.455.109.934.034 1.333-.207s.684-.63.794-1.08.034-.924-.21-1.319a1.76 1.76 0 0 0-1.09-.787M4.335 13.232a.76.76 0 0 1-.568-.611.74.74 0 0 1 .352-.754.76.76 0 0 1 1.102.38.74.74 0 0 1-.315.896.76.76 0 0 1-.57.089m7.226-8.76a.76.76 0 0 1-.569-.611.74.74 0 0 1 .352-.754.76.76 0 0 1 1.103.38.74.74 0 0 1-.315.896.76.76 0 0 1-.571.089" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-dlp-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m1.5 1.75.5-.5h9.983l.5.5v3.014a3 3 0 0 0-1-.255V2.25H2.5v10.495h4v1H2l-.5-.5z"/><path fill="currentColor" d="M10.468 4.495H3.49v-1h6.978zM3.49 6.512h3.948v-1H3.49zm3.948 1.983H3.49v-1h3.948zm3.995 4.849v-1.169a.81.81 0 0 0 .363-.875.81.81 0 0 0-.796-.626.82.82 0 0 0-.796.626.81.81 0 0 0 .363.875v1.17z"/><path fill="currentColor" fill-rule="evenodd" d="m14.194 9.216.431.429v4.801l-.431.429H7.806l-.431-.429V9.645l.431-.429h.78v-1.44c0-.637.255-1.248.708-1.698a2.42 2.42 0 0 1 3.412 0c.453.45.708 1.061.708 1.698v1.44zM9.976 6.759c-.271.27-.424.636-.424 1.017v1.44h2.896v-1.44c0-.381-.152-.747-.424-1.017a1.45 1.45 0 0 0-2.048 0m-1.635 7.154v-3.735h5.318v3.735z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-durable-objects-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M5.873 4.855a.75.75 0 1 0-1.23.859.75.75 0 0 0 1.23-.859m5.492 6.497a.75.75 0 1 1-.859-1.23.75.75 0 0 1 .859 1.23"/><path fill="currentColor" fill-rule="evenodd" d="M8.054 1.5h-.051a6.5 6.5 0 1 0 .05 0M5.678 3.016A5.5 5.5 0 0 0 2.526 7.5h1.951q.017-.447.063-.878l1 .06q-.045.398-.062.818H7.5V2.63c-.446.202-.868.645-1.225 1.352l-.068.142-.968-.286q.069-.157.143-.306.136-.27.296-.516M7.5 8.5H5.478c.056 1.396.348 2.625.797 3.518.357.707.78 1.15 1.225 1.352zm-1.822 4.484a6 6 0 0 1-.296-.517C4.85 11.41 4.534 10.02 4.477 8.5H2.526a5.5 5.5 0 0 0 3.152 4.484m4.888-.118A5.5 5.5 0 0 0 13.48 8.5h-1.787q-.018.457-.065.897l-1-.06q.045-.406.064-.837H8.5v4.935c.508-.16.993-.621 1.394-1.417q.033-.064.063-.13l.969.287a6 6 0 0 1-.36.691m.126-5.366H8.5V2.565c.508.16.993.621 1.394 1.417.45.893.742 2.122.798 3.518m1 0c-.056-1.519-.372-2.91-.905-3.968a6 6 0 0 0-.22-.398A5.5 5.5 0 0 1 13.48 7.5z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-email-forwarding-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path fill-rule="evenodd" d="m3.728 4 .5-.5h11.286l.5.5v7.983l-.5.5H4.228l-.5-.5zm4.037 3.963-3.037 2.862v-5.68zm-2.277 3.52L8.5 8.644l1.03.956h.68l1.031-.955 3.013 2.838zm9.526-.658v-5.68l-3.038 2.818zM9.87 8.552 5.502 4.5h8.737z" clip-rule="evenodd"/><path d="M.75 6.5H3v-1H.75zM3 8.5H0v-1h3zm-2.25 2H3v-1H.75z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-cloudflare-email-security-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m14.373 3.53-.34-.047a6.98 6.98 0 0 1-3.843-1.898l-.297-.335h-.75l-.29.335A6.98 6.98 0 0 1 5.02 3.483l-.34.047-.43.5V5h-2.5l-.5.5v6.25l.5.5h4.16a10.5 10.5 0 0 0 3.196 2.684l.011.006.178.09h.45l.178-.09c.197-.098 4.88-2.5 4.88-7.38V4.025zm-7.158 8.72a9.3 9.3 0 0 0 2.305 1.773c.5-.255 4.283-2.375 4.283-6.463v-3.1A8.03 8.03 0 0 1 9.52 2.335 8.04 8.04 0 0 1 5.238 4.46V5H11l.5.5v6.25l-.5.5zM2.25 10.602V6.6l2.222 1.937zm.772.648L5.23 9.197l.816.712h.658l.875-.763L9.76 11.25zm7.478-.677L8.335 8.486 10.5 6.6zM3.084 6h6.582L6.375 8.869z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-email-security-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m13.748 3.53-.34-.047a6.98 6.98 0 0 1-3.843-1.898l-.297-.335h-.75l-.29.335a6.98 6.98 0 0 1-3.833 1.898l-.34.047-.43.5v1.095h6.75l.375.375v6.25l-.375.375H5.189a10.45 10.45 0 0 0 3.292 2.809l.012.006.177.09h.45l.178-.09c.197-.098 4.88-2.5 4.88-7.38V4.025zM1.5 10.89V6.323l2.533 2.21zm.579.485 2.523-2.346.902.786h.492l.962-.838 2.488 2.398zM10 10.867 7.526 8.483 10 6.324zM2.126 5.876h7.248L5.75 9.035z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-firewall-rules-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m1.5 2 .5-.5h5.5L8 2v3l-.5.5H5.149v2.032L6.08 6.6l.566.566-1.897 1.897L2.85 7.166l.566-.566.932.932V5.5H2L1.5 5zM7 4.5v-2H2.5v2z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M2 14h12l.5-.5v-9L14 4h-3.25l-.5.5V7H8.5l-.5.5V10H2l-.5.5v3zm.5-3h2.25v2H2.5zm3.25 2v-2h4.5v2zm7.75-5H9v2h4.5zm0-1V5h-2.25v2zm-2.25 4h2.25v2h-2.25z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-gateway-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M15.45 7.125h-2.577V3.507l-.41-.407H3.925l-.41.41v3.08h.922V4.022h7.513v7.556H4.438v-1.553h-.923v2.065l.41.41h8.538l.41-.41V8.047H16z"/><path fill="currentColor" d="M8.453 7.237H0l.518.87H8.97zM9.21 8.51H.755l.518.867h8.452z"/>'
    },
    {
      id: "cf-cloudflare-gateway-solid",
      viewBox: "0 0 16 16",
      content: '<g clip-path="url(#a)"><path fill="currentColor" fill-rule="evenodd" d="M15.45 7.125h-2.577V3.508l-.41-.408H3.925l-.41.41v3.728H0l.518.87h2.997v.402H.755l.517.868h2.243v2.712l.41.41h8.538l.41-.41V8.048H16zM3.515 9.378h6.21L9.21 8.51H3.515zm0-1.27H8.97l-.518-.87H3.516z" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-cloudflare-kv-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M5.5 11.238H3.75v-1H5.5zM3.75 9.237H5.5v-1H3.75zm1.75-2H3.75v-1H5.5zm1 4.001h5.75v-1H6.5zm5.75-2.001H6.5v-1h5.75zm-5.75-2h5.75v-1H6.5z"/><path fill="currentColor" fill-rule="evenodd" d="m1.5 3 .5-.5h4.75l.419.227.852 1.306H14l.5.5V13l-.5.5H2l-.5-.5zm1 .5v9h11V5.033H7.75l-.419-.227L6.48 3.5z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-magic-firewall-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m13.591 3.476 1.417.767-.394.691-1.375-.84.038 1.608h-.797l.038-1.608-1.374.84-.394-.691 1.416-.767-1.416-.767.394-.692 1.374.84-.038-1.607h.797l-.037 1.608 1.374-.841.393.691-.108.06z"/><path fill="currentColor" fill-rule="evenodd" d="m2 2.5-.5.5v10.5l.5.5h12l.5-.5V10l-.5-.5h-2.25v-3l-.5-.5H8.5V3L8 2.5zm6.5 8h5V13h-5zm-1 0V13h-5v-2.5zm-1.75-1V7h5v2.5zm-1 0V7H2.5v2.5zM7.5 6h-5V3.5h5z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-magic-transit-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m10.695 9.061-1.83-.99 1.69-.915.14-.077-.509-.893-1.775 1.086.048-2.076H7.43l.05 2.076-1.776-1.086-.508.894 1.83.99-1.83.992.508.893L7.48 8.869l-.05 2.077h1.03l-.048-2.077 1.775 1.086z"/><path fill="currentColor" fill-rule="evenodd" d="M8.317 1.11h-.745l-.287.321a6.9 6.9 0 0 1-3.852 1.91l-.343.05-.428.496v3.535c0 2.463 1.19 4.291 2.375 5.498 1.181 1.204 2.386 1.822 2.506 1.882l.178.089h.447l.179-.09c.12-.059 1.325-.677 2.507-1.881 1.184-1.207 2.375-3.035 2.375-5.498V3.888l-.428-.495-.343-.05A6.9 6.9 0 0 1 8.605 1.43zM3.662 4.318a7.9 7.9 0 0 0 4.283-2.134A7.9 7.9 0 0 0 12.23 4.32v3.103c0 2.115-1.018 3.706-2.09 4.797a9.4 9.4 0 0 1-2.194 1.665 9.4 9.4 0 0 1-2.194-1.665c-1.072-1.091-2.09-2.682-2.09-4.797z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-magic-wan-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14.5 7.5h-3.977l3.667-1.525-.383-.925-3.682 1.52 2.818-2.82-.708-.707L9.43 5.85l1.525-3.662-.925-.386-1.53 3.68V1.5h-1v3.965L6 1.798l-.925.382 1.52 3.682-2.83-2.817-.707.705 2.805 2.808L2.2 5.035l-.385.922L5.5 7.5h-4v1h3.978L1.81 10l.382.925 3.683-1.52-2.817 2.818.707.707 2.805-2.805-1.525 3.662.925.385L7.5 10.5v3.977h1V10.5l1.5 3.668.925-.38-1.508-3.675 2.818 2.817.708-.707-2.806-2.806 3.663 1.526.385-.925L10.5 8.5h4zm-4 0v1l-.38.92-.702.703-.918.362h-1l-.918-.38-.702-.703-.38-.92V7.5l.38-.92.702-.702L7.5 5.5h1l.918.38.702.702z"/>'
    },
    {
      id: "cf-cloudflare-pages-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m7.125 2.5-.65 1H3v9h2.9l-.175 1H2.5L2 13V3l.5-.5zm3.15 0H13.5l.5.5v10l-.5.5H8.875l.65-1H13v-9h-2.9z"/><path fill="currentColor" d="M7.15 9.5h-2.9l-.425-.775 5.2-8 .9.375L8.85 6.5h2.9l.425.775-5.2 8-.9-.375zM3.725 4.575a.35.35 0 1 0 0-.7.35.35 0 0 0 0 .7m.925 0a.35.35 0 1 0 0-.7.35.35 0 0 0 0 .7m.925 0a.35.35 0 1 0 0-.7.35.35 0 0 0 0 .7"/>'
    },
    {
      id: "cf-cloudflare-pages-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m9.253.502.922.36L8.878 6.5h2.372l.437.742-.003.006-4.438 7.75-.921-.36L7.622 9H5.25l-.007-.012-.43-.73z"/><path fill="currentColor" fill-rule="evenodd" d="M7.245 2.5H2.5L2 3v10l.5.5h3.32l.876-3.75H4.82l-.876-1.487zM3.35 4.575a.35.35 0 1 0 0-.7.35.35 0 0 0 0 .7m1.275-.35a.35.35 0 1 1-.7 0 .35.35 0 0 1 .7 0m.575.35a.35.35 0 1 0 0-.7.35.35 0 0 0 0 .7" clip-rule="evenodd"/><path fill="currentColor" d="M8.968 13.5H13.5l.5-.5V3l-.5-.5h-2.938l-.758 3.25h1.874l.876 1.487z"/>'
    },
    {
      id: "cf-cloudflare-pipelines-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.303 4.466c-.232.608-.407 1.393-.494 2.284H1.805c.09-1.004.286-1.912.564-2.64.193-.509.436-.954.731-1.282.295-.327.683-.578 1.15-.578h6.25c.467 0 .855.25 1.15.578s.538.773.732 1.282c.277.728.473 1.636.563 2.64h-1.004c-.087-.89-.262-1.676-.494-2.284-.168-.442-.356-.765-.54-.969s-.322-.247-.407-.247H5.714c.159.254.297.545.417.86.39 1.02.619 2.395.619 3.89s-.23 2.87-.619 3.89c-.12.315-.258.606-.417.86H10.5c.085 0 .223-.043.407-.247s.372-.527.54-.969c.232-.608.407-1.393.494-2.284h1.004c-.09 1.004-.286 1.912-.563 2.64-.194.509-.437.954-.732 1.282-.295.327-.683.578-1.15.578H4.25c-.467 0-.855-.25-1.15-.578s-.538-.773-.731-1.282c-.278-.728-.474-1.636-.564-2.64h1.004c.087.89.262 1.676.494 2.284.168.442.357.765.54.969s.322.247.407.247.223-.043.407-.247.372-.527.54-.969c.335-.88.553-2.13.553-3.534 0-1.405-.218-2.654-.553-3.534-.168-.442-.357-.765-.54-.969s-.322-.247-.407-.247-.223.043-.407.247-.372.527-.54.969M0 8.063a.563.563 0 1 0 1.125 0 .563.563 0 0 0-1.125 0"/><path fill="currentColor" d="M1.75 8.063a.563.563 0 1 0 1.125 0 .563.563 0 0 0-1.125 0m1.75 0a.563.563 0 1 0 1.125 0 .563.563 0 0 0-1.125 0M15 8.5H8v-1h7z"/><path fill="currentColor" d="m14.845 8-1.217-1.217.566-.566L15.976 8l-1.783 1.783-.565-.566z"/>'
    },
    {
      id: "cf-cloudflare-pubsub-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M13.55 5.126a6.25 6.25 0 0 1-.034 5.812q.18.333.313.644c.193.45.317.873.34 1.245.025.37-.048.763-.334 1.05-.382.381-.944.385-1.44.277-.445-.096-.958-.305-1.517-.606a6.25 6.25 0 0 1-5.756 0c-.559.3-1.073.51-1.517.607-.39.084-.788.095-1.125-.06-.375-.173-.58-.505-.637-.892-.053-.36.02-.767.16-1.18.11-.334.273-.698.48-1.085A6.26 6.26 0 0 1 1.87 6.78a6.3 6.3 0 0 1 .58-1.655c-.304-.564-.516-1.082-.613-1.53-.084-.389-.096-.787.06-1.125.172-.374.504-.58.892-.637.36-.052.767.021 1.18.16q.507.17 1.097.488a6.25 6.25 0 0 1 5.868 0 8 8 0 0 1 .656-.32c.45-.193.873-.316 1.246-.34.37-.024.763.048 1.049.334.382.382.385.945.278 1.44-.097.449-.309.966-.613 1.53m-1.185-.043a5.25 5.25 0 0 1-1.49 7.31 18 18 0 0 1-2.11-1.526A29 29 0 0 0 10 9.684v.816h1V7.75H8.25v1h1.264A29 29 0 0 1 8 10.21a28 28 0 0 1-1.14-1.08c-1.072-1.072-2.03-2.2-2.755-3.239a15 15 0 0 1-.5-.764A5.25 5.25 0 0 1 9.9 3.106a20 20 0 0 0-1.437 1.056q-.482.386-.963.812V4h-1v2.75h2.75v-1H8.132q.478-.425.956-.807a18 18 0 0 1 1.836-1.303c.568.38 1.058.87 1.441 1.443m-.463-1.965c.377.301.72.646 1.018 1.028q.198-.442.266-.76c.087-.406 0-.515-.008-.523-.004-.004-.06-.057-.278-.043-.215.013-.519.091-.915.261zm-7.804 0a5 5 0 0 0-.446-.176c-.347-.116-.582-.138-.72-.118a.24.24 0 0 0-.101.032.1.1 0 0 0-.026.033c-.025.054-.055.2.01.496q.07.326.265.761a6.3 6.3 0 0 1 1.018-1.028M3.08 6.165a5.25 5.25 0 0 0 2.045 6.228q.368-.223.774-.506c.433-.302.882-.645 1.336-1.02a29 29 0 0 1-1.083-1.029C5.047 8.732 4.048 7.56 3.285 6.464q-.105-.15-.204-.299m3.082 6.753a5.25 5.25 0 0 0 3.674 0A21 21 0 0 1 8 11.532a22 22 0 0 1-1.837 1.386m-2.02 0a6.3 6.3 0 0 1-1.022-1.012q-.104.233-.17.433c-.117.348-.139.582-.119.72.01.063.026.092.033.102a.1.1 0 0 0 .033.025c.054.025.2.055.495-.009q.322-.07.75-.26m7.715 0q.435.192.748.26c.405.087.514 0 .522-.009.004-.004.058-.06.044-.277-.014-.215-.092-.52-.262-.915l-.03-.071a6.2 6.2 0 0 1-1.022 1.011" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-radar-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M11.6 5.325a.9.9 0 1 0-1.8 0 .9.9 0 0 0 1.8 0"/><path fill="currentColor" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.525 6.525 0 0 0 8 1.5m-.5 11.975A5.5 5.5 0 0 1 2.525 8.5h1.25A4.25 4.25 0 0 0 7.5 12.225zm0-2.275a3.175 3.175 0 0 1-2.7-2.7h2.7zm0-3.7H4.8a3.175 3.175 0 0 1 2.7-2.7zm0-3.725A4.25 4.25 0 0 0 3.775 7.5h-1.25A5.5 5.5 0 0 1 7.5 2.525zm1 1.025q.334.039.65.15l.525-.85c-.375-.16-.77-.27-1.175-.325v-1.25A5.5 5.5 0 0 1 13.475 7.5h-1.25a4.2 4.2 0 0 0-.3-1.125l-.875.525q.115.29.15.6H8.5zm0 3.7h2.7a3.175 3.175 0 0 1-2.7 2.7zm0 4.975v-1.25A4.25 4.25 0 0 0 12.225 8.5h1.25A5.5 5.5 0 0 1 8.5 13.475"/>'
    },
    {
      id: "cf-cloudflare-radar-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14.481 8.5a6.5 6.5 0 0 1-5.98 5.98v-2.008A4.5 4.5 0 0 0 12.472 8.5z"/><path fill="currentColor" d="M11.465 8.5A3.5 3.5 0 0 1 8.5 11.464V8.5zM7.5 11.464V8.5H4.536A3.5 3.5 0 0 0 7.5 11.464"/><path fill="currentColor" fill-rule="evenodd" d="M11.465 7.5H8.5V4.535q.42.061.8.214l.537-.858A4.5 4.5 0 0 0 8.5 3.527V1.52a6.5 6.5 0 0 1 5.981 5.98h-2.008a4.5 4.5 0 0 0-.359-1.326l-.865.523q.155.383.216.804m.25-2.32a.89.89 0 1 1-1.78 0 .89.89 0 0 1 1.78 0" clip-rule="evenodd"/><path fill="currentColor" d="M7.5 7.5V4.535A3.5 3.5 0 0 0 4.536 7.5z"/><path fill="currentColor" d="M7.5 1.519v2.008A4.5 4.5 0 0 0 3.528 7.5H1.519A6.5 6.5 0 0 1 7.5 1.519m0 12.961v-2.008A4.5 4.5 0 0 1 3.528 8.5H1.519A6.5 6.5 0 0 0 7.5 14.48"/>'
    },
    {
      id: "cf-cloudflare-registrar-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.21 1.503q-.063-.004-.125-.003h-.082a6.5 6.5 0 1 0 0 13h.082q.063 0 .126-.004A6.5 6.5 0 0 0 8.21 1.503m4.775 4.165H11.7a7.6 7.6 0 0 0-.975-2.446 5.54 5.54 0 0 1 2.258 2.446M8.5 2.562c.93.275 1.759 1.456 2.175 3.106H8.5zm-1 .06v3.046H5.496C5.886 4.12 6.64 2.983 7.5 2.622m-1.966.464a7.5 7.5 0 0 0-1.066 2.582H3.022a5.54 5.54 0 0 1 2.512-2.582m-2.556 7.15h1.47a7.6 7.6 0 0 0 1.08 2.676 5.53 5.53 0 0 1-2.55-2.675M7.5 13.38c-.88-.367-1.646-1.54-2.028-3.142H7.5zm1 .06v-3.202h2.197C10.291 11.94 9.45 13.16 8.5 13.439m2.231-.665c.479-.78.814-1.64.991-2.537h1.305a5.53 5.53 0 0 1-2.296 2.538M2.643 9.237a5.5 5.5 0 0 1 .023-2.569H13.34c.21.843.217 1.723.023 2.569z"/><path fill="currentColor" d="M6.236 8.166h-.01l-.183-.781H5.66l-.177.786h-.01l-.166-.786h-.392l.32 1.227h.418l.192-.715h.013l.192.715h.418l.32-1.227h-.392zm1.94 0h-.01l-.182-.781H7.6l-.177.786h-.01l-.166-.786h-.392l.32 1.227h.418l.192-.715h.013l.192.715h.418l.32-1.227h-.392zm1.941 0h-.01l-.182-.781h-.383l-.178.786h-.01l-.165-.786h-.393l.32 1.227h.419l.191-.715h.014l.192.715h.418l.32-1.227h-.392zm.763.056a.2.2 0 0 0-.146.06.2.2 0 0 0-.06.146.2.2 0 0 0 .06.146.2.2 0 0 0 .147.061q.055 0 .102-.028a.2.2 0 0 0 .075-.075.2.2 0 0 0 .014-.184.2.2 0 0 0-.048-.066.2.2 0 0 0-.143-.06"/>'
    },
    {
      id: "cf-cloudflare-registrar-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M9.5 14.402a6.51 6.51 0 0 0 4.502-3.826H11.95a8 8 0 0 1-.874 2.177c-.42.699-.954 1.281-1.578 1.65"/><path fill="currentColor" fill-rule="evenodd" d="M14.326 9.577a6.5 6.5 0 0 0 0-3.001h-2.089V6.57H3.744v.005h-2.07a6.5 6.5 0 0 0 0 3h2.177l-.001-.008h1.01l.001.009h2.637v-.009h.999v.009h2.636l.001-.009h1.01l-.001.009zM8.174 8.24h-.01l-.183-.78H7.6l-.178.786h-.01l-.166-.786h-.392l.32 1.227h.418l.192-.715h.014l.191.715h.418l.32-1.227h-.392zm-1.941 0h-.01l-.183-.78h-.382l-.178.786h-.01l-.166-.786h-.392l.32 1.227h.418l.192-.715h.014l.191.715h.418l.32-1.227h-.392zm3.87 0h.011l.16-.78h.393l-.32 1.227h-.418l-.192-.715h-.014l-.191.715h-.419l-.32-1.227h.393l.165.786h.01l.178-.786h.383zm.775.057a.2.2 0 0 0-.148.06.2.2 0 0 0-.06.145.2.2 0 0 0 .06.147.2.2 0 0 0 .148.061q.055 0 .102-.028a.2.2 0 0 0 .075-.075.2.2 0 0 0 .013-.184.2.2 0 0 0-.047-.066.2.2 0 0 0-.143-.06" clip-rule="evenodd"/><path fill="currentColor" d="M14.002 5.577a6.51 6.51 0 0 0-4.504-3.828c.624.368 1.16.951 1.58 1.65.374.626.672 1.364.873 2.178zm-7.51-3.825a6.51 6.51 0 0 0-4.494 3.825h2.045A8 8 0 0 1 4.917 3.4c.419-.698.953-1.28 1.575-1.648m-4.494 8.824h2.045c.202.813.5 1.552.874 2.177.418.697.952 1.279 1.574 1.647a6.51 6.51 0 0 1-4.493-3.824m3.776 1.663a6.8 6.8 0 0 1-.697-1.663h2.42v3.18c-.621-.178-1.225-.688-1.723-1.517m2.723 1.516v-3.18h2.42a6.8 6.8 0 0 1-.697 1.664c-.497.83-1.102 1.338-1.723 1.516m2.421-8.178a6.8 6.8 0 0 0-.698-1.663c-.497-.83-1.102-1.34-1.723-1.517v3.18zm-3.42 0v-3.18c-.622.178-1.226.687-1.724 1.517a6.8 6.8 0 0 0-.697 1.663z"/>'
    },
    {
      id: "cf-cloudflare-ruleset-engine-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M1.5 2.5 2 2h7.5v1h-7v10h8v1H2l-.5-.5z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M8 5.25H3.5v-1H8zm.5 2h-5v-1h5zm-1.5 2H3.5v-1H7z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M9.873 2.756a2.738 2.738 0 0 0 .513 4.896l.33.47V13.5h1.213l.002-5.378.329-.47a2.739 2.739 0 0 0 .513-4.896l-.002 2.133-.5.5h-1.897l-.5-.5zm-1.527.063a3.74 3.74 0 0 1 1.88-1.314l.647.478.001 2.405h.898V1.983l.648-.478a3.739 3.739 0 0 1 .51 6.949V14l-.5.5h-2.213l-.5-.5-.002-5.546a3.738 3.738 0 0 1-1.37-5.635" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-security-application-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M7.628 1.11h.745l.288.32a6.9 6.9 0 0 0 3.853 1.912l.343.05.427.495v3.535c0 2.462-1.19 4.29-2.375 5.498-1.181 1.204-2.387 1.822-2.506 1.882l-.18.089h-.446l-.178-.09a8 8 0 0 1-.788-.467 4.4 4.4 0 0 0 1.18-.456l.01.006a9.4 9.4 0 0 0 2.195-1.665c1.07-1.091 2.088-2.682 2.088-4.797V4.319a7.9 7.9 0 0 1-4.283-2.135 7.9 7.9 0 0 1-4.283 2.134v1.713a4.5 4.5 0 0 0-1 .722V3.886l.427-.494.343-.05A6.9 6.9 0 0 0 7.341 1.43zm-5.357 9.593.881-.174c.071.357.211.688.406.98l-.746.499c.264.395.604.734.999.999l.5-.746c.291.195.622.335.979.406l-.175.88a3.6 3.6 0 0 0 1.413 0l-.174-.88c.356-.071.688-.211.98-.406l.499.746a3.6 3.6 0 0 0 .998-1l-.746-.499c.195-.291.336-.622.406-.979l.881.174a3.6 3.6 0 0 0 0-1.412l-.88.174a2.7 2.7 0 0 0-.407-.98l.746-.499a3.6 3.6 0 0 0-.998-.999l-.5.747a2.7 2.7 0 0 0-.98-.406l.175-.881a3.6 3.6 0 0 0-1.413 0l.175.88a2.7 2.7 0 0 0-.98.407l-.5-.747a3.6 3.6 0 0 0-.998 1l.746.499a2.7 2.7 0 0 0-.406.979l-.88-.174a3.6 3.6 0 0 0 0 1.412m3.55 1.002a1.708 1.708 0 1 1 0-3.416 1.708 1.708 0 0 1 0 3.416" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-security-center-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.203 12.205a4.162 4.162 0 1 0 0-8.325 4.162 4.162 0 0 0 0 8.325m0-5.207a1.045 1.045 0 1 1-1.045 1.045A1.047 1.047 0 0 1 8.203 7zM7.063 9.75q.246.164.53.25v1.152a3.15 3.15 0 0 1-1.328-.607zm1.53.307c.203-.039.4-.109.582-.207l.81.81a3.1 3.1 0 0 1-1.392.527zm1.317-.884q.17-.271.25-.58h1.143a3.14 3.14 0 0 1-.606 1.377zm.283-1.58A2 2 0 0 0 9.958 7l.807-.805c.296.41.49.887.563 1.388zm-.943-1.3a2 2 0 0 0-.55-.23v-1.14c.492.081.958.279 1.358.577zm-1.55-.23a2 2 0 0 0-.522.212l-.808-.807c.395-.282.85-.469 1.33-.545zm-1.237.91a2 2 0 0 0-.225.5H5.095A3.15 3.15 0 0 1 5.66 6.17zm-.25 1.5q.051.276.182.527l-.815.815a3.15 3.15 0 0 1-.5-1.337z"/><path fill="currentColor" d="M14 1.468H2.033L1.513 2v2.275h-.368v2.5h.368v2.5h-.368v2.5h.368v2.147l.52.553H14l.52-.52V2zm-.52 11.967H2.553V2.5H13.48z"/>'
    },
    {
      id: "cf-cloudflare-security-center-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.783 7.174a1.05 1.05 0 0 0-.58-.176V7a1.047 1.047 0 0 0-1.045 1.043 1.045 1.045 0 1 0 1.625-.87M7.593 10a2 2 0 0 1-.53-.25l-.798.795c.389.304.844.512 1.328.607zm1.582-.15a2 2 0 0 1-.582.207v1.13c.5-.06.978-.24 1.392-.527zm.985-1.257q-.08.309-.25.58l.787.797c.31-.403.519-.876.606-1.377zM9.958 7a2 2 0 0 1 .235.593l1.135-.01a3.15 3.15 0 0 0-.563-1.388zM8.7 6.063q.293.073.55.23l.807-.793A3.1 3.1 0 0 0 8.7 4.923zm-1.522.212a2 2 0 0 1 .522-.212v-1.14c-.48.076-.935.263-1.33.545zm-.94 1.198q.076-.266.225-.5L5.66 6.17c-.285.385-.478.83-.565 1.303zM6.395 9a1.9 1.9 0 0 1-.182-.527l-1.133.005c.062.478.233.935.5 1.337z"/><path fill="currentColor" fill-rule="evenodd" d="M2.033 1.468H14l.52.532v11.955l-.52.52H2.033l-.52-.553v-2.147h-.368v-2.5h.368v-2.5h-.368v-2.5h.368V2zm8.482 10.036A4.162 4.162 0 1 1 5.89 4.582a4.162 4.162 0 0 1 4.625 6.922" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-security-network-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M8.373 1.11h-.745l-.287.321a6.9 6.9 0 0 1-3.853 1.91l-.343.05-.427.495v3.536c0 2.462 1.19 4.29 2.375 5.498a10.3 10.3 0 0 0 2.506 1.882l.178.088h.447l.179-.088c.12-.06 1.324-.678 2.506-1.882 1.185-1.207 2.375-3.036 2.375-5.498V3.887l-.427-.494-.343-.05A6.9 6.9 0 0 1 8.66 1.43zM3.718 4.317A7.9 7.9 0 0 0 8 2.184a7.9 7.9 0 0 0 4.283 2.135v3.103c0 2.115-1.017 3.706-2.089 4.797A9.4 9.4 0 0 1 8 13.884a9.4 9.4 0 0 1-2.195-1.665c-1.07-1.091-2.088-2.682-2.088-4.797zm6.797 4.058a2.6 2.6 0 0 1-1.47 1.884c.226-.499.38-1.153.428-1.884zm.029-.75a2.6 2.6 0 0 0-1.5-2.084c.247.544.409 1.273.439 2.084zm-1.812 0c-.03-.724-.175-1.345-.373-1.778-.195-.428-.356-.518-.395-.536-.038.018-.2.108-.395.536-.197.433-.343 1.054-.373 1.778zm-1.524.75c.046.638.183 1.186.361 1.578.196.429.357.518.395.536.039-.018.2-.107.395-.536.18-.392.316-.94.362-1.578zm-.752 0c.047.73.202 1.385.428 1.884a2.6 2.6 0 0 1-1.47-1.884zm-.01-.75c.03-.811.192-1.54.438-2.084a2.6 2.6 0 0 0-1.499 2.084zm4.862.275a3.344 3.344 0 1 1-6.687 0 3.344 3.344 0 0 1 6.687 0" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-spectrum-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.223 14.948h-.445l-.18-.09c-.198-.1-4.88-2.5-4.88-7.38V3.941l.43-.5L3.5 3.4a6.98 6.98 0 0 0 3.833-1.9l.295-.33h.75l.292.33a6.96 6.96 0 0 0 3.842 1.9l.34.047.43.5v3.53c0 4.886-4.682 7.273-4.88 7.38zm-4.5-10.573v3.102c0 4.085 3.795 6.208 4.282 6.463.5-.25 4.282-2.377 4.282-6.463V4.375A8 8 0 0 1 8 2.25a8 8 0 0 1-4.282 2.125z"/><path fill="currentColor" d="M8.5 4.755h-1V6.96h1z"/><path fill="currentColor" d="M9.94 5.352 8.38 6.91l.708.707 1.559-1.56z"/><path fill="currentColor" d="M11.245 7.5H9.04v1h2.205z"/><path fill="currentColor" d="m9.09 8.38-.707.706 1.56 1.56.706-.707z"/><path fill="currentColor" d="M8.5 9.04h-1v2.205h1z"/><path fill="currentColor" d="m6.912 8.382-1.559 1.56.707.706L7.62 9.09z"/><path fill="currentColor" d="M6.96 7.5H4.755v1H6.96z"/><path fill="currentColor" d="m6.058 5.352-.707.707 1.559 1.56.707-.708z"/>'
    },
    {
      id: "cf-cloudflare-spectrum-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M6.96 7.567v.863l.61.61h.86l.61-.61v-.86l-.61-.61h-.862z"/><path fill="currentColor" fill-rule="evenodd" d="M8.223 14.948h-.445l-.18-.09c-.198-.1-4.88-2.5-4.88-7.38V3.943l.43-.5L3.5 3.4a6.98 6.98 0 0 0 3.833-1.9l.295-.33h.75l.292.33a6.96 6.96 0 0 0 3.843 1.9l.34.048.43.5v3.53c0 4.78-4.485 7.17-4.862 7.37l-.018.01zM8.5 4.755h-1v2.04L6.058 5.351l-.707.707L6.79 7.5H4.756v1h2.04L5.354 9.941l.707.707L7.5 9.208v2.037h1V9.203l1.443 1.443.707-.707L9.21 8.5h2.034v-1H9.206l1.441-1.441-.707-.707-1.44 1.44z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-stream-delivery-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M14.968 7.544a2.93 2.93 0 0 0-2-.68 4.825 4.825 0 0 0-9.25-1.147 3.4 3.4 0 0 0-2.418.797A3.65 3.65 0 0 0 0 9.264a3.56 3.56 0 0 0 3.545 3.563h9.47a3 3 0 0 0 1.952-5.283m-1.953 4.283H3.547A2.56 2.56 0 0 1 1 9.272a2.65 2.65 0 0 1 .942-2A2.4 2.4 0 0 1 3.5 6.709q.24 0 .475.043l.435.077.127-.422A3.823 3.823 0 0 1 12 7.422l.025.58.565-.09a2.06 2.06 0 0 1 1.728.405A2.03 2.03 0 0 1 15 9.842a2 2 0 0 1-1.985 1.984"/><path fill-rule="evenodd" d="m6.43 6.223.755-.43 3.771 2.234.001.86-3.771 2.243-.756-.43zm1 .877v2.72l2.292-1.362z" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-cloudflare-stream-delivery-solid",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M7.43 9.821v-2.72l2.292 1.357z"/><path fill-rule="evenodd" d="M12.968 6.864a2.93 2.93 0 0 1 2 .68 3 3 0 0 1-1.953 5.283h-9.47A3.56 3.56 0 0 1 0 9.264a3.65 3.65 0 0 1 1.3-2.75 3.4 3.4 0 0 1 2.418-.797 4.825 4.825 0 0 1 9.25 1.147M7.185 5.793l-.755.43V10.7l.756.43 3.771-2.243v-.86z" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-cloudflare-tail-worker-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m6.22 12.305-3.198-4.3 3.181-4.177-.614-.843-3.584 4.713L2 8.3l3.601 4.848z"/><path fill="currentColor" d="M7.337 2h-1.23l4.439 6.1L6.21 14h1.238l4.333-5.898z"/><path fill="currentColor" d="M9.717 2H8.471l4.51 6.028L8.47 14h1.25L14 8.33v-.602zM7.4 6h1v3.5h-1zM6.2 7h1v2.5h-1zM5 8h1v1.5H5z"/>'
    },
    {
      id: "cf-cloudflare-teams-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M6.125 1.75a2.875 2.875 0 1 0 0 5.75 2.875 2.875 0 0 0 0-5.75M4.25 4.625a1.875 1.875 0 1 1 3.75 0 1.875 1.875 0 0 1-3.75 0M4.976 8a4.7 4.7 0 0 0-3.344 1.398A4.8 4.8 0 0 0 .61 10.945c-.131.32-.218.76-.273 1.164A9 9 0 0 0 .25 13.25l.5.5H15l.5-.5c0-.484-.094-1.073-.265-1.622-.17-.54-.433-1.104-.813-1.488a3.67 3.67 0 0 0-2.609-1.09h-1.61l-.134.002A4.7 4.7 0 0 0 7.109 8zm0 1a3.7 3.7 0 0 0-2.633 1.102c-.346.35-.621.765-.809 1.223-.081.198-.155.535-.207.92a9 9 0 0 0-.055.505h8.29v-1.006H4.268l-.517-.869h5.813v-.942A3.7 3.7 0 0 0 7.11 9zm5.462 2.744h2.282l-.516-.869h-1.767v-.826h1.376c.711 0 1.394.285 1.898.795.218.22.421.609.57 1.083.086.276.147.56.182.823h-4.025zM9.75 6.375a2.125 2.125 0 1 1 4.25 0 2.125 2.125 0 0 1-4.25 0m2.125-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-trace-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m3.75 2.005.5-.5h7.5l.5.5v2.75l-.5.5H8.5v2.111h2.402a2.25 2.25 0 0 1 2.25 2.25v1.25a1.849 1.849 0 1 1-1 0v-1.25c0-.69-.56-1.25-1.25-1.25H8.5v2.5a1.85 1.85 0 1 1-1 0v-2.5H5.098c-.69 0-1.25.56-1.25 1.25v1.25a1.85 1.85 0 1 1-1 0v-1.25a2.25 2.25 0 0 1 2.25-2.25H7.5V5.255H4.25l-.5-.5zm1 .5v1.75h6.5v-1.75zm-1.402 9.294a.848.848 0 1 0 0 1.696.848.848 0 0 0 0-1.696m4.652 0a.848.848 0 1 0 0 1.696.848.848 0 0 0 0-1.696m4.652 0a.848.848 0 1 0 0 1.696.848.848 0 0 0 0-1.696" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-unbound-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7.304 1.916H6.065l4.464 6.1-4.357 5.9h1.243l4.355-5.897z"/><path fill="currentColor" d="M6.24 12.294 3.025 7.992l3.196-4.178-.615-.841-3.605 4.711L2 8.287l3.62 4.847zM8.444 1.916h1.251l4.306 5.727-.002.603-4.301 5.67H8.442l4.533-5.974z"/><path fill="currentColor" d="M6.763 5.264 4.79 7.284l.573.558.899-.92v2.323h1V6.921l.899.921.572-.559zm-.5 4.743v1h1v-1z"/>'
    },
    {
      id: "cf-cloudflare-waiting-room-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m3 2 .5-.5h9l.5.5v3.5h1l.5.5v5.75l-.5.5h-2v2.25h-1v-2.25H5v2.25H4v-2.25H2l-.5-.5V6l.5-.5h1zm9 .5v3h-.5L11 6v2.75H5V6l-.5-.5H4v-3zm-9.5 8.75V6.5H4v2.75l.5.5h7l.5-.5V6.5h1.5v4.75z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-warp-mobile-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M12.064 0h-8.06L3.5.483v14.785l.504.482h8.06l.504-.482V.482zm-.503 14.546H4.508V1.204h2.519v.469h2.015v-.47h2.519z"/><path fill-rule="evenodd" d="M8.125 10.098a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75m0 1a2.375 2.375 0 1 0 0-4.75 2.375 2.375 0 0 0 0 4.75" clip-rule="evenodd"/><path fill-rule="evenodd" d="M8.125 9.925a.55.55 0 1 0 0-1.1.55.55 0 0 0 0 1.1m0 .825a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75" clip-rule="evenodd"/><path fill-rule="evenodd" d="M8.102 9.977a2.102 2.102 0 1 0 0-4.204 2.102 2.102 0 0 0 0 4.204m0 1a3.102 3.102 0 1 0 0-6.204 3.102 3.102 0 0 0 0 6.204" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-cloudflare-warp-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.525 6.525 0 0 0 8 1.5m0 1A5.525 5.525 0 0 1 13.5 8a5.6 5.6 0 0 1-.725 2.725c.1-.375.151-.762.15-1.15a4.925 4.925 0 0 0-9.85 0 4.4 4.4 0 0 0 .15 1.15A5.6 5.6 0 0 1 2.5 8 5.525 5.525 0 0 1 8 2.5M6.25 12.7a2.325 2.325 0 1 1 3.5 0 1.75 1.75 0 0 0-3.5 0M8 7.825a3.325 3.325 0 0 0-3.325 3.35q-.012.265.05.525a3.83 3.83 0 0 1-.65-2.125 3.925 3.925 0 0 1 7.85 0 3.83 3.83 0 0 1-.65 2.125q.062-.259.05-.525A3.326 3.326 0 0 0 8 7.825m-.75 4.925a.75.75 0 1 1 .75.75.724.724 0 0 1-.75-.75"/>'
    },
    {
      id: "cf-cloudflare-warp-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M1.5 8a6.5 6.5 0 1 1 11.122 4.57 5.375 5.375 0 1 0-8.487.656A6.49 6.49 0 0 1 1.5 8"/><path fill="currentColor" d="M3.75 9.625a4.375 4.375 0 1 1 7.86 2.646 3.75 3.75 0 1 0-7.331-.561 4.36 4.36 0 0 1-.529-2.085"/><path fill="currentColor" d="M8.044 14a1.25 1.25 0 1 0-.088-2.5 1.25 1.25 0 0 0 .088 2.5"/><path fill="currentColor" d="m5.752 12.834-.002-.084a2.25 2.25 0 1 1 4.499.084 2.75 2.75 0 1 0-4.497 0"/>'
    },
    {
      id: "cf-cloudflare-web-analytics-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M5 8.5V7H4v1.5zm1.75 0h-1v-3h1zm1.75 0V4h-1v4.5z"/><path fill="currentColor" fill-rule="evenodd" d="M3.722 2.343A5 5 0 0 1 6.5 1.5a5.005 5.005 0 0 1 5 5 5 5 0 0 1-1.129 3.164l4.108 4.108-.707.707-4.108-4.108a4.999 4.999 0 1 1-5.942-8.028M6.5 2.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-web3-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.563 10.634a.712.712 0 1 0 1.232.711.712.712 0 0 0-1.232-.711M8 1.5a.712.712 0 1 0 0 1.423A.712.712 0 0 0 8 1.5M6.894 3.321l-.5-.866-3.81 2.2-.25.432v4.389h1V5.954l.87.501.5-.866-.87-.502zM3.941 9.852l.5.866 3.073-1.774v2.124h1V8.944l3.045 1.758.5-.866-3.045-1.758 1.84-1.062-.5-.866-1.84 1.062V3.654h-1v3.558L5.674 6.15l-.5.866 1.84 1.062zm.478 1.553-.5.866 3.845 2.22h.5l3.817-2.203-.5-.867-3.067 1.771V12.19h-1v1.003zm9.274-6.318V9.47h-1V5.953l-.868.502-.5-.866.868-.502-3.08-1.778.5-.866 3.83 2.211zM3.436 10.672a.712.712 0 1 0-1.233.712.712.712 0 0 0 1.233-.712"/>'
    },
    {
      id: "cf-cloudflare-webassembly-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M5.495 12.077h-.787L3.616 8.258h.882l.632 2.653h.031l.698-2.653h.755l.695 2.659h.034l.632-2.659h.881l-1.092 3.819h-.787L6.25 9.58h-.03z"/><path fill="currentColor" fill-rule="evenodd" d="m9.84 11.206-.283.87h-.865l1.318-3.818h1.04l1.316 3.819h-.864l-.284-.871zm.675-2.075-.47 1.445h.97l-.47-1.445z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="m2.5 2.077-.5.5v11l.5.5h11l.5-.5v-11l-.5-.5h-4l-.5.5a1 1 0 0 1-2 0l-.5-.5zm.5 11v-10h3.063a2 2 0 0 0 3.874 0H13v10z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudflare-workers-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m6.21 12.293-3.215-4.3 3.198-4.178-.618-.843-3.602 4.713-.005.602 3.62 4.848z"/><path fill="currentColor" d="M7.333 1.987H6.095l4.462 6.1-4.357 5.9h1.245L11.8 8.09z"/><path fill="currentColor" d="M9.725 1.987H8.473l4.532 6.028-4.532 5.973h1.255l4.302-5.67v-.603z"/>'
    },
    {
      id: "cf-cloudflare-workers-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7.333 1.988H6.094l4.464 6.018-4.357 5.982h1.244l4.355-5.98z"/><path fill="currentColor" d="m6.203 12.286.006.008-.62.84-.013-.016-.012.016-.62-.84-.053-.094-2.923-3.913.004-.603 3.604-4.711L9.429 8z"/><path fill="currentColor" d="M8.473 1.988h1.252l4.305 5.727-.001.603-4.302 5.67H8.472l4.532-5.974z"/>'
    },
    {
      id: "cf-cloudflare-zaraz-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M1 3.5h5.5v-1H1zm0 2h5.5v-1H1zm9 4H6.5v-1H10zm-3.5-2H10v-1H6.5zm8.5 6H6.5v-1H15zm-8.5-2H15v-1H6.5z"/>'
    },
    {
      id: "cf-cloudflare-zero-trust-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m7.573 10.138.707.707 2.623-2.623-2.623-2.62-.707.708 1.415 1.412H1.503v1h7.485z"/><path fill="currentColor" d="m12.858 3.445-.343-.048A6.98 6.98 0 0 1 8.672 1.5l-.297-.335h-.75l-.29.335A6.96 6.96 0 0 1 3.5 3.397l-.342.048-.43.5V6.75h1V4.375A8.03 8.03 0 0 0 8 2.25a8.04 8.04 0 0 0 4.288 2.125v3.1c0 4.09-3.788 6.208-4.288 6.463-.383-.188-2.855-1.58-3.857-4.188h-1.06c1.102 3.358 4.355 5.023 4.52 5.105l.177.09h.447l.178-.09c.2-.098 4.883-2.5 4.883-7.38V3.94z"/>'
    },
    {
      id: "cf-cloudflare-zero-trust-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m3.492 3.396-.342.05-.43.495v3.535c0 4.887 4.682 7.28 4.882 7.38l.178.09h.447l.178-.09c.2-.1 4.882-2.493 4.882-7.38V3.941l-.43-.495-.342-.05a6.96 6.96 0 0 1-3.84-1.9l-.12-.131-.178-.2H7.63l-.179.2-.119.132a6.96 6.96 0 0 1-3.84 1.9m5.55 4.354L7.647 6.354l.708-.708 2.621 2.622-2.621 2.621-.708-.707L9.08 8.75H1.5v-1z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-cloudy",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M5.596 4.499a4.87 4.87 0 0 1 3.243-.706 4.84 4.84 0 0 1 2.936 1.535 4.74 4.74 0 0 1 1.19 2.525c.855-.017 1.57.27 2.094.754.62.57.941 1.384.941 2.19l-.004.145a2.93 2.93 0 0 1-.873 1.945 3 3 0 0 1-2.108.863h-9.47a3.57 3.57 0 0 1-2.505-1.03A3.5 3.5 0 0 1 0 10.321v-.086C0 8.419 1.537 6.584 3.724 6.72a4.8 4.8 0 0 1 1.872-2.221M3.27 7.725C1.927 7.853 1 9.036 1 10.235c0 .664.266 1.302.743 1.774s1.126.74 1.804.741h9.468a2 2 0 0 0 1.406-.574A1.95 1.95 0 0 0 15 10.797l-.003-.103a1.98 1.98 0 0 0-.615-1.351 1.9 1.9 0 0 0-1.162-.483q.03.19.03.39a2.5 2.5 0 0 1-4.95.5h-.6a2.5 2.5 0 1 1-4.43-2.025m1.981.025a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m5.5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M8.706 4.784c-.9-.12-1.813.079-2.576.56a3.8 3.8 0 0 0-1.338 1.448q.224-.041.458-.042a2.5 2.5 0 0 1 2.45 2h.6a2.5 2.5 0 0 1 3.35-1.833 3.8 3.8 0 0 0-.615-.916 3.84 3.84 0 0 0-2.33-1.217M13.584.75a3.1 3.1 0 0 0 2.166 2.259v.232A3.1 3.1 0 0 0 13.584 5.5h-.168a3.1 3.1 0 0 0-2.166-2.259V3.01A3.1 3.1 0 0 0 13.416.75zM13.5 2.711a4 4 0 0 1-.413.414q.221.192.413.413.192-.22.413-.413a4 4 0 0 1-.413-.414" clip-rule="evenodd"/><path fill="currentColor" d="M3.252 3c.182.454.544.815.998.997v.255a1.8 1.8 0 0 0-.998.998h-.254A1.8 1.8 0 0 0 2 4.252v-.255c.454-.182.816-.543.998-.997z"/>'
    },
    {
      id: "cf-code-api-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.603 1.5H3.397l-.5.5v12l.5.5h9.205l.5-.5V2zm-.5 12H3.897v-11h8.205z"/><path fill="currentColor" d="M5.445 9.108v.612c-.007.227.028.453.103.667.06.16.164.3.3.406.144.101.308.17.482.202q.321.06.648.055v-.668a.94.94 0 0 1-.438-.08.42.42 0 0 1-.207-.25 1.3 1.3 0 0 1-.058-.412v-.78a.9.9 0 0 0-.062-.345.65.65 0 0 0-.23-.285 1.3 1.3 0 0 0-.483-.19h-.035v-.092H5.5c.172-.033.336-.1.483-.198a.65.65 0 0 0 .23-.285.9.9 0 0 0 .062-.348v-.792a1.3 1.3 0 0 1 .058-.413.42.42 0 0 1 .207-.25 1 1 0 0 1 .438-.077v-.66a3 3 0 0 0-.648.058c-.174.03-.338.098-.482.2a.93.93 0 0 0-.3.405 1.9 1.9 0 0 0-.103.662v.615a.75.75 0 0 1-.162.545.78.78 0 0 1-.573.17v.81a.78.78 0 0 1 .573.167.75.75 0 0 1 .162.55m4.708 1.686a.93.93 0 0 0 .3-.405c.074-.215.109-.441.102-.668v-.613a.75.75 0 0 1 .162-.544.78.78 0 0 1 .573-.168v-.81a.78.78 0 0 1-.572-.17.75.75 0 0 1-.163-.545v-.62a1.9 1.9 0 0 0-.102-.668.93.93 0 0 0-.3-.404 1.2 1.2 0 0 0-.483-.2 3 3 0 0 0-.647-.058v.67a1 1 0 0 1 .437.078.42.42 0 0 1 .208.25q.062.2.057.412v.79a.9.9 0 0 0 .063.348.65.65 0 0 0 .23.282c.143.094.304.158.472.19h.035v.093h-.035a1.3 1.3 0 0 0-.473.19.65.65 0 0 0-.23.284.9.9 0 0 0-.062.345v.798q.005.212-.057.412a.42.42 0 0 1-.208.25.94.94 0 0 1-.437.08v.658A3.4 3.4 0 0 0 9.67 11c.174-.034.339-.104.482-.207"/>'
    },
    {
      id: "cf-code-api-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M12.603 1.5H3.397l-.5.5v12l.5.5h9.205l.5-.5V2zM5.444 9.107v.613c-.007.227.028.453.103.667.06.16.164.3.3.406.144.1.308.17.482.202q.321.06.648.055v-.668a.94.94 0 0 1-.438-.08.42.42 0 0 1-.207-.25 1.3 1.3 0 0 1-.058-.412v-.78a.9.9 0 0 0-.062-.345.65.65 0 0 0-.23-.285 1.3 1.3 0 0 0-.483-.19h-.035v-.093H5.5c.172-.032.336-.1.483-.197a.65.65 0 0 0 .23-.285.9.9 0 0 0 .062-.348v-.792a1.3 1.3 0 0 1 .058-.413.42.42 0 0 1 .207-.25 1 1 0 0 1 .438-.077v-.66a3 3 0 0 0-.648.057c-.174.03-.338.099-.482.2a.93.93 0 0 0-.3.405 1.9 1.9 0 0 0-.103.663v.615a.75.75 0 0 1-.162.545.78.78 0 0 1-.573.17v.81a.78.78 0 0 1 .573.167.75.75 0 0 1 .162.55m5.008 1.28a.94.94 0 0 1-.3.406A1.2 1.2 0 0 1 9.67 11a3.4 3.4 0 0 1-.647.05v-.658c.15.01.3-.018.437-.08a.42.42 0 0 0 .208-.25 1.3 1.3 0 0 0 .057-.412v-.798a.9.9 0 0 1 .063-.344.65.65 0 0 1 .23-.285c.143-.094.304-.159.472-.19h.035V7.94h-.035a1.3 1.3 0 0 1-.473-.19.65.65 0 0 1-.23-.282.9.9 0 0 1-.062-.348v-.79a1.3 1.3 0 0 0-.057-.412.42.42 0 0 0-.208-.25 1 1 0 0 0-.437-.078v-.67q.327-.005.647.058c.174.03.338.098.482.2.136.104.24.244.3.404.075.215.11.441.103.668v.62a.75.75 0 0 0 .162.545.78.78 0 0 0 .573.17v.81a.78.78 0 0 0-.572.168.75.75 0 0 0-.163.544v.613c.007.227-.028.453-.102.667" clip-rule="evenodd"/>'
    },
    {
      id: "cf-code-brackets-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M5.562 14.5v-.995c-1.15 0-1.506-.539-1.506-1.727V9.747c0-.828-.252-1.442-1.387-1.67v-.153c1.135-.229 1.387-.843 1.387-1.67V4.221c0-1.188.357-1.727 1.506-1.727V1.5c-1.942 0-2.576.853-2.576 2.722v1.625c0 1.112-.381 1.544-1.486 1.544v1.218c1.105 0 1.486.432 1.486 1.544v1.625c0 1.869.634 2.722 2.576 2.722m4.876-13v.995c1.15 0 1.506.539 1.506 1.727v2.031c0 .828.252 1.442 1.387 1.67v.153c-1.134.229-1.387.843-1.387 1.67v2.032c0 1.188-.357 1.727-1.506 1.727v.995c1.942 0 2.576-.853 2.576-2.722v-1.625c0-1.112.381-1.544 1.486-1.544V7.391c-1.105 0-1.486-.432-1.486-1.544V4.222c0-1.869-.634-2.722-2.576-2.722"/>'
    },
    {
      id: "cf-code-branch-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M12.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5M11 3.25a1.75 1.75 0 1 1 2.25 1.678v.822a2.5 2.5 0 0 1-2.5 2.5h-5a1.5 1.5 0 0 0-1.5 1.5v1.322a1.75 1.75 0 1 1-1 0V4.929a1.75 1.75 0 1 1 1 0V7.75c.418-.314.937-.5 1.5-.5h5a1.5 1.5 0 0 0 1.5-1.5v-.822A1.75 1.75 0 0 1 11 3.25M3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5m0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5" clip-rule="evenodd"/>'
    },
    {
      id: "cf-code-branch-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M11 3.25a1.75 1.75 0 1 1 2.25 1.678v.822a2.5 2.5 0 0 1-2.5 2.5h-5a1.5 1.5 0 0 0-1.5 1.5v1.322a1.75 1.75 0 1 1-1 0V4.929a1.75 1.75 0 1 1 1 0V7.75a2.5 2.5 0 0 1 1.5-.5h5a1.5 1.5 0 0 0 1.5-1.5v-.822A1.75 1.75 0 0 1 11 3.25" clip-rule="evenodd"/>'
    },
    {
      id: "cf-code-js-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m5.455 7.645-2.722-1.53 2.722-1.533V3.435L1.468 5.677v.873l3.987 2.242zm5.115-.248v1.148l2.7 1.518-2.7 1.52v1.147l3.963-2.232v-.87zm-.137-5.907L4.405 14.488h1.103L11.533 1.49z"/>'
    },
    {
      id: "cf-code-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.603 1.5H3.396l-.5.5v12l.5.5h9.205l.5-.5V2zm-.5 12H3.896v-11h8.205z"/><path fill="currentColor" d="M7.415 9.073 5.537 8l1.878-1.072v-.963l-2.93 1.673v.725l2.93 1.675zm4.103-1.435L8.59 5.965v.963L10.465 8 8.59 9.072v.966l2.928-1.675z"/>'
    },
    {
      id: "cf-code-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M12.603 1.5H3.396l-.5.5v12l.5.5h9.205l.5-.5V2zM7.414 9.073 5.537 8l1.878-1.072v-.963l-2.93 1.673v.725l2.93 1.675zM8.59 5.964l2.928 1.673v.725L8.59 10.038v-.966L10.465 8 8.59 6.928z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-collapse-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M6 5.293 2.207 1.5l-.707.707L5.293 6H3v1h4V3H6zM13 6h-2.293L14.5 2.207l-.707-.707L10 5.293V3H9v4h4zm0 4V9H9v4h1v-2.293l3.793 3.793.707-.707L10.707 10zM3 10h2.293L1.5 13.793l.707.707L6 10.707V13h1V9H3z"/>'
    },
    {
      id: "cf-complexity-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M11.75 14.25h-3v1h3zm-5.75 0H2v1h4zM.75 7v3.75h1V7z"/><path fill="currentColor" d="M2 12.25v3h1v-3zm13-7H7.25v1H15zM11.25 1.5H5.5v1h5.75zM14.5 12h-3v1h3zM8.25 9.75H1.5v1h6.75z"/><path fill="currentColor" d="M9.25 11.5H2v1h7.25zM15 9.75H8v1h7zM6 7H1.75v1H6zm9.25-4.5h-2.5v1h2.5zm-9.5 2.25h-3.5v1h3.5z"/><path fill="currentColor" d="m3.23 2.385.7.678.557-.574L2.69.75.952 2.547l.574.556.684-.706.027 2.797 1-.016zM11 8H7.25v1H11zm3.75-.25h-2.5v1h2.5z"/><path fill="currentColor" d="M10.25 1.5V9h1V1.5zM14 7.75v3h1v-3zM10.75 12v3.25h1V12zM5 7.75v7.5h1v-7.5zm3.75 3.75v3.75h1V11.5zm3.5-9V8h1V2.5zm2 0v3.75h1V2.5zm-7 2.75v3h1v-3zM5.5 1.5v4.25h1V1.5zm8.75 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>'
    },
    {
      id: "cf-comprehensive-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m8.053 5.752-2.956 5.12h5.912zm-.433-1.25h.866l3.822 6.62-.433.75H4.231l-.433-.75z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M11.505 8.582 9.26 9.88v2.592l2.245 1.296 2.245-1.296V9.88zm3.245.72-3.245-1.874L8.26 9.3v3.748l3.245 1.873 3.245-1.873zM8 2.155 5.755 3.45v2.592L8 7.34l2.245-1.297V3.451zm3.245.719L8 1 4.755 2.874V6.62L8 8.494l3.245-1.873zm-6.75 5.708L2.25 9.88v2.592l2.245 1.296 2.245-1.296V9.88zm3.245.72L4.495 7.427 1.25 9.3v3.748l3.245 1.873L7.74 13.05z" clip-rule="evenodd"/><path fill="currentColor" d="M8 5.656a.909.909 0 1 0 0-1.817.909.909 0 0 0 0 1.817M4.23 12.28a.909.909 0 1 0 0-1.818.909.909 0 0 0 0 1.817m7.647.001a.909.909 0 1 0 0-1.818.909.909 0 0 0 0 1.817"/>'
    },
    {
      id: "cf-connect-1-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.5 1.48h-1v5.265h1zm3.75 1.554L8.526 6.757l.707.707 3.723-3.722zm2.263 4.458H9.247v1h5.265zm-5.279 1.03-.707.707 3.723 3.723.707-.707zM8.5 9.24h-1v5.265h1zm-1.736-.72L3.04 12.245l.707.707L7.47 9.229zm-.012-1.028H1.487v1h5.265zM3.748 3.033l-.707.707 3.723 3.723.707-.707z"/>'
    },
    {
      id: "cf-connect-2-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.5 1.498h-1v4.41h1zm3.736 1.548L9.117 6.164l.707.707 3.119-3.118zm2.254 4.442h-4.41v1h4.41zM9.824 9.106l-.707.707 3.119 3.118.707-.707zm-1.324.962h-1v4.41h1zm-2.323-.964L3.06 12.223l.707.707 3.117-3.12zM5.92 7.488H1.51v1h4.41zM3.764 3.046l-.707.707 3.118 3.118.708-.707z"/>'
    },
    {
      id: "cf-connect-iot-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.75 1.5a1.75 1.75 0 0 0-.5 3.428v2.677H8.433v-2.69a1.75 1.75 0 1 0-1 0v2.69H3.7v-2.69a1.75 1.75 0 1 0-1 0v6.235a1.75 1.75 0 1 0 1 0V8.605h3.733v2.545a1.75 1.75 0 1 0 1 0V8.605h4.817v-3.69a1.75 1.75 0 0 0-.5-3.415m-8.8 11.328a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M3.2 4a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5m5.483 8.828a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M7.933 4a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5m4.817 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5"/>'
    },
    {
      id: "cf-connect-iot-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M2.6 11.577v-7.09h1v3.12l3.832.005V4.488h1v3.125l3.962.006V4.502h1V8.62l-4.962-.007v2.964h-1V8.612l-3.831-.005v2.97z" clip-rule="evenodd"/><path fill="currentColor" d="M14.492 3.113a1.605 1.605 0 1 1-3.21 0 1.605 1.605 0 0 1 3.21 0m-4.951 0a1.605 1.605 0 1 1-3.21 0 1.605 1.605 0 0 1 3.21 0m0 9.794a1.605 1.605 0 1 1-3.21 0 1.605 1.605 0 0 1 3.21 0m-4.83-9.794a1.605 1.605 0 1 1-3.209 0 1.605 1.605 0 0 1 3.21 0m0 9.781a1.605 1.605 0 1 1-3.21 0 1.605 1.605 0 0 1 3.21 0"/>'
    },
    {
      id: "cf-consolidation-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.078 12.534c0-.76-.508-1.403-1.2-1.61A2.57 2.57 0 0 1 9.43 8.568h3.385l-.822.855.674.656 1.912-1.99-1.983-1.915-.653.68.801.775H9.428A2.567 2.567 0 0 1 6.875 5.29c.693-.207 1.2-.85 1.2-1.609a1.683 1.683 0 0 0-3.364.001c0 .768.52 1.417 1.224 1.616.061.919.477 1.74 1.114 2.33H4.796a1.685 1.685 0 0 0-1.614-1.212 1.683 1.683 0 0 0 0 3.364c.763 0 1.41-.512 1.614-1.212h2.253a3.5 3.5 0 0 0-1.114 2.35 1.681 1.681 0 1 0 2.143 1.616M5.656 3.682a.743.743 0 0 1 1.484 0 .744.744 0 0 1-.742.742.744.744 0 0 1-.742-.742m-2.47 5.159a.744.744 0 0 1-.742-.743.744.744 0 0 1 1.485 0 .744.744 0 0 1-.742.743m2.47 3.693a.743.743 0 0 1 1.484-.001.744.744 0 0 1-.742.743.744.744 0 0 1-.742-.742"/>'
    },
    {
      id: "cf-continuous-protection-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m9.957 7.683-.706-.668-1.52 1.466-.84-.841-.72.66L7.72 9.848z"/><path fill="currentColor" fill-rule="evenodd" d="M8.305 4H7.68l-.225.256A3.8 3.8 0 0 1 5.376 5.27l-.275.038-.351.405v2.082c-.004 1.461.704 2.544 1.414 3.262a6.2 6.2 0 0 0 1.496 1.115l.004.002h.001l.15.076h.363l.148-.075c.086-.04.802-.41 1.504-1.119.711-.72 1.42-1.803 1.42-3.26V5.71l-.327-.372-.075-.036-.228-.032a3.8 3.8 0 0 1-2.084-1.014zm-2.56 3.796V6.21a4.9 4.9 0 0 0 2.248-1.096A4.85 4.85 0 0 0 10.24 6.21v1.586c0 1.092-.51 1.925-1.065 2.509a5.2 5.2 0 0 1-1.181.923 5.3 5.3 0 0 1-1.18-.922c-.556-.585-1.068-1.418-1.068-2.51" clip-rule="evenodd"/><path fill="currentColor" d="m11.943 6.707.714-.704.753.753a5.525 5.525 0 0 0-8.625-3.159 5.5 5.5 0 0 0-2.039 2.908l-.987-.292a6.52 6.52 0 0 1 6.564-4.706 6.526 6.526 0 0 1 6.108 5.285l.777-.782.712.697-2.008 2.008-1.974-2.008zM.252 9.449 2.238 7.5l1.956 1.949-.706.684-.744-.731a5.34 5.34 0 0 0 1.873 2.918 5.5 5.5 0 0 0 3.298 1.192 5.5 5.5 0 0 0 3.355-1.028 5.35 5.35 0 0 0 2.02-2.822l.96.262a6.33 6.33 0 0 1-2.436 3.387 6.53 6.53 0 0 1-4.05 1.183 6.52 6.52 0 0 1-3.925-1.53 6.3 6.3 0 0 1-2.121-3.586l-.764.752-.704-.686z"/>'
    },
    {
      id: "cf-copy-duplicate-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14 1.5H6l-.5.5v2.5h1v-2h7v7h-2v1H14l.5-.5V2z"/><path fill="currentColor" d="m2 5.5-.5.5v8l.5.5h8l.5-.5V6l-.5-.5zm7.5 8h-7v-7h7z"/>'
    },
    {
      id: "cf-copy-duplicate-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m7.003 1.5-.5.5v3.502h3l1 1v3h3.502l.5-.5V2l-.5-.5z"/><path fill="currentColor" d="m1.501 7.002.5-.5h7.002l.5.5v7.001l-.5.5H2l-.5-.5z"/>'
    },
    {
      id: "cf-corner-down-right-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M2.806 4.822A2.42 2.42 0 0 0 5.225 7.24h4.433v.806H5.225A3.225 3.225 0 0 1 2 4.822V2h.806z"/><path fill="currentColor" d="M7.275 9.658 9.29 7.643 7.275 5.628l.57-.57 2.585 2.585-2.585 2.585z"/>'
    },
    {
      id: "cf-culture-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M4.75 6.49a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m-.5 2.01c0 .681.258 1.23.674 1.604.407.366.937.539 1.451.539s1.044-.173 1.451-.539c.416-.374.674-.923.674-1.604h-1c0 .414-.149.687-.342.86a1.17 1.17 0 0 1-.783.283c-.298 0-.58-.101-.783-.283-.193-.173-.342-.446-.342-.86zM8 6.5A.75.75 0 1 0 8 5a.75.75 0 0 0 0 1.5"/><path fill="currentColor" fill-rule="evenodd" d="m2 1.5-.5.5v5.767c0 .68.093 1.326.252 1.934.628 2.395 2.72 3.563 4.774 3.502 2.36 2.274 6.999 1.502 7.81-2.315a7.4 7.4 0 0 0 .164-1.542V4l-.5-.5h-2.75V2l-.5-.5zm11.358 9.18c-.564 2.652-3.522 3.418-5.468 2.297a4.57 4.57 0 0 0 2.407-1.74q.216.067.41.187c.268.168.483.407.619.689l.755-.698a2.67 2.67 0 0 0-1.3-1.067q.128-.31.218-.65a7.6 7.6 0 0 0 .251-1.93V4.5h2.25v4.846c0 .462-.051.907-.142 1.334M2.5 7.767V2.5h7.75v5.267c0 .587-.08 1.147-.219 1.678-.961 3.68-6.348 3.681-7.311.002a6.6 6.6 0 0 1-.22-1.68" clip-rule="evenodd"/>'
    },
    {
      id: "cf-customer-service-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M9.923 8.015v-.683h-.958v.683z"/><path d="m12.733 5.135-.843 1.413h-.145q.064-.305.063-.628a3.15 3.15 0 0 0-3.142-3.142A3.146 3.146 0 0 0 5.521 5.92a3.146 3.146 0 0 0 3.143 3.143 3.1 3.1 0 0 0 1.245-.26h1.725a4.12 4.12 0 0 1-2.97 1.26A4.146 4.146 0 0 1 4.523 5.92a4.142 4.142 0 0 1 8.21-.785"/><path fill-rule="evenodd" d="m1.75 5.028.5-.5h2.778l.5.5v2.745l-.5.5H2.25l-.5-.5zm1 .5v1.745h1.777V5.528zm5.911 6.237c-1.061-.001-1.852-.002-2.496.39-1.022.62-1.7 1.57-1.853 2.635h9.08c-.152-1.064-.83-2.012-1.852-2.635-.645-.392-1.435-.391-2.497-.39zm-.07-1h.521c.976-.005 2.05-.01 2.948.535 1.409.86 2.365 2.29 2.365 3.948v.042l-.5.5H3.78l-.5-.5v-.042c0-1.657.955-3.09 2.365-3.948m2.947-.536c-.976-.004-2.05-.01-2.947.536zm1.331-3.931.5.5v.682l-.5.5h-.958l-.5-.5v-.683l.5-.5z" clip-rule="evenodd"/><path d="M14.38 5.715h-1A4.72 4.72 0 0 0 8.665 1C6.478 1 4.57 2.48 3.98 4.44H2.945C3.558 1.932 5.93 0 8.665 0a5.72 5.72 0 0 1 5.715 5.715"/><path fill-rule="evenodd" d="m12.263 7.175 1.273-1.996.843.537-1.567 2.459H9.528v-1z" clip-rule="evenodd"/><path d="M3.98 4.435H2.945v.593H3.98z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-d1-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m2.207 2.632 1.687-1.285.317-.097h7.604l.313.102 1.736 1.285.215.423v9.98l-.145.362-1.268 1.343-.384.165H3.967l-.36-.142-1.439-1.342L2 13.04V3.06zm.844 6.673 1.174 1.298h.014v1.05h-.48l-.708-.788v1.941l1.118 1.05h7.88l.972-1.026v-2.028l-.964.851H7.16v-1.05h4.505l1.363-1.211V7.438l-.964.853H7.16v-1.05h4.505l1.363-1.208V4.215l-.964.856H3.77l-.72-.735v1.607l1.175 1.298h.014v1.05h-.48l-.708-.788zm8.59-7.004H4.388l-1.069.816.893.914h7.454l1.05-.935z" clip-rule="evenodd"/><path fill="currentColor" d="M5.7 8.703a.788.788 0 1 1 0 1.575.788.788 0 0 1 0-1.575m-.93 3.857.93-.929.928.929-.929.928zm.93-7.05.796.46v.92l-.797.46-.796-.46v-.92z"/>'
    },
    {
      id: "cf-ddos-attack-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M15.125 7.5h-1.164a6 6 0 0 0-1.732-3.74A5.98 5.98 0 0 0 8.5 2.023V.86h-.998v1.162c-1.41.12-2.73.736-3.73 1.739A6 6 0 0 0 2.039 7.5H.875v1H2.04a6 6 0 0 0 1.735 3.733 6 6 0 0 0 3.726 1.734v1.172h.998v-1.172a6 6 0 0 0 3.726-1.734c1-1 1.614-2.323 1.735-3.733h1.165zm-6.626 5.464v-.939h-.998v.94a5 5 0 0 1-3.022-1.439A5 5 0 0 1 3.041 8.5h.967v-1H3.04a5 5 0 0 1 1.435-3.033 5 5 0 0 1 3.026-1.442v1.032H8.5V3.025a5 5 0 0 1 3.025 1.442A5 5 0 0 1 12.96 7.5h-.968v1h.967a5 5 0 0 1-1.438 3.027 5 5 0 0 1-3.022 1.438"/><path fill="currentColor" d="M7.316 8.036 5.423 9.932l.706.707L8.02 8.743l1.893 1.896.706-.707-1.893-1.896 1.893-1.897-.706-.707L8.02 7.328 6.13 5.432l-.706.707z"/>'
    },
    {
      id: "cf-ddos-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.12 1.487H5.498v1H8.12zM9.963 2.82H5.498v1h4.465zM14 4.155H3.123v1H14zm-1.707 1.332H7.998v1h4.295zm-5.625 0H4.372v1h2.296zm4.435 1.333h-5.73v1h5.73zm0 1.335H7.73v1h3.372zm-5.73 0H2v1h3.372zM8.87 9.487H2v1h6.87zm3.423 0h-1.87v1h1.87zm-2.33 1.333H7.978v1h1.985zm-3.398 0H4.58v1h1.985zm2.305 1.335H3.358v1H8.87zm0 1.333H5.26v1h3.61z"/>'
    },
    {
      id: "cf-delivery-truck-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M2.544 10.25V7.237h1V9.75h.316a1.627 1.627 0 0 1 3.093 0h3.09v-5L1 4.749V3.75h9.544l.5.5v1.5h1.5l.354.146 2 2 .146.354v2l-.5.5h-1.347a1.625 1.625 0 0 1-3.093 0h-3.15a1.625 1.625 0 0 1-3.094 0h-.816zm8.5-1.508a1.627 1.627 0 0 1 2.153 1.008h.847V8.457L12.337 6.75h-1.293zm-5.638 2.133a.624.624 0 1 0 .002-1.249.624.624 0 0 0-.002 1.249m6.87-.625a.624.624 0 1 1-1.25.001.624.624 0 0 1 1.25-.001" clip-rule="evenodd"/><path fill="currentColor" d="M1.538 6.493H4.71v-1H1.538z"/>'
    },
    {
      id: "cf-device-desktop-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m1.25 3.25.5-.5H14.5l.5.5v8l-.5.5h-6V13h2.886v1H4.615v-1H7.5v-1.25H1.75l-.5-.5zM14 10.75H2.25v-7H14z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-device-desktop-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3 4.5h10.25V10H3z"/><path fill="currentColor" fill-rule="evenodd" d="m1.25 3.25.5-.5H14.5l.5.5v8l-.5.5h-6V13h2.886v1H4.615v-1H7.5v-1.25H1.75l-.5-.5zM14 10.75v-7H2.25v7z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-device-laptop-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m2 3.5-.5.5v7.508H0l.5 1h15l.5-1h-1.5V4l-.5-.5zm.5 8v-7h11v7z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-device-laptop-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.25 5.25h9.5v5.5h-9.5z"/><path fill="currentColor" fill-rule="evenodd" d="m2 3.5-.5.5v7.508H0l.5 1h15l.5-1h-1.5V4l-.5-.5zm11.5 8v-7h-11v7z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-device-mobile-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m4 1.25-.5.5v12.5l.5.5h8l.5-.5V1.75l-.5-.5zm.5 12.5V2.25h2V3h3v-.75h2v11.5z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-device-mobile-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M10.75 3h-1.5v.5h-2.5V3h-1.5v10h5.5z"/><path fill="currentColor" fill-rule="evenodd" d="m3.5 1.75.5-.5h8l.5.5v12.5l-.5.5H4l-.5-.5zm8 .5v11.5h-7V2.25z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-device-tablet-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m3.25 1.5-.5.5v12l.5.5h9.5l.5-.5V2l-.5-.5zm.5 12v-11H6.5v.75h3V2.5h2.75v11z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-device-tablet-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M11.5 3.25h-2v.5h-3v-.5h-2v9.5h7z"/><path fill="currentColor" fill-rule="evenodd" d="m2.75 2 .5-.5h9.5l.5.5v12l-.5.5h-9.5l-.5-.5zm9.5.5v11h-8.5v-11z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-dex-digital-experience-monitoring-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m5.986 7.37-1.231-.71V2.913L8 1.039l3.245 1.874V6.66l-1.151.665.414.717.997-.575L14.75 9.34v3.747l-3.245 1.874-3.245-1.874v-1.176h-.52v1.176l-3.245 1.874-3.245-1.874V9.34l3.245-1.873 1.077.621zm-.231-3.88L8 2.194l2.245 1.296v2.592l-.651.377-.759-1.314a.909.909 0 1 0-1.62.098l-.729 1.262-.731-.423zM8.26 9.34v1.57h-.52V9.34l-1.302-.752.414-.717L8 8.533l1.227-.708.415.717zm-1.52.578-.802-.464-.841 1.457H6.74zm-2.51 2.4a.91.91 0 0 0 .757-.407H6.74v.6l-2.245 1.295L2.25 12.51V9.918L4.495 8.62l.577.333-.894 1.548a.909.909 0 0 0 .051 1.816m4.497-5.36L8 7.379l-.648-.373.701-1.215zm2.778 1.663-.497.287.92 1.594a.909.909 0 1 1-.81 1.409H9.26v.6l2.245 1.295 2.245-1.296V9.918zm-.496 2.29-.867-1.503-.882.51v.993z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-documentation-clipboard-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13 2h-1.5v-.5L11 1H5l-.5.5V2H3l-.5.5V14l.5.5h10l.5-.5V2.5zM5.5 2h5v1h-5zm7 11.5h-9V3h1v.5L5 4h6l.5-.5V3h1z"/><path fill="currentColor" d="M7.978 5.172H4.643v1h3.335zm3.379 2.09H4.643v1h6.714zm0 2.089H4.643v1h6.714z"/>'
    },
    {
      id: "cf-documentation-clipboard-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M11.5 2H13l.5.5V14l-.5.5H3l-.5-.5V2.5L3 2h1.5v-.5L5 1h6l.5.5zm-1 0h-5v1h5zM4.643 5.172h3.335v1H4.643zm6.714 2.09H4.643v1h6.714zm-6.714 2.09h6.714v1H4.643z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-documentation-list-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13 1.5H3l-.5.5v11.946l.5.5h10l.5-.5V2zm-.5 11.946h-9V2.5h9z"/><path fill="currentColor" d="M11.366 3.665h-4.75v1h4.75zm0 2.097h-4.75v1h4.75zm0 2.096h-4.75v1h4.75zM5.634 3.672h-1v1h1zm0 2.09h-1v1h1zm0 2.089h-1v1h1z"/>'
    },
    {
      id: "cf-documentation-list-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M13 1.5H3l-.5.5v11.946l.5.5h10l.5-.5V2zm-1.634 2.165h-4.75v1h4.75zm-4.75 2.096h4.75v1h-4.75zm4.75 2.097h-4.75v1h4.75zM4.634 3.672h1v1h-1zm1 2.09h-1v1h1zm-1 2.09h1v1h-1z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-documentation-logs-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14 7.523h-2.027V6.02l-.146-.351-3.982-4.012h-.002L7.49 1.51H2.51l-.5.5v12l.5.5h8.963l.5-.5v-1.487H14l.5-.5v-4zm-6.01-4.3 2.281 2.297H7.99zm2.983 10.287H3.01v-11h3.98v3.51l.5.5h3.483v1.003H4.992l-.5.5v4l.5.5h5.98zm2.527-1.987H5.492v-3H13.5z"/><path fill="currentColor" d="M8.063 9.26H6.995l-.567 1.533h1.067zm2.25 0H9.245l-.567 1.533h1.067zm2.25 0h-1.068l-.567 1.533h1.067z"/>'
    },
    {
      id: "cf-documentation-logs-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M6.995 9.26h1.068l-.568 1.533H6.428zm3.318 0H9.245l-.567 1.533h1.067zm1.182 0h1.068l-.568 1.533h-1.067z"/><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5V1.51H2.51l-.5.5v12l.5.5h8.962l.5-.5v-1.487H14l.5-.5v-4l-.5-.5h-2.028V6H8zm6 6.023H5.492v-3H13.5z" clip-rule="evenodd"/><path fill="currentColor" d="M8.5 5V2.012L11.475 5z"/>'
    },
    {
      id: "cf-documentation-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.5 4.875h-3v1h3zm-3 2h3v1h-3zm3 2h-3v1h3z"/><path fill="currentColor" fill-rule="evenodd" d="m2 2.25-.5.5v10.5l.5.5h4a1.5 1.5 0 0 1 1.3.75h1.4a1.5 1.5 0 0 1 1.3-.75h4l.5-.5V2.75l-.5-.5h-4c-.818 0-1.544.393-2 1a2.5 2.5 0 0 0-2-1zm5.5 2.5A1.5 1.5 0 0 0 6 3.25H2.5v9.5H6a2.5 2.5 0 0 1 1.5.5zm1 8.5a2.5 2.5 0 0 1 1.5-.5h3.5v-9.5H10a1.5 1.5 0 0 0-1.5 1.5z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-documentation-rules-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13 1.5H3l-.5.5v11.95l.5.5h10l.5-.5V2zm-.5 11.95h-9V2.5h9z"/><path fill="currentColor" d="M7.965 3.678H4.63v1h3.335zm3.378 2.09H4.63v1h6.712zm0 2.09H4.63v1h6.712z"/>'
    },
    {
      id: "cf-documentation-rules-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M3 1.5h10l.5.5v11.95l-.5.5H3l-.5-.5V2zm1.63 2.177h3.335v1H4.63zm6.712 2.09H4.63v1h6.712zM4.63 7.858h6.712v1H4.63z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-documentation-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M8.5 14.25h.7a1.5 1.5 0 0 1 1.3-.75H14l.5-.5V3l-.5-.5h-3.5c-.818 0-1.544.393-2 1zM10 4.875h3.25v1H10zm0 2h3.25v1H10zm3.25 2H10v1h3.25z" clip-rule="evenodd"/><path fill="currentColor" d="M7.5 14.25V3.5a2.5 2.5 0 0 0-2-1H2l-.5.5v10l.5.5h3.5a1.5 1.5 0 0 1 1.3.75z"/>'
    },
    {
      id: "cf-documentation-support-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m1.028 1.502.5-.502h9.029l.5.5v4.27h.809l.393 1.556 1.452-.418 1.315 2.278-1.112 1.075 1.142 1.102-1.315 2.278-1.473-.423-.385 1.535H9.227l-.38-1.54-1.463.42-.372-.647H1.5l-.5-.5zm5.407 10.484-.367-.636 1.118-1.082-1.118-1.08 1.315-2.277 1.47.415.375-1.555h.829V2H2.028L2 11.986zm2.57-7.963H3.052v-1h5.955zm1.013 9.723h1.066l.35-1.403.425-.293 1.382.398.54-.92-1.03-1-.015-.513 1.037-1-.532-.922-1.4.405-.407-.327-.35-1.393h-1.065l-.346 1.385-.412.33-1.393-.4-.532.923 1.037 1v.512l-1.037 1 .532.92 1.393-.398.41.303zm1.138-3.484a.594.594 0 1 1-1.188 0 .594.594 0 0 1 1.188 0m1 0a1.594 1.594 0 1 1-3.188 0 1.594 1.594 0 0 1 3.188 0M3.051 6.04h4.285v-1H3.05zm2.615 2.016H3.051v-1h2.615z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-download-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m11.963 7.442-.713-.7L8.36 9.69V1.975h-1V9.69L4.472 6.742l-.715.7L7.86 11.63zm1.395 5.556H2.477v1h10.88z"/>'
    },
    {
      id: "cf-downtime-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m12.03 13.306 1.44-1.44.566.567-2.519 2.517L9 12.43l.566-.565 1.457 1.457.037-5.328h.99zM8.51 3.75h-1V8.5h1z"/><path fill="currentColor" d="m8.486 8.483-.713-.693-2.786 2.865.712.693z"/><path fill="currentColor" fill-rule="evenodd" d="M8.125 2A5.635 5.635 0 0 0 2.5 7.625a5.635 5.635 0 0 0 5.625 5.625v1c-3.651 0-6.625-2.974-6.625-6.625S4.474 1 8.125 1s6.625 2.974 6.625 6.625c0 .53-.06 1.046-.18 1.54l-.972-.232q.151-.627.152-1.308A5.635 5.635 0 0 0 8.125 2" clip-rule="evenodd"/>'
    },
    {
      id: "cf-drag-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m3.505 1.506.5-.5h2.996l.5.5v2.996l-.5.5H4.005l-.5-.5zm1 .5v1.996h1.996V2.006zm-1 4.496.5-.5h2.996l.5.5v2.995l-.5.5H4.005l-.5-.5zm1 .5v1.995h1.996V7.002zm-.5 3.996-.5.5v2.996l.5.5h2.996l.5-.5v-2.996l-.5-.5zm.5 2.996v-1.996h1.996v1.995zM9 10.997l-.5.5v2.996l.5.5h2.996l.5-.5v-2.996l-.5-.5zm.5 2.996v-1.996h1.996v1.995zM9 6.001l-.5.5v2.995l.5.5h2.996l.5-.5V6.502l-.5-.5zm.5 2.995V7.002h1.996v1.995zM9 1.007l-.5.5v2.995l.5.5h2.996l.5-.5V1.506l-.5-.5zm.5 2.995V2.006h1.996v1.996z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-drag-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m4.246 1.248-.5.5V4.26l.5.5H6.76l.5-.5V1.748l-.5-.5zm4.994 0-.5.5V4.26l.5.5h2.514l.5-.5V1.748l-.5-.5zM4.246 6.243l-.5.5v2.514l.5.5H6.76l.5-.5V6.743l-.5-.5zm4.994 0-.5.5v2.514l.5.5h2.514l.5-.5V6.743l-.5-.5zM4.246 11.24l-.5.5v2.513l.5.5H6.76l.5-.5V11.74l-.5-.5zm4.994 0-.5.5v2.513l.5.5h2.514l.5-.5V11.74l-.5-.5z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-drive-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.375 7.409a.523.523 0 1 0 0-1.046.523.523 0 0 0 0 1.046"/><path fill="currentColor" fill-rule="evenodd" d="M3.863 2.183 4.25 2h7.5l.387.183 2.25 2.75.113.317v.14l.002.002v3.213l-.5.5H2l-.5-.5V5.25l.113-.317zM2.5 5.892v2.213h11.002V6.25H13.5v-.358zm10.56-1H2.94L4.486 3h7.026z" clip-rule="evenodd"/><path fill="currentColor" d="M12.375 12.303a.523.523 0 1 0 0-1.047.523.523 0 0 0 0 1.047"/><path fill="currentColor" fill-rule="evenodd" d="m2 9.785-.5.5v3.213l.5.5h12.002l.5-.5v-3.213l-.5-.5zm.5 3.213v-2.213h11.002v2.213z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-drive-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.863 2.183 4.25 2h7.5l.387.183 1.867 2.567H1.996z"/><path fill="currentColor" fill-rule="evenodd" d="M14.003 5.5H2l-.5.5v2.75l.5.5h12.003l.5-.5V6zm-1.628 2.413a.525.525 0 1 1-.005-1.05.525.525 0 0 1 .005 1.05M14.003 10H2l-.5.5v3l.5.5h12.003l.5-.5v-3zm-1.628 2.555a.523.523 0 1 1 0-1.045.523.523 0 0 1 0 1.045" clip-rule="evenodd"/>'
    },
    {
      id: "cf-ease-of-use-toggle-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M15.5 4.75H7.647a4.512 4.512 0 1 0 0 6.485H15.5l.5-.5V5.25zM4.512 11.5A3.513 3.513 0 1 1 8.027 8a3.515 3.515 0 0 1-3.515 3.512zM15 10.25H8.425a4.47 4.47 0 0 0 0-4.5H15z"/><path d="m3.907 8.567-1.032-1.08-.723.693 1.743 1.822L6.87 6.996l-.713-.703z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-ease-of-use-toggle-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M7.53 10.703A4.23 4.23 0 0 0 8.5 8a4.23 4.23 0 0 0-1.005-2.745 4.25 4.25 0 1 0 .035 5.448m-.911-3.708-2.974 3.007L1.902 8.18l.722-.691 1.033 1.079 2.25-2.277z" clip-rule="evenodd"/><path fill="currentColor" d="M9.5 8c0 1.008-.284 1.95-.777 2.75H15.5l.5-.5v-4.5l-.5-.5H8.723c.493.8.777 1.742.777 2.75"/>'
    },
    {
      id: "cf-edge-log-delivery-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M12.199 7.503v1h-7.25v3h7.25v1h-.778v1.503l-.5.5H1.96l-.5-.5v-12l.5-.5h4.98l.353.145 3.982 4 .145.352v1.5zM9.72 5.488 7.44 3.193v2.295zm.7 7.005H4.44l-.498-.512v-4l.5-.5h5.98v-1H6.94l-.5-.5v-3.5H2.46v11h7.962z" clip-rule="evenodd"/><path fill="currentColor" d="m5.727 10.802.72-1.943.937.347-.72 1.943zm2.97-1.944-.72 1.944.939.347.719-1.943zm3.728.155.515-.518 1.508 1.51-1.508 1.508-.515-.515.628-.63h-2.238V9.64h2.238z"/>'
    },
    {
      id: "cf-edge-log-delivery-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7 5.49v-4H2l-.5.5v12l.5.5h9l.5-.5v-1.5h.75v-1H5v-3h7.25v-1h-.75v-1.5h-4z"/><path fill="currentColor" d="M8 4.99V1.997l3.008 2.993zm-1.982 5.806.72-1.944.937.348-.72 1.943zm2.97-1.944-.719 1.944.938.347.72-1.943zm3.479.155.515-.518L14.489 10l-1.507 1.508-.515-.515.627-.63h-2.237v-.728h2.237z"/>'
    },
    {
      id: "cf-edit-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m5.686 11.864.253-.136 7.105-7.085v-.707l-2.48-2.48h-.707L2.753 8.54l-.138.258-.605 3.105.59.586zM3.568 9.14l6.642-6.625 1.773 1.773-6.643 6.625-2.205.447zM14 13.5H2v1h12z"/>'
    },
    {
      id: "cf-edit-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m5.646 11.542-.254.136-2.792.811-.59-.586.792-2.81.138-.259 7.104-7.084h.706l2 2v.707zM2 13.5h12v1H2z"/>'
    },
    {
      id: "cf-email-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14.013 3.523h-12l-.5.5v7.954l.5.5h12l.5-.5V4.023zm-6 5.132L3.334 4.523h9.358zM5.762 8l-3.25 2.87V5.12zm.75.668 1.164 1.027h.663L9.5 8.668l3.193 2.81H3.335zM10.262 8l3.25-2.87v5.75z"/>'
    },
    {
      id: "cf-email-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m6.51 8.676 1.173 1.02h.662l1.17-1.02 4.242 3.803H2.215zm-.762-.661L1.514 4.336v7.428zm8.766 3.799-4.24-3.8 4.24-3.698zM2.102 3.522h11.8L8.014 8.654z"/>'
    },
    {
      id: "cf-exit-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m15.053 8.104-2.765 2.72-.702-.712 1.533-1.508H5.5v-1h7.619l-1.533-1.508.702-.712z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="m2 2.5.5-.5H10l.5.5v3.625h-1V3H3v10h6.5v-2.875h1V13.5l-.5.5H2.5l-.5-.5z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-expand-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M10 2v1h2.293L9.147 6.146l.707.708L13 3.707V6h1V2zM6.147 9.147 3 12.293V10H2v4h4v-1H3.707l3.147-3.146zM13 12.293 9.854 9.147l-.707.707L12.293 13H10v1h4v-4h-1zM6 3V2H2v4h1V3.707l3.146 3.147.708-.708L3.707 3z"/>'
    },
    {
      id: "cf-eyeball-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 3.17A9.2 9.2 0 0 0 .068 7.75v.5a9.16 9.16 0 0 0 15.865 0v-.5A9.2 9.2 0 0 0 8 3.17m0 8.66A8.2 8.2 0 0 1 1.083 8a8.163 8.163 0 0 1 13.835 0A8.2 8.2 0 0 1 8 11.83"/><path fill="currentColor" d="M8 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7m0 6a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5"/><path fill="currentColor" d="M8.85 7.852a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5"/>'
    },
    {
      id: "cf-eyeball-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M8 10.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m1.6-3.397a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M8 3.17A9.2 9.2 0 0 0 .067 7.75v.5a9.16 9.16 0 0 0 15.865 0v-.5A9.2 9.2 0 0 0 8 3.17M8 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7" clip-rule="evenodd"/>'
    },
    {
      id: "cf-face-happy-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5m0 12A5.5 5.5 0 1 1 13.5 8 5.506 5.506 0 0 1 8 13.5"/><path fill="currentColor" d="M6 7.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2m4 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M8 11a3.02 3.02 0 0 1-2.711-1.714l-.904.428a4 4 0 0 0 7.23 0l-.904-.428A3.02 3.02 0 0 1 8 11"/>'
    },
    {
      id: "cf-face-happy-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M4.389 2.595A6.5 6.5 0 0 1 8 1.5 6.507 6.507 0 0 1 14.5 8 6.5 6.5 0 1 1 4.389 2.595M7 6.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-3.603 3.033c.48.303 1.036.465 1.603.467a3.02 3.02 0 0 0 2.711-1.715l.904.43a4.002 4.002 0 0 1-7.23 0l.904-.43c.244.512.629.945 1.108 1.248" clip-rule="evenodd"/>'
    },
    {
      id: "cf-face-sad-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 8.838a4.29 4.29 0 0 0-3.465 1.775l.718.717a3.275 3.275 0 0 1 5.464-.045l.718-.717A4.3 4.3 0 0 0 8 8.838"/><path fill="currentColor" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5m0 12A5.5 5.5 0 1 1 13.5 8 5.506 5.506 0 0 1 8 13.5"/><path fill="currentColor" d="M6 7.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2m4 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>'
    },
    {
      id: "cf-face-sad-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M4.389 2.595A6.5 6.5 0 0 1 8 1.5 6.507 6.507 0 0 1 14.5 8 6.5 6.5 0 1 1 4.389 2.595M6.054 9.31A4.3 4.3 0 0 1 8 8.837a4.3 4.3 0 0 1 3.435 1.73l-.718.718a3.276 3.276 0 0 0-5.465.045l-.717-.718A4.3 4.3 0 0 1 6.054 9.31M6 7.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2m5-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0" clip-rule="evenodd"/>'
    },
    {
      id: "cf-filter-drawer-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14.5 4.25h-13v1h13zm0 6.5h-13v1h13z"/><path fill="currentColor" fill-rule="evenodd" d="M8.75 4.75a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0M4 11.25a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0" clip-rule="evenodd"/>'
    },
    {
      id: "cf-filtering-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="m8.38 14.595-.018-2.475-.73.005.02 2.502-.65-.625-.505.525 1.535 1.48 1.48-1.537-.525-.505zM4.25 1.612a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m2.5 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m2.5 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m2.5 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m-6.2 2.383a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m2.5 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m2.5 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m-3.825 7.128.5.5h1.55l.5-.5v-2.75l3.55-3.123-.325-.865h-9l-.325.865 3.55 3.112zm-1.918-5.75h6.38L8.438 7.77l-.17.372v2.5H7.71v-2.5l-.168-.37z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-filtering-solid",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M4.25 1.612a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m4.13 12.983-.018-2.475-.73.005.02 2.502-.65-.625-.505.525 1.535 1.48 1.48-1.537-.525-.505zM7.5.862a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m3.25-.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M5.55 3.995a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m3.25-.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m-3.325 7.628-.5-.5v-2.76L3.175 5.25l.325-.865h9l.325.865-3.55 3.122v2.75l-.5.5z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-fire-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M9.085 3.112c.607.849 1.027 2.39.255 5.104l.757.554c.296-.195.853-.745 1.328-1.378q.215-.284.407-.599c.264 1.15.418 2.352.418 3.23 0 2.461-1.893 4.227-4.267 4.227-1.188 0-2.175-.442-2.867-1.175C4.422 12.34 4 11.285 4 10.023c0-.905.211-1.532.516-2.047.28-.473.643-.86 1.06-1.304l.165-.177c.475-.51.987-1.092 1.373-1.887.328-.675.555-1.484.618-2.513.406.135.938.436 1.353 1.017m.814-.581C9.076 1.379 7.878 1 7.25 1l-.5.5c0 1.188-.221 2.024-.536 2.672-.317.653-.742 1.144-1.205 1.641l-.162.173c-.409.436-.85.906-1.191 1.48C3.258 8.139 3 8.943 3 10.024c0 1.488.5 2.797 1.39 3.738.89.943 2.144 1.489 3.593 1.489 2.899 0 5.267-2.187 5.267-5.227 0-1.39-.344-3.45-.888-5.033l-.973.163c0 .197-.068.452-.21.751-.129.27-.305.55-.5.817.255-1.925-.125-3.274-.78-4.19" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M8 14c1.007 0 1.806-.79 1.806-1.619 0-.44-.098-.65-.186-.778-.113-.166-.269-.292-.586-.542l-.004-.003c-.284-.224-.7-.552-1.017-1.057a3 3 0 0 1-.266-.532q-.165.148-.33.341a3.94 3.94 0 0 0-.927 2.571C6.49 13.354 7.14 14 8 14m-.486-5.616c-.945.636-2.024 2.034-2.024 3.997C5.49 13.85 6.532 15 8 15s2.806-1.15 2.806-2.619c0-1.198-.551-1.632-1.115-2.075C9.102 9.842 8.5 9.368 8.5 8c-.257 0-.611.132-.986.384" clip-rule="evenodd"/>'
    },
    {
      id: "cf-firewall-for-ai",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M9.908 1.237a6.83 6.83 0 0 0 3.689 1.891l.135.021.34.05.428.495v3.534c0 2.462-1.182 4.29-2.358 5.497-1.174 1.205-2.37 1.823-2.49 1.883l-.178.089h-.45l-.176-.09a4 4 0 0 1-.256-.14 9 9 0 0 1-.305-.183l-.028-.018a10 10 0 0 1-.359-.239l-.068-.047-.027-.02-.162-.117-.018-.012a11 11 0 0 1-.582-.465l-.057-.05-.044-.037-.084-.075-.037-.033a10 10 0 0 1-.38-.363l-.047-.047-.036-.036-.05-.051-.043-.046a10 10 0 0 1-.296-.327l-.06-.07-.064-.076-.104-.128-.081-.104-.034-.043-.068-.09-.018-.025h-1.2l-1.726 1.828-.864-.343v-7l.5-.5H4V3.693l.427-.495.34-.05a6.83 6.83 0 0 0 3.825-1.91l.284-.32h.747zm-.658.755A7.8 7.8 0 0 1 5 4.124V5.75h4.75l.5.5v5.015l-.5.5H6.83q.121.136.244.262a9.5 9.5 0 0 0 1.575 1.3l.022.014a9 9 0 0 0 .579.348 8 8 0 0 0 .769-.476 9.6 9.6 0 0 0 1.406-1.186C12.49 10.936 13.5 9.345 13.5 7.228V4.125a7.83 7.83 0 0 1-4.25-2.133m-6.5 10 1.011-1.07.364-.157H9.25V6.75h-6.5z"/>'
    },
    {
      id: "cf-folder-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m7.169 2.727.852 1.306H14l.5.5V13l-.5.5H2l-.5-.5V3l.5-.5h4.75zM2.5 8v4.5h11V8zm0-1h11V5.033H7.75l-.419-.227L6.479 3.5H2.5z"/>'
    },
    {
      id: "cf-funnel-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m1.5 3.506.387-.872h12.226l.387.872-4.853 5.362v3.404l-.224.428-2.25 1.566-.82-.428v-4.97zm1.564.172 4.198 4.638.135.35v4.172L8.603 12V8.666l.135-.35 4.198-4.638z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-future-proof-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m8.624 1.946-.387.583-.576.877-3.47 5.259.324.6h2.664l-.545 3.482-.137.87-.05.307.707.268.271-.43 4.01-6.331-.326-.597H8.51l.728-4.142.084-.47-.703-.283zm-.38 1.983-.566 3.23.387.456h2.355L7.502 12.22l.506-3.276-.386-.45h-2.39z" clip-rule="evenodd"/><path fill="currentColor" d="M7.502 2.297a5.57 5.57 0 0 0-3.648 1.367 5.62 5.62 0 0 0-1.828 3.184l-.664-.672-.612.601 1.719 1.728 1.687-1.724-.612-.608-.643.647A4.75 4.75 0 0 1 4.53 4.24a4.7 4.7 0 0 1 2.358-1.014zM5.892 12.66l-.14.873a5.5 5.5 0 0 1-1.62-.807 5.62 5.62 0 0 1-2.106-3.001l.83-.233a4.75 4.75 0 0 0 1.75 2.502c.393.289.83.514 1.286.665m5.252-8.557a4.7 4.7 0 0 0-1.254-.658l.157-.885c.56.177 1.091.441 1.575.79a5.6 5.6 0 0 1 2.109 3.004l-.844.25a4.75 4.75 0 0 0-1.743-2.501M15 9.297l-.612.608-.66-.668a5.6 5.6 0 0 1-1.835 3.177 5.58 5.58 0 0 1-3.661 1.364l.603-.913a4.7 4.7 0 0 0 2.386-1.02 4.75 4.75 0 0 0 1.62-2.587l-.643.647-.611-.608L13.28 7.57z"/>'
    },
    {
      id: "cf-garbage-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m5.5 1.875.5-.5h4l.5.5v1.5H13l.5.5v1.75l-.5.5h-.29l-.71 8-.5.5h-7l-.5-.5-.71-8H3l-.5-.5v-1.75l.5-.5h2.5zm1 .5v1h3v-1zm-3 2.75v-.75h9v.75zm.75 1 .75 7.5h6l.75-7.5zm1.252 1.251v4.249h1V7.376zm3.997 4.249V7.376h1v4.249zM7.5 7.376v4.249h1V7.376z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-geo-key-manager-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.271 6.253a4.251 4.251 0 0 1 8.2 1.001q.076-.004.154-.004c.48 0 .93.129 1.317.354l-.867.71a1.63 1.63 0 0 0-.929.008l-.664.204.017-.695.001-.081a3.25 3.25 0 0 0-6.394-.826l-.119.452-.459-.088a2.125 2.125 0 1 0-.403 4.212h8.5q.156 0 .305-.028l.738.813c-.32.138-.672.215-1.043.215h-8.5a3.125 3.125 0 1 1 .146-6.247"/><path fill="currentColor" fill-rule="evenodd" d="M7.5 9.5V7.25h-1V9.5h-1v1h7.073a1.75 1.75 0 1 0 0-1H9.25V8h-1v1.5zm6.75-.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5" clip-rule="evenodd"/>'
    },
    {
      id: "cf-geo-key-manager-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M7.25 3.5a4.25 4.25 0 0 0-3.979 2.753l-.146-.003a3.125 3.125 0 1 0 0 6.25h8.5c.383 0 .746-.082 1.074-.229a2.75 2.75 0 0 1-1.154-1.771h1.027a1.75 1.75 0 1 0 0-1h-1.027a2.75 2.75 0 0 1 1.376-1.908 2.6 2.6 0 0 0-1.45-.338A4.25 4.25 0 0 0 7.25 3.5m4.295 6H9.25V8h-1v1.5H7.5V7.25h-1V9.5h-1v1h6.045a2.8 2.8 0 0 1 0-1m2.705-.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5" clip-rule="evenodd"/>'
    },
    {
      id: "cf-government-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m14.25 7 .297-.902-6.25-4.625h-.594l-6.25 4.625L1.75 7h2v4.75H2.5v1h11v-1h-1.25V7zm-3 0h-1.5v4.75h1.5zm-2.5 0h-1.5v4.75h1.5zm-2.5 0h-1.5v4.75h1.5zM8 2.497 12.734 6H3.266z" clip-rule="evenodd"/><path fill="currentColor" d="M1.5 13.5h13v1h-13z"/>'
    },
    {
      id: "cf-graduation-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m13.54 5.936.28.449v4.91l.45.937-.45.717h-1l-.444-.73.444-.856V7.186l-.75.367v2.762l-.276.446-4.25 2.135h-.449l-4.25-2.135-.275-.446V7.553l-1.47-.72v-.897L7.1 3h.44zm-6 3.833H7.1L3.57 8.042v1.964l3.75 1.884 3.75-1.884V8.042zM2.457 6.385 7.32 8.763l4.862-2.378-4.862-2.38zm4.863-.436c.414 0 .75.224.75.5s-.336.5-.75.5-.75-.224-.75-.5.336-.5.75-.5"/>'
    },
    {
      id: "cf-green-leaf-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M5.965 12.703a5.1 5.1 0 0 0 3.327.29 4.88 4.88 0 0 0 3.032-2.283c.46-.797.68-1.807.769-2.831.09-1.032.05-2.122-.04-3.11a29 29 0 0 0-.561-3.579l-.004-.015-.001-.006-.503.12.503-.12-.646-.377-.005.002-.015.004-.056.017q-.075.022-.21.065A29 29 0 0 0 8.4 2.08c-.91.41-1.884.914-2.74 1.504-.85.585-1.622 1.278-2.084 2.076a4.88 4.88 0 0 0-.461 3.768A5.1 5.1 0 0 0 5.082 12.2l-1.527 2.644.88.508zm.52-.901c.81.335 1.707.405 2.553.19a3.84 3.84 0 0 0 2.39-1.799c.352-.608.552-1.446.635-2.404.083-.95.047-1.974-.039-2.926a28 28 0 0 0-.426-2.912q-.2.065-.46.154c-.61.211-1.437.52-2.312.916-.878.396-1.792.872-2.58 1.414-.794.547-1.423 1.135-1.774 1.742a3.84 3.84 0 0 0-.361 2.97 4.06 4.06 0 0 0 1.49 2.153l2.83-4.9.88.508zM11.842.792l.142.497z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-growth-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M13.625 1.75q-.53 0-1 .039c-3.014.251-4.168 1.728-4.362 4.71q-.03.475-.03 1 .53 0 1-.04c2.936-.257 4.153-1.733 4.36-4.709q.032-.474.032-1m-1.04 1.046c-1.285.126-2.013.495-2.455.993-.464.523-.762 1.347-.86 2.662 1.24-.127 1.969-.493 2.423-.996.474-.526.788-1.353.893-2.659M7.025 10.72c-1.227-.086-2.048-.35-2.6-.842-.558-.497-1.01-1.383-1.138-3.082 1.518.143 2.396.608 2.908 1.202.513.593.8 1.471.83 2.721M3.25 5.788C7.073 6.1 8.23 8.285 8 11.749c-3.384 0-5.445-.863-5.719-5q-.03-.47-.031-1 .528 0 1 .04" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="m8.171 9.065-.001.013c-.16 1.406-.187 1.655-.17 5.17l-1 .005c-.017-3.54.01-3.825.178-5.3v-.001c.095-.83.494-1.478.85-1.906a4.4 4.4 0 0 1 .694-.665q.008-.007.015-.01l.005-.004.001-.002h.002l.285.41.286.41h.001l-.005.003-.028.021a3.4 3.4 0 0 0-.487.476c-.281.338-.56.808-.626 1.38" clip-rule="evenodd"/>'
    },
    {
      id: "cf-hamburger-1-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.5 3.5h-9v1h9zm0 4h-9v1h9zm0 4h-9v1h9z"/>'
    },
    {
      id: "cf-hamburger-2-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14 3.5H2v1h12zm0 4H2v1h12zm0 4H2v1h12z"/>'
    },
    {
      id: "cf-health-check-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M10.78 2.113A4.06 4.06 0 0 0 8 3.148a4.1 4.1 0 0 0-2.78-1.035A4.225 4.225 0 0 0 1 6.335c0 1.055.57 2.208 1.135 2.878 1.215 1.447 5.365 5.005 5.54 5.155h.65c.175-.15 4.323-3.708 5.54-5.155C14.43 8.543 15 7.39 15 6.335a4.225 4.225 0 0 0-4.22-4.222M8 13.328c-.82-.71-3-2.618-4.328-3.935h1.296l.437-.25 1.117-2.03 1.403 3.082h.91l1.042-2.32.705 1.06.418.223h1.56c-1.283 1.312-3.687 3.415-4.56 4.17m5.398-5.173h-2.13l-1.06-1.59-.873.073-.958 2.135-1.355-3-.894-.023-1.455 2.643h-1.91A3.8 3.8 0 0 1 2 6.335a3.225 3.225 0 0 1 3.22-3.222 3.03 3.03 0 0 1 2.398 1.075h.762a3.07 3.07 0 0 1 2.4-1.08A3.225 3.225 0 0 1 14 6.335a3.7 3.7 0 0 1-.602 1.82"/>'
    },
    {
      id: "cf-health-check-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M6.958 2.468a4 4 0 0 0-1.744-.354A4.22 4.22 0 0 0 1 6.334c0 .737.265 1.472.583 2.057h3.088l1.457-2.644.894.034 1.356 2.991.958-2.134.872-.072 1.059 1.588h3.271c.261-.54.462-1.18.462-1.82a4.22 4.22 0 0 0-4.216-4.22A4.06 4.06 0 0 0 8 3.149a4 4 0 0 0-1.043-.681"/><path fill="currentColor" d="M13.914 9.154h-2.915l-.416-.222-.705-1.06-1.042 2.32-.912.002-1.401-3.091-1.118 2.03-.438.258H2.29c.684.766 1.965 1.952 3.086 2.958a148 148 0 0 0 2.111 1.857l.139.12.049.042h.65L8 13.988l.325.38.05-.042.138-.12a138 138 0 0 0 2.11-1.857c1.213-1.088 2.613-2.387 3.242-3.136z"/>'
    },
    {
      id: "cf-help-giving-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m9.423 5.208 1.372-.84-.037 1.607h.797l-.037-1.607 1.374.84.393-.693-1.415-.767 1.308-.708.107-.06-.393-.69-1.374.84.037-1.607h-.797l.037 1.607-1.372-.84-.395.693 1.417.765-1.417.767zm4.23 1.767-.693-.082L10.867 8.5l-.122-.15-2.852-.637L5.17 7.7l-.322.118-1.7 1.432-.398-.625-.847.533L4.943 14l.847-.53-.29-.455.433-.33h4.704l.383-.185 3.363-3.977v-.638zm-3.25 4.71H5.768l-.305.102-.5.378-1.285-2.05L5.348 8.7h2.375l2.407.533v.22H7.94v1h2.697l.5-.5v-.408l2.045-1.562.17.21z"/>'
    },
    {
      id: "cf-help-giving-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m9.422 5.208 1.373-.84-.038 1.607h.798l-.038-1.607 1.375.84.393-.693-1.415-.767 1.307-.708.108-.06-.393-.69-1.375.84.038-1.607h-.798l.038 1.607-1.373-.84-.395.693 1.418.765-1.418.767zm4.493 2.125-.442-.083-2.038 1.398.077.102v1.265l-.375.375H7.939v-.75h2.823v-.61l-3.066-.905H5.29L3.263 9.409l-.401-.634h.001l-.015-.025L2 9.282l3.04 4.843.848-.53L5.473 13l.557-.44h4.705l.383-.185 3.257-4.113v-.387z"/>'
    },
    {
      id: "cf-help-question-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7.927 1.5a6.5 6.5 0 1 0 6.5 6.5 6.507 6.507 0 0 0-6.5-6.5m0 12a5.5 5.5 0 1 1 5.5-5.5 5.506 5.506 0 0 1-5.5 5.5"/><path fill="currentColor" d="M7.892 10.175a.68.68 0 0 0-.494.204.66.66 0 0 0-.207.491.67.67 0 0 0 .207.497.68.68 0 0 0 .494.204.67.67 0 0 0 .35-.094.7.7 0 0 0 .255-.254.686.686 0 0 0-.112-.844.68.68 0 0 0-.493-.204m1.222-5.327a2.5 2.5 0 0 0-1.072-.214 2.5 2.5 0 0 0-1.019.204c-.3.13-.556.342-.739.612a1.84 1.84 0 0 0-.295 1.013h1.136a.96.96 0 0 1 .148-.495.84.84 0 0 1 .334-.293 1 1 0 0 1 .428-.097.96.96 0 0 1 .445.102.78.78 0 0 1 .435.723.9.9 0 0 1-.09.404 1.1 1.1 0 0 1-.243.324q-.162.15-.35.267a2.4 2.4 0 0 0-.481.384 1.4 1.4 0 0 0-.305.55c-.08.299-.117.608-.11.918v.082h1.062V9.25a1.9 1.9 0 0 1 .08-.569c.05-.15.133-.288.243-.403q.19-.193.422-.332.28-.165.507-.4a1.6 1.6 0 0 0 .446-1.159 1.65 1.65 0 0 0-.26-.932 1.7 1.7 0 0 0-.722-.607"/>'
    },
    {
      id: "cf-help-question-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M7.927 1.5a6.5 6.5 0 1 0 6.5 6.5 6.507 6.507 0 0 0-6.5-6.5m-.035 8.675a.68.68 0 0 0-.494.204.66.66 0 0 0-.207.491.67.67 0 0 0 .207.497.68.68 0 0 0 .494.204.67.67 0 0 0 .35-.094.7.7 0 0 0 .255-.254.686.686 0 0 0-.112-.844.68.68 0 0 0-.493-.204m.15-5.54c.368-.008.734.065 1.072.213.294.13.544.34.723.607.177.278.268.602.26.932a1.6 1.6 0 0 1-.446 1.16q-.227.234-.508.4a2 2 0 0 0-.422.33q-.166.176-.242.404a1.9 1.9 0 0 0-.081.569v.082H7.336V9.25a3.2 3.2 0 0 1 .11-.918c.058-.204.163-.393.305-.55a2.4 2.4 0 0 1 .48-.384q.19-.117.35-.266.153-.14.245-.325a.9.9 0 0 0 .089-.404.78.78 0 0 0-.435-.723.96.96 0 0 0-.445-.102 1 1 0 0 0-.428.097.84.84 0 0 0-.334.293.96.96 0 0 0-.148.495H5.99c-.002-.359.1-.711.295-1.013.184-.27.44-.482.74-.612a2.5 2.5 0 0 1 1.018-.204" clip-rule="evenodd"/>'
    },
    {
      id: "cf-hide-eye-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.99 11.324a10 10 0 0 0 1.018-.783 10.2 10.2 0 0 0 1.445-1.566 8 8 0 0 0 .476-.717l.007-.013.002-.004V8.24L15.5 8l.44.24v-.48L15.5 8l.439-.24-.001-.001-.002-.004-.007-.013-.025-.043-.092-.151c-.08-.129-.2-.308-.36-.523a10.2 10.2 0 0 0-1.444-1.566c-1.297-1.14-3.285-2.29-6.008-2.29-1.017 0-1.931.16-2.745.42l.81.81A8 8 0 0 1 8 4.17c2.419 0 4.181 1.016 5.348 2.041a9.2 9.2 0 0 1 1.302 1.411 8 8 0 0 1 .264.379 8 8 0 0 1-.264.379 9.2 9.2 0 0 1-1.302 1.41 9 9 0 0 1-1.082.813z"/><path fill="currentColor" fill-rule="evenodd" d="m10.243 9.992 1.108 1.109h.001l.747.747 1.533 1.533-.707.707-1.808-1.807a8.9 8.9 0 0 1-3.117.55c-2.723 0-4.71-1.15-6.008-2.29A10.2 10.2 0 0 1 .547 8.975a8 8 0 0 1-.476-.717l-.007-.013-.002-.004V8.24L.5 8l-.439-.24.001-.001.002-.004.007-.013a3 3 0 0 1 .117-.194c.08-.129.2-.308.36-.523.317-.428.796-.997 1.444-1.566a9.6 9.6 0 0 1 1.324-.978L1.425 2.589l.707-.707 2.104 2.105h.001l.76.76 1.01 1.01.71.709h-.001l2.817 2.818h.001zM2.652 6.21a8.6 8.6 0 0 1 1.393-1l1.332 1.332a3 3 0 0 0 4.08 4.08l.87.87A8 8 0 0 1 8 11.831c-2.42 0-4.181-1.016-5.348-2.041A9.2 9.2 0 0 1 1.35 8.379 8 8 0 0 1 1.086 8c.066-.101.154-.23.264-.379a9.2 9.2 0 0 1 1.302-1.41M6 8q.002-.375.128-.707l2.579 2.579Q8.375 9.998 8 10a2 2 0 0 1-2-2" clip-rule="evenodd"/><path fill="currentColor" d="M10.784 9.12a3 3 0 0 0-3.903-3.903l.808.807Q7.84 6 8 6a2 2 0 0 1 1.976 2.31zM.5 8l-.44.24v-.48z"/>'
    },
    {
      id: "cf-home-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14.172 7.878 8 2.52 1.828 7.878l-.656-.756 6.5-5.641h.656l6.5 5.641z"/><path fill="currentColor" fill-rule="evenodd" d="M4 8.101V13h2.125V9.759l.5-.5h2.75l.5.5V13H12V8.101h1V13.5l-.5.5h-9l-.5-.5V8.101zM8.875 13h-1.75v-2.741h1.75z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-icard-view-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M4 4h2v2H4zM3 3h4v4H3zm1 7h2v2H4zM3 9h4v4H3zm9-5h-2v2h2zm-2-1H9v4h4V3zm0 7h2v2h-2zM9 9h4v4H9z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-icard-view-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7 3H3v4h4zm0 6H3v4h4zm2-6h4v4H9zm4 6H9v4h4z"/>'
    },
    {
      id: "cf-image-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14 2.98H2l-.5.5v9.968l.5.5h12l.5-.5V3.48zm-.5 1v4.672l-2-1.637-.655.02-1.27 1.17-1.357-1-.618.02-3.5 2.925-1.6-1.1V3.98zm-11 8.968V10.27l1.325.925.605-.027L7.938 8.25l1.375 1 .634-.035 1.25-1.158L13.5 9.942v3z"/><path fill="currentColor" d="M4.77 8.04a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>'
    },
    {
      id: "cf-image-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m2 3-.5.5v4.821l2.6 1.829 3.5-2.925.618-.02 1.357 1 1.27-1.17.655-.02 3 2.466V3.5L14 3zm3.52 3.915a.875.875 0 1 1-1.75 0 .875.875 0 0 1 1.75 0" clip-rule="evenodd"/><path fill="currentColor" d="M1.5 13.5V9.542l2.325 1.653.605-.027L7.938 8.25l1.375 1 .635-.035 1.25-1.158 3.302 2.714V13.5l-.5.5H2z"/>'
    },
    {
      id: "cf-inbox-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m4.75 3.25-.5.25-3 3.75v5.25l.5.5h12.498l.502-.5V7.25l-3-3.75-.5-.25zm-2.25 4 2.5-3h6l2.5 3h-2.75l-.5.5V9h-4.5V7.75l-.5-.5zm-.25 1V12h11.5V8.25h-2.5V9.5l-.5.5h-5.5l-.502-.498.002-1.252z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-industry-gaming-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M12.025 4.478H8.98V3.5H7.02v.975H4a4 4 0 1 0 3.463 6h1.07a4 4 0 1 0 3.5-6zm-.027 7a3.02 3.02 0 0 1-2.71-1.718l-.135-.285H6.848l-.135.285A3 3 0 1 1 4 5.475h8.02a3 3 0 1 1-.022 6z"/><path d="M4.485 6.993h-1v.984H2.5v1h.985v.986h1v-.985h.985v-1h-.985zm7.49 1.054a.57.57 0 1 0 0-1.14.57.57 0 0 0 0 1.14m0 2.001a.57.57 0 1 0 0-1.14.57.57 0 0 0 0 1.14m-1-1a.57.57 0 1 0 0-1.14.57.57 0 0 0 0 1.14m2 0a.57.57 0 1 0 0-1.14.57.57 0 0 0 0 1.14"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-industry-gaming-solid",
      viewBox: "0 0 16 16",
      content: '<g clip-path="url(#a)"><path fill="currentColor" fill-rule="evenodd" d="M8.98 4.478h3.045l.007-.003a4 4 0 1 1-3.5 6h-1.07a4 4 0 1 1-3.462-6h3.02V3.5h1.96zM3.485 6.992h1v.985h.985v1h-.985v.985h-1v-.985H2.5v-1h.985zm8.49 1.055a.57.57 0 1 0 0-1.14.57.57 0 0 0 0 1.14m.57 1.43a.57.57 0 1 1-1.14 0 .57.57 0 0 1 1.14 0m-1.57-.43a.57.57 0 1 0 0-1.14.57.57 0 0 0 0 1.14m2.57-.57a.57.57 0 1 1-1.14 0 .57.57 0 0 1 1.14 0" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-industry-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13.85 7.523 10.5 8.57V8l-.65-.478L6.5 8.57V8l-.65-.478-.157.05-.193-5.59L5 1.5H3l-.5.482-.23 6.66-.42.13-.35.478V14l.5.5h12l.5-.5V8zM3.483 2.5h1.035l.184 5.383-1.42.442zM2.5 9.618l3-.938v4.82h-3zm4 0 3-.938v4.82h-3zm7 3.882h-3V9.617l3-.937z"/>'
    },
    {
      id: "cf-industry-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m2.648 1.987.5-.487h1.22l.5.487.125 4.726-2.487.777zm-.527 6.671-.313.13-.308.462V14l.5.5h3.5V8l-.407-.271zM10 14.5H6.5V8.473l2.842-.947L10 8zm1 0h3l.5-.5V8l-.64-.48-2.86.834z"/>'
    },
    {
      id: "cf-info-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13m0 12a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11"/><path fill="currentColor" d="M8.573 6.503H6.607v1h.965v3.062H6.399v1h3.35v-1H8.573zM8.49 4.032H7.235v1.255H8.49z"/>'
    },
    {
      id: "cf-info-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 2.487 12.505C12.891 13.01 14.5 10.601 14.5 8A6.5 6.5 0 0 0 8 1.5m.572 5.003H6.607v1h.965v3.562H6.397v1h3.35v-1H8.572zm-1.337-2.72H8.49v1.254H7.235z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-innovation-intelligence-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13.423 4.83a2.996 2.996 0 0 0-4.13-2.075 2.5 2.5 0 0 0-3.823.29 2.504 2.504 0 0 0-2.955 2.71A2.997 2.997 0 0 0 5.577 10.8c.54.45 1.22.697 1.923.7q.16 0 .32-.02a2 2 0 0 0 .232-.033 2 2 0 0 0 .27-.062l.12-.04c.045-.018.093-.03.138-.048l3.055 3.2.863-.402-.388-3.232A2.76 2.76 0 0 0 14 8.25v-.083a2.254 2.254 0 0 0-.578-3.337m.054 2.147a2.02 2.02 0 0 0-1.492-.66h-.945v1h.945a1.03 1.03 0 0 1 .95.63l.02.043c.012.032.027.065.035.09q.009.084.01.17a1.75 1.75 0 0 1-1.508 1.732l-.487.068.32 2.677-1.903-1.995a2.6 2.6 0 0 0 .778-1.86h-1a1.62 1.62 0 0 1-1.203 1.563q-.003.003-.01.002a2 2 0 0 1-.232.046l-.01.002h-.018q-.075.008-.15.008v.002c-.025 0-.052.005-.077.005a2 2 0 0 1-.998-.27A3 3 0 0 0 7.5 7.997h-1A2.005 2.005 0 0 1 4.137 9.97a1.995 1.995 0 0 1-1.252-3.14c.265.425.653.759 1.112.957l.35-.94a1.48 1.48 0 0 1-.805-1 1.496 1.496 0 0 1 1.985-1.75l.428.16.197-.41a1.492 1.492 0 0 1 2.285-.514 2.98 2.98 0 0 0-.9 2.65H8.56a2 2 0 0 1-.06-.476 2 2 0 0 1 3.98-.282l.037.272.25.115a1.25 1.25 0 0 1 .71 1.365"/><path fill="currentColor" d="m4.568 9.544.001.061v-.072zm.007.303c.002.037.008.073.01.11a6 6 0 0 1-.014-.352q-.002.12.004.242m-.007-.314v-.032z"/>'
    },
    {
      id: "cf-innovation-intelligence-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7.32 2.006c.389-.027.778.044 1.132.207a3.12 3.12 0 0 0-1.173 2.44v.376h1v-.375c0-.76.4-1.428 1-1.804a2.846 2.846 0 0 1 4.13 2.007 2.07 2.07 0 0 1 1.07 2.116A2.5 2.5 0 0 0 12.5 6h-.75v1h.75a1.5 1.5 0 0 1 1.48 1.25 2.6 2.6 0 0 1-1.994 2.526l.427 3.427-.436.211-2.588-2.593a3.12 3.12 0 0 0 1.18-2.446V9.25h-1v.125c0 .714-.352 1.347-.893 1.732v-.001a2.84 2.84 0 0 1-2.268.054c.611-.57.993-1.383.993-2.285V8.75h-1v.125a2.12 2.12 0 0 1-.877 1.72 2.85 2.85 0 0 1-3.599-1.103 2.86 2.86 0 0 1-.071-2.879c.32.56.853.996 1.524 1.176l.259-.966a1.5 1.5 0 0 1-1.065-1.077 2.4 2.4 0 0 1 0-.749l.004-.012h-.001a2.33 2.33 0 0 1 2.013-1.924c.302-.037.607-.014.899.066a2.33 2.33 0 0 1 1.832-1.121"/>'
    },
    {
      id: "cf-innovation-thinking-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M10.006 15.005h-4.01v.982h4.01zM8.47 0h-.982v2.12h.981zm4.491 2.026-1.498 1.499.694.694 1.498-1.499zM15.528 7.2H13.41v.981h2.12zM2.59 7.243H.473v.981H2.59zm.419-5.186-.694.694 1.498 1.498.694-.694z"/><path d="M8 3.055a4.657 4.657 0 0 0-2.49 8.593v1.847l.49.493h4l.49-.493v-1.847A4.657 4.657 0 0 0 8 3.055m1.765 7.883-.255.14v1.927H6.49v-1.928l-.255-.14a3.678 3.678 0 1 1 3.53 0"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-innovation-thinking-solid",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M7.488 0h.981v2.12h-.981zM5.996 15.005h4.01v.982h-4.01zm6.965-12.979-1.498 1.499.694.693 1.498-1.498zM13.41 7.2h2.118v.981H13.41zm-10.82.043H.473v.981H2.59zM2.315 2.75l.694-.693 1.498 1.498-.694.694zm3.435 8.624v1.876l.5.5h3.5l.5-.5v-1.902a4.375 4.375 0 1 0-4.5.026"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-internet-browser-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.623 5.4a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045m1.675 0a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045m1.672 0a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045"/><path fill="currentColor" d="M14 3.018H2l-.5.5v9.967l.5.5h12l.5-.5V3.518zm-.5 1V5.75h-11V4.018zm-11 8.967V6.75h11V13z"/>'
    },
    {
      id: "cf-internet-browser-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M4.145 4.877a.523.523 0 1 1-1.045 0 .523.523 0 0 1 1.045 0m1.675 0a.522.522 0 1 1-1.045 0 .522.522 0 0 1 1.045 0m1.15.523a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045"/><path fill="currentColor" fill-rule="evenodd" d="M2 3.017h12l.5.5v9.968l-.5.5H2l-.5-.5V3.517zM13.5 5.75V4.017h-11V5.75z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-internet-globe-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M2.663 6.668a5.5 5.5 0 0 0-.023 2.569h1.643a11 11 0 0 1 .01-2.569zm.355-1h1.447c.18-.806.453-1.538.8-2.155q.124-.222.265-.428a5.52 5.52 0 0 0-2.512 2.583M8.05 1.5H8a6.5 6.5 0 1 0 .05 0m-.554 1.123c-.48.203-.955.658-1.36 1.379a6.8 6.8 0 0 0-.644 1.666h2.004zm0 4.045H5.302a10 10 0 0 0-.012 2.569h2.207zm1 2.569V6.668h2.364a10 10 0 0 1 .013 2.569zm-1 1H5.47c.16.67.39 1.266.667 1.761.405.72.88 1.176 1.36 1.379zM5.53 12.915a6 6 0 0 1-.265-.428c-.36-.641-.64-1.406-.82-2.25h-1.47a5.52 5.52 0 0 0 2.555 2.678m5.194-.136a5.52 5.52 0 0 0 2.302-2.542h-1.307c-.18.844-.46 1.609-.82 2.25a6 6 0 0 1-.175.292m-.03-2.542H8.497v3.2c.538-.16 1.078-.633 1.53-1.439a7 7 0 0 0 .667-1.761m1.187-1h1.48a5.5 5.5 0 0 0-.024-2.569H11.87a11 11 0 0 1 .01 2.569m-.183-3.569a8 8 0 0 0-.8-2.155 6 6 0 0 0-.174-.292 5.5 5.5 0 0 1 2.259 2.447zm-1.027 0H8.497V2.562c.538.16 1.078.634 1.53 1.44.264.471.485 1.035.644 1.666" clip-rule="evenodd"/>'
    },
    {
      id: "cf-internet-globe-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M1.998 5.5h2.073a7.4 7.4 0 0 1 .853-2.008C5.656 2.322 6.73 1.5 8 1.5s2.344.822 3.076 1.992c.362.58.652 1.26.853 2.008h2.073a6.502 6.502 0 0 0-12.004 0m-.324 1a6.5 6.5 0 0 0-.054 2.75h2.207a10 10 0 0 1 .035-2.75zm.226 3.75a6.503 6.503 0 0 0 12.2 0h-2.108a7.6 7.6 0 0 1-.916 2.258C10.344 13.678 9.27 14.5 8 14.5s-2.344-.822-3.076-1.992a7.6 7.6 0 0 1-.916-2.258zm12.48-1a6.5 6.5 0 0 0-.054-2.75h-2.188a10 10 0 0 1 .035 2.75z"/><path fill="currentColor" d="M5.772 4.022a6.3 6.3 0 0 0-.66 1.478H7.5V2.568c-.628.17-1.232.662-1.728 1.454M4.875 6.5H7.5v2.75H4.836a9 9 0 0 1 .039-2.75m3.625 0v2.75h2.664a9 9 0 0 0-.039-2.75zm-3.46 3.75H7.5v3.182c-.628-.17-1.232-.662-1.728-1.454a6.5 6.5 0 0 1-.733-1.728m3.461 0v3.182c.628-.17 1.232-.662 1.728-1.454a6.5 6.5 0 0 0 .733-1.728zm0-7.682V5.5h2.388a6.3 6.3 0 0 0-.66-1.478c-.496-.792-1.1-1.284-1.728-1.454"/>'
    },
    {
      id: "cf-ip-truncation-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M9.589 6.218a.523.523 0 1 0 0-1.045.523.523 0 0 0 0 1.045"/><path fill="currentColor" fill-rule="evenodd" d="M9.959 9.386h-.783c-.182-.235-1.792-2.343-1.792-3.728a2.205 2.205 0 0 1 4.41 0c0 1.388-1.645 3.493-1.835 3.728m-.375-4.935a1.207 1.207 0 0 0-1.2 1.205c0 .635.627 1.75 1.192 2.575.575-.823 1.218-1.943 1.218-2.575a1.207 1.207 0 0 0-1.205-1.205z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M5.209 1.506h8.75l.5.5v8.87l-.5.5h-6v2.633l-.5.5h-5.5l-.5-.5V8.756l.5-.5h2.75v-6.25zm-2.75 7.75v4.25l4.5.002V9.756l-2.023 1.912h1.365v.73H3.71V9.797h.72v1.35l2.022-1.89zm5.5 1.12h5.5v-7.87h-7.75v5.75h1.75l.5.5z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-ip-truncation-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M10.725 5.224a.523.523 0 1 1-1.046 0 .523.523 0 0 1 1.046 0"/><path fill="currentColor" fill-rule="evenodd" d="m5.5 2 .5-.5h8l.5.5v8l-.5.5H7.75V9.25l-1-1H5.5zm3.503 2.01c.318-.326.748-.51 1.2-.51.45 0 .88.184 1.199.51.317.324.497.764.502 1.223v.003c0 .324-.106.686-.248 1.032-.144.35-.333.703-.52 1.017a13 13 0 0 1-.732 1.094l-.013.017-.004.004v.002l-.2-.152c.193.148.199.152.2.152l-.4-.002-.004-.005-.012-.017a8 8 0 0 1-.214-.301c-.137-.2-.32-.478-.504-.793a8 8 0 0 1-.51-1.017c-.14-.345-.243-.707-.243-1.03v-.003a1.78 1.78 0 0 1 .503-1.224" clip-rule="evenodd"/><path fill="currentColor" d="m2 9-.5.5V14l.5.5h4.5L7 14V9.523L4.533 12h1.31v.75H3.25v-2.63H4v1.35L6.42 9z"/>'
    },
    {
      id: "cf-key-outline",
      viewBox: "0 0 16 16",
      content: '<g clip-path="url(#a)"><path fill="currentColor" d="M15.972 7.2H7.25a3.643 3.643 0 1 0 0 1h4.527v2.235h1V8.2H14v3.25h1V8.2h.972zm-12.33 3.142a2.643 2.643 0 1 1-.004-5.285 2.643 2.643 0 0 1 .004 5.285"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-leader-crown-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M10.655 8.389 8.368 5.91h-.735L5.346 8.389 2.354 5.397 1.5 5.75v7l.5.5h12l.5-.5v-7l-.854-.354zM13.5 6.957v4.514l-2.167-2.347zm-5.5.03 1.947 2.11L8 11.042 6.053 9.096zM4.667 9.124 2.5 11.47V6.957zm.708.707 1.918 1.919-.5.5h-3.65zm3.832 2.419-.5-.5 1.918-1.918 2.233 2.418zM2.25 4.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m11.5 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m0-2a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1"/>'
    },
    {
      id: "cf-leader-crown-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.694 4.54a1.25 1.25 0 0 1-1.019.167l-.046-.042-.02.022a1.251 1.251 0 0 1 .635-2.413 1.25 1.25 0 0 1 .45 2.265m-4.112 3.5L2.06 5.518l-.56.232v5.7zm-2.991 4.802L5.29 8.747l2.003 2.003-2.5 2.5H2zm4.616.409h3.586L8 11.457zm2.5-2.5 2.5 2.5H14l.439-.439-3.555-4.238zm4.72-6.073-.03-.03-.01.01a.75.75 0 1 1 .04.02m-1.833 3.186 2.345-2.345.561.232v5.578zm-1.42.005L8 10.043l-2.04-2.04 1.89-2.092h.518zM2.968 4a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0"/>'
    },
    {
      id: "cf-learning-center-book-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14 3.5h-1.5v-1l-.675-.468L8 3.465 4.175 2.032 3.5 2.5v1H2l-.5.5v10l.5.5h12l.5-.5V4zm-5.5.847 3-1.125v8.466l-3 1.5zm-4-1.125 3 1.125v8.833l-3-1.5zM2.5 4.5h1V12l.277.447L5.87 13.5H2.5zm11 9h-3.37l2.092-1.043L12.5 12V4.5h1z"/>'
    },
    {
      id: "cf-learning-center-book-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m12 2.5-.675-.467L8.5 3.25v10.002l3.5-1.593zm-4.5.75L4.675 2.033 4 2.5v9.159l3.5 1.593z"/><path fill="currentColor" d="M8.051 14.5H14l.5-.5V4l-.5-.5h-1v8.498l-.315.464-4.5 1.992zM2 3.5h1v8.498l.315.464 4.5 1.992.127.046H2l-.5-.5V4z"/>'
    },
    {
      id: "cf-lighthouse-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m8.44 1.5 2.654 2h-1.068l.221 2H11.6v1h-1.242l.69 6.25H12.1v1H3.85v-1h1.052l.69-6.25H4.35v-1h1.353l.221-2H4.606l2.654-2zM7.209 12.75h2.834l-.282-2.552zm-1.044-2.312-.241 2.183L9.62 8.925l-.193-1.75zm.175-1.59L8.687 6.5H6.6zM6.71 5.5h2.532l-.221-2H6.93z"/>'
    },
    {
      id: "cf-link-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M1 6.75A2.253 2.253 0 0 1 3.25 4.5h4.5a2.25 2.25 0 1 1 0 4.5H7v1h.75a3.25 3.25 0 0 0 0-6.5h-4.5a3.25 3.25 0 0 0 0 6.5H4V9h-.75A2.253 2.253 0 0 1 1 6.75"/><path fill="currentColor" d="M12.75 6H12v1h.75a2.25 2.25 0 0 1 0 4.5h-4.5a2.25 2.25 0 0 1 0-4.5H9V6h-.75a3.25 3.25 0 0 0 0 6.5h4.5a3.25 3.25 0 1 0 0-6.5"/>'
    },
    {
      id: "cf-link-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M2.875 3.5a2.875 2.875 0 1 0 0 5.75h1.643a3.875 3.875 0 0 1 3.857-3.5H9v1h-.625a2.876 2.876 0 0 0 0 5.75h4.75a2.875 2.875 0 0 0 0-5.75h-1.893a3.875 3.875 0 0 1-3.857 3.5H6.75v-1h.625a2.876 2.876 0 0 0 0-5.75z"/>'
    },
    {
      id: "cf-list-view-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M2.25 13h2v-2h-2zm4-.5h8v-1h-8zm1-4h-1v-1h8v1zm-5 .5h2V7h-2zm5-4.5h-1v-1h8v1zm-5 .5h2V3h-2z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-loading-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M4.208 8.4a3.6 3.6 0 0 1 0-.8v-.065H1.441v.93h2.77zm.827-2.8q.253-.312.565-.565l.05-.04-1.96-1.96-.655.655L5 5.65zm.028-3.48 1.06 2.558.054-.03q.36-.193.75-.305l.063-.018-1.07-2.56zm-.72 4.798q.113-.391.305-.75l.03-.056-2.558-1.05-.355.858 2.56 1.06zM10.4 5.035q.312.253.565.565l.04.05 1.96-1.96-.655-.655L10.35 5zm.953 1.143q.192.358.305.75l.017.062 2.5-1.04.052-.02-.354-.857-2.55 1.05zm-1.53-1.53.054.03 1.06-2.558-.857-.355-1.06 2.56.063.018q.385.113.74.305m-2.285-.435H7.6q.4-.045.8 0h.063v-2.77h-.925zM5.6 10.965a4 4 0 0 1-.565-.565L5 10.35l-1.96 1.96.655.655L5.65 11zm6.058-1.882q-.112.39-.306.75l-.03.054 2.558 1.06.355-.854-2.56-1.073zm.13-1.548V7.6q.045.4 0 .8v.065h2.77v-.93zm-.823 2.865a4 4 0 0 1-.565.565l-.05.04 1.96 1.96.655-.655L11 10.35zm-6.317-.577a3.8 3.8 0 0 1-.305-.75l-.018-.063-2.56 1.072.355.855 2.558-1.06zm1.53 1.53-.056-.03-1.06 2.557.858.355 1.06-2.56-.062-.018a3.8 3.8 0 0 1-.74-.305m3.645.001q-.36.192-.75.305l-.063.017 1.06 2.56.857-.355-1.05-2.558zm-2.223.44h-.062v2.765h.925v-2.77H8.4a3.6 3.6 0 0 1-.8.005"/>'
    },
    {
      id: "cf-location-pin-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M8 1.362A5.083 5.083 0 0 0 2.922 6.44c0 3.5 4.448 9.25 4.638 9.48h.785c.195-.25 4.733-6 4.733-9.485A5.083 5.083 0 0 0 8 1.362m-.043 13.42c-1.08-1.477-4.035-5.75-4.035-8.342a4.078 4.078 0 1 1 8.156 0c0 2.587-3.018 6.867-4.12 8.343"/><path d="M7.98 4.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5m0 3.5A1.25 1.25 0 1 1 9.23 6.5a1.25 1.25 0 0 1-.768 1.17 1.2 1.2 0 0 1-.482.08"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-location-pin-solid",
      viewBox: "0 0 16 16",
      content: '<g clip-path="url(#a)"><path fill="currentColor" fill-rule="evenodd" d="M4.412 2.851A5.08 5.08 0 0 1 8 1.363a5.083 5.083 0 0 1 5.078 5.073c0 3.435-4.41 9.072-4.722 9.472l-.011.014H7.56c-.19-.23-4.638-5.98-4.638-9.481a5.08 5.08 0 0 1 1.489-3.59M8 8.251a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-logo-1.1.1.1-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.25 3.843q.632 0 1.254-.107.609-.107 1.102-.356a2.8 2.8 0 0 0 .842-.642q.349-.392.456-.962h1.667V14.25H6.33V5.447H3.25zm8.593 2.217v-.998h-1.827v-.8l1.877-2.512h.783v2.592h.574v.72h-.574v.998zm0-1.718V2.846h-.018l-1.117 1.496z"/>'
    },
    {
      id: "cf-logo-cloudflare-tv-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M16 4h-2.83l-1.6 3.861L9.967 4h-2.83l3.38 7.982h2.104zM6.338 4H0v2.607h2.259v5.375h2.863V6.607h2.344z"/>'
    },
    {
      id: "cf-logo-discord-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M6.082 8.44c0-.414.305-.753.691-.753.387 0 .698.339.692.752 0 .414-.305.753-.692.753-.38 0-.691-.34-.691-.753m2.474.001c0-.414.305-.753.691-.753.387 0 .692.339.692.752 0 .414-.305.753-.692.753-.38 0-.691-.34-.691-.753"/><path fill-rule="evenodd" d="M3.459 2h9.083c.765 0 1.389.624 1.389 1.396v12.16l-1.457-1.287-.82-.76-.868-.806.36 1.254H3.458c-.766 0-1.39-.624-1.39-1.397V3.396A1.396 1.396 0 0 1 3.46 2m6.019 8.303c.203.258.447.55.447.55C11.423 10.804 12 9.822 12 9.822c0-2.184-.976-3.953-.976-3.953-.976-.732-1.905-.711-1.905-.711l-.094.108c1.152.353 1.687.86 1.687.86a5.53 5.53 0 0 0-3.41-.636.6.6 0 0 0-.114.013c-.238.02-.814.109-1.539.427-.25.116-.4.197-.4.197s.563-.536 1.783-.888l-.068-.081s-.929-.02-1.905.711c0 0-.976 1.77-.976 3.952 0 0 .57.983 2.068 1.03 0 0 .25-.305.454-.562-.861-.258-1.186-.8-1.186-.8s.067.047.19.115q.008.01.026.02.015.01.03.017l.031.017c.17.095.34.17.495.23.278.11.61.218.997.292a4.8 4.8 0 0 0 1.755.007 4.5 4.5 0 0 0 .983-.291c.237-.088.502-.217.78-.4 0 0-.34.556-1.227.806" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-logo-discord-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M6.018 8.295c0 .43.315.78.697.78.388 0 .696-.35.696-.78.006-.428-.305-.782-.696-.782-.388 0-.697.351-.697.782m2.575 0c0 .43.315.78.697.78.391 0 .696-.35.696-.78.007-.428-.305-.782-.696-.782-.388 0-.697.351-.697.782"/><path fill="currentColor" fill-rule="evenodd" d="M14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0M9.108 5.047a6.4 6.4 0 0 1 1.578.49.02.02 0 0 1 .01.008c.875 1.288 1.307 2.74 1.146 4.411a.03.03 0 0 1-.01.018 6.4 6.4 0 0 1-1.939.979.03.03 0 0 1-.027-.01 5 5 0 0 1-.395-.643.025.025 0 0 1 .013-.035 4 4 0 0 0 .604-.288.025.025 0 0 0 .003-.04l-.12-.095a.02.02 0 0 0-.026-.003 4.58 4.58 0 0 1-3.895 0 .02.02 0 0 0-.025.003q-.06.049-.12.094a.025.025 0 0 0 .002.041q.289.168.605.288c.014.006.02.021.013.035q-.171.338-.396.644a.03.03 0 0 1-.027.008 6.4 6.4 0 0 1-1.935-.978.03.03 0 0 1-.01-.018c-.135-1.446.14-2.91 1.145-4.411a.02.02 0 0 1 .01-.009 6.4 6.4 0 0 1 1.578-.49q.016 0 .025.013c.069.12.147.276.2.403a5.9 5.9 0 0 1 1.771 0c.053-.124.129-.282.197-.403a.024.024 0 0 1 .025-.012" clip-rule="evenodd"/>'
    },
    {
      id: "cf-logo-facebook-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14.5 8a6.5 6.5 0 0 1-5.315 6.39V9.882c.07-.002.14 0 .21-.002h1.3q.146-.94.287-1.888a2 2 0 0 0-.227-.005q-.112-.002-.225 0H9.188c-.003-.027-.006-.045-.006-.065V6.745A1.2 1.2 0 0 1 9.23 6.4a.85.85 0 0 1 .675-.625q.193-.038.388-.035c.232-.003.465 0 .695 0h.07V4.127c-.078-.01-.155-.025-.236-.032-.272-.03-.542-.063-.817-.08a3.7 3.7 0 0 0-1.065.052 2.2 2.2 0 0 0-1.147.62A2.2 2.2 0 0 0 7.25 5.69q-.1.393-.1.8v1.497H5.5v1.89c.077.008.155.003.235.003q.113.002.23 0h1.18v4.563A6.5 6.5 0 1 1 14.5 8"/>'
    },
    {
      id: "cf-logo-github-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M7.997 1.488c-3.589 0-6.5 2.983-6.5 6.665a6.65 6.65 0 0 0 4.446 6.323c.325.061.444-.145.444-.321 0-.158-.006-.577-.009-1.133-1.808.402-2.19-.894-2.19-.894-.295-.77-.721-.975-.721-.975-.59-.414.045-.405.045-.405a1.37 1.37 0 0 1 .995.687c.58 1.018 1.521.725 1.892.553.029-.336.175-.651.413-.89-1.444-.168-2.962-.74-2.962-3.294a2.6 2.6 0 0 1 .669-1.788 2.45 2.45 0 0 1 .064-1.764s.545-.18 1.787.683a6 6 0 0 1 3.255 0c1.24-.862 1.785-.683 1.785-.683.24.56.263 1.188.065 1.764.44.49.68 1.129.668 1.788 0 2.56-1.52 3.125-2.968 3.288a1.6 1.6 0 0 1 .442 1.235c0 .89-.008 1.61-.008 1.828 0 .178.117.386.447.32a6.65 6.65 0 0 0 4.442-6.322c0-3.682-2.91-6.665-6.5-6.665" clip-rule="evenodd"/><path fill="currentColor" d="m3 7.272.002.066L3 7.26zm11.5 0-.001-.054v.136zm0-.089-.002-.06.002.095q-.002-.017 0-.035"/>'
    },
    {
      id: "cf-logo-instagram-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M7.998 4.917a3.082 3.082 0 1 0 .001 6.164 3.082 3.082 0 0 0-.001-6.164m0 5.082a2 2 0 1 1 0-4 2 2 0 0 1 0 4" clip-rule="evenodd"/><path fill="currentColor" d="M11.92 4.796a.72.72 0 1 1-1.44 0 .72.72 0 0 1 1.44 0"/><path fill="currentColor" fill-rule="evenodd" d="M7.998 2c-1.629 0-1.834.007-2.474.036-.638.028-1.074.13-1.455.278-.395.153-.729.36-1.062.693-.333.334-.538.67-.693 1.062-.147.381-.25.817-.278 1.458C2.007 6.165 2 6.37 2 7.999s.007 1.834.036 2.474c.028.638.13 1.074.278 1.457.153.396.36.73.693 1.063s.67.538 1.062.693c.381.147.817.25 1.457.278S6.37 14 8 14s1.833-.007 2.474-.036c.638-.028 1.074-.13 1.457-.278.395-.153.729-.36 1.062-.693.333-.334.538-.67.693-1.062.147-.381.25-.817.278-1.458C13.993 9.833 14 9.63 14 8s-.007-1.834-.036-2.474c-.028-.639-.13-1.075-.278-1.458a2.9 2.9 0 0 0-.693-1.062 3 3 0 0 0-1.062-.693c-.381-.148-.817-.25-1.457-.279C9.83 2.007 9.626 2 7.998 2m0 1.081c1.602 0 1.79.007 2.423.036.586.026.903.124 1.115.207.28.11.48.238.69.448s.34.41.448.69c.08.212.18.53.207 1.115.028.633.036.821.036 2.424s-.008 1.791-.036 2.425c-.026.585-.124.902-.207 1.114-.11.281-.238.481-.448.69-.21.21-.41.341-.69.448-.212.081-.529.181-1.115.207-.633.03-.821.036-2.423.036s-1.79-.007-2.424-.035c-.586-.027-.903-.124-1.114-.208a1.9 1.9 0 0 1-.691-.447c-.21-.21-.34-.41-.448-.691-.08-.212-.18-.529-.207-1.114C3.086 9.792 3.08 9.604 3.08 8s.007-1.79.035-2.424c.026-.586.124-.903.207-1.115.11-.28.239-.48.448-.69s.41-.34.69-.448c.212-.08.53-.18 1.115-.207.633-.031.821-.036 2.424-.036" clip-rule="evenodd"/>'
    },
    {
      id: "cf-logo-instagram-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7.999 9.125a1.125 1.125 0 1 1 0-2.25 1.125 1.125 0 0 1 0 2.25"/><path fill="currentColor" fill-rule="evenodd" d="M9.362 5.253a24 24 0 0 0-1.363-.02c-.902 0-1.007.003-1.364.02a1.9 1.9 0 0 0-.627.117 1 1 0 0 0-.388.252 1.05 1.05 0 0 0-.252.388c-.047.12-.101.297-.116.627-.016.356-.02.462-.02 1.364 0 .901.004 1.007.02 1.363.015.33.07.508.116.627.06.158.134.27.252.389.118.118.23.19.388.252.12.046.298.101.627.116.357.016.462.02 1.364.02a24 24 0 0 0 1.363-.02c.33-.015.508-.07.627-.116.158-.06.27-.134.388-.252s.19-.23.252-.389a1.8 1.8 0 0 0 .117-.627 24 24 0 0 0 .02-1.363c0-.902-.004-1.008-.02-1.364a1.9 1.9 0 0 0-.117-.627 1 1 0 0 0-.252-.388 1.05 1.05 0 0 0-.388-.252 1.8 1.8 0 0 0-.627-.117m.842.945a.405.405 0 1 1-.809 0 .405.405 0 0 1 .81 0M8 6.266a1.733 1.733 0 1 0 0 3.467 1.733 1.733 0 0 0 0-3.467" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0M6.607 4.645A24 24 0 0 1 8 4.625c.916 0 1.03.004 1.393.019.36.016.605.073.82.156.22.088.409.203.597.39.187.188.304.375.39.598.082.215.14.46.156.82s.02.474.02 1.391c0 .918-.004 1.032-.02 1.392s-.074.606-.157.82c-.087.221-.202.41-.39.597a1.65 1.65 0 0 1-.597.39c-.215.083-.46.14-.82.157s-.474.02-1.391.02-1.031-.004-1.392-.02a2.5 2.5 0 0 1-.82-.157 1.7 1.7 0 0 1-.596-.39 1.65 1.65 0 0 1-.39-.597 2.5 2.5 0 0 1-.157-.82A24 24 0 0 1 4.625 8c0-.916.004-1.031.02-1.39.016-.36.074-.606.157-.82.087-.221.202-.41.39-.597a1.64 1.64 0 0 1 .597-.39c.214-.083.46-.14.818-.157" clip-rule="evenodd"/>'
    },
    {
      id: "cf-logo-linkedin-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13.99 2.892v10.216a.88.88 0 0 1-.882.881H2.892a.88.88 0 0 1-.881-.88V2.891a.88.88 0 0 1 .88-.881h10.217a.88.88 0 0 1 .881.88m-8.456 3.7H3.772v5.637h1.762zm.158-1.938a1.015 1.015 0 0 0-1.007-1.021h-.032a1.022 1.022 0 1 0 0 2.043 1.015 1.015 0 0 0 1.04-.99zm6.536 4.15c0-1.694-1.078-2.353-2.15-2.353a2.01 2.01 0 0 0-1.782.909h-.05V6.59H6.592v5.637h1.761V9.23A1.17 1.17 0 0 1 9.41 7.968h.067c.56 0 .976.353.976 1.24v3.02h1.761z"/>'
    },
    {
      id: "cf-logo-linkedin-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M5.653 7.218h.978v3.13h-.978zm1.025-1.292a.6.6 0 0 1 .04.216v.018a.563.563 0 0 1-.576.55.567.567 0 0 1 0-1.135h.018a.56.56 0 0 1 .518.351M9.154 7.14c.595 0 1.193.365 1.193 1.306l-.008 1.901h-.978V8.671c0-.493-.23-.689-.542-.689h-.037a.65.65 0 0 0-.586.7v1.665h-.978v-3.13h.919v.427h.027a1.12 1.12 0 0 1 .99-.505"/><path fill="currentColor" fill-rule="evenodd" d="M14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0m-3.318 3.182a.5.5 0 0 0 .143-.346V5.164a.49.49 0 0 0-.489-.489H5.164a.49.49 0 0 0-.489.489v5.672a.49.49 0 0 0 .489.489h5.672c.13 0 .254-.051.346-.143" clip-rule="evenodd"/>'
    },
    {
      id: "cf-logo-terraform-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M10.074 10.581V15l-3.828-2.21V8.371zm0-4.904v4.419l-3.828-2.21v-4.42zM14 8l-3.506 2.096v-4.42L14 3.789zM5.827 3.21v4.42L2 5.42V1z"/>'
    },
    {
      id: "cf-logo-twitter-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13.368 5.197q.01.183.008.365c0 3.724-2.786 8.02-7.88 8.02v-.003a7.74 7.74 0 0 1-4.246-1.263q.329.04.66.04a5.5 5.5 0 0 0 3.44-1.208A2.78 2.78 0 0 1 2.761 9.19a2.7 2.7 0 0 0 1.25-.048C2.72 8.876 1.79 7.72 1.79 6.379v-.036c.385.218.816.34 1.257.353-1.217-.828-1.592-2.475-.857-3.764a7.82 7.82 0 0 0 5.708 2.945A2.85 2.85 0 0 1 8.7 3.184a2.74 2.74 0 0 1 3.918.122 5.5 5.5 0 0 0 1.76-.684 2.82 2.82 0 0 1-1.219 1.559 5.4 5.4 0 0 0 1.591-.444 5.7 5.7 0 0 1-1.382 1.46"/>'
    },
    {
      id: "cf-logo-twitter-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0m-3.23-1.03c0 2.07-1.577 4.459-4.46 4.459-.883 0-1.709-.26-2.395-.709q.185.024.374.023c.735 0 1.41-.25 1.947-.67a1.565 1.565 0 0 1-1.463-1.088q.146.03.296.029.216-.001.413-.055a1.57 1.57 0 0 1-1.258-1.537v-.02c.211.117.452.188.708.195a1.56 1.56 0 0 1-.698-1.303c0-.286.078-.556.211-.787a4.45 4.45 0 0 0 3.23 1.638 1.567 1.567 0 0 1 2.668-1.43 3.2 3.2 0 0 0 .995-.38 1.57 1.57 0 0 1-.689.868q.48-.061.9-.247a3.2 3.2 0 0 1-.783.812q.005.099.004.202" clip-rule="evenodd"/>'
    },
    {
      id: "cf-logo-wechat-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M13.543 12.39C14.432 11.745 15 10.792 15 9.733c0-1.94-1.888-3.513-4.217-3.513S6.566 7.793 6.566 9.733s1.888 3.514 4.217 3.514a5 5 0 0 0 1.377-.192l.123-.02a.44.44 0 0 1 .224.066l.924.533.08.026a.14.14 0 0 0 .142-.14l-.023-.103-.19-.709-.015-.09a.28.28 0 0 1 .118-.228M6.06 2.34C3.266 2.34 1 4.228 1 6.557c0 1.27.681 2.414 1.748 3.187.086.06.142.161.142.275l-.018.107-.228.85-.027.124a.17.17 0 0 0 .169.169l.098-.031 1.107-.64a.53.53 0 0 1 .269-.078l.148.022a6 6 0 0 0 1.652.232l.278-.007a3.3 3.3 0 0 1-.17-1.033c0-2.124 2.067-3.846 4.615-3.846l.275.007C10.677 3.88 8.585 2.34 6.06 2.34m3.317 6.83a.562.562 0 1 1 .001-1.124.562.562 0 0 1 0 1.124m2.812 0a.562.562 0 1 1 0-1.124.562.562 0 0 1 0 1.124M4.374 5.88a.674.674 0 1 1 0-1.348.674.674 0 0 1 0 1.349m3.374 0a.674.674 0 1 1 0-1.348.674.674 0 0 1 0 1.349" clip-rule="evenodd"/>'
    },
    {
      id: "cf-logo-wechat-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.466 8.348a.321.321 0 1 0 .642 0 .321.321 0 0 0-.642 0m1.606 0a.321.321 0 1 0 .643 0 .321.321 0 0 0-.643 0m-4.53-1.944a.385.385 0 1 0 .771 0 .385.385 0 0 0-.77 0m1.927 0a.385.385 0 1 0 .77 0 .385.385 0 0 0-.77 0"/><path fill="currentColor" fill-rule="evenodd" d="M14.512 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0M12 8.99c0 .606-.325 1.15-.833 1.518a.16.16 0 0 0-.067.131l.008.051.109.405.013.059a.08.08 0 0 1-.08.08l-.047-.015-.527-.304a.26.26 0 0 0-.128-.037l-.071.01c-.246.071-.512.11-.787.11-1.33 0-2.41-.899-2.41-2.008s1.08-2.007 2.41-2.007S12 7.882 12 8.99M4 7.175c0-1.33 1.295-2.41 2.892-2.41 1.442 0 2.638.881 2.855 2.032l-.157-.004c-1.456 0-2.637.984-2.637 2.198q.002.307.097.59l-.158.004a3.4 3.4 0 0 1-.944-.132l-.085-.013a.3.3 0 0 0-.154.044l-.633.366-.056.018a.097.097 0 0 1-.096-.097l.016-.07.13-.486.01-.061a.2.2 0 0 0-.081-.157C4.389 8.555 4 7.9 4 7.175" clip-rule="evenodd"/>'
    },
    {
      id: "cf-logo-weibo-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M10.518 2.41a3.705 3.705 0 0 1 4.303 4.767v.002a.536.536 0 0 1-1.02-.33 2.636 2.636 0 0 0-3.06-3.39.536.536 0 0 1-.224-1.048"/><path fill="currentColor" fill-rule="evenodd" d="M4.284 9.736c.48-.972 1.726-1.522 2.829-1.235 1.141.295 1.724 1.372 1.257 2.418-.473 1.07-1.834 1.64-2.988 1.268-1.114-.36-1.586-1.46-1.098-2.451m2.324.496c.14.058.32-.008.4-.147.078-.14.028-.297-.112-.348-.137-.055-.31.012-.39.147-.08.136-.036.291.102.348m-1.403 1.15c.361.165.841.008 1.065-.35.22-.36.105-.773-.258-.928-.36-.15-.823.004-1.044.351-.225.35-.12.765.237.927" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M11.288 7.431c-.103.26.032.3.229.358.803.25 1.697.852 1.697 1.913 0 1.756-2.533 3.968-6.34 3.968C3.969 13.67 1 12.263 1 9.948c0-1.21.767-2.61 2.087-3.931 1.764-1.763 3.82-2.566 4.594-1.792.34.34.374.93.155 1.636-.109.336.288.177.33.16h.003c1.425-.598 2.669-.633 3.123.016.242.347.22.832-.004 1.394m-8.876 3.07c.15 1.521 2.152 2.568 4.47 2.34 2.317-.23 4.074-1.649 3.924-3.17-.15-1.522-2.152-2.57-4.47-2.34S2.262 8.979 2.412 10.5" clip-rule="evenodd"/><path fill="currentColor" d="M12.633 4.827a1.8 1.8 0 0 0-1.718-.555.46.46 0 1 0 .192.902.885.885 0 0 1 1.049.678.9.9 0 0 1-.025.457.462.462 0 0 0 .879.284 1.8 1.8 0 0 0-.377-1.766"/>'
    },
    {
      id: "cf-logo-weibo-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7.434 9.191c-.047.08-.149.118-.23.085-.078-.033-.103-.122-.058-.2.046-.077.145-.115.223-.083.08.029.109.119.065.198m-.422.542c-.128.204-.403.294-.61.2-.203-.093-.263-.33-.135-.53a.504.504 0 0 1 .597-.2c.207.088.274.323.148.53"/><path fill="currentColor" fill-rule="evenodd" d="M7.36 10.766c-1.324.13-2.467-.468-2.553-1.337-.086-.87.918-1.68 2.242-1.811 1.325-.131 2.468.467 2.554 1.336.086.87-.918 1.681-2.242 1.812m.133-2.48c-.63-.164-1.343.15-1.616.706-.28.566-.01 1.195.627 1.4.66.213 1.437-.113 1.707-.724.267-.598-.066-1.213-.718-1.382" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M14.437 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0m-2.983-2.541a2.12 2.12 0 0 0-2.015-.653.307.307 0 0 0-.189.473.31.31 0 0 0 .316.126 1.507 1.507 0 0 1 1.748 1.937.31.31 0 0 0 .093.328.305.305 0 0 0 .338.04.3.3 0 0 0 .152-.179V7.53a2.12 2.12 0 0 0-.443-2.071m-1.444 2.42c-.113-.033-.19-.056-.131-.204.128-.321.14-.599.002-.797-.26-.37-.97-.35-1.785-.01l-.002.001c-.023.01-.25.101-.188-.091.125-.403.106-.74-.089-.935-.441-.442-1.616.016-2.624 1.024C4.438 7.622 4 8.42 4 9.113c0 1.323 1.697 2.127 3.356 2.127 2.176 0 3.623-1.264 3.623-2.267 0-.607-.51-.951-.97-1.093m-.344-2.01a1.03 1.03 0 0 1 1.197 1.327.264.264 0 0 1-.502-.162.504.504 0 0 0-.586-.649.264.264 0 1 1-.11-.516" clip-rule="evenodd"/>'
    },
    {
      id: "cf-logo-youtube-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14.346 4.793a1.68 1.68 0 0 0-1.174-1.182C12.141 3.332 8 3.332 8 3.332s-4.14 0-5.18.279a1.66 1.66 0 0 0-1.174 1.182C1.375 5.832 1.375 8 1.375 8s0 2.168.279 3.207c.15.572.602 1.024 1.174 1.182 1.031.279 5.172.279 5.172.279s4.14 0 5.18-.279a1.66 1.66 0 0 0 1.174-1.182c.271-1.039.271-3.207.271-3.207s0-2.168-.279-3.207m-7.701 5.18V6.027L10.108 8z"/>'
    },
    {
      id: "cf-logo-youtube-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M9.153 8 7.26 6.92v2.16z"/><path fill="currentColor" fill-rule="evenodd" d="M14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0m-3.67-2.402a.92.92 0 0 1 .643.647c.152.569.152 1.755.152 1.755s0 1.186-.148 1.755a.91.91 0 0 1-.643.647c-.568.152-2.834.152-2.834.152s-2.266 0-2.83-.152a.92.92 0 0 1-.643-.647C4.375 9.186 4.375 8 4.375 8s0-1.186.148-1.755a.91.91 0 0 1 .643-.647C5.734 5.446 8 5.446 8 5.446s2.266 0 2.83.152" clip-rule="evenodd"/>'
    },
    {
      id: "cf-logo-zhihu-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M7.263 5.387h-3.08v5.34h.755l.1.643 1.02-.643h1.205zM5.96 10.06l-.6.377-.058-.377h-.431V6.05h1.695v4.01z" clip-rule="evenodd"/><path fill="currentColor" d="M3.615 7.79h-1.12q.001-.096.005-.194l.005-.171V6.05h1.277v-.325a.34.34 0 0 0-.101-.239.35.35 0 0 0-.242-.099H1.446l.002-.005.019-.059c.068-.205.288-.831.288-.831a1.07 1.07 0 0 0-.603.174c-.143.1-.228.17-.343.487-.07.19-.135.377-.192.542-.052.15-.098.281-.135.381-.121.334-.412.922-.412.922.219-.003.434-.055.63-.153.28-.148.42-.375.514-.72l.022-.075h.583v1.375q-.001.136-.012.27l-.006.095H.771a.67.67 0 0 0-.618.408.7.7 0 0 0-.05.254h1.631a4.4 4.4 0 0 1-.194.912 4.2 4.2 0 0 1-.754 1.318 8 8 0 0 1-.786.745s.783.293 1.356-.239c.347-.323.658-.953.808-1.432q.202-.64.28-1.307h1.492v-.342a.31.31 0 0 0-.198-.294.3.3 0 0 0-.123-.024"/><path fill="currentColor" d="m2.818 9.16-.578.373 1.259 1.865c.087-.174.144-.362.168-.555a.8.8 0 0 0-.07-.542zm10.044-1.12V5.702a557 557 0 0 0 2.36-.12l.213-.013c.096-.1.22-.599.172-.755-.018-.063-.053-.167-.16-.14q-.528.127-1.069.183c-.668.077-.972.1-1.855.163l-.096.007c-1.68.122-3.177.18-3.177.18a.63.63 0 0 0 .414.595q.122.045.254.04c.569-.024 1.399-.062 2.249-.102v2.3H8.971c0 .176.07.345.195.469a.67.67 0 0 0 .473.194h2.526v1.769c0 .222-.116.298-.307.303h-.98a1.04 1.04 0 0 0 .56.653c.218.073.45.097.677.07.34-.017.742-.207.742-.893V8.703h2.82A.323.323 0 0 0 16 8.384V8.04z"/><path fill="currentColor" d="M10.488 6.306q.098.06.165.154l.721.995-.56.405-1.063-1.462.094-.068a.58.58 0 0 1 .643-.024m3.068 1.13.782-1.024a.58.58 0 0 1 .814-.111l.094.069-1.13 1.482z"/>'
    },
    {
      id: "cf-logo-zhihu-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m6.69 9.37.338-.211h.34V6.903h-.953v2.256h.243z"/><path fill="currentColor" fill-rule="evenodd" d="M14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0m-9.421-.119h.63a.18.18 0 0 1 .18.179v.193h-.84q-.042.375-.157.735c-.084.269-.259.624-.454.805-.323.3-.763.134-.763.134q.235-.195.442-.418.28-.332.424-.742.081-.25.11-.513h-.919a.37.37 0 0 1 .11-.263.38.38 0 0 1 .267-.11h.58l.003-.053q.005-.074.006-.152v-.773H4.37l-.013.042c-.052.194-.131.322-.288.406a.8.8 0 0 1-.355.085s.164-.33.232-.518l.076-.215.108-.305c.065-.177.113-.217.193-.273a.6.6 0 0 1 .34-.098s-.125.352-.163.467l-.01.033-.002.003H5.61a.19.19 0 0 1 .178.118.2.2 0 0 1 .015.073v.182h-.718v.773q0 .05-.003.097zm.949-1.35H7.76v3.003h-.677l-.574.361-.057-.361h-.424zM5.26 8.652l-.325.21.708 1.048a1 1 0 0 0 .095-.312.44.44 0 0 0-.04-.305zm5.65-1.946v1.316h1.765v.193a.18.18 0 0 1-.181.18h-1.586v1.07c0 .385-.226.492-.418.501a.9.9 0 0 1-.38-.039.6.6 0 0 1-.316-.367h.551c.108-.003.174-.046.174-.17v-.996H9.098a.38.38 0 0 1-.267-.109.37.37 0 0 1-.11-.263h1.798V6.729c-.478.022-.945.044-1.266.057a.36.36 0 0 1-.375-.357s.842-.033 1.787-.101l.054-.004c.497-.036.668-.049 1.043-.092q.305-.031.602-.102c.06-.016.08.042.09.078.027.088-.043.368-.097.424l-.12.008c-.204.01-.74.039-1.327.067m-1.336.34a.3.3 0 0 1 .093.087l.406.56-.315.227L9.16 7.1l.053-.039a.33.33 0 0 1 .361-.013m2.166.06-.44.576.315.234.636-.834-.053-.039a.325.325 0 0 0-.458.063" clip-rule="evenodd"/>'
    },
    {
      id: "cf-machine-learning-contextual-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M4.83 13.368a2.5 2.5 0 0 0 1.86 1.237 2.5 2.5 0 0 0 1.81-.48l.002-.001-.002-.003v-2.714h.71l.47.349a1.624 1.624 0 1 0 .721-.71l-.86-.64H8.5v-2.03h3.125a1.63 1.63 0 0 0 .673.773 1.625 1.625 0 1 0-.754-1.774H8.5V5.47h1.04l.764-.566a1.625 1.625 0 1 0-.667-.75l-.427.316H8.5V1.875a2.5 2.5 0 0 0-3.792 1.002 2.375 2.375 0 0 0-2.4 2.897q-.073.048-.144.104a2.375 2.375 0 0 0-.21 3.56 2.875 2.875 0 0 0 2.877 3.93M7.165 2.384a1.5 1.5 0 0 0-1.467.747c.287.145.544.348.753.6l-.768.64A1.375 1.375 0 0 0 3.26 5.404q.197-.03.4-.029l-.015 1a1.4 1.4 0 0 0-.728.197l-.17.131-.005-.006a1.375 1.375 0 0 0-.232 1.857 2.88 2.88 0 0 1 2.631-.882l-.179.984a1.875 1.875 0 1 0-.449 3.716 2.5 2.5 0 0 1 .856-2.141l.653.757A1.5 1.5 0 0 0 7.5 13.54V2.461a1.5 1.5 0 0 0-.336-.077m6.049 4.747a.626.626 0 1 0-.176 1.24.626.626 0 0 0 .176-1.24m-2.244-4.236a.626.626 0 1 1 .312 1.212.626.626 0 0 1-.312-1.212m.244 8.987a.625.625 0 1 0-.176 1.236.625.625 0 0 0 .176-1.236" clip-rule="evenodd"/>'
    },
    {
      id: "cf-magic-network-monitoring-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m9.704 8.944 5.046 4.577-.67.729-5.042-4.576a4.545 4.545 0 0 1-6.236-.224 4.52 4.52 0 0 1-.117-6.223 4.542 4.542 0 0 1 7.853 2.472 4.52 4.52 0 0 1-.834 3.245M4.09 9.22a3.54 3.54 0 0 0 1.962.593A3.55 3.55 0 0 0 9.55 6.77H8.12l-.773 1.84h-.923l-1.25-3.17-.431 1.027-.457.303H2.55a3.52 3.52 0 0 0 1.539 2.45M2.554 5.78q.012-.09.03-.179A3.52 3.52 0 0 1 5.356 2.83a3.54 3.54 0 0 1 3.629 1.49c.296.44.488.94.564 1.461H7.79l-.457.304-.433 1.03-1.255-3.181h-.914l-.775 1.847z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-mcp-server-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.776 8.494q.379 0 .7.107.326.105.576.31.252.202.409.495.159.293.204.671h-.931a.9.9 0 0 0-.104-.32.8.8 0 0 0-.202-.243.9.9 0 0 0-.285-.153 1.1 1.1 0 0 0-.346-.053q-.338 0-.589.168-.25.165-.388.484a1.9 1.9 0 0 0-.139.77q0 .465.139.781.14.316.39.478.252.162.58.162.186 0 .343-.049.159-.049.282-.142a.8.8 0 0 0 .204-.232.9.9 0 0 0 .115-.31l.93.004q-.036.3-.18.578-.142.277-.385.495-.24.217-.573.345a2.1 2.1 0 0 1-.75.125q-.582 0-1.041-.264a1.87 1.87 0 0 1-.723-.762q-.263-.5-.263-1.21 0-.711.267-1.21.268-.5.727-.761.459-.264 1.033-.264m-5.093 2.983h.051l1.198-2.923h1.135v4.351h-.892v-2.832h-.037l-1.126 2.811h-.607l-1.126-2.822h-.037v2.843H1.35V8.554h1.135zm9.358-2.923q.494 0 .843.189.349.187.531.52.185.332.185.765 0 .434-.187.765a1.3 1.3 0 0 1-.542.517q-.353.184-.854.184h-.773v1.411h-.92V8.554zm-.797 2.203h.624a.9.9 0 0 0 .438-.091.6.6 0 0 0 .26-.257.8.8 0 0 0 .087-.38q0-.217-.088-.379a.6.6 0 0 0-.259-.253.95.95 0 0 0-.442-.091h-.62zm2.106-7.296v3.212l-.5.5h-12l-.5-.5V3.461l.5-.5h12zm-12 2.712h11V3.961h-11zm9.675-1.7a.523.523 0 1 1 .4.966.523.523 0 0 1-.4-.966"/>'
    },
    {
      id: "cf-media-pause-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5m0 12A5.5 5.5 0 1 1 13.5 8 5.506 5.506 0 0 1 8 13.5"/><path fill="currentColor" d="M7 5H6v6h1zm3 0H9v6h1z"/>'
    },
    {
      id: "cf-media-pause-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5M7 5H6v6h1zm2 0h1v6H9z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-media-play-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m6.5 4.768-.75.43v5.935l.75.43 5-2.973v-.86zm.25 5.482V6.075l3.52 2.085z"/><path fill="currentColor" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13m0 12a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11"/>'
    },
    {
      id: "cf-media-play-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M6.75 6.075v4.175l3.52-2.09z"/><path fill="currentColor" fill-rule="evenodd" d="M4.389 2.595a6.5 6.5 0 1 1 7.222 10.81A6.5 6.5 0 0 1 4.39 2.594m1.36 2.603.75-.43 5 2.963v.86l-5 2.973-.75-.43z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-media-stop-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5m0 12A5.5 5.5 0 1 1 13.5 8 5.506 5.506 0 0 1 8 13.5"/><path fill="currentColor" d="m5.5 5-.5.5v5l.5.5h5l.5-.5v-5l-.5-.5zm4.5 5H6V6h4z"/>'
    },
    {
      id: "cf-media-stop-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M6 10h4V6H6z"/><path fill="currentColor" fill-rule="evenodd" d="M4.389 2.595A6.5 6.5 0 0 1 8 1.5 6.507 6.507 0 0 1 14.5 8 6.5 6.5 0 1 1 4.389 2.595M5 5.5l.5-.5h5l.5.5v5l-.5.5h-5l-.5-.5z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-more-1-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.05 9.585a1.584 1.584 0 1 1-.002-3.17 1.584 1.584 0 0 1 .002 3.17m0-2.17a.584.584 0 1 0-.002 1.17.584.584 0 0 0 .002-1.17M8 9.585a1.584 1.584 0 1 1 0-3.17 1.584 1.584 0 0 1 0 3.17m0-2.17a.585.585 0 1 0 0 1.17.585.585 0 0 0 0-1.17m4.95 2.17a1.584 1.584 0 1 1 .002-3.169 1.584 1.584 0 0 1-.002 3.169m0-2.17a.585.585 0 1 0 .002 1.17.585.585 0 0 0-.002-1.17"/>'
    },
    {
      id: "cf-more-1-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.05 9.585a1.584 1.584 0 1 1-.002-3.17 1.584 1.584 0 0 1 .002 3.17m4.95 0a1.584 1.584 0 1 1 0-3.17 1.584 1.584 0 0 1 0 3.17m4.95 0a1.584 1.584 0 1 1 .002-3.17 1.584 1.584 0 0 1-.002 3.17"/>'
    },
    {
      id: "cf-more-2-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.05 6.916a1.085 1.085 0 1 0-.002 2.169 1.085 1.085 0 0 0 .002-2.17M8 9.085a1.085 1.085 0 1 0 0-2.17 1.085 1.085 0 0 0 0 2.17m4.95-2.169a1.085 1.085 0 1 0 .002 2.169 1.085 1.085 0 0 0-.002-2.17"/>'
    },
    {
      id: "cf-network-scale-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14.938 3.435a1.948 1.948 0 0 0-3.788-.633l-6.265-.02a1.945 1.945 0 1 0-2.37 2.06L3.62 11.38a1.945 1.945 0 1 0 2.928 1.912l3.952-1.147a1.945 1.945 0 1 0 2.323-2.858l.597-3.957a1.945 1.945 0 0 0 1.518-1.895m-3.963 6.127-2.592-1.47q.075-.26.077-.535c0-.213-.037-.425-.108-.627l3.316-2.07c.214.2.47.35.75.437l-.583 3.893c-.313.051-.609.18-.86.372m.155-5.547L7.797 6.097a1.94 1.94 0 0 0-2.062-.325L4.52 4.087q.104-.144.183-.305l6.375.02q.022.109.052.213M5.565 7.557a.947.947 0 1 1 1.895-.01.947.947 0 0 1-1.895.01M13 2.5a.947.947 0 1 1 0 1.895.947.947 0 0 1 0-1.895M2 2.945a.947.947 0 1 1 1.895 0 .947.947 0 0 1-1.895 0m1.523 1.86q.114-.035.222-.085l1.207 1.677a1.94 1.94 0 0 0 .466 2.77l-.646 1.943h-.185zM4.617 14a.948.948 0 1 1 0-1.895.948.948 0 0 1 0 1.895m1.795-1.703a1.95 1.95 0 0 0-.697-.85L6.363 9.5h.15a1.94 1.94 0 0 0 1.354-.553l2.5 1.408a2 2 0 0 0-.15.75v.08zm5.75-.235a.948.948 0 1 1 .874-.584.95.95 0 0 1-.883.58z"/>'
    },
    {
      id: "cf-network-scale-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M1 2.625a1.625 1.625 0 1 1 3.245.125h7.049a1.626 1.626 0 1 1 2.263 1.85l-.747 4.832a1.626 1.626 0 1 1-1.64 2.653l-4.768 1.06q.016.113.016.23a1.625 1.625 0 1 1-2.659-1.254L2.397 4.234A1.625 1.625 0 0 1 1 2.625m11.106 1.932q.197.106.422.156l-.738 4.773a1.6 1.6 0 0 0-.47.283L8.085 7.86a1.6 1.6 0 0 0-.01-.759zM7.573 8.72a1.62 1.62 0 0 1-.983.403l-.785 2.981q.07.056.134.119l4.823-1.072a1.6 1.6 0 0 1 .038-.528zm-.029-2.465 3.86-2.437-.03-.068H4.155l1.86 2.199a1.62 1.62 0 0 1 1.53.306m-2.347.274L3.452 4.468l1.258 7.284a2 2 0 0 1 .154 0l.759-2.884a1.624 1.624 0 0 1-.426-2.339" clip-rule="evenodd"/>'
    },
    {
      id: "cf-network-virtual-backbone-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.75 6.44a1.75 1.75 0 0 0-1.675 1.25H9.676A1.75 1.75 0 0 0 8.5 6.515V4.867a1.75 1.75 0 1 0-1 0v1.647A1.75 1.75 0 0 0 6.323 7.69H4.925a1.75 1.75 0 1 0 0 1h1.397A1.75 1.75 0 0 0 7.5 9.868v1.194a1.75 1.75 0 1 0 1 0V9.868A1.75 1.75 0 0 0 9.676 8.69h1.399a1.75 1.75 0 1 0 1.675-2.25m-9.5 2.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5m4-5.75a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0m1.5 9.548a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m4-3.797a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5"/>'
    },
    {
      id: "cf-network-virtual-backbone-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M9.5 3a1.5 1.5 0 0 1-.981 1.408v2.17A1.75 1.75 0 0 1 9.683 7.77h1.895a1.5 1.5 0 1 1 .015 1H9.67c-.17.549-.603.982-1.152 1.152v1.67a1.5 1.5 0 1 1-1-.013V9.933a1.75 1.75 0 0 1-1.19-1.163H4.407a1.5 1.5 0 1 1 .015-1h1.895a1.75 1.75 0 0 1 1.202-1.203V4.421A1.5 1.5 0 1 1 9.5 3"/>'
    },
    {
      id: "cf-no-edit-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m10.78 8.657 3.323-3.315v-.707l-2.738-2.739h-.706L7.334 5.21l.707.708 2.97-2.962 2.031 2.03-2.97 2.963z"/><path fill="currentColor" fill-rule="evenodd" d="m7.333 6.625 2.03 2.031h.001l.707.707 4.033 4.033-.708.707-4.034-4.033-3.103 3.094-.253.136-3.407.69-.59-.586.669-3.428.137-.258 3.102-3.094-4.02-4.02.707-.708 4.021 4.022h.001zM3.63 10.318l-.496 2.543 2.526-.511 2.995-2.988-2.03-2.03z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-no-edit-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m10.54 8.417 3.35-3.34V4.37l-2.384-2.385h-.707l-3.35 3.34zm-3.8-2.385L2.604 1.897l-.708.708L6.032 6.74 2.956 9.807l-.131.228-.846 3.252.614.609 3.23-.867.223-.13L9.123 9.83l4.274 4.274.707-.707L9.83 9.124z"/>'
    },
    {
      id: "cf-no-security-shield-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m6.353 5.752-.705.71L7.293 8.09 5.668 9.735l.71.703 1.627-1.646 1.643 1.626.704-.71-1.644-1.626 1.624-1.645-.71-.705-1.627 1.645z"/><path fill="currentColor" d="m12.853 3.445-.34-.048A6.98 6.98 0 0 1 8.67 1.5l-.297-.335h-.75l-.29.335A6.98 6.98 0 0 1 3.5 3.397l-.34.048-.43.5v3.53c-.012 4.888 4.67 7.275 4.868 7.38l.177.09h.45l.178-.09c.197-.098 4.88-2.5 4.88-7.38V3.94zm-.57 4.03c0 4.088-3.783 6.208-4.283 6.463-.485-.25-4.282-2.373-4.282-6.463v-3.1A8.04 8.04 0 0 0 8 2.25a8.03 8.03 0 0 0 4.283 2.125z"/>'
    },
    {
      id: "cf-no-security-shield-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M8.372 1.164h-.745l-.287.322a6.9 6.9 0 0 1-3.852 1.91l-.343.05-.428.495v3.535c0 2.463 1.19 4.292 2.375 5.498 1.181 1.204 2.386 1.822 2.506 1.882l.178.09h.447l.179-.09c.12-.06 1.325-.677 2.507-1.882 1.184-1.206 2.375-3.035 2.375-5.498V3.942l-.428-.495-.342-.05A6.9 6.9 0 0 1 8.66 1.486zm-.376 6.214 1.627-1.644.71.703L8.708 8.08l1.645 1.626-.704.711-1.644-1.626-1.626 1.645-.711-.703 1.626-1.645-1.645-1.626.704-.711z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-no-stop-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M2.5 8a5.5 5.5 0 0 1 9.02-4.222l-7.712 7.777A5.48 5.48 0 0 1 2.5 8M8 13.5a5.47 5.47 0 0 1-3.48-1.25l7.708-7.75A5.5 5.5 0 0 1 8 13.5"/>'
    },
    {
      id: "cf-no-stop-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 14.5a6.5 6.5 0 0 0 4.956-10.706l-9.162 9.162A6.47 6.47 0 0 0 8 14.5m-4.916-2.248 9.168-9.168a6.5 6.5 0 0 0-9.168 9.168"/>'
    },
    {
      id: "cf-no-stop-x-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13m0 12a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11"/><path fill="currentColor" d="m11.335 5.455-.71-.705-2.64 2.57-2.61-2.57-.702.71 2.61 2.57-2.618 2.64.71.705 2.617-2.642 2.633 2.642.705-.71-2.635-2.642z"/>'
    },
    {
      id: "cf-no-stop-x-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5m2.793 10.003-2.8-2.77-2.77 2.802-.71-.705 2.77-2.8L4.48 5.26l.705-.71 2.8 2.77 2.77-2.8.71.703-2.77 2.8 2.803 2.77z"/>'
    },
    {
      id: "cf-notification-announcements-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.336 2.681a3.7 3.7 0 0 0-1.419-.614l.195-.98a4.68 4.68 0 0 1 3.532 6.057l-.95-.313a3.68 3.68 0 0 0-1.358-4.15"/><path fill="currentColor" fill-rule="evenodd" d="m7.156 1.45.882-.028 4.625 8.01-.466.75-5.245-.34-.302.175 1.647 2.853-.183.683-1.732 1-.683-.183-1.648-2.853-.649.375-.683-.183-1.625-2.814.183-.683 3.55-2.05zM6.15 9.151 5.025 7.203 2.21 8.828l1.125 1.948zm-1.233 1.866 1.398 2.42.866-.5-1.397-2.42zm6.412-1.894-4.197-.27L5.774 6.5l1.865-3.77z" clip-rule="evenodd"/><path fill="currentColor" d="M11.75 3.49a2.7 2.7 0 0 0-1.008-.437l-.202.979a1.68 1.68 0 0 1 1.272 2.116l.96.281A2.68 2.68 0 0 0 11.75 3.49"/>'
    },
    {
      id: "cf-notification-announcements-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.336 2.681a3.7 3.7 0 0 0-1.419-.614l.195-.98a4.682 4.682 0 0 1 3.532 6.057l-.95-.313a3.68 3.68 0 0 0-1.358-4.15m-3.821-.975-.89.045L5.618 6.23l1.789 3.098 4.829.39.473-.748zM1.527 8.645 4.774 6.77l1.75 3.03-3.247 1.876-.683-.183-1.25-2.165zm3.116 3.397 1.375 2.381.683.183.866-.5.183-.683-1.375-2.381z"/><path fill="currentColor" d="M11.75 3.49a2.7 2.7 0 0 0-1.008-.438l-.202.98a1.677 1.677 0 0 1 1.272 2.115l.96.282A2.68 2.68 0 0 0 11.75 3.49"/>'
    },
    {
      id: "cf-numeric-1-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 1.488a6.5 6.5 0 1 0 6.5 6.5 6.507 6.507 0 0 0-6.5-6.5m0 12a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11"/><path fill="currentColor" d="M8.58 5.25h-.948l-1.367.878v.913l1.287-.822h.032v3.605H6.36v1h3.374v-1H8.58z"/>'
    },
    {
      id: "cf-numeric-1-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M4.389 2.583A6.5 6.5 0 0 1 8 1.488a6.507 6.507 0 0 1 6.5 6.5A6.5 6.5 0 1 1 4.389 2.583M7.632 5.25h.948v4.573h1.155v1H6.36v-1h1.223V6.22h-.032l-1.287.822v-.913z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-numeric-100-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M2.5 8a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13m2.145 8.352q.347.242.828.244.48 0 .826-.242.345-.243.53-.703t.186-1.11q.002-.645-.185-1.097a1.5 1.5 0 0 0-.533-.693 1.4 1.4 0 0 0-.824-.239q-.48 0-.826.239-.345.237-.531.691-.185.455-.185 1.1-.001.646.183 1.107.186.46.531.703m1.352-.788q-.195.34-.524.34a.54.54 0 0 1-.38-.15q-.162-.15-.252-.454a2.8 2.8 0 0 1-.088-.758q.002-.672.198-1.01.195-.336.522-.336.218 0 .378.15.163.15.25.449.09.299.09.747.001.681-.194 1.022m-4.139 1.032a1.4 1.4 0 0 1-.827-.244 1.54 1.54 0 0 1-.532-.703q-.185-.46-.182-1.107 0-.645.184-1.1.187-.454.532-.691a1.4 1.4 0 0 1 .825-.239q.48 0 .825.239.345.24.533.693.187.453.184 1.098 0 .648-.186 1.109-.185.46-.53.703t-.826.242m0-.691q.33 0 .524-.34.196-.342.194-1.023 0-.45-.09-.747a.97.97 0 0 0-.249-.449.54.54 0 0 0-.379-.15q-.325 0-.522.337-.195.336-.197 1.009 0 .455.087.758.09.303.252.455.162.15.38.15m-2.404.604V6.067h-.759l-.945.618v.74l.874-.566h.023v3.151z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-numeric-2-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5m0 12A5.5 5.5 0 1 1 13.5 8 5.506 5.506 0 0 1 8 13.5"/><path fill="currentColor" d="m7.513 9.892.935-.95q.435-.41.82-.867c.168-.195.306-.415.409-.651.077-.19.116-.394.117-.599a1.46 1.46 0 0 0-.23-.81 1.57 1.57 0 0 0-.642-.56 2.14 2.14 0 0 0-.959-.205 2.1 2.1 0 0 0-.952.21 1.6 1.6 0 0 0-.65.59 1.7 1.7 0 0 0-.236.898h.935a1 1 0 0 1 .11-.48.77.77 0 0 1 .311-.31.96.96 0 0 1 .469-.11c.16-.004.319.03.464.1a.8.8 0 0 1 .32.284c.08.134.121.287.116.443 0 .147-.03.292-.09.425a1.8 1.8 0 0 1-.27.41q-.18.213-.45.485L6.156 10.04v.71h3.719v-.821H7.513z"/>'
    },
    {
      id: "cf-numeric-2-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M4.389 2.595A6.5 6.5 0 0 1 8 1.5 6.507 6.507 0 0 1 14.5 8 6.5 6.5 0 1 1 4.389 2.595m4.059 6.347-.935.95v.037h2.362v.821H6.156v-.71L8.04 8.195q.27-.272.45-.485.163-.186.27-.41c.06-.134.09-.279.09-.425a.8.8 0 0 0-.116-.443.8.8 0 0 0-.32-.285 1 1 0 0 0-.464-.1.96.96 0 0 0-.469.11.77.77 0 0 0-.311.312 1 1 0 0 0-.11.48h-.935a1.7 1.7 0 0 1 .236-.899 1.6 1.6 0 0 1 .65-.59c.296-.145.622-.217.952-.21.331-.007.66.064.959.205.262.124.484.317.643.56.154.241.234.523.229.81 0 .205-.04.408-.117.599-.103.236-.24.456-.41.651q-.385.457-.82.867" clip-rule="evenodd"/>'
    },
    {
      id: "cf-numeric-3-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7.99 1.488a6.5 6.5 0 1 0 6.5 6.5 6.507 6.507 0 0 0-6.5-6.5m0 12a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11"/><path fill="currentColor" d="M8.877 7.925v-.046c.296-.057.565-.21.765-.436a1.2 1.2 0 0 0 .29-.827c.002-.288-.08-.57-.237-.813a1.67 1.67 0 0 0-.669-.586A2.2 2.2 0 0 0 8.01 5a2.4 2.4 0 0 0-1.024.21 1.83 1.83 0 0 0-.729.581c-.182.251-.28.553-.282.863h1.018a.7.7 0 0 1 .148-.424.9.9 0 0 1 .368-.275c.157-.065.326-.098.496-.097.166-.003.33.032.478.103.13.064.24.163.317.287.077.13.115.28.11.432a.76.76 0 0 1-.13.445.86.86 0 0 1-.36.3 1.3 1.3 0 0 1-.536.105h-.516v.815h.516c.218-.006.433.033.635.114a.9.9 0 0 1 .403.316.8.8 0 0 1 .137.468.76.76 0 0 1-.134.453.9.9 0 0 1-.379.307 1.3 1.3 0 0 1-.556.11 1.4 1.4 0 0 1-.53-.098.93.93 0 0 1-.38-.272.7.7 0 0 1-.157-.412H5.851c.006.313.109.617.294.87.195.26.455.462.754.588A2.7 2.7 0 0 0 7.993 11c.382.007.762-.068 1.113-.22.304-.13.568-.339.765-.605.185-.255.283-.563.279-.878a1.32 1.32 0 0 0-.327-.916 1.5 1.5 0 0 0-.946-.456"/>'
    },
    {
      id: "cf-numeric-3-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M4.379 2.583A6.5 6.5 0 0 1 7.99 1.488a6.507 6.507 0 0 1 6.5 6.5A6.5 6.5 0 1 1 4.38 2.583M8.877 7.88v.045c.36.033.697.195.946.456.222.253.34.58.327.917.004.315-.094.623-.28.877a1.85 1.85 0 0 1-.764.606 2.7 2.7 0 0 1-1.113.22 2.7 2.7 0 0 1-1.094-.212 1.8 1.8 0 0 1-.754-.588 1.5 1.5 0 0 1-.294-.87h1.072a.7.7 0 0 0 .157.413.93.93 0 0 0 .38.272c.168.067.348.1.53.097.191.004.38-.034.556-.11a.9.9 0 0 0 .38-.306.76.76 0 0 0 .133-.454.8.8 0 0 0-.137-.468.9.9 0 0 0-.403-.316 1.6 1.6 0 0 0-.635-.114h-.516V7.53h.516a1.3 1.3 0 0 0 .535-.106.86.86 0 0 0 .36-.3.76.76 0 0 0 .13-.445.8.8 0 0 0-.11-.432.77.77 0 0 0-.316-.286 1.05 1.05 0 0 0-.478-.103 1.2 1.2 0 0 0-.496.097.9.9 0 0 0-.368.275.7.7 0 0 0-.148.423H5.975c.002-.31.1-.611.282-.862a1.83 1.83 0 0 1 .73-.582 2.4 2.4 0 0 1 1.023-.21c.351-.008.7.066 1.016.218.272.131.503.334.67.586.156.242.238.524.236.813a1.2 1.2 0 0 1-.29.827c-.2.225-.469.378-.765.436" clip-rule="evenodd"/>'
    },
    {
      id: "cf-numeric-add-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5m0 12A5.5 5.5 0 1 1 13.5 8 5.506 5.506 0 0 1 8 13.5"/><path fill="currentColor" d="m12.436 7.475-3.939.022-.022-3.938-1 .005.022 3.939-3.938.022.005 1 3.939-.022.022 3.938 1-.005-.022-3.939 3.938-.022z"/>'
    },
    {
      id: "cf-numeric-add-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M4.389 2.595A6.5 6.5 0 0 1 8 1.5 6.507 6.507 0 0 1 14.5 8 6.5 6.5 0 1 1 4.389 2.595m4.108 4.902 3.939-.022.005 1-3.938.022.022 3.939-1 .005-.022-3.938-3.939.022-.006-1 3.94-.022-.023-3.939 1-.006z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-numeric-minus-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12 7.5H4v1h8z"/><path fill="currentColor" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5m0 12A5.5 5.5 0 1 1 13.5 8 5.506 5.506 0 0 1 8 13.5"/>'
    },
    {
      id: "cf-numeric-minus-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M4.389 2.595A6.5 6.5 0 0 1 8 1.5 6.507 6.507 0 0 1 14.5 8 6.5 6.5 0 1 1 4.389 2.595M4 7.5h8v1H4z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-numeric-plus-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14 8.497V7.5H8.5l-.003-5.505-1 .005.003 5.5-5.497.003v1l5.5-.003v5.506l1-.006V8.5z"/>'
    },
    {
      id: "cf-numeric-subtract-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13 7.5H3v1h10z"/>'
    },
    {
      id: "cf-office-branch-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14 5h-3.5V2l-.5-.5H2l-.5.5v11.5l.5.5h12l.5-.5v-8zM2.5 2.5h7V13H7v-1.5H5V13H2.5zm11 10.5h-3V6h3z"/><path fill="currentColor" d="M4.5 3.5h-1v1h1zm2 0h-1v1h1zm-2 2h-1v1h1zm2 0h-1v1h1zm-2 2h-1v1h1zm2 0h-1v1h1zm2-4h-1v1h1zm0 2h-1v1h1zm0 2h-1v1h1zm-4 2h-1v1h1zm2 0h-1v1h1zm2 0h-1v1h1zm4-2.5h-1v1h1zm0 2h-1v1h1zm0 2h-1v1h1z"/>'
    },
    {
      id: "cf-office-branch-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M11 14h3l.5-.5v-8L14 5h-3zm1.25-7h1v1h-1zm1 2h-1v1h1zm-1 2h1v1h-1zM10 2l-.5-.5H2l-.5.5v11.5l.5.5h8zM4.25 3.5h-1v1h1zm1 0h1v1h-1zm-1 2h-1v1h1zm1 0h1v1h-1zm-1 2h-1v1h1zm1 0h1v1h-1zm3-4h-1v1h1zm-1 2h1v1h-1zm1 2h-1v1h1zm-5 2h1v1h-1zm3 0h-1v1h1zm1 0h1v1h-1zm-2.5 2h2V13h-2z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-office-headquarters-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.5 5V2l-.5-.5H4l-.5.5v3H2l-.5.5v8l.5.5h12l.5-.5v-8L14 5zm-10 1h1v7h-1zm2-3.5h7V13H9v-1.5H7V13H4.5zm9 10.5h-1V6h1z"/><path fill="currentColor" d="M6.5 3.5h-1v1h1zm2 0h-1v1h1zm-2 2h-1v1h1zm2 0h-1v1h1zm-2 2h-1v1h1zm2 0h-1v1h1zm2-4h-1v1h1zm0 2h-1v1h1zm0 2h-1v1h1zm-4 2h-1v1h1zm2 0h-1v1h1zm2 0h-1v1h1z"/>'
    },
    {
      id: "cf-office-headquarters-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m11.5 1.5.5.5v12H4V2l.5-.5zm-6 2h1v1h-1zm3 0h-1v1h1zm-3 2h1v1h-1zm3 0h-1v1h1zm-3 2h1v1h-1zm3 0h-1v1h1zm1-4h1v1h-1zm1 2h-1v1h1zm-1 2h1v1h-1zm-3 2h-1v1h1zm1 0h1v1h-1zm3 0h-1v1h1zm-1.5 2H7V13h2z" clip-rule="evenodd"/><path fill="currentColor" d="M12.75 14H14l.5-.5v-8L14 5h-1.25zm-9.5-9v9H2l-.5-.5v-8L2 5z"/>'
    },
    {
      id: "cf-ok-check-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M14.485 4.347 6.16 12.972 1.513 8.095l.724-.69 3.928 4.123 7.6-7.875z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-open-door-exit-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m2.945 2.535-.417.5v9.913l.417.5 6.07 1.04.585-.5V2l-.585-.5zM8.6 13.395l-5.072-.87V3.45L8.6 2.58zm4.393-10.867h-2.706v1h2.205v8.92h-2.205v1h2.705l.5-.5v-9.92z"/><path fill="currentColor" d="M7.15 8.738a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5"/>'
    },
    {
      id: "cf-open-door-exit-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m2.945 2.535-.418.5v9.913l.418.5 6.07 1.04.585-.5V2l-.585-.5zM7.15 8.737a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" clip-rule="evenodd"/><path fill="currentColor" d="M10.375 2.528h2.617l.5.5v9.92l-.5.5h-2.617z"/>'
    },
    {
      id: "cf-open-sidepanel-left-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13.6 3.333a.933.933 0 0 0-.933-.933H6.4v11.2h6.267a.933.933 0 0 0 .933-.933zM9.616 5.717 11.9 8l-2.283 2.283-.283.282L8.768 10l2-2-2-2 .565-.565zM2.4 12.667c0 .515.418.932.933.933H5.6V2.4H3.333a.933.933 0 0 0-.933.933zm12 0c0 .957-.776 1.733-1.733 1.733H3.333A1.734 1.734 0 0 1 1.6 12.667V3.333c0-.957.776-1.733 1.733-1.733h9.334c.957 0 1.733.776 1.733 1.733z"/>'
    },
    {
      id: "cf-open-sidepanel-right-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m7.232 6-.282.283L5.233 8 6.95 9.717l.282.283-.565.565-.283-.282-2-2L4.102 8l.282-.283 2-2 .283-.282z"/><path fill="currentColor" fill-rule="evenodd" d="M12.667 1.6c.957 0 1.733.776 1.733 1.733v9.334c0 .957-.776 1.733-1.733 1.733H3.333A1.734 1.734 0 0 1 1.6 12.667V3.333c0-.957.776-1.733 1.733-1.733zm-9.334.8a.933.933 0 0 0-.933.933v9.334c0 .515.418.932.933.933H9.6V2.4zM10.4 13.6h2.267a.933.933 0 0 0 .933-.933V3.333a.933.933 0 0 0-.933-.933H10.4z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-optimization-gear-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5m0 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/><path fill="currentColor" d="m12.475 8 1.86-1.798-1.62-2.804-2.435.697L9.627 1.5h-3.25L5.75 4.095 3.3 3.398 1.68 6.204l1.87 1.807-1.87 1.81 1.62 2.806 2.45-.7.637 2.572h3.25l.643-2.565 2.465.705 1.623-2.805zm-.225 3.453-2.182-.628-.67.463-.55 2.212h-1.68l-.55-2.2-.648-.475-2.195.628L2.935 10 4.57 8.42v-.81L2.935 6.027l.84-1.455 2.197.63.648-.517.547-2.185h1.68l.55 2.195.646.518 2.207-.64.84 1.454-1.637 1.583.024.808L13.1 10z"/>'
    },
    {
      id: "cf-optimization-gear-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M6.619 14.5H9.31l.656-2.596.081-.314.27.074 2.562.724 1.346-2.308-1.935-1.852-.231-.208.22-.208 1.924-1.842-1.346-2.308-2.545.72-.264.064-.078-.334L9.31 1.5H6.62l-.66 2.612-.093.33-.249-.059-2.545-.72L1.726 5.97l1.93 1.848.224.207-.224.208-1.93 1.847 1.346 2.309 2.558-.725.249-.068.083.303zM7.976 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" clip-rule="evenodd"/>'
    },
    {
      id: "cf-optimization-scale-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14.015 1.485H4.5l-.5.5v6.072H2.013l-.5.5V14l.5.5h5.43l.5-.5v-2h6.072l.5-.5V1.985zM6.943 13.5h-4.43V9.057H4V11.5l.5.5h2.45zm0-2.48H5V9.07h1.95zm6.572 0H7.943V8.815l3.557-3.6.023 1.25 1-.018-.056-2.925-2.924.055.017 1 1.19-.032-3.475 3.5H5v-5.56h8.515z"/>'
    },
    {
      id: "cf-optimization-scale-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M6.93 12.023v-2.95H3.979v2.45l.5.5z"/><path fill="currentColor" fill-rule="evenodd" d="m4.479 1.5-.5.5v6.073H2l-.5.5v5.43l.5.5h5.43l.5-.5v-1.98h6.072l.5-.5V2l-.5-.5zm2.45 10.523h1V8.831L11.5 5.25V6.5h1v-3h-3v1.058h1.247L7.273 8.073H3.979v1H2.5v4.43h4.43z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-optimization-web-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M6.394 3.495a.419.419 0 1 0 0-.838.419.419 0 0 0 0 .838m1.34 0a.419.419 0 1 0 0-.838.419.419 0 0 0 0 .838m1.341 0a.419.419 0 1 0 0-.838.419.419 0 0 0 0 .838"/><path fill="currentColor" d="M14.702 1.488H5.094l-.5.5v2.377H3.169l-.5.5v1.408H1.255l-.5.5v7.213l.5.5h9.685l.5-.5v-1.408h.914l.5-.5V10.47h1.848l.5-.5V1.988zm-.5 1v1.178H5.594V2.488zM4.594 5.365v.969h-.925v-.969zM2.669 7.273v.968h-.914v-.968zm7.77 6.213H1.756V9.241h.915v2.838l.5.5h7.27zm1.415-1.908H3.67V7.335h.925V9.97l.5.5h6.76zM5.594 9.47V4.666h8.608v4.803z"/><path fill="currentColor" d="M10.07 5.57h-.168L8.898 7.077v.167h.828v1.005h.167l1.005-1.507v-.168h-.828z"/>'
    },
    {
      id: "cf-optimization-web-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m5.5 1.486-.5.5v7.25l.5.5h8.75l.5-.5v-7.25l-.5-.5zM4 9.736v-5.75h-.5l-.5.5v7.25l.5.5h8.75l.5-.5v-1H5zm-2 2.25v-5.75h-.25l-.5.5v7.25l.5.5h8.75l.5-.5v-1H3zm11.75-8.5v-1.25H6v1.25zm-6.831-.24a.419.419 0 1 0 0-.839.419.419 0 0 0 0 .838m1.573-.071a.419.419 0 1 1-.465-.697.419.419 0 0 1 .465.697m1.108.07a.419.419 0 1 0 0-.838.419.419 0 0 0 0 .838M9.895 5.1h.167v1.004h.828v.168L9.886 7.779h-.168V6.775H8.89v-.168z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-orbit-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13.358 4.318a1.25 1.25 0 0 0-1.673-1.675 6.5 6.5 0 1 0 1.672 1.675M8 13.5a5.5 5.5 0 1 1 3.05-10.082q-.048.163-.05.332A1.25 1.25 0 0 0 12.25 5q.169-.002.33-.05A5.5 5.5 0 0 1 8 13.5"/><path fill="currentColor" d="M8 5.625a2.375 2.375 0 1 0 0 4.75 2.375 2.375 0 0 0 0-4.75m0 3.75a1.375 1.375 0 1 1 0-2.75 1.375 1.375 0 0 1 0 2.75"/>'
    },
    {
      id: "cf-organization-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M5.053 10.298H3.771V8.511h1.282zm3.077 0H6.848V8.511H8.13zM5.053 6.724H3.771V4.937h1.282zm3.077 0H6.848V4.937H8.13z"/><path fill="currentColor" fill-rule="evenodd" d="M10.68 2.128v4.595h3.602l.5.51v6.639l-.5.51H1.718l-.5-.51V2.128l.5-.51h8.462zM2.22 13.36h2.833v-1.02h1.795v1.02H9.68V2.64H2.22zm8.46 0h3.1V7.744h-3.1z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-overflow-2-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7.85 4.133a1.084 1.084 0 1 0 0-2.169 1.084 1.084 0 0 0 0 2.17m0 4.95a1.084 1.084 0 1 0 0-2.169 1.084 1.084 0 0 0 0 2.17m0 4.95a1.084 1.084 0 1 0 0-2.169 1.084 1.084 0 0 0 0 2.17"/>'
    },
    {
      id: "cf-overflow-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M6.5 3.086a1.584 1.584 0 1 1 3.169-.003 1.584 1.584 0 0 1-3.169.002m0 4.951a1.585 1.585 0 1 1 3.17 0 1.585 1.585 0 0 1-3.17 0m0 4.95a1.584 1.584 0 1 1 3.169.002 1.584 1.584 0 0 1-3.169-.002"/>'
    },
    {
      id: "cf-page-shield-outine",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.3 7.05c.225 0 .425-.2.425-.425S3.525 6.2 3.3 6.2s-.425.2-.425.425.2.425.425.425m1.35 0c.225 0 .425-.2.425-.425s-.2-.425-.425-.425-.425.2-.425.425.2.425.425.425m1.775-.425c0 .225-.2.425-.425.425-.25 0-.425-.2-.425-.425S5.775 6.2 6 6.2s.425.2.425.425"/><path fill="currentColor" fill-rule="evenodd" d="M8.876.918h.747l.286.32a6.83 6.83 0 0 0 3.823 1.911l.34.05.428.495v3.534c0 2.462-1.182 4.29-2.358 5.497-1.174 1.205-2.371 1.823-2.49 1.883l-.178.089h-.45l-.176-.09c-.122-.06-1.318-.68-2.49-1.882q-.106-.11-.212-.225H2l-.5-.5V5.5L2 5h2V3.693l.427-.495.34-.05A6.83 6.83 0 0 0 8.592 1.24zM5 5h5l.5.5V12l-.5.5H7.57a9.2 9.2 0 0 0 1.68 1.19 9.4 9.4 0 0 0 2.176-1.663c1.063-1.091 2.074-2.682 2.074-4.799V4.126a7.83 7.83 0 0 1-4.25-2.133A7.83 7.83 0 0 1 5 4.125zm4.5 6.5V8.25h-7v3.25zM2.5 6v1.25h7V6z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-page-shield-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M9.765 1.119H9.04l-.277.312c-1.01 1-2.31 1.65-3.71 1.853l-.332.049-.414.48V4.5H9.75l1 1V12l-1 1H7.03c.983.893 1.88 1.357 1.983 1.409l.171.086h.437l.172-.086c.116-.058 1.278-.658 2.418-1.828C13.353 11.41 14.5 9.635 14.5 7.245v-3.43l-.415-.481-.33-.049a6.63 6.63 0 0 1-3.712-1.854z"/><path fill="currentColor" fill-rule="evenodd" d="m1.5 5.75.5-.5h7.5l.5.5v6l-.5.5H2l-.5-.5zm1 .5v1.5H9v-1.5z" clip-rule="evenodd"/><path fill="currentColor" d="M3.393 7.44a.474.474 0 0 0 .455-.463.474.474 0 0 0-.455-.463.474.474 0 0 0-.455.463c0 .246.214.464.455.464M4.84 7.44a.474.474 0 0 0 .455-.463.474.474 0 0 0-.456-.463.474.474 0 0 0-.455.463c0 .246.214.464.455.464m1.902-.464a.474.474 0 0 1-.455.464.456.456 0 0 1-.456-.464c0-.245.215-.463.456-.463.24 0 .455.218.455.463"/>'
    },
    {
      id: "cf-payments-credit-card-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14.028 3.972H2l-.5.5V12l.5.5h12.028l.5-.5V4.472zm-.5 1v1.163H2.5V4.972zM2.5 11.5V7.135h11.028V11.5z"/><path fill="currentColor" d="M11.608 10.35a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5"/>'
    },
    {
      id: "cf-payments-credit-card-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14.001 3.973H2l-.499.5V6h13V4.473z"/><path fill="currentColor" fill-rule="evenodd" d="M14.5 7h-13v5l.499.5H14l.499-.5zm-2.914 3.35a.75.75 0 1 0-.001-1.499.75.75 0 0 0 .001 1.499" clip-rule="evenodd"/>'
    },
    {
      id: "cf-performance-1-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m4.105 6.665-.712-.702-.75.75a5.5 5.5 0 0 1 10.625-.25l.982-.29a6.5 6.5 0 0 0-12.627.577l-.775-.78-.71.695 2 2zm11.75 2.67-2-2-1.973 2 .713.702.75-.75a5.5 5.5 0 0 1-10.627.27l-.968.27a6.5 6.5 0 0 0 12.625-.56l.77.773z"/>'
    },
    {
      id: "cf-performance-acceleration-bolt-outline",
      viewBox: "0 0 16 16",
      content: '<g clip-path="url(#a)"><path fill="currentColor" d="M12.273 6.4H8.908L9.958.46l-.91-.363L3.31 8.75l.418.775h3.45l-.943 6 .915.345 5.545-8.703zm-4.678 6.928L8.25 9.11l-.5-.578H4.657l3.898-5.88-.735 4.16.5.588h3.05z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-performance-acceleration-bolt-solid",
      viewBox: "0 0 16 16",
      content: '<g clip-path="url(#a)"><path fill="currentColor" d="M12.273 6.4H8.908L9.958.46l-.91-.363L3.31 8.75l.418.775h3.45l-.943 6 .915.345 5.545-8.703z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-performance-acceleration-rocket-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M10.562 4.51a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75"/><path fill="currentColor" fill-rule="evenodd" d="M7.012 4.359c1.434-1.25 3.623-2.51 6.604-2.51l.5.5c0 2.98-1.26 5.17-2.51 6.604q-.149.171-.296.327l.226 2.407-.142.399-1.916 1.933-.848-.436.319-1.863-.495-.744-.234-.234-1.067.8-.654-.046-2.12-2.12-.047-.654.8-1.068-.143-.143-.744-.495-1.863.319-.436-.848L3.879 4.57l.399-.143 2.406.227q.157-.147.328-.296m-1.166 4.01 1.66 1.66-.606.454-1.508-1.508zm3.068 1.653-2.971-2.97q.105-.159.266-.374c.32-.426.806-.995 1.46-1.564a9.2 9.2 0 0 1 3.149-1.82q.106.074.238.183c.227.186.491.428.748.685.256.257.498.52.684.748q.11.133.184.238a9.2 9.2 0 0 1-1.82 3.15 10.4 10.4 0 0 1-1.938 1.725m.627.783.35.527.077.361-.085.497.636-.642-.131-1.392a11 11 0 0 1-.847.65m-4.13-4.73q-.145.194-.251.349l-.527-.35-.361-.077-.497.085.642-.636 1.392.131a11 11 0 0 0-.399.499m7.69-3.212q-.031.562-.125 1.08a13 13 0 0 0-.955-.955 9 9 0 0 1 1.08-.125m-8.058 8.058c-.4-.4-.88-.534-1.355-.388-.423.13-.76.457-1.003.788-.25.34-.448.746-.572 1.13-.119.368-.193.786-.124 1.131l.393.392c.345.07.763-.005 1.13-.123.384-.124.79-.321 1.131-.572.33-.244.658-.58.788-1.004.145-.474.012-.954-.388-1.354M3.205 12.9q-.106.033-.196.055.02-.09.055-.196c.094-.293.245-.6.425-.844.188-.255.365-.386.492-.425.075-.023.18-.035.354.139s.162.28.139.354c-.039.127-.17.304-.425.491a3 3 0 0 1-.844.426" clip-rule="evenodd"/>'
    },
    {
      id: "cf-performance-acceleration-rocket-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13.84 1.73a9.4 9.4 0 0 0-2.283.367l.071.058c.363.297.77.672 1.158 1.06.375.375.739.769 1.031 1.123a9.4 9.4 0 0 0 .364-2.268z"/><path fill="currentColor" fill-rule="evenodd" d="M10.557 2.599a2 2 0 0 0-.15-.092c-3.464 1.476-5.412 4.52-5.412 4.52l3.889 3.888c.01-.007 3.066-1.967 4.533-5.447l-.016-.025a6 6 0 0 0-.33-.438 15 15 0 0 0-.992-1.083c-.37-.37-.753-.722-1.084-.993a6 6 0 0 0-.438-.33m.001 1.86a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75" clip-rule="evenodd"/><path fill="currentColor" d="M4.996 8.442 4.2 9.505l.023.327L6.21 11.82l.327.023 1.063-.797zm4.927 3.694-.329-.494.101-.072c.161-.115.386-.284.653-.504.399-.328.897-.774 1.42-1.33l.23 2.446-.07.2-1.916 1.933-.424-.219zM4.34 6.215q-.044.06-.078.11l-.449-.299-1.96.336-.218-.424 1.933-1.916.2-.071 2.372.223c-.54.512-.975.997-1.296 1.388-.22.267-.388.492-.504.653m.199 5.156c-.325-.325-.693-.418-1.05-.309-.331.102-.611.366-.827.659-.22.297-.394.656-.503.995-.107.331-.164.68-.11.949l.196.196c.27.053.618-.003.95-.11.338-.11.696-.284.994-.503.293-.216.557-.496.659-.827.109-.357.016-.725-.31-1.05"/>'
    },
    {
      id: "cf-performance-arrow-up-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m8.95 2.903.01 1 5.215-.053-6.358 6.357L5.575 7.56l-.735-.032-4.798 4.78.705.71L5.162 8.62l2.243 2.648.735.032 6.743-6.742-.053 5.215 1 .01.07-6.95z"/>'
    },
    {
      id: "cf-performance-cloud-speed-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M14.968 7.542a2.93 2.93 0 0 0-2-.68 4.825 4.825 0 0 0-9.25-1.147 3.4 3.4 0 0 0-2.418.797A3.65 3.65 0 0 0 0 9.262a3.56 3.56 0 0 0 3.545 3.563h9.47a3 3 0 0 0 1.952-5.283m-1.953 4.283H3.547A2.56 2.56 0 0 1 1 9.27a2.65 2.65 0 0 1 .942-2A2.4 2.4 0 0 1 3.5 6.707q.24 0 .475.043l.435.077.127-.422A3.823 3.823 0 0 1 12 7.42l.025.58.565-.09a2.06 2.06 0 0 1 1.728.405A2.03 2.03 0 0 1 15 9.84a2 2 0 0 1-1.985 1.985"/><path d="M8.275 6.045h-.268L6.4 8.457v.268h1.325v1.608h.268L9.6 7.92v-.268H8.275z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-performance-cloud-speed-solid",
      viewBox: "0 0 16 16",
      content: '<g clip-path="url(#a)"><path fill="currentColor" fill-rule="evenodd" d="M12.968 6.863a2.93 2.93 0 0 1 2 .68 3 3 0 0 1-1.953 5.282h-9.47A3.56 3.56 0 0 1 0 9.263a3.65 3.65 0 0 1 1.3-2.75 3.4 3.4 0 0 1 2.417-.798 4.825 4.825 0 0 1 9.25 1.148M8.008 6h.293v1.78H9.75v.297L7.992 10.75h-.293V8.97H6.25v-.297z" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-performance-intelligent-routing-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M8 2.935A4.58 4.58 0 0 0 3.425 7.5c0 3.127 3.965 8.25 4.135 8.463h.797c.173-.213 4.218-5.323 4.218-8.463A4.58 4.58 0 0 0 8 2.935m-.035 11.88C6.967 13.445 4.442 9.75 4.442 7.5a3.557 3.557 0 0 1 7.115 0c0 2.25-2.58 5.948-3.592 7.315"/><path d="M8 5.693a2.02 2.02 0 1 0 0 4.04 2.02 2.02 0 0 0 0-4.04M8 8.75a1.04 1.04 0 1 1-.005-2.08A1.04 1.04 0 0 1 8 8.75M8.47 0h-.983v2.12h.983zm4.492 2.026-1.499 1.499.693.693 1.5-1.5zM15.53 7.2h-2.12v.982h2.12zm-12.938.043H.472v.982h2.12zm.415-5.186-.693.693 1.5 1.499.692-.693z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-performance-intelligent-routing-solid",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M8.47 0v2.119h-.982V0z"/><path fill-rule="evenodd" d="M7.968 3.012a4.35 4.35 0 0 0-3.11 1.327 4.6 4.6 0 0 0-1.29 3.199c0 3.12 3.854 8.245 4.019 8.45h.68l.01-.013c.27-.356 4.093-5.38 4.093-8.442a4.6 4.6 0 0 0-1.292-3.196 4.35 4.35 0 0 0-3.11-1.325m.058 6.139a1.56 1.56 0 1 0 0-3.12 1.56 1.56 0 0 0 0 3.12" clip-rule="evenodd"/><path d="m12.157 4.219 1.498-1.499-.694-.693-1.498 1.498zm3.371 3.962H13.41V7.2h2.12zM2.59 7.243H.473v.981H2.59zm.418-5.186 1.499 1.498-.694.694-1.498-1.498z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-performance-routing-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.754 10.304a.523.523 0 1 0 0 1.047.523.523 0 0 0 0-1.047"/><path fill="currentColor" d="M12.297 1.488a2.21 2.21 0 0 0-2.205 2.205c0 1.256 1.322 3.1 1.705 3.609V9.5H8.5v4H4.854c.514-.79 1.105-1.88 1.105-2.712a2.205 2.205 0 0 0-4.41 0c0 1.385 1.61 3.49 1.794 3.725l.785.004.014-.017H9.5v-4h3.297V7.26c.433-.569 1.705-2.346 1.705-3.567a2.21 2.21 0 0 0-2.205-2.205M3.741 13.363c-.564-.822-1.192-1.941-1.192-2.575a1.205 1.205 0 0 1 2.41 0c0 .631-.642 1.752-1.218 2.575m8.544-7.096c-.565-.823-1.193-1.942-1.193-2.575a1.205 1.205 0 0 1 2.41 0c0 .633-.642 1.753-1.218 2.575"/><path fill="currentColor" d="M12.298 3.21a.523.523 0 1 0-.001 1.046.523.523 0 0 0 0-1.047"/>'
    },
    {
      id: "cf-performance-routing-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M12.298 1.488a2.207 2.207 0 0 0-2.206 2.205c0 1.257 1.322 3.1 1.705 3.609V9.5H8.5v4H4.854c.514-.79 1.105-1.88 1.105-2.712a2.205 2.205 0 0 0-4.41 0c0 1.385 1.61 3.49 1.794 3.725l.785.004.014-.017H9.5v-4h3.297V7.26c.433-.569 1.706-2.345 1.706-3.567a2.21 2.21 0 0 0-2.206-2.205m-8.544 8.816a.523.523 0 1 0 0 1.047.523.523 0 0 0 0-1.047m8.253-7.007a.523.523 0 1 1 .58.87.523.523 0 0 1-.58-.87" clip-rule="evenodd"/>'
    },
    {
      id: "cf-performance-validator-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.459 4.756h6.978v-1H3.459zm6.978 2.017H3.459v-1h6.978zM3.459 8.756h3.488v-1H3.46zm9.318 2.036-.711-.703-1.628 1.645-.7-.732-.723.691 1.412 1.475z"/><path fill="currentColor" fill-rule="evenodd" d="m1.969 1.511-.5.5v11.496l.5.5h6.456a3.56 3.56 0 0 0 6.034-2.561 3.56 3.56 0 0 0-2.008-3.203V2.011l-.5-.5zm5.438 10.63q.09.453.291.866h-5.23V2.51h8.983v5.42a3.56 3.56 0 0 0-2.53.556 3.56 3.56 0 0 0-1.514 3.655m3.491-3.256a2.56 2.56 0 1 0 0 5.12 2.56 2.56 0 0 0 0-5.12" clip-rule="evenodd"/>'
    },
    {
      id: "cf-performance-validator-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m1.5 2 .5-.5h10l.5.5v6.28a3.81 3.81 0 0 0-3.177.492A3.81 3.81 0 0 0 8.235 14H2l-.5-.5zm8.94 2.677H3.463v-1h6.977zm-6.977 2.09h6.977v-1H3.463zm3.488 2.09H3.463v-1H6.95z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M12.5 9.07a3.06 3.06 0 0 0-2.76.325 3.06 3.06 0 1 0 2.76-.325m.818 2.216-2.35 2.376-1.412-1.474.723-.692.7.732 1.628-1.645z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-performance-wrench-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m10.829 10.34.105-.02q.188-.037.373-.091l.064-.022a4.5 4.5 0 0 0 .701-.285l.072-.036a5 5 0 0 0 .335-.198l.082-.057q.126-.086.248-.182l.089-.071q.154-.128.298-.27a4.43 4.43 0 0 0 .786-5.24l-.795-.118-2.16 2.157-.932-.934 2.156-2.159-.12-.795a4.459 4.459 0 0 0-6.266 5.495l-4.321 4.322v.707l1.912 1.913h.707l4.324-4.321q.173.064.348.112l.113.028a5 5 0 0 0 .614.11q.06.007.121.012.153.012.305.014l.047.002h.006q.193-.001.385-.02l.112-.011q.147-.016.291-.043M3.81 13.395 2.605 12.19l4.452-4.453-.148-.317a3.46 3.46 0 0 1 4.106-4.784L9.034 4.62v.706l1.64 1.64h.707l1.982-1.98a3.46 3.46 0 0 1-4.782 4.107l-.317-.148z"/>'
    },
    {
      id: "cf-performance-wrench-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.123 9.108a3.752 3.752 0 0 0 5.387-4.725l-2.573 2.574-1.97-1.97 2.546-2.546-.026-.01-.093-.037a3.751 3.751 0 0 0-4.51 5.475L6.8 7.785l-4.773 4.773 1.415 1.414L8.215 9.2z"/>'
    },
    {
      id: "cf-phishing-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M8.5 0v2.662c1.15.238 2 1.284 2 2.512 0 1.401-1.105 2.564-2.5 2.564S5.5 6.575 5.5 5.174v-.38h1v.38c0 .879.686 1.564 1.5 1.564s1.5-.685 1.5-1.564c0-.878-.686-1.563-1.5-1.563l-.5-.5V0z"/><path fill-rule="evenodd" d="m2.54 6.25-.5.5V14l.5.5h11l.5-.5V6.75l-.5-.5h-2.467l-.54 1h1.7l-4.157 3.723L3.861 7.25h1.647l-.542-1zm.5 6.66 2.897-2.493L3.04 7.86zm3.654-1.824L3.888 13.5h8.327l-1.044-.912a426 426 0 0 1-1.72-1.505l-1.039.931-.664.002zm6.346 1.808V7.869l-2.838 2.542c.615.541 1.12.982 1.626 1.423l.001.001c.387.338.774.675 1.211 1.059" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-pin-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m14.343 6.215-1.228 1.228h-.707l-.716-.716-2.295 2.821a2.59 2.59 0 0 1-.618 3.257l-.026-.032h-.645l-2.16-2.16-3.885 3.884-.707-.707 3.885-3.885-2.16-2.16-.033-.672q.078-.096.17-.187a2.59 2.59 0 0 1 3.087-.43L9.126 4.16l-.716-.716v-.707L9.638 1.51h.707l3.998 3.998zM6.167 7.593a1.586 1.586 0 0 0-2.013-.19L8.449 11.7a1.59 1.59 0 0 0-.14-1.962l-.05-.052zm.925-.489L8.75 8.76l2.232-2.744-1.144-1.144zm2.38-4.012 3.29 3.29.52-.52-3.29-3.291z"/>'
    },
    {
      id: "cf-pin-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m13.115 7.443 1.228-1.228v-.707L10.345 1.51h-.707L8.41 2.738v.707l.716.716-2.821 2.295a2.59 2.59 0 0 0-3.257.617l.032.672 2.16 2.16-3.884 3.885.707.707 3.885-3.885 2.16 2.16h.645l.026.033q.097-.079.187-.17c.837-.836.98-2.103.43-3.087l2.296-2.821.716.716z"/>'
    },
    {
      id: "cf-pipeline-sink-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M11.25 11.75v-1h-4v1zm0-2.75V8h-4v1zm-5.616 2.75v-1h-1v1zm0-2.75V8h-1v1zm5.616-4.25v1h-2v-1z"/><path fill="currentColor" d="m13 1.5.5.5v11.946l-.5.5H3l-.5-.5V6.5h1v6.945h9V2.5h-9V4h-1V2l.5-.5z"/><path fill="currentColor" d="M8.625 5.25 6.847 7.066 6.29 6.5l.706-.717H.75v-1h6.246l-.706-.717.557-.566z"/>'
    },
    {
      id: "cf-pipeline-stream-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.254 2.75c1.052 0 1.905 2.295 1.905 5.125S9.306 13 8.254 13c-.571 0-1.084-.678-1.433-1.75h1.077c.126.318.252.532.356.661.114-.141.255-.386.393-.756.247-.664.428-1.589.48-2.655H.762v-1h8.375c-.034-1.172-.224-2.19-.49-2.905-.138-.37-.279-.615-.393-.756-.114.141-.255.386-.393.756l-.055.155H6.745c.348-1.216.894-2 1.509-2"/><path fill="currentColor" d="M8.1 9.5a6 6 0 0 1-.132.532 4 4 0 0 1-.171.465v.003h-5.51v-1zM15.62 8l-1.807 1.816-.566-.566.717-.717h-2.806a14 14 0 0 0 .012-1h2.794l-.717-.717.566-.566zM4.571 6.5H3.556v-1H4.57zm3.324-1q.106.293.182.643.038.173.068.357H5.333v-1z"/>'
    },
    {
      id: "cf-platform-apps-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M11.55 1.5h-7.1A2.95 2.95 0 0 0 1.5 4.45v7.1a2.95 2.95 0 0 0 2.95 2.95h7.1a2.953 2.953 0 0 0 2.95-2.95v-7.1a2.953 2.953 0 0 0-2.95-2.95m1.95 10.05a1.95 1.95 0 0 1-1.95 1.95h-7.1a1.953 1.953 0 0 1-1.95-1.95v-7.1A1.953 1.953 0 0 1 4.45 2.5h7.1a1.95 1.95 0 0 1 1.95 1.95z"/><path fill="currentColor" d="M8.25 4.478h-.5L5.075 6.023l-.25.432v3.09l.25.432 2.675 1.546h.5l2.675-1.546.25-.432v-3.09l-.25-.433zm1.925 4.772L8 10.5 5.825 9.25v-2.5L8 5.5l2.175 1.25z"/>'
    },
    {
      id: "cf-platform-apps-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m8 10.5 2.175-1.25v-2.5L8 5.5 5.825 6.75v2.5z"/><path fill="currentColor" fill-rule="evenodd" d="M4.45 1.5h7.1a2.95 2.95 0 0 1 2.95 2.95v7.1a2.953 2.953 0 0 1-2.95 2.95h-7.1a2.953 2.953 0 0 1-2.95-2.95v-7.1A2.95 2.95 0 0 1 4.45 1.5m3.3 2.977h.5l2.675 1.545.25.433v3.09l-.25.432-2.675 1.546h-.5L5.075 9.977l-.25-.432v-3.09l.25-.433z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-podcast-microphone-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M8 11.75c-1.793 0-3.25-1.474-3.25-3.287V3.537C4.75 1.724 6.207.25 8 .25s3.25 1.474 3.25 3.287v4.926c0 1.813-1.457 3.287-3.25 3.287M8 1.256c-1.243 0-2.255 1.023-2.255 2.28v4.927c0 1.258 1.012 2.281 2.255 2.281s2.255-1.023 2.255-2.28V3.536c0-1.258-1.012-2.281-2.255-2.281M8.5 13h-1v2.798h1z"/><path d="M10.5 15h-5v1h5zM8 13.5a4.756 4.756 0 0 1-4.75-4.75h.973A3.78 3.78 0 0 0 8 12.527a3.78 3.78 0 0 0 3.777-3.777h.973A4.756 4.756 0 0 1 8 13.5M11 5H8v1h3zm0 2.25H8v1h3z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-podcast-microphone-solid",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M8.5 13h-1v2.798h1z"/><path d="M10.5 15h-5v1h5zM8 13.5a4.756 4.756 0 0 1-4.75-4.75h.973A3.78 3.78 0 0 0 8 12.527a3.78 3.78 0 0 0 3.777-3.777h.973A4.756 4.756 0 0 1 8 13.5"/><path d="M8 11.75c-1.655 0-3-1.41-3-3.144V3.894C5 2.16 6.345.75 8 .75s3 1.41 3 3.144V5H8.25v.75H11v1.5H8.25V8H11v.606c0 1.734-1.345 3.144-3 3.144"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-poison-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m10.282 11.028.415-.3a4.542 4.542 0 1 0-5.309 0l.415.3v2.302h4.479zm1 .511a5.542 5.542 0 1 0-6.48 0v2.791h6.48z" clip-rule="evenodd"/><path fill="currentColor" d="M6.71 11.781h1v2.05h-1zm1.75 0h1v2.05h-1zm-.793-4.575-3.021-.55v2.21h2.167zm3.772-.551-3.022.551.854 1.66h2.167z"/>'
    },
    {
      id: "cf-power-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7.725 10.498h.268L9.6 8.085v-.267H8.275V6.21h-.268L6.4 8.623v.267h1.325z"/><path fill="currentColor" d="M14.5 4.198h-13l-.5.5V12l.5.5h13l.5-.5V4.698zM14 11.5H2V5.198h12z"/>'
    },
    {
      id: "cf-power-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M1.5 4.198h13l.5.5V12l-.5.5h-13L1 12V4.698zM7.921 10.5h-.28V8.813H6.25v-.28L7.937 6h.28v1.687H9.61v.28z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-preemptive-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.036 3.714v4.637l2.7 2.808.722-.692-2.42-2.519V3.714z"/><path fill="currentColor" d="m13.661 12.044.081-.106a8 8 0 0 0 .204-.283q.016-.02.031-.043c.027-.038.048-.076.072-.115.053-.084.106-.165.156-.252q.074-.134.144-.268l.084-.163a6.5 6.5 0 0 0-1.266-7.409A6.5 6.5 0 0 0 8.57 1.5c-.072 0-.141.005-.213.007h-.063q-.245.01-.488.039l-.032.002A6.5 6.5 0 0 0 4.958 2.59 6.44 6.44 0 0 0 2.66 5.341c-.007 0 .007 0 0 0-.12.271-.228.549-.312.836l.98.29A5.5 5.5 0 0 1 5.353 3.58a5.486 5.486 0 0 1 6.676.158 5.5 5.5 0 0 1 1.594 2.102h.002c.29.68.446 1.413.446 2.159 0 .532-.08 1.054-.228 1.555q-.056.183-.122.362l-.029.081a7 7 0 0 1-.201.453 6 6 0 0 1-.144.27q-.048.083-.096.161c-.053.084-.103.168-.16.25l-.118.158a5 5 0 0 1-.45.534l-.027.029c-.064.067-.136.13-.206.191-.052.048-.103.099-.158.144a5 5 0 0 1-.386.297 6 6 0 0 1-.68.41l-.106.05a5.4 5.4 0 0 1-1.6.49q-.014 0-.027.004-.44.061-.889.05a5.48 5.48 0 0 1-5.193-4.205l.748.748.71-.7-1.965-1.994L.75 9.331l.707.702.74-.743a6.5 6.5 0 0 0 1.774 3.307c.63.63 1.382 1.12 2.206 1.445l.03.012q.215.084.438.153l.088.029q.19.056.381.098l.142.034.045.01c.091.019.182.028.274.043.237.038.476.067.72.076q.203.006.403 0h.039c.146-.002.29-.014.436-.026q.025.001.05-.005a7 7 0 0 0 .439-.06c.012 0 .024-.005.036-.005q.226-.039.45-.095h.007a6.5 6.5 0 0 0 2.21-1.019q.361-.264.682-.57l.012-.012a6 6 0 0 0 .355-.367q.13-.144.25-.294zM2.226 9.266s.002.012.005.017h-.02l.017-.017z"/>'
    },
    {
      id: "cf-premium-success-offering-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m8.25 1.508-.276.122-1.375 1.5.01.518 3.25 3.25h.531l3.25-3.25-.01-.54-1.626-1.5-.254-.1zm-.523 1.5.688-.75h.565l-.25.75zm1.793 0 .25-.75h.71l.25.75zm2 0-.25-.75h.333l.813.75zm-.003.75h.953l-1.457 1.457zm-.794 0-.598 1.729-.598-1.729zM9.237 5.215l-.504-1.457H7.78zm3.723 1.678.693.082.73.91v.638L11.018 12.5l-.38.185H5.933l-.433.33.29.455-.847.53-3.04-4.842.847-.533.398.625 1.7-1.432.322-.118 2.723.013 2.857.63.115.157zm-7.192 4.792h4.635l2.942-3.492-.17-.21-2.045 1.562v.408l-.5.5h-2.7v-1h2.2v-.22L7.723 8.7H5.348l-1.67 1.415 1.285 2.05.5-.377z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-premium-success-offering-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m8.475 3.008.472-1.5H8.25l-.276.122-1.099 1.198v.18zm.786 0 .472-1.5h.784l.472 1.5zm2.514 0-.472-1.5h.447l.254.1 1.371 1.265v.135zm1.6.75v.156L10.93 6.359l.843-2.6zm-4.898 0L9.32 6.36 6.875 3.914v-.156zm.789 0 .859 2.65.86-2.65zm4.649 3.575-.442-.083-2.038 1.398.077.102v1.265l-.375.375H7.939v-.75h2.823v-.61l-3.066-.905H5.29L3.263 9.409l-.401-.634h.001l-.015-.025L2 9.282l3.04 4.843.848-.53L5.473 13l.557-.44h4.705l.383-.185 3.257-4.113v-.387z"/>'
    },
    {
      id: "cf-price-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13m0-12a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11m1.873 6.053a1.3 1.3 0 0 0-.345-.43 2 2 0 0 0-.5-.295 3.4 3.4 0 0 0-.57-.186L8.29 7.6V6.148q.224.034.413.16a.7.7 0 0 1 .297.52h.908a1.36 1.36 0 0 0-.25-.78A1.6 1.6 0 0 0 9 5.515a2.1 2.1 0 0 0-.71-.18V4.75h-.512v.595q-.367.03-.703.178c-.272.114-.51.3-.685.537a1.34 1.34 0 0 0-.25.808 1.16 1.16 0 0 0 .36.882 2.35 2.35 0 0 0 1.018.5l.23.057v1.54a1.4 1.4 0 0 1-.266-.067.9.9 0 0 1-.385-.27.78.78 0 0 1-.167-.455H6c.004.314.097.62.27.883.174.25.416.445.698.562.247.1.508.158.774.175l.008.575h.54v-.575c.275-.013.545-.072.8-.175.273-.112.507-.3.675-.543.161-.24.243-.525.235-.815a1.3 1.3 0 0 0-.127-.59m-2.21-1.128a1.4 1.4 0 0 1-.288-.138.7.7 0 0 1-.205-.202.59.59 0 0 1 .037-.633.75.75 0 0 1 .325-.25 1 1 0 0 1 .238-.067v1.31a.3.3 0 0 1-.107-.02m1.25 2.1a.85.85 0 0 1-.366.25 1.3 1.3 0 0 1-.27.07V8.453q.17.052.316.112c.123.05.235.126.327.223a.5.5 0 0 1 .117.337.6.6 0 0 1-.117.4z"/>'
    },
    {
      id: "cf-price-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13m1.873-5.947a1.3 1.3 0 0 0-.345-.43 2 2 0 0 0-.5-.295 3.4 3.4 0 0 0-.57-.186L8.29 7.6V6.148q.224.034.413.16a.7.7 0 0 1 .297.52h.908a1.36 1.36 0 0 0-.25-.78A1.6 1.6 0 0 0 9 5.515a2.1 2.1 0 0 0-.71-.18V4.75h-.512v.595q-.367.03-.703.178c-.272.114-.51.3-.685.537a1.34 1.34 0 0 0-.25.808 1.16 1.16 0 0 0 .36.882 2.35 2.35 0 0 0 1.018.5l.23.057v1.54a1.4 1.4 0 0 1-.266-.067.9.9 0 0 1-.385-.27.78.78 0 0 1-.167-.455H6c.004.314.097.62.27.883.174.25.416.445.698.562.247.1.508.158.774.175l.008.575h.54v-.575c.275-.013.545-.072.8-.175.273-.112.507-.3.675-.543.161-.24.243-.525.235-.815a1.3 1.3 0 0 0-.127-.59m-2.21-1.128a1.4 1.4 0 0 1-.288-.138.7.7 0 0 1-.205-.202.59.59 0 0 1 .037-.633.75.75 0 0 1 .325-.25 1 1 0 0 1 .238-.067v1.31a.3.3 0 0 1-.107-.02m1.25 2.1a.85.85 0 0 1-.366.25 1.3 1.3 0 0 1-.27.07V8.453q.17.052.316.112c.123.05.235.126.327.223a.5.5 0 0 1 .117.337.6.6 0 0 1-.117.4z"/>'
    },
    {
      id: "cf-printer-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13.5 3.5h-2V1.988l-.5-.5H5l-.5.5V3.5h-2L2 4v6l.5.5h1.944v2l.146.354 2.5 2.5.354.146h3.5l.5-.5v-4.5H13.5l.5-.5V4zm-8-1.012h5V3.5h-5zM5.65 12.5h1.793v1.793zm4.793 2h-2V12l-.5-.5h-2.5v-3h5zM13 9.5h-1.556V8l-.5-.5h-6l-.5.5v1.5H3v-5h10z"/>'
    },
    {
      id: "cf-printer-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m5 1.75.5-.5h5l.5.5v1H5zm-2.5 2-.5.5v5.5l.5.5h1.65V8l.5-.5h6.75l.5.5v2.25h1.6l.5-.5v-5.5l-.5-.5z"/><path fill="currentColor" d="M8.4 15.5h2l.5-.5V8.5H5.15v3.75H7.9l.5.5z"/><path fill="currentColor" d="M7.4 15.293 5.357 13.25H7.4z"/>'
    },
    {
      id: "cf-process-flow-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m2 10.5-.5.5v2.75l.5.5h2.75l.5-.5V11l-.5-.5zm2.25 2.75H2.5V11.5h1.75zM7.928 1.498l-2.25 2.25 2.25 2.25 2.25-2.25zM3.76 9.057h8.335v1.14h.982V8.073h-4.65v-1.6h-1v1.6H2.776v2.126h.985zM12.5 10.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4m0 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>'
    },
    {
      id: "cf-process-flow-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M5.75 3.748 8 1.498l2.25 2.25L8 5.998zm6.028 7.547a1.75 1.75 0 1 1 1.944 2.91 1.75 1.75 0 0 1-1.944-2.91M2 11l-.5.5v2.25l.5.5h2.25l.5-.5V11.5l-.5-.5zm5.5-2.75V6.5h1v1.75h4.75v2.375h-1V9.25h-8.5v1.375h-1V8.25z"/>'
    },
    {
      id: "cf-process-stack-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14.503 2.477h-9.34v1h9.34zm-3.66 1.675h-9.34v1h9.34zm0 3.348h-9.34v1h9.34zm0 3.348h-9.34v1h9.34zm3.66-5.023h-9.34v1h9.34zm0 3.35h-9.34v1h9.34zm0 3.348h-9.34v1h9.34z"/>'
    },
    {
      id: "cf-pull-request-merged-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.25 6.295a1.75 1.75 0 0 0-1.677 1.255l-.638.006c-2.065.03-4.015.057-4.986-.9-.414-.407-.64-.99-.688-1.775a1.75 1.75 0 1 0-1.011.003v6.234a1.75 1.75 0 1 0 1 0v-3.75c1.07 1.05 2.763 1.196 4.632 1.196q.526-.001 1.067-.01l.625-.006a1.75 1.75 0 1 0 1.676-2.253M3 3.205a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0m1.5 9.59a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m7.75-4a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5"/>'
    },
    {
      id: "cf-pull-request-merged-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.25 6.295a1.75 1.75 0 0 0-1.677 1.255l-.638.006c-2.065.03-4.015.057-4.986-.9-.414-.407-.64-.99-.688-1.775a1.75 1.75 0 1 0-1.011.003v6.234a1.75 1.75 0 1 0 1 0v-3.75c1.07 1.05 2.763 1.196 4.632 1.196q.526-.001 1.067-.01l.625-.006a1.75 1.75 0 1 0 1.676-2.253"/>'
    },
    {
      id: "cf-pull-request-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M5.5 3.205a1.75 1.75 0 1 0-2.25 1.677v6.236a1.75 1.75 0 1 0 1 0V4.882A1.75 1.75 0 0 0 5.5 3.205m-2.5 0a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0m1.5 9.59a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m8.25-1.676V5.454a2.503 2.503 0 0 0-2.5-2.5H8.275l.875-.907-.72-.694-2.033 2.11 2.11 2.033.694-.72-.851-.822h1.9a1.5 1.5 0 0 1 1.5 1.5v5.663a1.75 1.75 0 1 0 1 0m-.5 2.426a.75.75 0 1 1 0-1.501.75.75 0 0 1 0 1.5"/>'
    },
    {
      id: "cf-pull-request-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.75 5.456v5.663a1.75 1.75 0 1 1-1 0V5.456a1.5 1.5 0 0 0-1.5-1.5h-1.9l.851.82-.694.72-2.11-2.032 2.033-2.11.72.694-.875.907h1.975a2.503 2.503 0 0 1 2.5 2.5M5.24 2.286a1.75 1.75 0 0 1-.99 2.596v6.237a1.75 1.75 0 1 1-1 0V4.882a1.75 1.75 0 1 1 1.99-2.596"/>'
    },
    {
      id: "cf-queues-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M12.25 4.5h-8.5v-1h8.5zm-2.75 6v-5h1v5zm-4 0v-5h1v5zm2 0v-5h1v5zm-4.207-3-.897-.896.708-.708L5.207 8l-2.103 2.104-.708-.708.897-.896H1.5v-1zm9.5 0-.897-.896.708-.708L14.707 8l-2.104 2.104-.707-.708.897-.896H11v-1zm-.543 5h-8.5v-1h8.5z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-r2-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M12.116 2.57c-.973-.326-2.384-.546-3.991-.546s-3.018.22-3.99.545c-.492.164-.814.337-.992.478a1 1 0 0 0-.082.072c.02.069.078.158.225.268.21.158.548.313 1.025.448.947.266 2.292.409 3.814.409s2.867-.143 3.814-.41c.477-.134.816-.29 1.025-.447.147-.11.204-.2.225-.268a1 1 0 0 0-.082-.072c-.178-.141-.5-.314-.991-.478M4.02 4.818a5 5 0 0 1-.97-.369v1.757c0 .079.039.206.25.377.214.173.556.347 1.03.5.944.306 2.284.49 3.795.49 1.51 0 2.85-.184 3.794-.49.474-.153.817-.327 1.03-.5.212-.171.251-.298.251-.377V4.45a5 5 0 0 1-.97.369c-1.08.304-2.534.45-4.105.45s-3.026-.146-4.105-.45m10.23-1.77C14.25 1.917 11.508 1 8.125 1S2 1.917 2 3.049v9.902C2 14.083 4.742 15 8.125 15s6.125-.917 6.125-2.049zM13.2 7.654a5.3 5.3 0 0 1-.95.403c-1.083.35-2.543.54-4.125.54S5.083 8.408 4 8.058a5.3 5.3 0 0 1-.95-.403v1.712c0 .078.039.205.25.376.214.173.556.348 1.03.501.944.306 2.284.489 3.795.489 1.51 0 2.85-.183 3.794-.489.474-.153.817-.328 1.03-.5.212-.172.251-.299.251-.377zM4 11.215a5.3 5.3 0 0 1-.95-.403v2.058q.026.028.093.083c.178.141.5.314.992.478.972.325 2.383.545 3.99.545s3.018-.22 3.99-.545c.492-.164.814-.337.992-.478a1 1 0 0 0 .093-.083v-2.058a5.3 5.3 0 0 1-.95.403c-1.083.351-2.543.541-4.125.541s-3.042-.19-4.125-.54m.625-4.666a.52.52 0 0 0 .525-.512.52.52 0 0 0-.525-.513.52.52 0 0 0-.525.513.52.52 0 0 0 .525.512m.525 2.73a.52.52 0 0 1-.525.513.52.52 0 0 1-.525-.513c0-.282.235-.512.525-.512s.525.23.525.512m-.525 3.671a.52.52 0 0 0 .525-.512.52.52 0 0 0-.525-.512c-.29 0-.525.23-.525.512s.235.512.525.512" clip-rule="evenodd"/>'
    },
    {
      id: "cf-radar-dish-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M13.02 9.178c-.301-.818-.85-1.758-1.62-2.697l.764-.763c1.277 1.519 2.031 3.125 2.104 4.395.068.708-.08 1.298-.473 1.69a1.5 1.5 0 0 1-.172.148c-.606.56-1.64 1.011-2.884 1.098.176.482.268.996.268 1.52l-.5.5H2.62l-.5-.5a4.44 4.44 0 0 1 2.693-4.085C2.037 7.512 2.502 3.7 3.759 2.368c.338-.358.812-.555 1.377-.604.907-.154 2.148.202 3.454.969.596.332 1.202.745 1.795 1.23l-.743.742a11.5 11.5 0 0 0-1.547-1.103 7.8 7.8 0 0 0-1.5-.653c-.547-.166-.978-.215-1.31-.194-.187.037-.307.105-.371.17-.17.17-.37.728.068 1.919.406 1.104 1.264 2.432 2.51 3.677s2.573 2.103 3.677 2.509c1.031.379 1.588.28 1.83.137l.008-.01.008-.007c.156-.167.282-.479.257-.968a4.2 4.2 0 0 0-.252-1.003m-7.392 2.076c1.346 1.125 2.747 1.645 4.018 1.776h-.002c.163.325.274.676.327 1.039H3.157a3.44 3.44 0 0 1 2.472-2.815m5.342.766c-1.303-.446-2.81-1.418-4.186-2.793-1.555-1.553-2.593-3.274-2.94-4.679a5.4 5.4 0 0 0-.063 1.373c.104 1.338.686 2.877 2.087 4.207 1.809 1.716 3.69 2.076 5.101 1.89" clip-rule="evenodd"/><path fill="currentColor" d="M13.328 3.353a.802.802 0 0 1-.865 1.005L9.264 7.556l-.707-.707 3.199-3.199a.802.802 0 0 1 1.572-.297"/>'
    },
    {
      id: "cf-ransom-ddos-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M7.37 1.988H4.749v-1H7.37zM9.213 3.32H4.748v-1h4.464zm-6.84 1.333H13.25v-1H2.373zm9.17 1.334H7.249v-1h4.295zm-7.92 0h2.296v-1H3.623zm6.73 1.333h-5.73v-1h5.73zm-.264.333a4.3 4.3 0 0 0-1.546 1H5.98v-1zM8.244 8.988H1.25v1h6.392a4.3 4.3 0 0 1 .602-1m-.729 1.333H3.83v1h3.479q.043-.511.207-1m-.223 1.333H2.608v1H7.4a4.3 4.3 0 0 1-.109-1m.2 1.334h-2.98v1h3.445a4.3 4.3 0 0 1-.464-1m-2.87-4.334H1.25v-1h3.373zm5.002.076a3.56 3.56 0 0 1 1.978-.6 3.564 3.564 0 0 1 3.56 3.56 3.56 3.56 0 1 1-5.538-2.96m1.978.4a2.56 2.56 0 1 0 0 5.12 2.56 2.56 0 0 0 0-5.12" clip-rule="evenodd"/><path fill="currentColor" d="M12.651 12.01a.7.7 0 0 0-.194-.247 1.2 1.2 0 0 0-.277-.172 2 2 0 0 0-.317-.113l-.096-.024v-.838a.6.6 0 0 1 .232.093.4.4 0 0 1 .168.299h.512a.8.8 0 0 0-.138-.442.9.9 0 0 0-.372-.308 1.2 1.2 0 0 0-.4-.103l-.304-.003q-.206.017-.396.102a.93.93 0 0 0-.387.312.8.8 0 0 0-.14.464.67.67 0 0 0 .216.517c.166.143.363.243.575.29l.128.035v.883a.6.6 0 0 1-.15-.04.5.5 0 0 1-.216-.154.5.5 0 0 1-.095-.26h-.523a.96.96 0 0 0 .154.508.87.87 0 0 0 .393.316q.208.086.432.101v.088h.303v-.088c.157-.007.313-.043.458-.106a.87.87 0 0 0 .38-.311.8.8 0 0 0 .13-.447.76.76 0 0 0-.076-.351m-1.247-.649a.7.7 0 0 1-.162-.082.4.4 0 0 1-.116-.114.3.3 0 0 1-.041-.164.33.33 0 0 1 .064-.201.4.4 0 0 1 .182-.14.6.6 0 0 1 .134-.04v.757zm.71 1.222a.47.47 0 0 1-.217.14 1 1 0 0 1-.151.04v-.805q.09.028.177.064.106.044.184.13c.046.054.07.123.069.195a.37.37 0 0 1-.063.236"/><path fill="currentColor" fill-rule="evenodd" d="M11.79 9.919v3.542h-.375V9.919z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-ransomware-attack-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m1.5 2 .5-.5h8.75l.5.5v3.75h-1V2.5H2.5v9.75h4.564v1H2l-.5-.5z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M9.26 4.75H3.5v-1h5.76zm-.01 2H3.5v-1h5.75zm-3.5 2H3.5v-1h2.25zm.75 0 .5-.5h7.25l.5.5V14l-.5.5H7l-.5-.5zm1 .5v4.25h6.25V9.25z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M8.983 5.73a2.502 2.502 0 0 1 4.267 1.766V8.75l-.5.5h-4l-.5-.5V7.496c0-.662.264-1.297.733-1.765M10.75 6a1.5 1.5 0 0 0-1.5 1.496v.754h3v-.754A1.495 1.495 0 0 0 10.75 6" clip-rule="evenodd"/><path fill="currentColor" d="M11.674 11.696a.7.7 0 0 0-.194-.247 1.2 1.2 0 0 0-.277-.173 2 2 0 0 0-.318-.112l-.095-.025v-.837a.6.6 0 0 1 .232.093.4.4 0 0 1 .168.298h.512a.8.8 0 0 0-.138-.442.9.9 0 0 0-.372-.307 1.2 1.2 0 0 0-.4-.104v-.09h-.304v.088a1.2 1.2 0 0 0-.396.101.93.93 0 0 0-.387.312.8.8 0 0 0-.14.464.68.68 0 0 0 .216.517c.165.144.363.243.575.29l.127.035v.884a.6.6 0 0 1-.149-.04.5.5 0 0 1-.216-.155.5.5 0 0 1-.095-.26H9.5c.002.18.056.357.153.508a.87.87 0 0 0 .394.316q.208.086.432.101V13h.303v-.088a1.3 1.3 0 0 0 .458-.107.87.87 0 0 0 .38-.311.8.8 0 0 0 .13-.447.8.8 0 0 0-.076-.35m-1.247-.65a.7.7 0 0 1-.162-.081.4.4 0 0 1-.117-.115.3.3 0 0 1-.04-.164.33.33 0 0 1 .064-.2.4.4 0 0 1 .182-.14.6.6 0 0 1 .134-.04v.756zm.709 1.222a.47.47 0 0 1-.216.14 1 1 0 0 1-.151.04v-.805q.09.027.177.064.106.044.184.13a.3.3 0 0 1 .069.195.37.37 0 0 1-.063.236"/><path fill="currentColor" fill-rule="evenodd" d="M10.813 9.604v3.542h-.376V9.604z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-ransomware-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M8.225 8.01v.315q.277.023.531.138c.198.09.369.231.496.41.119.173.183.378.184.59h-.683a.54.54 0 0 0-.224-.398.74.74 0 0 0-.304-.123v1.117l.122.03q.218.058.424.151.199.09.368.23a.99.99 0 0 1 .36.798 1.1 1.1 0 0 1-.172.596c-.127.185-.303.33-.507.415q-.286.124-.595.14v.313h-.45v-.314a1.8 1.8 0 0 1-.546-.133 1.16 1.16 0 0 1-.524-.421 1.27 1.27 0 0 1-.205-.678h.697a.64.64 0 0 0 .127.348.64.64 0 0 0 .288.206 1 1 0 0 0 .163.047v-1.183l-.134-.037a1.74 1.74 0 0 1-.766-.386.88.88 0 0 1-.289-.69 1.05 1.05 0 0 1 .188-.618 1.24 1.24 0 0 1 .516-.415q.233-.105.485-.132V8.01zm0 2.73v1.056q.086-.016.168-.047a.63.63 0 0 0 .288-.186.5.5 0 0 0 .084-.315.4.4 0 0 0-.092-.26.7.7 0 0 0-.245-.173 3 3 0 0 0-.203-.075m-.45-.796v-.989A1 1 0 0 0 7.638 9a.53.53 0 0 0-.242.185.44.44 0 0 0-.086.268.4.4 0 0 0 .054.219.5.5 0 0 0 .156.153q.101.068.216.109z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M6.776 1.497a3.198 3.198 0 0 1 4.422 2.955V6.25h1.552l.5.5V14l-.5.5h-9.5l-.5-.5V6.75l.5-.5h1.552V4.452a3.2 3.2 0 0 1 1.974-2.955m3.422 2.955V6.25H5.802V4.452a2.198 2.198 0 1 1 4.396 0M3.75 7.25v6.25h8.5V7.25z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-refactor-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M9.35 11.325h3.517a3.011 3.011 0 0 0 1.95-5.282 2.9 2.9 0 0 0-2-.68 4.822 4.822 0 0 0-9.244-1.148 3.4 3.4 0 0 0-2.423.798A3.65 3.65 0 0 0-.15 7.77c.001.542.126 1.07.358 1.55l.142-.247v-.01l.374-.638.156-.27a3 3 0 0 1-.03-.385 2.64 2.64 0 0 1 .943-1.992c.434-.37.985-.572 1.555-.57q.24 0 .477.042l.434.077.13-.422A3.821 3.821 0 0 1 11.86 5.92l.016.57.564-.09a2.07 2.07 0 0 1 1.728.404 2.03 2.03 0 0 1 .682 1.535 1.987 1.987 0 0 1-1.985 1.986H9.35z"/><path fill-rule="evenodd" d="m1.357 8.626 3.25-1.813h.487l3.25 1.813.256.436v3.625l-.256.437-3.25 1.813h-.487l-3.25-1.813-.257-.437V9.062zm2.993 2.48L2.1 9.851v2.543l2.25 1.255zM2.683 9.031 4.85 10.24l2.168-1.21L4.85 7.822zm4.917.82-2.25 1.255v2.543l2.25-1.255z" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-refresh-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7.998 2c1.532 0 3.005.586 4.118 1.638l-.318-2.088.989-.15.557 3.664-3.665.557-.15-.988 1.882-.286a4.982 4.982 0 1 0 1.46 2.528l.975-.225A6 6 0 1 1 7.998 2"/>'
    },
    {
      id: "cf-regional-services-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M1.959 1.506h10l.5.5v5.695h-1V2.506h-9v10.5h6.94l.685 1H1.959l-.5-.5v-11.5z"/><path fill="currentColor" d="M10.459 3.756h-7v1h7zm1.977 7.06a.523.523 0 1 1-1.045 0 .523.523 0 0 1 1.045 0"/><path fill="currentColor" fill-rule="evenodd" d="M11.501 14.506h.788c.195-.238 1.83-2.342 1.83-3.725a2.205 2.205 0 1 0-4.41 0c0 1.385 1.61 3.49 1.792 3.725m-.44-4.582a1.205 1.205 0 0 1 2.058.852c0 .63-.643 1.752-1.218 2.575-.565-.825-1.192-1.943-1.192-2.575 0-.32.127-.626.353-.852" clip-rule="evenodd"/><path fill="currentColor" d="M3.459 5.756h7v1h-7zm3.75 2h-3.75v1h3.75z"/>'
    },
    {
      id: "cf-regional-services-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M2.012 1.5h10.226l.512.52v6.828a2.43 2.43 0 0 0-1.683.735 2.53 2.53 0 0 0-.716 1.739v.012c0 .465.144.932.297 1.31.16.396.364.784.558 1.115.166.284.33.54.465.738H9.936v.003H2.012l-.512-.52V2.02zM3.75 4h6.977v1H3.75zm6.977 2.09H3.75v1h6.977zM3.75 8.18h3.49v1H3.75z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M12.803 9.598c-.451 0-.882.184-1.2.51a1.78 1.78 0 0 0-.502 1.223v.003c0 .323.103.685.242 1.03.141.35.327.704.51 1.017a13 13 0 0 0 .718 1.094l.013.017.003.004.002.002.398.002.001-.002.004-.004.012-.017a9 9 0 0 0 .218-.301c.14-.2.327-.479.514-.793a8 8 0 0 0 .52-1.017c.143-.346.249-.708.249-1.032v-.003a1.78 1.78 0 0 0-.503-1.224 1.68 1.68 0 0 0-1.2-.51m-.015 4.75.199.152zm.015-2.503a.523.523 0 1 0 0-1.046.523.523 0 0 0 0 1.046" clip-rule="evenodd"/>'
    },
    {
      id: "cf-reliability-dns-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14 10.793h-.85v-3.43H8.46v-2.18h.84l.5-.5V2l-.5-.5H6.605l-.5.5v2.683l.5.5h.855v2.18H2.85v3.43H2l-.5.5V14l.5.5h2.698l.5-.5v-2.707l-.5-.5H3.85v-2.43h3.61v2.43h-.855l-.5.5V14l.5.5H9.3l.5-.5v-2.707l-.5-.5h-.84v-2.43h3.692v2.43h-.847l-.5.5V14l.5.5H14l.5-.5v-2.707zM7.105 2.5H8.8v1.695H7.105zm-2.908 11H2.5v-1.707h1.695zm4.603 0H7.105v-1.707H8.8zm4.7 0h-1.695v-1.707H13.5z"/>'
    },
    {
      id: "cf-reliability-dns-resolver-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M11.698 11.565a5.66 5.66 0 0 1-3.773 1.72l1-1-.705-.707L6 13.8l2.213 2.212.705-.707-1.018-1.02A6.685 6.685 0 0 0 14 9.588h-1.057a5.65 5.65 0 0 1-1.245 1.977m-7.355-7.15a5.6 5.6 0 0 1 3.75-1.707l-.985.984.7.7L9.97 2.226l.03-.03L7.832.028 7.802 0l-.7.7 1.013 1.013A6.625 6.625 0 0 0 2 6.586h1.033a5.6 5.6 0 0 1 1.31-2.172M6.068 7.79l-.5-.5H2l-.5.5v3.565l.5.5h3.568l.5-.5zm-1 3.065H2.5V8.29h2.568zM14 4.13h-3.568l-.5.5v3.565l.5.5H14l.5-.5V4.63zm-.5 3.565h-2.568V5.13H13.5z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-reliability-dns-resolver-solid",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M8.092 2.708a5.6 5.6 0 0 0-3.75 1.707 5.6 5.6 0 0 0-1.31 2.173H2a6.625 6.625 0 0 1 6.115-4.875L7.102.7l.7-.7.03.028L10 2.194l-.03.03-2.163 2.168-.7-.7zm-.167 10.577a5.66 5.66 0 0 0 3.773-1.72 5.65 5.65 0 0 0 1.245-1.977H14a6.685 6.685 0 0 1-6.1 4.697l1.018 1.02-.705.707L6 13.8l2.22-2.222.705.707zM2 7.75l-.5.5v3l.5.5h3l.5-.5v-3l-.5-.5zm8.5-3 .5-.5h3l.5.5v3l-.5.5h-3l-.5-.5z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-reliability-dns-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m6.375 2 .5-.5h2.25l.5.5v2.25l-.5.5h-.627v2.574h4.887v3.926H14l.5.5V14l-.5.5h-2.25l-.5-.5v-2.25l.5-.5h.637V8.324H8.498v2.926h.635l.5.5V14l-.5.5h-2.25l-.5-.5v-2.25l.5-.5h.615V8.324H3.635v2.926h.615l.5.5V14l-.5.5H2l-.5-.5v-2.25l.5-.5h.635V7.324h4.863V4.75h-.623l-.5-.5z"/>'
    },
    {
      id: "cf-reliability-load-balancer-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13.095 10.148 15.25 8l-2.148-2.147-.707.707.933.94h-3.41a2.65 2.65 0 0 0-.443-1.04L11.842 4l.023 1.328 1-.018-.055-3.03-3.035.058.017 1 1.33-.023L8.75 5.768A2.662 2.662 0 0 0 4.677 7.5h-.585a1.585 1.585 0 1 0 0 1h.585a2.662 2.662 0 0 0 4.073 1.733l2.367 2.454-1.33-.022-.017 1 3.035.058.055-3.036-1-.017-.018 1.33-2.367-2.46c.22-.31.372-.665.442-1.04h3.41l-.94.94zm-10.5-1.563a.585.585 0 1 1 .41-.172.6.6 0 0 1-.413.172zM5.63 8a1.67 1.67 0 1 1 3.34 0 1.67 1.67 0 0 1-3.34 0"/>'
    },
    {
      id: "cf-reliability-load-balancer-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m12.56 2.28.056 3.035-1 .018-.024-1.329-2.39 2.479c.24.289.414.636.496 1.017h3.63l-.94-.94.707-.707L15.242 8l-2.147 2.146-.707-.707.94-.94h-3.63a2.4 2.4 0 0 1-.492 1.014l2.386 2.48.024-1.327 1 .019-.056 3.035-3.035-.056.018-1 1.33.025-2.456-2.554A2.376 2.376 0 0 1 5.053 8.5h-.89a1.25 1.25 0 1 1 0-1h.89a2.376 2.376 0 0 1 3.359-1.638l2.459-2.55-1.328.024-.018-1z"/>'
    },
    {
      id: "cf-reliability-timer-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.5 2.5h.965v-1h-2.93v1H7.5v.75a5.625 5.625 0 1 0 1 0zM8 13.45A4.625 4.625 0 1 1 8 4.2a4.625 4.625 0 0 1 0 9.25"/><path fill="currentColor" d="M10.166 5.863 5.129 10.87l.705.71 5.037-5.008z"/>'
    },
    {
      id: "cf-reliability-timer-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M8.5 2.5v.75a5.625 5.625 0 1 1-1 0V2.5h-.965v-1h2.93v1zm-3.371 8.37 5.037-5.007.705.709-5.037 5.007z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-remote-work-from-home-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m5.94 4.027 2.92 2.53h1.51L6.264 3h-.649L1.5 6.568l.648.746zM3.585 7.632v2.902H5.07v.987H3.09l-.494-.494V7.633z"/><path fill="currentColor" fill-rule="evenodd" d="m6.726 7.676-.495.494v4.092H4.896l.482.988h8.64l.482-.988h-1.335V8.17l-.494-.494zm.494 4.586V8.664h4.957v3.598z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-replatform-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M9.231 11.325h3.636a3.011 3.011 0 0 0 1.95-5.282 2.9 2.9 0 0 0-2-.68 4.822 4.822 0 0 0-9.244-1.148 3.4 3.4 0 0 0-2.423.798A3.65 3.65 0 0 0-.15 7.77c.001.59.149 1.165.423 1.675l.644-1.098A2.6 2.6 0 0 1 .85 7.77a2.64 2.64 0 0 1 .943-1.992c.434-.37.985-.572 1.555-.57q.24 0 .477.042l.434.077.13-.422A3.821 3.821 0 0 1 11.86 5.92l.016.57.564-.09a2.07 2.07 0 0 1 1.728.404 2.03 2.03 0 0 1 .682 1.535 1.987 1.987 0 0 1-1.985 1.986h-2.723l-.98.933zm-4.263-.068h-.009z"/><path fill-rule="evenodd" d="M3.704 7.25h2.28l.387 1.476 1.445-.393 1.161 1.915-1.097 1.01 1.11 1.021-1.162 1.915-1.463-.398-.382 1.454H3.704l-.38-1.45-1.452.395L.71 12.28l1.104-1.016L.71 10.248l1.162-1.915 1.445.393zm.772 1-.316 1.2-.524.4-1.3-.354-.346.57.94.867v.662l-.94.866.346.571 1.291-.351.531.36.318 1.209h.736l.318-1.21.545-.359 1.289.35.346-.57-.937-.863-.02-.662.945-.87-.346-.57-1.3.353-.525-.4-.315-1.199z" clip-rule="evenodd"/><path d="M5.6 11.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-reusable-components-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M4.956 9.5a1.5 1.5 0 1 0-1.5 1.5v1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5v-1a1.5 1.5 0 0 0 1.5-1.5m9.032-3a1.5 1.5 0 1 0-1.5 1.5v1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5V8a1.5 1.5 0 0 0 1.5-1.5M7.833.029 10 2.196l-.03.029-2.168 2.167-.7-.7.985-.985a5.63 5.63 0 0 0-4.954 3.602 3.2 3.2 0 0 0-1.177.48L2 6.59a6.625 6.625 0 0 1 6.115-4.877L7.103.7l.7-.7zM14 9.587a6.68 6.68 0 0 1-6.1 4.699l1.02 1.02-.707.706L6 13.8l.03-.03 2.183-2.184.706.706-.992.993a5.67 5.67 0 0 0 4.978-3.601c.45-.092.865-.277 1.225-.533z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-revert-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M9.44 5.94H6.27l.588-.586-.706-.708-1.81 1.804 1.812 1.784.701-.712-.59-.581h3.176a1.5 1.5 0 1 1 0 3h-4v1h4a2.5 2.5 0 0 0 0-5"/><path fill="currentColor" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5m0 12A5.5 5.5 0 1 1 13.5 8 5.506 5.506 0 0 1 8 13.5"/>'
    },
    {
      id: "cf-revert-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M4.389 2.595A6.5 6.5 0 0 1 8 1.5 6.507 6.507 0 0 1 14.5 8 6.5 6.5 0 1 1 4.389 2.595m1.88 3.346h3.172a2.5 2.5 0 0 1 0 5h-4v-1h4a1.5 1.5 0 0 0 0-3H6.266l.59.58-.702.713L4.342 6.45l1.81-1.804.706.708z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-router-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.525 6.525 0 0 0 8 1.5m0 12A5.5 5.5 0 1 1 13.5 8 5.525 5.525 0 0 1 8 13.5"/><path fill="currentColor" d="M7.35 8.7v-.025h-.025l-.35-.35-1.7 1.75v-1h-.8v2.5h2.5v-.8h-1L7.7 9.05zm1.625-.95L10.7 5.975v1h.8v-2.5H9v.8h1L8.25 7.05zm.8 1.35h.975v-.8h-2.5v2.5h.8v-1l2.025 1.975.7-.7zM6.9 6.225l-1.975-2-.7.7L6.2 6.95h-1v.8h2.5v-2.5h-.8z"/>'
    },
    {
      id: "cf-router-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.525 6.525 0 0 0 8 1.5m-.65 7.2v-.025h-.025l-.35-.35-1.7 1.75v-1h-.8v2.5h2.5v-.8h-1L7.7 9.05zm3.35-2.725L8.975 7.75l-.725-.7L10 5.275H9v-.8h2.5v2.5h-.8zM9.775 9.1h.975v-.8h-2.5v2.5h.8v-1l2.025 1.975.7-.7zm-4.85-4.875 1.975 2V5.25h.8v2.5H5.2v-.8h1L4.225 4.925z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-satellite-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m16 5.9-.5-.5H11l-.5.5v.625h-.65V4l-.5-.5H6.525l-.5.5v2.525H5.5V5.9L5 5.4H.5l-.5.5v2.25l.5.5H5l.5-.5v-.625h.525V9.4l.5.5h.9v.9h1v-.9h.925l.5-.5V7.525h.65v.6l.5.5h4.5l.5-.5zM1 6.4h1.25v1.25H1zm2.25 1.25V6.4H4.5v1.25zm5.6 1.25H7.025V4.5H8.85zm2.65-2.5h1.25v1.225H11.5zm2.25 1.225V6.4H15v1.225zm-5 3.525a1.15 1.15 0 0 1-1.625 0l-.7.725c.4.394.938.618 1.5.625a2.25 2.25 0 0 0 1.525-.625zm-3.025 1.425-.725.7a4.2 4.2 0 0 0 2.925 1.2 4.1 4.1 0 0 0 2.925-1.2l-.7-.7a3.126 3.126 0 0 1-4.425 0"/>'
    },
    {
      id: "cf-satellite-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m15.5 5.65.5.5v1.725l-.5.5h-1.75V5.65zm-2.75 0H11l-.5.5v.375h-.65V4l-.5-.5H6.525l-.5.5v2.525H5.5V6.15l-.5-.5H3.25V8.4H5l.5-.5v-.375h.525V9.4l.5.5h.9v.9h1v-.9h.925l.5-.5V7.525h.65v.35l.5.5h1.75zM2.25 8.4V5.65H.5l-.5.5V7.9l.5.5zm6.5 2.75a1.15 1.15 0 0 1-1.625 0l-.7.725c.4.394.938.618 1.5.625a2.25 2.25 0 0 0 1.525-.625zM5 13.275l.725-.7a3.125 3.125 0 0 0 4.425 0l.7.7a4.1 4.1 0 0 1-2.925 1.2A4.2 4.2 0 0 1 5 13.275"/>'
    },
    {
      id: "cf-search-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14.84 13.378 9.75 8.75a4.578 4.578 0 1 0-.673.738l5.088 4.627zm-8.775-3.75A3.565 3.565 0 1 1 9.63 6.053a3.57 3.57 0 0 1-3.565 3.565z"/>'
    },
    {
      id: "cf-secrets-store-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14.105 1.5H2.137l-.52.533v2.275H1.25v2.5h.367v2.5H1.25v2.5h.367v2.147l.52.553h11.968l.52-.52V2.033zm-.52 11.968H2.658V2.532h10.927z"/><path fill="currentColor" d="M8.122 8.265a.8.8 0 0 0-.481.158.73.73 0 0 0-.273.407.7.7 0 0 0 .053.48c.075.15.2.27.356.344l-.2 1.191h1.089l-.2-1.191a.75.75 0 0 0 .356-.344.7.7 0 0 0 .053-.48.73.73 0 0 0-.273-.407.8.8 0 0 0-.48-.158"/><path fill="currentColor" fill-rule="evenodd" d="M6.074 6.881V5.825a2.048 2.048 0 0 1 4.095 0v1.056h.797l.5.5v4.348l-.5.5H5.277l-.5-.5V7.381l.5-.5zm1-1.056a1.048 1.048 0 0 1 2.095 0v1.056H7.074zM5.777 11.23V7.881h4.69v3.348z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-security-bots-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13.496 5.288H8.5V3.843a1 1 0 1 0-1 0v1.445H2.504l-.5.5v7.694l.5.5h10.992l.5-.5V5.788zm-.5 7.694H3.004V6.288h9.992z"/><path fill="currentColor" d="M5.67 9.515a.831.831 0 1 0-.003-1.663.831.831 0 0 0 .002 1.663m4.661 0a.831.831 0 1 0-.001-1.663.831.831 0 0 0 .002 1.663m-.751 1.068H6.42v1h3.16z"/>'
    },
    {
      id: "cf-security-bots-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M8.5 5.288h4.996l.5.5v7.694l-.5.5H2.504l-.5-.5V5.788l.5-.5H7.5V3.843a1 1 0 1 1 1 0zm-2 3.395a.831.831 0 1 1-1.663.001.831.831 0 0 1 1.662-.001m3.83.832a.831.831 0 1 0-.001-1.663.831.831 0 0 0 .002 1.663m-3.91 1.068h3.16v1H6.42z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-security-crawler-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5m0 1a5.5 5.5 0 0 1 4.555 2.42h-9.11A5.5 5.5 0 0 1 8 2.5M13.5 8a5.5 5.5 0 0 1-.321 1.85h-2.454a1.986 1.986 0 0 0-.002-3.93h2.367c.271.66.41 1.366.41 2.08m-11 0c0-.713.139-1.42.41-2.08h2.41a1.986 1.986 0 0 0-.002 3.93H2.821A5.5 5.5 0 0 1 2.5 8m3.109-1.103a.988.988 0 1 1 0 1.977.988.988 0 0 1 0-1.977m1.988.988a1.99 1.99 0 0 0-1.7-1.965h4.252a1.986 1.986 0 0 0-.002 3.93h-4.25a1.99 1.99 0 0 0 1.7-1.965m2.839-.988a.988.988 0 1 1 0 1.977.988.988 0 0 1 0-1.977M8 13.5a5.5 5.5 0 0 1-4.703-2.65h9.405A5.5 5.5 0 0 1 8 13.5"/><path fill="currentColor" d="M9.878 11.502H6.12v1h3.757z"/>'
    },
    {
      id: "cf-security-crawler-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M6.121 12.502h3.757v-1H6.12zm-.513-5.605a.988.988 0 1 0 0 1.976.988.988 0 0 0 0-1.976m3.839.988a.988.988 0 1 1 1.977 0 .988.988 0 0 1-1.977 0"/><path fill="currentColor" fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0M8 2.5c-1.931 0-3.63.995-4.611 2.5h9.221A5.5 5.5 0 0 0 8 2.5m0 11a5.5 5.5 0 0 1-4.765-2.75h9.529A5.5 5.5 0 0 1 8 13.5M3.62 7.885a1.988 1.988 0 1 1 3.977 0 1.988 1.988 0 0 1-3.977 0m6.815-1.988a1.988 1.988 0 1 0 0 3.976 1.988 1.988 0 0 0 0-3.976" clip-rule="evenodd"/>'
    },
    {
      id: "cf-security-fingerprint-privacy-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m12.043 3.403.537-.843C10.153 1 6.18 1 3.725 2.56l.525.845c2.168-1.367 5.658-1.367 7.793-.002"/><path fill="currentColor" d="M8.13 2.893a7.67 7.67 0 0 0-6.25 3.32l.843.537A6.75 6.75 0 0 1 8.13 3.893c3 0 4.92 1.865 5.52 2.85l.85-.518c-.695-1.152-2.927-3.332-6.37-3.332"/><path fill="currentColor" d="M8.133 4.438c-1.978 0-3.643.857-4.685 2.415a6.29 6.29 0 0 0-.533 5.825l.925-.38a5.28 5.28 0 0 1 .438-4.89 4.48 4.48 0 0 1 3.855-1.97c3.477 0 4.415 2.852 4.482 3.952.078 1.29-.66 1.442-.8 1.457l-.08.016c-.37.08-.755.02-1.082-.168-.283-.197-.458-.56-.518-1.075-.162-1.412-1.25-2-2.175-1.945-1.018.06-2.112.883-2.112 2.552 0 2.408 2.21 4.345 4.25 4.75l.2-.98c-1.443-.282-3.45-1.747-3.45-3.77 0-1.027.587-1.52 1.17-1.552.457-.027 1.03.235 1.124 1.06q.146 1.237.95 1.788a2.5 2.5 0 0 0 1.843.317c.65-.072 1.79-.68 1.678-2.5-.083-1.372-1.23-4.902-5.48-4.902"/><path fill="currentColor" d="M5.345 9.04c.405-1.29 1.348-2.057 2.538-2.057 2.797 0 3.015 2.41 3.015 3.147h1c0-1.912-1.05-4.147-4.015-4.147-1.628 0-2.965 1.06-3.5 2.75a5.31 5.31 0 0 0 2.065 5.894l.562-.827a4.3 4.3 0 0 1-1.665-4.76"/><path fill="currentColor" d="M9.313 11.78A2.75 2.75 0 0 1 8.5 9.698h-1A3.77 3.77 0 0 0 8.623 12.5a4.62 4.62 0 0 0 3.19 1.16h.272l-.048-1c-1.09.05-2.084-.27-2.725-.88"/>'
    },
    {
      id: "cf-security-lock-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.39 6.903h-1.193V4.705a3.198 3.198 0 0 0-6.395 0v2.198H3.61l-.5.5V14l.5.5h8.78l.5-.5V7.403zM5.802 4.705a2.197 2.197 0 1 1 4.396 0v2.198H5.802zM11.89 13.5H4.11V7.903h7.78z"/><path fill="currentColor" d="M8 8.95a.965.965 0 0 0-.43 1.83l-.25 1.57h1.36l-.25-1.57A.965.965 0 0 0 8 8.95"/>'
    },
    {
      id: "cf-security-lock-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M11.197 6.903h1.193l.5.5V14l-.5.5H3.61l-.5-.5V7.403l.5-.5h1.192V4.705a3.198 3.198 0 0 1 6.395 0zM6.446 3.15a2.2 2.2 0 0 0-.644 1.554v2.198h4.395V4.705a2.198 2.198 0 0 0-3.751-1.554m.953 6.007A.97.97 0 0 1 8 8.95a.965.965 0 0 1 .43 1.83l.25 1.57H7.32l.25-1.57a.966.966 0 0 1-.17-1.622" clip-rule="evenodd"/>'
    },
    {
      id: "cf-security-scraping-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m11.021 8.9.117-.332c-.015-.131-.4-3.245-4.18-7.025H6.25L1.542 6.25v.707c3.78 3.782 6.894 4.166 7.025 4.18l.333-.116 3.494 3.494h.707l1.414-1.414v-.707zm-2.567 1.202c-.716-.157-3.057-.845-5.847-3.502L6.6 2.607c2.657 2.79 3.345 5.13 3.502 5.847l-.117.117-1.414 1.414zm1.885-.47 1.768 1.768-.707.707-1.768-1.768zm2.409 3.823-.641-.641.707-.707.64.64z"/>'
    },
    {
      id: "cf-security-scraping-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M10.516 8.096v-.005l-.002-.01-.004-.033-.019-.114a6 6 0 0 0-.09-.404 9 9 0 0 0-.515-1.43C9.351 4.906 8.373 3.283 6.6 1.51h-.707L1.49 5.911v.707C3.264 8.392 4.887 9.37 6.082 9.905a9 9 0 0 0 1.429.514 6 6 0 0 0 .55.114l.011.002h.007l.408-.143 1.887-1.887.144-.409m.337 1.344L9.44 10.856l1.894 1.895 1.414-1.415zm2.271 5.1-1.084-1.083 1.415-1.414 1.084 1.084v.353l-1.061 1.06z"/>'
    },
    {
      id: "cf-security-shield-protection-1-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.603 1.5H3.397l-.5.5v4.22c0 5.388 4.367 7.933 4.865 8.208h.487c.5-.276 4.86-2.82 4.86-8.208V2zM3.897 6.22V2.5H7.5v10.57c-1.25-.915-3.602-3.12-3.602-6.85m8.205 0c0 3.73-2.34 5.935-3.6 6.85V2.5h3.6z"/>'
    },
    {
      id: "cf-security-shield-protection-1-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.5 14.488h.371c1.506-1.073 4.23-3.7 4.23-8.098V2.006l-.5-.518h-4.1zm-1 0v-13H3.397l-.5.518V6.39c0 4.398 2.729 7.025 4.235 8.098z"/>'
    },
    {
      id: "cf-security-shield-protection-2-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m12.853 3.445-.34-.048A6.98 6.98 0 0 1 8.67 1.5l-.297-.335h-.75l-.29.335A6.98 6.98 0 0 1 3.5 3.397l-.34.048-.43.5v3.53c-.012 4.888 4.67 7.275 4.868 7.38l.177.09h.45l.178-.09c.197-.098 4.88-2.5 4.88-7.38V3.94zm-.57 4.03c0 4.088-3.783 6.208-4.283 6.463-.485-.25-4.282-2.373-4.282-6.463v-3.1A8.04 8.04 0 0 0 8 2.25a8.03 8.03 0 0 0 4.283 2.125z"/><path fill="currentColor" d="m5.863 7.577-.725.693 2.092 2.183 3.625-3.668-.71-.703L7.24 9.02z"/>'
    },
    {
      id: "cf-security-shield-protection-2-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m12.513 3.398.34.047.43.495v3.535c0 4.88-4.683 7.283-4.88 7.38l-.178.09h-.45l-.177-.09-.012-.006c-.326-.171-4.868-2.56-4.856-7.374v-3.53l.43-.5.34-.047A6.98 6.98 0 0 0 7.333 1.5l.29-.335h.75l.297.335a6.98 6.98 0 0 0 3.842 1.898M5.136 8.27l.725-.692L7.24 9.02l2.905-2.937.71.702-3.625 3.668z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-security-unlock-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.614 9.919a.968.968 0 1 0-1.397.862l-.25 1.569h1.36l-.25-1.569a.96.96 0 0 0 .537-.862"/><path fill="currentColor" fill-rule="evenodd" d="M11.312 1.508a3.2 3.2 0 0 0-3.198 3.198v2.05H3.257l-.5.5v6.732l.5.5h8.78l.5-.5V7.255l-.5-.5H9.113v-2.05a2.198 2.198 0 0 1 4.396 0v.796h1v-.795a3.2 3.2 0 0 0-3.198-3.198M3.757 7.755v5.733h7.78V7.755z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-security-unlock-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M12.048 6.996H9.105V4.705a2.197 2.197 0 1 1 4.395 0v1.044h1V4.705a3.198 3.198 0 0 0-6.395 0v2.29H3.268l-.5.5V14l.5.5h8.78l.5-.5V7.496zM7.057 9.158a.97.97 0 0 1 .6-.208.965.965 0 0 1 .43 1.83l.25 1.57h-1.36l.25-1.57a.965.965 0 0 1-.17-1.622" clip-rule="evenodd"/>'
    },
    {
      id: "cf-security-waf-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m14.5 8.485.5-.5v-3l-.5-.5h-2.1V2l-.5-.5H1.5L1 2v3l.5.5h2.098v2H1.5L1 8v3l.5.5h2.098V14l.5.5H14.5l.5-.5v-3l-.5-.5h-2.1v-2zm-.5-1H9.797V5.5H14zM11.4 2.5v2H7.2v-2zM2 2.5h4.2v2H2zm2.598 3h4.2v2h-4.2zM2 8.485h4.2v2H2zM4.598 13.5v-2h4.2v2zm9.402 0H9.797v-2H14zm-2.597-3H7.2v-2h4.2z"/>'
    },
    {
      id: "cf-security-waf-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M1.5 1.75h4.75v2H1.5zm0 6.75h4.75v2.25H1.5zm7-3.5H3.75v2.25H8.5zm-4.75 7H8.5v2.25H3.75zm8.5-10.25H7.5v2h4.75zM7.5 8.5h4.75v2.25H7.5zm7-3.5H9.75v2.25h4.75zm-4.75 7h4.75v2.25H9.75z"/>'
    },
    {
      id: "cf-server-1-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.375 3.515a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045"/><path fill="currentColor" d="M14 1H2l-.5.5v3.21l.5.5h12l.5-.5V1.5zm-.5 3.21h-11V2h11zm-1.125 4.198a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045"/><path fill="currentColor" d="m2 5.893-.5.5v3.212l.5.5h12l.5-.5V6.392l-.5-.5zm11.5 3.212h-11V6.892h11zm-1.125 4.198a.522.522 0 1 0 0-1.044.522.522 0 0 0 0 1.043"/><path fill="currentColor" d="m2 10.785-.5.5V14.5l.5.5h12l.5-.5v-3.215l-.5-.5zM13.5 14h-11v-2.215h11z"/>'
    },
    {
      id: "cf-server-1-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M14.003.998H2l-.5.5V4.71l.5.5h12.003l.5-.5V1.498zm-1.628 2.517a.523.523 0 1 1 0-1.045.523.523 0 0 1 0 1.045m1.628 2.378H2l-.5.5v3.212l.5.5h12.003l.5-.5V6.393zM12.375 8.41a.525.525 0 1 1-.005-1.05.525.525 0 0 1 .005 1.05M2 10.785h12.003l.5.5v3.213l-.5.5H2l-.5-.5v-3.213zm10.085 2.43a.523.523 0 1 0 .58-.87.523.523 0 0 0-.58.87" clip-rule="evenodd"/>'
    },
    {
      id: "cf-server-2-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.375 5.963a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045"/><path fill="currentColor" d="M14 3.448H2l-.5.5V7.16l.5.5h12l.5-.5V3.948zm-.5 3.212h-11V4.448h11zm-1.125 4.198a.523.523 0 1 0 0-1.046.523.523 0 0 0 0 1.046"/><path fill="currentColor" d="m2 8.34-.5.5v3.213l.5.5h12l.5-.5V8.84l-.5-.5zm11.5 3.213h-11V9.34h11z"/>'
    },
    {
      id: "cf-server-2-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M1.999 3.448H14l.5.5V7.16l-.5.5H2l-.5-.5V3.948zm10.083 2.43a.525.525 0 1 0 .58-.876.525.525 0 0 0-.58.876M1.999 8.34H14l.5.5v3.213l-.5.5H2l-.5-.5V8.84zm10.085 2.43a.523.523 0 1 0 .58-.87.523.523 0 0 0-.58.87" clip-rule="evenodd"/>'
    },
    {
      id: "cf-server-3-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m13.618 2.815-1.606-1.222-.302-.093H4.472l-.297.097L2.523 2.82l-.206.403v9.5l.138.345 1.208 1.277.365.157h7.915l.342-.135 1.37-1.277.16-.367v-9.5zm-.803 6.353-1.117 1.235H4.615L3.318 9.25V7.39l.917.813h7.905l.675-.75zm-8.58-4.03h7.895l.685-.7v1.53l-1.117 1.234H4.615l-1.297-1.15v-1.73zM4.637 2.5h6.906l1.017.777-.85.87H4.615l-1-.89zm7.113 11h-7.5l-.925-.977v-1.93l.917.81h7.898l.675-.75V12.5z"/><path fill="currentColor" d="M11.11 6.663a.523.523 0 1 0 0-1.046.523.523 0 0 0 0 1.045m0 2.088a.523.523 0 1 0 0 1.045.523.523 0 0 0 0-1.045m0 3.128a.522.522 0 1 0 0 1.043.522.522 0 0 0 0-1.043"/>'
    },
    {
      id: "cf-server-3-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M2.318 3.237v1.902l2.314 2.314h7.08l2.102-2.102V3.448l-1.688 1.688H4.218zm9.27 2.88a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="m13.814 6.765-1.688 1.688H4.218l-1.9-1.9v2.035l2.314 2.314h7.08l2.102-2.103zm-2.726 3.232a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M2.318 12.711v-2.71l1.9 1.9h7.908l1.688-1.687v2.497l-.159.366-1.371 1.278-.341.135H4.027l-.364-.157-1.208-1.279zm9.27.166a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" clip-rule="evenodd"/><path fill="currentColor" d="m4.174 1.588-1.202.888 1.66 1.66h7.08l1.574-1.574-1.273-.97-.303-.102H4.472z"/>'
    },
    {
      id: "cf-server-database-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M6.29 11.865a.57.57 0 1 0 0 1.139.57.57 0 0 0 0-1.139m3.988-9.322H5.72v1h4.558zm0 1.872H5.72v1h4.558zm0 1.873H5.72v1h4.558zm.002 5.647H7.545v1h2.735z"/><path d="M12 0H4l-.5.5v15l.5.5h8l.5-.5V.5zm-.5 15h-7V1h7z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-server-database-solid",
      viewBox: "0 0 16 16",
      content: '<g clip-path="url(#a)"><path fill="currentColor" fill-rule="evenodd" d="M4 0h8l.5.5v15l-.5.5H4l-.5-.5V.5zm1.973 11.961a.57.57 0 1 1 .633.947.57.57 0 0 1-.633-.947m4.305-9.419H5.72v1h4.558zM5.72 4.415h4.558v1H5.72zm4.558 1.872H5.72v1h4.558zm-2.733 5.648h2.735v1H7.545z" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-server-origin-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.898 5.443a.525.525 0 1 1-1.05 0 .525.525 0 0 1 1.05 0M14.5 7.16V3.948l-.5-.5H2l-.5.5V7.16l.5.5h12zm-12-2.712h11V6.66h-11zm9.875 5.365a.523.523 0 1 0 0 1.045.523.523 0 0 0 0-1.045m-2.85 1.75H2.5V9.34h7l.5-1H2l-.5.5v3.213l.5.5h8.028zm5.055-1.25a2.205 2.205 0 0 0-4.41 0c0 1.384 1.61 3.5 1.793 3.724h.785c.187-.247 1.832-2.355 1.832-3.742zm-1 0c0 .632-.643 1.75-1.22 2.574-.562-.822-1.19-1.94-1.19-2.575a1.205 1.205 0 0 1 2.41 0"/>'
    },
    {
      id: "cf-server-origin-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M14.5 3.948V7.16l-.5.5H2l-.5-.5V3.948l.5-.5h12zm-1.691 1.786a.525.525 0 1 0-.873-.584.525.525 0 0 0 .873.584" clip-rule="evenodd"/><path fill="currentColor" d="M10.657 11.646c.151.376.344.746.53 1.066H2l-.5-.5V9l.5-.5h9.162a2.52 2.52 0 0 0-.803 1.823v.012c0 .466.145.933.297 1.311"/><path fill="currentColor" fill-rule="evenodd" d="M12.812 8.6c-.451 0-.882.183-1.2.509a1.78 1.78 0 0 0-.503 1.223v.003c0 .324.104.685.243 1.03.141.35.327.704.51 1.018a13 13 0 0 0 .718 1.093l.013.017.003.005.001.002.399.002V13.5l.004-.005.013-.017.048-.064q.063-.086.17-.237c.14-.2.327-.478.514-.792a8 8 0 0 0 .52-1.018c.143-.345.249-.707.249-1.032v-.003a1.78 1.78 0 0 0-.503-1.223 1.68 1.68 0 0 0-1.2-.51m-.015 4.75.199.152zm.015-2.503a.523.523 0 1 0 0-1.046.523.523 0 0 0 0 1.046" clip-rule="evenodd"/>'
    },
    {
      id: "cf-share-arrow-outline",
      viewBox: "0 0 16 16",
      content: '<g clip-path="url(#a)"><path fill="currentColor" fill-rule="evenodd" d="M5.854 3.932 7.5 2.286V9.5h1V2.336l1.596 1.596.707-.707L8.328.75 7.975.396 7.62.75 5.146 3.225zM3 5l-.5.5v8l.5.5h10l.5-.5v-8L13 5h-3v1h2.5v7h-9V6H6V5z" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-share-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12 9.487a2.5 2.5 0 0 0-1.983.984L6.243 8.625c.113-.425.11-.872-.012-1.295l3.787-1.936a2.5 2.5 0 1 0-.41-.914L5.775 6.44a2.5 2.5 0 1 0 .027 3.083l3.777 1.848A2.498 2.498 0 1 0 12 9.487m.048-7.047a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3M3.825 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M12 13.488a1.5 1.5 0 1 1 0-3.001 1.5 1.5 0 0 1 0 3"/>'
    },
    {
      id: "cf-share-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M12.25 6a2.25 2.25 0 1 0-2.196-1.757L5.481 6.562a2.25 2.25 0 1 0 .024 2.847l4.58 2.226a2.25 2.25 0 1 0 .481-.878L5.942 8.51a2.26 2.26 0 0 0-.009-1.056l4.552-2.308c.412.52 1.05.854 1.765.854"/>'
    },
    {
      id: "cf-shop-cart-no-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m14.06 3.507-3.072-.002a3.52 3.52 0 0 0-4.865 0L3.36 3.503 3.003 1.88l-.488-.392H.067v1h2.046l.356 1.617-.005.006.685 3.08 1.001 3.911.488.393h8.266v-1H5.041l-.47-1.493h2.023a3.525 3.525 0 0 0 3.923 0h2.543l.488-.391 1-4.495zm-10.48.996h1.807a3.51 3.51 0 0 0 .216 3.498h-1.25l-.181-.814zM8.557 8.6a2.535 2.535 0 1 1-.001-5.071 2.535 2.535 0 0 1 0 5.071m4.103-.598h-1.15a3.51 3.51 0 0 0 .216-3.496h1.713zm-6.265 6.745a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5m4.75 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5"/><path fill="currentColor" d="m9.463 4.449-.907.907-.908-.907-.707.707.908.907-.908.908.707.707.908-.908.907.908.707-.707-.907-.908.907-.907z"/>'
    },
    {
      id: "cf-shop-cart-no-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M11.23 3.505a3.74 3.74 0 0 1 1.009 2.56c0 1.19-.555 2.25-1.42 2.938h2.174l.488-.392 1-4.495-.487-.608z"/><path fill="currentColor" d="M6.158 9.003a3.74 3.74 0 0 1-1.42-2.938c0-.99.384-1.89 1.01-2.56l-2.455-.002-.357-1.622-.488-.393H0v1h2.046l.356 1.618-.005.005.685 3.08 1.001 3.911.489.393h8.265v-1H4.974l-.469-1.492zm1.419 4.494a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0m3.5 1.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5"/><path fill="currentColor" fill-rule="evenodd" d="M8.489 9.065a3 3 0 1 0 0-6 3 3 0 0 0 0 6m.907-4.617-.907.908-.908-.908-.707.707.908.908-.908.908.707.707.908-.908.907.908.707-.707-.907-.908.907-.908z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-shop-cart-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14 3.5H3.3l-.352-1.617L2.46 1.5H.013v1h2.045l.355 1.617.777 3.5.91 3.5.483.383h8.265v-1H4.985L4.518 9H13l.5-.39 1-4.5zM12.602 8H4.298l-.128-.57-.645-2.93h9.855zm-6.264 6.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5m4.75 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5"/>'
    },
    {
      id: "cf-shop-cart-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14 3.5H3.3l-.352-1.617L2.46 1.5H.013v1h2.045l.355 1.617.777 3.5.91 3.5.483.383h8.265v-1H4.985L4.518 9H13l.5-.39 1-4.5zM6.338 14.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5m6-1.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0"/>'
    },
    {
      id: "cf-slow-snail-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M12.306 3.25a.79.79 0 0 0-.791.791v2.126h.773v-.963a1.79 1.79 0 0 1 1.79-1.79h.128v1h-.127a.79.79 0 0 0-.791.79v.963h1.649v1.457c0 .421-.225.81-.59 1.02-.364.21-.589.598-.589 1.02v.312a3.68 3.68 0 0 1-3.68 3.68H1l.922-.985.015-.015a1.75 1.75 0 0 1 1.027-.523 3.49 3.49 0 0 1-1.346-2.756v-.66A4.04 4.04 0 0 1 5.656 4.68h.266a5.06 5.06 0 0 1 4.591 2.931V6.167h.002V4.041a1.79 1.79 0 0 1 1.791-1.791h.127v1zM9.981 9.696A4.06 4.06 0 0 0 5.922 5.68h-.266a3.04 3.04 0 0 0-3.038 3.038v.659a2.496 2.496 0 0 0 2.495 2.495h.238a1.867 1.867 0 0 0 1.867-1.867v-.491c0-.685-.556-1.241-1.241-1.241h-.434a.66.66 0 0 0-.662.662v.351c0 .113.092.205.205.205h.205v-.002h1c0 .553-.448 1.002-1.002 1.002h-.203c-.666 0-1.205-.54-1.205-1.205v-.351c0-.918.744-1.662 1.662-1.662h.434a2.24 2.24 0 0 1 2.24 2.241v.49q0 .094-.005.185h.551c.473 0 .903-.188 1.218-.493m-3.536 2.96a2.88 2.88 0 0 0 1.518-1.467h.8a2.75 2.75 0 0 0 2.75-2.75V7.167h2.424v.457a.18.18 0 0 1-.088.153 2.18 2.18 0 0 0-1.09 1.886v.313c0 1.48-1.2 2.68-2.68 2.68z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-sort-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M6.08 7.097h-1v5.642l-2.114-2.13-.716.69 3.33 3.358L8.908 11.3l-.714-.691-2.115 2.13zm7.579-2.24L10.329 1.5 7 4.857l.715.691 2.114-2.13V9.06h1V3.418l2.113 2.13z"/>'
    },
    {
      id: "cf-spam-email-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M13.02 6.429V4.015l-.5-.5h-12l-.5.5v7.958l.5.5h9.42a3.558 3.558 0 1 0 3.08-6.044m-6.5 2.22L1.84 4.515h9.36zm-2.25-.654-3.25 2.87v-5.74zm.755.667L6.19 9.691h.66l1.165-1.028.895.789c-.102.69.008 1.395.317 2.02H1.842zm4.203-.264-.456-.403 3.25-2.87v1.277a3.56 3.56 0 0 0-2.795 1.996zm3.205 4.099a2.56 2.56 0 1 1 0-5.12 2.56 2.56 0 0 1 0 5.12"/><path fill="currentColor" d="M12.933 7.95h-1v2.25h1zm0 2.973h-1v1h1z"/>'
    },
    {
      id: "cf-spam-email-solid",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M-.06 4.087 4.201 7.89l-4.26 3.796zm.754-.667h11.493L6.44 8.55zm12.246.667L8.681 7.889l.798.704a3.81 3.81 0 0 1 3.461-2.07zM7.93 8.56l1.197 1.056a3.8 3.8 0 0 0 .526 2.76H.67l4.283-3.815L6.11 9.593h.662z"/><path fill-rule="evenodd" d="M12.94 7.273h-.07a3.06 3.06 0 1 0 .07 0m-.571 1.074v2.251h1V8.347zm0 3.974v-1h1v1z" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-sports-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m8.694 7.968.707-.707.707.707.707-.707-.707-.707.707-.707-.707-.707-.707.707-.707-.707-.707.707.707.707-.707.707-.707-.707-.707.707.707.707-.707.708-.707-.708-.707.708.707.707-.707.707.707.707.707-.707.707.707.707-.707-.707-.707.707-.707.707.707.707-.707z"/><path fill="currentColor" fill-rule="evenodd" d="m13.4 2.217.338.339.001.002.001.004.004.014.013.048q.016.06.042.172c.034.148.077.36.116.623.078.528.141 1.269.086 2.13-.112 1.723-.704 3.941-2.63 5.867-1.925 1.925-4.144 2.518-5.867 2.63a10.2 10.2 0 0 1-2.13-.087 8 8 0 0 1-.843-.17l-.013-.004-.005-.001-.002-.001-.338-.338v-.001l-.001-.002-.001-.004-.004-.014a3 3 0 0 1-.055-.22 8 8 0 0 1-.116-.623 10.2 10.2 0 0 1-.086-2.13c.112-1.723.704-3.941 2.63-5.867 1.925-1.925 4.144-2.518 5.867-2.63.86-.055 1.602.009 2.13.087a8 8 0 0 1 .842.17l.014.004.005.001zM3.52 12.97a8 8 0 0 1-.455-.081 8 8 0 0 1-.08-.455 9.2 9.2 0 0 1-.069-2.047l2.652 2.651-.13.01a9.2 9.2 0 0 1-1.918-.078m3.276-.118L3.103 9.158a7.85 7.85 0 0 1 2.144-3.867 7.85 7.85 0 0 1 3.867-2.143l3.694 3.694a7.85 7.85 0 0 1-2.144 3.867 7.85 7.85 0 0 1-3.867 2.143m6.196-7.239.01-.13a9.2 9.2 0 0 0-.078-1.917 8 8 0 0 0-.08-.455 8 8 0 0 0-.455-.08 9.2 9.2 0 0 0-2.048-.069z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-star-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M7.875 3.279 6.71 6.902H2.92l3.066 2.25-1.168 3.63 3.057-2.243 3.057 2.243-1.168-3.63 3.065-2.25H9.04zM5.98 5.902l1.418-4.41h.952l1.418 4.41h4.586l.296.903-3.714 2.727 1.42 4.413-.773.556-3.71-2.722-3.708 2.723-.772-.557 1.42-4.413-3.715-2.727.295-.903z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-star-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m7.875 1.646 1.53 4.756h4.95l-4.005 2.94 1.53 4.756-4.005-2.94-4.005 2.94L5.4 9.342l-4.006-2.94h4.951z"/><path fill="currentColor" fill-rule="evenodd" d="M7.875 3.279 6.71 6.902H2.92l3.066 2.25-1.168 3.63 3.057-2.243 3.057 2.243-1.168-3.63 3.065-2.25H9.04zM5.981 5.902l1.418-4.41h.952l1.418 4.41h4.587l.295.903-3.714 2.727 1.42 4.413-.773.556-3.709-2.722-3.71 2.723-.771-.557 1.42-4.413-3.715-2.727.295-.903z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-support-chat-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14 2H2l-.5.5v11.166l.863.343L5.215 11H14l.5-.5v-8zm-.5 8H4.785L2.5 12.411V3h11z"/><path fill="currentColor" d="M12.25 4.503h-8.5v1h8.5zm0 2.497h-8.5v1h8.5z"/>'
    },
    {
      id: "cf-support-chat-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M14 2H2l-.5.5v11.166l.863.343L5.215 11H14l.5-.5v-8zm-1.75 2.503h-8.5v1h8.5zM3.75 7h8.5v1h-8.5z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-table-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m1.75 3-.5.5v9l.5.5h12.5l.5-.5v-9l-.5-.5zm.5 4H5.5v2H2.25zm3.25 3H2.25v2H5.5zm1 2v-2h7.25v2zm0-3V7h7.25v2zm0-3h7.25V4H6.5zm-1-2H2.25v2H5.5z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-tag-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M9.626 2.615 2.282 9.947 6.1 13.604l7.447-7.353V2.796l-.164-.18zm4.92-.204-.72-.796h-4.48l-.282.15-7.813 7.8v.778l4.46 4.274h.786l7.896-7.797.154-.285z" clip-rule="evenodd"/><path fill="currentColor" d="M12.236 4.657a.83.83 0 0 1-.833.824.83.83 0 0 1-.832-.824c0-.455.373-.824.832-.824.46 0 .832.37.832.824"/>'
    },
    {
      id: "cf-tag-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m9.345 1.498-.282.15-7.813 7.8v.778L5.71 14.5h.786l7.896-7.797.154-.285V2.294l-.72-.796zm2.762 3.49c.552 0 1-.442 1-.989a.994.994 0 0 0-1-.99.995.995 0 0 0-.999.99c0 .547.447.99 1 .99" clip-rule="evenodd"/>'
    },
    {
      id: "cf-target-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7.99 9.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5"/><path fill="currentColor" d="M15.14 7.5h-1.167A6 6 0 0 0 8.5 2.022V.86h-1v1.162A6 6 0 0 0 2.027 7.5H.86v1h1.168A6 6 0 0 0 7.5 13.967v1.172h1v-1.172A6 6 0 0 0 13.972 8.5h1.168zM8.5 12.964v-2.439h-1v2.44A5.004 5.004 0 0 1 3.03 8.5h2.445v-1H3.03A5 5 0 0 1 7.5 3.025v2.45h1v-2.45A5 5 0 0 1 12.97 7.5h-2.445v1h2.444A5.004 5.004 0 0 1 8.5 12.964"/>'
    },
    {
      id: "cf-target-retarget-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7.99 9.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5"/><path fill="currentColor" d="M15.14 7.5h-.66A6.5 6.5 0 0 0 8.5 1.515V.86h-1v.655A6.5 6.5 0 0 0 1.52 7.5H.86v1h.662A6.5 6.5 0 0 0 7.5 14.473v.667h1v-.668A6.5 6.5 0 0 0 14.477 8.5h.663zm-1.663 0H12.21A4.25 4.25 0 0 0 8.5 3.777v-1.25A5.5 5.5 0 0 1 13.477 7.5m-2.28 1A3.25 3.25 0 0 1 8.5 11.2v-.675h-1v.68A3.25 3.25 0 0 1 4.782 8.5h.693v-1h-.693A3.25 3.25 0 0 1 7.5 4.785v.69h1V4.79a3.25 3.25 0 0 1 2.698 2.71h-.673v1zM7.5 2.517v1.25A4.25 4.25 0 0 0 3.772 7.5h-1.25A5.5 5.5 0 0 1 7.5 2.517M2.525 8.5h1.25A4.25 4.25 0 0 0 7.5 12.215v1.25A5.5 5.5 0 0 1 2.525 8.5M8.5 13.47v-1.25a4.25 4.25 0 0 0 3.707-3.72h1.268A5.5 5.5 0 0 1 8.5 13.47"/>'
    },
    {
      id: "cf-target-retarget-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7.5.86v.66a6.6 6.6 0 0 1 1 0v2.255A4.25 4.25 0 0 1 12.212 7.5h2.269A6.5 6.5 0 0 0 8.5 1.52V.86zM.86 7.5h.659a6.6 6.6 0 0 0 0 1h2.25a4.25 4.25 0 0 0 3.73 3.717v2.264a6.5 6.5 0 0 1-5.98-5.98H.86zm6.64 7.64v-.659a6.6 6.6 0 0 0 1 0v.659zm7.64-6.64h-.659a6.6 6.6 0 0 0 0-1h.659z"/><path fill="currentColor" fill-rule="evenodd" d="M7.5 4.782v.693h1v-.69A3.25 3.25 0 0 1 11.203 7.5h-.678v1h.676A3.25 3.25 0 0 1 8.5 11.205v-.68h-1v.683A3.25 3.25 0 0 1 4.78 8.5h.695v-1h-.697A3.25 3.25 0 0 1 7.5 4.782M9.24 8a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0" clip-rule="evenodd"/><path fill="currentColor" d="M8.5 12.215A4.25 4.25 0 0 0 12.21 8.5h2.271A6.5 6.5 0 0 1 8.5 14.481zM3.769 7.5a4.25 4.25 0 0 1 3.73-3.727V1.52A6.5 6.5 0 0 0 1.52 7.5z"/>'
    },
    {
      id: "cf-target-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M7.5.86v1.16a6 6 0 0 1 1 0V.86z"/><path fill="currentColor" fill-rule="evenodd" d="M.86 7.5h1.16A6 6 0 0 1 7.5 2.02v3.455h1V2.021A6 6 0 0 1 13.98 7.5h-3.455v1h3.454A6 6 0 0 1 8.5 13.98v-3.455h-1v3.454A6 6 0 0 1 2.02 8.5h3.455v-1H2.02a6 6 0 0 0 0 1H.86zm8.38.5a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0" clip-rule="evenodd"/><path fill="currentColor" d="M7.5 15.14v-1.16a6 6 0 0 0 1 0v1.16zm7.64-6.64h-1.16a6 6 0 0 0 0-1h1.16z"/>'
    },
    {
      id: "cf-thumbs-down-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M8.75 15h1c1.14 0 2.089-1.103 1.735-2.261L10.8 10.5h2.7a1.5 1.5 0 0 0 1.05-2.571c.127-.196.2-.429.2-.679v-.125c0-.39-.162-.741-.422-.991.11-.186.172-.403.172-.634v-.125c0-.485-.252-.912-.631-1.157A1.36 1.36 0 0 0 14 3.625a1.31 1.31 0 0 0-.474-1.03A1.6 1.6 0 0 0 12.5 2.25H8.425l-2.675.823V2.25h-4v9h4v-.648q.351.142.716.472c.416.376.798.893 1.127 1.435a13 13 0 0 1 1.023 2.115l.012.034.003.008v.002zm.696-1a14.6 14.6 0 0 0-.998-2.01c-.354-.582-.794-1.19-1.311-1.658-.394-.356-.86-.655-1.387-.775V4.119l2.825-.869H12.5a.6.6 0 0 1 .388.116c.066.054.112.13.112.259a.31.31 0 0 1-.112.26A.6.6 0 0 1 12.5 4H12v1h1.125c.207 0 .375.168.375.375V5.5a.25.25 0 0 1-.25.25H12v1h1.375c.207 0 .375.168.375.375v.125a.25.25 0 0 1-.25.25H12v1h1.5a.5.5 0 0 1 0 1H9v1h.755l.773 2.53c.137.45-.238.97-.778.97zM4.75 3.25v7h-2v-7z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-thumbs-down-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m9.15 14.678.027.072h.573c.99 0 1.795-.958 1.495-1.938l-.782-2.562H13.5a1.25 1.25 0 0 0 .7-2.286 1 1 0 0 0 .3-.714v-.125c0-.397-.206-.746-.516-.946a1 1 0 0 0 .266-.679v-.125c0-.486-.308-.9-.74-1.057.152-.184.24-.42.24-.693 0-.35-.145-.64-.383-.837A1.35 1.35 0 0 0 12.5 2.5H8.462l-2.712.835v6.937c.389.067.769.287 1.134.617.441.399.838.939 1.172 1.49a13.3 13.3 0 0 1 .99 2.019c.018.043.07.189.104.28M4.75 11H2V2.5h2.75z"/>'
    },
    {
      id: "cf-thumbs-up-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M8.75 1h1c1.14 0 2.089 1.103 1.735 2.261L10.8 5.5h2.7a1.5 1.5 0 0 1 1.05 2.571c.127.196.2.429.2.679v.125c0 .39-.162.741-.422.991.11.186.172.403.172.634v.125c0 .485-.252.912-.631 1.157q.13.266.131.593c0 .424-.178.784-.474 1.03a1.6 1.6 0 0 1-1.026.345H8.425l-2.675-.823v.823h-4v-9h4v.647q.351-.14.716-.471c.416-.376.798-.893 1.127-1.435a13 13 0 0 0 1.035-2.15l.003-.007v-.002zm.696 1a15 15 0 0 1-.998 2.01c-.354.582-.794 1.19-1.311 1.658-.394.356-.86.655-1.387.775v5.438l2.825.869H12.5a.6.6 0 0 0 .388-.116c.066-.054.112-.13.112-.259a.31.31 0 0 0-.112-.26A.6.6 0 0 0 12.5 12H12v-1h1.125a.375.375 0 0 0 .375-.375V10.5a.25.25 0 0 0-.25-.25H12v-1h1.375a.375.375 0 0 0 .375-.375V8.75a.25.25 0 0 0-.25-.25H12v-1h1.5a.5.5 0 0 0 0-1H9v-1h.755l.773-2.53c.137-.45-.238-.97-.778-.97zM4.75 12.75v-7h-2v7z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-thumbs-up-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m9.15 1.323.027-.073h.573c.99 0 1.795.958 1.495 1.938l-.782 2.562H13.5a1.25 1.25 0 0 1 .7 2.286c.185.181.3.434.3.714v.125c0 .397-.206.746-.516.946a1 1 0 0 1 .266.679v.125c0 .486-.308.9-.74 1.057.152.184.24.42.24.693 0 .35-.145.64-.383.837a1.35 1.35 0 0 1-.867.288H8.462l-2.712-.835V5.728c.389-.067.769-.287 1.134-.617.441-.399.838-.938 1.172-1.49a13.3 13.3 0 0 0 .99-2.019c.018-.043.07-.189.104-.28M4.75 5H2v8.5h2.75z"/>'
    },
    {
      id: "cf-time-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13m0 12a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11"/><path fill="currentColor" d="M8.25 3.99h-1v4.635l2.7 2.807.72-.692-2.42-2.517z"/>'
    },
    {
      id: "cf-time-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M4.389 2.595a6.5 6.5 0 1 1 7.222 10.81A6.5 6.5 0 0 1 4.39 2.594M7.205 4h1v4.233l2.42 2.517-.72.693-2.7-2.808z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-traffic-attack-browser-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.628 5.362a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045m1.672 0a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045m1.675 0a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045"/><path fill="currentColor" d="M14 2.98H2l-.5.5v9.968l.5.5h12l.5-.5V3.48zm-.5 1V5.7h-11V3.98zm-11 8.968v-6.25h11v6.25z"/><path fill="currentColor" d="m10.338 7.95-.713-.703L8 8.892 6.355 7.265l-.703.712 1.646 1.625-1.628 1.646.71.702 1.628-1.642 1.645 1.624.702-.71L8.71 9.596z"/>'
    },
    {
      id: "cf-traffic-attack-browser-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.622 5.4a.523.523 0 1 0 0-1.045.523.523 0 0 0 0 1.045m1.676 0a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045m2.195-.523a.522.522 0 1 1-1.045 0 .522.522 0 0 1 1.045 0"/><path fill="currentColor" fill-rule="evenodd" d="M14 3.018H2l-.5.5v9.967l.5.5h12l.5-.5V3.518zm-.5 1V5.75h-11V4.018zm-3.875 3.23.713.702L8.71 9.595l1.645 1.627-.703.71-1.645-1.625L6.38 11.95l-.71-.703 1.627-1.645-1.645-1.625.703-.712L8 8.892z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-traffic-legit-browser-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.623 5.362a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045m1.675 0a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045m1.672 0a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045"/><path fill="currentColor" d="M14 2.98H2l-.5.5v9.968l.5.5h12l.5-.5V3.48zm-.5 1V5.7h-11V3.98zm-11 8.968v-6.25h11v6.25z"/><path fill="currentColor" d="m7.243 10.533-1.38-1.44-.723.69 2.09 2.185L10.857 8.3l-.71-.703z"/>'
    },
    {
      id: "cf-traffic-legit-browser-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.622 5.363a.523.523 0 1 0 0-1.046.523.523 0 0 0 0 1.046m1.676 0a.523.523 0 1 0 0-1.045.523.523 0 0 0 0 1.045m2.195-.523a.523.523 0 1 1-1.045 0 .523.523 0 0 1 1.045 0"/><path fill="currentColor" fill-rule="evenodd" d="M14 2.98H2l-.5.5v9.968l.5.5h12l.5-.5V3.48zm-.5 1V5.7h-11V3.98zM5.863 9.092l1.38 1.44 2.905-2.935.71.703-3.628 3.667-2.09-2.185z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-trophy-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M12 1.5H4.25V3h-1.5l-.5.5v.875A3.88 3.88 0 0 0 4.728 7.99 3.9 3.9 0 0 0 6.75 9.75v1.75H5v3h6.25v-3H9.5V9.749a3.9 3.9 0 0 0 2.022-1.759A3.88 3.88 0 0 0 14 4.375V3.5l-.5-.5H12zM12 4v2.125q0 .23-.026.452A2.87 2.87 0 0 0 13 4.375V4zm-3.5 7.5V9.002l.37-.1A2.876 2.876 0 0 0 11 6.125V2.5H5.25v3.625c0 1.33.903 2.45 2.13 2.777l.37.1V11.5zm-2.5 1v1h4.25v-1zM4.276 6.577a4 4 0 0 1-.026-.452V4h-1v.375c0 .884.399 1.674 1.026 2.202" clip-rule="evenodd"/>'
    },
    {
      id: "cf-user-add-member-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8.006 9.506H5.99A4.5 4.5 0 0 0 1.496 14l.5.5H12l.5-.5a4.5 4.5 0 0 0-4.494-4.494M2.532 13.5a3.5 3.5 0 0 1 3.458-2.994h2.016a3.5 3.5 0 0 1 3.458 2.994zm4.473-4.403a3 3 0 1 0 0-6 3 3 0 0 0 0 6m0-5a2 2 0 1 1 0 4 2 2 0 0 1 0-4m7.498-.108-.006-1-1.5.008-.008-1.5-1 .006.008 1.5-1.5.008.006 1 1.5-.008.008 1.5 1-.006-.008-1.5z"/>'
    },
    {
      id: "cf-user-add-member-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m14.503 3.989-.006-1-1.5.008-.008-1.5-1 .006.008 1.5-1.5.008.006 1 1.5-.008.008 1.5 1-.006-.008-1.5zM8.082 9.51H6.018a4.5 4.5 0 0 0-3.19 1.336c-.846.855-1.322 1.947-1.324 3.156l.5.498H12.01l.496-.5c-.002-1.207-.392-2.298-1.237-3.152A4.5 4.5 0 0 0 8.082 9.51m.527-1.022a2.858 2.858 0 1 1-3.176-4.752A2.858 2.858 0 0 1 8.61 8.488"/>'
    },
    {
      id: "cf-user-multi-outline",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M8.006 8.228a2.375 2.375 0 1 0 0-4.75 2.375 2.375 0 0 0 0 4.75m0-3.749a1.375 1.375 0 1 1 0 2.75 1.375 1.375 0 0 1 0-2.75M3.013 9.264a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5m0-2.5a.75.75 0 1 1 0 1.499.75.75 0 0 1 0-1.498"/><path d="M13.504 9.525h-1.008c-.372 0-.738.083-1.073.244a3.49 3.49 0 0 0-2.667-1.242H7.244a3.49 3.49 0 0 0-2.663 1.238 2.5 2.5 0 0 0-1.068-.24H2.505A2.5 2.5 0 0 0 .01 12.021l.5.5H15.5l.5-.5a2.5 2.5 0 0 0-2.496-2.496m-10.999 1h1.008q.273.001.53.1-.187.431-.253.895H1.095a1.5 1.5 0 0 1 1.41-.995m2.295.996a2.5 2.5 0 0 1 2.444-1.994h1.512a2.5 2.5 0 0 1 2.444 1.994zm7.41 0a3.5 3.5 0 0 0-.252-.893c.172-.067.354-.102.537-.103h1.009a1.5 1.5 0 0 1 1.41.996z"/><path d="M13.004 9.264a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5m0-2.5a.75.75 0 1 1 0 1.498.75.75 0 0 1 0-1.497"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-user-multi-solid",
      viewBox: "0 0 16 16",
      content: '<g fill="currentColor" clip-path="url(#a)"><path d="M9.126 7.52a2 2 0 1 1-2.222-3.326 2 2 0 0 1 2.222 3.325M3.01 8.886a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75m9.993.002a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75m-.507.637h1.008A2.5 2.5 0 0 1 16 12.02l-.5.5h-2.755v-.5c0-.882-.292-1.735-.823-2.428q.282-.067.574-.067M4.245 12.52h7.5v-.5A2.994 2.994 0 0 0 8.75 9.028H7.239a2.994 2.994 0 0 0-2.994 2.994zm-3.735 0h2.735v-.5c0-.884.293-1.739.826-2.432a2.5 2.5 0 0 0-.557-.063H2.506A2.5 2.5 0 0 0 .01 12.02z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h16v16H0z"/></clipPath></defs>'
    },
    {
      id: "cf-user-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M9.213 8.69h-2.42A5.3 5.3 0 0 0 1.5 13.98l.5.5h12l.5-.5a5.297 5.297 0 0 0-5.287-5.29M2.53 13.48a4.3 4.3 0 0 1 4.263-3.79h2.42a4.297 4.297 0 0 1 4.25 3.79zM8.012 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m0-6a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5"/>'
    },
    {
      id: "cf-user-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M9.806 7.452a3.25 3.25 0 1 1-3.612-5.404 3.25 3.25 0 0 1 3.612 5.404M6.793 9h2.42a5.44 5.44 0 0 1 3.736 1.475 4.9 4.9 0 0 1 1.551 3.55l-.5.475H2l-.5-.475a4.9 4.9 0 0 1 1.552-3.552A5.44 5.44 0 0 1 6.792 9"/>'
    },
    {
      id: "cf-vectorize-db-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M2.461 12V1.75h1v1.745h.986l.5-.592h.5l.5.592h.933l.5-.592h.5l.5.592h4.083V1.75h1V12h.5v1h.537v1h-13v-1h.463v-1zm1.987-7.503.5.5h.5l.5-.5h.932l.5.5h.5l.5-.5h4.083V6.52h-1.257l-.5-.5h-.5l-.5.5H5.947l-.5-.5h-.5l-.5.5H3.46V4.497zm0 3.024H3.46v1.977h3.793l.5-.5h.5l.5.5h.952l.5-.5h.5l.5.5h1.257V7.521h-1.257l-.5.5h-.5l-.5-.5H5.947l-.5.5h-.5zM7.254 10.5l.5.5h.5l.5-.5h.951l.5.5h.5l.5-.5h1.258V12H3.46v-1.5z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-version-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M14.568 2.25H6.432L6 2.694v10.612l.432.444h8.136l.432-.444V2.694zM14 12.75H7v-9.5h7zM3.5 3.375 4 2.75h1.25v1.004H4.5v8.742h.75V13.5H4l-.5-.5zm-2.5.75.5-.625h1.25v1H2V12h.75v1H1.625L1 12.375z"/>'
    },
    {
      id: "cf-video-browser-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.613 4.898a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045m1.675 0a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045m1.672 0a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045"/><path fill="currentColor" d="M14 2.515H2l-.5.5v9.97l.5.5h12l.5-.5v-9.97zm-.5 1v1.72h-11v-1.72zm-11 8.97v-6.25h11v6.25z"/><path fill="currentColor" d="m7.343 7.64-.383.218v3l.383.217L9.87 9.573v-.435z"/>'
    },
    {
      id: "cf-video-browser-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M3.612 4.898a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045m2.198-.523a.522.522 0 1 1-1.045 0 .522.522 0 0 1 1.045 0m1.15.523a.522.522 0 1 0 0-1.045.522.522 0 0 0 0 1.045"/><path fill="currentColor" fill-rule="evenodd" d="M14 2.515H2l-.5.5v9.97l.5.5h12l.5-.5v-9.97zm-.5 1v1.72h-11v-1.72zM6.96 7.858l.382-.218L9.87 9.138v.435l-2.528 1.502-.382-.217z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-virtual-machine-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m3.1 10.71 4.25 2.428V8.29L3.1 5.861zm5.25-2.42v4.848l4.25-2.428V5.86zM3.609 5l4.243 2.424L12.093 5 7.85 2.576zm9.993 6-.252.434-5.25 3h-.496l-5.25-3L2.1 11V5l.252-.434 5.25-3h.496l5.25 3L13.6 5z"/>'
    },
    {
      id: "cf-warning-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5m0 12A5.5 5.5 0 1 1 13.5 8 5.506 5.506 0 0 1 8 13.5"/><path fill="currentColor" d="M8.52 8.75H7.434l-.153-4h1.39zm-.543 1.27q.33 0 .529.195.203.194.203.497a.65.65 0 0 1-.203.492.72.72 0 0 1-.529.194.73.73 0 0 1-.528-.194.66.66 0 0 1-.199-.492.66.66 0 0 1 .199-.492.72.72 0 0 1 .528-.2"/>'
    },
    {
      id: "cf-warning-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M4.389 2.595A6.5 6.5 0 0 1 8 1.5 6.507 6.507 0 0 1 14.5 8 6.5 6.5 0 1 1 4.389 2.595M7.435 8.75H8.52l.154-4H7.282zm1.07 1.465a.72.72 0 0 0-.528-.194.72.72 0 0 0-.528.199.66.66 0 0 0-.199.492.66.66 0 0 0 .199.492q.202.194.528.194.33 0 .529-.194a.65.65 0 0 0 .203-.492.66.66 0 0 0-.203-.497" clip-rule="evenodd"/>'
    },
    {
      id: "cf-wheel",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 .75a7.25 7.25 0 1 1 0 14.5A7.25 7.25 0 0 1 8 .75M3.934 12.746A6.22 6.22 0 0 0 7.5 14.23v-3.78a2.5 2.5 0 0 1-.895-.375zm5.444-2.66a2.5 2.5 0 0 1-.878.364v3.78a6.22 6.22 0 0 0 3.551-1.472zM10.45 8.5c-.065.32-.191.616-.365.878l2.673 2.673A6.22 6.22 0 0 0 14.23 8.5zm-8.68 0a6.22 6.22 0 0 0 1.459 3.537l2.675-2.675A2.5 2.5 0 0 1 5.55 8.5zM8 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M3.241 3.948A6.22 6.22 0 0 0 1.77 7.5h3.78c.065-.32.19-.616.365-.878zm6.834 2.657c.18.266.309.57.375.895h3.78a6.22 6.22 0 0 0-1.484-3.566zM7.5 1.77a6.22 6.22 0 0 0-3.552 1.47l2.674 2.674c.262-.174.559-.3.878-.365zm1 3.78c.312.063.603.186.862.354l2.675-2.675A6.22 6.22 0 0 0 8.5 1.769z"/>'
    },
    {
      id: "cf-workers-constellation-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M9.188 5.25V2.5h1v2.75zM3.061 3.625v-.75h1v.75h.75v1h-.75v.75h-1v-.75h-.75v-1zm4.946 2.528-.972-.973.707-.707.972.973zm2.652-.707.972-.973.707.707-.972.973zM5.063 6.625h2.75v1h-2.75zm6.5 0h2.75v1h-2.75zm.069 3.152-.972-.973.707-.707.972.973zM7.036 9.07l.972-.973.707.707-.972.973zm2.152 2.68V9h1v2.75zm-6.126-.437V10h1v1.313h1.313v1H4.063v1.312h-1v-1.312H1.75v-1z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-workers-for-platform-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="m8.464 1.447 6.484 3.643.002.505.003.002v4.996l-.494.812-5.731 3.277v.025h-1.44v-.016l-5.766-3.298-.475-.8V5.597l.002-.001.004-.507L7.59 1.447zM2.32 5.513 7.101 8.25l.898.507 1.022-.577 4.66-2.665L7.999 2.31zm8.09 2.985L8.483 9.6v4.11l5.504-3.148V6.458zM2.013 6.466l5.504 3.18v4.064l-5.504-3.148zm4.852-2.244c0 .342.464.62 1.037.62s1.037-.278 1.037-.62v-.409c0-.342-.464-.62-1.037-.62s-1.037.278-1.037.62zm0 2.694c0 .343.464.621 1.037.621s1.037-.278 1.037-.62v-.409c0-.343-.464-.62-1.037-.62s-1.037.277-1.037.62zm2.597-1.453v-.408c0-.343.464-.621 1.037-.621s1.037.278 1.037.62v.409c0 .343-.464.62-1.037.62s-1.037-.277-1.037-.62m-5.193 0c0 .343.464.62 1.037.62.572 0 1.037-.277 1.037-.62v-.408c0-.343-.465-.621-1.037-.621-.573 0-1.037.278-1.037.62z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="m8.477 1.4 6.518 3.662.002.506.003.002v5.037l-.508.833-5.717 3.27v.044H7.24v-.035l-5.753-3.291L1 10.606V5.57l.003-.001.003-.508L7.576 1.4zm-1.15 13.26H8.68v-.005l5.744-3.285.481-.79V5.624l-.003-.001-.001-.506-6.45-3.623H7.6L1.1 5.117l-.004.506-.002.001v4.956l.462.779 5.77 3.3zm.672-12.405 5.776 3.259-4.73 2.706h-.001l-1.045.59-.921-.52-4.854-2.777zM2.414 5.514l4.71 2.694.875.494.999-.563 4.587-2.625L8 2.363l-5.585 3.15zm4.779-2.1c-.18.109-.281.251-.281.4v.408c0 .148.1.29.28.398.18.107.43.175.71.175s.53-.068.709-.175c.18-.108.28-.25.28-.398v-.409c0-.148-.1-.29-.28-.398a1.4 1.4 0 0 0-.71-.175 1.4 1.4 0 0 0-.708.174m-.049-.08c.197-.117.464-.188.758-.188.293 0 .561.07.757.188s.327.285.327.48v.408c0 .194-.132.362-.327.479a1.5 1.5 0 0 1-.757.188c-.294 0-.561-.07-.758-.188-.195-.117-.326-.285-.326-.48v-.408c0-.194.131-.362.326-.479M4.596 4.656c-.18.108-.28.25-.28.399v.408c0 .148.1.29.28.398s.43.175.71.175.53-.067.709-.175c.18-.107.28-.25.28-.398v-.408c0-.149-.1-.291-.28-.399a1.4 1.4 0 0 0-.71-.175c-.279 0-.53.068-.709.175m-.048-.08c.196-.118.464-.189.758-.189.293 0 .56.071.757.188.195.117.327.285.327.48v.408c0 .194-.132.362-.327.479a1.5 1.5 0 0 1-.757.188c-.294 0-.562-.07-.758-.188s-.326-.285-.326-.48v-.407c0-.195.13-.363.326-.48zm5.194 0a1.5 1.5 0 0 1 .757-.189c.293 0 .561.071.757.188.18.108.305.258.324.433h.003v.455c0 .194-.131.362-.326.479a1.5 1.5 0 0 1-.758.188 1.5 1.5 0 0 1-.757-.188c-.196-.117-.327-.285-.327-.48v-.406c0-.195.131-.363.327-.48m1.747.479c0-.149-.1-.291-.28-.399a1.4 1.4 0 0 0-.71-.175c-.28 0-.53.068-.71.175-.18.108-.28.25-.28.398v.409c0 .148.1.29.28.398s.43.175.71.175.53-.067.71-.175.28-.25.28-.398zM7.193 6.11c-.18.107-.281.25-.281.398v.408c0 .149.1.291.28.399.18.107.43.175.71.175s.53-.068.709-.175c.18-.108.28-.25.28-.399v-.408c0-.148-.1-.29-.28-.398a1.4 1.4 0 0 0-.71-.176c-.279 0-.53.068-.708.176m-.049-.081c.197-.117.464-.188.758-.188.293 0 .561.07.757.188s.327.285.327.48v.407c0 .195-.132.363-.327.48a1.5 1.5 0 0 1-.757.188c-.294 0-.561-.071-.758-.188-.195-.117-.326-.285-.326-.48v-.408c0-.194.131-.362.326-.479m6.89.349v4.211l-5.598 3.202V9.572l1.95-1.115zm-12.068.006L7.564 9.62v4.172L1.966 10.59zm8.467 2.154L8.53 9.627v4.002l5.41-3.095V6.54l-3.507 2zM2.06 6.548v3.986l5.41 3.095V9.673z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-workers-pages-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m6.22 12.305-3.198-4.3 3.181-4.177-.614-.843-3.584 4.713L2 8.3l3.601 4.848z"/><path fill="currentColor" d="M7.337 2h-1.23l4.439 6.1L6.21 14h1.238l4.333-5.898z"/><path fill="currentColor" d="M9.717 2H8.471l4.51 6.028L8.47 14h1.25L14 8.33v-.602z"/><path fill="currentColor" d="m7.772 5.578-.336 1.716h.877l.295.538-2.227 3.365-.486-.635.329-1.7h-.878l-.294-.537 2.222-3.424z"/>'
    },
    {
      id: "cf-wrangler-cli-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" fill-rule="evenodd" d="M13.5 2h-11l-.5.5v11l.5.5h11l.5-.5v-11zM13 13H3V3h10zM7.75 6.804 4.25 4.75v1.18l2.244 1.32L4.25 8.564V9.75l3.5-2.057zm3.75 3.446H7.75v1h3.75z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-x-exit-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m2.469 14.5-.719-.718 5.657-5.657L1.75 2.469l.719-.719 5.656 5.657 5.657-5.657.718.719-5.656 5.656 5.656 5.656-.718.719-5.657-5.657z"/>'
    },
    {
      id: "cf-x-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M9.837 11.22h1.022L6.157 4.406H5.135z"/><path fill="currentColor" fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m3.524-11.103L8.717 7.203l3.052 4.502H9.524L7.47 8.674l-2.573 3.031H4.23l2.943-3.467-2.943-4.34h2.245l1.946 2.87 2.436-2.87z" clip-rule="evenodd"/>'
    },
    {
      id: "cf-yes-check-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13m0 12a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11"/><path fill="currentColor" d="M6.978 9.528 5.002 7.464l-.723.693 2.685 2.805 4.748-4.8-.71-.703z"/>'
    },
    {
      id: "cf-yes-check-solid",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5m-1.035 9.463L4.28 8.158l.723-.693 1.975 2.063 4.024-4.068.71.702z"/>'
    },
    {
      id: "cf-zero-trust-risk-scoring-outline",
      viewBox: "0 0 16 16",
      content: '<path fill="currentColor" d="m8.566 3.544-.067-.007.001.962a4.6 4.6 0 0 0-1 0v-.962a5.5 5.5 0 0 0-3.994 2.307l.83.478a4.6 4.6 0 0 0-.502.865l-.828-.477a5.5 5.5 0 0 0 .025 4.662l.804-.508q.204.46.503.866l-1.651 1.029A6.497 6.497 0 0 1 4.62 3.462a6.5 6.5 0 0 1 3.378-.947h.003a6.5 6.5 0 0 1 5.77 3.51 6.5 6.5 0 0 1 .713 3.433v.003a6.5 6.5 0 0 1-1.174 3.301l-1.649-1.032q.3-.406.503-.866l.805.506a5.5 5.5 0 0 0 .517-1.977V9.39a5.5 5.5 0 0 0-.494-2.682l-.827.479-.003-.007a4.6 4.6 0 0 0-.499-.858l.829-.48a5.5 5.5 0 0 0-3.927-2.298"/><path fill="currentColor" d="m7.75 9.53-.25-2.5h1l-.25 2.5zm-.25.473v1h1v-1z"/><path fill="currentColor" fill-rule="evenodd" d="M6.022 6.054a3.56 3.56 0 1 1 3.956 5.92 3.56 3.56 0 0 1-3.956-5.92m1.978.4a2.56 2.56 0 1 0 0 5.12 2.56 2.56 0 0 0 0-5.12" clip-rule="evenodd"/>'
    }
  ];

  // scripts/figma/plugin/generators/icon-library.ts
  var DEFAULT_CONFIG = {
    pageName: "Icon Library",
    iconsPerRow: 20,
    iconSpacing: 48,
    defaultIconSize: 24,
    showSizeExamples: true,
    sizeExampleDimensions: [16, 20, 24]
  };
  function createIconComponent(iconData, size) {
    return __async(this, null, function* () {
      const component = figma.createComponent();
      component.name = `Icon/${iconData.id}`;
      component.description = `Icon: ${iconData.id}`;
      component.resize(size, size);
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisAlignItems = "CENTER";
      component.counterAxisAlignItems = "CENTER";
      component.primaryAxisSizingMode = "FIXED";
      component.counterAxisSizingMode = "FIXED";
      component.fills = [];
      const padding = 2;
      component.paddingTop = padding;
      component.paddingRight = padding;
      component.paddingBottom = padding;
      component.paddingLeft = padding;
      const svgString = `<svg viewBox="${iconData.viewBox}" xmlns="http://www.w3.org/2000/svg">${iconData.content}</svg>`;
      try {
        const svgNode = figma.createNodeFromSvg(svgString);
        svgNode.name = "Vector";
        const vectorSize = size - padding * 2;
        svgNode.resize(vectorSize, vectorSize);
        svgNode.constraints = {
          horizontal: "SCALE",
          vertical: "SCALE"
        };
        if ("children" in svgNode) {
          const applyScaleConstraints = (node) => {
            if ("constraints" in node) {
              node.constraints = {
                horizontal: "SCALE",
                vertical: "SCALE"
              };
            }
            if ("children" in node && Array.isArray(node.children)) {
              for (const child of node.children) {
                applyScaleConstraints(child);
              }
            }
          };
          applyScaleConstraints(svgNode);
        }
        const textColorVar = getVariableByName("text-color-surface");
        if (textColorVar && "fills" in svgNode) {
          const bindFillRecursive = (node) => {
            if ("fills" in node && node.type === "VECTOR") {
              try {
                bindFillToVariable(node, textColorVar.id);
              } catch (e) {
                console.warn(`Failed to bind fill for ${iconData.id}:`, e);
              }
            }
            if ("children" in node && Array.isArray(node.children)) {
              for (const child of node.children) {
                bindFillRecursive(child);
              }
            }
          };
          bindFillRecursive(svgNode);
        }
        component.appendChild(svgNode);
        return component;
      } catch (error) {
        console.error(`Failed to create SVG node for ${iconData.id}:`, error);
        component.name = `Icon/${iconData.id} (ERROR)`;
        return component;
      }
    });
  }
  function createSizeExamplesFrame(sampleIcon, sizes) {
    return __async(this, null, function* () {
      const frame = figma.createFrame();
      frame.name = "Size Examples";
      frame.layoutMode = "HORIZONTAL";
      frame.primaryAxisAlignItems = "CENTER";
      frame.counterAxisAlignItems = "CENTER";
      frame.itemSpacing = 32;
      frame.paddingTop = 24;
      frame.paddingRight = 24;
      frame.paddingBottom = 24;
      frame.paddingLeft = 24;
      frame.fills = [
        {
          type: "SOLID",
          color: { r: 0.95, g: 0.95, b: 0.95 }
          // Light gray background
        }
      ];
      frame.cornerRadius = 8;
      for (const size of sizes) {
        const exampleComponent = yield createIconComponent(sampleIcon, size);
        const instance = exampleComponent.createInstance();
        frame.appendChild(instance);
        const label = figma.createText();
        yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
        label.characters = `${size}px`;
        label.fontSize = 12;
        label.fills = [
          {
            type: "SOLID",
            color: { r: 0.4, g: 0.4, b: 0.4 }
          }
        ];
        exampleComponent.remove();
      }
      return frame;
    });
  }
  function countExistingIcons(pageName) {
    const iconPage = figma.root.children.find(
      (page) => page.type === "PAGE" && page.name === pageName
    );
    if (!iconPage) {
      return 0;
    }
    const iconsFrame = iconPage.children.find(
      (node) => node.type === "FRAME" && node.name === "Icons"
    );
    if (!iconsFrame) {
      return 0;
    }
    let count = 0;
    for (const child of iconsFrame.children) {
      if (child.type === "COMPONENT" && child.name.startsWith("Icon/")) {
        count++;
      }
    }
    return count;
  }
  function generateIconLibrary(config) {
    return __async(this, null, function* () {
      const finalConfig = __spreadValues(__spreadValues({}, DEFAULT_CONFIG), config);
      console.log("\u{1F4D6} Loading icon data...");
      const icons = icon_data_default;
      console.log(`\u2705 Found ${icons.length} icons in sprite`);
      const existingCount = countExistingIcons(finalConfig.pageName);
      if (existingCount === icons.length) {
        console.log(
          `\u23ED\uFE0F Skipping Icon Library generation - ${existingCount} icons already exist`
        );
        figma.notify(`Icon Library up to date (${existingCount} icons)`, {
          timeout: 2e3
        });
        return;
      }
      console.log(
        `\u{1F504} Regenerating Icon Library: ${existingCount} existing \u2192 ${icons.length} icons`
      );
      let iconPage = figma.root.children.find(
        (page) => page.type === "PAGE" && page.name === finalConfig.pageName
      );
      if (!iconPage) {
        iconPage = figma.createPage();
        iconPage.name = finalConfig.pageName;
        console.log(`\u2705 Created page: ${finalConfig.pageName}`);
      } else {
        console.log(`\u2705 Found existing page: ${finalConfig.pageName}`);
      }
      figma.currentPage = iconPage;
      const existingChildren = [...iconPage.children];
      for (const child of existingChildren) {
        child.remove();
      }
      const containerFrame = figma.createFrame();
      containerFrame.name = "Icons";
      containerFrame.fills = [
        {
          type: "SOLID",
          color: { r: 1, g: 1, b: 1 }
          // White background
        }
      ];
      const gridWidth = finalConfig.iconsPerRow * (finalConfig.defaultIconSize + finalConfig.iconSpacing) - finalConfig.iconSpacing + 200;
      const numRows = Math.ceil(icons.length / finalConfig.iconsPerRow);
      const gridHeight = numRows * (finalConfig.defaultIconSize + finalConfig.iconSpacing) - finalConfig.iconSpacing + 400;
      containerFrame.resize(gridWidth, gridHeight);
      containerFrame.x = 0;
      containerFrame.y = 0;
      iconPage.appendChild(containerFrame);
      if (finalConfig.showSizeExamples && icons.length > 0) {
        console.log("\u{1F3A8} Creating size examples...");
        const sampleIcon = icons.find((icon) => icon.id === "ph-check") || icons[0];
        const sizeExamplesFrame = yield createSizeExamplesFrame(
          sampleIcon,
          finalConfig.sizeExampleDimensions
        );
        sizeExamplesFrame.x = 100;
        sizeExamplesFrame.y = 100;
        containerFrame.appendChild(sizeExamplesFrame);
        console.log("\u2705 Size examples created");
      }
      const startY = finalConfig.showSizeExamples ? 300 : 100;
      console.log(`\u{1F3A8} Generating ${icons.length} icon components...`);
      const components = [];
      let currentX = 100;
      let currentY = startY;
      let iconsInCurrentRow = 0;
      for (let i = 0; i < icons.length; i++) {
        const iconData = icons[i];
        try {
          const component = yield createIconComponent(
            iconData,
            finalConfig.defaultIconSize
          );
          component.x = currentX;
          component.y = currentY;
          components.push(component);
          containerFrame.appendChild(component);
          iconsInCurrentRow++;
          if (iconsInCurrentRow >= finalConfig.iconsPerRow) {
            currentX = 100;
            currentY += finalConfig.defaultIconSize + finalConfig.iconSpacing;
            iconsInCurrentRow = 0;
          } else {
            currentX += finalConfig.defaultIconSize + finalConfig.iconSpacing;
          }
          if ((i + 1) % 50 === 0) {
            console.log(`  Generated ${i + 1}/${icons.length} icons...`);
          }
        } catch (error) {
          console.error(`\u274C Failed to create icon ${iconData.id}:`, error);
        }
      }
      console.log(`\u2705 Generated ${components.length} icon components`);
      figma.notify(
        `\u2705 Icon Library generated: ${components.length} icons on "${finalConfig.pageName}" page`
      );
    });
  }

  // scripts/figma/plugin/code.ts
  figma.showUI(__html__, { width: 320, height: 220 });
  function getOrCreateComponentsPage() {
    let componentsPage = figma.root.children.find(
      (page) => page.type === "PAGE" && page.name.trim().toLowerCase() === "components"
    );
    if (componentsPage) {
      console.log("\u2705 Found existing Components page");
    } else {
      console.log("\u{1F4C4} Creating new Components page");
      componentsPage = figma.createPage();
      componentsPage.name = "Components";
    }
    return componentsPage;
  }
  function purgeExistingContent() {
    const componentsPage = figma.root.children.find(
      (page) => page.type === "PAGE" && page.name.trim().toLowerCase() === "components"
    );
    if (componentsPage) {
      const children = [...componentsPage.children];
      console.log(`\u{1F5D1}\uFE0F Purging ${children.length} items from Components page`);
      for (const node of children) {
        node.remove();
      }
    }
    console.log("\u2705 Purged existing generated content");
  }
  var START_Y = 100;
  figma.ui.onmessage = (msg) => __async(null, null, function* () {
    if (msg.type === "generate") {
      try {
        figma.notify("Starting Kumo UI Kit generation...");
        purgeExistingContent();
        const componentsPage = getOrCreateComponentsPage();
        figma.currentPage = componentsPage;
        let nextY = START_Y;
        figma.notify("Generating Badge components...");
        nextY = yield generateBadgeComponents(nextY);
        figma.notify("Generating Banner components...");
        nextY = yield generateBannerComponents(nextY);
        figma.notify("Generating Icon Library...");
        yield generateIconLibrary();
        figma.notify("Generating Button components...");
        nextY = yield generateButtonComponents(componentsPage, nextY);
        figma.notify("Generating LinkButton components...");
        nextY = yield generateLinkButtonComponents(componentsPage, nextY);
        figma.notify("Generating RefreshButton components...");
        nextY = yield generateRefreshButtonComponents(componentsPage, nextY);
        figma.notify("Generating Checkbox components...");
        nextY = yield generateCheckboxComponents(componentsPage, nextY);
        figma.notify("Generating Text components...");
        nextY = yield generateTextComponents(componentsPage, nextY);
        figma.notify("Generating ClipboardText components...");
        nextY = yield generateClipboardTextComponents(nextY);
        figma.notify("Generating Code components...");
        nextY = yield generateCodeComponents(componentsPage, nextY);
        figma.notify("Generating CodeBlock components...");
        nextY = yield generateCodeBlockComponents(componentsPage, nextY);
        figma.notify("Generating Collapsible components...");
        nextY = yield generateCollapsibleComponents(nextY);
        figma.notify("Generating Combobox components...");
        nextY = yield generateComboboxComponents(nextY);
        figma.notify("Generating DateRangePicker components...");
        nextY = yield generateDateRangePickerComponents(componentsPage, nextY);
        figma.notify("Generating Dialog components...");
        nextY = yield generateDialogComponents(componentsPage, nextY);
        figma.notify("Generating Dropdown components...");
        nextY = yield generateDropdownComponents(componentsPage, nextY);
        figma.notify("Generating Input components...");
        nextY = yield generateInputComponents(componentsPage, nextY);
        figma.notify("Generating InputArea components...");
        nextY = yield generateInputAreaComponents(componentsPage, nextY);
        figma.notify("Generating LayerCard components...");
        nextY = yield generateLayerCardComponents(componentsPage, nextY);
        figma.notify("Generating Loader components...");
        nextY = yield generateLoaderComponents(componentsPage, nextY);
        figma.notify("Generating MenuBar components...");
        nextY = yield generateMenuBarComponents(componentsPage, nextY);
        figma.notify("Generating Meter components...");
        nextY = yield generateMeterComponents(nextY);
        figma.notify("Generating Pagination components...");
        nextY = yield generatePaginationComponents(nextY);
        figma.notify("\u2705 Generation complete!", { timeout: 3e3 });
        figma.closePlugin(
          "Generation complete - created Badge, Banner, Button, Checkbox, ClipboardText, Code, CodeBlock, Collapsible, Combobox, DateRangePicker, Dialog, Dropdown, Input, InputArea, LayerCard, Loader, LinkButton, MenuBar, Meter, Pagination, RefreshButton, Text components, and Icon Library"
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Generation error:", error);
        figma.notify(`Error: ${message}`, { error: true });
        figma.closePlugin();
      }
    }
    if (msg.type === "cancel") {
      figma.closePlugin();
    }
  });
})();
