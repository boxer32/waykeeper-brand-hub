'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, AlertTriangle, XCircle, Download, RefreshCw } from 'lucide-react'
import { showToast } from '@/lib/utils'
// import type { BrandImageReport } from '@/types/brand-image-report'

const complianceChecks = [
  {
    category: 'Logo Usage',
    checks: [
      { rule: 'Logo placement correct', ruleThai: 'โลโก้วางตำแหน่งถูกต้อง', weight: 'high' },
      { rule: 'Logo size minimum 40px height', ruleThai: 'โลโก้ใหญ่ไม่ต่ำกว่า 40px', weight: 'medium' },
      { rule: 'Clear space around logo maintained', ruleThai: 'มีพื้นที่ว่างรอบโลโก้เพียงพอ', weight: 'high' },
      { rule: 'No distortion or stretching', ruleThai: 'โลโก้ไม่บิดเบี้ยวหรือยืด', weight: 'high' }
    ]
  },
  {
    category: 'Colors',
    checks: [
      { rule: 'Colors match brand palette', ruleThai: 'สีตรงกับสีประจำแบรนด์', weight: 'high' },
      { rule: 'Proper color contrast ratios', ruleThai: 'สีมีคอนทราสต์เพียงพอ', weight: 'high' },
      { rule: 'No unauthorized color usage', ruleThai: 'ไม่ใช้สีที่ไม่อนุญาต', weight: 'medium' },
      { rule: 'Color hierarchy maintained', ruleThai: 'ลำดับความสำคัญของสีถูกต้อง', weight: 'medium' }
    ]
  },
  {
    category: 'Typography',
    checks: [
      { rule: 'Inter font family used', ruleThai: 'ใช้ฟอนต์ Inter', weight: 'high' },
      { rule: 'Typography hierarchy correct', ruleThai: 'ลำดับหัวข้อถูกต้อง', weight: 'medium' },
      { rule: 'Minimum 16px body text', ruleThai: 'ข้อความไม่ต่ำกว่า 16px', weight: 'high' },
      { rule: 'No prohibited fonts', ruleThai: 'ไม่ใช้ฟอนต์ที่ห้าม', weight: 'high' }
    ]
  },
  {
    category: 'Voice & Tone',
    checks: [
      { rule: 'Tone matches brand guidelines', ruleThai: 'น้ำเสียงตรงกับแนวทางแบรนด์', weight: 'medium' },
      { rule: 'No corporate speak', ruleThai: 'ไม่ใช้ภาษาทางการมากเกินไป', weight: 'medium' },
      { rule: 'Friendly, local voice', ruleThai: 'น้ำเสียงเป็นมิตร ใกล้ชิด', weight: 'medium' },
      { rule: 'No prohibited words', ruleThai: 'ไม่ใช้คำที่ห้าม', weight: 'low' }
    ]
  },
  {
    category: 'Accessibility',
    checks: [
      { rule: 'WCAG AA compliance', ruleThai: 'คนพิการอ่านได้', weight: 'high' },
      { rule: 'Text contrast sufficient', ruleThai: 'ข้อความชัดเจนพอ', weight: 'high' },
      { rule: 'Alt text for images', ruleThai: 'รูปภาพมีคำอธิบาย', weight: 'medium' },
      { rule: 'Keyboard navigation', ruleThai: 'ใช้คีย์บอร์ดได้', weight: 'medium' }
    ]
  },
  {
    category: 'File Quality',
    checks: [
      { rule: 'High resolution images', ruleThai: 'รูปภาพความละเอียดสูง', weight: 'medium' },
      { rule: 'Correct file format', ruleThai: 'รูปแบบไฟล์ถูกต้อง', weight: 'low' },
      { rule: 'Optimized file size', ruleThai: 'ขนาดไฟล์เหมาะสม', weight: 'low' },
      { rule: 'No pixelation', ruleThai: 'รูปไม่แตก', weight: 'medium' }
    ]
  }
]

const designTypes = [
  { value: 'banner', label: 'แบนเนอร์', description: 'แบนเนอร์เว็บไซต์, โฆษณา' },
  { value: 'social-post', label: 'โพสต์โซเชียล', description: 'Facebook, Instagram, Twitter' },
  { value: 'instagram-story', label: 'สตอรี่อินสตาแกรม', description: 'Instagram Story, Reels' },
  { value: 'print-ad', label: 'โฆษณาพิมพ์', description: 'โฆษณาในหนังสือพิมพ์, นิตยสาร' },
  { value: 'business-card', label: 'นามบัตร', description: 'นามบัตร, การ์ดติดต่อ' },
  { value: 'brochure', label: 'โบรชัวร์', description: 'โบรชัวร์, แผ่นพับ' },
  { value: 'presentation', label: 'งานนำเสนอ', description: 'PowerPoint, Keynote' },
  { value: 'website', label: 'เว็บไซต์', description: 'หน้าเว็บ, Landing Page' },
  { value: 'email', label: 'อีเมล', description: 'Email Marketing, Newsletter' },
  { value: 'other', label: 'อื่นๆ', description: 'ประเภทอื่นๆ' }
]

