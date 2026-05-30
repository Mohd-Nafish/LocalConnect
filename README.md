# LocalConnect

A React Native mobile app for discovering nearby places — restaurants, cafes, parks, hospitals, and ATMs — powered by your location and the Google Places API.

Built with **Expo SDK 56**, **TypeScript**, and **React Navigation**.

---

## Features

- **Home** — Search places, browse by category, and explore featured, popular, trending, and top-rated sections near you
- **Map** — Interactive map with nearby place markers, category filters, bottom sheet previews, recenter & refresh controls
- **Favorites** — Save and manage your favorite places locally with AsyncStorage
- **Trending** — Curated sections for trending spots, top-rated places, popular cafes, best restaurants, and parks
- **Place Details** — Photos, ratings, reviews, open/closed status, call, website, directions, and share

---

## Screenshots

| Home | Detail | Map |
| :---: | :---: | :---: |
| <img width="240" alt="Home screen" src="https://github.com/user-attachments/assets/526e9935-6f18-4aeb-ba1c-4a6937ecfb0b" /> | <img width="240" alt="Map screen" src="https://github.com/user-attachments/assets/c9355c54-289d-4218-88c9-ee6442ae7627" /> | <img width="240" alt="Trending screen" src="https://github.com/user-attachments/assets/6cf5370b-202d-4c3a-be95-d8026aad3db6" /> |

| Favorites | Tranding |
| :---: | :---: |
| <img width="240" alt="Favorites screen" src="https://github.com/user-attachments/assets/de6361cd-723d-41f8-80bf-3b776d46f7de" /> | <img width="240" alt="Place Details screen" src="https://github.com/user-attachments/assets/fdd7695c-0a5b-4144-abc3-4df17fcf9b89" /> |

---

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | Expo ~56, React Native 0.85 |
| Language | TypeScript (strict) |
| Navigation | React Navigation (Native Stack + Bottom Tabs) |
| Maps | react-native-maps |
| Location | expo-location |
| Places Data | Google Places API (New) |
| Storage | AsyncStorage (favorites) |
| Images | expo-image |

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Expo Go](https://expo.dev/go) on a physical device, or Xcode / Android Studio for simulators
- A [Google Cloud API key](https://console.cloud.google.com/) with **Places API (New)** enabled

### Installation

```bash
git clone https://github.com/your-username/LocalConnect.git
cd LocalConnect
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Add your Google Maps / Places API key:

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_places_api_key_here
```

### Run the App

```bash
npx expo start
```

Then press `i` for iOS Simulator, `a` for Android Emulator, or scan the QR code with Expo Go.

---

## Project Structure

```
src/
├── components/       # Reusable UI (cards, search, map overlays, skeletons)
├── constants/      # Place categories, map styling
├── context/        # Location and favorites providers
├── data/           # Section sorting logic (home, trending)
├── hooks/          # Location, places, search, details hooks
├── navigation/     # Stack and bottom tab navigators
├── screens/        # Home, Map, Favorites, Trending, PlaceDetails
├── services/       # Google Places API, location, caching, favorites
├── theme/          # Colors, spacing, typography
├── types/          # TypeScript types
└── utils/          # Distance, directions, map helpers
```

---

## API Notes

LocalConnect uses the [Google Places API (New)](https://developers.google.com/maps/documentation/places/web-service/op-overview):

- `places:searchNearby` — fetch nearby places by category
- `places:searchText` — text search
- `places/{placeId}` — place details (reviews, phone, website)

Ensure your API key has the Places API enabled and appropriate restrictions configured for production use.

---

## License

This project is private. All rights reserved.
