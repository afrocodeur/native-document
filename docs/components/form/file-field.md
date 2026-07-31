---
title: FileField
description: File upload component with multiple modes - native, dropzone, button, wall, and avatar
---

# FileField

```javascript
import {
    FileField,
    FileNativeMode, FileDropzoneMode,
    FileUploadButtonMode, FileWallMode, FileImagePreviewMode
} from 'native-document/components';
```

## Default Renderers

```javascript
import {
    FileFieldRender,
    FileNativeModeRender, FileDropzoneModeRender,
    FileUploadButtonModeRender, FileWallModeRender, FileImagePreviewModeRender
} from 'native-document/ui';

FileField.use(FileFieldRender);
FileNativeMode.use(FileNativeModeRender);
FileDropzoneMode.use(FileDropzoneModeRender);
FileUploadButtonMode.use(FileUploadButtonModeRender);
FileWallMode.use(FileWallModeRender);
FileImagePreviewMode.use(FileImagePreviewModeRender);
```

## Methods

### Mode & Accept

| Method | Parameters | Description |
|---|---|---|
| `.mode(modeInstance)` | `modeInstance: FileMode` | Set the upload mode |
| `.accept(mimeTypes)` | `mimeTypes: string[]` | Accepted MIME types |
| `.mimeTypes(types, message?)` | `types: string[]`, `message?: string` | Validate MIME types |
| `.extensions(exts, message?)` | `exts: string[]`, `message?: string` | Validate file extensions |

### Limits

| Method | Parameters | Description |
|---|---|---|
| `.multiple(enabled?)` | `enabled?: boolean` | Allow multiple files |
| `.maxFiles(n, message?)` | `n: number`, `message?: string` | Maximum number of files |
| `.minFiles(n, message?)` | `n: number`, `message?: string` | Minimum number of files |
| `.maxSize(bytes, message?)` | `bytes: number`, `message?: string` | Maximum file size in bytes |
| `.minSize(bytes, message?)` | `bytes: number`, `message?: string` | Minimum file size in bytes |

### File management

| Method | Parameters | Description |
|---|---|---|
| `.addFile(file)` | `file: File` | Add a single file programmatically |
| `.addFiles(files)` | `files: File[]` | Add multiple files |
| `.setFiles(files)` | `files: File[]` | Replace all files |
| `.removeFile(file)` | `file: File` | Remove a specific file |
| `.getFiles()` | - | Returns the current file list |
| `.reset()` | - | Clear all files |
| `.fileIcon(desc)` | `desc: { type: string, icon: element }` | Icon for a specific MIME type |
| `.fileIcons(descs)` | `descs: { type, icon }[]` | Icons for multiple MIME types |

### Events

| Method                   | Parameters | Description |
|--------------------------|---|---|
| `.onAddFile(handler)`    | `handler: (file, files) => void` | Fires when a file is added |
| `.onRemoveFile(handler)` | `handler: (file, files) => void` | Fires when a file is removed |
| `.onReset(handler)`      | `handler: () => void` | Fires when files are cleared |

## Modes

### `FileNativeMode`

Standard browser file picker. No extra methods.

```javascript
FileField('document')
    .accept(['application/pdf'])
    .mode(FileNativeMode())
```

### `FileDropzoneMode`

Drag-and-drop area.

| Method | Parameters | Description |
|---|---|---|
| `.icon(element)` | `element: NdChild` | Icon displayed in the zone |
| `.text(text)` | `text: string` | Main label |
| `.hint(text)` | `text: string` | Secondary hint text |
| `.height(px)` | `px: number` | Zone height in px |
| `.removeIcon(element)` | `element: NdChild` | Icon for the remove button |
| `.renderZone(fn)` | `fn: ($description) => NdChild` | Custom zone renderer |

```javascript
FileField('files')
    .multiple()
    .mode(
        FileDropzoneMode()
            .text('Drop files here or click to browse')
            .hint('PDF, PNG, JPG up to 10MB')
            .icon(UploadIcon)
            .height(200)
    )
```

### `FileUploadButtonMode`

A button that opens the file picker, with a list of selected files below it.

| Method | Parameters | Description |
|---|---|---|
| `.buttonLabel(text)` | `text: string` | Button label |
| `.buttonIcon(element)` | `element: NdChild` | Button icon |
| `.showProgress(enabled?)` | `enabled?: boolean` | Show upload progress |
| `.renderItem(fn)` | `fn: ($file) => NdChild` | Custom file item renderer |
| `.renderButton(fn)` | `fn: ($description) => NdChild` | Custom button renderer |
| `.renderList(fn)` | `fn: ($files) => NdChild` | Custom file list renderer |

```javascript
FileField('attachment')
    .mode(
        FileUploadButtonMode()
            .buttonLabel('Upload File')
            .buttonIcon(UploadIcon)
            .showProgress()
    )
```

### `FileWallMode`

Grid of file previews with remove buttons.

| Method | Parameters | Description |
|---|---|---|
| `.cellSize(px)` | `px: number` | Cell size in px |
| `.addLabel(text)` | `text: string` | Label on the add button |
| `.addIcon(element)` | `element: NdChild` | Icon on the add button |
| `.renderCell(fn)` | `fn: ($file) => NdChild` | Custom file cell renderer |
| `.renderAdd(fn)` | `fn: () => NdChild` | Custom add button renderer |

```javascript
FileField('gallery')
    .multiple()
    .accept(['image/*'])
    .mode(
        FileWallMode()
            .cellSize(120)
            .addLabel('Add image')
            .addIcon(PlusIcon)
    )
```

### `FileImagePreviewMode`

Single image upload styled as a circular avatar.

| Method | Parameters | Description |
|---|---|---|
| `.hoverOverlay()` | - | Show edit overlay on hover |
| `.cornerBadge()` | - | Show a badge in the corner |
| `.actionButtons()` | - | Show action buttons |
| `.circle()` | - | Circular shape (default) |
| `.square()` | - | Square shape |
| `.size(size)` | `size: string \| number` | Avatar size |
| `.placeholderIcon(element)` | `element: NdChild` | Icon shown when no image |
| `.overlayIcon(element)` | `element: NdChild` | Icon shown on hover overlay |
| `.editImageIcon(element)` | `element: NdChild` | Edit icon |
| `.changeLabel(text)` | `text: string` | Label for the change action |

```javascript
FileField('avatar')
    .accept(['image/*'])
    .mode(
        FileImagePreviewMode()
            .hoverOverlay()
            .circle()
    )
```

## Example

```javascript
FileField('documents')
    .multiple()
    .maxFiles(10)
    .accept(['application/pdf'])
    .maxSize(5 * 1024 * 1024, 'Max 5MB per file')
    .mode(
        FileDropzoneMode()
            .text('Drop PDFs here')
            .icon(PdfIcon)
    )
    .onAddFile(async (file) => {
        const url = await uploadFile(file);
        console.log('Uploaded:', url);
    })
```
