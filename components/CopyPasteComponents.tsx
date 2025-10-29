'use client'

import { useState } from 'react'
import { Copy, Check, Download, Mail, MessageSquare, Globe, Hash } from 'lucide-react'
import { copyToClipboard, showToast } from '@/lib/utils'

const copyComponents = {
  taglines: [
    {
      name: 'Master Tagline',
      content: 'Simply. Fairly. Connected.',
      usage: 'Main brand tagline for all touchpoints',
      characterCount: 25
    },
    {
      name: 'Short Version',
      content: 'SFC',
      usage: 'Compact spaces, social media',
      characterCount: 3
    },
    {
      name: 'Extended Version',
      content: 'Simply. Fairly. Connected. - Your Northern Thailand travel companion.',
      usage: 'Website headers, presentations',
      characterCount: 67
    }
  ],
  emailSignatures: [
    {
      name: 'HTML Version',
      content: `<div style="font-family: Inter, sans-serif; color: #3A3A3A;">
  <strong>[Your Name]</strong><br>
  Waykeeper<br>
  <span style="color: #77BEF0; font-weight: 600;">Simply. Fairly. Connected.</span><br>
  <a href="https://waykeeper.th" style="color: #77BEF0;">waykeeper.th</a>
</div>`,
      usage: 'Email signatures, HTML emails',
      characterCount: 200
    },
    {
      name: 'Plain Text Version',
      content: `[Your Name]
Waykeeper
Simply. Fairly. Connected.
waykeeper.th`,
      usage: 'Plain text emails, simple signatures',
      characterCount: 60
    }
  ],
  socialMedia: [
    {
      name: 'Instagram Bio (150 chars)',
      content: 'Simply. Fairly. Connected. 🧭\nNorthern Thailand travel companion\n📍 Pai • Pang Mapha\n👇 Book now',
      usage: 'Instagram profile bio',
      characterCount: 98
    },
    {
      name: 'Facebook Bio',
      content: 'Waykeeper - Simply. Fairly. Connected.\n\nMaking travel simple through smart technology and fair pricing. Connecting you to everything you need in Northern Thailand.\n\n📍 Pai • Pang Mapha • Mae Hong Son\n📧 hello@waykeeper.th',
      usage: 'Facebook page description',
      characterCount: 200
    },
    {
      name: 'Twitter Bio (160 chars)',
      content: 'Simply. Fairly. Connected. 🧭 Northern Thailand travel companion. Real experiences, honest prices. 📍 Pai • Pang Mapha',
      usage: 'Twitter profile bio',
      characterCount: 120
    }
  ],
  websiteCopy: [
    {
      name: 'Hero Headline',
      content: 'Discover Northern Thailand',
      usage: 'Main website headline',
      characterCount: 25
    },
    {
      name: 'Hero Subheadline',
      content: 'Simply. Fairly. Connected. Book your Pai adventure in one tap. Quality tours. Honest prices. Local guides.',
      usage: 'Website hero section',
      characterCount: 95
    },
    {
      name: 'CTA Button',
      content: 'Book Now',
      usage: 'Call-to-action buttons',
      characterCount: 8
    },
    {
      name: 'About Section',
      content: 'Waykeeper makes travel simple through smart technology and fair pricing—connecting you to everything you need in Northern Thailand. Real travel happens when you connect with real people in real places.',
      usage: 'About us section',
      characterCount: 180
    }
  ],
  chatResponses: [
    {
      name: 'How to book?',
      content: 'Booking is super easy! Just visit waykeeper.th, choose your adventure, and book in one tap. We\'ll send you all the details via email. Questions? Just ask!',
      usage: 'Customer support, chat responses',
      characterCount: 150
    },
    {
      name: 'What\'s included?',
      content: 'Every tour includes a local guide, transportation, and all activities mentioned. We also provide water and basic snacks. Check the specific tour page for exact details!',
      usage: 'FAQ responses, customer inquiries',
      characterCount: 160
    },
    {
      name: 'Cancellation policy?',
      content: 'Free cancellation up to 24 hours before your tour. We\'re flexible and understanding - just let us know if plans change!',
      usage: 'Policy inquiries, booking questions',
      characterCount: 120
    },
    {
      name: 'Group size?',
      content: 'We keep groups small (max 8 people) for a more personal experience. Perfect for meeting fellow travelers while maintaining that intimate feel!',
      usage: 'Tour details, group inquiries',
      characterCount: 140
    }
  ],
  hashtags: [
    {
      name: 'Primary Hashtags',
      content: '#WaykeeperAdventures #SimplyFairlyConnected #PaiLife #NorthernThailand #LocalTours',
      usage: 'Social media posts, Instagram',
      characterCount: 85
    },
    {
      name: 'Location Hashtags',
      content: '#Pai #PangMapha #MaeHongSon #Thailand #TravelThailand',
      usage: 'Location-based posts',
      characterCount: 60
    },
    {
      name: 'Experience Hashtags',
      content: '#AdventureTravel #LocalExperiences #SustainableTourism #CommunityTravel',
      usage: 'Experience-focused posts',
      characterCount: 75
    }
  ]
}

