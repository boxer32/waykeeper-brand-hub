'use client'

import { useState } from 'react'
import { Copy, Check, Download, Eye } from 'lucide-react'
import { copyToClipboard, showToast } from '@/lib/utils'

const logoVariations = [
  {
    name: 'Primary Logo',
    description: 'Main logo with full tagline',
    usage: 'Website headers, business cards, presentations',
    imagePath: '/logos/master/primary-logo.png',
    example: (
      <div className="text-center p-8 bg-white border-2 border-mist-grey rounded-lg">
        <img 
          src="/logos/master/primary-logo.png" 
          alt="Primary Logo" 
          className="max-h-16 mx-auto mb-2"
          onError={(e) => {
            // Fallback to text if image not found
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling.style.display = 'block';
          }}
        />
        <div className="text-3xl font-bold text-skypath-blue mb-2" style={{display: 'none'}}>WAYKEEPER</div>
        <div className="text-sm font-medium text-deep-earth">
          Simply. Fairly.<br />
          Connected.
        </div>
      </div>
    )
  },
  {
    name: 'Compact Logo',
    description: 'Logo with abbreviated tagline',
    usage: 'Mobile apps, small spaces, social media',
    imagePath: '/logos/master/compact-logo.png',
    example: (
      <div className="text-center p-8 bg-white border-2 border-mist-grey rounded-lg">
        <img 
          src="/logos/master/compact-logo.png" 
          alt="Compact Logo" 
          className="max-h-12 mx-auto mb-1"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling.style.display = 'block';
          }}
        />
        <div className="text-2xl font-bold text-skypath-blue mb-1" style={{display: 'none'}}>WAYKEEPER</div>
        <div className="text-xs font-medium text-deep-earth">SFC</div>
        <div className="text-xs text-deep-earth/60">(Simply. Fairly. Connected.)</div>
      </div>
    )
  },
  {
    name: 'Icon Only',
    description: 'Minimal icon version',
    usage: 'Favicons, app icons, very small spaces',
    imagePath: '/logos/master/icon-only.png',
    example: (
      <div className="text-center p-8 bg-white border-2 border-mist-grey rounded-lg">
        <img 
          src="/logos/master/icon-only.png" 
          alt="Icon Only" 
          className="w-16 h-16 mx-auto"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling.style.display = 'flex';
          }}
        />
        <div className="w-16 h-16 bg-skypath-blue rounded-lg mx-auto flex items-center justify-center" style={{display: 'none'}}>
          <div className="text-white font-bold text-xl">W</div>
        </div>
      </div>
    )
  },
  {
    name: 'Monochrome White',
    description: 'White version for dark backgrounds',
    usage: 'Dark themes, overlays, dark backgrounds',
    imagePath: '/logos/master/monochrome-white.png',
    example: (
      <div className="text-center p-8 bg-deep-earth border-2 border-mist-grey rounded-lg">
        <img 
          src="/logos/master/monochrome-white.png" 
          alt="Monochrome White Logo" 
          className="max-h-16 mx-auto mb-2"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling.style.display = 'block';
          }}
        />
        <div className="text-3xl font-bold text-white mb-2" style={{display: 'none'}}>WAYKEEPER</div>
        <div className="text-sm font-medium text-white/80">
          Simply. Fairly.<br />
          Connected.
        </div>
      </div>
    )
  },
  {
    name: 'Monochrome Black',
    description: 'Black version for light backgrounds',
    usage: 'Print materials, single-color applications',
    imagePath: '/logos/master/monochrome-black.png',
    example: (
      <div className="text-center p-8 bg-white border-2 border-mist-grey rounded-lg">
        <img 
          src="/logos/master/monochrome-black.png" 
          alt="Monochrome Black Logo" 
          className="max-h-16 mx-auto mb-2"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling.style.display = 'block';
          }}
        />
        <div className="text-3xl font-bold text-deep-earth mb-2" style={{display: 'none'}}>WAYKEEPER</div>
        <div className="text-sm font-medium text-deep-earth/80">
          Simply. Fairly.<br />
          Connected.
        </div>
      </div>
    )
  }
]

