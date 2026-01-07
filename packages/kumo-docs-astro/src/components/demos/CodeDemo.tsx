import { Code } from "@cloudflare/kumo";

export function CodeDemo() {
  return <Code lang="ts" code='const hello = "world";' />;
}

export function CodeLanguagesDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-sm text-muted">TypeScript</p>
        <Code
          lang="ts"
          code={`interface User {
  name: string;
  email: string;
}

const user: User = {
  name: "John",
  email: "john@example.com"
};`}
        />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted">TSX</p>
        <Code
          lang="tsx"
          code={`<Button variant="primary">
  Click me
</Button>`}
        />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted">Bash</p>
        <Code lang="bash" code="npm install @cloudflare/kumo" />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted">CSS</p>
        <Code
          lang="css"
          code={`.button {
  background: var(--color-primary);
  color: white;
}`}
        />
      </div>
    </div>
  );
}

export function CodeWithValuesDemo() {
  return (
    <Code
      lang="bash"
      code="export API_KEY={{apiKey}}"
      values={{
        apiKey: { value: "sk_live_123", highlight: true },
      }}
    />
  );
}
