# gatsby-remark-link-md

Links pages based on links between markdown files by querying the slug out of GraphQL layer.

If the link is pointing to non-existing markdown file, it sends a warning.

This is useful for cases with markdown documentation being used in multiple spots (like azure wikis) that only links by pointing directly to markdown file.

### Disclaimer

This plugin is doing bare minimum, but is functional. I didn't find any other plugin doing the same thing. You probably want to have this plugin before gatsby-plugin-catch-links.

I won't be improving this plugin much. There's no testing as of now, and not many options. I am open to suggestions and PRs.
