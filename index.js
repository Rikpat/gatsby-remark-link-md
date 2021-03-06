const visit = require(`unist-util-visit`);
const path = require(`path`);

module.exports = (
  { files, markdownNode, markdownAST, getNode },
  pluginOptions
) => {
  const options = { include: [`md`, `mdx`], ...pluginOptions };
  const parent = getNode(markdownNode.parent);
  const visitor = (link) => {
    if (!new RegExp('^(?:[a-z]+:)?//', 'i').test(link.url)) {
      let url = link.url.replace(/\\/g, '/')
      let linkPath = url.startsWith("/")
        ? path.posix.join(process.cwd(), url)
        : path.posix.join(parent.dir, url);
      const linkNode = files.find(
        (file) => file && file.absolutePath && file.absolutePath === linkPath
      );
      if (linkNode) {
        const mdNode = getNode(
          linkNode.children.find((child) =>
            [`Remark`, `Mdx`].includes(getNode(child).internal.type)
          )
        );
        if (mdNode && mdNode.fields && mdNode.fields.slug)
          link.url = mdNode.fields.slug;
      } else {
        console.warn(
          `${
            markdownNode.fields && markdownNode.fields.sourceInstanceName
          }: File ${parent.relativePath}: ${
            link.url
          } is pointing to nonexistent markdown file resolved to ${path.posix.relative(
            process.cwd(),
            linkPath
          )}`
        );
      }
    }
  };

  visit(markdownAST, `link`, (link) => {
    const ext = link.url && link.url.split(`.`).pop();
    if (options.include.includes(ext)) {
      visitor(link);
    }
  });

  visit(markdownAST, `definition`, (link) => {
    const ext = link.url && link.url.split(`.`).pop();
    if (options.include.includes(ext)) {
      visitor(link);
    }
  });
};
