export const dbPackages = {
  mongodb: {
    mongoose: {
      dependencies: {
        "mongoose": "^9.9.4"
      }
    }
  },

  postgresql: {
    drizzle: {
      dependencies: {
        "drizzle-orm": "^0.45.2",
        "pg": "^8.20.0"
      },
      devDependencies: {
        "drizzle-kit": "^0.31.10"
      }
    },

    prisma: {
      dependencies: {
        "@prisma/adapter-pg": "^7.10.0",
        "@prisma/client": "^7.10.0",
        "pg": "^8.20.0"
      },
      devDependencies: {
        "prisma": "^7.10.0"
      }
    }
  },

  mysql: {
    drizzle: {
      dependencies: {
        "drizzle-orm": "^0.45.2"
      },
      devDependencies: {
        "drizzle-kit": "^0.31.10"
      }
    },

    prisma: {
      dependencies: {
        "@prisma/client": "^7.10.0"
      },
      devDependencies: {
        "prisma": "^7.10.0"
      }
    }
  }
};

export const ORMscripts = {
  drizzle: {
    scripts: {
      "studio": "drizzle-kit studio",
      "db:generate": "drizzle-kit generate",
      "db:migrate": "drizzle-kit migrate"
    }
  },
  prisma: {
    scripts: {
      "studio": "prisma studio",
      "db:generate": "prisma generate",
      "db:migrate": "prisma migrate dev",
      "db:deploy": "prisma migrate deploy"
    }
  }
};
