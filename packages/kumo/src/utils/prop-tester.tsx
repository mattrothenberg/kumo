import React from "react";

export function propTester<T, C extends React.ReactElement>(
  allProps: readonly T[] | T[],
  testProp: string,
  Component: C,
  children?: React.ReactNode,
): React.JSX.Element[] {
  return allProps.map((prop) => {
    return (
      <div
        key={`${testProp}-${prop}`}
        className="my-4 border border-dotted border-color bg-surface p-4"
      >
        <div className="mb-2 font-sans text-sm leading-5 font-light tracking-wide text-muted-2 uppercase">
          {`${prop}`}
        </div>
        {React.cloneElement(Component, {
          [`${testProp}`]: prop,
          ...(children && { children }),
        })}
      </div>
    );
  });
}