const subBrandLogos = [
  {
    name: 'Waykeeper Explore',
    accentColor: '#FF894F',
    tagline: 'Book in one tap. Fair prices, real experiences.',
    example: (
      <div className="text-center p-8 bg-white border-2 border-mist-grey rounded-lg">
        <div className="text-2xl font-bold text-skypath-blue mb-1">WAYKEEPER</div>
        <div className="text-lg font-semibold text-journey-coral mb-2">EXPLORE</div>
        <div className="text-sm font-medium text-deep-earth">
          Book in one tap. Fair prices,<br />
          real experiences.
        </div>
      </div>
    )
  },
  {
    name: 'Waykeeper Move',
    accentColor: '#77BEF0',
    tagline: 'One booking. Fair rates. Seamlessly connected journeys.',
    example: (
      <div className="text-center p-8 bg-white border-2 border-mist-grey rounded-lg">
        <div className="text-2xl font-bold text-skypath-blue mb-1">WAYKEEPER</div>
        <div className="text-lg font-semibold text-skypath-blue mb-2">MOVE</div>
        <div className="text-sm font-medium text-deep-earth">
          One booking. Fair rates.<br />
          Seamlessly connected journeys.
        </div>
      </div>
    )
  },
  {
    name: 'Waykeeper Restore',
    accentColor: '#EA5B6F',
    tagline: 'Easy booking. Honest prices. Connected to Thai wisdom.',
    example: (
      <div className="text-center p-8 bg-white border-2 border-mist-grey rounded-lg">
        <div className="text-2xl font-bold text-skypath-blue mb-1">WAYKEEPER</div>
        <div className="text-lg font-semibold text-heart-rose mb-2">RESTORE</div>
        <div className="text-sm font-medium text-deep-earth">
          Easy booking. Honest prices.<br />
          Connected to Thai wisdom.
        </div>
      </div>
    )
  },
  {
    name: 'Waykeeper Circle',
    accentColor: '#8B7AB8',
    tagline: 'Simply rewarding. Fairly generous. Stay connected.',
    example: (
      <div className="text-center p-8 bg-white border-2 border-mist-grey rounded-lg">
        <div className="text-2xl font-bold text-skypath-blue mb-1">WAYKEEPER</div>
        <div className="text-lg font-semibold text-loop-purple mb-2">CIRCLE</div>
        <div className="text-sm font-medium text-deep-earth">
          Simply rewarding. Fairly generous.<br />
          Stay connected.
        </div>
      </div>
    )
  }
]

