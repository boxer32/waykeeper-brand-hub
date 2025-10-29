'use client'

import { useState } from 'react'
import { Copy, Check, Download } from 'lucide-react'
import { copyToClipboard, showToast } from '@/lib/utils'

const subBrands = {
  master: {
    name: 'Waykeeper',
    tagline: 'Simply. Fairly. Connected.',
    description: 'Master brand for all Waykeeper experiences',
    accentColor: '#77BEF0',
    messaging: {
      backpackers: 'Book your Pai adventure in one tap. Quality tours. Honest prices. Local guides. From ฿800.',
      families: 'Safe family adventures in Northern Thailand. Easy planning. Fair pricing. Unforgettable memories. Multi-day packages from ฿1,500.',
      nomads: 'Work remotely. Explore deeply. Belong truly. Basecamp + coworking + community. Monthly packages from ฿25,000.',
      wellness: 'Thai wisdom meets modern wellness. Partner spas + nature retreats. Programs from ฿2,000.'
    }
  },
  explore: {
    name: 'Waykeeper Explore',
    tagline: 'Book in one tap. Fair prices, real experiences.',
    description: 'Adventure & Family Journeys - Local day trips, scenic routes, and small-group adventures',
    accentColor: '#FF894F',
    revenue: '70% of total revenue',
    messaging: {
      backpackers: 'Discover hidden gems in Pai. Small groups, big adventures. From ฿800.',
      families: 'Family-friendly adventures. Safe, fun, memorable. Perfect for all ages.',
      nomads: 'Adventure breaks between work. Flexible scheduling, authentic experiences.',
      wellness: 'Nature-based wellness tours. Connect with local healing traditions.'
    }
  },
  move: {
    name: 'Waykeeper Move',
    tagline: 'One booking. Fair rates. Seamlessly connected journeys.',
    description: 'Transport & Connection - Local transfers between Pai, Pang Mapha, and Mae Hong Son',
    accentColor: '#77BEF0',
    revenue: '20% of total revenue',
    messaging: {
      backpackers: 'Reliable transport, fair prices. No overcharging, no surprises.',
      families: 'Safe, comfortable family transport. Child seats available.',
      nomads: 'Flexible transport for your schedule. Work-friendly routes.',
      wellness: 'Peaceful journeys to wellness destinations. Mindful travel.'
    }
  },
  restore: {
    name: 'Waykeeper Restore',
    tagline: 'Easy booking. Honest prices. Connected to Thai wisdom.',
    description: 'Partner Wellness - Commission-based partnerships with local spas and yoga studios',
    accentColor: '#EA5B6F',
    revenue: '5% of total revenue',
    messaging: {
      backpackers: 'Affordable wellness experiences. Local wisdom, fair prices.',
      families: 'Family wellness activities. Relax and reconnect together.',
      nomads: 'Work-life balance support. Wellness breaks for digital nomads.',
      wellness: 'Authentic Thai wellness. Traditional healing, modern comfort.'
    }
  },
  circle: {
    name: 'Waykeeper Circle',
    tagline: 'Simply rewarding. Fairly generous. Stay connected.',
    description: 'Referral & Loyalty Program - Simple email-based referral system for repeat customers',
    accentColor: '#8B7AB8',
    revenue: '5% of total revenue',
    messaging: {
      backpackers: 'Refer friends, earn rewards. Simple, fair, generous.',
      families: 'Share the adventure. Family referral program with great rewards.',
      nomads: 'Build your community. Refer fellow nomads, grow together.',
      wellness: 'Share wellness wisdom. Refer others to healing experiences.'
    }
  }
}

