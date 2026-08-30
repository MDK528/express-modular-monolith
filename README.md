# Express Modular Monolith

Generate an Express modular monolith boilerplate with JavaScript or TypeScript.

> **Note:** This architecture is not opinionated or prescriptive. You can modify, extend, or completely rewrite it to fit your project's requirements.

## Usage

```bash
npx express-modular-monolith
```

## Features

* JavaScript template
* TypeScript template
* Modular monolith structure
* Express
* MongoDB with Mongoose
* PostgreSQL with Drizzle ORM
* Automatic Git repository initialization
* Automatic initial Git commit

## What's New in v1.2.0

* Added MongoDB + Mongoose support
* Added PostgreSQL + Drizzle ORM support
* Added database and ORM/ODM selection during project generation
* Both JavaScript and TypeScript templates support the available database configurations

## How It Works

Run:

```bash
npx express-modular-monolith
```

Choose your preferred language, database, and ORM/ODM. The CLI will:

1. Generate the selected boilerplate
2. Configure the selected database and ORM/ODM
3. Install the required dependencies
4. Initialize a Git repository
5. Add the generated files to Git
6. Create an initial commit

Currently supported configurations:

| Language   | Database   | ORM/ODM  |
| ---------- | ---------- | -------- |
| JavaScript | MongoDB    | Mongoose |
| JavaScript | PostgreSQL | Drizzle  |
| TypeScript | MongoDB    | Mongoose |
| TypeScript | PostgreSQL | Drizzle  |

Your generated project will be ready for development with the selected database configuration and Git already initialized.

## Requirements

* Node.js
* npm
* Git

## License

MIT
