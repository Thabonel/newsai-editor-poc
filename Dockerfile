# We'll create the actual Dockerfile when we have the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY . .
EXPOSE 80
CMD ["echo", "App not built yet"]
