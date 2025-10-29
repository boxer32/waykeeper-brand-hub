import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VoiceTonePlayground from '@/components/VoiceTonePlayground'

// Mock the utils
jest.mock('@/lib/utils', () => ({
  copyToClipboard: jest.fn(),
  showToast: jest.fn(),
}))

describe('VoiceTonePlayground', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders voice and tone playground', () => {
    render(<VoiceTonePlayground />)
    
    expect(screen.getByText('Voice & Tone Playground')).toBeInTheDocument()
    expect(screen.getByText('Select Scenario:')).toBeInTheDocument()
    expect(screen.getByText('Select Audience:')).toBeInTheDocument()
  })

  it('displays scenario dropdown', () => {
    render(<VoiceTonePlayground />)
    
    const scenarioSelect = screen.getByDisplayValue('Booking Confirmation')
    expect(scenarioSelect).toBeInTheDocument()
  })

  it('displays audience buttons', () => {
    render(<VoiceTonePlayground />)
    
    expect(screen.getByText('Backpacker')).toBeInTheDocument()
    expect(screen.getByText('Family')).toBeInTheDocument()
    expect(screen.getByText('Nomad')).toBeInTheDocument()
    expect(screen.getByText('Wellness Seeker')).toBeInTheDocument()
  })

  it('allows changing scenario', async () => {
    const user = userEvent.setup()
    render(<VoiceTonePlayground />)
    
    const scenarioSelect = screen.getByDisplayValue('Booking Confirmation')
    await user.selectOptions(scenarioSelect, 'Social Media Post')
    
    expect(scenarioSelect).toHaveValue('Social Media Post')
  })

  it('allows changing audience', async () => {
    const user = userEvent.setup()
    render(<VoiceTonePlayground />)
    
    const familyButton = screen.getByText('Family')
    await user.click(familyButton)
    
    expect(familyButton).toHaveClass('bg-skypath-blue')
  })

  it('displays good and bad examples', () => {
    render(<VoiceTonePlayground />)
    
    expect(screen.getByText('Good Example')).toBeInTheDocument()
    expect(screen.getByText('Bad Example')).toBeInTheDocument()
  })

  it('shows voice principles', () => {
    render(<VoiceTonePlayground />)
    
    expect(screen.getByText('Voice Principles')).toBeInTheDocument()
    expect(screen.getByText('Core Traits')).toBeInTheDocument()
    expect(screen.getByText('Tone Guidelines')).toBeInTheDocument()
  })

  it('allows copying examples', async () => {
    const user = userEvent.setup()
    const { copyToClipboard, showToast } = require('@/lib/utils')
    
    render(<VoiceTonePlayground />)
    
    const copyButtons = screen.getAllByText('Copy')
    await user.click(copyButtons[0])
    
    expect(copyToClipboard).toHaveBeenCalled()
    expect(showToast).toHaveBeenCalled()
  })

  it('generates random example when button is clicked', async () => {
    const user = userEvent.setup()
    const { showToast } = require('@/lib/utils')
    
    render(<VoiceTonePlayground />)
    
    const randomButton = screen.getByText('Generate Random Example')
    await user.click(randomButton)
    
    expect(showToast).toHaveBeenCalledWith('New example generated!')
  })
})
