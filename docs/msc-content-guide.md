# Updating the MSc learning journal

MSc is coursework in progress. Projects remains a separate section for mature portfolio work. All published notes should be in English. Updating notes does not require PostgreSQL, FastAPI, or the homeserver.

## Add a week from GitHub

1. Open `content/msc/_templates/week.md` and copy its contents.
2. Open the relevant course folder below and choose **Add file → Create new file**.
3. Name the file `week-01.md` (then `week-02.md`, etc.) and paste the template.
4. Set `week`, replace the title, and write your real notes. Remove unused optional fields or leave them empty.
5. Keep `published: false` while drafting. Set `published: true` when ready to share. Partial notes can be published with `status: in-progress`; use `complete` only when appropriate.
6. Click **Commit changes**. When the commit reaches the branch connected to Vercel, wait for its deployment to finish. A GitHub web edit needs no additional push.
7. If you also work locally, synchronize with `git pull --ff-only origin main` after committing or setting aside local work.

Course folders and URLs:

| Course folder under `content/msc/2026-ii/` | Public URL                                   |
| ------------------------------------------ | -------------------------------------------- |
| `deep-learning-neural-networks`            | `/msc/2026-ii/deep-learning-neural-networks` |
| `natural-language-processing`              | `/msc/2026-ii/natural-language-processing`   |
| `computer-vision`                          | `/msc/2026-ii/computer-vision`               |
| `research-seminar`                         | `/msc/2026-ii/research-seminar`              |

The `.gitkeep` files only preserve empty folders. No empty weeks or template examples appear publicly. Published weeks sort numerically by `week`, not by filename, and grow downward in native, keyboard-accessible accordions. Each has an anchor such as `#week-3`. Duplicate published week numbers and invalid metadata fail the build with the filename, preventing an ambiguous publication.

## Metadata and optional sections

Keep the opening and closing `---` lines. `week` must be a positive integer. `published` is a Boolean, without quotation marks. Status defaults to `in-progress`; `title` is optional. The only required field for a published entry is a valid `week` together with `published: true`.

```yaml
---
week: 3
title: "Your actual topic"
status: in-progress
published: false
topic: "An optional overview."
concepts:
  - "First concept"
  - "Second concept"
lab: |
  Describe your experiment here. Markdown and formulas work here too.
notebooks: []
code: []
resources: []
takeaways: |
  What you learned so far.
projectConnection: ""
---
## Notes

Your longer Markdown notes go here.
```

`topic`, `lab`, `takeaways`, and `projectConnection` accept Markdown. `concepts` is a list of plain-text items. The body after the metadata supports normal Markdown. Only populated sections and links appear. A project connection is optional and does not automatically create a Projects entry.

## Colab, Kaggle, GitHub, and resources

Replace an empty list with link entries using your real, shareable URLs. Examples below are placeholders, not links to existing work:

```yaml
notebooks:
  - label: "Open in Colab"
    url: "https://colab.research.google.com/drive/YOUR_NOTEBOOK_ID"
  - label: "View on Kaggle"
    url: "https://www.kaggle.com/code/YOUR_ACCOUNT/YOUR_NOTEBOOK"
code:
  - label: "View code on GitHub"
    url: "https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY"
resources:
  - label: "Course reference"
    url: "https://example.com/replace-with-real-resource"
```

Links may use HTTP(S), or `/...` for a page/file on QhapaqData. Check notebook viewing permissions before publishing. Notebooks run on Colab or Kaggle; this site only links to them. Never include access tokens or private credentials in content or URLs.

## Mathematics, code, tables, and images

Use `$...$` for inline math and `$$` on separate lines for display math. The renderer does not interpret `\(...\)`, `\[...\]`, or plain square brackets as math delimiters. Convert those delimiters when copying notes from a LaTeX document.

Inside math, write subscripts as `_` and superscripts as `^`: use `\theta_t` and `\theta^*`, not `\theta\_t` or `\theta^\*`. Backslashes before LaTeX commands such as `\theta`, `\eta`, and `\nabla` must remain. Do not wrap a formula in backticks unless you want to show its source as code.

```markdown
Inline parameter: $\theta$

Loss function:

$$
L(\theta)
$$

Optimization objective:

$$
\theta^* = \arg\min_{\theta} L(\theta)
$$

Gradient update:

$$
\theta_{t+1} = \theta_t - \eta \nabla L(\theta_t)
$$
```

Inline math uses `$y = wx + b$`. Display equations use separate `$$` lines:

```markdown
$$
\mathrm{MSE} = \frac{1}{n}\sum_{i=1}^{n}(y_i-\hat{y}_i)^2
$$
```

Write literal currency dollar signs as `\$` to avoid opening a math expression. Rendering uses `remark-math` and KaTeX; unsupported LaTeX commands may not render. Preview formulas before publishing. Long equations, code, and tables scroll horizontally inside the note on small screens.

Use fenced code blocks, with a language label such as `python`, and normal Markdown tables. Code is displayed, never executed; syntax highlighting is not included in this initial version.

Add public images under `public/msc/` and reference them with `![Useful description](/msc/your-image.png)`. External HTTPS image URLs also work. Use descriptive alt text. Avoid uploading large datasets or private coursework material to the repository. Raw HTML is skipped, MDX/JavaScript execution is not enabled, and KaTeX trusted commands are disabled.

## More semesters and research

Add an entry to `academicTerms` in `data/msc.ts` with a unique stable `slug`, `title`, optional `period`, `kind`, and `courses`. Create corresponding folders under `content/msc/{term-slug}/{course-slug}/`.

Semester 3 and Semester 4 use `kind: "semester"`. A future Thesis / Research entry can use `kind: "research"`, a title such as `Thesis / Research`, and research topics in its `courses` array. Existing page and week components are reusable; no new route implementation is required. New catalog entries are included in the next build automatically.

## Local validation

```bash
npm run build
npm run lint
```

Run the app to check accordion behavior, links, mobile layout, and formulas before publication. On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm`.

Unpublished files are excluded from the website, but remain readable in a public GitHub repository. Draft status is not access control.
