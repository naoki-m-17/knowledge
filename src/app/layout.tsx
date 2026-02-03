import type { Metadata } from "next";
import { FC } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { getDocsStructure } from "@/lib/docs-server";
import "./globals.scss";

const geistSans = Geist({
		variable: "--font-geist-sans",
		subsets: ["latin"],
});

const geistMono = Geist_Mono({
		variable: "--font-geist-mono",
		subsets: ["latin"],
});

export const metadata: Metadata = {
		title: "Knowledge Base (Prototype)",
		description: "AIによって初期構築されたプロトタイプ段階のナレッジベース",
};

interface RootLayoutProps {
		children: React.ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
		const categories = getDocsStructure();

		return (
				<html lang="ja">
						<body className={`${geistSans.variable} ${geistMono.variable}`}>
								<Sidebar categories={categories} />
								<main className="main-content">
										{children}
								</main>
						</body>
				</html>
		);
};

export default RootLayout;
