'use client'

import { useState } from 'react'
import { Copy, Check, Download, RefreshCw } from 'lucide-react'
import { copyToClipboard, showToast } from '@/lib/utils'

const scenarios = [
  'Booking Confirmation',
  'Cancellation Email',
  'Social Media Post',
  'Website Copy',
  'Customer Support',
  'Error Message',
  'Tour Description',
  'Referral Invitation',
  'Newsletter Content'
]

const audiences = [
  'Backpacker',
  'Family',
  'Nomad',
  'Wellness Seeker'
]

const voiceExamples = {
  'Booking Confirmation': {
    'Backpacker': {
      good: "Your Pai adventure is confirmed! We'll see you on [date]. Need help? Just reply to this email.",
      bad: "Dear valued customer, your booking has been processed successfully. For further assistance, please contact our support team.",
      explanation: "Friendly, not formal • Clear call-to-action • Human, accessible tone"
    },
    'Family': {
      good: "Your family adventure in Northern Thailand is all set! We can't wait to show you the hidden gems. Questions? Just ask!",
      bad: "We acknowledge receipt of your booking request. Your family tour has been scheduled. Please contact us for any inquiries.",
      explanation: "Warm, family-focused • Enthusiastic but not overwhelming • Personal touch"
    },
    'Nomad': {
      good: "Your remote work adventure starts here! We've got your basecamp ready in Pai. Need coworking recommendations? We've got you covered.",
      bad: "Your accommodation booking has been confirmed. We provide workspace facilities. Please refer to our terms and conditions.",
      explanation: "Tech-savvy, understanding • Community-focused • Practical and helpful"
    },
    'Wellness Seeker': {
      good: "Your wellness journey begins with us. We've curated the perfect retreat experience for your restoration. Breathe easy, we've got this.",
      bad: "Your wellness program booking has been processed. Our facilities are available for your use. Please follow all guidelines.",
      explanation: "Calm, nurturing tone • Wellness-focused language • Supportive and encouraging"
    }
  },
  'Social Media Post': {
    'Backpacker': {
      good: "Just found the perfect sunset spot in Pai 🌅 Who's joining us for tomorrow's adventure? #WaykeeperAdventures #PaiLife",
      bad: "We are pleased to announce our new tour packages. Please visit our website for more information about our services.",
      explanation: "Casual, engaging • Uses emojis naturally • Creates FOMO • Community-focused"
    },
    'Family': {
      good: "Making memories that last a lifetime 💕 Our family tours are designed for all ages. What's your dream family adventure?",
      bad: "We offer family-friendly tour packages. Our services are suitable for children and adults. Book now for the best experience.",
      explanation: "Heartwarming, inclusive • Focuses on memories • Asks engaging questions • Safe and welcoming"
    },
    'Nomad': {
      good: "Work from anywhere, live everywhere 🌍 Our nomad-friendly basecamps in Pai are calling. WiFi included, adventure guaranteed.",
      bad: "We provide accommodation with internet access for remote workers. Our facilities are suitable for business travelers.",
      explanation: "Modern, aspirational • Work-life balance focus • Adventure + productivity • Community appeal"
    },
    'Wellness Seeker': {
      good: "Find your center in Northern Thailand 🧘‍♀️ Our wellness retreats blend ancient wisdom with modern comfort. Your transformation starts here.",
      bad: "We offer wellness programs and spa services. Our facilities include meditation areas and treatment rooms.",
      explanation: "Spiritual but not pretentious • Transformation-focused • Ancient wisdom appeal • Personal journey"
    }
  },
  'Customer Support': {
    'Backpacker': {
      good: "Hey! No worries about the change - we're super flexible. What works better for you? We'll make it happen!",
      bad: "We acknowledge your request for modification. Please provide your preferred alternative dates and we will review the feasibility.",
      explanation: "Casual, understanding • Problem-solving focus • Flexible attitude • Direct communication"
    },
    'Family': {
      good: "We totally understand family plans can change! Let's find a solution that works for everyone. What's your ideal timing?",
      bad: "Your modification request has been received. We will process your request according to our terms and conditions.",
      explanation: "Understanding, patient • Family-focused • Collaborative problem-solving • Reassuring tone"
    },
    'Nomad': {
      good: "Got it! We know nomad life is unpredictable. We've got backup plans and flexible options. What do you need?",
      bad: "We have received your inquiry. Our team will review your request and provide a response within 24 hours.",
      explanation: "Tech-savvy understanding • Flexible solutions • Quick response • Problem-solving focus"
    },
    'Wellness Seeker': {
      good: "We understand this is important for your wellness journey. Let's find a solution that supports your goals. How can we help?",
      bad: "Your request has been noted. We will accommodate your needs within our operational parameters.",
      explanation: "Supportive, understanding • Wellness-focused • Goal-oriented • Nurturing approach"
    }
  }
}

