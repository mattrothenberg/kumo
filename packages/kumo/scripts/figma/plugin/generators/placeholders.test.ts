/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Figma API
const mockFigma = {
  createPage: vi.fn(),
  createComponent: vi.fn(),
  createFrame: vi.fn(),
  createEllipse: vi.fn(),
  createRectangle: vi.fn(),
  currentPage: { appendChild: vi.fn() },
};

// @ts-expect-error - Mocking Figma global for testing
global.figma = mockFigma;

describe("placeholders generator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export generatePlaceholderComponents function", async () => {
    const { generatePlaceholderComponents } = await import("./placeholders");
    expect(generatePlaceholderComponents).toBeDefined();
    expect(typeof generatePlaceholderComponents).toBe("function");
  });

  it("should create Utilities page", async () => {
    const mockPage = { name: "", appendChild: vi.fn() };
    const mockComponent = {
      name: "",
      resize: vi.fn(),
      appendChild: vi.fn(),
      fills: [],
      x: 0,
      y: 0,
    };
    const mockEllipse = {
      resize: vi.fn(),
      fills: [],
      x: 0,
      y: 0,
    };

    mockFigma.createPage.mockReturnValue(mockPage);
    mockFigma.createComponent.mockReturnValue(mockComponent);
    mockFigma.createEllipse.mockReturnValue(mockEllipse);

    const { generatePlaceholderComponents } = await import("./placeholders");
    await generatePlaceholderComponents();

    expect(mockFigma.createPage).toHaveBeenCalled();
    expect(mockPage.name).toBe("Utilities");
  });

  it("should generate three placeholder icon sizes", async () => {
    const mockPage = { name: "Utilities", appendChild: vi.fn() };
    const mockComponent = {
      name: "",
      resize: vi.fn(),
      appendChild: vi.fn(),
      fills: [],
    };

    mockFigma.createPage.mockReturnValue(mockPage);
    mockFigma.createComponent.mockReturnValue(mockComponent);
    mockFigma.createEllipse.mockReturnValue({
      resize: vi.fn(),
      fills: [],
      x: 0,
      y: 0,
    });

    const { generatePlaceholderComponents } = await import("./placeholders");
    const result = await generatePlaceholderComponents();

    // Should create 3 placeholder icons + 1 loader = 4 components
    expect(mockFigma.createComponent).toHaveBeenCalledTimes(4);
    expect(result).toHaveProperty("placeholderIcon12");
    expect(result).toHaveProperty("placeholderIcon16");
    expect(result).toHaveProperty("placeholderIcon20");
    expect(result).toHaveProperty("loader");
  });

  it("should create placeholder icons with correct sizes", async () => {
    const mockPage = { name: "Utilities", appendChild: vi.fn() };
    const mockComponent = {
      name: "",
      resize: vi.fn(),
      appendChild: vi.fn(),
      fills: [],
    };
    const mockEllipse = {
      resize: vi.fn(),
      fills: [],
      x: 0,
      y: 0,
    };

    mockFigma.createPage.mockReturnValue(mockPage);
    mockFigma.createComponent.mockReturnValue(mockComponent);
    mockFigma.createEllipse.mockReturnValue(mockEllipse);

    const { generatePlaceholderComponents } = await import("./placeholders");
    await generatePlaceholderComponents();

    // Check that components are resized to correct dimensions
    expect(mockComponent.resize).toHaveBeenCalledWith(12, 12);
    expect(mockComponent.resize).toHaveBeenCalledWith(16, 16);
    expect(mockComponent.resize).toHaveBeenCalledWith(20, 20);
  });

  it("should create loader component", async () => {
    const mockPage = { name: "Utilities", appendChild: vi.fn() };
    const mockComponent = {
      name: "",
      resize: vi.fn(),
      appendChild: vi.fn(),
      fills: [],
    };

    mockFigma.createPage.mockReturnValue(mockPage);
    mockFigma.createComponent.mockReturnValue(mockComponent);
    mockFigma.createEllipse.mockReturnValue({
      resize: vi.fn(),
      fills: [],
      x: 0,
      y: 0,
      strokeWeight: 0,
      strokes: [],
      strokeAlign: "CENTER",
      dashPattern: [],
    });

    const { generatePlaceholderComponents } = await import("./placeholders");
    const result = await generatePlaceholderComponents();

    expect(result.loader).toBeDefined();
  });
});
