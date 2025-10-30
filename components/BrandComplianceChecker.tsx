'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, AlertTriangle, XCircle, Download, RefreshCw, Eye, Palette, Type, Volume2, Shield, Settings, Layout, Zap, Target, Star, Brain, AlertCircle } from 'lucide-react'
import { showToast } from '@/lib/utils'
import type { BrandImageReport, SeverityLevel, CategoryKey } from '@/types/brand-image-report'

const designTypes = [
  { value: 'banner', label: 'แบนเนอร์ – แบนเนอร์เว็บไซต์, โฆษณา' },
  { value: 'social', label: 'โพสต์โซเชียล – Facebook, Instagram, Twitter' },
  { value: 'story', label: 'สตอรีอินสตาแกรม - Instagram Story, Reels' },
  { value: 'print', label: 'โฆษณาพิมพ์ – โฆษณาในหนังสือพิมพ์, นิตยสาร' },
  { value: 'card', label: 'นามบัตร – นามบัตร, การ์ดติดต่อ' },
  { value: 'brochure', label: 'โบรชัวร์ - โบรชัวร์, แผ่นพับ' },
  { value: 'presentation', label: 'งานนำเสนอ – PowerPoint, Keynote' },
  { value: 'website', label: 'เว็บไซต์ – หน้าเว็บ, Landing Page' },
  { value: 'email', label: 'อีเมล - Email Marketing, Newsletter' },
  { value: 'other', label: 'อื่นๆ – ประเภทอื่นๆ' }
]

const categoryIcons: Record<CategoryKey, any> = {
  logo_usage: Target,
  colors: Palette,
  typography: Type,
  voice_tone: Volume2,
  accessibility: Shield,
  file_quality: Settings,
  visual_hierarchy: Layout,
  whitespace: Zap,
  content_density: Brain,
  focal_point: Eye,
  brand_familiarity: Star,
  layout_structure: Layout
}

const severityColors: Record<SeverityLevel, string> = {
  critical: 'text-red-600 bg-red-50 border-red-200',
  high: 'text-orange-600 bg-orange-50 border-orange-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  low: 'text-blue-600 bg-blue-50 border-blue-200',
  suggestion: 'text-green-600 bg-green-50 border-green-200'
}

const severityIcons: Record<SeverityLevel, any> = {
  critical: XCircle,
  high: AlertTriangle,
  medium: AlertCircle,
  low: CheckCircle,
  suggestion: CheckCircle
}

