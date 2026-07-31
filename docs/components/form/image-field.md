---
title: ImageField
description: Image upload field with preview, crop, and dimension validation
---

# ImageField

```javascript
import { ImageField } from 'native-document/components';

ImageField(name, props?)
```

`ImageField` extends `FileField` and is pre-configured for single image uploads. It adds image-specific validation (dimensions, aspect ratio) on top of the full `FileField` API.

## Default Renderer

```javascript
import { FileFieldRender, FileNativeModeRender } from 'native-document/ui';

ImageField.use(FileFieldRender);
```

## Methods

All `FileField` methods apply (`accept`, `maxSize`, `mode`, `onAddFile`…). See **[FileField](./file-field.md)** for the full reference. Image-specific additions:

| Method | Parameters | Description |
|---|---|---|
| `.maxWidth(px)` | `px: number` | Maximum image width in px |
| `.maxHeight(px)` | `px: number` | Maximum image height in px |
| `.crop(enabled?)` | `enabled?: boolean` | Enable image cropping before upload |
| `.dimensions(w, h, message?)` | `w: number`, `h: number`, `message?: string` | Validate exact dimensions |
| `.maxDimensions(w, h, message?)` | `w: number`, `h: number`, `message?: string` | Validate maximum dimensions |
| `.minDimensions(w, h, message?)` | `w: number`, `h: number`, `message?: string` | Validate minimum dimensions |
| `.aspectRatio(ratio, message?)` | `ratio: string`, `message?: string` | Validate aspect ratio (e.g. `'16:9'`, `'1:1'`) |

## ImageField vs FileField

Use `ImageField` when you need image-specific validation (dimensions, aspect ratio, crop). Use `FileField` when you need multiple file types or multi-file upload.

| | ImageField | FileField |
|---|---|---|
| Single image | Yes (default) | Yes (with `.accept`) |
| Multiple files | No | Yes (`.multiple()`) |
| Dimension validation | Yes | No |
| Aspect ratio validation | Yes | No |
| Crop | Yes | No |
| All upload modes | Yes (via inheritance) | Yes |

## Example

```javascript
ImageField('cover')
    .label('Cover Image')
    .model(imageUrl)
    .accept(['image/jpeg', 'image/png'])
    .maxSize(5 * 1024 * 1024, 'Max 5MB')
    .maxDimensions(2000, 2000, 'Image too large')
    .aspectRatio('16:9', 'Must be 16:9')
    .crop()
```

## Avatar example

```javascript
import { FileImagePreviewMode } from 'native-document/components';
import { FileImagePreviewModeRender } from 'native-document/ui';

FileImagePreviewMode.use(FileImagePreviewModeRender);

ImageField('avatar')
    .label('Profile picture')
    .model(avatarUrl)
    .accept(['image/jpeg', 'image/png', 'image/webp'])
    .maxSize(2 * 1024 * 1024, 'Max 2MB')
    .aspectRatio('1:1', 'Must be square')
    .crop()
    .mode(
        FileImagePreviewMode()
            .hoverOverlay()
            .circle()
    )
```

---

## Next Steps

- **[FileField](./file-field.md)** - Full file upload reference
