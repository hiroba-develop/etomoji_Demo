import { generate } from "openapi-typescript-codegen";

generate({
  input: "./api/mietoru-api.yaml",
  output: "./src/api",
  httpClient: "fetch",
  useOptions: true,
});
