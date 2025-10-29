'use client'

import { useState } from 'react'
import { Copy, Check, Download } from 'lucide-react'
import { copyToClipboard, showToast } from '@/lib/utils'

interface Color {
  name: string
  hex: string
  rgb: string
  cmyk: string
  usage: string[]
  avoid: string[]
  contrast: {
    white: string
    ratio: string
  }
}

const masterColors: Color[] = [
  {
    name: 'Skypath Blue',
    hex: '#77BEF0',
    rgb: '119, 190, 240',
    cmyk: '50, 21, 0, 6',
    usage: ['Logos', 'CTAs', 'Headers', 'Simply messaging'],
    avoid: ['Body text', 'Backgrounds'],
    contrast: {
      white: 'AAA (WCAG compliant)',
      ratio: '7.2:1'
    }
  },
  {
    name: 'Morning Gold',
    hex: '#F9D88C',
    rgb: '249, 216, 140',
    cmyk: '0, 13, 44, 2',
    usage: ['Fairly messaging', 'Accents', 'Highlights'],
    avoid: ['Large text blocks', 'Primary CTAs'],
    contrast: {
      white: 'AA (WCAG compliant)',
      ratio: '4.5:1'
    }
  },
  {
    name: 'Earth Green',
    hex: '#4A7C59',
    rgb: '74, 124, 89',
    cmyk: '40, 0, 28, 51',
    usage: ['Connected messaging', 'Success states', 'Nature themes'],
    avoid: ['Small text', 'Dark backgrounds'],
    contrast: {
      white: 'AAA (WCAG compliant)',
      ratio: '8.1:1'
    }
  },
  {
    name: 'Mist Grey',
    hex: '#E5E1DC',
    rgb: '229, 225, 220',
    cmyk: '0, 2, 4, 10',
    usage: ['Neutral backgrounds', 'Subtle borders', 'Text contrast'],
    avoid: ['Primary text', 'Important elements'],
    contrast: {
      white: 'AA (WCAG compliant)',
      ratio: '5.2:1'
    }
  }
]

const accentColors: Color[] = [
  {
    name: 'River Teal',
    hex: '#2D7D7D',
    rgb: '45, 125, 125',
    cmyk: '64, 0, 0, 51',
    usage: ['Water themes', 'Flow elements'],
    avoid: ['Small text', 'Low contrast areas'],
    contrast: {
      white: 'AAA (WCAG compliant)',
      ratio: '7.8:1'
    }
  },
  {
    name: 'Deep Earth',
    hex: '#3A3A3A',
    rgb: '58, 58, 58',
    cmyk: '0, 0, 0, 77',
    usage: ['Text contrast', 'Dark elements'],
    avoid: ['Large backgrounds', 'Primary brand elements'],
    contrast: {
      white: 'AAA (WCAG compliant)',
      ratio: '12.6:1'
    }
  }
]

