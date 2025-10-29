import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AssetLibrary from '@/components/AssetLibrary'

// Mock the utils
jest.mock('@/lib/utils', () => ({
  showToast: jest.fn(),
}))

describe('AssetLibrary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders asset library section', () => {
    render(<AssetLibrary />)
    
    expect(screen.getByText('Asset Library')).toBeInTheDocument()
    expect(screen.getByText('Download all brand assets, templates, and resources in one place')).toBeInTheDocument()
  })

  it('displays asset categories', () => {
    render(<AssetLibrary />)
    
    expect(screen.getByText('Logos')).toBeInTheDocument()
    expect(screen.getByText('Sub-Brand Logos')).toBeInTheDocument()
    expect(screen.getByText('Typography')).toBeInTheDocument()
    expect(screen.getByText('Color Swatches')).toBeInTheDocument()
    expect(screen.getByText('Templates')).toBeInTheDocument()
    expect(screen.getByText('Photography')).toBeInTheDocument()
  })

  it('shows item count for each category', () => {
    render(<AssetLibrary />)
    
    expect(screen.getByText('5 items')).toBeInTheDocument() // Logos
    expect(screen.getByText('4 items')).toBeInTheDocument() // Sub-Brand Logos
    expect(screen.getByText('3 items')).toBeInTheDocument() // Typography
  })

  it('allows expanding categories to show items', async () => {
    const user = userEvent.setup()
    render(<AssetLibrary />)
    
    const logosCategory = screen.getByText('Logos')
    await user.click(logosCategory)
    
    expect(screen.getByText('Primary Logo')).toBeInTheDocument()
    expect(screen.getByText('Compact Logo')).toBeInTheDocument()
    expect(screen.getByText('Icon Only')).toBeInTheDocument()
  })

  it('shows file formats for each asset', async () => {
    const user = userEvent.setup()
    render(<AssetLibrary />)
    
    const logosCategory = screen.getByText('Logos')
    await user.click(logosCategory)
    
    expect(screen.getByText('PNG')).toBeInTheDocument()
    expect(screen.getByText('SVG')).toBeInTheDocument()
    expect(screen.getByText('EPS')).toBeInTheDocument()
    expect(screen.getByText('AI')).toBeInTheDocument()
  })

  it('shows file sizes', async () => {
    const user = userEvent.setup()
    render(<AssetLibrary />)
    
    const logosCategory = screen.getByText('Logos')
    await user.click(logosCategory)
    
    expect(screen.getByText('2.3MB')).toBeInTheDocument()
    expect(screen.getByText('1.8MB')).toBeInTheDocument()
  })

  it('allows downloading individual assets', async () => {
    const user = userEvent.setup()
    const { showToast } = require('@/lib/utils')
    
    render(<AssetLibrary />)
    
    const logosCategory = screen.getByText('Logos')
    await user.click(logosCategory)
    
    const downloadButtons = screen.getAllByText('PNG')
    await user.click(downloadButtons[0])
    
    expect(showToast).toHaveBeenCalledWith(expect.stringContaining('Downloading'))
  })

  it('shows quick access section', () => {
    render(<AssetLibrary />)
    
    expect(screen.getByText('Quick Access')).toBeInTheDocument()
    expect(screen.getByText('Primary Logo')).toBeInTheDocument()
    expect(screen.getByText('Color Palette')).toBeInTheDocument()
    expect(screen.getByText('Inter Font')).toBeInTheDocument()
  })

  it('displays version information', () => {
    render(<AssetLibrary />)
    
    expect(screen.getByText('Current Version:')).toBeInTheDocument()
    expect(screen.getByText('v5.0 (Dec 2024)')).toBeInTheDocument()
    expect(screen.getByText('Last updated: December 15, 2024')).toBeInTheDocument()
  })

  it('allows downloading all assets', async () => {
    const user = userEvent.setup()
    const { showToast } = require('@/lib/utils')
    
    render(<AssetLibrary />)
    
    const downloadAllButton = screen.getByText('Download All Assets (ZIP - 250MB)')
    await user.click(downloadAllButton)
    
    expect(showToast).toHaveBeenCalledWith('Preparing download package...')
  })
})
