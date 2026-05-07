# Happenings.co - Event Management System

> A comprehensive event management solution for booking, invoicing, inventory management, and client communication.

[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/happenings-co/event-dispatch)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [System Architecture](#system-architecture)
- [WhatsApp Integration](#whatsapp-integration)
- [Data Management](#data-management)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## 🎯 Overview

**Happenings.co Event Management System** is a single-page application designed to streamline event planning operations. Built with vanilla JavaScript and modern web technologies, it provides a complete solution for managing bookings, generating professional invoices and quotations, tracking inventory, and communicating with clients via WhatsApp.

### Key Highlights

- **Zero Dependencies**: Runs entirely in the browser - no server required
- **Offline-First**: Uses localStorage for data persistence
- **Mobile-Optimized**: Responsive design for desktop and mobile devices
- **Print-Ready**: Professional PDF generation for invoices and quotations
- **WhatsApp Integration**: Direct client communication with pre-formatted messages

---

## ✨ Features

### 📅 Booking Management
- Create, edit, and track event bookings
- Filter bookings by status (Upcoming, Confirmed, Completed, Incomplete)
- Comprehensive booking details including client info, event type, venue, and dates
- Reference number generation for easy tracking
- Payment tracking (total, advance, balance)

### 📄 Invoice & Quotation Generation
- **Invoice Builder**: Create detailed invoices with line items
- **Quotation Builder**: Generate professional quotations with manual total override
- **Print/PDF Export**: High-quality PDF generation using html2pdf.js
- **Preview Mode**: Live preview before printing
- **WhatsApp Sharing**: Send invoices and quotations directly via WhatsApp

### 📦 Inventory Management
- Track inventory items with images and quantities
- Category-based organization
- Real-time availability checking
- Reserved items tracking per booking
- Low stock alerts

### 🚚 Dispatch Management
- Dispatch sheet generation for event execution
- Item reservation and allocation
- Visual dispatch hub with upcoming bookings
- Print-ready dispatch sheets with company branding

### 💬 WhatsApp Integration
- **Booking Confirmation**: Send detailed booking summaries to clients
- **Invoice Sharing**: Share professional invoices with payment details
- **Quotation Sharing**: Send quotations with itemized pricing
- **Dispatch Notifications**: Notify team members about upcoming dispatches
- Pre-formatted messages with all relevant details

### 📊 Finance Tracking
- Client cost vs internal cost comparison
- Payment status monitoring
- Balance due tracking
- Financial overview dashboard

### 📸 Media Gallery
- Upload and manage event photos
- Category-based organization
- Tag-based filtering
- Inspiration board for client presentations

---

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required

### Local Usage

1. **Download the project**:
   ```bash
   git clone https://github.com/happenings-co/event-dispatch.git
   cd event-dispatch
   ```

2. **Open in browser**:
   ```bash
   # Simply open index.html in your browser
   open index.html
   # or
   firefox index.html
   # or double-click index.html
   ```

3. **Login**:
   - Default password: `happenings2024`
   - Password can be changed in the code (search for `PASS` variable)

### Deploy to Vercel (Recommended for Production)

#### Option 1: Deploy via GitHub (Automatic)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Done!** Your app will be live at `https://your-project.vercel.app`

#### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd event-dispatch
   vercel
   ```

3. **Follow prompts** and your app will be deployed

### Deployment Notes

- ✅ **No environment variables needed** - app runs entirely in browser
- ✅ **No build step required** - static HTML file
- ✅ **No API endpoints** - all functionality is client-side
- ✅ **Instant deployment** - typically under 30 seconds
- ✅ **Free hosting** on Vercel's free tier
- ✅ **Automatic HTTPS** - Vercel provides SSL certificate
- ✅ **Global CDN** - Fast loading worldwide

### First-Time Setup

1. **Configure Company Details**:
   - Update `BN` (Business Name) variable in the code
   - Add company logo URL to `BL` variable
   - Update contact information (phone, address)

2. **Initialize Data**:
   - The app uses localStorage for data persistence
   - Data is automatically saved as you work
   - No database setup required

---

## 📖 Usage Guide

### Creating a Booking

1. Navigate to **Bookings** section
2. Click **+ New Booking**
3. Fill in client details:
   - Name, phone, email
   - Event type, date, venue
   - Number of guests
   - Ready and pickup times
4. Add payment information (total, advance)
5. Click **Save Booking**

### Generating an Invoice

1. Open a booking from the **Bookings** list
2. Click **Generate Invoice**
3. Add invoice line items:
   - Description
   - Amount
4. Click **Preview Invoice**
5. Options:
   - **Print**: Generate PDF
   - **WhatsApp**: Send to client
   - **Edit**: Modify items

### Creating a Quotation

1. Navigate to **Quotes** section
2. Fill in client and event details
3. Add quotation items:
   - Category
   - Description (supports multi-line)
   - Amount
4. Optional: Override total with manual amount
5. Click **Preview Quotation**
6. Options:
   - **Print**: Generate PDF
   - **WhatsApp**: Send to client

### Managing Inventory

1. Navigate to **Inventory** section
2. Click **+ Add Item**
3. Fill in item details:
   - Name, category
   - Quantity available
   - Upload image (optional)
4. Items are automatically tracked across bookings

### Dispatching Items

1. Navigate to **Dispatch** section
2. Select a booking from the dispatch hub
3. Choose items to dispatch:
   - Browse by category
   - Select quantity for each item
4. Add inspiration photos (optional)
5. Click **Generate Dispatch Sheet**
6. Options:
   - **Print**: Generate dispatch sheet
   - **WhatsApp**: Notify team

---

## 🏗️ System Architecture

### Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables
- **PDF Generation**: html2pdf.js
- **Data Storage**: Browser localStorage
- **Icons**: Unicode emojis
- **Fonts**: Google Fonts (Cormorant Garamond, Jost)

### Data Structure

```javascript
// Bookings
{
  id: "unique-id",
  name: "Client Name",
  phone: "03001234567",
  email: "client@email.com",
  type: "Wedding",
  date: "2024-12-25",
  venue: "Grand Hall",
  guests: 200,
  ready: "6:00 PM",
  pickup: "11:00 PM",
  total: 500000,
  paid: 200000,
  status: "confirmed",
  dispatchItems: [...],
  invoice_items: [...]
}

// Inventory
{
  id: "item-id",
  name: "Item Name",
  cat: "Category",
  qty: 50,
  img: "image-url"
}
```

### File Structure

```
event-dispatch/
├── index.html          # Main application file
├── README.md           # Documentation
└── .git/              # Git repository
```

---

## 💬 WhatsApp Integration

### How It Works

The system generates pre-formatted WhatsApp messages with all relevant details and opens WhatsApp Web with the message ready to send. Users can then select the recipient and send.

### Message Formats

#### Booking Confirmation
```
Assalam o Alaikum,

*BOOKING CONFIRMATION* ✅
=================

*CLIENT DETAILS:*
*Name:* John Doe
*Reference:* HPN-20240101-1234
*Phone:* 03001234567

*EVENT DETAILS:*
*Event Type:* Wedding
*Date:* 25 Dec 2024
*Venue:* Grand Hall
*Guests:* 200

*PAYMENT DETAILS:*
*Total Amount:* PKR 500000
*Advance Paid:* PKR 200000
*Balance Due:* PKR 300000

Thank you for choosing us!
JazakAllah

*Happenings.co*
📞 03302894915
```

#### Invoice
```
Assalam o Alaikum,

*INVOICE* 📄
=================

*CLIENT DETAILS:*
*Name:* John Doe
*Event:* Wedding
*Date:* 25 Dec 2024

*INVOICE ITEMS:*
1. Stage Decoration
   *Amount:* PKR 150000
2. Catering Service
   *Amount:* PKR 200000

*PAYMENT SUMMARY:*
*Total Amount:* PKR 500000
*Advance Paid:* PKR 200000
*Balance Due:* PKR 300000

Thank you for your business!
JazakAllah
```

### Browser Compatibility

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support
- ✅ Mobile browsers: Full support

---

## 💾 Data Management

### Data Storage

All data is stored in browser localStorage:
- **Bookings**: `ev_bookings`
- **Inventory**: `ev_inventory`
- **Media**: `ev_media`
- **Counters**: `ev_bkn_counter`

### Backup & Export

**Manual Backup**:
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Copy data from relevant keys
4. Save to a text file

**Import Data**:
1. Open browser DevTools (F12)
2. Go to Console
3. Paste: `localStorage.setItem('ev_bookings', 'YOUR_DATA_HERE')`

### Data Security

- Data is stored locally in the browser
- No external servers or cloud storage
- Clear browser data will delete all information
- Regular backups recommended

---

## 🔧 Troubleshooting

### Common Issues

#### WhatsApp Not Opening
- **Issue**: WhatsApp button doesn't work
- **Solution**: Ensure you're using a modern browser with WhatsApp Web support

#### PDF Not Generating
- **Issue**: Print/PDF button doesn't work
- **Solution**: 
  - Check browser console for errors
  - Ensure html2pdf.js is loaded
  - Try a different browser

#### Data Lost
- **Issue**: Bookings or inventory disappeared
- **Solution**:
  - Check if browser data was cleared
  - Restore from backup if available
  - Data is stored in localStorage

#### Images Not Loading
- **Issue**: Inventory or media images not displaying
- **Solution**:
  - Check image URLs are valid
  - Ensure images are accessible
  - Try re-uploading images

### Browser Console

For debugging, open browser console (F12) and check for error messages.

---

## 📄 License

**Proprietary License**

© 2024 Happenings.co. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use of this software, via any medium, is strictly prohibited.

For licensing inquiries, contact: info@happenings.co

---

## 📞 Support

For support, feature requests, or bug reports:

- **Email**: support@happenings.co
- **Phone**: +92 330 2894915
- **Website**: https://happenings.co

---

## 🙏 Acknowledgments

- **html2pdf.js**: PDF generation library
- **Google Fonts**: Typography
- **Supabase**: Database inspiration (for future cloud version)

---

**Built by HAMZA JABBAR**