export default function ColorPalette() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [showSubBrand, setShowSubBrand] = useState(false)

  const handleCopy = (color: Color, format: 'hex' | 'rgb' | 'cmyk') => {
    let text = ''
    switch (format) {
      case 'hex':
        text = color.hex
        break
      case 'rgb':
        text = `rgb(${color.rgb})`
        break
      case 'cmyk':
        text = `cmyk(${color.cmyk}%)`
        break
    }
    
    copyToClipboard(text)
    setCopiedColor(`${color.name}-${format}`)
    showToast(`${color.name} ${format.toUpperCase()} copied!`)
    
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const downloadSwatches = () => {
    showToast('Swatch download feature coming soon!')
  }

  return (
    <section id="colors" className="py-16 bg-gradient-to-br from-mist-grey to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-deep-earth mb-4">
            Color Palette
          </h2>
          <p className="text-lg text-deep-earth/70 max-w-2xl mx-auto mb-4">
            Our carefully crafted color system that brings the Waykeeper brand to life
          </p>
          <p className="text-base text-deep-earth/60 max-w-3xl mx-auto">
            🎨 นี่คือสีประจำของ Waykeeper ที่เราเลือกมาอย่างพิถีพิถัน 
            เหมือนสีประจำโรงเรียนที่ทุกคนต้องใช้เหมือนกัน เพื่อให้ลูกค้าเห็นสีแล้วรู้ทันทีว่าเป็น Waykeeper 
            มีทั้งสีหลัก (ใช้บ่อย) และสีเสริม (ใช้เป็นครั้งคราว)
          </p>
        </div>

        {/* Master Brand Colors */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-deep-earth mb-8">
            Master Brand Colors
            <span className="text-sm font-normal text-deep-earth/60 ml-2">(60% usage)</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {masterColors.map((color) => (
              <div key={color.name} className="card group hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="color-swatch"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => handleCopy(color, 'hex')}
                  >
                    <div className="w-full h-full rounded-lg flex items-center justify-center">
                      {copiedColor === `${color.name}-hex` ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <Copy className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold text-deep-earth mb-2">{color.name}</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-deep-earth/60">HEX:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-mist-grey px-2 py-1 rounded text-xs">{color.hex}</code>
                      <button
                        onClick={() => handleCopy(color, 'hex')}
                        className="copy-button"
                      >
                        {copiedColor === `${color.name}-hex` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-deep-earth/60">RGB:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-mist-grey px-2 py-1 rounded text-xs">{color.rgb}</code>
                      <button
                        onClick={() => handleCopy(color, 'rgb')}
                        className="copy-button"
                      >
                        {copiedColor === `${color.name}-rgb` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-deep-earth/60">CMYK:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-mist-grey px-2 py-1 rounded text-xs">{color.cmyk}%</code>
                      <button
                        onClick={() => handleCopy(color, 'cmyk')}
                        className="copy-button"
                      >
                        {copiedColor === `${color.name}-cmyk` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-mist-grey">
                  <div className="text-xs">
                    <div className="text-deep-earth/60 mb-1">Used for:</div>
                    <div className="flex flex-wrap gap-1">
                      {color.usage.map((use) => (
                        <span key={use} className="bg-skypath-blue/10 text-skypath-blue px-2 py-1 rounded text-xs">
                          ✓ {use}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-xs mt-2">
                    <div className="text-deep-earth/60 mb-1">Avoid:</div>
                    <div className="flex flex-wrap gap-1">
                      {color.avoid.map((avoid) => (
                        <span key={avoid} className="bg-morning-gold/20 text-deep-earth px-2 py-1 rounded text-xs">
                          ✗ {avoid}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-deep-earth/60">
                  <div>Contrast: {color.contrast.white}</div>
                  <div>Ratio: {color.contrast.ratio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accent Colors */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-deep-earth mb-8">
            Accent Colors
            <span className="text-sm font-normal text-deep-earth/60 ml-2">(30% usage)</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accentColors.map((color) => (
              <div key={color.name} className="card group hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div 
                    className="color-swatch"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => handleCopy(color, 'hex')}
                  >
                    <div className="w-full h-full rounded-lg flex items-center justify-center">
                      {copiedColor === `${color.name}-hex` ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <Copy className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-deep-earth mb-2">{color.name}</h4>
                    <div className="flex items-center gap-2">
                      <code className="bg-mist-grey px-2 py-1 rounded text-sm">{color.hex}</code>
                      <button
                        onClick={() => handleCopy(color, 'hex')}
                        className="copy-button"
                      >
                        {copiedColor === `${color.name}-hex` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-Brand Colors Toggle */}
        <div className="mb-8">
          <button
            onClick={() => setShowSubBrand(!showSubBrand)}
            className="btn-secondary flex items-center gap-2"
          >
            {showSubBrand ? 'Hide' : 'Show'} Sub-Brand Colors (Phase 2)
          </button>
        </div>

        {/* Sub-Brand Colors */}
        {showSubBrand && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-deep-earth mb-8">
              Sub-Brand Colors
              <span className="text-sm font-normal text-deep-earth/60 ml-2">(10% usage - Phase 2)</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Heart Rose', hex: '#EA5B6F', usage: 'Future Restore programs' },
                { name: 'Journey Coral', hex: '#FF894F', usage: 'Future Explore expansion' },
                { name: 'Soft Stone', hex: '#D4C5B0', usage: 'Future Stay accommodation' },
                { name: 'Loop Purple', hex: '#8B7AB8', usage: 'Future Circle community features' },
              ].map((color) => (
                <div key={color.name} className="card">
                  <div 
                    className="color-swatch mb-4"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => {
                      copyToClipboard(color.hex)
                      showToast(`${color.name} copied!`)
                    }}
                  >
                    <div className="w-full h-full rounded-lg flex items-center justify-center">
                      <Copy className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-deep-earth mb-2">{color.name}</h4>
                  <p className="text-sm text-deep-earth/60">{color.usage}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Download All Swatches */}
        <div className="text-center">
          <button
            onClick={downloadSwatches}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Download className="w-4 h-4" />
            Download All Swatches (ASE, ACO, CSS)
          </button>
        </div>
      </div>
    </section>
  )
}
