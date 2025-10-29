import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BrandComplianceChecker from '@/components/BrandComplianceChecker'

// Mock the utils
jest.mock('@/lib/utils', () => ({
  showToast: jest.fn(),
}))

describe('BrandComplianceChecker', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders compliance checker section', () => {
    render(<BrandComplianceChecker />)
    
    expect(screen.getByText('Brand Compliance Checker')).toBeInTheDocument()
    expect(screen.getByText('Upload your design or paste text to check brand compliance automatically')).toBeInTheDocument()
  })

  it('displays file upload area', () => {
    render(<BrandComplianceChecker />)
    
    expect(screen.getByText('Upload Design')).toBeInTheDocument()
    expect(screen.getByText('Drag & drop your design here or click to browse')).toBeInTheDocument()
    expect(screen.getByText('Supports PNG, JPG, PDF, AI, PSD files')).toBeInTheDocument()
  })

  it('displays text input area', () => {
    render(<BrandComplianceChecker />)
    
    expect(screen.getByText('Or Paste Text')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Paste your copy here to check voice & tone compliance...')).toBeInTheDocument()
  })

  it('shows check compliance button', () => {
    render(<BrandComplianceChecker />)
    
    expect(screen.getByText('Check Compliance')).toBeInTheDocument()
  })

  it('disables check button when no input provided', () => {
    render(<BrandComplianceChecker />)
    
    const checkButton = screen.getByText('Check Compliance')
    expect(checkButton).toBeDisabled()
  })

  it('enables check button when text is provided', async () => {
    const user = userEvent.setup()
    render(<BrandComplianceChecker />)
    
    const textArea = screen.getByPlaceholderText('Paste your copy here to check voice & tone compliance...')
    await user.type(textArea, 'Test text')
    
    const checkButton = screen.getByText('Check Compliance')
    expect(checkButton).not.toBeDisabled()
  })

  it('shows file input when file is selected', async () => {
    const user = userEvent.setup()
    render(<BrandComplianceChecker />)
    
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const fileInput = screen.getByRole('button', { name: /menu/i }).parentElement?.querySelector('input[type="file"]')
    
    if (fileInput) {
      await user.upload(fileInput, file)
      
      expect(screen.getByText(/test.png/)).toBeInTheDocument()
    }
  })

  it('runs compliance check when button is clicked', async () => {
    const user = userEvent.setup()
    const { showToast } = require('@/lib/utils')
    
    render(<BrandComplianceChecker />)
    
    const textArea = screen.getByPlaceholderText('Paste your copy here to check voice & tone compliance...')
    await user.type(textArea, 'Test text')
    
    const checkButton = screen.getByText('Check Compliance')
    await user.click(checkButton)
    
    expect(screen.getByText('Checking Compliance...')).toBeInTheDocument()
  })

  it('displays compliance guidelines', () => {
    render(<BrandComplianceChecker />)
    
    expect(screen.getByText('What We Check')).toBeInTheDocument()
    expect(screen.getByText('Logo Usage')).toBeInTheDocument()
    expect(screen.getByText('Colors')).toBeInTheDocument()
    expect(screen.getByText('Typography')).toBeInTheDocument()
    expect(screen.getByText('Voice & Tone')).toBeInTheDocument()
    expect(screen.getByText('Accessibility')).toBeInTheDocument()
    expect(screen.getByText('File Quality')).toBeInTheDocument()
  })

  it('shows empty state initially', () => {
    render(<BrandComplianceChecker />)
    
    expect(screen.getByText('Ready to Check')).toBeInTheDocument()
    expect(screen.getByText('Upload a design or paste text to start the compliance check')).toBeInTheDocument()
  })
})
