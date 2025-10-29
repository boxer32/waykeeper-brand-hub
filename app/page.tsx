import Header from '@/components/Header'
import ColorPalette from '@/components/ColorPalette'
import Typography from '@/components/Typography'
import LogoVariations from '@/components/LogoVariations'
import AssetLibrary from '@/components/AssetLibrary'
import VoiceTonePlayground from '@/components/VoiceTonePlayground'
import PhotographyGuide from '@/components/PhotographyGuide'
import SubBrandSelector from '@/components/SubBrandSelector'
import CopyPasteComponents from '@/components/CopyPasteComponents'
import BrandComplianceChecker from '@/components/BrandComplianceChecker'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-skypath-blue/5 to-morning-gold/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-deep-earth mb-6">
            Waykeeper Brand Hub
          </h1>
          <p className="text-xl text-deep-earth/70 mb-4 max-w-3xl mx-auto">
            Everything you need to maintain consistent brand identity across all touchpoints. 
            Simply. Fairly. Connected.
          </p>
          <p className="text-lg text-deep-earth/60 mb-8 max-w-4xl mx-auto">
            🎨 นี่คือห้องสมุดของแบรนด์ Waykeeper ที่มีทุกอย่างที่เราต้องการเพื่อให้ทุกคนใช้สี โลโก้ และข้อความเหมือนกันหมด 
            เหมือนเป็นคู่มือการใช้งานที่บอกว่า "ใช้สีนี้ ใช้โลโก้แบบนี้ เขียนข้อความแบบนี้" เพื่อให้ลูกค้าเห็นแล้วรู้ทันทีว่าเป็น Waykeeper
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#colors" className="btn-primary">
              Start Exploring
            </a>
            <a href="#compliance" className="btn-secondary">
              Check Compliance
            </a>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white border-b border-mist-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-skypath-blue mb-2">7</div>
              <div className="text-sm text-deep-earth/60">Brand Colors</div>
              <div className="text-xs text-deep-earth/50 mt-1">สีที่ใช้ในแบรนด์</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-earth-green mb-2">50+</div>
              <div className="text-sm text-deep-earth/60">Assets Available</div>
              <div className="text-xs text-deep-earth/50 mt-1">ไฟล์ที่ดาวน์โหลดได้</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-morning-gold mb-2">5</div>
              <div className="text-sm text-deep-earth/60">Sub-Brands</div>
              <div className="text-xs text-deep-earth/50 mt-1">แบรนด์ย่อย</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-river-teal mb-2">100%</div>
              <div className="text-sm text-deep-earth/60">Brand Compliant</div>
              <div className="text-xs text-deep-earth/50 mt-1">ใช้ถูกต้องตามกฎ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main>
        <ColorPalette />
        <Typography />
        <LogoVariations />
        <VoiceTonePlayground />
        <PhotographyGuide />
        <SubBrandSelector />
        <AssetLibrary />
        <CopyPasteComponents />
        <BrandComplianceChecker />
      </main>

      {/* Footer */}
      <footer className="bg-deep-earth text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Waykeeper Brand Hub</h3>
              <p className="text-white/70 mb-4">
                Internal brand guidelines and assets for consistent brand representation across all touchpoints.
              </p>
              <p className="text-sm text-white/60">
                Version 5.0 • December 2024
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#colors" className="hover:text-white transition-colors">Color Palette</a></li>
                <li><a href="#typography" className="hover:text-white transition-colors">Typography</a></li>
                <li><a href="#logos" className="hover:text-white transition-colors">Logo Guidelines</a></li>
                <li><a href="#voice" className="hover:text-white transition-colors">Voice & Tone</a></li>
                <li><a href="#assets" className="hover:text-white transition-colors">Asset Library</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Brand Resources</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#photography" className="hover:text-white transition-colors">Photography Guide</a></li>
                <li><a href="#subbrands" className="hover:text-white transition-colors">Sub-Brand Selector</a></li>
                <li><a href="#copy-paste" className="hover:text-white transition-colors">Copy Components</a></li>
                <li><a href="#compliance" className="hover:text-white transition-colors">Compliance Checker</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 Waykeeper. All rights reserved. Simply. Fairly. Connected.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
