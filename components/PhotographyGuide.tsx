'use client'

import { useState } from 'react'
import { Download, Eye, Filter, Search, Upload } from 'lucide-react'
import { showToast } from '@/lib/utils'

const approvedPhotos = [
  {
    id: 1,
    title: 'Local Guide Leading Tour',
    category: 'Explore',
    description: 'Real tour moment with natural lighting and genuine smiles',
    tags: ['natural lighting', 'genuine smiles', 'local guide', 'action'],
    url: '/api/placeholder/400/300'
  },
  {
    id: 2,
    title: 'Community Gathering',
    category: 'Circle',
    description: 'Multiple people in authentic setting with warm colors',
    tags: ['multiple people', 'authentic setting', 'warm colors', 'community'],
    url: '/api/placeholder/400/300'
  },
  {
    id: 3,
    title: 'Family Adventure',
    category: 'Explore',
    description: 'Families enjoying nature with hands-on activities',
    tags: ['families', 'nature', 'hands-on', 'adventure'],
    url: '/api/placeholder/400/300'
  },
  {
    id: 4,
    title: 'Wellness Retreat',
    category: 'Restore',
    description: 'Peaceful wellness setting with natural textures',
    tags: ['wellness', 'peaceful', 'natural textures', 'retreat'],
    url: '/api/placeholder/400/300'
  },
  {
    id: 5,
    title: 'Transportation',
    category: 'Move',
    description: 'Local transport with authentic Northern Thailand setting',
    tags: ['transport', 'local', 'authentic', 'journey'],
    url: '/api/placeholder/400/300'
  },
  {
    id: 6,
    title: 'Village Life',
    category: 'Explore',
    description: 'Local community members in traditional setting',
    tags: ['village', 'traditional', 'community', 'local life'],
    url: '/api/placeholder/400/300'
  }
]

const avoidPhotos = [
  {
    id: 1,
    title: 'Over-edited Spiritual',
    description: 'Too much ethereal glow and spiritual vibe',
    tags: ['over-edited', 'ethereal glow', 'spiritual', 'isolated'],
    url: '/api/placeholder/400/300'
  },
  {
    id: 2,
    title: 'Stock Photo Perfection',
    description: 'Too perfect, staged luxury, generic traveler',
    tags: ['stock photo', 'too perfect', 'staged luxury', 'generic'],
    url: '/api/placeholder/400/300'
  }
]

const categories = ['All', 'Explore', 'Move', 'Restore', 'Circle']
const sortOptions = ['Newest', 'Popular', 'Random']