export default function CopyPasteComponents() {
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<keyof typeof copyComponents>('taglines')

  const handleCopy = (text: string, type: string) => {
    copyToClipboard(text)
    setCopiedText(`${type}-${text}`)
    showToast(`${type} copied!`)
    
    setTimeout(() => setCopiedText(null), 2000)
  }

  const getIcon = (category: string) => {
    switch (category) {
      case 'taglines': return <Hash className="w-4 h-4" />
      case 'emailSignatures': return <Mail className="w-4 h-4" />
      case 'socialMedia': return <MessageSquare className="w-4 h-4" />
      case 'websiteCopy': return <Globe className="w-4 h-4" />
      case 'chatResponses': return <MessageSquare className="w-4 h-4" />
      case 'hashtags': return <Hash className="w-4 h-4" />
      default: return <Copy className="w-4 h-4" />
    }
  }

  return (
    <section id="copy-paste" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-deep-earth mb-4">
            Copy-Paste Components
          </h2>
          <p className="text-lg text-deep-earth/70 max-w-2xl mx-auto mb-4">
            Ready-to-use copy snippets for all your marketing and communication needs
          </p>
          <p className="text-base text-deep-earth/60 max-w-3xl mx-auto">
            📋 นี่คือกล่องข้อความสำเร็จรูปของ Waykeeper เหมือนเป็นกล่องดินสอสีที่มีข้อความต่างๆ 
            เช่น ข้อความสำหรับเฟสบุ๊ค อีเมล หรือแชท เราสามารถคัดลอกไปใช้ได้เลย 
            ไม่ต้องคิดเองว่าจะเขียนยังไง
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.keys(copyComponents).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category as keyof typeof copyComponents)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-skypath-blue text-white'
                    : 'bg-mist-grey text-deep-earth hover:bg-skypath-blue hover:text-white'
                }`}
              >
                {getIcon(category)}
                {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Content Display */}
        <div className="space-y-6">
          {copyComponents[activeCategory].map((item, index) => (
            <div key={index} className="card group hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-deep-earth mb-2">{item.name}</h3>
                  <p className="text-sm text-deep-earth/60 mb-3">{item.usage}</p>
                  
                  <div className="bg-mist-grey/50 p-4 rounded-lg mb-4">
                    <pre className="text-sm text-deep-earth whitespace-pre-wrap font-mono">
                      {item.content}
                    </pre>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-deep-earth/60">
                    <span>Characters: {item.characterCount}</span>
                    {item.characterCount <= 150 && (
                      <span className="text-earth-green">✓ Social media friendly</span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleCopy(item.content, item.name)}
                    className="copy-button flex items-center gap-1"
                  >
                    {copiedText === `${item.name}-${item.content}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Copy Section */}
        <div className="mt-12 card bg-gradient-to-r from-mist-grey to-white">
          <h3 className="text-xl font-semibold text-deep-earth mb-6">Quick Copy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => handleCopy('Simply. Fairly. Connected.', 'Master Tagline')}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-mist-grey hover:shadow-md transition-all duration-200 text-left"
            >
              <Hash className="w-5 h-5 text-skypath-blue" />
              <div>
                <div className="font-medium text-deep-earth">Master Tagline</div>
                <div className="text-sm text-deep-earth/60">25 characters</div>
              </div>
            </button>
            
            <button
              onClick={() => handleCopy('Book Now', 'CTA Button')}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-mist-grey hover:shadow-md transition-all duration-200 text-left"
            >
              <Globe className="w-5 h-5 text-earth-green" />
              <div>
                <div className="font-medium text-deep-earth">CTA Button</div>
                <div className="text-sm text-deep-earth/60">8 characters</div>
              </div>
            </button>
            
            <button
              onClick={() => handleCopy('#WaykeeperAdventures #SimplyFairlyConnected #PaiLife', 'Hashtags')}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-mist-grey hover:shadow-md transition-all duration-200 text-left"
            >
              <Hash className="w-5 h-5 text-morning-gold" />
              <div>
                <div className="font-medium text-deep-earth">Hashtags</div>
                <div className="text-sm text-deep-earth/60">Social media</div>
              </div>
            </button>
            
            <button
              onClick={() => handleCopy('Booking is super easy! Just visit waykeeper.th, choose your adventure, and book in one tap.', 'Chat Response')}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-mist-grey hover:shadow-md transition-all duration-200 text-left"
            >
              <MessageSquare className="w-5 h-5 text-river-teal" />
              <div>
                <div className="font-medium text-deep-earth">Chat Response</div>
                <div className="text-sm text-deep-earth/60">Customer support</div>
              </div>
            </button>
          </div>
        </div>

        {/* Download All Copy */}
        <div className="text-center mt-8">
          <button
            onClick={() => showToast('Copy library download coming soon!')}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Download className="w-4 h-4" />
            Download All Copy Library (PDF)
          </button>
        </div>
      </div>
    </section>
  )
}
