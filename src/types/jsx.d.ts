// Declaration file for importing .jsx modules in a mixed JS/TSX project
// This lets TypeScript treat imported JSX components as `any`-typed React components
// and avoids the "Could not find a declaration file for module './App.jsx'" error.
declare module '*.jsx' {
  import type { ComponentType } from 'react';
  const Component: ComponentType<any>;
  export default Component;
}
