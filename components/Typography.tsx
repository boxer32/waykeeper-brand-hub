'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { copyToClipboard, showToast } from '@/lib/utils'

const typographyExamples = {
  headlines: [
    {
      level: 'H1',
      size: '48-64px',
      weight: 'Bold',
      example: 'Simply. Fairly. Connected.',
      usage: 'Hero sections, main headlines'
    },
    {
      level: 'H2',
      size: '36-48px',
      weight: 'Semibold',
      example: 'Discover Northern Thailand',
      usage: 'Section headers, page titles'
    },
    {
      level: 'H3',
      size: '24-32px',
      weight: 'Semibold',
      example: 'Your Pai Adventure Awaits',
      usage: 'Subsection headers, card titles'
    }
  ],
  body: [
    {
      level: 'Body Large',
      size: '18px',
      weight: 'Regular',
      example: 'Waykeeper makes travel simple through smart technology and fair pricing—connecting you to everything you need in Northern Thailand.',
      usage: 'Main content, descriptions'
    },
    {
      level: 'Body',
      size: '16px',
      weight: 'Regular',
      example: 'Book your Pai adventure in one tap. Quality tours. Honest prices. Local guides. From ฿800.',
      usage: 'General text, paragraphs'
    },
    {
      level: 'Body Small',
      size: '14px',
      weight: 'Regular',
      example: 'Terms and conditions apply. Valid for 90 days from booking.',
      usage: 'Captions, fine print'
    }
  ],
  interactive: [
    {
      level: 'Button Text',
      size: '16px',
      weight: 'Semibold',
      example: 'Book Now',
      usage: 'Call-to-action buttons'
    },
    {
      level: 'Link Text',
      size: '16px',
      weight: 'Medium',
      example: 'Learn more about our tours',
      usage: 'Navigation links, inline links'
    },
    {
      level: 'Caption',
      size: '12px',
      weight: 'Light',
      example: 'Photo by Local Guide • Pai, Thailand',
      usage: 'Image captions, metadata'
    }
  ]
}

const fontWeights = [
  { name: 'Light', value: '300', class: 'font-light' },
  { name: 'Regular', value: '400', class: 'font-normal' },
  { name: 'Medium', value: '500', class: 'font-medium' },
  { name: 'Semibold', value: '600', class: 'font-semibold' },
  { name: 'Bold', value: '700', class: 'font-bold' }
]

