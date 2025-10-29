'use client'

import { useState } from 'react'
import { Download, Eye, FileText, Image, Palette, Type, FolderOpen } from 'lucide-react'
import { showToast } from '@/lib/utils'

const assetCategories = [
  {
    name: 'Logos',
    icon: <Type className="w-5 h-5" />,
    color: 'text-skypath-blue',
    bgColor: 'bg-skypath-blue/10',
    items: [
      { name: 'Primary Logo', formats: ['PNG', 'SVG', 'EPS', 'AI'], size: '2.3MB' },
      { name: 'Compact Logo', formats: ['PNG', 'SVG', 'EPS'], size: '1.8MB' },
      { name: 'Icon Only', formats: ['PNG', 'SVG', 'ICO'], size: '1.2MB' },
      { name: 'Monochrome White', formats: ['PNG', 'SVG'], size: '1.5MB' },
      { name: 'Monochrome Black', formats: ['PNG', 'SVG'], size: '1.5MB' }
    ]
  },
  {
    name: 'Sub-Brand Logos',
    icon: <FolderOpen className="w-5 h-5" />,
    color: 'text-earth-green',
    bgColor: 'bg-earth-green/10',
    items: [
      { name: 'Waykeeper Explore', formats: ['PNG', 'SVG'], size: '1.8MB' },
      { name: 'Waykeeper Move', formats: ['PNG', 'SVG'], size: '1.8MB' },
      { name: 'Waykeeper Restore', formats: ['PNG', 'SVG'], size: '1.8MB' },
      { name: 'Waykeeper Circle', formats: ['PNG', 'SVG'], size: '1.8MB' }
    ]
  },
  {
    name: 'Typography',
    icon: <Type className="w-5 h-5" />,
    color: 'text-morning-gold',
    bgColor: 'bg-morning-gold/10',
    items: [
      { name: 'Inter Font Family', formats: ['ZIP'], size: '15.2MB' },
      { name: 'Font Installation Guide', formats: ['PDF'], size: '2.1MB' },
      { name: 'Typography Examples', formats: ['PDF'], size: '3.4MB' }
    ]
  },
  {
    name: 'Color Swatches',
    icon: <Palette className="w-5 h-5" />,
    color: 'text-river-teal',
    bgColor: 'bg-river-teal/10',
    items: [
      { name: 'Adobe Swatch (.ASE)', formats: ['ASE'], size: '0.8MB' },
      { name: 'Sketch Palette (.SKE)', formats: ['SKE'], size: '0.6MB' },
      { name: 'Figma Import File', formats: ['JSON'], size: '0.4MB' },
      { name: 'CSS Variables', formats: ['CSS'], size: '0.2MB' }
    ]
  },
  {
    name: 'Templates',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-heart-rose',
    bgColor: 'bg-heart-rose/10',
    items: [
      { name: 'Social Media Templates', formats: ['Canva Link'], size: 'Online' },
      { name: 'Presentation Template', formats: ['PPTX'], size: '8.5MB' },
      { name: 'Email Signature', formats: ['HTML'], size: '0.3MB' },
      { name: 'Business Card Template', formats: ['AI'], size: '12.1MB' }
    ]
  },
  {
    name: 'Photography',
    icon: <Image className="w-5 h-5" />,
    color: 'text-loop-purple',
    bgColor: 'bg-loop-purple/10',
    items: [
      { name: 'Approved Photo Library', formats: ['Dropbox Link'], size: 'Online' },
      { name: 'Photo Guidelines', formats: ['PDF'], size: '4.2MB' },
      { name: 'Stock Photo Sources', formats: ['PDF'], size: '1.8MB' }
    ]
  }
]

