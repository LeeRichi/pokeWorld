# PokeWorld - Frontend

## Key Features
- 🌐 Google OAuth Authentication
- 🐾 Pokémon Management
- 🔄 User Profile Management
- 🔍 Search & Filter Features

## Structure
```
.
├── src
│   ├── components
│   │   ├── Card.tsx
│   │   ├── ChangePasswordForm.tsx
│   │   ├── Dropdown.tsx
│   │   ├── EditProfileForm.tsx
│   │   ├── FilterBar.tsx
│   │   ├── Footer.tsx
│   │   ├── FriendsList.tsx
│   │   ├── GoogleSignInBtn.tsx
│   │   ├── Header.tsx
│   │   ├── Heart.tsx
│   │   ├── Login.tsx
│   │   ├── Main.tsx
│   │   ├── PaginationBtn.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SignUp.tsx
│   │   ├── SkeletonCard.tsx
│   │   ├── Topbar.tsx
│   │   └── UserSearch.tsx
│   ├── lib
│   │   └── auth.ts
│   ├── pages
│   │   ├── _app.tsx
│   │   ├── api
│   │   │   └── auth
│   │   │       └── [...nextauth].ts
│   │   ├── global.css
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── pokemon
│   │   │   └── [id].tsx
│   │   ├── signup.tsx
│   │   ├── user
│   │   │   └── [id].tsx
│   │   └── user.tsx
│   ├── pokemonTypes.tsx
│   ├── types
│   │   ├── next-auth.d.ts
│   │   ├── type_Pokemon.ts
│   │   └── type_User.ts
│   └── utils
│       └── database.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Frontend Setup

```bash
cd ../frontend
touch .env
```
copy this to your local .env
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_OFFICIAL_URL=https://pokeapi.co/api/v2/pokemon
FRONTEND_PORT=3000
NEXT_PUBLIC_MY_FRONTEND_API_URL=http://localhost:3000
BACKEND_PORT=3006
NEXT_PUBLIC_MY_BACKEND_API_URL=http://localhost:3006
BACKEND_URL=http://localhost:3006
```
#### Setting Up Google OAuth
To test Google Sign-In(optional), create your own OAuth credentials:

1. Go to [Google Developer Console](https://console.cloud.google.com/).
2. Create a new project and enable **Google OAuth**.
3. Add `http://localhost:3000/api/auth/callback/google` as an **authorized redirect URI**.
4. Copy your **Client ID** and **Client Secret**.
5. modify "GOOGLE_CLIENT_ID" and "GOOGLE_CLIENT_SECRET" in `.env.local`.

```bash
npm install
npm run dev
```
#### Access frotend Application

- Next.js frontend web page can be access in http://localhost:3000/
