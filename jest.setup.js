import "@testing-library/jest-dom"

// Mock localStorage with better error handling
const localStorageMock = {
  getItem: jest.fn((key) => {
    // Return null by default, tests can override
    return null
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

// Mock window and localStorage
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
})

// Mock window.confirm
global.confirm = jest.fn(() => true)

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}

// Reset mocks before each test
beforeEach(() => {
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
  global.confirm.mockClear()
  
  // Reset localStorage mock to return null by default
  localStorageMock.getItem.mockReturnValue(null)
})