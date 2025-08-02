import { Tailwind } from "@react-email/components";
import React from "react";

interface ITailwindConfigProps {
  children: any;
}

const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        foodiary: {
          green: "#64a30d",
        },
        gray: {
          600: "#a1a1aa",
        },
      },
    },
  },
};

export function TailwindConfig({ children }: ITailwindConfigProps) {
  return <Tailwind config={tailwindConfig}>{children}</Tailwind>;
}
