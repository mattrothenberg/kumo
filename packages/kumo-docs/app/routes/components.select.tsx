import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { Text, Select, CodeBlock, Button } from "@cloudflare/kumo";
import { useEffect, useMemo, useState } from "react";
import { RecycleIcon } from "@phosphor-icons/react";

export default function SelectDoc() {
  return (
    <DocLayout
      title="Select"
      description="Displays a list of options for the user to pick from—triggered by a button."
    >
      <Example1 />
      <ExampleLabelValue />
      <ExamplePlaceholder />
      <ExampleCustomRendering />
      <ExampleLoading />
      <ExampleMultipleItem />
      <Example3 />
    </DocLayout>
  );
}

function Example1() {
  const [value, setValue] = useState("Apple");

  return (
    <ComponentSection>
      <p className="mb-4 flex flex-col gap-4">
        <Text variant="heading3">Basic Usages</Text>
        <Text variant="secondary">
          A simple select component where the display value matches the option
          value. Perfect for basic dropdown menus with string-based options.
        </Text>
      </p>

      <ComponentExample
        code={`import { Select } from "@cloudflare/kumo";

function App() {
  const [value, setValue] = useState("Apple");

  return (
    <Select className="w-[200px]" value={value} onValueChange={(v) => setValue(v ?? "Apple")}>
      <Select.Option value="Apple">Apple</Select.Option>
      <Select.Option value="Banana">Banana</Select.Option>
      <Select.Option value="Cherry">Cherry</Select.Option>
    </Select>
  )
}`}
      >
        <Select
          className="w-[200px]"
          value={value}
          onValueChange={(v) => setValue(v ?? "Apple")}
          placeholder="Please select"
        >
          <Select.Option value="Apple">Apple</Select.Option>
          <Select.Option value="Banana">Banana</Select.Option>
          <Select.Option value="Cherry">Cherry</Select.Option>
        </Select>
      </ComponentExample>
    </ComponentSection>
  );
}

function ExampleLabelValue() {
  const [value, setValue] = useState("bug");

  return (
    <ComponentSection>
      <p className="mb-4 flex flex-col gap-4">
        <Text variant="heading3">Basic Label and Value</Text>
        <Text variant="secondary">
          A select component where the internal value differs from the displayed
          text. Useful when you need to store identifiers while showing
          user-friendly labels.
        </Text>
      </p>

      <ComponentExample
        code={`import { Select } from "@cloudflare/kumo";

// ✅ Option 1
function App() {
  const [value, setValue] = useState("bug");

  return (
    <Select
      className="w-[200px]"
      value={value}
      onValueChange={(v) => setValue(v ?? "bug")}
      items={{
        bug: "Bug",
        documentation: "Documentation",
        feature: "Feature",
      }}
    >
      <Select.Option value="bug">Bug</Select.Option>
      <Select.Option value="documentation">Documentation</Select.Option>
      <Select.Option value="feature">Feature</Select.Option>
    </Select>
  )
}
  
// ✅ Option 2
function App() {
  const [value, setValue] = useState("bug");

  return (
    <Select
      className="w-[200px]"
      value={value}
      onValueChange={(v) => setValue(v as any)}
      items={[
        {value: "bug", label: "Bug"},
        {value: "documentation", label: "Documentation"},
        {value: "feature", label: "Feature"},
      ]}
    >
      <Select.Option value="bug">Bug</Select.Option>
      <Select.Option value="documentation">Documentation</Select.Option>
      <Select.Option value="feature">Feature</Select.Option>
    </Select>
  )
}
`}
      >
        <Select
          className="w-[200px]"
          value={value}
          onValueChange={(v) => setValue(v as any)}
          items={{
            bug: "Bug",
            documentation: "Documentation",
            feature: "Feature",
          }}
        >
          <Select.Option value="bug">Bug</Select.Option>
          <Select.Option value="documentation">Documentation</Select.Option>
          <Select.Option value="feature">Feature</Select.Option>
        </Select>
      </ComponentExample>
    </ComponentSection>
  );
}

