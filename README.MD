# Skinet E-Commerce App

Full-stack e-commerce application with an Angular client and an ASP.NET Core API.

## Project layout

- `API/` — ASP.NET Core API
- `Core/` — domain entities, interfaces, and specifications
- `Infrastructure/` — persistence and infrastructure services
- `client/` — Angular application

## Run the client

The Angular development server is configured to use HTTPS. Create a local self-signed certificate and key from the repository root:

```sh
mkdir -p client/ssl
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout client/ssl/localhost-key.pem \
  -out client/ssl/localhost.pem \
  -days 365 \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

Then install dependencies and start the client:

```sh
cd client
npm install
npm start
```

The certificate and private key are local development files and are intentionally excluded from Git. Browsers may show a warning for the self-signed certificate.
