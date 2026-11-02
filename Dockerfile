FROM node:20-alpine
WORKDIR /app
COPY . .
CMD ["node", "mcp-server.js"]