export default function PhotographyGuide() {
  const [activeTab, setActiveTab] = useState<'approved' | 'avoid' | 'library'>('approved')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('Newest')
  const [searchTerm, setSearchTerm] = useState('')

  const handleDownload = (photoTitle: string) => {
    showToast(`Downloading ${photoTitle}...`)
  }

  const handleUploadRequest = () => {
    showToast('Upload request form coming soon!')
  }

  const filteredPhotos = approvedPhotos.filter(photo => {
    const matchesCategory = selectedCategory === 'All' || photo.category === selectedCategory
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <section id="photography" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-deep-earth mb-4">
            Photography Guide
          </h2>
          <p className="text-lg text-deep-earth/70 max-w-2xl mx-auto mb-4">
            Visual guidelines and approved photo library for authentic brand representation
          </p>
          <p className="text-base text-deep-earth/60 max-w-3xl mx-auto">
            📸 นี่คือคู่มือการถ่ายรูปของ Waykeeper ที่บอกว่าควรถ่ายแบบไหน และไม่ควรถ่ายแบบไหน 
            เหมือนเป็นกฎการถ่ายรูปประจำโรงเรียน เพื่อให้รูปที่ใช้ทุกที่ดูเหมือนกัน 
            และแสดงให้เห็นว่า Waykeeper เป็นอย่างไร
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-mist-grey rounded-lg p-1">
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'approved'
                  ? 'bg-white text-skypath-blue shadow-sm'
                  : 'text-deep-earth hover:text-skypath-blue'
              }`}
            >
              <span className="text-earth-green">✓</span> Approved
            </button>
            <button
              onClick={() => setActiveTab('avoid')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'avoid'
                  ? 'bg-white text-skypath-blue shadow-sm'
                  : 'text-deep-earth hover:text-skypath-blue'
              }`}
            >
              <span className="text-heart-rose">✗</span> Avoid
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'library'
                  ? 'bg-white text-skypath-blue shadow-sm'
                  : 'text-deep-earth hover:text-skypath-blue'
              }`}
            >
              <span className="text-river-teal">📁</span> Library
            </button>
          </div>
        </div>

        {/* Approved Style */}
        {activeTab === 'approved' && (
          <div className="space-y-8">
            <div className="card bg-gradient-to-r from-earth-green/5 to-white">
              <h3 className="text-2xl font-semibold text-deep-earth mb-6">Approved Photography Style</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {approvedPhotos.slice(0, 2).map((photo) => (
                  <div key={photo.id} className="group">
                    <div className="bg-mist-grey rounded-lg p-8 mb-4 text-center">
                      <div className="text-deep-earth/40 text-sm">[Photo: {photo.title}]</div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-deep-earth">{photo.title}</h4>
                      <p className="text-sm text-deep-earth/70">{photo.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {photo.tags.map((tag) => (
                          <span key={tag} className="bg-earth-green/10 text-earth-green px-2 py-1 rounded text-xs">
                            ✓ {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h4 className="text-lg font-semibold text-deep-earth mb-4">Approved Style Principles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-deep-earth mb-2">✅ What to Show</h5>
                  <ul className="space-y-1 text-sm text-deep-earth/70">
                    <li>• People smiling on boats, in villages, on adventures</li>
                    <li>• Local guides showing their community</li>
                    <li>• Families and groups enjoying nature</li>
                    <li>• Hands-on activities (cooking, crafting, exploring)</li>
                    <li>• Community gatherings and local events</li>
                    <li>• Natural textures and authentic settings</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-deep-earth mb-2">📸 Technical Guidelines</h5>
                  <ul className="space-y-1 text-sm text-deep-earth/70">
                    <li>• Natural light (golden hour preferred)</li>
                    <li>• Real people in authentic tour moments</li>
                    <li>• Genuine smiles and interactions</li>
                    <li>• Minimal editing (true colors, honest mood)</li>
                    <li>• Minimum resolution: 1200px width</li>
                    <li>• Aspect ratios: 16:9 (landscape), 4:5 (portrait)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Avoid Style */}
        {activeTab === 'avoid' && (
          <div className="space-y-8">
            <div className="card bg-gradient-to-r from-heart-rose/5 to-white">
              <h3 className="text-2xl font-semibold text-deep-earth mb-6">Photography to Avoid</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {avoidPhotos.map((photo) => (
                  <div key={photo.id} className="group">
                    <div className="bg-mist-grey rounded-lg p-8 mb-4 text-center">
                      <div className="text-deep-earth/40 text-sm">[Photo: {photo.title}]</div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-deep-earth">{photo.title}</h4>
                      <p className="text-sm text-deep-earth/70">{photo.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {photo.tags.map((tag) => (
                          <span key={tag} className="bg-heart-rose/10 text-heart-rose px-2 py-1 rounded text-xs">
                            ✗ {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h4 className="text-lg font-semibold text-deep-earth mb-4">What to Avoid</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-deep-earth mb-2">❌ Visual Style</h5>
                  <ul className="space-y-1 text-sm text-deep-earth/70">
                    <li>• Over-edited spiritual or ethereal vibes</li>
                    <li>• Stock photo perfection or staged luxury</li>
                    <li>• Isolated figures or empty spaces</li>
                    <li>• Overly polished or clinical settings</li>
                    <li>• Fake or overly retouched images</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-deep-earth mb-2">❌ Content Issues</h5>
                  <ul className="space-y-1 text-sm text-deep-earth/70">
                    <li>• Transactional moments (checkouts, payments)</li>
                    <li>• Generic travelers without personality</li>
                    <li>• Overly staged or artificial scenes</li>
                    <li>• Corporate or sterile environments</li>
                    <li>• Images that don't reflect local culture</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Photo Library */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="card">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-deep-earth/40 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search photos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-mist-grey rounded-lg focus:ring-2 focus:ring-skypath-blue focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-mist-grey rounded-lg focus:ring-2 focus:ring-skypath-blue focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-mist-grey rounded-lg focus:ring-2 focus:ring-skypath-blue focus:border-transparent"
                  >
                    {sortOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhotos.map((photo) => (
                <div key={photo.id} className="card group hover:shadow-lg transition-all duration-300">
                  <div className="bg-mist-grey rounded-lg p-8 mb-4 text-center">
                    <div className="text-deep-earth/40 text-sm">[Photo: {photo.title}]</div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-deep-earth mb-2">{photo.title}</h4>
                    <p className="text-sm text-deep-earth/70 mb-2">{photo.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {photo.tags.map((tag) => (
                        <span key={tag} className="bg-skypath-blue/10 text-skypath-blue px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(photo.title)}
                      className="copy-button flex items-center gap-1 flex-1"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                    <button className="copy-button flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Request */}
            <div className="card bg-gradient-to-r from-mist-grey to-white text-center">
              <h3 className="text-lg font-semibold text-deep-earth mb-2">Need More Photos?</h3>
              <p className="text-deep-earth/70 mb-4">
                Request new photos or upload your own for approval
              </p>
              <button
                onClick={handleUploadRequest}
                className="btn-secondary flex items-center gap-2 mx-auto"
              >
                <Upload className="w-4 h-4" />
                Request Photo Upload
              </button>
            </div>
          </div>
        )}

        {/* Download Guidelines */}
        <div className="text-center mt-12">
          <button
            onClick={() => showToast('Photo guidelines download coming soon!')}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Download className="w-4 h-4" />
            Download Photo Guidelines (PDF)
          </button>
        </div>
      </div>
    </section>
  )
}
