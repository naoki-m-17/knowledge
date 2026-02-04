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
	const [openSidebar, setOpenSidebar] = useState(false);
	const pathname = usePathname();
	const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

	// toggleSidebarの状態（初回レンダリング時、ウィンドウサイズの変更時）
	useEffect(() => {
		// 初回レンダリング時
		if (window.innerWidth >= 768) {
			setOpenSidebar(true);
		}

		// ウィンドウサイズの変更を監視
		const handleResize = () => {
			if (window.innerWidth < 768) {
				setOpenSidebar(false);
			} else {
				setOpenSidebar(true);
			}
		};
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// toggleSidebarの状態（パス変更時）
	useEffect(() => {
		if (typeof window !== "undefined" && window.innerWidth < 768) {
			setOpenSidebar(false);
		}
	}, [pathname]);

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
		<>
			<button
				className={`toggleSidebar ${openSidebar ? "toggleSidebar-open" : ""}`}
				onClick={() => setOpenSidebar(!openSidebar)}
			>
				<span className="toggleSidebarIcon">{openSidebar ? "＜" : "＞"}</span>
			</button>
			<aside className={`sidebar ${openSidebar ? "sidebar-open" : ""}`}>
				<Link href="/" className="sidebarLogo">
					<Image
						src="/logo.png"
						alt="logo"
						fill
						style={{
							objectFit: 'contain', // アスペクト比を保ち、親要素（position: relative;）の中に収める
							padding: '4px'
						}}
					/>
				</Link>
				<nav className="sidebarMenu">
					{categories.map((category) => {
						const isOpen = openCategories.has(category.name);
						return (
							<div key={category.name} className="sidebarMenuCategory">
								<button
									className="sidebarMenuCategoryButton"
									onClick={() => toggleCategory(category.name)}
								>
									<span>{formatCategoryName(category.name)}</span>
									<span className="sidebarMenuCategoryButtonIcon">{isOpen ? "▽" : "▷"}</span>
								</button>
								{isOpen && (
									<ul className="sidebarMenuCategoryList">
										{category.files.map((file) => (
											<li key={file.slug}>
												<Link
													href={file.path}
													className={`sidebarMenuCategoryListLink ${pathname === file.path ? "sidebarMenuCategoryListLink-active" : ""}`}
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
		</>
	);
};

export default Sidebar;