export default function Typography() {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const handleCopy = (text: string, type: string) => {
    copyToClipboard(text)
    setCopiedText(`${type}-${text}`)
    showToast(`${type} copied!`)
    
    setTimeout(() => setCopiedText(null), 2000)
  }

  const copyCSS = (level: string, size: string, weight: string) => {
    const css = `font-size: ${size}; font-weight: ${weight}; font-family: 'Inter', sans-serif;`
    copyToClipboard(css)
    showToast('CSS copied!')
  }

  return (
    <section id="typography" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-deep-earth mb-4">
            Typography
          </h2>
          <p className="text-lg text-deep-earth/70 max-w-2xl mx-auto mb-4">
            Inter font family for better mobile readability and accessible brand personality
          </p>
          <p className="text-base text-deep-earth/60 max-w-3xl mx-auto">
            📝 นี่คือแบบตัวอักษรที่เราใช้ในทุกที่ เหมือนเป็นแบบตัวอักษรประจำโรงเรียน 
            มีทั้งหัวข้อใหญ่ (H1) หัวข้อเล็ก (H2, H3) และข้อความธรรมดา (Body) 
            เพื่อให้อ่านง่ายและดูสวยงามเหมือนกันทุกที่
          </p>
        </div>

        {/* Font Family */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-deep-earth mb-8">Font Family</h3>
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-xl font-semibold text-deep-earth mb-2">Inter</h4>
                <p className="text-deep-earth/70">Sans-serif font family for modern, accessible design</p>
              </div>
              <button
                onClick={() => handleCopy("font-family: 'Inter', sans-serif;", 'CSS')}
                className="copy-button flex items-center gap-2"
              >
                {copiedText?.includes('CSS') ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copy CSS
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {fontWeights.map((weight) => (
                <div key={weight.name} className="text-center p-4 border border-mist-grey rounded-lg">
                  <div className={`text-2xl ${weight.class} text-deep-earth mb-2`}>
                    Aa
                  </div>
                  <div className="text-sm text-deep-earth/60">{weight.name}</div>
                  <div className="text-xs text-deep-earth/40">{weight.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Headlines */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-deep-earth mb-8">Headlines</h3>
          <div className="space-y-8">
            {typographyExamples.headlines.map((item, index) => (
              <div key={index} className="card group hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="text-4xl font-bold text-deep-earth mb-2">
                      {item.example}
                    </div>
                    <div className="text-sm text-deep-earth/60">
                      {item.level} • {item.size} • {item.weight}
                    </div>
                    <div className="text-sm text-deep-earth/70 mt-1">
                      {item.usage}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(item.example, 'Text')}
                      className="copy-button flex items-center gap-1"
                    >
                      {copiedText === `Text-${item.example}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Text
                    </button>
                    <button
                      onClick={() => copyCSS(item.level, item.size, item.weight)}
                      className="copy-button flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      CSS
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Body Text */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-deep-earth mb-8">Body Text</h3>
          <div className="space-y-6">
            {typographyExamples.body.map((item, index) => (
              <div key={index} className="card group hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className={`text-${item.size === '18px' ? 'lg' : item.size === '14px' ? 'sm' : 'base'} text-deep-earth mb-2 leading-relaxed`}>
                      {item.example}
                    </div>
                    <div className="text-sm text-deep-earth/60">
                      {item.level} • {item.size} • {item.weight}
                    </div>
                    <div className="text-sm text-deep-earth/70 mt-1">
                      {item.usage}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(item.example, 'Text')}
                      className="copy-button flex items-center gap-1"
                    >
                      {copiedText === `Text-${item.example}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Text
                    </button>
                    <button
                      onClick={() => copyCSS(item.level, item.size, item.weight)}
                      className="copy-button flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      CSS
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-deep-earth mb-8">Interactive Elements</h3>
          <div className="space-y-6">
            {typographyExamples.interactive.map((item, index) => (
              <div key={index} className="card group hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className={`text-${item.size === '12px' ? 'xs' : 'base'} ${item.level === 'Button Text' ? 'font-semibold' : item.level === 'Link Text' ? 'font-medium text-skypath-blue hover:underline' : 'font-light'} text-deep-earth mb-2`}>
                      {item.example}
                    </div>
                    <div className="text-sm text-deep-earth/60">
                      {item.level} • {item.size} • {item.weight}
                    </div>
                    <div className="text-sm text-deep-earth/70 mt-1">
                      {item.usage}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(item.example, 'Text')}
                      className="copy-button flex items-center gap-1"
                    >
                      {copiedText === `Text-${item.example}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Text
                    </button>
                    <button
                      onClick={() => copyCSS(item.level, item.size, item.weight)}
                      className="copy-button flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      CSS
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="card bg-gradient-to-r from-mist-grey to-white">
          <h3 className="text-2xl font-semibold text-deep-earth mb-6">Usage Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-deep-earth mb-4">✅ Do</h4>
              <ul className="space-y-2 text-deep-earth/70">
                <li className="flex items-start gap-2">
                  <span className="text-earth-green">✓</span>
                  Use Inter font family consistently
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-earth-green">✓</span>
                  Maintain proper hierarchy (H1 → H2 → H3)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-earth-green">✓</span>
                  Use 1.5-1.6 line height for readability
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-earth-green">✓</span>
                  Ensure minimum 16px for body text
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-earth-green">✓</span>
                  Use full width, not condensed
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-deep-earth mb-4">❌ Don't</h4>
              <ul className="space-y-2 text-deep-earth/70">
                <li className="flex items-start gap-2">
                  <span className="text-heart-rose">✗</span>
                  Use Comic Sans, Papyrus, or playful fonts
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-heart-rose">✗</span>
                  Overly bold or wide headline fonts
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-heart-rose">✗</span>
                  Text smaller than 14px for body content
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-heart-rose">✗</span>
                  Mix different font families
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-heart-rose">✗</span>
                  Use condensed or compressed versions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
