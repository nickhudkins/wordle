import * as React from "react";
import type { ConfirmedRow as ConfirmedRowT } from "../../game/types";
import { Letter } from "../Letter";
import { Row } from "./Row";

interface ConfirmedRowProps {
  row: ConfirmedRowT;
  hasInteracted: boolean;
}
export function ConfirmedRow({ row, hasInteracted }: ConfirmedRowProps) {
  return (
    <Row>
      {row.map(({ value, letterState }, i: number) => {
        return (
          <Letter
            hasInteracted={hasInteracted}
            value={value}
            index={i}
            letterState={letterState}
            key={`confirmed-letter-${value}-${i}`}
          />
        );
      })}
    </Row>
  );
}
