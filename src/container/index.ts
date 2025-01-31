import { createContainer, asClass, asValue, asFunction } from "awilix";
import { UserService } from "../services/user.service";
import { authenticateUser } from "../services/auth.service";
import { logger } from "../helpers/logger";
import { db } from "../db/db";

const container = createContainer()

//Register services
container.register({
  userService: asClass(UserService).singleton(),
  authService: asFunction(() => ({authenticateUser})).singleton(),
  logger: asValue(logger),
  db: asFunction(() => db).singleton(),
});

export {container}