export default function LogoVariations() {
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [showSubBrands, setShowSubBrands] = useState(false)

  const handleCopy = (text: string, type: string) => {
    copyToClipboard(text)
    setCopiedText(`${type}-${text}`)
    showToast(`${type} copied!`)
    
    setTimeout(() => setCopiedText(null), 2000)
  }

  const downloadAsset = (assetName: string) => {
    showToast(`Downloading ${assetName}...`)
    // In a real implementation, this would trigger actual file downloads
  }

  return (
    <section id="logos" className="py-16 bg-gradient-to-br from-mist-grey to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-deep-earth mb-4">
            Logo Variations
          </h2>
          <p className="text-lg text-deep-earth/70 max-w-2xl mx-auto mb-4">
            Consistent logo usage across all touchpoints and applications
          </p>
          <p className="text-base text-deep-earth/60 max-w-3xl mx-auto">
            🏷️ นี่คือโลโก้ของ Waykeeper ที่มีหลายแบบ เหมือนมีทั้งแบบเต็ม แบบย่อ และแบบไอคอน 
            เพื่อให้ใช้ได้ในที่ต่างๆ เช่น เว็บไซต์ กระดาษจดหมาย หรือปุ่มเล็กๆ 
            แต่ทุกแบบจะดูเหมือนกันและรู้ทันทีว่าเป็น Waykeeper
          </p>
        </div>

        {/* Master Brand Logos */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-deep-earth mb-8">
            Master Brand Logos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {logoVariations.map((logo, index) => (
              <div key={index} className="card group hover:shadow-lg transition-all duration-300">
                <div className="mb-4">
                  {logo.example}
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-deep-earth mb-2">{logo.name}</h4>
                  <p className="text-sm text-deep-earth/70 mb-2">{logo.description}</p>
                  <p className="text-xs text-deep-earth/60">{logo.usage}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(logo.name, 'Logo Name')}
                    className="copy-button flex items-center gap-1 flex-1"
                  >
                    {copiedText === `Logo Name-${logo.name}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    Copy Name
                  </button>
                  <button
                    onClick={() => downloadAsset(`${logo.name}.png`)}
                    className="copy-button flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-Brand Logos Toggle */}
        <div className="mb-8">
          <button
            onClick={() => setShowSubBrands(!showSubBrands)}
            className="btn-secondary flex items-center gap-2"
          >
            {showSubBrands ? 'Hide' : 'Show'} Sub-Brand Logos
          </button>
        </div>

        {/* Sub-Brand Logos */}
        {showSubBrands && (
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-deep-earth mb-8">
              Sub-Brand Logos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {subBrandLogos.map((logo, index) => (
                <div key={index} className="card group hover:shadow-lg transition-all duration-300">
                  <div className="mb-4">
                    {logo.example}
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-deep-earth mb-2">{logo.name}</h4>
                    <p className="text-sm text-deep-earth/70 mb-2">{logo.tagline}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-deep-earth/60">Accent Color:</span>
                      <div 
                        className="w-4 h-4 rounded border border-mist-grey"
                        style={{ backgroundColor: logo.accentColor }}
                      ></div>
                      <code className="text-xs bg-mist-grey px-2 py-1 rounded">{logo.accentColor}</code>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(logo.name, 'Logo Name')}
                      className="copy-button flex items-center gap-1 flex-1"
                    >
                      {copiedText === `Logo Name-${logo.name}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Copy Name
                    </button>
                    <button
                      onClick={() => downloadAsset(`${logo.name}.png`)}
                      className="copy-button flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage Guidelines */}
        <div className="card bg-white">
          <h3 className="text-2xl font-semibold text-deep-earth mb-6">Logo Usage Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-deep-earth mb-4">✅ Do</h4>
              <ul className="space-y-2 text-deep-earth/70">
                <li className="flex items-start gap-2">
                  <span className="text-earth-green">✓</span>
                  Maintain clear space around logo (minimum 40px)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-earth-green">✓</span>
                  Use approved color combinations only
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-earth-green">✓</span>
                  Keep proportions intact when scaling
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-earth-green">✓</span>
                  Use appropriate version for space available
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-earth-green">✓</span>
                  Ensure sufficient contrast with background
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-deep-earth mb-4">❌ Don't</h4>
              <ul className="space-y-2 text-deep-earth/70">
                <li className="flex items-start gap-2">
                  <span className="text-heart-rose">✗</span>
                  Distort or stretch the logo
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-heart-rose">✗</span>
                  Change colors arbitrarily
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-heart-rose">✗</span>
                  Use on busy or low-contrast backgrounds
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-heart-rose">✗</span>
                  Make logo smaller than 40px height
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-heart-rose">✗</span>
                  Add effects like shadows or outlines
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Download All Assets */}
        <div className="text-center mt-12">
          <button
            onClick={() => downloadAsset('All Logo Assets.zip')}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Download className="w-4 h-4" />
            Download All Logo Assets (PNG, SVG, EPS, AI)
          </button>
        </div>
      </div>
    </section>
  )
}
