"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const merge_1 = require("@graphql-tools/merge");
const user_typeDefs_1 = require("./user.typeDefs");
const event_typeDefs_1 = require("./event.typeDefs");
exports.typeDefs = (0, merge_1.mergeTypeDefs)([user_typeDefs_1.userTypeDefs, event_typeDefs_1.eventTypeDefs]);
