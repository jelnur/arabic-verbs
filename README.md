# Arabic Verb Conjugation Learning App

A static website for learning Arabic verb tenses (تعلم تصريف الأفعال العربية).

## Features

- **Verb Forms**: Learn different verb forms including:
  - سالم (Salim) - Sound verbs
  - مضاعف (Mudaaf) - Doubled verbs
  - معتل (Muz) - Weak verbs

- **Tenses**: Practice conjugations in:
  - الماضي (Mazi) - Past tense
  - المضارع (Muzari) - Present tense
  - الأمر (Amr) - Imperative

- **Interactive Table**: View conjugations organized by person (متكلم، مخاطب، غائب), gender (مذكر، مؤنث), and number (مفرد، تثنية، جمع)

## Development

```bash
# Install dependencies
yarn

# Run development server
yarn dev

# Open http://localhost:3000
```

## Deployment to GitHub Pages

### 1. Build the static site

```bash
yarn export
```

This will create an `out` directory with your static site.

### 2. Update next.config.ts

Make sure the `basePath` in `next.config.ts` matches your repository name:

```typescript
basePath: process.env.NODE_ENV === 'production' ? '/arabic-verbs' : '',
```

Change `/arabic-verbs` to match your GitHub repository name.

### 3. Deploy to GitHub Pages

#### Option A: Using GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: yarn install
      - run: yarn export
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Then:
1. Push your code to GitHub
2. Go to Settings > Pages
3. Set Source to "GitHub Actions"

#### Option B: Manual Deployment

```bash
# Build
yarn export

# Deploy the out directory to gh-pages branch
yarn gh-pages -d out
```

Then:
1. Go to Settings > Pages
2. Set Source to "Deploy from a branch"
3. Select the `gh-pages` branch

## Adding New Verbs

To add new verbs or verb forms:

1. Create CSV files in `public/verbs/` following the naming pattern: `{verbform}-{tense}.csv`
2. Update the `verbForms` array in `src/app/page.tsx`
3. CSV format:

```csv
person,gender,number,form
أنا,,ferd,كَتَبْتُ
نحن,,cem,كَتَبْنَا
...
```

## Technologies

- Next.js 15.5.6
- React 19.1.0
- TypeScript
- CSS Modules
- Google Fonts (Cheherazade New, Amir)

## License

MIT
