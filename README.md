<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <h3 align="center">Portfolio</h3>

  <p align="center">
    Personal developer portfolio built with TanStack Start, React and Tailwind, with content
    managed in PocketBase and a static fallback baked into the repository.
    <br />
    <a href="https://github.com/Elouahabi-Naoufal/portfolio"><strong>Explore the source »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Elouahabi-Naoufal/portfolio/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/Elouahabi-Naoufal/portfolio/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

This is the current version of my personal portfolio. It is a TanStack Start application with
server-side rendering, React and Tailwind CSS, using a neobrutalist visual style.

Pages:

* `/` — hero, selected work and the full project archive
* `/work/:slug` — individual case studies
* `/about` — background and approach
* `/cv` — curriculum vitae
* `/contact` — contact details
* `/policy` — site policy

Project content can come from PocketBase. The site fetches published projects in route loaders
with a short stale time, and falls back to the static content in `src/lib/site.ts` and
`src/lib/details.ts` when PocketBase is unreachable or `VITE_POCKETBASE_URL` is unset. The same
static files are the canonical seed for the `scripts/pb-sync.ts` upsert script.

The app ships with a multi-stage Dockerfile and a compose file that exposes it on port `3210`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![TanStack Start][TanStack]][TanStack-url]
* [![React][React.js]][React-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![Vite][Vite]][Vite-url]
* [![Tailwind CSS][TailwindCSS]][TailwindCSS-url]
* [![PocketBase][PocketBase]][PocketBase-url]
* [![Docker][Docker]][Docker-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

* Node.js 20+ and npm
* Optional: a PocketBase instance for dynamic content

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/Elouahabi-Naoufal/portfolio.git
   cd portfolio
   ```

2. Install dependencies
   ```sh
   npm install
   ```

3. Optionally point the site at PocketBase
   ```sh
   export VITE_POCKETBASE_URL="https://your-pocketbase-host"
   ```
   Without it, the static content is used and the site works offline.

4. Start the development server
   ```sh
   npm run dev
   ```
   Open the local URL printed by Vite.

5. Build for production
   ```sh
   npm run build
   npm run preview
   ```

Docker:
```sh
docker compose up --build -d
```
The site will be available on <http://localhost:3210>.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

* Browse projects from the home page and open a case study from its card.
* The `/cv` route serves the CV page; `/contact` lists contact details.
* When PocketBase is configured, editing a published `projects` record updates the site after
  the loader cache expires. Unpublished records are hidden.
* To push the static project data into PocketBase:
  ```sh
  PB_EMAIL=... PB_PASSWORD=... npx tsx scripts/pb-sync.ts
  ```
  The sync is idempotent and upserts by slug.

Available scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview the build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm test` | Vitest |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [x] Home, case study, about, CV, contact and policy pages
- [x] PocketBase-backed projects with static fallback
- [x] Idempotent PocketBase sync script
- [x] Docker image and compose deployment
- [ ] Add an articles index and detail route (the `articles` collection is reserved but unused)
- [ ] Expand automated tests around content fallback and route rendering
- [ ] Document the deployment and PocketBase backup procedure in the repository

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire,
and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Top contributors:

<a href="https://github.com/Elouahabi-Naoufal/portfolio/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Elouahabi-Naoufal/portfolio" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

This project is not licensed — all rights reserved.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Naoufal Elouahabi - [LinkedIn](https://www.linkedin.com/in/elouahabi-naoufal/) - elouahabi-naoufal1@gmail.com

Project Link: [https://github.com/Elouahabi-Naoufal/portfolio](https://github.com/Elouahabi-Naoufal/portfolio)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

* [TanStack Start](https://tanstack.com/start)
* [PocketBase](https://pocketbase.io/)
* [shadcn/ui](https://ui.shadcn.com/)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
* [Img Shields](https://shields.io)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/Elouahabi-Naoufal/portfolio.svg?style=for-the-badge
[contributors-url]: https://github.com/Elouahabi-Naoufal/portfolio/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Elouahabi-Naoufal/portfolio.svg?style=for-the-badge
[forks-url]: https://github.com/Elouahabi-Naoufal/portfolio/network/members
[stars-shield]: https://img.shields.io/github/stars/Elouahabi-Naoufal/portfolio.svg?style=for-the-badge
[stars-url]: https://github.com/Elouahabi-Naoufal/portfolio/stargazers
[issues-shield]: https://img.shields.io/github/issues/Elouahabi-Naoufal/portfolio.svg?style=for-the-badge
[issues-url]: https://github.com/Elouahabi-Naoufal/portfolio/issues
[license-shield]: https://img.shields.io/badge/license-none-lightgrey?style=for-the-badge
[license-url]: #license
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/elouahabi-naoufal/
[TanStack]: https://img.shields.io/badge/TanStack-FF4154?style=for-the-badge&logo=tanstack&logoColor=white
[TanStack-url]: https://tanstack.com/start
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Vite]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vite.dev/
[TailwindCSS]: https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[PocketBase]: https://img.shields.io/badge/PocketBase-B8DBE4?style=for-the-badge&logo=pocketbase&logoColor=black
[PocketBase-url]: https://pocketbase.io/
[Docker]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
