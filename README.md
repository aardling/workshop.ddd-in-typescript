# Domain-Driven-Design in Typescript

This is the repository for the workshop Domain-Driven-Design in Typescript

## Development

run `npm run dev`

### Environment variables

To interact with external services/apis we need tokens and some config.
This token is something we don't want to commit. A simple way of solving this
is by using `.env` files.

Create an `.env` file with the config that looks like:

```
DDD_AUTH_TOKEN=your-token
WORKSHOP_ID="DDDInYourLanguage2024Q1"
WORKSHOP_SERVER_URL="https://ddd-in-language.aardling.eu/"
```

use a tool like https://direnv.net/ to make the variables available or use a package like: https://www.npmjs.com/package/dotenv

## Testing

run `npm run test:watch`

## Internals

Everything that's named internal is to be considered private.
If you ever have to touch something in an internal folder, you should consider this a bug and should report it.