const languges = [
  { value: "en", label: "English", emoji: "🇬🇧" },
  { value: "fr", label: "French", emoji: "🇫🇷" },
  { value: "de", label: "German", emoji: "🇩🇪" },
  { value: "es", label: "Spanish", emoji: "🇪🇸" },
  { value: "it", label: "Italian", emoji: "🇮🇹" },
  { value: "pt", label: "Portuguese", emoji: "🇵🇹" },
];

function ExampleCustomRendering() {
  const [value, setValue] = useState(languges[0]);

  return (
    <ComponentSection>
      <p className="mb-4 flex flex-col gap-4">
        <Text variant="heading3">Custom Rendering</Text>
        <Text variant="secondary">
          A select component that demonstrates custom rendering capabilities for
          both the trigger button and dropdown options, allowing you to work
          with complex object data structures instead of simple string values.
        </Text>
      </p>

      <ComponentExample
        code={`const languges = [
  { value: "en", label: "English", emoji: "🇬🇧" },
  { value: "fr", label: "French", emoji: "🇫🇷" },
  { value: "de", label: "German", emoji: "🇩🇪" },
  { value: "es", label: "Spanish", emoji: "🇪🇸" },
  { value: "it", label: "Italian", emoji: "🇮🇹" },
  { value: "pt", label: "Portuguese", emoji: "🇵🇹" },
];

function App() {
  const [value, setValue] = useState(languges[0]);

  return (
    <Select
      className="w-[200px]"
      renderValue={(v) => (
        <span>
          {v.emoji} {v.label}
        </span>
      )}
      value={value}
      onValueChange={(v) => setValue(v as any)}
    >
      {languges.map((language) => (
        <Select.Option key={language.value} value={language}>
          {language.emoji} {language.label}
        </Select.Option>
      ))}
    </Select>
  );
}
`}
      >
        <Select
          className="w-[200px]"
          renderValue={(v) => (
            <span>
              {v.emoji} {v.label}
            </span>
          )}
          value={value}
          onValueChange={(v) => setValue(v as any)}
        >
          {languges.map((language) => (
            <Select.Option key={language.value} value={language}>
              {language.emoji} {language.label}
            </Select.Option>
          ))}
        </Select>
      </ComponentExample>

      <div className="my-4">
        <Text>
          Select compares value with items to find which one is selected. For
          object items, it will compare if the object is the same reference not
          by value by default. Below example is bad.
        </Text>
      </div>

      <CodeBlock
        lang="tsx"
        code={`
function App() {
  // ❌ Each render creates new object reference
  // ❌ Since each render creates new object reference,
  // ❌ it will not match with the value
  const languges = [
    { value: "en", label: "English", emoji: "🇬🇧" },
    { value: "fr", label: "French", emoji: "🇫🇷" },
    { value: "de", label: "German", emoji: "🇩🇪" },
    { value: "es", label: "Spanish", emoji: "🇪🇸" },
    { value: "it", label: "Italian", emoji: "🇮🇹" },
    { value: "pt", label: "Portuguese", emoji: "🇵🇹" },
  ];

  const [value, setValue] = useState(languges[0]);

  return (
    <Select
      className="w-[200px]"
      renderValue={(v) => (
        <span>
          {v.emoji} {v.label}
        </span>
      )}
      value={value}
      onValueChange={(v) => setValue(v as any)}
    >
      {languges.map((language) => (
        <Select.Option key={language.value} value={language}>
          {language.emoji} {language.label}
        </Select.Option>
      ))}
    </Select>
  );
}
`}
      />

      <div className="my-4">
        <Text>
          If you want to compare object items by value, you can use
          <strong> isItemEqualToValue</strong> prop.
        </Text>
      </div>

      <CodeBlock
        lang="tsx"
        code={`
function App() {
  const languges = [
    { value: "en", label: "English", emoji: "🇬🇧" },
    { value: "fr", label: "French", emoji: "🇫🇷" },
    // ...
  ];

  const [value, setValue] = useState(languges[0]);

  return (
    <Select
      className="w-[200px]"
      renderValue={(v) => (
        <span>
          {v.emoji} {v.label}
        </span>
      )}
      value={value}
      onValueChange={(v) => setValue(v as any)}
      // ✅ Provides custom comparison logic
      isItemEqualToValue={(item, value) => item.value === value.value}
    >
      {languges.map((language) => (
        <Select.Option key={language.value} value={language}>
          {language.emoji} {language.label}
        </Select.Option>
      ))}
    </Select>
  );
}
`}
      />
    </ComponentSection>
  );
}

