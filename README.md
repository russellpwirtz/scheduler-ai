This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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
