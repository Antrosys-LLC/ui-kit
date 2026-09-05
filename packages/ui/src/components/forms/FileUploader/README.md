## FileUploader

A versatile, drag-and-drop file uploader component with instant client-side thumbnail previews, file type & size validation, upload progress indicators, clipboard paste support, and customizable layout variants.

---

### Features

- 📂 **Drag & Drop Dropzone**: Fluid animations, hover highlight rings, and keyboard accessibility.
- 🖼️ **Rich File Previews**: Auto-generated image thumbnails with lightbox zoom, plus contextual format icons for PDFs, Spreadsheets, Documents, Code, Archives, Audio, and Video.
- 📊 **Live Progress & Lifecycle Tracking**: Real-time progress bars, completion checkmarks, and error alerts with one-click retry.
- ⚡ **Auto-Upload & Batch Actions**: Support for instant upload upon drop or batch manual triggers ("Upload All", "Clear All").
- 📋 **Clipboard Paste**: Paste screenshots or copied files directly from your clipboard (`Ctrl+V` / `Cmd+V`).
- 🎨 **Layout Variants**: `default` dropzone, `compact` dropzone, `avatar` profile image uploader, and `button` trigger mode with `list` or `grid` preview layouts.
- 🛡️ **Extensible Validation**: Strict file type matching (`accept`), min/max file size checks, maximum file count (`maxFiles`), and custom validator functions.

---

### Usage

#### Basic Multi-File Uploader
```tsx
import React, { useState } from "react";
import { FileUploader, type UploadFile } from "@antrosys/ui";

export function Example() {
  const [files, setFiles] = useState<UploadFile[]>([]);

  return (
    <FileUploader
      title="Upload Documents & Attachments"
      description="Drag and drop files to attach to your project."
      value={files}
      onChange={setFiles}
      maxSize={10 * 1024 * 1024} // 10MB
      accept="image/*,.pdf,.docx"
    />
  );
}
```

#### Simulated Async Upload with Progress
```tsx
import React from "react";
import { FileUploader, type UploadFile } from "@antrosys/ui";

export function AsyncUploadExample() {
  const handleUpload = async (file: UploadFile, updateProgress: (pct: number) => void) => {
    // Simulate chunked upload progress
    for (let progress = 10; progress <= 100; progress += 20) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      updateProgress(progress);
    }
    return { url: `/uploads/${file.name}` };
  };

  return (
    <FileUploader
      title="Cloud Asset Uploader"
      autoUpload
      onUpload={handleUpload}
      previewLayout="grid"
      maxFiles={6}
    />
  );
}
```

#### Avatar / Profile Image Uploader
```tsx
import React, { useState } from "react";
import { FileUploader, type UploadFile } from "@antrosys/ui";

export function ProfileAvatarExample() {
  const [avatar, setAvatar] = useState<UploadFile[]>([]);

  return (
    <FileUploader
      variant="avatar"
      accept="image/*"
      maxSize={2 * 1024 * 1024}
      value={avatar}
      onChange={setAvatar}
      browseButtonText="Change Photo"
    />
  );
}
```

---

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `UploadFile[]` | `undefined` | Controlled array of uploaded/queued files |
| `defaultValue` | `UploadFile[]` | `[]` | Initial files in uncontrolled mode |
| `onChange` | `(files: UploadFile[]) => void` | `undefined` | Fired when queue changes |
| `onUpload` | `(file, updateProgress) => Promise<any>` | `undefined` | Async upload handler per file |
| `onRemove` | `(fileId: string) => void` | `undefined` | Fired when a file is removed from queue |
| `onSuccess` | `(file: UploadFile, res: any) => void` | `undefined` | Fired on successful upload completion |
| `onError` | `(error: Error, file?: UploadFile) => void` | `undefined` | Fired on validation or upload failure |
| `accept` | `string \| string[]` | `undefined` | Allowed file extensions or MIME patterns (e.g. `image/*`, `.pdf`) |
| `maxSize` | `number` | `undefined` | Maximum allowed file size in bytes |
| `minSize` | `number` | `undefined` | Minimum allowed file size in bytes |
| `maxFiles` | `number` | `undefined` | Maximum number of files permitted in queue |
| `multiple` | `boolean` | `true` | Allow selecting multiple files |
| `autoUpload` | `boolean` | `false` | Automatically trigger `onUpload` upon file ingestion |
| `variant` | `"default" \| "compact" \| "avatar" \| "button"` | `"default"` | Visual style of dropzone |
| `previewLayout` | `"list" \| "grid"` | `"list"` | Arrangement of file preview cards |
| `showPreviewList` | `boolean` | `true` | Display file queue items below dropzone |
| `enablePaste` | `boolean` | `true` | Enable clipboard file pasting |
| `disabled` | `boolean` | `false` | Disable all uploader interactions |
| `title` | `ReactNode` | `undefined` | Header title text |
| `description` | `ReactNode` | `undefined` | Subtitle text |
| `dropzoneText` | `ReactNode` | `undefined` | Main call-to-action text in dropzone |
| `dropzoneHint` | `ReactNode` | `undefined` | Format and size limitations hint |
| `browseButtonText`| `string` | `"Browse Files"` | Label on browse button |
| `validate` | `(file: File) => string \| boolean \| undefined` | `undefined` | Custom file validation callback |
| `customDropzone` | `(props: DropzoneRenderProps) => ReactNode` | `undefined` | Custom dropzone render function |
| `customFileItem` | `(props: FilePreviewItemProps) => ReactNode` | `undefined` | Custom file preview card render function |
| `className` | `string` | `undefined` | Custom container class names |
| `theme` | `"light" \| "dark"` | `undefined` | Theme override |

---

### `UploadFile` Interface

| Property | Type | Description |
|---|---|---|
| `id` | `string` | Unique queue item identifier |
| `file` | `File` | Native browser File object |
| `name` | `string` | File name with extension |
| `size` | `number` | File size in bytes |
| `type` | `string` | MIME type string |
| `progress` | `number` | Upload progress (0 to 100) |
| `status` | `"idle" \| "uploading" \| "success" \| "error"` | Current state |
| `error` | `string` (optional) | Error message if failed |
| `previewUrl` | `string` (optional) | Object URL for image thumbnail preview |
| `response` | `any` (optional) | Server response payload |
