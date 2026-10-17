import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "../Button";

const meta: Meta<typeof Modal> = {
  title: "Feedback/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large", "full"],
      description: "Size preset for modal dialog width",
    },
    variant: {
      control: "select",
      options: ["default", "confirmation"],
      description: "Semantic visual variant",
    },
    preventClose: {
      control: "boolean",
      description: "Prevent closing via backdrop or Escape key",
    },
    showCloseButton: {
      control: "boolean",
      description: "Show close X button in header",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

/**
 * Default interactive Modal dialog example.
 */
export const Default: Story = {
  render: function DefaultDemo(args) {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          title="Account Settings"
          description="Manage your account preferences and personal information."
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Save Changes
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-sm text-[var(--ant-color-surface-text)]">
            <p>
              Update your account details below. All changes will be saved to your cloud profile.
            </p>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[var(--ant-color-surface-text-sub)]">
                Display Name
              </label>
              <input
                type="text"
                defaultValue="Alex Morgan"
                className="w-full px-3 py-2 text-sm rounded-[var(--ant-radius-md)] border border-[var(--ant-color-surface-border)] bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[var(--ant-color-surface-text-sub)]">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="alex.morgan@antrosys.dev"
                className="w-full px-3 py-2 text-sm rounded-[var(--ant-radius-md)] border border-[var(--ant-color-surface-border)] bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)]"
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

/**
 * Small sizing preset (max-w-sm / 384px). Ideal for quick confirmations and simple forms.
 */
export const Small: Story = {
  render: function SmallDemo() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open Small Modal
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          size="small"
          title="Clear Cache"
          description="Are you sure you want to clear the local application cache?"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
                Clear Cache
              </Button>
            </>
          }
        >
          <p className="text-sm text-[var(--ant-color-surface-text-sub)]">
            This will remove all cached offline files and restart your session.
          </p>
        </Modal>
      </div>
    );
  },
};

/**
 * Medium sizing preset (max-w-lg / 512px). The standard default dialog size.
 */
export const Medium: Story = {
  render: function MediumDemo() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open Medium Modal (Default)
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          size="medium"
          title="Invite Team Members"
          description="Send workspace collaboration invitations by email."
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Send Invites
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            <p className="text-sm text-[var(--ant-color-surface-text)]">
              Enter email addresses separated by commas to add collaborators with Member permissions.
            </p>
            <textarea
              rows={3}
              placeholder="sarah@antrosys.dev, john@antrosys.dev"
              className="w-full p-3 text-sm rounded-[var(--ant-radius-md)] border border-[var(--ant-color-surface-border)] bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)]"
            />
          </div>
        </Modal>
      </div>
    );
  },
};

/**
 * Large sizing preset (max-w-2xl / 672px). Great for data tables and multi-step configurations.
 */
export const Large: Story = {
  render: function LargeDemo() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open Large Modal
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          size="large"
          title="Deploy New Infrastructure Cluster"
          description="Configure node specifications, VPC routing, and cluster regions."
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Deploy Cluster
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-2 gap-4 text-sm text-[var(--ant-color-surface-text)]">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[var(--ant-color-surface-text-sub)]">
                Cluster Region
              </label>
              <select className="w-full p-2 text-sm rounded-[var(--ant-radius-md)] border border-[var(--ant-color-surface-border)] bg-transparent">
                <option>us-east-1 (N. Virginia)</option>
                <option>eu-central-1 (Frankfurt)</option>
                <option>ap-southeast-1 (Singapore)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[var(--ant-color-surface-text-sub)]">
                Node Type
              </label>
              <select className="w-full p-2 text-sm rounded-[var(--ant-radius-md)] border border-[var(--ant-color-surface-border)] bg-transparent">
                <option>c6g.2xlarge (8 vCPU, 16GB)</option>
                <option>r6g.4xlarge (16 vCPU, 128GB)</option>
              </select>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

/**
 * Full sizing preset (viewport-filling modal).
 */
export const Full: Story = {
  render: function FullDemo() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open Full-Viewport Modal
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          size="full"
          title="Full Screen Document Viewer"
          description="Reviewing release-specifications-v2.0.pdf in full viewport presentation mode."
          footer={
            <Button variant="primary" onClick={() => setOpen(false)}>
              Done Reviewing
            </Button>
          }
        >
          <div className="h-full flex items-center justify-center p-8 border-2 border-dashed border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-lg)] text-center text-sm text-[var(--ant-color-surface-text-sub)]">
            Full-screen content container with responsive layout boundaries and automatic scrolling.
          </div>
        </Modal>
      </div>
    );
  },
};

