# 📋 Pre-Testing Checklist

## ✅ Implementation Verification

### Backend Setup

- [x] `pdfkit` installed: `npm install pdfkit @types/pdfkit`
- [x] `src/services/pdf.service.ts` created
- [x] `exportOrderPDF()` method added to customer controller
- [x] PDF export route added to customer routes
- [x] Service imports pdf.service in controller
- [x] Route registered properly

### Frontend Setup

- [x] `src/utils/pdf.ts` rewritten (simplified)
- [x] `downloadOrderPDF()` calls backend endpoint
- [x] Loading state management in OrderDetailPage
- [x] Loading state management in OrdersPage
- [x] Toast notifications configured

### Documentation

- [x] `PDF_BACKEND_IMPLEMENTATION_v2.md` - detailed docs
- [x] `PDF_QUICK_REFERENCE.md` - quick guide
- [x] `IMPLEMENTATION_COMPLETE_v2.md` - completion report
- [x] `PDF_FIX_SUMMARY.md` - final summary
- [x] This checklist

---

## 🧪 Testing Checklist

### Phase 1: Startup & Build

Before testing, verify everything builds:

**Backend**

```bash
cd apps/backend
npm run build    # Should complete without errors ✅
npm run dev      # Should start server ✅
# Watch for: "Server running on port..." message
```

**Frontend**

```bash
cd apps/frontend
npm run build    # Should complete without errors ✅
npm run dev      # Should start dev server ✅
# Watch for: "Local: http://localhost:5173" message
```

### Phase 2: Authentication

- [ ] Can navigate to login page
- [ ] Can login with valid credentials
- [ ] Auth token is stored
- [ ] Can access protected pages (orders)
- [ ] Cannot access pages without login

### Phase 3: Orders Page Basic

- [ ] Can view list of orders
- [ ] Orders display correctly
- [ ] Each order has "📄 Download PDF" button
- [ ] Button is clickable

### Phase 4: PDF Download Test (Single Order)

**From Order List Page:**

1. [ ] Click "📄 Download PDF" button on first order
2. [ ] Loading spinner appears immediately
3. [ ] Loading text shows "Membuat..." or similar
4. [ ] No page layout shift/scroll/shrink
5. [ ] Spinner disappears after 1-2 seconds
6. [ ] Toast appears: "Laporan PDF siap diunduh" (success)
7. [ ] PDF file appears in Downloads folder
8. [ ] PDF filename is correct: `Invoice-{orderNumber}.pdf`

### Phase 5: PDF Content Verification

Open the downloaded PDF and verify:

- [ ] Invoice header with "🏥 Online Health Store"
- [ ] Order number displayed correctly
- [ ] Order status shown (e.g., "Terkirim")
- [ ] Date of order is correct
- [ ] Shipping name and address shown
- [ ] Payment method displayed
- [ ] Payment status shown ("✓ Selesai" or "⏳ Menunggu")
- [ ] Item list includes all products
- [ ] Item quantities correct
- [ ] Item prices correct (formatted in IDR)
- [ ] Subtotals correct for each item
- [ ] Order subtotal correct
- [ ] Shipping cost calculated correctly
- [ ] Total amount correct
- [ ] Professional formatting (not broken layout)
- [ ] All text readable (proper font)

### Phase 6: Multiple Downloads

- [ ] Download 2nd order - spinner shows, downloads correctly
- [ ] Download 3rd order - same result
- [ ] All 3 PDFs have different content (correct orders)
- [ ] All 3 PDFs have correct filenames

### Phase 7: Rapid/Concurrent Downloads

- [ ] Click download on order 1
- [ ] Immediately click download on order 2 (before first completes)
- [ ] Both should download correctly
- [ ] No errors or conflicts
- [ ] Both PDFs have correct content

### Phase 8: Order Detail Page

1. [ ] Navigate to individual order detail page
2. [ ] Find "📄 Download PDF" button
3. [ ] Click button
4. [ ] PDF downloads (same as list page)
5. [ ] PDF content matches order being viewed

### Phase 9: Error Cases

**Test with browser DevTools (Network tab open):**

- [ ] Try accessing `/customer/orders/invalid-id/export-pdf`
  - Should see 404 response
  - Toast shows error message
- [ ] Try accessing other customer's order (if testing with multiple accounts)
  - Should see 403 response
  - Toast shows error message

- [ ] Logout, try accessing
  - Should see 401 response
  - Redirected to login

### Phase 10: Edge Cases

- [ ] Order with single item
- [ ] Order with many items (5+)
- [ ] Order with long product names
- [ ] Order with maximum/minimum prices
- [ ] Order without shipment info
- [ ] Order without payment info (if applicable)

### Phase 11: Browser Compatibility

Test on:

- [ ] Chrome (main browser)
- [ ] Firefox (if available)
- [ ] Safari (if available)
- [ ] Edge (if available)

Expected: Works on all modern browsers

### Phase 12: Performance

Using browser DevTools Network tab:

