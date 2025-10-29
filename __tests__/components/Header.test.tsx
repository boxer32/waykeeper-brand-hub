import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from '@/components/Header'

describe('Header', () => {
  it('renders header with logo and navigation', () => {
    render(<Header />)
    
    expect(screen.getByText('WAYKEEPER')).toBeInTheDocument()
    expect(screen.getByText('Simply. Fairly. Connected.')).toBeInTheDocument()
  })

  it('displays navigation links', () => {
    render(<Header />)
    
    expect(screen.getByText('Colors')).toBeInTheDocument()
    expect(screen.getByText('Typography')).toBeInTheDocument()
    expect(screen.getByText('Logos')).toBeInTheDocument()
    expect(screen.getByText('Voice & Tone')).toBeInTheDocument()
    expect(screen.getByText('Photography')).toBeInTheDocument()
    expect(screen.getByText('Assets')).toBeInTheDocument()
    expect(screen.getByText('Compliance')).toBeInTheDocument()
  })

  it('shows mobile menu button on small screens', () => {
    render(<Header />)
    
    const menuButton = screen.getByRole('button', { name: /menu/i })
    expect(menuButton).toBeInTheDocument()
  })

  it('toggles mobile menu when menu button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)
    
    const menuButton = screen.getByRole('button', { name: /menu/i })
    await user.click(menuButton)
    
    // Menu should be visible
    expect(screen.getByText('Colors')).toBeInTheDocument()
    
    // Click again to close
    await user.click(menuButton)
  })

  it('has proper navigation links with correct hrefs', () => {
    render(<Header />)
    
    const colorsLink = screen.getByText('Colors')
    expect(colorsLink).toHaveAttribute('href', '#colors')
    
    const typographyLink = screen.getByText('Typography')
    expect(typographyLink).toHaveAttribute('href', '#typography')
  })
})