/**
 * Demonstrates modal with structured Action Footer.
 */
export const WithFooter: Story = {
  name: "With Footer",
  render: function WithFooterDemo() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open Modal with Actions
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Export Project Artifacts"
          description="Choose your destination format and export options."
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Back
              </Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Export CSV
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Export JSON
              </Button>
            </>
          }
        >
          <p className="text-sm text-[var(--ant-color-surface-text)]">
            Artifacts will be packaged and downloaded directly to your local workstation.
          </p>
        </Modal>
      </div>
    );
  },
};

/**
 * Long content demonstrating internal vertical scrolling and viewport locking.
 */
export const LongContent: Story = {
  name: "Long Content",
  render: function LongContentDemo() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open Scrollable Long Content
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Terms of Service & Privacy Agreement"
          description="Please read through the comprehensive terms before agreeing."
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Decline
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                I Accept All Terms
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-sm text-[var(--ant-color-surface-text-sub)]">
            <h4 className="font-semibold text-[var(--ant-color-surface-text)]">1. Introduction and Scope</h4>
            <p>
              These Terms of Service govern your access to and use of the Antrosys UI platform and associated cloud infrastructure services.
            </p>
            <h4 className="font-semibold text-[var(--ant-color-surface-text)]">2. User Rights and Data Handling</h4>
            <p>
              You retain full ownership of all data submitted to your repositories. We process telemetry solely to enhance performance and deliver high-availability distributed component libraries.
            </p>
            <h4 className="font-semibold text-[var(--ant-color-surface-text)]">3. Security and Compliance</h4>
            <p>
              All traffic is encrypted in transit and at rest using modern cryptography. Regular security audits are conducted to ensure SOC2 Type II and ISO 27001 standard adherence.
            </p>
            <h4 className="font-semibold text-[var(--ant-color-surface-text)]">4. Service Availability & SLAs</h4>
            <p>
              We strive to maintain a 99.99% uptime SLA across all primary CDN edge endpoints and component distribution channels.
            </p>
            <h4 className="font-semibold text-[var(--ant-color-surface-text)]">5. Termination & Continuity</h4>
            <p>
              You may export your configurations and terminate your subscription at any time without penalty or data retention lock-in.
            </p>
          </div>
        </Modal>
      </div>
    );
  },
};

/**
 * Confirmation dialog variant for destructive or critical actions.
 */
export const Confirmation: Story = {
  render: function ConfirmationDemo() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete Project (Confirmation)
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          variant="confirmation"
          title="Delete project 'frontend-ui-v2'?"
          description="This action cannot be undone. All production deployments, pipeline secrets, and DNS configurations will be permanently removed."
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Permanently Delete Project
              </Button>
            </>
          }
        >
          <div className="p-3 rounded-[var(--ant-radius-md)] bg-[var(--ant-color-semantic-error)]/10 border border-[var(--ant-color-semantic-error)]/20 text-xs text-[var(--ant-color-surface-text)]">
            Please make sure you have backed up all production databases before proceeding.
          </div>
        </Modal>
      </div>
    );
  },
};

/**
 * Modal with preventClose enabled (Escape and backdrop clicks are disabled).
 */
export const PreventClose: Story = {
  name: "Prevent Close",
  render: function PreventCloseDemo() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open Mandatory Modal (preventClose)
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          preventClose={true}
          title="Firmware Upgrade in Progress"
          description="Please do not disconnect your device or navigate away."
          footer={
            <Button variant="primary" onClick={() => setOpen(false)}>
              Finish & Exit
            </Button>
          }
        >
          <div className="space-y-3 text-sm text-[var(--ant-color-surface-text)]">
            <p>
              Pressing <kbd className="px-1.5 py-0.5 rounded bg-[var(--ant-color-neutral-100)] border border-[var(--ant-color-surface-border)] font-mono text-xs">Esc</kbd> or clicking outside the modal will <strong>not</strong> close this dialog.
            </p>
            <div className="w-full bg-[var(--ant-color-neutral-100)] rounded-full h-2">
              <div className="bg-[var(--ant-color-brand-primary)] h-2 rounded-full w-3/4 animate-pulse" />
            </div>
            <p className="text-xs text-[var(--ant-color-surface-text-sub)]">
              Click the 'Finish & Exit' button below to complete the workflow.
            </p>
          </div>
        </Modal>
      </div>
    );
  },
};

