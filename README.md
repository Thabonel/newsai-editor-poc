# NewsAI Editor POC

AI-powered broadcast news editing application proof of concept.

## Tech Stack
- Backend: ASP.NET Core 8.0
- Frontend: React with TypeScript
- Deployment: Render.com
- AI: OpenAI API (for demos)

## Setup Instructions

The repository already contains a React based frontend located in
`NewsAI.Editor.Client` and an ASP.NET Core backend under
`NewsAI.Editor.Api`. You can run everything locally either with Docker or
directly from your host machine.

### Using Docker

```bash
docker-compose up --build
```

This command builds the client, hosts it with the API and exposes the
application on `http://localhost:8080`.

### Manual setup

1. Install dependencies for the API and the React client:

   ```bash
   dotnet restore ./NewsAI.Editor.Api
   cd NewsAI.Editor.Client
   npm install
   ```

2. Start the backend (from the repository root):

   ```bash
   dotnet run --project NewsAI.Editor.Api
   ```

3. In a second terminal start the React development server:

   ```bash
   cd NewsAI.Editor.Client
   npm run dev
   ```

   The client will be available at the address printed by Vite (usually
   `http://localhost:5173`). API requests are proxied to the backend.

### Demo credentials

The demo login uses the following credentials:

```
Username: demo
Password: newsai2024
```

## Demo Script
Coming soon...
