# Express Modular Monolith

Generate an Express modular monolith boilerplate with JavaScript or TypeScript, with support for MongoDB and PostgreSQL.

> **Note:** This architecture is not opinionated or prescriptive. You can modify, extend, or completely rewrite it to fit your project's requirements.

## Usage

Run the CLI using your preferred package manager:

**npm**
```bash
npx express-modular-monolith
```

**pnpm**
```bash
pnpm dlx express-modular-monolith
```

**Bun**
```bash
bunx express-modular-monolith
```

## Features

* JavaScript template
* TypeScript template
* Modular monolith structure
* Express
* MongoDB with Mongoose
* PostgreSQL with Drizzle ORM or Prisma ORM
* Package manager selection (npm, pnpm, or bun)
* Automatic Git repository initialization
* Automatic initial Git commit

## What's New in v1.3.0

* Added PostgreSQL + Prisma ORM support
* Expanded PostgreSQL database configuration options
* Both JavaScript and TypeScript templates support the available database configurations

## How It Works

Choose your preferred programming language, database, ORM/ODM and package manager.

The CLI will:

1. Generate the selected boilerplate
2. Configure the selected database and ORM/ODM
3. Install the required dependencies
4. Initialize a Git repository
5. Add the generated files to Git
6. Create an initial commit

Currently supported configurations:

| Language               | Database   | ORM/ODM  |
| ---------------------- | ---------- | -------- |
| JavaScript, TypeScript | MongoDB    | Mongoose |
| JavaScript, TypeScript | PostgreSQL | Drizzle  |
| JavaScript, TypeScript | PostgreSQL | Prisma   |

Your generated project will be ready for development with the selected database configuration and Git already initialized.

### Supported Package Managers

* **npm**
* **pnpm**
* **Bun**

## Requirements

* Node.js
* npm, pnpm, or Bun
* Git

## License

MIT
