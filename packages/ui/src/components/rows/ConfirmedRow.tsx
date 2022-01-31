import * as React from "react";
import type { ConfirmedRow } from "../../game/types";
import { Letter } from "../Letter";
import { Row } from "./Row";

interface ConfirmedRowProps {
  row: ConfirmedRow;
}
export function ConfirmedRow({ row }: ConfirmedRowProps) {
  return (
    <Row>
      {row.map(({ value, letterState }, i: number) => {
        return (
          <Letter
            value={value}
            letterState={letterState}
            key={`confirmed-letter-${i}`}
          />
        );
      })}
    </Row>
  );
}
