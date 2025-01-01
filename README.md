# Remix Cloudflare Template

- 📖 [Cloudflare Remix docs](https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/)
- 📖 [React Router docs](https://reactrouter.com/home)
- 📖 [Remix docs](https://remix.run/docs)
- 📖 [Remix Cloudflare docs](https://remix.run/guides/vite#cloudflare)

## Getting Started

Use this template as a starting point for your next app with [Remix Stacks](https://remix.run/stacks):

```shell
bunx create-remix@latest --template vhscom/remix-cloudflare-template

# Alternatively, this will also work...
bunx create-react-router@latest --template vhscom/remix-cloudflare-template
```

Run the above command from a terminal with [Bun](https://bun.sh/) installed and follow the guided setup.

## Development

Install dependencies:

```shell
bun install
```

Start [Vite](https://vite.dev/) development server:

```shell
bun dev
```

To test your app on the [workerd](https://github.com/cloudflare/workerd) runtime start wrangler dev
server with:

```sh
bun run build && bun start
```

## Testing

This template uses [Vitest](https://vitest.dev) for testing. Run the test suite:

```shell
# Run tests once
bun test

# Run tests in watch mode
bun test:watch

# Generate coverage report
bun test:coverage
```

## Continuous Integration

This project includes automated CI workflows that run on pull requests and pushes to the `trunk` branch, performing the following checks:

- Code quality and formatting with Biome
- Type checking with TypeScript
- Test suite with coverage reporting
- Build verification

To see the status of CI checks, visit your repository's Actions/CI tab or check the status indicators on pull requests.

Local development tip: Run `bun run check` before pushing to ensure your code meets the same quality standards checked in CI.

## Deployment

Build and deploy application:

```shell
bun run deploy
```

This will build and upload the app, and upload static assets and generated build files to Cloudflare. You must have the correct KV namespace `id` set in `wrangler.toml` for the deployment to succeed.

See [Project Configuration](#project-configuration) for help configuring your KV namespace.

## Project Configuration

Once you've created your app using the template, create a KV for each namespace binding defined in `wrangler.toml` and manually set its `id` in the configuration file for use during deployments to Cloudflare. To create a KV manually, locate KV in the [Cloudflare Dashboard](https://dash.cloudflare.com/) and choose `Create`.

To create a KV using the `wrangler` CLI you can run wrangler like:

```shell
bunx wrangler kv:namespace create LD_KV [--preview]
```

Where `LD_KV` is the name of your KV store. And it will create the store and return the `id`. Pass the optional `--preview` flag if specifying the `preview_id` setting of the KV namespace.

You must be logged in with `wrangler login` to allow this behavior.

## Lighthouse Testing

Run automated Lighthouse tests against your local development server:

```shell
bun run lighthouse
```

Configure test settings in `unlighthouse.config.ts`:

```typescript
const budget = {
  performance: 80,
  accessibility: 95,
  'best-practices': 90,
  seo: 90,
};
const routes = ["/", "/private-landing"];
```

CI enforces minimum scores across Lighthouse categories. JSON reports are generated in `.unlighthouse/ci-result.json`.

See the Unlighthouse docs for [help generating static reports](https://unlighthouse.dev/guide/guides/generating-static-reports).

## License

This project is licensed under the Zero-Clause BSD License (0BSD) - see the [COPYING](COPYING) file for details.
