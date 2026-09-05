import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileUploader } from "./FileUploader";
import type { UploadFile } from "./types";

const meta: Meta<typeof FileUploader> = {
  title: "Forms/FileUploader",
  component: FileUploader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Antrosys Drag-and-drop File Uploader featuring rich thumbnail previews, MIME/size validation, upload progress indicators, clipboard paste support, avatar mode, and multi-file batch operations.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileUploader>;

export const Default: Story = {
  render: () => {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <FileUploader
          title="Project Attachments"
          description="Upload documents, PDFs, diagrams, or images for this project."
          maxSize={10 * 1024 * 1024} // 10MB
          maxFiles={5}
        />
      </div>
    );
  },
};

export const ImageGalleryGrid: Story = {
  render: () => {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <FileUploader
          title="Media Library Upload"
          description="Upload high-res photos. Click thumbnails to enlarge."
          accept="image/*"
          previewLayout="grid"
          maxFiles={6}
          maxSize={8 * 1024 * 1024}
        />
      </div>
    );
  },
};

export const DocumentAndInvoiceUploader: Story = {
  render: () => {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="mb-4 rounded-lg bg-[var(--ant-color-brand-primary-lt)] p-3 text-xs text-[var(--ant-color-brand-primary-dk)]">
          🔒 <strong>Strict Policy:</strong> Accepts only PDF, Word (.docx), and Excel (.xlsx) documents under 5 MB.
        </div>
        <FileUploader
          title="Tax & Financial Invoices"
          description="Submit quarterly accounting spreadsheets and receipts."
          accept=".pdf,.docx,.xlsx"
          maxSize={5 * 1024 * 1024}
          dropzoneHint="Accepted: PDF, DOCX, XLSX up to 5MB"
        />
      </div>
    );
  },
};

export const SimulatedLiveUpload: Story = {
  render: () => {
    const handleUpload = async (file: UploadFile, updateProgress: (pct: number) => void) => {
      // Simulate network upload with progress steps
      for (let p = 15; p <= 100; p += 20) {
        await new Promise((r) => setTimeout(r, 250));
        updateProgress(p);
      }

      // Simulate a random failure for demonstration if file name contains "fail"
      if (file.name.toLowerCase().includes("fail")) {
        throw new Error("Server rejected upload (simulated error)");
      }

      return { fileId: `uploaded-${Date.now()}`, remoteUrl: `https://storage.antrosys.io/${file.name}` };
    };

    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="mb-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
          ⚡ <strong>Live Progress Simulation:</strong> Uploads initiate automatically on drop with animated progress bars. Include &ldquo;fail&rdquo; in a file name to test retry error state!
        </div>
        <FileUploader
          title="Cloud Storage Sync"
          description="Files upload automatically to Antrosys Object Storage."
          autoUpload
          onUpload={handleUpload}
          maxFiles={4}
        />
      </div>
    );
  },
};

export const AvatarProfileMode: Story = {
  render: () => {
    const [avatarFiles, setAvatarFiles] = useState<UploadFile[]>([]);

    return (
      <div className="p-4 max-w-sm mx-auto flex flex-col items-center justify-center text-center">
        <h4 className="text-sm font-bold text-[var(--ant-color-surface-text)] mb-1">
          Profile Photo
        </h4>
        <p className="text-xs text-[var(--ant-color-surface-text-sub)] mb-4">
          Click or drop an image to update your team avatar
        </p>
        <FileUploader
          variant="avatar"
          accept="image/*"
          maxSize={2 * 1024 * 1024}
          value={avatarFiles}
          onChange={setAvatarFiles}
          browseButtonText="Change Photo"
        />
      </div>
    );
  },
};

export const CompactSidebarVariant: Story = {
  render: () => {
    return (
      <div className="p-4 max-w-sm mx-auto rounded-2xl border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] p-4 shadow-sm">
        <FileUploader
          variant="compact"
          title="Quick Attachment"
          description="Drop files to attach to this thread."
          maxFiles={3}
        />
      </div>
    );
  },
};

export const ButtonTriggerVariant: Story = {
  render: () => {
    return (
      <div className="p-4 max-w-md mx-auto">
        <FileUploader
          variant="button"
          browseButtonText="Upload CSV Dataset"
          accept=".csv"
          maxFiles={2}
        />
      </div>
    );
  },
};
