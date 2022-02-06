import type { APIGatewayProxyEventV2 } from "aws-lambda";
export type { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

export interface Config {
  correctWord: string;
  bannedWord: string;
  rowLength: number;
  numRows: number;
  revision: number;
}

export type EnvironmentObject = {
  [k: string]: string | undefined;
};

export type EnvironmentLike = EnvironmentObject | (() => EnvironmentObject);
export type APIGatewayEventProps = Pick<
  APIGatewayProxyEventV2,
  "routeKey" | "pathParameters" | "headers"
>;
