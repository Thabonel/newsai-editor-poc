# build frontend
FROM node:20 AS frontend
WORKDIR /src
COPY NewsAI.Editor.Client ./NewsAI.Editor.Client
RUN cd NewsAI.Editor.Client && npm install && npm run build

# build backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY NewsAI.Editor.Api ./NewsAI.Editor.Api
COPY --from=frontend /src/NewsAI.Editor.Client/dist ./NewsAI.Editor.Api/wwwroot
RUN dotnet publish NewsAI.Editor.Api/NewsAI.Editor.Api.csproj -c Release -o /app

# runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
EXPOSE 80
ENTRYPOINT ["dotnet", "NewsAI.Editor.Api.dll"]
