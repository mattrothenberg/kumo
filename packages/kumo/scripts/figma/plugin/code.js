"use strict";
(() => {
  // scripts/figma/plugin/generators/shared.ts
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
  async function createTextNode(text, fontSize, fontWeight = 400) {
    const textNode = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    textNode.characters = text;
    textNode.fontSize = fontSize;
    textNode.fontName = { family: "Inter", style: "Regular" };
    if (fontWeight >= 600) {
      await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
      textNode.fontName = { family: "Inter", style: "Semi Bold" };
    } else if (fontWeight >= 500) {
      await figma.loadFontAsync({ family: "Inter", style: "Medium" });
      textNode.fontName = { family: "Inter", style: "Medium" };
    }
    return textNode;
  }
  function getVariableByName(variableName) {
    const collections = figma.variables.getLocalVariableCollections();
    const kumoColors = collections.find((c) => c.name === "kumo-colors");
    if (!kumoColors) {
      console.warn("kumo-colors collection not found");
      return void 0;
    }
    const variables = kumoColors.variableIds.map((id) => figma.variables.getVariableById(id)).filter((v) => v !== null);
    return variables.find((v) => v.name === variableName);
  }
  function getOrCreateSection(page, sectionName) {
    const existing = page.findChild((n) => n.name === sectionName);
    if (existing && existing.type === "SECTION") {
      return existing;
    }
    const section = figma.createSection();
    section.name = sectionName;
    section.fills = [
      {
        type: "SOLID",
        color: { r: 1, g: 1, b: 1 }
        // White
      }
    ];
    page.appendChild(section);
    return section;
  }

  // scripts/figma/plugin/parsers/tailwind-to-figma.ts
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
    "2xl": 24
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
    "text-muted": "text-color-muted",
    "!text-white": null,
    // Hardcoded white (important)
    "!text-surface": "text-color-surface",
    "!text-error": "text-color-error",
    // Border colors
    "border-color": "color-color",
    "border-primary": "color-primary",
    "border-border": "color-border",
    "ring-border": "color-border"
  };
  function parseTailwindClasses(classes) {
    var _a, _b, _c, _d, _e;
    const result = {};
    const classList = classes.split(/\s+/).filter(Boolean);
    for (const cls of classList) {
      if (cls.includes(":") && !cls.startsWith("!")) {
        continue;
      }
      const heightMatch = cls.match(/^h-(\d+\.?\d*)$/);
      if (heightMatch) {
        result.height = (_a = SPACING_SCALE[heightMatch[1]]) != null ? _a : parseFloat(heightMatch[1]) * 4;
        continue;
      }
      const pxMatch = cls.match(/^px-(\d+\.?\d*)$/);
      if (pxMatch) {
        result.paddingX = (_b = SPACING_SCALE[pxMatch[1]]) != null ? _b : parseFloat(pxMatch[1]) * 4;
        continue;
      }
      const pyMatch = cls.match(/^py-(\d+\.?\d*)$/);
      if (pyMatch) {
        result.paddingY = (_c = SPACING_SCALE[pyMatch[1]]) != null ? _c : parseFloat(pyMatch[1]) * 4;
        continue;
      }
      const gapMatch = cls.match(/^gap-(\d+\.?\d*)$/);
      if (gapMatch) {
        result.gap = (_d = SPACING_SCALE[gapMatch[1]]) != null ? _d : parseFloat(gapMatch[1]) * 4;
        continue;
      }
      const radiusMatch = cls.match(/^rounded-?(\w*)$/);
      if (radiusMatch) {
        const key = radiusMatch[1] || "DEFAULT";
        result.borderRadius = (_e = BORDER_RADIUS_SCALE[key]) != null ? _e : BORDER_RADIUS_SCALE.DEFAULT;
        continue;
      }
      const fontMatch = cls.match(/^text-(xs|sm|base|lg|xl|2xl)$/);
      if (fontMatch) {
        result.fontSize = FONT_SIZE_SCALE[fontMatch[1]];
        continue;
      }
      if (cls.startsWith("bg-")) {
        const varName = COLOR_TO_VARIABLE[cls];
        if (varName !== void 0) {
          result.fillVariable = varName;
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
              "outline"
            ],
            descriptions: {
              primary: "High-emphasis button for primary actions",
              secondary: "Default button style for most actions",
              ghost: "Minimal button with no background",
              destructive: "Danger button for destructive actions like delete",
              outline: "Bordered button with transparent background"
            },
            classes: {
              primary: "bg-primary !text-white hover:bg-primary/70 disabled:bg-primary/50",
              secondary: "bg-secondary !text-surface ring not-disabled:hover:border-subtle! not-disabled:hover:bg-subtle disabled:bg-secondary/50 disabled:!text-surface/70 ring-border data-[state=open]:bg-subtle",
              ghost: "text-surface hover:bg-accent shadow-none bg-inherit",
              destructive: "bg-error !text-white hover:bg-error/70",
              outline: "bg-surface text-surface ring ring-border"
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
        }
      },
      ClipboardText: {
        name: "ClipboardText",
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
        description: "Simple code component without syntax highlighting",
        importPath: "@cloudflare/kumo",
        category: "Display",
        props: {
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
          },
          lang: {
            type: "'ts' | 'tsx' | 'jsonc' | 'bash' | 'css'",
            description: "Language for syntax highlighting"
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
        description: "Collapsible component",
        importPath: "@cloudflare/kumo",
        category: "Display",
        props: {
          children: {
            type: "ReactNode",
            optional: true
          },
          label: {
            type: "string",
            required: true
          },
          open: {
            type: "boolean",
            optional: true
          },
          className: {
            type: "string",
            optional: true
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
          '<Dialog.Root>\n      <Dialog.Trigger render={<Button>Open Dialog</Button>} />\n      <Dialog className="p-6">\n        <Dialog.Title className="mb-2 text-xl font-semibold">\n          Dialog Title\n        </Dialog.Title>\n        <Dialog.Description className="mb-4">\n          This is a dialog description with some content.\n        </Dialog.Description>\n        <Dialog.Close render={<Button>Close</Button>} />\n      </Dialog>\n    </Dialog.Root>'
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
      Input: {
        name: "Input",
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
            default: "default"
          }
        },
        examples: [
          `<Input
      label="Email"
      placeholder="Enter your email"
      description="We'll never share your email with anyone else"
    />`,
          '<Input\n      label="Email"\n      placeholder="Invalid input"\n      defaultValue="error@example.com"\n      variant="error"\n      error="Please enter a valid email address"\n    />',
          '<Input\n      label="Email"\n      placeholder="Enter your email"\n      defaultValue="not-an-email"\n      variant="error"\n      error={{\n        message: "Please enter a valid email address",\n        match: "typeMismatch",\n      }}\n    />',
          '<Input label="Disabled Field" placeholder="Disabled input" disabled />',
          'function InputGroupExamplesRender() {\n    const [username, setUsername] = React.useState("");\n    const [status, setStatus] = React.useState<\n      "idle" | "checking" | "available" | "taken" | "error"\n    >("idle");\n\n    const checkAvailability = () => {\n      if (!username) {\n        setStatus("error");\n        return;\n      }\n      setStatus("checking");\n      // Simulate API call\n      setTimeout(() => {\n        setStatus(username.length > 3 ? "available" : "taken");\n      }, 800);\n    };\n\n    const statusText = {\n      idle: "",\n      checking: "Checking...",\n      available: "\u2713 Available",\n      taken: "\u2717 Taken",\n      error: "Please enter a username",\n    };\n\n    return (\n      <div className="space-y-6">\n        {/* Prefix label - common for URLs, usernames, currencies */}\n        <div className="space-y-1">\n          <p className="text-center text-sm text-muted">Prefix label</p>\n          <InputGroup>\n            <InputGroup.Label>https://</InputGroup.Label>\n            <InputGroup.Input placeholder="example.com" />\n          </InputGroup>\n        </div>\n\n        {/* Prefix label with suffix description - common for currency inputs */}\n        <div className="space-y-1">\n          <p className="text-center text-sm text-muted">\n            Label with description\n          </p>\n          <InputGroup>\n            <InputGroup.Label>$</InputGroup.Label>\n            <InputGroup.Input placeholder="0.00" type="number" />\n            <InputGroup.Description>USD</InputGroup.Description>\n          </InputGroup>\n        </div>\n\n        {/* With action button - interactive example */}\n        <div className="space-y-1">\n          <p className="text-center text-sm text-muted">\n            With action button (4+ chars = available, fewer = taken)\n          </p>\n          <InputGroup>\n            <InputGroup.Label>@</InputGroup.Label>\n            <InputGroup.Input\n              placeholder="username"\n              value={username}\n              onChange={(e) => {\n                setUsername(e.target.value);\n                setStatus("idle");\n              }}\n              onKeyDown={(e) => {\n                if (e.key === "Enter") {\n                  checkAvailability();\n                }\n              }}\n            />\n            <InputGroup.Button onClick={checkAvailability}>\n              {status === "checking" ? "Checking..." : "Check"}\n            </InputGroup.Button>\n          </InputGroup>\n          <p\n            aria-live="polite"\n            className={`text-sm ${status === "available" ? "text-info" : status === "error" || status === "taken" ? "text-error" : "text-muted"}`}\n          >\n            {statusText[status]}\n          </p>\n        </div>\n      </div>\n    );\n  }',
          '<div className="space-y-4">\n      <div className="space-y-1">\n        <p className="text-center text-sm text-muted">Size: xs</p>\n        <InputGroup size="xs">\n          <InputGroup.Label>@</InputGroup.Label>\n          <InputGroup.Input placeholder="username" />\n          <InputGroup.Button>Submit</InputGroup.Button>\n        </InputGroup>\n      </div>\n\n      <div className="space-y-1">\n        <p className="text-center text-sm text-muted">Size: sm</p>\n        <InputGroup size="sm">\n          <InputGroup.Label>@</InputGroup.Label>\n          <InputGroup.Input placeholder="username" />\n          <InputGroup.Button>Submit</InputGroup.Button>\n        </InputGroup>\n      </div>\n\n      <div className="space-y-1">\n        <p className="text-center text-sm text-muted">Size: base (default)</p>\n        <InputGroup size="base">\n          <InputGroup.Label>@</InputGroup.Label>\n          <InputGroup.Input placeholder="username" />\n          <InputGroup.Button>Submit</InputGroup.Button>\n        </InputGroup>\n      </div>\n\n      <div className="space-y-1">\n        <p className="text-center text-sm text-muted">Size: lg</p>\n        <InputGroup size="lg">\n          <InputGroup.Label>@</InputGroup.Label>\n          <InputGroup.Input placeholder="username" />\n          <InputGroup.Button>Submit</InputGroup.Button>\n        </InputGroup>\n      </div>\n    </div>',
          '<Input placeholder="Input without Field wrapper" />'
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
            type: "KumoInputSize",
            optional: true,
            description: "Size variant",
            default: "base"
          },
          variant: {
            type: "KumoInputVariant",
            optional: true,
            description: "Style variant",
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
              "mono"
            ],
            descriptions: {
              heading1: "Large heading for page titles",
              heading2: "Medium heading for section titles",
              heading3: "Small heading for subsections",
              body: "Default body text",
              secondary: "Muted text for secondary information",
              success: "Success state text",
              error: "Error state text",
              mono: "Monospace text for code"
            },
            classes: {
              heading1: "text-3xl font-semibold",
              heading2: "text-2xl font-semibold",
              heading3: "text-lg font-semibold",
              body: "text-surface",
              secondary: "text-muted",
              success: "text-info",
              error: "text-error",
              mono: "font-mono"
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
        description: "Tooltip component",
        importPath: "@cloudflare/kumo",
        category: "Overlay",
        props: {
          align: {
            type: "TooltipAlign",
            optional: true
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
        Navigation: [
          "MenuBar",
          "Pagination",
          "Tabs"
        ],
        Other: [
          "SensitiveInput"
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
      return;
    }
    var fill = {
      type: "SOLID",
      color: { r: 1, g: 1, b: 1 }
    };
    fill = figma.variables.setBoundVariableForPaint(fill, "color", variable);
    textNode.fills = [fill];
  }
  async function createBadgeComponent(variant) {
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
    const textNode = await createTextNode(
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
  }
  var SECTION_PADDING = 48;
  var SECTION_GAP = 80;
  async function generateBadgeComponents(startY) {
    if (startY === void 0) startY = 100;
    var componentsPage = figma.root.children.find(function(page) {
      return page.type === "PAGE" && page.name === "Components";
    });
    if (!componentsPage) {
      componentsPage = figma.createPage();
      componentsPage.name = "Components";
    }
    figma.currentPage = componentsPage;
    const section = getOrCreateSection(componentsPage, "Badge");
    const variants = variantProp.values;
    const components = [];
    var currentX = 0;
    var componentGap = 20;
    for (var i = 0; i < variants.length; i++) {
      const component = await createBadgeComponent(variants[i]);
      component.x = currentX;
      component.y = 0;
      currentX = currentX + component.width + componentGap;
      components.push(component);
    }
    const componentSet = figma.combineAsVariants(components, componentsPage);
    componentSet.name = "Badge";
    componentSet.description = "Badge component with variant styles";
    section.appendChild(componentSet);
    componentSet.x = SECTION_PADDING;
    componentSet.y = SECTION_PADDING;
    const totalWidth = componentSet.width + SECTION_PADDING * 2;
    const totalHeight = componentSet.height + SECTION_PADDING * 2;
    section.resizeWithoutConstraints(totalWidth, totalHeight);
    section.x = 100;
    section.y = startY;
    console.log(
      "\u2705 Generated Badge ComponentSet with " + variants.length + " variants"
    );
    console.log(
      "Badge section height: " + totalHeight + ", nextY: " + (startY + totalHeight + SECTION_GAP)
    );
    return startY + totalHeight + SECTION_GAP;
  }

  // scripts/figma/plugin/generators/button-text.ts
  var buttonProps = component_registry_default.components.Button.props;
  var variantProp2 = buttonProps.variant;
  var sizeProp = buttonProps.size;
  var SECTION_PADDING2 = 48;
  var SECTION_GAP2 = 80;
  function setWhiteTextColor2(textNode) {
    const fill = {
      type: "SOLID",
      color: { r: 1, g: 1, b: 1 }
    };
    textNode.fills = [fill];
  }
  function bindTextColorToVariable2(textNode, variableId) {
    const variable = figma.variables.getVariableById(variableId);
    if (!variable) {
      console.warn("Variable not found: " + variableId);
      return;
    }
    var fill = {
      type: "SOLID",
      color: { r: 1, g: 1, b: 1 }
    };
    fill = figma.variables.setBoundVariableForPaint(fill, "color", variable);
    textNode.fills = [fill];
  }
  async function createButtonComponent(variant, size) {
    const variantClasses = variantProp2.classes[variant] || "";
    const sizeClasses = sizeProp.classes[size] || "";
    const variantDesc = variantProp2.descriptions[variant] || "";
    const sizeDesc = sizeProp.descriptions[size] || "";
    const variantStyles = parseTailwindClasses(variantClasses);
    const sizeStyles = parseTailwindClasses(sizeClasses);
    const component = figma.createComponent();
    component.name = "variant=" + variant + ", size=" + size;
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
    component.cornerRadius = sizeStyles.borderRadius || 8;
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
      }
    }
    const fontWeight = 500;
    const textNode = await createTextNode(
      "Button",
      sizeStyles.fontSize || 16,
      fontWeight
    );
    textNode.name = "Label";
    if (variantStyles.isWhiteText) {
      setWhiteTextColor2(textNode);
    } else if (variantStyles.textVariable) {
      const textVar = getVariableByName(variantStyles.textVariable);
      if (textVar) {
        bindTextColorToVariable2(textNode, textVar.id);
      }
    }
    component.appendChild(textNode);
    return component;
  }
  async function generateButtonTextComponents(page, startY) {
    if (startY === void 0) startY = 100;
    figma.currentPage = page;
    const section = getOrCreateSection(page, "Button");
    const variants = variantProp2.values;
    const sizes = sizeProp.values;
    const components = [];
    var componentGap = 20;
    var rowHeight = 60;
    for (var i = 0; i < variants.length; i++) {
      var currentX = 0;
      for (var j = 0; j < sizes.length; j++) {
        const component = await createButtonComponent(variants[i], sizes[j]);
        component.x = currentX;
        component.y = i * rowHeight;
        currentX = currentX + component.width + componentGap;
        components.push(component);
      }
    }
    const componentSet = figma.combineAsVariants(components, page);
    componentSet.name = "Button";
    componentSet.description = "Button component with variant and size properties";
    section.appendChild(componentSet);
    componentSet.x = SECTION_PADDING2;
    componentSet.y = SECTION_PADDING2;
    const totalWidth = componentSet.width + SECTION_PADDING2 * 2;
    const totalHeight = componentSet.height + SECTION_PADDING2 * 2;
    section.resizeWithoutConstraints(totalWidth, totalHeight);
    section.x = 100;
    section.y = startY;
    console.log(
      "\u2705 Generated Button ComponentSet with " + components.length + " variants (" + variants.length + " variants \xD7 " + sizes.length + " sizes)"
    );
    console.log(
      "Button section height: " + totalHeight + ", startY was: " + startY
    );
    return startY + totalHeight + SECTION_GAP2;
  }
  var BUTTON_VARIANTS_EXPORT = variantProp2.values;
  var BUTTON_SIZES_EXPORT = sizeProp.values;

  // scripts/figma/plugin/code.ts
  figma.showUI(__html__, { width: 400, height: 300 });
  function getOrCreateComponentsPage() {
    let componentsPage = figma.root.children.find(
      (page) => page.type === "PAGE" && page.name === "Components"
    );
    if (!componentsPage) {
      componentsPage = figma.createPage();
      componentsPage.name = "Components";
    }
    return componentsPage;
  }
  function purgeExistingContent() {
    const componentsPage = figma.root.children.find(
      (page) => page.type === "PAGE" && page.name === "Components"
    );
    if (componentsPage) {
      const children = [...componentsPage.children];
      for (const node of children) {
        node.remove();
      }
    }
    console.log("\u2705 Purged existing generated content");
  }
  var START_Y = 100;
  figma.ui.onmessage = async (msg) => {
    if (msg.type === "generate") {
      try {
        figma.notify("Starting Kumo UI Kit generation...");
        purgeExistingContent();
        const componentsPage = getOrCreateComponentsPage();
        figma.currentPage = componentsPage;
        let nextY = START_Y;
        figma.notify("Generating Badge components...");
        nextY = await generateBadgeComponents(nextY);
        figma.notify("Generating Button components...");
        await generateButtonTextComponents(componentsPage, nextY);
        figma.notify("\u2705 Generation complete!", { timeout: 3e3 });
        figma.closePlugin(
          "Generation complete - created Badge and Button components"
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
  };
})();