/**
 * Demonstrates nested modal dialogs with stacked overlays and focus management.
 */
export const NestedDialog: Story = {
  name: "Nested Dialog",
  render: function NestedDialogDemo() {
    const [parentOpen, setParentOpen] = useState(false);
    const [childOpen, setChildOpen] = useState(false);

    return (
      <div>
        <Button variant="primary" onClick={() => setParentOpen(true)}>
          Open Parent Dialog
        </Button>

        {/* Parent Modal */}
        <Modal
          open={parentOpen}
          onClose={() => setParentOpen(false)}
          size="large"
          title="Parent Workspace Management"
          description="Primary configuration window."
          footer={
            <>
              <Button variant="secondary" onClick={() => setParentOpen(false)}>
                Close Parent
              </Button>
              <Button variant="danger" onClick={() => setChildOpen(true)}>
                Trigger Child Confirmation
              </Button>
            </>
          }
        >
          <p className="text-sm text-[var(--ant-color-surface-text)]">
            This is the primary dialog. Clicking "Trigger Child Confirmation" will open a secondary nested dialog on top.
          </p>
        </Modal>

        {/* Child Modal */}
        <Modal
          open={childOpen}
          onClose={() => setChildOpen(false)}
          size="small"
          variant="confirmation"
          title="Nested Confirmation Dialog"
          description="Are you sure you want to proceed with this sub-action?"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setChildOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setChildOpen(false);
                  setParentOpen(false);
                }}
              >
                Confirm & Close All
              </Button>
            </>
          }
        >
          <p className="text-xs text-[var(--ant-color-surface-text-sub)]">
            Focus is trapped in this child dialog. Closing returns focus to the parent dialog.
          </p>
        </Modal>
      </div>
    );
  },
};

/**
 * Dark theme verification of modal colors, borders, contrast, and backdrop.
 */
export const DarkTheme: Story = {
  name: "Dark Theme",
  render: function DarkThemeDemo() {
    const [open, setOpen] = useState(false);

    return (
      <div
        data-theme="dark"
        className="p-8 rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-neutral-900)] text-[var(--ant-color-neutral-0)] border border-[var(--ant-color-neutral-700)] flex flex-col items-center gap-4"
      >
        <div className="text-sm font-semibold">Dark Theme Environment</div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open Dark Mode Modal
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          theme="dark"
          title="Dark Mode System Settings"
          description="All surfaces, borders, and typography adapt to the Antrosys dark token palette."
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Save Changes
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-sm text-[var(--ant-color-neutral-200)]">
            <p>
              Modal surface uses <code className="text-xs font-mono text-[var(--ant-color-brand-primary-lt)]">var(--ant-color-neutral-900)</code> with crisp <code className="text-xs font-mono text-[var(--ant-color-brand-primary-lt)]">neutral-700</code> borders.
            </p>
          </div>
        </Modal>
      </div>
    );
  },
};

/**
 * Demonstrates keyboard interaction (Tab, Shift+Tab focus trap, and Esc dismiss).
 */
export const KeyboardInteraction: Story = {
  name: "Keyboard Interaction",
  render: function KeyboardDemo() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Test Keyboard Navigation (Tab & Esc)
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Keyboard Accessibility Test"
          description="Use Tab and Shift+Tab to navigate between interactive elements."
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                First Button (Tab 1)
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Second Button (Tab 2)
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-sm text-[var(--ant-color-surface-text)]">
            <p>
              Focus is automatically moved to the first focusable element upon opening. Pressing <kbd className="px-1.5 py-0.5 rounded bg-[var(--ant-color-neutral-100)] border font-mono text-xs">Tab</kbd> cycles focus within the dialog without escaping to the background document.
            </p>
            <input
              type="text"
              placeholder="Interactive text input inside modal..."
              className="w-full px-3 py-2 text-sm rounded-[var(--ant-radius-md)] border border-[var(--ant-color-surface-border)] bg-transparent"
            />
          </div>
        </Modal>
      </div>
    );
  },
};
