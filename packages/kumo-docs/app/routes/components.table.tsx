import {
  Badge,
  Button,
  cn,
  LayerCard,
  CodeBlock,
  Table,
} from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import {
  DotsThreeOutlineIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

export default function TableDoc() {
  return (
    <DocLayout
      title="Table"
      description="A table component that can be used to display tabular data."
      sourceFile="components/table"
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample code={DemoCode}>
          <DemoSection />
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Table } from "@cloudflare/kumo";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Control Column Size</h2>
        <p className="mb-4">
          For precise control over column widths, set the Table layout to
          "fixed" and use colgroup with col elements to define specific column
          sizes.
        </p>
        <ComponentExample code={DemoSizeCode}>
          <DemoSizeSection />
        </ComponentExample>
      </ComponentSection>

      {/* TanStack Table Example */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">TanStack Table Example</h2>
        <p className="mb-4">
          This example demonstrates how to integrate our Table component with
          TanStack Table, featuring resizable columns and row selection
          functionality.
        </p>
        <ComponentExample code={DemoFullCode}>
          <DemoSection />
        </ComponentExample>
      </ComponentSection>
    </DocLayout>
  );
}

// Fake email data
const data = [
  {
    id: "1111-2222",
    title: "Kumo v1.0.0 released",
    from: "Visal In",
    date: "5 seconds ago",
  },
  {
    id: "1111-2223",
    title: "New Job Offer",
    from: "Cloudflare",
    date: "10 minutes ago",
  },
  {
    id: "1111-2224",
    title: "Daily Email Digest",
    from: "Cloudflare",
    tags: ["promotion"],
    date: "1 hour ago",
  },
  {
    id: "1111-2225",
    title: "Gitlab - New Comment",
    from: "Rob Knecht",
    date: "1 day ago",
  },
  {
    id: "1111-2226",
    title: "Johnnie is on holiday",
    from: "Johnnie Lappen",
    date: "3 day ago",
  },
];

function DemoSection() {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    "1111-2223": true,
  });

  const table = useReactTable({
    data,
    columns: [
      { accessorKey: "title", header: "Subject", size: 400, minSize: 300 },
      { accessorKey: "from", header: "From", size: 150, minSize: 100 },
      { accessorKey: "date", header: "Date", size: 150, minSize: 100 },
    ],
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    defaultColumn: {
      minSize: 200,
    },
    state: {
      rowSelection: selected,
    },
    onRowSelectionChange: setSelected,
  });

  return (
    <LayerCard>
      <LayerCard.Primary className="w-full overflow-x-auto p-0">
        <Table layout="fixed">
          <colgroup>
            {/* Fixed width for checkbox coloumns */}
            <col style={{ width: "40px" }} />
            {/* Control rest of columns size */}
            {table.getAllColumns().map((column) => (
              <col
                key={column.id}
                style={{ width: `${column.getSize()}px` }}
                className={cn(
                  column.getIsResizing() && "border-r border-color",
                )}
              />
            ))}
            {/* This will take up the remaining space for action column */}
            <col style={{ minWidth: "50px" }} />
          </colgroup>

          <Table.Header>
            <Table.Row>
              <Table.CheckHead
                checked={table.getIsAllRowsSelected()}
                onValueChange={() => table.toggleAllRowsSelected()}
              />
              {table.getLeafHeaders().map((header) => (
                <Table.Head key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  <Table.ResizeHandle
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                  />
                </Table.Head>
              ))}
              <Table.Head></Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {table.getRowModel().rows.map((row) => {
              const { tags, from, date, title } = row.original;

              return (
                <Table.Row variant={selected[row.id] ? "selected" : "default"}>
                  <Table.CheckCell
                    onValueChange={() => row.toggleSelected()}
                    checked={row.getIsSelected()}
                  />
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <EnvelopeSimpleIcon size={16} />
                      {title}
                      {tags && (
                        <div className="ml-2 inline-flex">
                          {tags.map((tag) => (
                            <Badge key={tag}>{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="line-clamp-1 truncate">{from}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="line-clamp-1 truncate">{date}</span>
                  </Table.Cell>

                  <Table.Cell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      shape="square"
                      className="inline-flex"
                    >
                      <DotsThreeOutlineIcon weight="fill" size={14} />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </LayerCard.Primary>
    </LayerCard>
  );
}

const DemoCode = `
<Table>
  <Table.Header>
    <Table.Row>
      <Table.CheckHead />
      <Table.Head>Header 1</Table.Head>
      <Table.Head>Header 2</Table.Head>
      <Table.Head>Header 3</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.CheckCell />
      <Table.Cell>Cell 1</Table.Cell>
      <Table.Cell>Cell 2</Table.Cell>
      <Table.Cell>Cell 3</Table.Cell>
    </Table.Row>
    <Table.Row variant="selected">
      <Table.CheckCell />
      <Table.Cell>Cell 1</Table.Cell>
      <Table.Cell>Cell 2</Table.Cell>
      <Table.Cell>Cell 3</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
`.trim();

function DemoSizeSection() {
  return (
    <LayerCard>
      <LayerCard.Primary className="p-0">
        <Table layout="fixed">
          <colgroup>
            <col />
            <col className="w-[150px]" />
            <col className="w-[150px]" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.Head>Subject</Table.Head>
              <Table.Head>From</Table.Head>
              <Table.Head>Date</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((row) => (
              <Table.Row key={row.id}>
                <Table.Cell>{row.title}</Table.Cell>
                <Table.Cell>{row.from}</Table.Cell>
                <Table.Cell>{row.date}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </LayerCard.Primary>
    </LayerCard>
  );
}

const DemoSizeCode = `
<Table layout="fixed">
  <colgroup>
    <col className="w-full" />
    <col className="w-[150px]" />
    <col className="w-[150px]" />
  </colgroup>
  <Table.Header>
    <Table.Row>
      <Table.Head>Subject</Table.Head>
      <Table.Head>From</Table.Head>
      <Table.Head>Date</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {data.map((row) => (
      <Table.Row key={row.id}>
        <Table.Cell>{row.title}</Table.Cell>
        <Table.Cell>{row.from}</Table.Cell>
        <Table.Cell>{row.date}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
`.trim();

const DemoFullCode = `
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

function App() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const table = useReactTable({
    data,
    columns: [
      { accessorKey: "title", header: "Subject", size: 400, minSize: 300 },
      { accessorKey: "from", header: "From", size: 150, minSize: 100 },
      { accessorKey: "date", header: "Date", size: 150, minSize: 100 },
    ],
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    state: {
      rowSelection: selected,
    },
    onRowSelectionChange: setSelected,
  });

  return (
    <LayerCard>
      <LayerCard.Primary className="p-0">
        <Table layout="fixed">
          <colgroup>
            <col style={{ width: "40px" }} />
            {table.getAllColumns().map((column) => (
              <col
                key={column.id}
                style={{ width: \`\${column.getSize()}px\` }}
                className={cn(
                  column.getIsResizing() && "border-r border-color",
                )}
              />
            ))}
            <col style={{ minWidth: "50px" }} />
          </colgroup>

          <Table.Header>
            <Table.Row>
              <Table.CheckHead
                checked={table.getIsAllRowsSelected()}
                onValueChange={() => table.toggleAllRowsSelected()}
              />
              {table.getLeafHeaders().map((header) => (
                <Table.Head key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  <Table.ResizeHandle
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                  />
                </Table.Head>
              ))}
              <Table.Head></Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {table.getRowModel().rows.map((row) => {
              const { tags, from, date, title } = row.original;

              return (
                <Table.Row variant={selected[row.id] ? "selected" : "default"}>
                  <Table.CheckCell
                    onValueChange={() => row.toggleSelected()}
                    checked={row.getIsSelected()}
                  />
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <EnvelopeSimpleIcon size={16} />
                      {title}
                      {tags && (
                        <div className="ml-2 inline-flex">
                          {tags.map((tag) => (
                            <Badge key={tag}>{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="line-clamp-1 truncate">{from}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="line-clamp-1 truncate">{date}</span>
                  </Table.Cell>

                  <Table.Cell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      shape="square"
                      className="inline-flex"
                    >
                      <DotsThreeOutlineIcon weight="fill" size={14} />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </LayerCard.Primary>
    </LayerCard>
  );
}

const data = [
  {
    id: "1111-2222",
    title: "Kumo v1.0.0 released",
    from: "Visal In",
    date: "5 seconds ago",
  },
  {
    id: "1111-2223",
    title: "New Job Offer",
    from: "Cloudflare",
    date: "10 minutes ago",
  },
  {
    id: "1111-2224",
    title: "Daily Email Digest",
    from: "Cloudflare",
    tags: ["promotion"],
    date: "1 hour ago",
  },
  {
    id: "1111-2225",
    title: "Gitlab - New Comment",
    from: "Rob Knecht",
    date: "1 day ago",
  },
  {
    id: "1111-2226",
    title: "Johnnie is on holiday",
    from: "Johnnie Lappen",
    date: "3 day ago",
  },
];

`.trim();
