# A3 Calendar

Printable HTML calendar in A3 portrait format, with 3 months per page.

## Features

- Local browser generation (no backend)
- Start year + configurable horizon in years (default: 2)
- Two modes:
  - `glissant`: rolling 3-month pages over the selected horizon
  - `trimestre`: fixed quarters over the selected horizon
- ISO week numbers
- Sundays and Belgian legal public holidays highlighted
- A3 print / PDF export

## Usage

1. Open `a3-calendar.html` in a browser.
2. Select start year, number of years, and mode.
3. Click `Generer calendrier`.
4. Click `Imprimer / Exporter PDF`.

## URL Parameters

- `year`: start year (example: `2026`)
- `years`: number of years to generate (range: `1..20`)
- `mode`: `glissant` or `trimestre`

Example: `?year=2026&years=3&mode=glissant`

## Recommended Print Settings

- Paper size: A3
- Orientation: Portrait
- Scale: 100% (no auto-fit)

## Project Structure

- `a3-calendar.html`: page structure and UI markup
- `a3-calendar.css`: styles and print layout rules
- `a3-calendar.js`: calendar generation logic and holiday rules

## License

This project is licensed under the MIT License. See `LICENSE`.
