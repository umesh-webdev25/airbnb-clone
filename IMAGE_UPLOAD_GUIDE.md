# Image Upload Feature - Implementation Guide

## Overview
This feature allows users to upload different images for each listing in your Airbnb clone application.

## Changes Made

### 1. Database Model (`models/listing.js`)
- Added `image` field to the Listing schema
- Default image URL is provided if no image is uploaded
- Image field is optional (not required)

### 2. Upload Middleware (`middleware/upload.js`)
- Created multer configuration for handling file uploads
- Files are stored in `public/uploads/` directory
- Filename format: `listing-[timestamp]-[random]-[original-extension]`
- File validation: Only image files (image/*) are accepted
- Maximum file size: 5MB

### 3. Controller (`controller/listing.js`)
- Updated `createListing` function to handle image uploads
- Image path is stored relative to public folder (e.g., `/uploads/listing-123456.jpg`)
- If no image is uploaded, the default image from the model is used

### 4. Router (`routes/listingRouter.js`)
- Added multer middleware to the POST `/listings` route
- Middleware: `upload.single('image')` - handles single file upload with field name 'image'

### 5. View (`views/host/listing-form.ejs`)
- Added `enctype="multipart/form-data"` to the form tag (required for file uploads)
- Created a drag-and-drop file upload interface
- Added JavaScript function to display selected filename
- File input accepts only image files
- Visual feedback when a file is selected

### 6. Display Views
- Updated `listing-list.ejs` to use the `image` field
- Updated `listing-detail.ejs` (already was using `image` field)
- Fallback to default image if no custom image is available

## How to Use

### For Users:
1. Navigate to "Add Listing" page
2. Fill in the property details (name, country, city, price)
3. Click on the upload area or drag & drop an image file
4. The selected filename will be displayed below the upload area
5. Click "Create Listing" to submit

### Supported Image Formats:
- PNG
- JPG/JPEG
- GIF
- WebP
- Any other image format supported by browsers

### File Size Limit:
- Maximum 5MB per image

## File Storage
- Uploaded images are stored in: `public/uploads/`
- Images are publicly accessible via: `http://localhost:3002/uploads/[filename]`
- Each image gets a unique filename to prevent conflicts

## Error Handling
- If a non-image file is uploaded, multer will reject it
- If file size exceeds 5MB, the upload will be rejected
- If no image is uploaded, the listing will use the default image
- All uploads are optional - listings can be created without images

## Security Features
1. **File Type Validation**: Only image files are accepted
2. **File Size Limit**: Maximum 5MB to prevent abuse
3. **Unique Filenames**: Prevents file overwrites and conflicts
4. **Public Directory**: Files are stored in a dedicated uploads folder

## Future Enhancements
Consider implementing:
- Multiple images per listing
- Image compression/optimization
- Image cropping/editing
- Cloud storage (AWS S3, Cloudinary, etc.)
- Image deletion when listing is removed
- Thumbnail generation

## Testing
1. Start your server: `npm start`
2. Log in to your account
3. Navigate to `/listings/new`
4. Try uploading different image types
5. Create listings with and without images
6. Verify images are displayed correctly in listing list and detail pages

## Troubleshooting

### Images not uploading:
- Check if `public/uploads/` directory exists and has write permissions
- Verify multer is properly installed (`npm install multer`)
- Check browser console for JavaScript errors

### Images not displaying:
- Verify the image path in the database starts with `/uploads/`
- Check if the file exists in `public/uploads/`
- Ensure the public folder is properly configured in Express

### File size errors:
- Reduce the image size before uploading
- Or increase the limit in `middleware/upload.js` (limits.fileSize)
