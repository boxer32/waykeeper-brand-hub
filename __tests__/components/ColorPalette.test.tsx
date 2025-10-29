import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ColorPalette from '@/components/ColorPalette'

// Mock the utils
jest.mock('@/lib/utils', () => ({
  copyToClipboard: jest.fn(),
  showToast: jest.fn(),
}))

describe('ColorPalette', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders color palette section', () => {
    render(<ColorPalette />)
    
    expect(screen.getByText('Color Palette')).toBeInTheDocument()
    expect(screen.getByText('Master Brand Colors')).toBeInTheDocument()
    expect(screen.getByText('Accent Colors')).toBeInTheDocument()
  })

  it('displays master brand colors', () => {
    render(<ColorPalette />)
    
    expect(screen.getByText('Skypath Blue')).toBeInTheDocument()
    expect(screen.getByText('Morning Gold')).toBeInTheDocument()
    expect(screen.getByText('Earth Green')).toBeInTheDocument()
    expect(screen.getByText('Mist Grey')).toBeInTheDocument()
  })

  it('displays color hex codes', () => {
    render(<ColorPalette />)
    
    expect(screen.getByText('#77BEF0')).toBeInTheDocument()
    expect(screen.getByText('#F9D88C')).toBeInTheDocument()
    expect(screen.getByText('#4A7C59')).toBeInTheDocument()
    expect(screen.getByText('#E5E1DC')).toBeInTheDocument()
  })

  it('allows copying color codes', async () => {
    const user = userEvent.setup()
    const { copyToClipboard, showToast } = require('@/lib/utils')
    
    render(<ColorPalette />)
    
    const copyButtons = screen.getAllByText('Copy')
    await user.click(copyButtons[0])
    
    expect(copyToClipboard).toHaveBeenCalled()
    expect(showToast).toHaveBeenCalled()
  })

  it('shows sub-brand colors when toggled', async () => {
    const user = userEvent.setup()
    render(<ColorPalette />)
    
    const toggleButton = screen.getByText(/Show Sub-Brand Colors/)
    await user.click(toggleButton)
    
    expect(screen.getByText('Sub-Brand Colors')).toBeInTheDocument()
    expect(screen.getByText('Heart Rose')).toBeInTheDocument()
    expect(screen.getByText('Journey Coral')).toBeInTheDocument()
  })

  it('displays usage guidelines for each color', () => {
    render(<ColorPalette />)
    
    expect(screen.getByText('Used for:')).toBeInTheDocument()
    expect(screen.getByText('Avoid:')).toBeInTheDocument()
    expect(screen.getByText('Contrast:')).toBeInTheDocument()
  })

  it('shows contrast information', () => {
    render(<ColorPalette />)
    
    expect(screen.getByText('AAA (WCAG compliant)')).toBeInTheDocument()
    expect(screen.getByText('7.2:1')).toBeInTheDocument()
  })
})