function Example3() {
  const authors = useMemo(
    () => [
      { id: 1, name: "John Doe", title: "Programmer" },
      { id: 2, name: "Alice Smith", title: "Software Engineer" },
      { id: 3, name: "Michael Chan", title: "UI/UX Designer" },
      { id: 4, name: "Sok Dara", title: "DevOps Engineer" },
      { id: 5, name: "Emily Johnson", title: "Product Manager" },
      { id: 6, name: "Visal In", title: "System Engineer" },
      { id: 7, name: "Laura Kim", title: "Technical Writer" },
    ],
    [],
  );

  const [value, setValue] = useState<(typeof authors)[0] | null>(null);

  return (
    <ComponentSection>
      <p className="mb-4 flex flex-col gap-4">
        <Text variant="heading3">More Example</Text>
      </p>

      <ComponentExample
        code={`const authors = [
  { id: 1, name: "John Doe", title: "Programmer" },
  { id: 2, name: "Alice Smith", title: "Software Engineer" },
  { id: 3, name: "Michael Chan", title: "UI/UX Designer" },
  { id: 4, name: "Sok Dara", title: "DevOps Engineer" },
  { id: 5, name: "Emily Johnson", title: "Product Manager" },
  { id: 6, name: "Visal In", title: "System Engineer" },
  { id: 7, name: "Laura Kim", title: "Technical Writer" },
];

function App() {
  const [value, setValue] = useState<(typeof authors)[0] | null>(null);

  return (
    <Select
      className="w-[200px]"
      onValueChange={(v) => setValue(v as any)}
      value={value}
      isItemEqualToValue={(item, value) => item?.id === value?.id}
      renderValue={(author) => {
        return author?.name ?? "Please select author";
      }}
    >
      {authors.map((author) => (
        <Select.Option key={author.id} value={author}>
          <div className="flex items-center gap-2 w-[300px] justify-between">
            <Text>{author.name}</Text>
            <Text variant="secondary">{author.title}</Text>
          </div>
        </Select.Option>
      ))}
    </Select>
  )
}
  `}
      >
        <Select
          className="w-[200px]"
          onValueChange={(v) => setValue(v as any)}
          value={value}
          isItemEqualToValue={(item, value) => item?.id === value?.id}
          renderValue={(author) => {
            return author?.name ?? "Please select author";
          }}
        >
          {authors.map((author) => (
            <Select.Option key={author.id} value={author}>
              <div className="flex w-[300px] items-center justify-between gap-2">
                <Text>{author.name}</Text>
                <Text variant="secondary">{author.title}</Text>
              </div>
            </Select.Option>
          ))}
        </Select>
      </ComponentExample>
    </ComponentSection>
  );
}

