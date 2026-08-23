# AvatarUserCard

Displays a user's identity with a circular avatar (image or initials), name, role, online/offline status, and optional social links.

## Usage

```tsx
import { AvatarUserCard } from "@antrosys/ui";

<AvatarUserCard
  name="Peter Parker"
  role="AI/ML Enthusiast"
  status="online"
  size="md"
  image="https://example.com/avatar.jpg"
  socials={[
    { platform: "GitHub", url: "https://github.com/amna" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/amna" },
  ]}
/>
```

## Props

| Prop      | Type                        | Default | Description                                      |
|-----------|-----------------------------|---------|--------------------------------------------------|
| `name`    | `string`                    | —       | Display name (required)                          |
| `role`    | `string`                    | —       | Role / subtitle (required)                       |
| `status`  | `online` `offline`          | —       | Presence indicator on the avatar (required)      |
| `size`    | `sm` `md` `lg`              | `md`    | Avatar, text, and status scale                   |
| `image`   | `string`                    | —       | Avatar image URL; falls back to initials         |
| `socials` | `SocialLink[]`              | —       | Optional social profile links                    |

### SocialLink

| Prop       | Type         | Description                                      |
|------------|--------------|--------------------------------------------------|
| `platform` | `string`     | Platform name (used in `aria-label`)             |
| `url`      | `string`     | Profile URL                                      |
| `icon`     | `ReactNode`  | Optional custom icon; first letter if omitted    |