export default function SubBrandSelector() {
  const [selectedBrand, setSelectedBrand] = useState<keyof typeof subBrands>('master')
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const handleCopy = (text: string, type: string) => {
    copyToClipboard(text)
    setCopiedText(`${type}-${text}`)
    showToast(`${type} copied!`)
    
    setTimeout(() => setCopiedText(null), 2000)
  }

  const currentBrand = subBrands[selectedBrand]

  return (
    <section id="subbrands" className="py-16 bg-gradient-to-br from-mist-grey to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-deep-earth mb-4">
            Sub-Brand Selector
          </h2>
          <p className="text-lg text-deep-earth/70 max-w-2xl mx-auto mb-4">
            Switch between master brand and sub-brands to see specific guidelines and assets
          </p>
          <p className="text-base text-deep-earth/60 max-w-3xl mx-auto">
            🎯 นี่คือเครื่องมือเลือกแบรนด์ย่อยของ Waykeeper เหมือนมีหลายแผนกในโรงเรียน 
            แต่ละแผนกมีสีและข้อความเป็นของตัวเอง เช่น แผนกทัวร์ แผนกรถ แผนกสปา 
            แต่ยังคงเป็น Waykeeper เหมือนเดิม
          </p>
        </div>

        {/* Brand Selector */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-deep-earth mb-6">Select Brand</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(subBrands).map(([key, brand]) => (
              <button
                key={key}
                onClick={() => setSelectedBrand(key as keyof typeof subBrands)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedBrand === key
                    ? 'border-skypath-blue bg-skypath-blue/5'
                    : 'border-mist-grey hover:border-skypath-blue/50 hover:bg-skypath-blue/5'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-mist-grey"
                    style={{ backgroundColor: brand.accentColor }}
                  ></div>
                  <span className="font-semibold text-deep-earth text-sm">
                    {key === 'master' ? 'Master' : brand.name.split(' ')[1]}
                  </span>
                </div>
                <p className="text-xs text-deep-earth/60">{brand.description.split(' - ')[0]}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Brand Display */}
        <div className="space-y-8">
          {/* Brand Header */}
          <div className="card bg-white">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-deep-earth mb-2">
                  {currentBrand.name}
                </h3>
                <p className="text-lg text-deep-earth/70 mb-4">{currentBrand.tagline}</p>
                <p className="text-deep-earth/60">{currentBrand.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg border-2 border-mist-grey"
                  style={{ backgroundColor: currentBrand.accentColor }}
                ></div>
                <code className="text-sm bg-mist-grey px-2 py-1 rounded">
                  {currentBrand.accentColor}
                </code>
              </div>
            </div>

            {selectedBrand !== 'master' && (
              <div className="bg-mist-grey/50 p-4 rounded-lg">
                <p className="text-sm text-deep-earth/70">
                  <strong>Revenue Model:</strong> {(currentBrand as any).revenue || 'N/A'}
                </p>
              </div>
            )}
          </div>

          {/* Messaging by Audience */}
          <div className="card">
            <h4 className="text-xl font-semibold text-deep-earth mb-6">Messaging by Audience</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(currentBrand.messaging).map(([audience, message]) => (
                <div key={audience} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-deep-earth capitalize">{audience}</h5>
                    <button
                      onClick={() => handleCopy(message, `${audience} Message`)}
                      className="copy-button opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedText === `${audience} Message-${message}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <p className="text-sm text-deep-earth/70 leading-relaxed">{message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Logo Variations */}
          <div className="card">
            <h4 className="text-xl font-semibold text-deep-earth mb-6">Logo Variations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Primary', 'Compact', 'Icon Only'].map((variation) => (
                <div key={variation} className="text-center">
                  <div className="bg-mist-grey rounded-lg p-8 mb-4">
                    <div className="text-deep-earth/40 text-sm">[{variation} Logo]</div>
                  </div>
                  <h5 className="font-medium text-deep-earth mb-2">{variation}</h5>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleCopy(`${currentBrand.name} ${variation}`, 'Logo')}
                      className="copy-button text-xs"
                    >
                      {copiedText === `Logo-${currentBrand.name} ${variation}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => showToast(`Downloading ${variation} logo...`)}
                      className="copy-button text-xs"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Examples */}
          <div className="card">
            <h4 className="text-xl font-semibold text-deep-earth mb-6">Usage Examples</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-mist-grey rounded-lg p-4">
                  <div className="text-deep-earth/40 text-sm mb-2">[Tour Listing Mockup]</div>
                  <div className="text-sm text-deep-earth/70">
                    Example of how {currentBrand.name} appears in tour listings
                  </div>
                </div>
                <div className="bg-mist-grey rounded-lg p-4">
                  <div className="text-deep-earth/40 text-sm mb-2">[Social Media Post]</div>
                  <div className="text-sm text-deep-earth/70">
                    Social media content using {currentBrand.name} branding
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-mist-grey rounded-lg p-4">
                  <div className="text-deep-earth/40 text-sm mb-2">[Email Template]</div>
                  <div className="text-sm text-deep-earth/70">
                    Email communication with {currentBrand.name} styling
                  </div>
                </div>
                <div className="bg-mist-grey rounded-lg p-4">
                  <div className="text-deep-earth/40 text-sm mb-2">[Website Header]</div>
                  <div className="text-sm text-deep-earth/70">
                    Website header implementation for {currentBrand.name}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Guidelines */}
          <div className="card bg-gradient-to-r from-mist-grey to-white">
            <h4 className="text-xl font-semibold text-deep-earth mb-4">Brand Guidelines</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-deep-earth mb-2">Color Usage</h5>
                <ul className="text-sm text-deep-earth/70 space-y-1">
                  <li>• Primary: {currentBrand.accentColor}</li>
                  <li>• Always use with master brand colors</li>
                  <li>• Maintain 60/30/10 color ratio</li>
                  <li>• Ensure sufficient contrast</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-deep-earth mb-2">Typography</h5>
                <ul className="text-sm text-deep-earth/70 space-y-1">
                  <li>• Use Inter font family consistently</li>
                  <li>• Maintain brand hierarchy</li>
                  <li>• Keep tagline prominent</li>
                  <li>• Ensure mobile readability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Download Brand Kit */}
        <div className="text-center mt-12">
          <button
            onClick={() => showToast(`Downloading ${currentBrand.name} brand kit...`)}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Download className="w-4 h-4" />
            Download {currentBrand.name} Brand Kit
          </button>
        </div>
      </div>
    </section>
  )
}
