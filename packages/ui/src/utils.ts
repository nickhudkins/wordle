export const nonEmpty = (_: string) => _ !== "";
export const isEmpty = (_: string) => _ === "";

export const classnames =
  <T>(cx: T) =>
  (obj: Partial<Record<keyof T, boolean>>) =>
    Object.entries(obj)
      .filter(([, isEnabled]) => isEnabled)
      .map(([key]) => cx[key])
      .join(" ");

export const letterUsage = (letterState: number) => ({
  used: letterState === 0,
  found: letterState === 1,
  correct: letterState === 2,
});
