// jest.setup.js

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock("next/dynamic", () => {
  const dynamic = () => {
    function DynamicMock() {
      return null;
    }
    DynamicMock.displayName = "DynamicMock";
    return DynamicMock;
  };

  return {
    __esModule: true,
    default: dynamic,
  };
});
