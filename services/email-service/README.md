# Email Service

A microservice for sending emails via multiple channels: REST API, RabbitMQ, and gRPC.

## Features
- **REST API**: Send emails via POST requests.
- **RabbitMQ**: Consume email tasks from a message queue.
- **gRPC**: High-performance email sending service.
- **Persistence**: All sent/failed emails are logged to a PostgreSQL database using Prisma.
- **Development**: Uses Mailhog for local email testing.

## Prerequisites
- Bun
- Docker (for PostgreSQL, RabbitMQ, and Mailhog)

## Setup
1. Install dependencies:
   ```bash
   bun install
   ```
2. Configure `.env`:
   ```bash
   # Copy values from .env.example or use defaults
   ```
3. Generate Prisma client:
   ```bash
   bun run db:generate
   ```
4. Run migrations:
   ```bash
   bun run db:migrate
   ```

## Running the service
```bash
bun dev
```

## API Endpoints
- `POST /send-email`: Send an email.
- `GET /history`: View email history.
- `GET /health`: Service health check.

## gRPC Service
- Service: `email.EmailService`
- Method: `SendEmail`
- Port: `50051` (default)

## RabbitMQ Queue
- Queue Name: `email_queue`
- Format: `{"to": "...", "subject": "...", "body": "..."}`