export default function BrandComplianceChecker() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedDesignType, setSelectedDesignType] = useState('banner')
  const [report, setReport] = useState<any | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageMetadata, setImageMetadata] = useState<any>(null)
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

  // ฟังก์ชันคำนวณระยะเวลาที่แก้ไขล่าสุด
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

  // ฟังก์ชันอ่าน metadata จากรูปภาพ
  const readImageMetadata = async (file: File) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      img.onload = () => {
        try {
          // อ่านขนาดภาพ
          const width = img.naturalWidth
          const height = img.naturalHeight
          
          // คำนวณ DPI (ประมาณการจากขนาดภาพและขนาดไฟล์)
          const estimatedDpi = Math.round(Math.sqrt((file.size * 8) / (width * height * 3)) * 25.4)
          
          // อ่านข้อมูลเพิ่มเติมจาก Canvas
          canvas.width = width
          canvas.height = height
          ctx?.drawImage(img, 0, 0)
          
          // ตรวจสอบ Color Space
          const colorSpace = ctx?.getContextAttributes()?.colorSpace || 'srgb'
          
          resolve({
            width,
            height,
            dpi: estimatedDpi,
            colorSpace,
            aspectRatio: (width / height).toFixed(2),
            megapixels: ((width * height) / 1000000).toFixed(1)
          })
        } catch (error) {
          reject(error)
        }
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }


  const runComplianceCheck = async () => {
    if (!uploadedFile) {
      showToast('กรุณาอัปโหลดรูปภาพก่อน')
      return
    }
    
    const selectedType = designTypes.find(t => t.value === selectedDesignType)
    console.log(`🔍 Checking ${selectedType?.label} compliance for file:`, uploadedFile.name)
    console.log('📁 File details:', {
      name: uploadedFile.name,
      size: uploadedFile.size,
      type: uploadedFile.type
    })
    
    setIsChecking(true)
    setReport(null)
    
    try {
      const formData = new FormData()
      formData.append('file', uploadedFile)
      
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
      
      const response = await fetch('/api/check/design-image', {
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

  const getStatusIcon = (pass: boolean | null) => {
    if (pass === true) {
        return <CheckCircle className="w-5 h-5 text-earth-green" />
    } else if (pass === false) {
      return <XCircle className="w-5 h-5 text-heart-rose" />
    } else {
        return <AlertTriangle className="w-5 h-5 text-morning-gold" />
    }
  }

  const getStatusColor = (pass: boolean | null) => {
    if (pass === true) {
        return 'text-earth-green bg-earth-green/10'
    } else if (pass === false) {
      return 'text-heart-rose bg-heart-rose/10'
    } else {
        return 'text-morning-gold bg-morning-gold/10'
    }
  }

  const getStatusLabel = (pass: boolean | null) => {
    if (pass === true) {
      return 'ผ่าน'
    } else if (pass === false) {
      return 'ไม่ผ่าน'
    } else {
      return 'ไม่แน่ใจ'
    }
  }

  // คำนวณคะแนนจาก report
  const overallScore = report?.score?.overall || 0
  const allItems = report?.sections?.flatMap((s: any) => s.items) || []
  const passedCount = allItems.filter((item: any) => item.pass === true).length
  const failedCount = allItems.filter((item: any) => item.pass === false).length
  const warningCount = allItems.filter((item: any) => item.pass === null).length

  return (
    <section id="compliance" className="py-16 bg-gradient-to-br from-mist-grey to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-deep-earth mb-4">
            Brand Compliance Checker
          </h2>
          <p className="text-lg text-deep-earth/70 max-w-2xl mx-auto mb-4">
            Upload your design or paste text to check brand compliance automatically
          </p>
          <p className="text-base text-deep-earth/60 max-w-3xl mx-auto">
            ✅ นี่คือเครื่องตรวจสอบของ Waykeeper เหมือนเป็นครูที่ตรวจการบ้าน 
            เราเอารูปหรือข้อความมาให้ตรวจ แล้วจะบอกว่าใช้ถูกต้องตามกฎของ Waykeeper หรือไม่ 
            เพื่อให้ทุกอย่างดูเหมือนกันและถูกต้อง
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Design Type Selection */}
            <div className="card">
              <h3 className="text-lg font-semibold text-deep-earth mb-4">เลือกประเภทการออกแบบ</h3>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-deep-earth">
                  ประเภทของรูปภาพที่ต้องการตรวจสอบ:
                </label>
                <select
                  value={selectedDesignType}
                  onChange={(e) => setSelectedDesignType(e.target.value)}
                  className="w-full p-3 border border-mist-grey rounded-lg focus:ring-2 focus:ring-skypath-blue focus:border-transparent"
                >
                  {designTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-deep-earth/60">
                  เลือกประเภทที่ตรงกับรูปภาพของคุณเพื่อการตรวจสอบที่แม่นยำยิ่งขึ้น
                </p>
              </div>
            </div>

            {/* File Upload */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-deep-earth">อัปโหลดรูปภาพ</h3>
                {uploadedFile && (
                  <button
                    onClick={() => {
                      setUploadedFile(null)
                      setImagePreview(null)
                      setImageMetadata(null)
                      setReport(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                    className="text-sm text-heart-rose hover:text-heart-rose/80 flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    ล้างข้อมูล
                  </button>
                )}
              </div>
              <div
                className="border-2 border-dashed border-mist-grey rounded-lg p-8 text-center hover:border-skypath-blue transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.add('border-skypath-blue', 'bg-skypath-blue/5')
                }}
                onDragLeave={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('border-skypath-blue', 'bg-skypath-blue/5')
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('border-skypath-blue', 'bg-skypath-blue/5')
                  const files = e.dataTransfer.files
                  if (files.length > 0) {
                    const file = files[0]
                    if (file.type.startsWith('image/') || file.name.match(/\.(png|jpg|jpeg|pdf|ai|psd)$/i)) {
                      // สร้าง synthetic event
                      const syntheticEvent = {
                        target: { files: [file] }
                      } as unknown as React.ChangeEvent<HTMLInputElement>
                      handleFileUpload(syntheticEvent)
                    } else {
                      showToast('กรุณาเลือกไฟล์รูปภาพเท่านั้น')
                    }
                  }
                }}
              >
                <Upload className="w-12 h-12 text-deep-earth/40 mx-auto mb-4" />
                <p className="text-deep-earth/70 mb-2">
                  ลากรูปภาพมาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
                </p>
                <p className="text-sm text-deep-earth/50">
                  รองรับไฟล์ PNG, JPG, PDF, AI, PSD
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf,.ai,.psd"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              {uploadedFile && (
                <div className="mt-4 p-3 bg-skypath-blue/10 rounded-lg">
                  <p className="text-sm text-skypath-blue font-medium">
                    ✓ ไฟล์อัปโหลดสำเร็จ
                  </p>
                  <p className="text-xs text-deep-earth/60 mt-1">
                    ดูรายละเอียดไฟล์ในส่วนด้านขวา
                  </p>
                </div>
              )}
            </div>


            {/* Check Button */}
            <button
              onClick={runComplianceCheck}
              disabled={isChecking || !uploadedFile}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  กำลังตรวจสอบ{designTypes.find(t => t.value === selectedDesignType)?.label}...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  ตรวจสอบ{designTypes.find(t => t.value === selectedDesignType)?.label}
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {report && (
              <>
                {/* Image Info & Metadata */}
                {report.input && (
                  <div className="card bg-white">
                    <h3 className="text-lg font-semibold text-deep-earth mb-4">ข้อมูลรูปภาพที่ตรวจสอบ</h3>
                    
                    {/* Image Preview in Results */}
                    {imagePreview && (
                      <div className="mb-4">
                        <h4 className="font-medium text-deep-earth mb-2">รูปภาพที่ตรวจสอบ:</h4>
                        <div className="border border-mist-grey rounded-lg overflow-hidden">
                          <img 
                            src={imagePreview} 
                            alt="Image being analyzed" 
                            className="w-full h-64 object-contain bg-mist-grey/20"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Basic Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-deep-earth">ข้อมูลพื้นฐาน:</h4>
                        <div className="text-sm text-deep-earth/70 space-y-1">
                          <div><span className="font-medium">ชื่อไฟล์:</span> {report.input.fileName}</div>
                          <div><span className="font-medium">ประเภท:</span> {report.input.mime}</div>
                          <div><span className="font-medium">ขนาด:</span> {report.input.sizeBytes ? Math.round(report.input.sizeBytes / 1024) + ' KB' : 'ไม่ทราบ'}</div>
                          <div><span className="font-medium">ขนาดภาพ:</span> {report.input.width} × {report.input.height} px</div>
                          <div><span className="font-medium">DPI:</span> {report.input.dpi || 'ไม่ทราบ'}</div>
                        </div>
                      </div>
                      
                      {/* Technical Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-deep-earth">ข้อมูลเทคนิค:</h4>
                        <div className="text-sm text-deep-earth/70 space-y-1">
                          <div><span className="font-medium">Color Space:</span> {report.input.colorSpace || 'ไม่ทราบ'}</div>
                          <div><span className="font-medium">ICC Profile:</span> {report.input.iccProfile || 'ไม่มี'}</div>
                          {report.input.exif && (
                            <>
                              <div><span className="font-medium">กล้อง:</span> {report.input.exif.cameraMake} {report.input.exif.cameraModel}</div>
                              <div><span className="font-medium">เลนส์:</span> {report.input.exif.lensModel || 'ไม่ทราบ'}</div>
                              <div><span className="font-medium">วันที่ถ่าย:</span> {report.input.exif.dateTimeOriginal || 'ไม่ทราบ'}</div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ข้อมูล EXIF ละเอียด */}
                {report?.input?.exif && (
                  <div className="card bg-morning-gold/5">
                    <h3 className="text-lg font-semibold text-deep-earth mb-4">📸 ข้อมูล EXIF ละเอียด</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* ข้อมูลกล้องและเลนส์ */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-deep-earth text-sm border-b border-morning-gold/30 pb-1">กล้อง & เลนส์</h4>
                        <div className="space-y-2 text-sm text-deep-earth/70">
                          {(report.input.exif.cameraMake || report.input.exif.cameraModel) && (
                            <div>
                              <span className="font-medium">กล้อง:</span>
                              <div className="mt-1">
                                {report.input.exif.cameraMake && report.input.exif.cameraModel 
                                  ? `${report.input.exif.cameraMake} ${report.input.exif.cameraModel}`
                                  : report.input.exif.cameraMake || report.input.exif.cameraModel
                                }
                              </div>
                            </div>
                          )}
                          
                          {(report.input.exif.lensMake || report.input.exif.lensModel) && (
                            <div>
                              <span className="font-medium">เลนส์:</span>
                              <div className="mt-1">
                                {report.input.exif.lensMake && report.input.exif.lensModel 
                                  ? `${report.input.exif.lensMake} ${report.input.exif.lensModel}`
                                  : report.input.exif.lensMake || report.input.exif.lensModel
                                }
                              </div>
                            </div>
                          )}
                          
                          {report.input.exif.focalLength && (
                            <div>
                              <span className="font-medium">ระยะโฟกัส:</span>
                              <div className="mt-1">
                                {report.input.exif.focalLength}mm
                                {report.input.exif.focalLengthIn35mm && (
                                  <span className="text-deep-earth/50 ml-1">
                                    ({report.input.exif.focalLengthIn35mm}mm equiv.)
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* การตั้งค่ากล้อง */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-deep-earth text-sm border-b border-morning-gold/30 pb-1">การตั้งค่า</h4>
                        <div className="space-y-2 text-sm text-deep-earth/70">
                          {report.input.exif.fNumber && (
                            <div>
                              <span className="font-medium">รูรับแสง:</span>
                              <div className="mt-1">f/{report.input.exif.fNumber}</div>
                            </div>
                          )}
                          
                          {report.input.exif.exposureTime && (
                            <div>
                              <span className="font-medium">ความเร็วชัตเตอร์:</span>
                              <div className="mt-1">1/{Math.round(1/report.input.exif.exposureTime)}s</div>
                            </div>
                          )}
                          
                          {report.input.exif.iso && (
                            <div>
                              <span className="font-medium">ISO:</span>
                              <div className="mt-1">{report.input.exif.iso}</div>
                            </div>
                          )}
                          
                          {report.input.exif.whiteBalance && (
                            <div>
                              <span className="font-medium">สมดุลแสงขาว:</span>
                              <div className="mt-1">
                                {report.input.exif.whiteBalance === 0 ? 'Auto' : 
                                 report.input.exif.whiteBalance === 1 ? 'Manual' : 
                                 report.input.exif.whiteBalance}
                              </div>
                            </div>
                          )}
                          
                          {report.input.exif.flash && (
                            <div>
                              <span className="font-medium">แฟลช:</span>
                              <div className="mt-1">
                                {report.input.exif.flash === 0 ? 'ไม่ใช้' : 
                                 report.input.exif.flash === 1 ? 'ใช้' : 
                                 'ไม่ทราบ'}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ข้อมูลเพิ่มเติม */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-deep-earth text-sm border-b border-morning-gold/30 pb-1">ข้อมูลเพิ่มเติม</h4>
                        <div className="space-y-2 text-sm text-deep-earth/70">
                          {report.input.exif.dateTimeOriginal && (
                            <div>
                              <span className="font-medium">วันที่ถ่าย:</span>
                              <div className="mt-1">
                                {new Date(report.input.exif.dateTimeOriginal).toLocaleString('th-TH')}
                              </div>
                            </div>
                          )}
                          
                          {report.input.exif.software && (
                            <div>
                              <span className="font-medium">ซอฟต์แวร์:</span>
                              <div className="mt-1 text-xs break-all">{report.input.exif.software}</div>
                            </div>
                          )}
                          
                          {report.input.exif.artist && (
                            <div>
                              <span className="font-medium">ศิลปิน:</span>
                              <div className="mt-1">{report.input.exif.artist}</div>
                            </div>
                          )}
                          
                          {report.input.exif.copyright && (
                            <div>
                              <span className="font-medium">ลิขสิทธิ์:</span>
                              <div className="mt-1 text-xs">{report.input.exif.copyright}</div>
                            </div>
                          )}
                          
                          {report.input.exif.imageDescription && (
                            <div>
                              <span className="font-medium">คำอธิบาย:</span>
                              <div className="mt-1 text-xs">{report.input.exif.imageDescription}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ข้อมูล GPS */}
                    {report.input.exif.gps && (
                      <div className="mt-4 p-3 bg-earth-green/10 rounded-lg">
                        <h4 className="font-medium text-deep-earth text-sm mb-2">📍 ตำแหน่ง GPS</h4>
                        <div className="text-sm text-deep-earth/70">
                          <div>
                            <span className="font-medium">พิกัด:</span>
                            <div className="mt-1">
                              {report.input.exif.gps.lat?.toFixed(6)}, {report.input.exif.gps.lng?.toFixed(6)}
                            </div>
                          </div>
                          {report.input.exif.gps.altitude && (
                            <div className="mt-2">
                              <span className="font-medium">ความสูง:</span>
                              <div className="mt-1">{report.input.exif.gps.altitude}m</div>
                            </div>
                          )}
                          {report.input.exif.gps.timestamp && (
                            <div className="mt-2">
                              <span className="font-medium">เวลาที่บันทึก GPS:</span>
                              <div className="mt-1">{report.input.exif.gps.timestamp}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ข้อมูลเทคนิค */}
                    {(report.input.exif.compression || report.input.exif.bitsPerSample || report.input.exif.samplesPerPixel) && (
                      <div className="mt-4 p-3 bg-mist-grey/30 rounded-lg">
                        <h4 className="font-medium text-deep-earth text-sm mb-2">⚙️ ข้อมูลเทคนิค</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-deep-earth/70">
                          {report.input.exif.compression && (
                            <div>
                              <span className="font-medium">การบีบอัด:</span>
                              <div className="mt-1">{report.input.exif.compression}</div>
                            </div>
                          )}
                          {report.input.exif.bitsPerSample && (
                            <div>
                              <span className="font-medium">Bits per sample:</span>
                              <div className="mt-1">{report.input.exif.bitsPerSample}</div>
                            </div>
                          )}
                          {report.input.exif.samplesPerPixel && (
                            <div>
                              <span className="font-medium">Samples per pixel:</span>
                              <div className="mt-1">{report.input.exif.samplesPerPixel}</div>
                            </div>
                          )}
                          {report.input.exif.photometricInterpretation && (
                            <div>
                              <span className="font-medium">Photometric:</span>
                              <div className="mt-1">{report.input.exif.photometricInterpretation}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Summary */}
                <div className="card bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-deep-earth">สรุปผลการตรวจสอบ</h3>
                    <div className="text-sm text-deep-earth/60 bg-mist-grey px-3 py-1 rounded-full">
                      {designTypes.find(t => t.value === selectedDesignType)?.label}
                    </div>
                  </div>
                  
                  {/* Overall Score */}
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-skypath-blue mb-2">
                      {overallScore}/100
                    </div>
                    <div className="text-sm text-deep-earth/60">คะแนนรวม</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-earth-green">{passedCount}</div>
                      <div className="text-sm text-deep-earth/60">ผ่าน</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-morning-gold">{warningCount}</div>
                      <div className="text-sm text-deep-earth/60">ไม่แน่ใจ</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-heart-rose">{failedCount}</div>
                      <div className="text-sm text-deep-earth/60">ไม่ผ่าน</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                      failedCount === 0 && warningCount === 0 
                        ? 'text-earth-green bg-earth-green/10'
                        : failedCount > 0 
                        ? 'text-heart-rose bg-heart-rose/10'
                        : 'text-morning-gold bg-morning-gold/10'
                    }`}>
                      {failedCount === 0 && warningCount === 0 ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          ผ่านการตรวจสอบทั้งหมด! ✓
                        </>
                      ) : failedCount > 0 ? (
                        <>
                          <XCircle className="w-4 h-4" />
                          มี {failedCount} ปัญหาที่ต้องแก้ไข
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          พบ {warningCount} คำเตือน
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Detailed Results by Section */}
                {report.sections && report.sections.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-deep-earth mb-4">รายละเอียดผลการตรวจสอบ</h3>
                    <div className="space-y-6">
                      {report.sections.map((section: any, index: number) => (
                        <div key={index} className="border-b border-mist-grey pb-4 last:border-b-0">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-deep-earth">{section.label}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-skypath-blue">{section.score}</span>
                              <span className="text-sm text-deep-earth/60">/100</span>
                            </div>
                          </div>
                          <p className="text-sm text-deep-earth/70 mb-3">{section.summary}</p>
                          
                          <div className="space-y-2">
                            {section.items.map((item: any, itemIndex: number) => (
                              <div key={itemIndex} className="flex items-start gap-3 p-3 rounded-lg bg-mist-grey/30">
                                {getStatusIcon(item.pass)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-deep-earth">{item.label}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(item.pass)}`}>
                                      {getStatusLabel(item.pass)}
                                    </span>
                                    {item.value && (
                                      <span className="text-xs text-deep-earth/50">
                                        ({item.value})
                            </span>
                                    )}
                          </div>
                                  {item.evidence && (
                                    <p className="text-xs text-deep-earth/60 mt-1">{item.evidence}</p>
                                  )}
                                  {item.suggestion && (
                                    <p className="text-xs text-skypath-blue mt-1">
                                      💡 {item.suggestion}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {report.suggestions && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-deep-earth mb-4">คำแนะนำการแก้ไข</h3>
                    
                    {/* Visual Fixes */}
                    {report.suggestions.visualFix && report.suggestions.visualFix.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-deep-earth mb-2 flex items-center gap-2">
                          <span className="text-skypath-blue">🎨</span> แก้ไขภาพ/ดีไซน์
                        </h4>
                        <ul className="space-y-1">
                          {report.suggestions.visualFix.map((fix: any, index: number) => (
                            <li key={index} className="text-sm text-deep-earth/70 flex items-start gap-2">
                              <span className="text-skypath-blue">•</span>
                              <span>{fix}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Format Fixes */}
                    {report.suggestions.formatFix && report.suggestions.formatFix.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-deep-earth mb-2 flex items-center gap-2">
                          <span className="text-morning-gold">📁</span> แก้ไขรูปแบบไฟล์
                        </h4>
                        <ul className="space-y-1">
                          {report.suggestions.formatFix.map((fix: any, index: number) => (
                            <li key={index} className="text-sm text-deep-earth/70 flex items-start gap-2">
                              <span className="text-morning-gold">•</span>
                              <span>{fix}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* SEO Advice */}
                    {report.suggestions.seo && (
                      <div className="mt-4 p-4 bg-skypath-blue/5 rounded-lg">
                        <h4 className="font-semibold text-deep-earth mb-3 flex items-center gap-2">
                          <span className="text-earth-green">🔍</span> คำแนะนำ SEO
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-deep-earth">ชื่อไฟล์ที่แนะนำ: </span>
                            <span className="text-skypath-blue">{report.suggestions.seo.recommendedFileName}</span>
                          </div>
                          <div>
                            <span className="font-medium text-deep-earth">Alt Text: </span>
                            <span className="text-deep-earth/70">{report.suggestions.seo.altText}</span>
                          </div>
                          <div>
                            <span className="font-medium text-deep-earth">Title: </span>
                            <span className="text-deep-earth/70">{report.suggestions.seo.title}</span>
                          </div>
                          {report.suggestions.seo.urlSlugHint && (
                            <div>
                              <span className="font-medium text-deep-earth">URL Slug: </span>
                              <span className="text-deep-earth/70">{report.suggestions.seo.urlSlugHint}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => showToast('การดาวน์โหลดรายงานจะมาเร็วๆ นี้!')}
                    className="btn-secondary flex items-center gap-2 flex-1"
                  >
                    <Download className="w-4 h-4" />
                    ดาวน์โหลดรายงาน
                  </button>
                  <button
                    onClick={() => showToast('ส่งคำขอตรวจสอบแล้ว!')}
                    className="btn-primary flex items-center gap-2 flex-1"
                  >
                    <FileText className="w-4 h-4" />
                    ขอตรวจสอบ
                  </button>
                </div>
              </>
            )}

            {/* File Info Display */}
            {!report && uploadedFile && (
              <div className="card">
                <h3 className="text-lg font-semibold text-deep-earth mb-4">ไฟล์ที่อัปโหลด</h3>
                
                {/* File Info */}
                <div className="p-3 bg-skypath-blue/10 rounded-lg mb-4">
                  <p className="text-sm text-skypath-blue font-medium">
                    ✓ ไฟล์ที่อัปโหลด: {uploadedFile.name}
                  </p>
                  <p className="text-xs text-deep-earth/60 mt-1">
                    ขนาด: {Math.round(uploadedFile.size / 1024)}KB • ประเภท: {uploadedFile.type}
                  </p>
                </div>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium text-deep-earth">ตัวอย่างภาพ:</h4>
                    <div className="border border-mist-grey rounded-lg overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-contain bg-mist-grey/20"
                      />
                    </div>
                  </div>
                )}
                
                {/* Metadata Display */}
                {imageMetadata && (
                  <div className="p-3 bg-mist-grey/30 rounded-lg">
                    <h4 className="text-sm font-medium text-deep-earth mb-3">ข้อมูลไฟล์:</h4>
                    <div className="space-y-3 text-sm text-deep-earth/70">
                      <div>
                        <span className="font-medium text-deep-earth">ชื่อไฟล์:</span>
                        <div className="mt-1 text-skypath-blue break-all">{imageMetadata.name}</div>
                      </div>
                      <div>
                        <span className="font-medium text-deep-earth">ขนาดไฟล์:</span>
                        <div className="mt-1">{Math.round(imageMetadata.size / 1024)} KB</div>
                      </div>
                      <div>
                        <span className="font-medium text-deep-earth">ประเภท:</span>
                        <div className="mt-1">{imageMetadata.type}</div>
                      </div>
                      {imageMetadata.width && imageMetadata.height && (
                        <div>
                          <span className="font-medium text-deep-earth">ขนาดภาพ:</span>
                          <div className="mt-1">{imageMetadata.width} × {imageMetadata.height} px</div>
                        </div>
                      )}
                      {imageMetadata.dpi && (
                        <div>
                          <span className="font-medium text-deep-earth">DPI (ประมาณการ):</span>
                          <div className="mt-1">{imageMetadata.dpi}</div>
                        </div>
                      )}
                      {imageMetadata.aspectRatio && (
                        <div>
                          <span className="font-medium text-deep-earth">อัตราส่วน:</span>
                          <div className="mt-1">{imageMetadata.aspectRatio}:1</div>
                        </div>
                      )}
                      {imageMetadata.megapixels && (
                        <div>
                          <span className="font-medium text-deep-earth">เมกะพิกเซล:</span>
                          <div className="mt-1">{imageMetadata.megapixels} MP</div>
                        </div>
                      )}
                      {imageMetadata.colorSpace && (
                        <div>
                          <span className="font-medium text-deep-earth">Color Space:</span>
                          <div className="mt-1">{imageMetadata.colorSpace}</div>
                        </div>
                      )}
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

                {/* EXIF Data from API Response */}
                {report && report.input && report.input.exif && (() => {
                  const exif = report.input.exif;
                  return (
                    <div className="p-3 bg-morning-gold/10 rounded-lg mt-3">
                      <h4 className="text-sm font-medium text-deep-earth mb-3">📸 ข้อมูล EXIF:</h4>
                      <div className="space-y-3 text-sm text-deep-earth/70">
                        {/* ข้อมูลกล้อง */}
                        {(exif.cameraMake || exif.cameraModel) && (
                          <div>
                            <span className="font-medium text-deep-earth">กล้อง:</span>
                            <div className="mt-1">
                              {exif.cameraMake && exif.cameraModel 
                                ? `${exif.cameraMake} ${exif.cameraModel}`
                                : exif.cameraMake || exif.cameraModel
                              }
                            </div>
                          </div>
                        )}
                        
                        {/* ข้อมูลเลนส์ */}
                        {(exif.lensMake || exif.lensModel) && (
                          <div>
                            <span className="font-medium text-deep-earth">เลนส์:</span>
                            <div className="mt-1">
                              {exif.lensMake && exif.lensModel 
                                ? `${exif.lensMake} ${exif.lensModel}`
                                : exif.lensMake || exif.lensModel
                              }
                            </div>
                          </div>
                        )}
                        
                        {/* การตั้งค่ากล้อง */}
                        {(exif.fNumber || exif.exposureTime || exif.iso) && (
                          <div>
                            <span className="font-medium text-deep-earth">การตั้งค่า:</span>
                            <div className="mt-1 space-y-1">
                              {exif.fNumber && (
                                <div>f/{exif.fNumber}</div>
                              )}
                              {exif.exposureTime && (
                                <div>1/{Math.round(1/exif.exposureTime)}s</div>
                              )}
                              {exif.iso && (
                                <div>ISO {exif.iso}</div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* ระยะโฟกัส */}
                        {exif.focalLength && (
                          <div>
                            <span className="font-medium text-deep-earth">ระยะโฟกัส:</span>
                            <div className="mt-1">
                              {exif.focalLength}mm
                              {exif.focalLengthIn35mm && (
                                <span className="text-deep-earth/50 ml-1">
                                  ({exif.focalLengthIn35mm}mm equiv.)
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* วันที่ถ่ายภาพ */}
                        {exif.dateTimeOriginal && (
                          <div>
                            <span className="font-medium text-deep-earth">วันที่ถ่าย:</span>
                            <div className="mt-1">
                              {new Date(exif.dateTimeOriginal).toLocaleString('th-TH')}
                            </div>
                          </div>
                        )}
                        
                        {/* ข้อมูล GPS */}
                        {exif.gps && (
                          <div>
                            <span className="font-medium text-deep-earth">ตำแหน่ง GPS:</span>
                            <div className="mt-1">
                              <div>📍 {exif.gps.lat?.toFixed(6)}, {exif.gps.lng?.toFixed(6)}</div>
                              {exif.gps.altitude && (
                                <div className="text-xs text-deep-earth/50">
                                  ความสูง: {exif.gps.altitude}m
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* ข้อมูลซอฟต์แวร์ */}
                        {exif.software && (
                          <div>
                            <span className="font-medium text-deep-earth">ซอฟต์แวร์:</span>
                            <div className="mt-1 text-xs break-all">{exif.software}</div>
                          </div>
                        )}
                        
                        {/* ข้อมูลศิลปิน/ลิขสิทธิ์ */}
                        {(exif.artist || exif.copyright) && (
                          <div>
                            <span className="font-medium text-deep-earth">ข้อมูลเพิ่มเติม:</span>
                            <div className="mt-1 space-y-1">
                              {exif.artist && (
                                <div>👤 {exif.artist}</div>
                              )}
                              {exif.copyright && (
                                <div>© {exif.copyright}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
                
                <div className="mt-4 p-3 bg-morning-gold/10 rounded-lg">
                  <p className="text-sm text-deep-earth/70 text-center">
                    ประเภทที่เลือก: <span className="font-medium text-skypath-blue">
                      {designTypes.find(t => t.value === selectedDesignType)?.label}
                    </span>
                  </p>
                  <p className="text-xs text-deep-earth/60 text-center mt-1">
                    กดปุ่ม "ตรวจสอบ" เพื่อเริ่มการวิเคราะห์
                  </p>
                </div>
              </div>
            )}
            
            {/* Empty State - Only when no file uploaded */}
            {!report && !uploadedFile && (
              <div className="card text-center py-12">
                <CheckCircle className="w-16 h-16 text-deep-earth/20 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-deep-earth mb-2">พร้อมตรวจสอบ</h3>
                <p className="text-deep-earth/70 mb-2">
                  อัปโหลดรูปภาพเพื่อเริ่มการตรวจสอบ brand compliance
                </p>
                <p className="text-sm text-deep-earth/60">
                  ประเภทที่เลือก: <span className="font-medium text-skypath-blue">
                    {designTypes.find(t => t.value === selectedDesignType)?.label}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Guidelines Reference */}
        <div className="mt-12 card bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-deep-earth">What We Check</h3>
            <div className="text-sm text-deep-earth/60 bg-skypath-blue/10 text-skypath-blue px-3 py-1 rounded-full">
              สำหรับ {designTypes.find(t => t.value === selectedDesignType)?.label}
            </div>
          </div>
          <p className="text-base text-deep-earth/60 mb-6">
            🔍 นี่คือสิ่งที่เราเช็คในเครื่องตรวจสอบ เหมือนเป็นรายการตรวจสอบที่ครูใช้ตรวจการบ้าน
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceChecks.map((category: any, index: number) => (
              <div key={index} className="space-y-3">
                <h4 className="font-semibold text-deep-earth">{category.category}</h4>
                <p className="text-xs text-deep-earth/50 mb-2">
                  {category.category === 'Logo Usage' && '🏷️ ตรวจว่าใช้โลโก้ถูกต้องหรือไม่'}
                  {category.category === 'Colors' && '🎨 ตรวจว่าสีที่ใช้ถูกต้องหรือไม่'}
                  {category.category === 'Typography' && '📝 ตรวจว่าตัวอักษรที่ใช้ถูกต้องหรือไม่'}
                  {category.category === 'Voice & Tone' && '💬 ตรวจว่าข้อความที่เขียนถูกต้องหรือไม่'}
                  {category.category === 'Accessibility' && '♿ ตรวจว่าคนพิการอ่านได้หรือไม่'}
                  {category.category === 'File Quality' && '📁 ตรวจว่าคุณภาพไฟล์ดีหรือไม่'}
                </p>
                <ul className="space-y-1 text-sm text-deep-earth/70">
                  {category.checks.map((check: any, checkIndex: number) => (
                    <li key={checkIndex} className="flex items-start gap-2">
                      <span className="text-earth-green">•</span>
                      <div>
                        <div>{check.rule}</div>
                        <div className="text-xs text-deep-earth/50 mt-1">{check.ruleThai}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
