# Blog Setup Log

> A blog serves as a record of thoughts, keeping content separate from tools/styles/configurations, with the focus being on **content**.

## Content

1. Summaries of technologies and projects I've worked with.
2. Personal opinions on various matters.
3. Records of life experiences.

## Tools/Styles/Configuration

- Tools: Former Hexo and Jekyll user ultimately chose Hugo, with the minimalist Diary theme.

- Directory Organization: Each directory corresponds to a category, allowing the directory name to serve as the category.

- Article Creation/Modification Time: Uses file creation/modification time instead of manual maintenance.

- Keyword and Summary Generation: Handled by LLM.

- Hosting: Static files generated are hosted on S3. After configuring AWS CLI locally, `hugo deploy` can directly update to the S3 bucket.

- Caching: Uses CloudFront CDN.
