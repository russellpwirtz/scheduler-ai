This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

This is a proof of concept application to showcase an AI chatbot assistant helping plan and book an appointment.

<img width="1473" alt="Screenshot 2025-01-25 at 1 26 35 AM" src="https://github.com/user-attachments/assets/7dca619f-dd39-4545-87e1-66eca6154768" />


### Prerequisites
- OpenAI api key (or equivalent)
- SMTP credentials (see https://ethereal.email/create for free smtp credentials)

## Getting Started

## Setting your local .env file
```bash
cp .env.example .env.local
```
Update the .env.local file with your OpenAI api key and SMTP credentials.

Install dependencies:
```bash
npm install
```

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

The project includes a comprehensive test suite with the following commands:

```bash
# Run end-to-end tests interactively (Cypress)
npm run test:e2e
```

## Docker 

## Setting the .env file
```bash
cp .env.example .env.production
```
Update the .env.production file with your OpenAI api key and SMTP credentials.


```bash
docker build --no-cache -t ai-scheduler .
docker run -p 3000:3000 ai-scheduler
```
