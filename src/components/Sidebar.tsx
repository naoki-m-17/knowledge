"use client";

import { FC, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DocCategory, formatCategoryName } from "@/lib/docs-client";
import "./Sidebar.scss";

interface SidebarProps {
		categories: DocCategory[];
}

const Sidebar: FC<SidebarProps> = ({ categories }) => {
		const pathname = usePathname();
		const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

		// 現在のパスに基づいて該当するカテゴリを自動で開く
		useEffect(() => {
				const currentCategory = categories.find((cat) => pathname.startsWith(cat.path));
				if (currentCategory) {
						setOpenCategories((prev) => new Set(prev).add(currentCategory.name));
				}
		}, [pathname, categories]);

		const toggleCategory = (categoryName: string) => {
				setOpenCategories((prev) => {
						const newSet = new Set(prev);
						if (newSet.has(categoryName)) {
								newSet.delete(categoryName);
						} else {
								newSet.add(categoryName);
						}
						return newSet;
				});
		};

		return (
				<aside className="sidebar">
						<Link href="/" className="sidebarLogo">
								<Image
										src="/logo.png"
										alt="logo"
										fill
										style={{
												objectFit: 'contain',
												padding: '4px'
										}} // アスペクト比を保ち、親要素（position: relative;）の中に収める
								/>
						</Link>
						<nav className="sidebar__nav">
								{categories.map((category) => {
										const isOpen = openCategories.has(category.name);
										return (
												<div key={category.name} className="sidebar__category">
														<button
																className={`sidebar__categoryButton ${isOpen ? "sidebar__categoryButton--open" : ""}`}
																onClick={() => toggleCategory(category.name)}
														>
																<span>{formatCategoryName(category.name)}</span>
																<span className="sidebar__categoryIcon">{isOpen ? "▼" : "▶"}</span>
														</button>
														{isOpen && (
																<ul className="sidebar__fileList">
																		{category.files.map((file) => (
																				<li key={file.slug}>
																						<Link
																								href={file.path}
																								className={`sidebar__fileLink ${pathname === file.path ? "sidebar__fileLink--active" : ""}`}
																						>
																								{file.name}
																						</Link>
																				</li>
																		))}
																</ul>
														)}
												</div>
										);
								})}
						</nav>
				</aside>
		);
};

export default Sidebar;