export default function AssetLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownload = async (itemName: string, format: string) => {
    setDownloading(`${itemName}-${format}`)
    showToast(`Downloading ${itemName}.${format.toLowerCase()}...`)
    
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setDownloading(null)
    showToast(`${itemName}.${format.toLowerCase()} downloaded!`)
  }

  const handleDownloadAll = async () => {
    setDownloading('all')
    showToast('Preparing download package...')
    
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setDownloading(null)
    showToast('All assets downloaded!')
  }

  return (
    <section id="assets" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-deep-earth mb-4">
            Asset Library
          </h2>
          <p className="text-lg text-deep-earth/70 max-w-2xl mx-auto mb-4">
            Download all brand assets, templates, and resources in one place
          </p>
          <p className="text-base text-deep-earth/60 max-w-3xl mx-auto">
            📁 นี่คือคลังเก็บไฟล์ของ Waykeeper ที่มีทุกอย่างที่เราต้องการ 
            เหมือนเป็นตู้เก็บของที่จัดเป็นหมวดหมู่ เช่น โลโก้ ฟอนต์ สี รูปภาพ 
            เราสามารถดาวน์โหลดไปใช้ได้เลย
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {assetCategories.map((category, index) => (
            <div
              key={index}
              className={`card cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedCategory === category.name ? 'ring-2 ring-skypath-blue' : ''
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg ${category.bgColor} ${category.color}`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-deep-earth">{category.name}</h3>
                  <p className="text-sm text-deep-earth/60">{category.items.length} items</p>
                </div>
              </div>
              
              {selectedCategory === category.name && (
                <div className="space-y-3 pt-4 border-t border-mist-grey">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-deep-earth text-sm">{item.name}</div>
                        <div className="text-xs text-deep-earth/60">{item.size}</div>
                      </div>
                      <div className="flex gap-1">
                        {item.formats.map((format, formatIndex) => (
                          <button
                            key={formatIndex}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownload(item.name, format)
                            }}
                            disabled={downloading === `${item.name}-${format}`}
                            className="copy-button text-xs disabled:opacity-50"
                          >
                            {downloading === `${item.name}-${format}` ? (
                              <div className="w-3 h-3 border border-deep-earth border-t-transparent rounded-full animate-spin" />
                            ) : (
                              format
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Access */}
        <div className="card bg-gradient-to-r from-mist-grey to-white mb-8">
          <h3 className="text-xl font-semibold text-deep-earth mb-4">Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleDownload('Primary Logo', 'PNG')}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-mist-grey hover:shadow-md transition-all duration-200"
            >
              <Type className="w-5 h-5 text-skypath-blue" />
              <div className="text-left">
                <div className="font-medium text-deep-earth">Primary Logo</div>
                <div className="text-sm text-deep-earth/60">PNG format</div>
              </div>
            </button>
            
            <button
              onClick={() => handleDownload('Color Palette', 'CSS')}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-mist-grey hover:shadow-md transition-all duration-200"
            >
              <Palette className="w-5 h-5 text-morning-gold" />
              <div className="text-left">
                <div className="font-medium text-deep-earth">Color Palette</div>
                <div className="text-sm text-deep-earth/60">CSS variables</div>
              </div>
            </button>
            
            <button
              onClick={() => handleDownload('Inter Font', 'ZIP')}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-mist-grey hover:shadow-md transition-all duration-200"
            >
              <Type className="w-5 h-5 text-earth-green" />
              <div className="text-left">
                <div className="font-medium text-deep-earth">Inter Font</div>
                <div className="text-sm text-deep-earth/60">Complete family</div>
              </div>
            </button>
          </div>
        </div>

        {/* Download All */}
        <div className="text-center">
          <button
            onClick={handleDownloadAll}
            disabled={downloading === 'all'}
            className="btn-primary flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            {downloading === 'all' ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download All Assets (ZIP - 250MB)
          </button>
          <p className="text-sm text-deep-earth/60 mt-2">
            Includes all logos, fonts, colors, templates, and photography
          </p>
        </div>

        {/* Version Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-mist-grey px-4 py-2 rounded-lg">
            <span className="text-sm text-deep-earth/60">Current Version:</span>
            <span className="text-sm font-semibold text-deep-earth">v5.0 (Dec 2024)</span>
          </div>
          <p className="text-xs text-deep-earth/60 mt-2">
            Last updated: December 15, 2024
          </p>
        </div>
      </div>
    </section>
  )
}
