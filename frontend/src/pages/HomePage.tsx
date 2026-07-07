import { useEffect, useState } from "react";
import catImg from "../assets/cat.png";

const LINES = [
	"网站域名jsycdut.top备案中",
	"域名预计上线时间20260722",
	"keep coding,",
	"keep learning,",
	"happy hacking ✨ ~  jsy",
];
const SPEED = 80;

function Typewriter() {
	const [lineIndex, setLineIndex] = useState(0);
	const [charIndex, setCharIndex] = useState(0);

	useEffect(() => {
		if (lineIndex >= LINES.length) return;
		const currentLine = LINES[lineIndex];
		if (charIndex < currentLine.length) {
			const timer = setTimeout(() => setCharIndex((c) => c + 1), SPEED);
			return () => clearTimeout(timer);
		}
		if (lineIndex < LINES.length - 1) {
			const timer = setTimeout(() => {
				setLineIndex((l) => l + 1);
				setCharIndex(0);
			}, SPEED * 3);
			return () => clearTimeout(timer);
		}
	}, [lineIndex, charIndex]);

	const allDone = lineIndex >= LINES.length;

	return (
		<div className="italic text-normal font-medium text-slate-400 font-mono text-base tracking-wide mt-1 mb-4 space-y-1">
			{LINES.map((line, i) => {
				const isLastLine = i === LINES.length - 1;
				if (i < lineIndex)
					return (
						<p key={i}>
							{line}
							{isLastLine && allDone && <span className="cursor-blink">|</span>}
						</p>
					);
				if (i === lineIndex)
					return (
						<p key={i}>
							{line.slice(0, charIndex)}
							<span className="cursor-blink">|</span>
						</p>
					);
				return null;
			})}
		</div>
	);
}

type CharDef = { char: string; w: number; accent?: boolean };

const LINE1: CharDef[] = [
	{ char: '"', w: 400, accent: true },
	{ char: "T", w: 100 },
	{ char: "A", w: 100 },
	{ char: "L", w: 100 },
	{ char: "K", w: 100 },
	{ char: " ", w: 100 },
	{ char: "I", w: 100 },
	{ char: "S", w: 100 },
	{ char: " ", w: 100 },
	{ char: "C", w: 100 },
	{ char: "H", w: 100 },
	{ char: "E", w: 100 },
	{ char: "A", w: 100 },
	{ char: "P", w: 100 },
	{ char: ".", w: 100 },
];

const LINE2: CharDef[] = [
	{ char: "S", w: 100 },
	{ char: "H", w: 100 },
	{ char: "O", w: 100 },
	{ char: "W", w: 100 },
	{ char: " ", w: 100 },
	{ char: "M", w: 100 },
	{ char: "E", w: 100 },
	{ char: " ", w: 100 },
	{ char: "T", w: 100 },
	{ char: "H", w: 100 },
	{ char: "E", w: 100 },
	{ char: " ", w: 100 },
	{ char: "C", w: 300 },
	{ char: "O", w: 300 },
	{ char: "D", w: 300 },
	{ char: "E", w: 300 },
	{ char: '"', w: 300, accent: true },
];

function VariableLine({
	chars,
	hoveredIdx,
	onHover,
}: {
	chars: CharDef[];
	hoveredIdx: number | null;
	onHover: (i: number | null) => void;
}) {
	return (
		<div className="leading-none py-2">
			{chars.map(({ char, w, accent }, i) => {
				const boost =
					hoveredIdx !== null
						? Math.max(0, 350 - Math.abs(hoveredIdx - i) * 120)
						: 0;
				const weight = Math.min(900, w + boost);
				return (
					<span
						key={i}
						className={`inline-block transition-all  italic duration-150 ${accent ? "text-amber-400" : "text-slate-900"}`}
						style={{ fontVariationSettings: `'wght' ${weight}` }}
						onMouseEnter={() => onHover(i)}
						onMouseLeave={() => onHover(null)}
					>
						{char === " " ? " " : char}
					</span>
				);
			})}
		</div>
	);
}

function TorvaldsQuote() {
	const [hovered1, setHovered1] = useState<number | null>(null);
	const [hovered2, setHovered2] = useState<number | null>(null);

	return (
		<section className="flex flex-col items-center justify-center mt-4 w-full py-8">
			<header className="flex flex-col items-center text-[4vw] 2xl:text-[3vw] select-none cursor-default">
				<VariableLine
					chars={LINE1}
					hoveredIdx={hovered1}
					onHover={setHovered1}
				/>
				<VariableLine
					chars={LINE2}
					hoveredIdx={hovered2}
					onHover={setHovered2}
				/>
			</header>
			<p className="mt-6 text-sm text-slate-400 tracking-widest">
				— Linus Torvalds
			</p>
		</section>
	);
}

export default function HomePage() {
	return (
		<div className="flex flex-col items-start justify-center min-h-100vh">
			{/* <h1 className="italic text-4xl font-normal md:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-14 text-indigo-400">
				Now you see me,
				<br />
				<span className="text-slate-300 font-thin">Now you know me.</span>
			</h1> */}
			<div className="flex items-center gap-6">
				<Typewriter />
				<img src={catImg} alt="cat" className="h-20 w-auto object-contain" />
			</div>

			<ol className="space-y-0 w-full">
				{[
					"要有扎实的基本功",
					"要保持对新事物的好奇",
					"要锻炼良好的心态和健康的身体",
					"要坚持做对的事情，即使它目前看不到回报",
				].map((item, i) => (
					<li
						key={i}
						className="flex items-start border-b border-dashed gap-5 py-4 border-b-indigo-300 group"
					>
						<span className="text-xs text-muted-foreground/40 font-mono mt-0.5 w-4 shrink-0 select-none">
							{String(i + 1).padStart(2, "0")}
						</span>
						<span className="text-base md:text-lg text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed">
							{item}
						</span>
					</li>
				))}
			</ol>

			<TorvaldsQuote />
		</div>
	);
}
