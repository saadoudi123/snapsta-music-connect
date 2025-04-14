
# Design System Guide

This document outlines the design system used throughout the application, including colors, typography, spacing, and component variations. It serves as a reference to maintain visual consistency across the app.

## Table of Contents

1. [Colors](#colors)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Shadows](#shadows)
5. [Border Radius](#border-radius)
6. [Component Variations](#component-variations)
   - [Buttons](#buttons)
   - [Inputs](#inputs)
   - [Cards](#cards)
   - [Navigation](#navigation)
7. [Icons](#icons)
8. [Responsive Breakpoints](#responsive-breakpoints)
9. [Animations](#animations)

## Colors

The application uses a Tailwind CSS-based theming system with CSS variables for flexibility between light and dark modes.

### Base Colors

These are defined in the Tailwind config and used throughout the application:

```
colors: {
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))'
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))'
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))'
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))'
  },
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))'
  },
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))'
  },
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))'
  },
}
```

### Semantic Colors

- **Primary**: Used for primary actions, important UI elements, and brand identity
- **Secondary**: Used for secondary actions and supporting UI elements
- **Accent**: Used for music-related UI elements, creating visual distinction for that section
- **Destructive**: Used for destructive actions, errors, and warnings
- **Muted**: Used for subtle backgrounds and less important text

### Special Color Sections

The app includes special color configurations for the sidebar and branded elements:

```
sidebar: {
  DEFAULT: 'hsl(var(--sidebar-background))',
  foreground: 'hsl(var(--sidebar-foreground))',
  primary: 'hsl(var(--sidebar-primary))',
  'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  accent: 'hsl(var(--sidebar-accent))',
  'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  border: 'hsl(var(--sidebar-border))',
  ring: 'hsl(var(--sidebar-ring))'
},
snapsta: {
  primary: '#5C7AEA',
  secondary: '#A6B1E1',
  accent: '#FF6B6B',
  dark: '#1E2746',
  light: '#FFFFFF',
  comfort: '#F7EDE2',
}
```

## Typography

The application uses a consistent typography system based on Tailwind's default font scaling.

### Font Family

- System font stack (native to the user's device)

### Font Sizes

- **text-xs**: 0.75rem - Used for very small text, badges, timestamps
- **text-sm**: 0.875rem - Used for secondary text, captions, form labels
- **text-base**: 1rem - Default text size for body text
- **text-lg**: 1.125rem - Used for emphasis, subheadings
- **text-xl**: 1.25rem - Used for card titles, section headers
- **text-2xl**: 1.5rem - Used for page titles, major headings
- **text-3xl**: 1.875rem - Used for main page headers, hero text

### Font Weights

- **font-normal**: Normal text
- **font-medium**: Medium emphasis
- **font-semibold**: Semi-bold for headings and emphasis
- **font-bold**: Bold for strong emphasis and headers

## Spacing

The application uses Tailwind's spacing scale for consistency.

- **spacing-0**: 0px
- **spacing-1**: 0.25rem (4px)
- **spacing-2**: 0.5rem (8px)
- **spacing-3**: 0.75rem (12px)
- **spacing-4**: 1rem (16px)
- **spacing-6**: 1.5rem (24px)
- **spacing-8**: 2rem (32px)
- **spacing-10**: 2.5rem (40px)
- **spacing-12**: 3rem (48px)
- **spacing-16**: 4rem (64px)

Common patterns:
- Card padding: p-4 (1rem)
- Section gap: gap-6 (1.5rem)
- Form field spacing: space-y-4 (1rem)
- Button padding: px-4 py-2 (horizontal: 1rem, vertical: 0.5rem)

## Shadows

The application uses a consistent set of shadows for elevation and focus states.

- **shadow**: Regular shadow for elements
- **shadow-md**: Medium shadow for more elevated elements
- **shadow-lg**: Large shadow for prominent elements
- **ring-offset-2**: Used for focus states

## Border Radius

The application uses a consistent set of border radii defined in the Tailwind config:

```
borderRadius: {
  lg: 'var(--radius)',
  md: 'calc(var(--radius) - 2px)',
  sm: 'calc(var(--radius) - 4px)'
}
```

Common uses:
- **rounded-md**: Most UI elements (buttons, inputs, cards)
- **rounded-lg**: Larger elements, modal dialogs
- **rounded-full**: Avatar images, circular buttons
- **rounded-sm**: Smaller elements, tags, badges

## Component Variations

### Buttons

**Variants:**
- **default**: Primary action button
- **secondary**: Secondary action button
- **outline**: Less prominent button with border
- **ghost**: Minimal button, often used in navigation
- **link**: Text-only button appearing as a link
- **destructive**: For delete or cancel actions

**Sizes:**
- **default**: Standard sizing
- **sm**: Small button
- **lg**: Large button
- **icon**: Square button for icon-only usage

### Inputs

**Types:**
- **text**: Standard text input
- **password**: Password input with show/hide toggle
- **email**: Email input
- **tel**: Telephone input (uses PhoneInput component)
- **textarea**: Multi-line text input
- **select**: Dropdown selection
- **checkbox**: Boolean selection
- **radio**: Single option selection from a group
- **otp**: One-time password input

**States:**
- Default
- Focus
- Disabled
- Error

### Cards

**Variants:**
- **default**: Standard card with border and background
- **shadow**: Card with elevation
- **flat**: Card without border, just background color

**Usage contexts:**
- Content containers
- Form containers
- UI section grouping

### Navigation

**Variants:**
- **Desktop navigation**: Horizontal button bar
- **Mobile navigation**: Full-screen sidebar
- **Bottom navigation**: Fixed bar at bottom of screen on mobile
- **Tab navigation**: Content category switching

## Icons

The application uses Lucide React icons for consistency. Common icons include:

- **Home**: Navigation to home page
- **MessageCircle**: Messages section
- **Bell**: Notifications
- **Music**: Music section
- **Search**: Search functionality
- **User**: Profile section
- **Settings**: Settings page
- **LogOut**: Logout functionality
- **Eye/EyeOff**: Toggle password visibility
- **Lock**: Password fields
- **Play/Pause**: Media playback
- **Volume**: Sound controls

## Responsive Breakpoints

The application uses Tailwind's default breakpoints:

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

Key responsive behaviors:
- Single column on mobile, multi-column on desktop
- Bottom navigation on mobile, horizontal navigation on desktop
- Hidden sidebar on mobile, visible on desktop
- Adjusted spacing and typography at different breakpoints

## Animations

The application uses a custom set of animations defined in the Tailwind config:

```
animations: {
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
  'fade-in': 'fade-in 0.3s ease-out',
  'fade-out': 'fade-out 0.3s ease-out',
  'slide-in': 'slide-in 0.3s ease-out',
  'slide-out': 'slide-out 0.3s ease-out',
  'pulse': 'pulse 1.5s infinite'
}
```

Common usage:
- **animate-fade-in**: New elements appearing
- **animate-pulse**: Loading states
- **animate-slide-in**: Navigation elements appearing
- **transition-colors**: Color changes on hover/focus
- **transition-transform**: Size or position changes

---

This design system guide should be referenced when developing new features or modifying existing ones to maintain visual consistency throughout the application.
