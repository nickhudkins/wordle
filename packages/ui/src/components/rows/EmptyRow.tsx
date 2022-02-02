import * as React from "react";
import { Letter } from "../Letter";
import { Row } from "./Row";

export function EmptyRow({ row, index }) {
  return (
    <Row>
      {row.map((_: string, i: number) => (
        <Letter row={index} index={i} value={""} key={`empty-letter-${i}`} />
      ))}
    </Row>
  );
}
