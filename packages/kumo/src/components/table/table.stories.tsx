import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "./table";
import { LayerCard } from "../layer-card";
import { CpuIcon } from "@phosphor-icons/react";
import { Badge } from "../badge";
import { SkeletonLine } from "../loader";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
};

export default meta;
type Story = StoryObj<typeof meta>;

const data = [
  {
    name: "Resource 1",
    size: "100MB",
    status: "processing",
    type: "File",
  },
  {
    name: "Resource 2",
    size: "200MB",
    status: "pending",
    type: "File",
  },
  {
    name: "Resource 3",
    size: "300MB",
    status: "pending",
    type: "File",
    selected: true,
  },
  {
    name: "Resource 4",
    size: "400MB",
    status: "complete",
    type: "File",
  },
];

export const TableExample: Story = {
  render: () => {
    return (
      <LayerCard>
        <LayerCard.Primary className="p-0">
          <Table>
            <colgroup>
              <col className="w-12" />
              <col className="w-auto" />
              <col className="w-28" />
              <col className="w-28" />
              <col className="w-28" />
            </colgroup>

            <Table.Header>
              <Table.Row>
                <Table.CheckHead />
                <Table.Head>Resource Name</Table.Head>
                <Table.Head>Size</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Type</Table.Head>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {data.map((row) => (
                <Table.Row
                  key={row.name}
                  variant={row.selected ? "selected" : "default"}
                >
                  <Table.CheckCell checked={row.selected} />
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <CpuIcon />
                      {row.name}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{row.size}</Table.Cell>
                  <Table.Cell>
                    <Badge variant="secondary">{row.status}</Badge>
                  </Table.Cell>
                  <Table.Cell>{row.type}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </LayerCard.Primary>
      </LayerCard>
    );
  },
};

export const TableLoading: Story = {
  render: () => {
    return (
      <LayerCard>
        <LayerCard.Primary className="p-0">
          <Table>
            <colgroup>
              <col className="w-auto" />
              <col className="w-28" />
              <col className="w-28" />
              <col className="w-28" />
            </colgroup>

            <Table.Header>
              <Table.Row>
                <Table.Head>Resource Name</Table.Head>
                <Table.Head>Size</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Type</Table.Head>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {Array.from({ length: 5 }).map((_, index) => (
                <Table.Row key={index} variant="default">
                  <Table.Cell className="h-9">
                    <SkeletonLine />
                  </Table.Cell>
                  <Table.Cell className="h-9">
                    <SkeletonLine />
                  </Table.Cell>
                  <Table.Cell className="h-9">
                    <SkeletonLine />
                  </Table.Cell>
                  <Table.Cell className="h-9">
                    <SkeletonLine />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </LayerCard.Primary>
      </LayerCard>
    );
  },
};

const profile = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    point: 100,
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "User",
    point: 200,
  },
  {
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "Moderator",
    point: 300,
    selected: true,
  },
  {
    name: "Alice Brown",
    email: "alice.brown@example.com",
    role: "User",
    point: 400,
  },
];

export const TableMultipleLines: Story = {
  render: () => {
    return (
      <LayerCard>
        <LayerCard.Primary className="p-0">
          <Table>
            <colgroup>
              <col className="w-8" />
              <col className="w-auto" />
              <col className="w-auto" />
              <col className="w-auto text-right" />
            </colgroup>

            <Table.Header>
              <Table.Row>
                <Table.CheckHead />
                <Table.Head>Contributor</Table.Head>
                <Table.Head>Email</Table.Head>
                <Table.Head className="text-right">Commit</Table.Head>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {profile.map((row) => (
                <Table.Row
                  key={row.name}
                  variant={row.selected ? "selected" : "default"}
                >
                  <Table.CheckCell checked={row.selected} />
                  <Table.Cell>
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-full bg-surface-3" />
                      <div>
                        <div className="font-medium">{row.name}</div>
                        <div className="text-xs text-muted">{row.role}</div>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-muted">{row.email}</Table.Cell>
                  <Table.Cell className="text-right">+{row.point}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </LayerCard.Primary>
      </LayerCard>
    );
  },
};
