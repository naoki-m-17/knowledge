import type { Metadata } from "next";
import { FC } from "react";
import Sidebar from "@/components/Sidebar";
import { getDocsStructure } from "@/lib/docs-server";
import "./globals.scss";

export const metadata: Metadata = {
	title: "CyPass | Knowledge",
	description: "AIによって初期構築されたプロトタイプ段階のナレッジベース",
};

interface RootLayoutProps {
	children: React.ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
	const categories = getDocsStructure();

	return (
		<html lang="ja">
			<body>
				<Sidebar categories={categories} />
				<main>
					{children}
				</main>
			</body>
		</html>
	);
};

export default RootLayout;
