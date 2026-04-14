import nextVitals from "eslint-config-next/core-web-vitals";

export default [
  ...nextVitals,
  {
    ignores: [
      ".next/**",
      "out/**",
      "dist/**",
      "node_modules/**"
    ]
  }
];
