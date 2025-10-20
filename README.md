# Arabic Verb Conjugation Learning App

A static website for learning Arabic verb conjugations (تعلم تصريف الأفعال العربية).

[LIVE](https://jelnur.github.io/arabic-verbs/)

## Features

- **Verb Forms**: Learn different verb forms:
  - Salim (سَالِمٌ) - Sound verbs (e.g., كَتَبَ، دَخَلَ)
  - Mudaaf (مُضَاعَفٌ) - Doubled verbs (e.g., مَدَّ)
  - Muz (مُعْتَلٌّ) - Weak verbs (coming soon)

- **Conjugation Table**: View verb conjugations organized by:
  - Person (1st, 2nd, 3rd)
  - Gender (مذكر - masculine, مؤنث - feminine)
  - Number (مفرد - singular, تثنية - dual, جمع - plural)

## Development

```bash
yarn           # Install dependencies
yarn dev       # Run development server
yarn format    # Format code with Prettier
yarn lint      # Lint code with ESLint
yarn lint:fix  # Fix linting issues automatically
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Code Quality

This project uses automated code quality tools:

- **Prettier**: Auto-formats code and organizes imports
- **ESLint**: Lints TypeScript/JavaScript code with auto-fix
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Runs formatters/linters only on staged files

When you commit changes, Husky will automatically:

1. Format your code with Prettier (including import organization)
2. Fix linting issues with ESLint
3. Only process files you're committing (via lint-staged)

If there are issues that can't be auto-fixed, the commit will be blocked until you fix them manually.

## Deployment

```bash
yarn export  # Build static site to 'out' directory
```

For GitHub Pages, update `basePath` in `next.config.ts` if needed:

```typescript
basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : ''
```

## Adding New Verbs

To add new verbs or verb forms:

1. Duplicate an existing CSV file in `public/verbs/` following the naming pattern: `{verbform}-{index}.csv`
2. Edit the new CSV file to add the verb forms
3. Update the `verbForms` array in `src/app/page.tsx`

## Technologies

- Next.js 15
- React 19
- TypeScript 5
- MUI 7
- TanStack Query 5
- Google Fonts (Cheherazade New, Amir)

## License

MIT