function ExamplePlaceholder() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <ComponentSection>
      <p className="mb-4 flex flex-col gap-4">
        <Text variant="heading3">Placeholder</Text>
        <Text variant="secondary">
          A select component with a placeholder option. The empty value must be{" "}
          <strong>null</strong>, not an empty string or undefined. Using
          undefined will cause the component to behave as uncontrolled.
        </Text>
      </p>

      <ComponentExample
        code={`import { Select } from "@cloudflare/kumo";

function App() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Select
      className="w-[200px]"
      value={value}
      onValueChange={(v) => setValue(v as any)}
      items={[
        // ✅ Placeholder
        { value: null, label: "Please select" },
        { value: "bug", label: "Bug" },
        { value: "documentation", label: "Documentation" },
        { value: "feature", label: "Feature" },
      ]}
    >
      <Select.Option value="bug">Bug</Select.Option>
      <Select.Option value="documentation">Documentation</Select.Option>
      <Select.Option value="feature">Feature</Select.Option>
    </Select>
  )
}
  
function App2() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Select
      className="w-[200px]"
      value={value}
      onValueChange={(v) => setValue(v as any)}
      placeholder="Please select"
      items={[
        { value: "bug", label: "Bug" },
        { value: "documentation", label: "Documentation" },
        { value: "feature", label: "Feature" },
      ]}
    >
      <Select.Option value="bug">Bug</Select.Option>
      <Select.Option value="documentation">Documentation</Select.Option>
      <Select.Option value="feature">Feature</Select.Option>
    </Select>
  )
}
`}
      >
        <Select
          className="w-[200px]"
          value={value}
          onValueChange={(v) => setValue(v as any)}
          items={[
            // ✅ Placeholder
            { value: null, label: "Please select" },
            { value: "bug", label: "Bug" },
            { value: "documentation", label: "Documentation" },
            { value: "feature", label: "Feature" },
          ]}
        >
          <Select.Option value="bug">Bug</Select.Option>
          <Select.Option value="documentation">Documentation</Select.Option>
          <Select.Option value="feature">Feature</Select.Option>
        </Select>
      </ComponentExample>
    </ComponentSection>
  );
}

function ExampleLoading() {
  const [key, setKey] = useState(0);

  return (
    <ComponentSection>
      <p className="mb-4 flex flex-col gap-4">
        <Text variant="heading3">Loading</Text>
        <Text variant="secondary">
          A select component with loading state. The loading state is passed to
          the component via the `loading` prop.
        </Text>
      </p>
      <ComponentExample
        code={`function App() {
  // NULL is for unselected value
  const [value, setValue] = useState(null);
  const { data, isLoading } = useQuery({...});

  const (
    <Select value={value} onValueChange={(v) => setValue(v as any)} loading={isLoading}>
      {data?.map((item) => (
        <Select.Option key={item.id} value={item.id}>
          {item.name}
        </Select.Option>
      ))}
    </Select>
  );
}`}
      >
        <div className="flex flex-col gap-2">
          <Text>Loading State</Text>
          <Select className="w-[200px]" loading />
          <br />
          <Text>Loading From Server</Text>
          <div className="flex items-center gap-2">
            <ExampleLoadingData key={key} />

            <Button onClick={() => setKey((prev) => prev + 1)}>
              <RecycleIcon /> Refresh Data
            </Button>
          </div>
        </div>
      </ComponentExample>
    </ComponentSection>
  );
}

function ExampleLoadingData() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<undefined | string[]>();
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setData(["Visal", "John", "Alice", "Michael", "Sok"]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Select
      className="w-[200px]"
      loading={loading}
      value={value}
      onValueChange={(v) => setValue(v as any)}
      placeholder="Please select"
    >
      {data?.map((item) => (
        <Select.Option key={item} value={item}>
          {item}
        </Select.Option>
      ))}
    </Select>
  );
}

function ExampleMultipleItem() {
  const [value, setValue] = useState<string[]>(["Name", "Location", "Size"]);

  return (
    <ComponentSection>
      <p className="mb-4 flex flex-col gap-4">
        <Text variant="heading3">Multiple Item</Text>
        <Text variant="secondary">
          A select component with multiple selection enabled. The value is an
          array of selected items.
        </Text>
      </p>
      <ComponentExample code={``}>
        <Select
          className="w-[250px]"
          multiple
          renderValue={(value) => {
            if (value.length > 3) {
              return (
                <span className="line-clamp-1">
                  {value.slice(2).join(", ") + ` and ${value.length - 2} more`}
                </span>
              );
            }

            return <span>{value.join(", ")}</span>;
          }}
          value={value}
          onValueChange={(v) => setValue(v as any)}
        >
          <Select.Option value="Name">Name</Select.Option>
          <Select.Option value="Location">Location</Select.Option>
          <Select.Option value="Size">Size</Select.Option>
          <Select.Option value="Read">Read</Select.Option>
          <Select.Option value="Write">Write</Select.Option>
          <Select.Option value="CreatedAt">Created At</Select.Option>
        </Select>
      </ComponentExample>
    </ComponentSection>
  );
}
