# Remix Cloudflare Template

- 📖 [Cloudflare Remix docs](https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/)
- 📖 [Remix docs](https://remix.run/docs)
- 📖 [Remix Cloudflare docs](https://remix.run/guides/vite#cloudflare)

## Getting Started

Use this template as a starting point for your next app with [Remix Stacks](https://remix.run/stacks):

```shell
bunx create-remix@latest --template vhscom/remix-cloudflare-template
```

Run the above command from a terminal with [Bun](https://bun.sh/) installed and follow the guided setup.

## Next Steps

Once you've created your Remix app using the template, create a KV for each namespace binding defined in `wrangler.toml` and manually set its `id` in the configuration file for use during deployments to Cloudflare Pages. To create a KV manually, locate KV in the [Cloudflare Dashboard](https://dash.cloudflare.com/) and choose `Create`. To create a KV using the `wrangler` CLI you can run wrangler like:

```shell
bunx wrangler kv:namespace create LD_KV [--preview]
```

Where `LD_KV` is the name of your KV store. And it will create the store and return the `id`. Pass the optional `--preview` flag if specifying the `preview_id` setting of the KV namespace.

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

## Deployment

Build and deploy application:

```shell
bun run deploy
```

This will build and upload the app, and upload static assets and generated build files to Cloudflare Pages. You must have the correct KV namespace `id` set in `wrangler.toml` for the deployment to succeed. See [Next Steps](#next-steps) for details.

### Previews

If you want Cloudflare to build preview deployments automatically when you push a commit to your code repository, upload your Remix app to GitHub and connect Cloudflare Pages via the Cloudflare Dashboard. Cloudflare will create preview URLs for commits, branches and PRs, and will return a URL to view the running application when running the deployment script.

# License

This project is licensed under the Zero-Clause BSD License (0BSD) - see the [COPYING](COPYING) file for details.
