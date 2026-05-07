import { useState } from "react";
import { Badge, Input, LayerCard, Tabs } from "@cloudflare/kumo";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

// ─── Data ────────────────────────────────────────────────────────────

const ORIGINS = [
	{ origin: "challenges.cloudflare.com", s2xx: 1, s4xx: 0, duration: "95.4ms" },
	{ origin: "Unknown", s2xx: 19, s4xx: 7, duration: "463.7ms" },
	{ origin: "api.example.com", s2xx: 42, s4xx: 3, duration: "128.1ms" },
];

type StatusFilter = "all" | "2xx" | "3xx" | "4xx" | "5xx";

// ─── Mockup 1: Segmented filter + search ─────────────────────────────

/** Subrequests card with inline filter toolbar inside Primary. */
export function LayerCardFilterSubrequestsDemo() {
	const [filter, setFilter] = useState<StatusFilter>("all");
	const [search, setSearch] = useState("");

	const filtered = ORIGINS.filter((o) => {
		if (filter === "2xx" && o.s2xx === 0) return false;
		if (filter === "4xx" && o.s4xx === 0) return false;
		if (search && !o.origin.toLowerCase().includes(search.toLowerCase())) return false;
		return true;
	});

	return (
		<LayerCard className="w-full max-w-[540px]">
			<LayerCard.Secondary>Subrequests</LayerCard.Secondary>

			<LayerCard.Primary>
				{/* Toolbar: tabs + search on one line */}
				<div className="mb-2 flex items-center gap-3">
					<Input
						size="sm"
						placeholder="Filter origins…"
						aria-label="Filter origins"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						prefix={<MagnifyingGlassIcon size={12} />}
						className="min-w-0 flex-1"
					/>
					<Tabs
						variant="segmented"
						size="sm"
						className="shrink-0"
						tabs={[
							{ value: "all", label: "All" },
							{ value: "2xx", label: "2xx" },
							{ value: "3xx", label: "3xx" },
							{ value: "4xx", label: "4xx" },
							{ value: "5xx", label: "5xx" },
						]}
						value={filter}
						onValueChange={(v) => setFilter(v as StatusFilter)}
					/>
				</div>

				{/* Custom lightweight table — no banding, uniform bg */}
				<div className="-mx-1 text-sm">
					{/* Header */}
					<div className="grid grid-cols-[1fr_auto_auto] gap-x-4 border-b border-kumo-fill px-1 pb-2 text-xs font-medium text-kumo-subtle">
						<span>Origin</span>
						<span className="w-28 text-right">Requests</span>
						<span className="w-20 text-right">Duration</span>
					</div>

					{/* Rows */}
					{filtered.map((row, i) => (
						<div
							key={row.origin}
							className={`grid grid-cols-[1fr_auto_auto] items-center gap-x-4 px-1 py-2.5 ${i < filtered.length - 1 ? "border-b border-kumo-hairline" : ""}`}
						>
							<span className="truncate font-medium text-kumo-default">{row.origin}</span>
							<div className="flex w-28 items-center justify-end gap-1.5">
								{row.s2xx > 0 && <Badge variant="success">{`2xx ${row.s2xx}`}</Badge>}
								{row.s4xx > 0 && <Badge variant="error">{`4xx ${row.s4xx}`}</Badge>}
							</div>
							<span className="w-20 text-right text-kumo-subtle">{row.duration}</span>
						</div>
					))}
				</div>

				{/* Footer */}
				<div className="-mx-1 border-t border-kumo-fill pt-2 text-xs text-kumo-subtle">
					Showing {filtered.length} of {ORIGINS.length}
				</div>
			</LayerCard.Primary>
		</LayerCard>
	);
}

// ─── Mockup 2: Segmented tabs + area chart ───────────────────────────

/** Sparkline-style area points for a smooth filled chart. */
const POINTS = [
	{ x: 0, v1: 2, v2: 1 },
	{ x: 1, v1: 3, v2: 1 },
	{ x: 2, v1: 5, v2: 2 },
	{ x: 3, v1: 4, v2: 1 },
	{ x: 4, v1: 9, v2: 3 },
	{ x: 5, v1: 14, v2: 4 },
	{ x: 6, v1: 18, v2: 5 },
	{ x: 7, v1: 15, v2: 3 },
	{ x: 8, v1: 11, v2: 2 },
	{ x: 9, v1: 7, v2: 1 },
	{ x: 10, v1: 4, v2: 1 },
	{ x: 11, v1: 3, v2: 0 },
];

const X_LABELS = ["00:00", "06:00", "12:00", "18:00"];
const PEAK = 20;
const W = 480;
const H = 140;

function toPath(key: "v1" | "v2") {
	const pts = POINTS.map((p) => ({
		x: (p.x / (POINTS.length - 1)) * W,
		y: H - (p[key] / PEAK) * H,
	}));
	const line = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");
	const fill = `${line} L${W},${H} L0,${H} Z`;
	return { line, fill };
}

/** Requests card with area chart and segmented view tabs inside Primary. */
export function LayerCardFilterRequestsDemo() {
	const [view, setView] = useState("overview");
	const v1 = toPath("v1");
	const v2 = toPath("v2");

	return (
		<LayerCard className="w-full max-w-[540px]">
			<LayerCard.Secondary>Requests</LayerCard.Secondary>

			<LayerCard.Primary>
				{/* Toolbar: stat + tabs */}
				<div className="mb-1 flex items-end justify-between">
					<div>
						<div className="text-2xl font-semibold tabular-nums text-kumo-default">1,247</div>
						<div className="text-xs text-kumo-subtle">Total requests today</div>
					</div>
					<div className="flex flex-col items-start gap-1.5">
						<div className="text-xs font-medium text-kumo-default">Group by</div>
						<Tabs
							variant="segmented"
							size="sm"
							className="shrink-0"
							tabs={[
								{ value: "overview", label: "Overview" },
								{ value: "by-version", label: "By version" },
								{ value: "by-route", label: "By route" },
							]}
							value={view}
							onValueChange={setView}
						/>
					</div>
				</div>

				{/* Area chart */}
				<svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
					{/* Grid lines */}
					{[0.25, 0.5, 0.75].map((r) => (
						<line
							key={r}
							x1={0} y1={H * r} x2={W} y2={H * r}
							className="stroke-kumo-hairline"
							strokeWidth={0.5}
						/>
					))}
					{/* Series 1 fill + line */}
					<path d={v1.fill} className="fill-kumo-brand/10" />
					<path d={v1.line} fill="none" className="stroke-kumo-brand" strokeWidth={1.5} />
					{/* Series 2 fill + line */}
					<path d={v2.fill} className="fill-kumo-brand/5" />
					<path d={v2.line} fill="none" className="stroke-kumo-brand/40" strokeWidth={1.5} />
				</svg>

				{/* X-axis */}
				<div className="flex justify-between text-[10px] text-kumo-subtle">
					{X_LABELS.map((l) => <span key={l}>{l}</span>)}
				</div>

				{/* Legend */}
				<div className="flex items-center gap-4 border-t border-kumo-hairline pt-2 text-xs text-kumo-subtle">
					<span className="flex items-center gap-1.5">
						<span className="inline-block h-0.5 w-3 rounded-full bg-kumo-brand" />
						v68639957
					</span>
					<span className="flex items-center gap-1.5">
						<span className="inline-block h-0.5 w-3 rounded-full bg-kumo-brand/40" />
						ve2a8b5a9
					</span>
				</div>
			</LayerCard.Primary>
		</LayerCard>
	);
}