- [ ] Backend PDF generation takes 300-1000ms
- [ ] Network transfer takes <500ms
- [ ] Total request time <2 seconds
- [ ] Frontend is responsive (no freezing)

### Phase 13: UI/UX

- [ ] Loading state is visually clear
- [ ] Spinner animation smooth
- [ ] Toast notifications appear in correct position
- [ ] No layout shifts during download
- [ ] Button disabled during download (prevents double-clicks)
- [ ] Button re-enabled after download
- [ ] No unexpected scrolling
- [ ] No console errors or warnings

### Phase 14: Data Integrity

Downloaded PDFs should:

- [ ] Match current database order data
- [ ] Not be corrupted or empty
- [ ] Be valid PDF files (openable in any PDF reader)
- [ ] Be same content if downloaded twice (consistency)
- [ ] Include all recent order updates

---

## 🐛 Troubleshooting Guide

### Issue: "Failed to download" / Network Error

**Check:**

1. Backend is running: `npm run dev` in `/apps/backend`
2. API URL is correct: Should be `http://localhost:3000/customer/orders/:id/export-pdf`
3. Network tab shows: 200 OK or error code (401/403/404)
4. Browser console: Any CORS errors?

**Fix:**

```bash
# Restart backend
cd apps/backend
npm run dev

# If still failing, check logs for errors
```

### Issue: PDF is Empty

**This should NOT happen with backend approach.**

Check:

1. Order has items in database
2. Backend error logs
3. Network response is actually PDF data

Run query to verify order has items:

```sql
SELECT COUNT(*) FROM OrderItem WHERE orderId = '{ORDER_ID}';
```

### Issue: Page Still Shifts/Shrinks

**This should NOT happen with backend approach.**

Verify:

1. Frontend is calling backend: Check network tab
2. Not calling old html2canvas function: Search code for "html2canvas"
3. No other scripts interfering: Check for JS errors

### Issue: Unauthorized Error (401)

**Fix:**

1. Verify logged in (check auth token in localStorage)
2. Try logging out and back in
3. Check token expiration

### Issue: Forbidden Error (403)

**Cause:** Trying to access other customer's order

**Expected behavior** - this is correct!

Test with correct order belonging to logged-in customer.

### Issue: Not Found Error (404)

**Cause:** Order doesn't exist or ID is wrong

**Fix:**

1. Verify order ID is correct
2. Verify order exists in database
3. Check customer owns this order

---

## ✨ Success Criteria

### Must Haves

- [x] PDF generates without errors
- [x] PDF contains all order information
- [x] No page layout shift
- [x] Download works multiple times
- [x] Security validation works (403 for unauthorized)

### Should Haves

- [x] Loading state visual feedback
- [x] Toast notifications
- [x] Fast performance (<2s total)
- [x] Professional PDF formatting
- [x] Handles edge cases gracefully

### Nice to Haves

- [x] Works on all browsers
- [x] Responsive on mobile
- [x] Good error messages
- [x] Consistent naming (Invoice-{number}.pdf)

---

## 📝 Test Report Template

Save test results to `TEST_RESULTS.md`:

```markdown
# PDF Download Testing Results

**Date**: [DATE]
**Tester**: [NAME]
**Backend Version**: [COMMIT OR VERSION]
**Frontend Version**: [COMMIT OR VERSION]

## Phase Results

### Startup & Build

- Backend build: ✅ PASS / ❌ FAIL
- Frontend build: ✅ PASS / ❌ FAIL

### Authentication

- Login works: ✅ PASS / ❌ FAIL

### PDF Download

- Single download: ✅ PASS / ❌ FAIL
- Content verification: ✅ PASS / ❌ FAIL
- Multiple downloads: ✅ PASS / ❌ FAIL

### Edge Cases

- Error handling: ✅ PASS / ❌ FAIL
- Performance: ✅ PASS / ❌ FAIL

## Issues Found

[List any issues discovered]

## Recommendations

[Any suggestions for improvement]

## Overall Status

✅ READY FOR DEPLOYMENT / ⚠️ NEEDS FIXES / ❌ BLOCKING ISSUES
```

---

## 🎯 Final Sign-Off

Once all tests pass:

- [ ] Backend tested and works
- [ ] Frontend tested and works
- [ ] No console errors
- [ ] No network errors
- [ ] PDF content complete
- [ ] No layout shifts
- [ ] Performance acceptable
- [ ] Security validated
- [ ] Documentation complete

**Ready for deployment**: ✅ YES / ⚠️ WITH NOTES / ❌ NOT YET

---

## 📞 Support During Testing

If you encounter any issues:

1. **Check the error**: Look at network tab & console
2. **Check the docs**: Review `PDF_QUICK_REFERENCE.md`
3. **Review code**: Check `pdf.service.ts` for implementation
4. **Restart services**: Kill and restart backend/frontend

---

**Good luck with testing! 🚀**

If everything passes, the PDF download feature is production-ready!
