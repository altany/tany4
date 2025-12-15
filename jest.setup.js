// jest.setup.js

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
