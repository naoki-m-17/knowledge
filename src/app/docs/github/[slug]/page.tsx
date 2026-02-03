import { FC } from "react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import fs from "fs";
import path from "path";
import { getFileNameFromSlug } from "@/lib/docs-server";
import "../github.scss";

interface GithubDocPageProps {
	params: Promise<{ slug: string }>;
}

const GithubDocPage: FC<GithubDocPageProps> = async ({ params }) => {
	const { slug } = await params;
	const fileName = getFileNameFromSlug("github", slug);

	if (!fileName) {
		notFound();
	}

	const filePath = path.join(process.cwd(), "src/app/docs/github", fileName);
  
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

export default GithubDocPage;

