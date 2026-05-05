# MyStreeT Full Stack Capstone

End-to-end sneaker shopping application using React + Spring Boot + H2/PostgreSQL.

## Features
- Register, login, logout
- Product listing, brand/size filtering, product detail
- Cart with localStorage persistence
- Checkout with mock payment and order creation
- Admin product add/delete
- Seeded admin: `admin@mystreet.com` / `admin123`

## Run Backend
```bash
cd backend
mvn spring-boot:run
```
Swagger: http://localhost:8080/swagger-ui/index.html
H2 Console: http://localhost:8080/h2-console

## Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open: http://localhost:5173

## Notes
This project uses a simple Base64 demo token to keep the foundation project easy to understand. For production, replace it with signed JWT/session security.
