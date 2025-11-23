import { mergeTypeDefs } from "@graphql-tools/merge";

import {userTypeDefs} from "./user.typeDefs";
import {eventTypeDefs} from "./event.typeDefs";

export const typeDefs = mergeTypeDefs([userTypeDefs, eventTypeDefs]);
