const mockMediaDevices = {
  getUserMedia: jest.fn().mockResolvedValueOnce("fake data"),
};

Object.defineProperty(navigator, "mediaDevices", {
  writable: true,
  value: mockMediaDevices,
});
