# Keymint Documentation

Complete documentation for the Keymint license management platform.

This repository contains:

- Guide pages
- Navigation
- Customizations
- API reference pages
- Use of popular components

**[View the live documentation](https://docs.keymint.dev)**

## Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mint) to preview your documentation changes locally. To install, use the following command:

```
npm i -g mint
```

Run the following command at the root of your documentation, where your `docs.json` is located:

```
mint dev
```

View your local preview at `http://localhost:3000`.

## Publishing changes

Changes are deployed to production automatically after pushing to the default branch.

## Need help?

### Troubleshooting

- If your dev environment isn't running: Run `mint update` to ensure you have the most recent version of the CLI.
- If a page loads as a 404: Make sure you are running in a folder with a valid `docs.json`.

### Resources
- [Mintlify Documentation](https://mintlify.com/docs) - For technical documentation platform help
- [Keymint Documentation](https://docs.keymint.dev) - For Keymint-specific content
- [Support](mailto:support@keymint.dev) - For Keymint product support
