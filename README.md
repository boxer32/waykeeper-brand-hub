# Waykeeper Brand Hub

Internal brand guidelines and assets hub for Waykeeper - Simply. Fairly. Connected.

## Overview

This is an internal corporate brand hub that provides easy access to all Waykeeper brand assets, guidelines, and tools. No login required - simply open and use.

## Features

### ✅ Essential Features (Tier 1)

1. **🎨 Interactive Color System**
   - Copy hex codes, RGB, CMYK values
   - Usage guidelines for each color
   - Contrast checking
   - Download swatches (ASE, ACO, CSS)

2. **📥 Downloadable Assets Library**
   - Logos (PNG, SVG, EPS, AI)
   - Typography (Inter font family)
   - Color swatches
   - Templates (Social media, presentations, email signatures)
   - Photography guidelines

3. **💬 Voice & Tone Playground**
   - Interactive examples by scenario and audience
   - Good vs bad examples
   - Copy-ready snippets
   - Voice principles guide

4. **🖼️ Photo Guidelines + Gallery**
   - Approved vs avoid examples
   - Filterable photo library
   - Download high-res versions
   - Upload request form

5. **🎭 Sub-Brand Selector**
   - Switch between master brand and sub-brands
   - Brand-specific messaging
   - Usage examples
   - Download brand kits

6. **📋 Copy-Paste Components**
   - Ready-to-use copy snippets
   - Email signatures
   - Social media bios
   - Website copy
   - Chat responses
   - Hashtags

7. **✅ Brand Compliance Checker**
   - Upload designs or paste text
   - Automatic compliance checking
   - Detailed reports
   - Download compliance reports

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build**: Static export (no server required)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   Create a `.env.local` file in the root directory:
   ```bash
   # OpenAI API Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Assistant ID for Voice & Tone Playground
   ASSISTANT_ID=your_assistant_id_here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Start Production Server**
   ```bash
   npm start
   ```

## Environment Variables

For production deployment, make sure to set these environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key for AI-powered features
- `ASSISTANT_ID`: OpenAI Assistant ID for Voice & Tone Playground

## Project Structure

```
platform/internal brand hub/
├── app/
│   ├── globals.css          # Global styles and Tailwind config
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── Header.tsx           # Navigation header
│   ├── ColorPalette.tsx     # Interactive color system
│   ├── Typography.tsx       # Typography examples
│   ├── LogoVariations.tsx   # Logo guidelines
│   ├── AssetLibrary.tsx     # Downloadable assets
│   ├── VoiceTonePlayground.tsx # Voice & tone examples
│   ├── PhotographyGuide.tsx # Photo guidelines
│   ├── SubBrandSelector.tsx # Sub-brand switcher
│   ├── CopyPasteComponents.tsx # Copy snippets
│   └── BrandComplianceChecker.tsx # Compliance tool
├── lib/
│   └── utils.ts             # Utility functions
├── package.json
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json
└── next.config.js           # Next.js configuration
```

## Brand Guidelines

### Master Brand Colors
- **Skypath Blue** (#77BEF0) - Simply messaging
- **Morning Gold** (#F9D88C) - Fairly messaging  
- **Earth Green** (#4A7C59) - Connected messaging
- **Mist Grey** (#E5E1DC) - Neutral backgrounds

### Typography
- **Font Family**: Inter (Light, Regular, Medium, Semibold, Bold)
- **Mobile-First**: Optimized for mobile readability
- **Hierarchy**: H1 (48-64px) → H2 (36-48px) → H3 (24-32px) → Body (16-18px)

### Voice & Tone
- **Authentic**: Real experiences with real people
- **Friendly**: Like a local guide, not formal
- **Local**: Supporting communities, not corporations
- **Genuine**: Building relationships, not transactions

## Usage

1. **For Designers**: Use the color palette, typography, and logo guidelines
2. **For Marketers**: Copy ready-to-use content and check compliance
3. **For Developers**: Access CSS variables and brand assets
4. **For Content Creators**: Use voice & tone examples and photo guidelines

## Deployment

The project is configured for static export and can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect to Git repository
- **GitHub Pages**: Use GitHub Actions
- **Any static host**: Upload the `out` folder

## Maintenance

- **Brand Updates**: Update components when brand guidelines change
- **Asset Updates**: Replace assets in the appropriate component folders
- **Version Control**: Update version numbers in components and README

## Support

For questions or issues with the brand hub:
- Check the compliance checker for brand violations
- Use the voice & tone playground for content guidance
- Download the complete brand kit for offline access

---

**Waykeeper Brand Hub v5.0**  
Simply. Fairly. Connected.  
Internal use only.
