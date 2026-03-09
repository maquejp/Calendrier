# Contributing

Thanks for your interest in this project.

## General Rules

- Keep the project simple: a single application file (`a3-calendar.html`)
- Preserve A3 print compatibility
- Avoid adding unnecessary external dependencies

## Recommended Workflow

1. Create a branch from `main`.
2. Make small, focused changes.
3. Test in the browser:
   - `glissant` mode
   - `trimestre` mode
   - A3 print output
4. Commit using a Conventional Commit message.
5. Open a Pull Request to `main`.

## Commit Convention

Examples:

- `fix(calendar): fix last-row rendering`
- `feat(calendar): add Belgian public holidays`
- `style(calendar): adjust header font size`

## Pre-PR Checklist

- Calendar generation works with no JS errors
- ISO week numbers are correct
- Sundays and public holidays are clearly visible
- A3 print output remains clean
