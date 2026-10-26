# Documentation

This folder contains additional documentation for the To-Do List Application.

## Quick Reference

### Database Schema
See `../database/schema.sql` for the complete DDL script.

### API Endpoints

**Authentication:**
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user

**To-Do Operations:**
- `GET /api/todos` - Get user's to-dos
- `POST /api/todos` - Add new to-do
- `PUT /api/todos/:id` - Edit to-do title
- `PATCH /api/todos/:id/toggle` - Toggle completion
- `DELETE /api/todos/:id` - Delete to-do

### Environment Variables

Required in `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=registration
SESSION_SECRET=random_secret
PORT=3000
```

### Security Features

- Passwords hashed with bcrypt (cost factor 10)
- SQL injection prevention via prepared statements
- Session-based authentication
- User isolation (AND user_id in UPDATE/DELETE)

For full documentation, see the main `README.md` in the project root.
