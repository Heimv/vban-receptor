/// <reference types="react-scripts" />
/// <reference types="node" />
/// reference types="*.d.ts" />
declare module "*.graphql" {
  import { DocumentNode } from "graphql";

  const content: DocumentNode;
  export default content;
}

declare module "*.d.ts"
