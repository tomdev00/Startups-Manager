import fastify, { FastifyInstance } from "fastify";
import jwt, { FastifyJwtNamespace } from "@fastify/jwt";
import * as mysql from "mysql2";
import connection from "./routes/connection";
import favourites from "./routes/favourites";
import users from "./routes/user";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";

const server = fastify();

server.register(require("@fastify/jwt"), {
  secret: "supersecret",
  decoratorName: "customName",
});

server.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: [
    "username",
    "password",
    "Content-Type",
    "Authorization",
    "x-access-token",
    "name",
    "id",
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
});

server.register(require("fastify-cookie"));

declare module "fastify" {
  interface FastifyInstance
    extends FastifyJwtNamespace<{ namespace: "security" }> {}
}

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.get(
  "/startups",
  { preHandler: connection.tokenVerifier },
  async (request, reply) => {
    let data = await connection.getData("startup");
    return data;
  }
);

server.get(
  "/startups/:id",
  { preHandler: connection.tokenVerifier },
  async (request, reply) => {
    let data = await connection.getDataById(
      "startup",
      (request.params as any).id
    );
    return data;
  }
);

server.post(
  "/startups",
  { preHandler: connection.tokenVerifier },
  async (request, reply) => {
    return await connection.addData(
      "startup",
      "name",
      (request.headers as any).name
    );
  }
);

server.put(
  "/startups/:id",
  { preHandler: connection.adminVerifier },
  async (request, reply) => {
    return await connection.editDataById(
      "startup",
      "name",
      (request.headers as any).name,
      (request.params as any).id
    );
  }
);

server.delete(
  "/startups/:id",
  { preHandler: connection.adminVerifier },
  async (request, reply) => {
    return await connection.deleteDataById(
      "startup",
      (request.params as any).id
    );
  }
);

server.get(
  "/users/:id/favourites",
  { preHandler: connection.accessVerifier },
  async (request, reply) => {
    let data = await favourites.getUsersFav((request.params as any).id);
    return data;
  }
);

server.post(
  "/users/:id/favourites/:id2",
  { preHandler: connection.tokenVerifier },
  async (request, reply) => {
    return await favourites.addFavourites(
      (request.params as any).id,
      (request.params as any).id2
    );
  }
);

server.delete(
  "/users/:id/favourites/:id2",
  { preHandler: connection.tokenVerifier },
  async (request, reply) => {
    return await favourites.deletesFavFromUser(
      (request.params as any).id2,
      (request.params as any).id
    );
  }
);

server.get("/users", async (request, reply) => {
  let data = await connection.getData("user");
  return data;
});

server.post("/login", async (request, reply) => {
  return await users.creationToken(request, reply);
  // return reply
  //   .fastify.cookie("access_token", users.creationToken, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //   })
});

server.post("/register", async (request, reply) => {
  return await users.addUser(
    (request.headers as any).username,
    (request.headers as any).password,
    (request.headers as any).role
  );
});

server.get(
  "/profile",
  { preHandler: connection.tokenVerifier },
  async (request, reply) => {
    const profile = await users.verifyAuth(request, reply);
    return profile;
  }
);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

export default server;
