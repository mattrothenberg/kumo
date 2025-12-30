/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Figma API
const mockComponent = {
  name: "",
  layoutMode: "",
  primaryAxisAlignItems: "",
  counterAxisAlignItems: "",
  primaryAxisSizingMode: "",
  counterAxisSizingMode: "",
  resize: vi.fn(),
  cornerRadius: 0,
  fills: [],
  strokes: [],
  strokeWeight: 0,
  opacity: 1,
  appendChild: vi.fn(),
  setBoundVariable: vi.fn(),
  createInstance: vi.fn(() => ({
    fills: [],
    appendChild: vi.fn(),
    setBoundVariable: vi.fn(),
    resize: vi.fn(),
  })),
};

const mockComponentSet = {
  name: "",
  appendChild: vi.fn(),
};

const mockSection = {
  name: "",
  appendChild: vi.fn(),
};

const mockVariable = {
  id: "test-var-id",
  name: "test-var",
};

const mockFigma = {
  createComponent: vi.fn(() => ({ ...mockComponent })),
  createComponentSet: vi.fn(() => ({ ...mockComponentSet })),
  createSection: vi.fn(() => ({ ...mockSection })),
  variables: {
    getLocalVariableCollections: vi.fn(() => [
      { name: "kumo-colors", variableIds: ["var1"] },
    ]),
    getVariableById: vi.fn(() => mockVariable),
  },
  currentPage: {
    findChild: vi.fn(),
    appendChild: vi.fn(),
  },
  notify: vi.fn(),
};

(global as any).figma = mockFigma;

describe("button-icon generator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export generateButtonIconComponents function", async () => {
    const { generateButtonIconComponents } = await import("./button-icon");
    expect(generateButtonIconComponents).toBeDefined();
    expect(typeof generateButtonIconComponents).toBe("function");
  });

  it("should generate 24 ComponentSets (6 variants × 4 sizes)", async () => {
    const { generateButtonIconComponents } = await import("./button-icon");
    const mockPage = { findChild: vi.fn(), appendChild: vi.fn() } as any;
    const placeholders = {
      placeholderIcon12: mockComponent as any,
      placeholderIcon16: mockComponent as any,
      placeholderIcon20: mockComponent as any,
      loader: mockComponent as any,
    };

    await generateButtonIconComponents(mockPage, placeholders);

    // Should create 24 ComponentSets (6 variants × 4 sizes)
    expect(mockFigma.createComponentSet).toHaveBeenCalledTimes(24);
  });

  it("should create sections for each variant", async () => {
    const { generateButtonIconComponents } = await import("./button-icon");
    const mockPage = { findChild: vi.fn(), appendChild: vi.fn() } as any;
    const placeholders = {
      placeholderIcon12: mockComponent as any,
      placeholderIcon16: mockComponent as any,
      placeholderIcon20: mockComponent as any,
      loader: mockComponent as any,
    };

    await generateButtonIconComponents(mockPage, placeholders);

    // Should call findChild for each of the 6 sections
    // (Primary Icon, Secondary Icon, Ghost Icon, Destructive Icon, Secondary-Destructive Icon, Outline Icon)
    expect(mockPage.findChild).toHaveBeenCalled();
  });

  it("should create 10 components per ComponentSet (5 states × 2 shapes)", async () => {
    const { generateButtonIconComponents } = await import("./button-icon");
    const mockPage = { findChild: vi.fn(), appendChild: vi.fn() } as any;
    const placeholders = {
      placeholderIcon12: mockComponent as any,
      placeholderIcon16: mockComponent as any,
      placeholderIcon20: mockComponent as any,
      loader: mockComponent as any,
    };

    await generateButtonIconComponents(mockPage, placeholders);

    // Each ComponentSet should receive 10 components (5 states × 2 shapes)
    // 24 ComponentSets × 10 components = 240 total components
    expect(mockFigma.createComponent).toHaveBeenCalledTimes(240);
  });

  it("should name ComponentSets correctly", async () => {
    const { generateButtonIconComponents } = await import("./button-icon");
    const mockPage = { findChild: vi.fn(), appendChild: vi.fn() } as any;
    const placeholders = {
      placeholderIcon12: mockComponent as any,
      placeholderIcon16: mockComponent as any,
      placeholderIcon20: mockComponent as any,
      loader: mockComponent as any,
    };

    const componentSetNames: string[] = [];
    mockFigma.createComponentSet.mockImplementation(() => {
      const set = { ...mockComponentSet };
      Object.defineProperty(set, "name", {
        set: (value) => componentSetNames.push(value),
        get: () => "",
      });
      return set;
    });

    await generateButtonIconComponents(mockPage, placeholders);

    // Check that we have expected button names
    expect(componentSetNames).toContain("Button Primary Icon Xs");
    expect(componentSetNames).toContain("Button Secondary Icon Base");
    expect(componentSetNames).toContain("Button Destructive Icon Lg");
    expect(componentSetNames).toContain("Button Secondary Destructive Icon Sm");
  });

  it("should name components with State and Shape properties", async () => {
    const { generateButtonIconComponents } = await import("./button-icon");
    const mockPage = { findChild: vi.fn(), appendChild: vi.fn() } as any;
    const placeholders = {
      placeholderIcon12: mockComponent as any,
      placeholderIcon16: mockComponent as any,
      placeholderIcon20: mockComponent as any,
      loader: mockComponent as any,
    };

    const componentNames: string[] = [];
    mockFigma.createComponent.mockImplementation(() => {
      const comp = { ...mockComponent };
      Object.defineProperty(comp, "name", {
        set: (value) => componentNames.push(value),
        get: () => "",
      });
      return comp;
    });

    await generateButtonIconComponents(mockPage, placeholders);

    // Check for expected state/shape combinations
    expect(componentNames).toContain("State=Default, Shape=square");
    expect(componentNames).toContain("State=Hover, Shape=circle");
    expect(componentNames).toContain("State=Disabled, Shape=square");
    expect(componentNames).toContain("State=Loading, Shape=circle");
  });
});
