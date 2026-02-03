import { FC } from "react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import fs from "fs";
import path from "path";
import { getFileNameFromSlug } from "@/lib/docs-server";
import "../react.scss";

interface ReactDocPageProps {
	params: Promise<{ slug: string }>;
}

const ReactDocPage: FC<ReactDocPageProps> = async ({ params }) => {
	const { slug } = await params;
	const fileName = getFileNameFromSlug("react", slug);

	if (!fileName) {
		notFound();
	}

	const filePath = path.join(process.cwd(), "src/app/docs/react", fileName);
  
	let content = "";
	try {
		content = fs.readFileSync(filePath, "utf-8");
	} catch (error) {
		notFound();
	}

	return (
		<div className="docs">
			<main className="docs__main">
				<article className="docs__article">
					<ReactMarkdown>{content}</ReactMarkdown>
				</article>
			</main>
		</div>
	);
};

export default ReactDocPage;

