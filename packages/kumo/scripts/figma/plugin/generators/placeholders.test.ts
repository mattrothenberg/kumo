/**
 * @vitest-environment node
 *
 * Tests for placeholders.ts component generator
 *
 * Note: These tests mock the Figma Plugin API. Full integration tests
 * require running in the actual Figma plugin environment.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Create mock factories for consistent mock objects
const createMockRectangle = () => ({
  resize: vi.fn(),
  fills: [] as unknown[],
  x: 0,
  y: 0,
  cornerRadius: 0,
});

const createMockEllipse = () => ({
  resize: vi.fn(),
  fills: [] as unknown[],
  strokes: [] as unknown[],
  x: 0,
  y: 0,
  strokeWeight: 0,
  strokeAlign: "CENTER" as const,
  dashPattern: [] as number[],
});

const createMockComponent = () => ({
  name: "",
  resize: vi.fn(),
  appendChild: vi.fn(),
  fills: [] as unknown[],
  x: 0,
  y: 0,
});

const createMockPage = () => ({
  name: "",
  appendChild: vi.fn(),
});

// Mock Figma API
const mockFigma = {
  createPage: vi.fn(() => createMockPage()),
  createComponent: vi.fn(() => createMockComponent()),
  createFrame: vi.fn(),
  createEllipse: vi.fn(() => createMockEllipse()),
  createRectangle: vi.fn(() => createMockRectangle()),
  currentPage: { appendChild: vi.fn() },
};

// @ts-expect-error - Mocking Figma global for testing
global.figma = mockFigma;

describe("placeholders generator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock implementations
    mockFigma.createPage.mockImplementation(() => createMockPage());
    mockFigma.createComponent.mockImplementation(() => createMockComponent());
    mockFigma.createEllipse.mockImplementation(() => createMockEllipse());
    mockFigma.createRectangle.mockImplementation(() => createMockRectangle());
  });

  it("should export generatePlaceholderComponents function", async () => {
    const { generatePlaceholderComponents } = await import("./placeholders");
    expect(generatePlaceholderComponents).toBeDefined();
    expect(typeof generatePlaceholderComponents).toBe("function");
  });

  it("should create Utilities page", async () => {
    const mockPage = createMockPage();
    mockFigma.createPage.mockReturnValue(mockPage);

    const { generatePlaceholderComponents } = await import("./placeholders");
    generatePlaceholderComponents();

    expect(mockFigma.createPage).toHaveBeenCalled();
    expect(mockPage.name).toBe("Utilities");
  });

  it("should generate three placeholder icon sizes plus loader", async () => {
    const { generatePlaceholderComponents } = await import("./placeholders");
    const result = generatePlaceholderComponents();

    // Should create 3 placeholder icons + 1 loader = 4 components
    expect(mockFigma.createComponent).toHaveBeenCalledTimes(4);
    expect(result).toHaveProperty("placeholderIcon12");
    expect(result).toHaveProperty("placeholderIcon16");
    expect(result).toHaveProperty("placeholderIcon20");
    expect(result).toHaveProperty("loader");
  });

  it("should create placeholder icons with rectangles", async () => {
    const { generatePlaceholderComponents } = await import("./placeholders");
    generatePlaceholderComponents();

    // Should create 3 rectangles for placeholder icons
    expect(mockFigma.createRectangle).toHaveBeenCalledTimes(3);
  });

  it("should create loader with ellipse", async () => {
    const { generatePlaceholderComponents } = await import("./placeholders");
    generatePlaceholderComponents();

    // Should create 1 ellipse for loader
    expect(mockFigma.createEllipse).toHaveBeenCalledTimes(1);
  });
});
