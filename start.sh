#!/bin/sh
echo "Running database migrations..."
node node_modules/prisma/build/index.js db push --skip-generate --accept-data-loss 2>&1 || echo "Migration warning (may be ok if tables exist)"
echo "Starting server..."
node server.js
