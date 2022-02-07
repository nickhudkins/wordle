import * as React from "react";
import { createUseStyles } from "react-jss";
import { classnames } from "../../utils";

const useStyles = createUseStyles({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  shake: {
    animation: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
  },
});
interface RowProps {
  failed?: boolean;
}
export const Row: React.FC<RowProps> = ({ children, failed }) => {
  const cx = classnames(useStyles());
  const className = cx({
    container: true,
    shake: failed,
  });
  return <div className={className}>{children}</div>;
};
