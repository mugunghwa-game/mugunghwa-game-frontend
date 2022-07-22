const mockMediaDevices = {
  mediaDevices: jest.fn().mockResolvedValueOnce("fake data"),
};

Object.defineProperty(global.navigator, "mediaDevices", {
  writable: true,
  value: mockMediaDevices,
});
