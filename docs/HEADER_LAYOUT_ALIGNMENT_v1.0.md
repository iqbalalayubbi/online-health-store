# 🎨 Header Layout Alignment - Shopee Style (v1.0)

**Date**: November 4, 2025  
**Status**: ✅ COMPLETE  
**Feature**: Header sejajar dengan body container

---

## 🔄 Perubahan

### Masalah

Header content mentok ke kiri dan kanan edge (full width).  
Main content memiliki `max-width: 64rem` dengan margin auto.  
Layout tidak sejajar seperti Shopee.

### Solusi

Header sekarang menggunakan struktur container yang sama dengan main content.

---

## 📐 Struktur Layout

### Sebelum

```tsx
// Header: Full width dengan padding
<header className="px-6 py-4">
  <h1>Online Health Store</h1>
  <nav>...</nav>
</header>

// Main: Max-width container centered
<main className="mx-auto w-full max-w-5xl px-4">
  <Outlet />
</main>

// Footer: Full width dengan padding
<footer className="px-6 py-4">
  © 2025
</footer>
```

**Result**: Header dan footer mentok di edge, main content berada di center ❌

### Sesudah

```tsx
// Header: Container centered di dalam
<header className="border-b border-slate-200 bg-white">
  <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between gap-6 py-4">
      <h1>Online Health Store</h1>
      <nav>...</nav>
    </div>
  </div>
</header>

// Main: Max-width container centered
<main className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
  <Outlet />
</main>

// Footer: Container centered di dalam
<footer className="border-t border-slate-200 bg-white">
  <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
    © 2025
  </div>
</footer>
```

**Result**: Header, main, dan footer sejajar dengan responsive padding ✅

---

## 🎯 Key Changes

### Header

```diff
- <header className="sticky top-0 z-20 flex items-center justify-between gap-6 border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
-   <h1>...</h1>
-   <nav>...</nav>
- </header>

+ <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
+   <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
+     <div className="flex items-center justify-between gap-6 py-4">
+       <h1>...</h1>
+       <nav>...</nav>
+     </div>
+   </div>
+ </header>
```

### Footer

```diff
- <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-sm text-slate-500">
-   © 2025
- </footer>

+ <footer className="border-t border-slate-200 bg-white">
+   <div className="mx-auto w-full max-w-5xl px-4 py-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
+     © 2025
+   </div>
+ </footer>
```

---

## 📏 Layout Comparison

### Visual Layout

**Sebelum**:

```
[Header Content Full Width px-6]
════════════════════════════════════════════════════════

        [Main Content Max-width-5xl Centered]

════════════════════════════════════════════════════════
[Footer Content Full Width px-6]

❌ Header dan footer mentok, tidak sejajar dengan main
```

**Sesudah**:

```
════════════════════════════════════════════════════════
  [Header Content Centered Max-width-5xl px-4]
════════════════════════════════════════════════════════
  [Main Content Max-width-5xl px-4]
════════════════════════════════════════════════════════
  [Footer Content Centered Max-width-5xl px-4]
════════════════════════════════════════════════════════

✅ Header, main, dan footer sejajar sempurna (Shopee style)
```

---

## 🎨 Responsive Padding

Setiap section menggunakan Tailwind responsive classes:

```
px-4      (mobile:   16px)
sm:px-6   (tablet:   24px)
lg:px-8   (desktop:  32px)
```

Ini memastikan layout tetap rapi di semua ukuran layar.

---

## ✅ Hasil

### Desktop View

```
┌────────────────────────────────────────────────────┐
│ [Online Health Store] [Beranda] [Katalog] [Login]  │  ← Sejajar dengan content
└────────────────────────────────────────────────────┘
  [Main Content - Max-width 5xl]
┌────────────────────────────────────────────────────┐
│        © 2025 Online Health Store                  │  ← Sejajar dengan content
└────────────────────────────────────────────────────┘
```

### Mobile View

```
┌─────────────────────────┐
│ [Health Store] [Menu]   │  ← Responsive padding
└─────────────────────────┘
  [Main Content]
┌─────────────────────────┐
│   © 2025 Online Store   │  ← Sejajar dengan content
└─────────────────────────┘
```

---

## 🎯 Alignment Check

| Element      | Sebelum       | Sesudah            |
| ------------ | ------------- | ------------------ |
| Header kiri  | px-6 (mentok) | Centered container |
| Header kanan | px-6 (mentok) | Centered container |
| Main kiri    | Centered      | Centered ✅        |
| Main kanan   | Centered      | Centered ✅        |
| Footer kiri  | px-6 (mentok) | Centered container |
| Footer kanan | px-6 (mentok) | Centered container |

---

## 🎯 Shopee-style Layout

```
Header:
├─ Full width dengan background color
├─ Content di dalam centered container (max-w-5xl)
└─ Shadow di bawah

Main:
├─ Centered container (max-w-5xl)
└─ Content sejajar dengan header

Footer:
├─ Full width dengan background color
├─ Content di dalam centered container (max-w-5xl)
└─ Shadow di atas

✅ SEAMLESS ALIGNMENT
```

---

## 🚀 Testing

Cek layout:

1. **Desktop (≥1024px)**
   - Header content aligned with main ✅
   - Footer content aligned with main ✅
   - Border full width ✅
   - Padding: lg:px-8 ✅

2. **Tablet (640px - 1023px)**
   - Padding: sm:px-6 ✅
   - Alignment tetap rapi ✅

3. **Mobile (< 640px)**
   - Padding: px-4 ✅
   - Layout tetap responsive ✅
   - Tidak mentok ke edge ✅

---

## 📋 File Modified

- `apps/frontend/src/layouts/MainLayout.tsx`

**Changes**:

- ✅ Header: Added centered container wrapper
- ✅ Footer: Added centered container wrapper
- ✅ Responsive padding: px-4 sm:px-6 lg:px-8
- ✅ Alignment: All sections perfectly aligned

---

**Status**: ✅ Complete & Responsive  
**Style**: ✅ Shopee-like (Centered Layout)  
**Browser Compatibility**: ✅ All modern browsers
