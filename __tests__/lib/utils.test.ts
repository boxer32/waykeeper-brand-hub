import { copyToClipboard, showToast } from '@/lib/utils'

// Mock navigator.clipboard
const mockWriteText = jest.fn()

// Mock document methods
const mockCreateElement = jest.fn()
const mockAppendChild = jest.fn()
const mockRemoveChild = jest.fn()

describe('utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Reset mocks
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    })
    
    Object.assign(document, {
      createElement: mockCreateElement,
      body: {
        appendChild: mockAppendChild,
        removeChild: mockRemoveChild,
      },
    })
  })

  describe('copyToClipboard', () => {
    it('uses navigator.clipboard when available', async () => {
      mockWriteText.mockResolvedValue(undefined)
      
      await copyToClipboard('test text')
      
      expect(mockWriteText).toHaveBeenCalledWith('test text')
    })

    it('falls back to document.execCommand when clipboard is not available', async () => {
      // Mock clipboard as unavailable
      Object.assign(navigator, {
        clipboard: undefined,
      })
      
      // Mock textarea element
      const mockTextArea = {
        value: '',
        select: jest.fn(),
      }
      mockCreateElement.mockReturnValue(mockTextArea)
      
      // Mock document.execCommand
      const mockExecCommand = jest.fn().mockReturnValue(true)
      Object.assign(document, {
        execCommand: mockExecCommand,
      })
      
      await copyToClipboard('test text')
      
      expect(mockCreateElement).toHaveBeenCalledWith('textarea')
      expect(mockAppendChild).toHaveBeenCalledWith(mockTextArea)
      expect(mockTextArea.value).toBe('test text')
      expect(mockTextArea.select).toHaveBeenCalled()
      expect(mockExecCommand).toHaveBeenCalledWith('copy')
      expect(mockRemoveChild).toHaveBeenCalledWith(mockTextArea)
    })
  })

  describe('showToast', () => {
    it('creates and displays toast notification', () => {
      const mockToast = {
        className: '',
        textContent: '',
        remove: jest.fn(),
      }
      mockCreateElement.mockReturnValue(mockToast)
      
      showToast('Test message')
      
      expect(mockCreateElement).toHaveBeenCalledWith('div')
      expect(mockToast.className).toContain('fixed top-4 right-4')
      expect(mockToast.textContent).toBe('Test message')
      expect(mockAppendChild).toHaveBeenCalledWith(mockToast)
    })

    it('removes toast after timeout', () => {
      jest.useFakeTimers()
      
      const mockToast = {
        className: '',
        textContent: '',
        remove: jest.fn(),
      }
      mockCreateElement.mockReturnValue(mockToast)
      
      showToast('Test message')
      
      // Fast-forward time
      jest.advanceTimersByTime(3000)
      
      expect(mockToast.remove).toHaveBeenCalled()
      
      jest.useRealTimers()
    })
  })
})