export default function BrandComplianceChecker() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageMetadata, setImageMetadata] = useState<any>(null)
  const [report, setReport] = useState<BrandImageReport | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [selectedDesignType, setSelectedDesignType] = useState('banner')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Reset all states when uploading new file
      setUploadedFile(file)
      setImagePreview(null)
      setImageMetadata(null)
      setReport(null)
      setIsChecking(false)
      
      // สร้าง preview ของรูปภาพ
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      // อ่าน metadata พื้นฐาน
      const basicMetadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString('th-TH')
      }
      
      // อ่าน metadata เพิ่มเติมจากรูปภาพ
      try {
        const imageMetadata = await readImageMetadata(file)
        setImageMetadata({
          ...basicMetadata,
          ...(imageMetadata as any)
        })
      } catch (error) {
        console.warn('Failed to read image metadata:', error)
        setImageMetadata(basicMetadata)
      }
      
      // Reset file input to allow same file upload again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      console.log('📁 File uploaded:', basicMetadata)
    }
  }

  const readImageMetadata = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          
          // คำนวณ DPI โดยประมาณ (72 DPI เป็นค่าเริ่มต้น)
          const dpi = 72
          
          // คำนวณ aspect ratio
          const aspectRatio = (img.width / img.height).toFixed(2)
          
          // คำนวณ megapixels
          const megapixels = ((img.width * img.height) / 1000000).toFixed(2)
          
          // ตรวจสอบ color space
          const colorSpace = 'sRGB' // ค่าเริ่มต้น
          
          resolve({
            width: img.width,
            height: img.height,
            dpi: dpi,
            aspectRatio: aspectRatio,
            megapixels: megapixels,
            colorSpace: colorSpace
          })
        } else {
          reject(new Error('Could not get canvas context'))
        }
      }
      
      img.onerror = () => reject(new Error('Could not load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  const getTimeAgo = (lastModified: string) => {
    const now = new Date()
    const modified = new Date(lastModified)
    const diffInMs = now.getTime() - modified.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    const diffInWeeks = Math.floor(diffInDays / 7)
    const diffInMonths = Math.floor(diffInDays / 30)
    const diffInYears = Math.floor(diffInDays / 365)
    
    if (diffInYears > 0) {
      return `${diffInYears} ปีที่แล้ว`
    } else if (diffInMonths > 0) {
      return `${diffInMonths} เดือนที่แล้ว`
    } else if (diffInWeeks > 0) {
      return `${diffInWeeks} สัปดาห์ที่แล้ว`
    } else if (diffInDays > 0) {
      return `${diffInDays} วันที่แล้ว`
    } else {
      return 'วันนี้'
    }
  }

  const runComplianceCheck = async () => {
    if (!uploadedFile) {
      showToast('กรุณาอัปโหลดรูปภาพก่อน')
      return
    }

    setIsChecking(true)
    setReport(null) // Clear previous report

    try {
      const formData = new FormData()
      formData.append('file', uploadedFile)
      formData.append('designType', selectedDesignType)

      // ส่ง metadata ที่อ่านได้จากฝั่งเว็บไปด้วย
      if (imageMetadata) {
        formData.append('metadata', JSON.stringify({
          width: imageMetadata.width,
          height: imageMetadata.height,
          dpi: imageMetadata.dpi,
          aspectRatio: imageMetadata.aspectRatio,
          megapixels: imageMetadata.megapixels,
          colorSpace: imageMetadata.colorSpace
        }))
      }
      
      console.log('🚀 Sending request to API...', { metadata: imageMetadata })
      
      const response = await fetch('/api/check/design-image/', {
        method: 'POST',
        body: formData,
      })
      
      console.log('📡 Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error Response:', errorText)
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText }
        }
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      const reportData = await response.json()
      console.log('✅ Report received:', reportData)
      setReport(reportData)
      showToast('การตรวจสอบเสร็จสิ้น!')
    } catch (error) {
      console.error('❌ Compliance check error:', error)
      showToast(`เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsChecking(false)
    }
  }

  const clearData = () => {
    setUploadedFile(null)
    setImagePreview(null)
    setImageMetadata(null)
    setReport(null)
    setIsChecking(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        const event = {
          target: { files: [file] }
        } as React.ChangeEvent<HTMLInputElement>
        handleFileUpload(event)
      } else {
        showToast('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น')
      }
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50'
    if (score >= 60) return 'bg-yellow-50'
    if (score >= 40) return 'bg-orange-50'
    return 'bg-red-50'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-deep-earth mb-4">
          Brand Compliance Checker
        </h2>
        <p className="text-lg text-deep-earth/70 max-w-3xl mx-auto">
          ตรวจสอบการใช้งานแบรนด์ในงานออกแบบด้วย AI Multi-Category Deep Inspection
          <br />
          <span className="text-sm text-deep-earth/50">
            วิเคราะห์ 12 หมวดหมู่หลัก พร้อมการประเมินความเสี่ยงและคำแนะนำที่ละเอียด
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          {/* Design Type Selection */}
          <div className="card">
            <h3 className="text-lg font-semibold text-deep-earth mb-4">ประเภทงานออกแบบ</h3>
            <select
              value={selectedDesignType}
              onChange={(e) => setSelectedDesignType(e.target.value)}
              className="w-full p-3 border border-mist-grey rounded-lg focus:ring-2 focus:ring-skypath-blue focus:border-transparent"
            >
              {designTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div className="card">
            <h3 className="text-lg font-semibold text-deep-earth mb-4">อัปโหลดรูปภาพ</h3>
            <div
              className="border-2 border-dashed border-mist-grey rounded-lg p-8 text-center hover:border-skypath-blue transition-colors cursor-pointer"
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-mist-grey mx-auto mb-4" />
              <p className="text-deep-earth/70 mb-2">
                ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
              </p>
              <p className="text-sm text-deep-earth/50">
                รองรับไฟล์ PNG, JPG, JPEG, WEBP
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={runComplianceCheck}
              disabled={!uploadedFile || isChecking}
              className="flex-1 bg-skypath-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-skypath-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  กำลังตรวจสอบ...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  ตรวจสอบ Multi-Category Deep Inspection
                </>
              )}
            </button>
            <button
              onClick={clearData}
              className="px-6 py-3 border border-mist-grey text-deep-earth rounded-lg font-medium hover:bg-mist-grey/50 transition-colors"
            >
              ล้างข้อมูล
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {!uploadedFile ? (
            <div className="card text-center py-12">
              <FileText className="w-16 h-16 text-mist-grey mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-deep-earth mb-2">ยังไม่มีไฟล์</h3>
              <p className="text-deep-earth/70">
                กรุณาอัปโหลดรูปภาพเพื่อเริ่มการตรวจสอบ
              </p>
            </div>
          ) : (
            <>
              {/* File Information */}
              {imagePreview && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-deep-earth mb-4">ไฟล์ที่อัปโหลด</h3>
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {imageMetadata && (
                      <div className="p-3 bg-mist-grey/30 rounded-lg">
                        <h4 className="text-sm font-medium text-deep-earth mb-3">ข้อมูลไฟล์:</h4>
                        <div className="space-y-3 text-sm text-deep-earth/70">
                          <div>
                            <span className="font-medium text-deep-earth">ชื่อไฟล์:</span>
                            <div className="mt-1 break-all">{imageMetadata.name}</div>
                          </div>
                          <div>
                            <span className="font-medium text-deep-earth">ขนาด:</span>
                            <div className="mt-1">{(imageMetadata.size / 1024).toFixed(1)} KB</div>
                          </div>
                          <div>
                            <span className="font-medium text-deep-earth">ประเภท:</span>
                            <div className="mt-1">{imageMetadata.type}</div>
                          </div>
                          <div>
                            <span className="font-medium text-deep-earth">ขนาดภาพ:</span>
                            <div className="mt-1">{imageMetadata.width} × {imageMetadata.height} px</div>
                          </div>
                          <div>
                            <span className="font-medium text-deep-earth">DPI:</span>
                            <div className="mt-1">{imageMetadata.dpi}</div>
                          </div>
                          <div>
                            <span className="font-medium text-deep-earth">อัตราส่วน:</span>
                            <div className="mt-1">{imageMetadata.aspectRatio}:1</div>
                          </div>
                          <div>
                            <span className="font-medium text-deep-earth">เมกะพิกเซล:</span>
                            <div className="mt-1">{imageMetadata.megapixels} MP</div>
                          </div>
                          <div>
                            <span className="font-medium text-deep-earth">แก้ไขล่าสุด:</span>
                            <div className="mt-1">{imageMetadata.lastModified}</div>
                            <div className="mt-1 text-xs text-deep-earth/50">
                              ({getTimeAgo(imageMetadata.lastModified)})
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Results */}
              {report && (
                <div className="space-y-6">
                  {/* Overall Summary */}
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-deep-earth">สรุปผลการตรวจสอบ</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(report.summary.overall_score)} ${getScoreColor(report.summary.overall_score)}`}>
                        {report.summary.overall_score}/100
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-deep-earth/70">{report.summary.conclusion}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-morning-gold" />
                          <span>Brand Familiarity: {report.summary.brand_familiarity_index}/100</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-earth-green" />
                          <span>AI Confidence: {Math.round(report.ai_confidence.overall * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Scores */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-deep-earth mb-4">คะแนนรายหมวด</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(report.category_scores).map(([key, score]) => {
                        const Icon = categoryIcons[key as CategoryKey]
                        return (
                          <div key={key} className="flex items-center gap-3 p-3 bg-mist-grey/30 rounded-lg">
                            <Icon className="w-5 h-5 text-skypath-blue" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-deep-earth">
                                {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </div>
                              <div className={`text-lg font-bold ${getScoreColor(score)}`}>
                                {score}/100
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Issues */}
                  {report.issues && report.issues.length > 0 && (
                    <div className="card">
                      <h3 className="text-lg font-semibold text-deep-earth mb-4">ปัญหาที่พบ</h3>
                      <div className="space-y-3">
                        {report.issues.map((issue, index) => {
                          const Icon = severityIcons[issue.severity]
                          return (
                            <div key={index} className={`p-4 rounded-lg border ${severityColors[issue.severity]}`}>
                              <div className="flex items-start gap-3">
                                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="font-medium mb-1">{issue.description}</div>
                                  <div className="text-sm opacity-75">{issue.fix}</div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* SEO Suggestions */}
                  {report.seo && (
                    <div className="card">
                      <h3 className="text-lg font-semibold text-deep-earth mb-4">คำแนะนำ SEO</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-deep-earth">ชื่อไฟล์ที่แนะนำ:</span>
                          <div className="mt-1 p-2 bg-mist-grey/30 rounded text-sm font-mono">
                            {report.seo.recommendedFileName}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-deep-earth">Alt Text:</span>
                          <div className="mt-1 p-2 bg-mist-grey/30 rounded text-sm">
                            {report.seo.altText}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-deep-earth">Title:</span>
                          <div className="mt-1 p-2 bg-mist-grey/30 rounded text-sm">
                            {report.seo.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Visual Suggestions */}
                  {report.visual_suggestions && report.visual_suggestions.length > 0 && (
                    <div className="card">
                      <h3 className="text-lg font-semibold text-deep-earth mb-4">คำแนะนำการปรับปรุง</h3>
                      <div className="space-y-2">
                        {report.visual_suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-morning-gold/10 rounded-lg">
                            <div className="w-2 h-2 bg-morning-gold rounded-full mt-2 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-deep-earth">{suggestion.description}</div>
                              <div className="text-sm text-deep-earth/70">{suggestion.implementation}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Confidence Details */}
                  {report.ai_confidence.uncertain_areas && report.ai_confidence.uncertain_areas.length > 0 && (
                    <div className="card">
                      <h3 className="text-lg font-semibold text-deep-earth mb-4">พื้นที่ที่ไม่แน่ใจ</h3>
                      <div className="space-y-2">
                        {report.ai_confidence.uncertain_areas.map((area, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm text-yellow-800">{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}