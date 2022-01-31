import * as React from "react";
import { Letter } from "../Letter";
import { Row } from "./Row";

export function EmptyRow({ row }) {
  return (
    <Row>
      {row.map((_: any, i: number) => (
        <Letter value={""} key={`empty-letter-${i}`} />
      ))}
    </Row>
  );
}
