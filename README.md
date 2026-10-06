
## Requirements:
  - Node.js (LTS 20 or newer)
  - Git
  - Docker Desktop
  - Any IDE (VS Code recommended)

## First setup:
  - In terminal type:
      git clone https://github.com/GeneralKartoniarz/quiz-app.git
      cd quiz-app
      npm install
  - Make .env file in apps/server/ (or u can copy .env.example, rename it and change JWT password)
  - Launch Docker Desktop
  - In terminal type:
      npm run db:up
      npx prisma migrate dev --schema=apps/server/prisma/schema.prisma
## Every other setup/launching:
  - Make sure Docker app is launched
  - In terminal type:
      npm run dev
  - This should launch server and website, for mobile view type:
      npm run mobile:start 
## Ports:
  - Website - http://localhost:5173 // npm run dev
  - Backend - http://localhost:3000 // npm run dev
  - Mobile - http://localhost:8081 // npm run mobile:start
  - Prisma Database - http://localhost:5555 // npm run db:studio
