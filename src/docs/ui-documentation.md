
# UI Documentation

This document provides a comprehensive overview of the UI components, layouts, and pages in the application. It serves as a reference for designers and developers to understand the current state of the UI.

## Table of Contents

1. [Navigation Components](#navigation-components)
   - [Desktop Navigation](#desktop-navigation)
   - [Mobile Navigation](#mobile-navigation)
   - [Bottom Navigation](#bottom-navigation)
2. [Page Layouts](#page-layouts)
   - [Index Page](#index-page)
   - [Messages Page](#messages-page)
   - [Music Page](#music-page)
   - [Search Page](#search-page)
   - [Profile Page](#profile-page)
   - [Settings Page](#settings-page)
   - [Notifications Page](#notifications-page)
3. [Authentication UI](#authentication-ui)
   - [Login Page](#login-page)
   - [Signup Page](#signup-page)
   - [OTP Verification](#otp-verification)
   - [Forgot Password](#forgot-password)
4. [Components](#components)
   - [Music Player](#music-player)
   - [Post Card](#post-card)
   - [Create Post Form](#create-post-form)
   - [Stories](#stories)

## Navigation Components

### Desktop Navigation

The desktop navigation is a horizontal menu shown on larger screens. It provides quick access to all main sections of the application.

**Location:** `src/components/navigation/DesktopNav.tsx`

**Features:**
- Horizontal layout with buttons for each navigation item
- Icons and labels for each destination
- Active state highlighting with different colors:
  - Regular pages: Primary color highlight
  - Music pages: Accent color highlight
- Uses responsive design to adapt to screen width

**Navigation Items:**
- Home
- Messages
- Notifications
- Music
- Search (Explore)
- Profile
- Settings

### Mobile Navigation

The mobile navigation is a full-screen sidebar that appears when triggered via a menu button.

**Location:** `src/components/navigation/MobileNav.tsx`

**Features:**
- Full-screen sidebar layout
- Brand logo at the top
- List of navigation items with icons and labels
- Logout button at the bottom
- Separator between navigation items and logout button

**Navigation Items:**
Same as Desktop Navigation, with the addition of a logout button.

### Bottom Navigation

The bottom navigation is a fixed bar at the bottom of the screen on mobile devices, providing quick access to the most important sections.

**Location:** `src/components/navigation/BottomNav.tsx`

**Features:**
- Fixed to the bottom of the viewport
- Shows 5 main navigation items
- Uses icons and small labels
- Highlights the active section
- Background with blur effect for better readability over content

**Navigation Items:**
- Home
- Messages
- Notifications
- Music
- Profile

## Page Layouts

### Index Page

The main feed/home page of the application.

**Location:** `src/pages/Index.tsx`

**Layout:**
- Responsive grid layout:
  - 1 column on mobile
  - 3 columns on desktop (main content takes 2 columns)
- Main content area with:
  - Create Post form at the top
  - Feed of posts in chronological order
- Right sidebar (desktop only) with:
  - Recommended users section
  - Trending hashtags
  - Footer information

**Components:**
- CreatePostForm
- PostCard (multiple)
- RecommendedUsers
- Trending hashtags card

### Messages Page

The messaging interface for user-to-user communication.

**Location:** `src/pages/Messages.tsx`

**Layout:**
- To be implemented in detail
- Placeholder for conversation interface

### Music Page

Music discovery and playback interface.

**Location:** `src/pages/Music.tsx`

**Layout:**
- Header with title and subtitle
- Search input field at the top
- Tab navigation with four sections:
  - Discover (default)
  - Playlists
  - Recently Played
  - Favorites
- Content area changes based on selected tab
- Global music player at the bottom (fixed)

**Components:**
- MusicSearch
- Tabs: TabsList, TabsTrigger, TabsContent
- PopularTracks
- PlaylistGrid
- RecentlyPlayed
- FavoritesEmpty
- YouTubePlayerSection

### Search Page

Interface for searching content across the application.

**Location:** Not fully implemented yet.

**Expected Layout:**
- Search input field with filters
- Search results display area
- Potentially tabs for different content types

### Profile Page

User profile display and management.

**Location:** Not fully implemented yet.

**Expected Layout:**
- Profile header with user information and avatar
- Tab navigation for different sections (posts, about, etc.)
- Content area based on selected tab

### Settings Page

Application and user settings interface.

**Location:** Not fully implemented yet.

**Expected Layout:**
- Sidebar with setting categories
- Main content area with settings fields
- Save/cancel buttons for changes

### Notifications Page

Display of user notifications.

**Location:** Not fully implemented yet.

**Expected Layout:**
- List of notifications in chronological order
- Filters for notification types
- Read/unread status indicators

## Authentication UI

### Login Page

User login interface.

**Location:** `src/components/auth/LoginForm.tsx`

**Layout:**
- Centered card layout
- Title and subtitle
- Email input field
- Password input field with show/hide toggle
- Login button
- Links to forgot password and signup

**Components:**
- Form with email and password fields
- Button with loading state
- Links to other authentication routes

### Signup Page

New user registration interface.

**Location:** `src/components/auth/SignupForm.tsx` and related sub-components

**Layout:**
- Centered card layout
- Tabs for email and phone signup methods
- Respective input fields based on selected method
- Password and confirm password fields
- Signup button
- Link to login page

**Sub-components:**
- EmailSignupForm
- PhoneSignupForm
- AuthSeparator

### OTP Verification

One-time password verification for authentication.

**Location:** `src/components/auth/OTPForm.tsx` and related sub-components

**Layout:**
- Centered card layout
- OTP input fields
- Verify button
- Resend code option
- Timer for resend cooldown

**Sub-components:**
- EmailOtpForm
- PhoneOtpForm
- OtpVerificationForm
- OtpLinks

### Forgot Password

Password recovery interface.

**Location:** `src/components/auth/ForgotPasswordForm.tsx`

**Layout:**
- Centered card layout
- Email input field
- Submit button
- Link back to login page

## Components

### Music Player

Global music player for audio playback.

**Location:** `src/components/music/MusicPlayer.tsx` and related sub-components

**Features:**
- Fixed at the bottom of the screen (when active)
- Shows current song information
- Playback controls (play/pause, skip, previous)
- Progress bar with draggable position
- Volume control
- Queue management
- YouTube integration for music playback

**Sub-components:**
- PlayerDisplay
- PlayerControls
- ProgressBar
- VolumeControl
- NowPlayingInfo
- YouTubeCore

### Post Card

Card component for displaying social posts.

**Location:** `src/components/social/PostCard.tsx`

**Features:**
- User information and avatar
- Post content (text)
- Optional media attachments (images)
- Like and comment counters
- Timestamp
- Interaction buttons

### Create Post Form

Form for creating new social posts.

**Location:** `src/components/social/CreatePostForm.tsx`

**Features:**
- Text input area
- Media attachment options
- Emoji picker
- Visibility options
- Post button

### Stories

UI for displaying and interacting with ephemeral story content.

**Location:** `src/components/stories/*`

**Features:**
- Stories bar at the top of the feed
- Individual story cards
- Story creation interface
- Story viewing experience with:
  - Story navigation
  - Progress indicators
  - Reaction options
  - Story header and footer

---

This documentation reflects the current state of the UI as of April 2025. It should be updated as the application evolves and new features are added.
