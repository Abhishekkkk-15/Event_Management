"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const merge_1 = require("@graphql-tools/merge");
const user_resolver_js_1 = require("./user.resolver.js");
const event_resolver_js_1 = require("./event.resolver.js");
exports.resolvers = (0, merge_1.mergeResolvers)([user_resolver_js_1.userResolver, event_resolver_js_1.eventResolver]);
