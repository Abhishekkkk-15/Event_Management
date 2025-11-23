import { mergeResolvers } from "@graphql-tools/merge";

import { userResolver } from "./user.resolver.js";
import { eventResolver } from "./event.resolver.js";

export const resolvers = mergeResolvers([userResolver, eventResolver]);