export default function VoiceTonePlayground() {
  const [selectedScenario, setSelectedScenario] = useState('Booking Confirmation')
  const [selectedAudience, setSelectedAudience] = useState('Backpacker')
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [customText, setCustomText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleCopy = (text: string, type: string) => {
    copyToClipboard(text)
    setCopiedText(`${type}-${text}`)
    showToast(`${type} copied!`)
    
    setTimeout(() => setCopiedText(null), 2000)
  }

  const generateNewExample = () => {
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)]
    const randomAudience = audiences[Math.floor(Math.random() * audiences.length)]
    setSelectedScenario(randomScenario)
    setSelectedAudience(randomAudience)
    showToast('New example generated!')
  }

  const adjustTextToBrandVoice = async () => {
    if (!customText.trim()) {
      showToast('กรุณาใส่ข้อความที่ต้องการปรับแต่ง')
      return
    }

    setIsProcessing(true)
    setIsAnalyzing(true)
    setAnalysisResult(null) // Clear previous results
    
    try {
      console.log('🚀 Sending request to API...', {
        scenario: selectedScenario,
        audience: selectedAudience,
        userText: customText.substring(0, 50) + '...'
      });

      const response = await fetch('/api/voice-tone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: selectedScenario,
          audience: selectedAudience,
          userText: customText,
        }),
      })

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        throw new Error(`API Error: ${errorData.error || 'Unknown error'}`)
      }

      const data = await response.json()
      console.log('✅ API Response:', { success: data.success, analysis: data.analysis });
      
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis)
        showToast('การวิเคราะห์เสร็จสิ้น!')
      } else {
        throw new Error('No response from AI')
      }
    } catch (error) {
      console.error('❌ Error adjusting text:', error)
      showToast(`เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsProcessing(false)
      setIsAnalyzing(false)
    }
  }


  const currentExample = (voiceExamples as any)[selectedScenario]?.[selectedAudience]

  return (
    <section id="voice" className="py-16 bg-gradient-to-br from-mist-grey to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-deep-earth mb-4">
            Voice & Tone Playground
          </h2>
          <p className="text-lg text-deep-earth/70 max-w-2xl mx-auto mb-4">
            Interactive examples of our brand voice across different scenarios and audiences
          </p>
          <p className="text-base text-deep-earth/60 max-w-3xl mx-auto">
            🎭 นี่คือสนามเด็กเล่นสำหรับการเขียนข้อความ เหมือนเป็นเกมที่ให้เราเลือกว่าจะเขียนให้ใคร 
            และในสถานการณ์ไหน แล้วจะได้ตัวอย่างข้อความที่เขียนแบบ "Waykeeper" 
            เพื่อให้ทุกคนเขียนข้อความแบบเดียวกัน
          </p>
        </div>

        {/* Controls */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-deep-earth mb-2">
                Select Scenario:
              </label>
              <select
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="w-full p-3 border border-mist-grey rounded-lg focus:ring-2 focus:ring-skypath-blue focus:border-transparent"
              >
                {scenarios.map((scenario) => (
                  <option key={scenario} value={scenario}>
                    {scenario}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-deep-earth mb-2">
                Select Audience:
              </label>
              <div className="flex gap-2">
                {audiences.map((audience) => (
                  <button
                    key={audience}
                    onClick={() => setSelectedAudience(audience)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedAudience === audience
                        ? 'bg-skypath-blue text-white'
                        : 'bg-mist-grey text-deep-earth hover:bg-skypath-blue hover:text-white'
                    }`}
                  >
                    {audience}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={generateNewExample}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Generate Random Example
            </button>
            
            <button
              onClick={() => handleCopy(selectedScenario + ' - ' + selectedAudience, 'Scenario')}
              className="copy-button flex items-center gap-2"
            >
              {copiedText?.includes('Scenario') ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              Copy Scenario
            </button>
          </div>
        </div>

        {/* Custom Text Input */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-deep-earth mb-4">
            ปรับแต่งข้อความของคุณ
            <span className="text-sm font-normal text-deep-earth/60 ml-2">
              (AI จะช่วยปรับข้อความให้ตรงกับ brand voice)
            </span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-deep-earth mb-2">
                ใส่ข้อความที่ต้องการปรับแต่ง:
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="เช่น: การจองสำเร็จแล้ว ขอบคุณที่เลือกใช้บริการของเรา"
                className="w-full h-32 p-4 border border-mist-grey rounded-lg focus:ring-2 focus:ring-skypath-blue focus:border-transparent resize-none"
              />
              <div className="mt-2 text-sm text-deep-earth/60">
                {customText.length} ตัวอักษร
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={adjustTextToBrandVoice}
                disabled={isProcessing || !customText.trim()}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    กำลังปรับแต่ง...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    ปรับแต่งให้ตรงกับ Brand Voice
                  </>
                )}
              </button>
              
              {customText && (
                <button
                  onClick={() => handleCopy(customText, 'Custom Text')}
                  className="btn-secondary flex items-center gap-2"
                >
                  {copiedText === `Custom Text-${customText}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  คัดลอกข้อความ
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Loading */}
        {isAnalyzing && (
          <div className="card mb-8">
            <div className="text-center py-12">
              {/* Main Spinner */}
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-skypath-blue/20 border-t-skypath-blue"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-skypath-blue/10 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Title with typing animation */}
              <h3 className="text-2xl font-semibold text-deep-earth mb-3">
                <span className="inline-block">กำลังวิเคราะห์</span>
                <span className="inline-block ml-2 text-skypath-blue animate-pulse">Voice & Tone</span>
              </h3>
              
              {/* Subtitle */}
              <p className="text-deep-earth/60 mb-6 max-w-md mx-auto">
                AI กำลังวิเคราะห์ข้อความของคุณให้ตรงกับ brand voice ของ Waykeeper
              </p>
              
              {/* Animated dots */}
              <div className="flex justify-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-skypath-blue rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-morning-gold rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-earth-green rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
              
              {/* Progress bar */}
              <div className="w-64 mx-auto bg-mist-grey rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-skypath-blue to-morning-gold rounded-full animate-pulse"></div>
              </div>
              
              {/* Fun message */}
              <p className="text-sm text-deep-earth/50 mt-4 animate-pulse">
                🎨 กำลังปรับแต่งข้อความให้สวยงาม...
              </p>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && !isAnalyzing && (
          <div className="card mb-8 animate-fadeIn">
            <h3 className="text-lg font-semibold text-deep-earth mb-4">
              ผลการวิเคราะห์ Voice & Tone
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score & Flags */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-skypath-blue">
                    {analysisResult.score}/100
                  </div>
                  <div>
                    <div className="text-sm text-deep-earth/60">คะแนนความเหมาะสม</div>
                    <div className="text-xs text-deep-earth/50">
                      {analysisResult.scenario} • {analysisResult.audience}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-deep-earth">Flags:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      analysisResult.flags?.corporateSpeak ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {analysisResult.flags?.corporateSpeak ? 'Corporate Speak' : 'No Corporate Speak'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      analysisResult.flags?.prohibitedWords?.length > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {analysisResult.flags?.prohibitedWords?.length > 0 ? 'Prohibited Words' : 'Clean Language'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Reasoning */}
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-deep-earth mb-2">จุดเด่น:</div>
                  <div className="space-y-1">
                    {analysisResult.reasoning?.good?.map((item: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-earth-green">
                        <span className="text-earth-green">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-deep-earth mb-2">จุดที่ควรปรับปรุง:</div>
                  <div className="space-y-1">
                    {analysisResult.reasoning?.bad?.map((item: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                        <span className="text-red-600">✗</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Examples */}
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Good Example */}
                <div className="border-l-4 border-earth-green bg-green-50 p-4 rounded-r-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-earth-green">Good Example</h4>
                    <button
                      onClick={() => handleCopy(analysisResult.goodExample, 'Good Example')}
                      className="copy-button flex items-center gap-1 text-xs"
                    >
                      {copiedText === `Good Example-${analysisResult.goodExample}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                  <p className="text-sm text-deep-earth/80">{analysisResult.goodExample}</p>
                </div>
                
                {/* Bad Example */}
                <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                  <div className="mb-2">
                    <h4 className="font-semibold text-red-600">Bad Example</h4>
                  </div>
                  <p className="text-sm text-deep-earth/80">{analysisResult.badExample}</p>
                </div>
              </div>
              
              {/* Suggestions */}
              {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-skypath-blue mb-2">คำแนะนำ:</h4>
                  <ul className="space-y-1">
                    {analysisResult.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-deep-earth/80">
                        <span className="text-skypath-blue">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Next Step */}
              {analysisResult.nextStep && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-morning-gold mb-2">ขั้นตอนถัดไป:</h4>
                  <p className="text-sm text-deep-earth/80">{analysisResult.nextStep}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Example Display */}
        {currentExample && (
          <div className="space-y-8">
            {/* Good Example */}
            <div className="card border-l-4 border-earth-green">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-earth-green rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <h3 className="text-lg font-semibold text-deep-earth">Good Example</h3>
                </div>
                <button
                  onClick={() => handleCopy(currentExample.good, 'Good Example')}
                  className="copy-button flex items-center gap-1"
                >
                  {copiedText === `Good Example-${currentExample.good}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>
              
              <div className="bg-earth-green/5 p-4 rounded-lg mb-4">
                <p className="text-deep-earth text-lg leading-relaxed">"{currentExample.good}"</p>
              </div>
              
              <div>
                <h4 className="font-medium text-deep-earth mb-2">Why it works:</h4>
                <p className="text-deep-earth/70 text-sm">{currentExample.explanation}</p>
              </div>
            </div>

            {/* Bad Example */}
            <div className="card border-l-4 border-heart-rose">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-heart-rose rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✗</span>
                  </div>
                  <h3 className="text-lg font-semibold text-deep-earth">Bad Example</h3>
                </div>
                <button
                  onClick={() => handleCopy(currentExample.bad, 'Bad Example')}
                  className="copy-button flex items-center gap-1"
                >
                  {copiedText === `Bad Example-${currentExample.bad}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>
              
              <div className="bg-heart-rose/5 p-4 rounded-lg mb-4">
                <p className="text-deep-earth text-lg leading-relaxed">"{currentExample.bad}"</p>
              </div>
              
              <div>
                <h4 className="font-medium text-deep-earth mb-2">Why it fails:</h4>
                <p className="text-deep-earth/70 text-sm">
                  Too formal • Corporate speak • Not actionable • Lacks personality
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Voice Principles */}
        <div className="mt-12 card bg-white">
          <h3 className="text-2xl font-semibold text-deep-earth mb-6">Voice Principles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-deep-earth mb-4">Core Traits</h4>
              <ul className="space-y-3 text-deep-earth/70">
                <li className="flex items-start gap-2">
                  <span className="text-earth-green">✓</span>
                  <div>
                    <strong>Authentic:</strong> Real experiences with real people, not staged
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-earth-green">✓</span>
                  <div>
                    <strong>Friendly:</strong> Like a local guide, not formal or corporate
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-earth-green">✓</span>
                  <div>
                    <strong>Local:</strong> Supporting communities, not big corporations
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-earth-green">✓</span>
                  <div>
                    <strong>Genuine:</strong> Building relationships, not just transactions
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-deep-earth mb-4">Tone Guidelines</h4>
              <ul className="space-y-3 text-deep-earth/70">
                <li className="flex items-start gap-2">
                  <span className="text-morning-gold">•</span>
                  <div>
                    <strong>Calm & Clear:</strong> Confident but humble, modern but warm
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-morning-gold">•</span>
                  <div>
                    <strong>Natural Language:</strong> Short sentences, quiet confidence
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-morning-gold">•</span>
                  <div>
                    <strong>Avoid:</strong> Overly spiritual, corporate, or touristic language
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-morning-gold">•</span>
                  <div>
                    <strong>Focus:</strong> Meaningful over touristy, accessible over exclusive
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Download Voice Guide */}
        <div className="text-center mt-8">
          <button
            onClick={() => showToast('Voice guide download coming soon!')}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Download className="w-4 h-4" />
            Download Complete Voice Guide (PDF)
          </button>
        </div>
      </div>
    </section>
  )
}
