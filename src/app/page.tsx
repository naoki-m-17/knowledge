"use client";

import { FC, useState, ChangeEvent, useEffect, Suspense, SyntheticEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import "./home.scss";
import type { SearchResult } from "./api/search/route";

const Home: FC = () => {
	return (
		<Suspense fallback={
			<div className="home">
				<div className="home__container">
					<h1 className="home__title">Knowledge</h1>
					<p className="home__description">
						記事を検索して、必要な情報を見つけましょう
					</p>
				</div>
			</div>
		}>
			<SearchContent />
		</Suspense>
	);
};

const SearchContent: FC = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const urlQuery = searchParams.get("q") || "";
	
	const [query, setQuery] = useState(urlQuery);
	const [results, setResults] = useState<SearchResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	const performSearch = async (searchQuery: string) => {
		if (!searchQuery.trim()) {
			setResults([]);
			return;
		}

		setIsSearching(true);
		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
			const data = await response.json();
			setResults(data.results || []);
		} catch (error) {
			console.error("Search error:", error);
			setResults([]);
		} finally {
			setIsSearching(false);
		}
	};

	// URLのクエリパラメータから初期検索を実行
	useEffect(() => {
		if (urlQuery) {
			performSearch(urlQuery);
		}
	}, []); // 初回マウント時のみ実行

	// URLのクエリパラメータが変更されたとき（ブラウザの戻る/進むなど）に検索を実行
	useEffect(() => {
		const currentQuery = searchParams.get("q") || "";
		if (currentQuery !== query) {
			setQuery(currentQuery);
			if (currentQuery) {
				performSearch(currentQuery);
			} else {
				setResults([]);
			}
		}
	}, [searchParams]);

	const handleSearch = async (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		
		const searchQuery = query.trim();
		if (!searchQuery) {
			// クエリが空の場合はURLからクエリパラメータを削除
			router.push("/");
			setResults([]);
			return;
		}

		// URLを更新
		router.push(`/?q=${encodeURIComponent(searchQuery)}`);
		// 検索を実行
		await performSearch(searchQuery);
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
	};

	const highlightText = (text: string, searchTerm: string): string => {
		if (!searchTerm) return text;
		const regex = new RegExp(`(${searchTerm})`, "gi");
		return text.replace(regex, '<mark>$1</mark>');
	};

	return (
		<div className="home">
			<div className="home__container">
				<h1 className="home__title">Knowledge</h1>
				<p className="home__description">
					記事を検索して、必要な情報を見つけましょう
				</p>

				<form onSubmit={handleSearch} className="home__search-form">
					<div className="home__search-input-wrapper">
						<input
							type="text"
							value={query}
							onChange={handleInputChange}
							placeholder="記事を検索..."
							className="home__search-input"
							autoFocus
						/>
						<button
							type="submit"
							className="home__search-button"
							disabled={isSearching}
						>
							{isSearching ? "検索中..." : "検索"}
						</button>
					</div>
				</form>

				{results.length > 0 && (
					<div className="home__results">
						<h2 className="home__results-title">
							{results.length}件の記事が見つかりました
						</h2>
						{results.map((result, index) => (
							<div key={index} className="home__result-item">
								<Link href={result.article.path} className="home__result-link">
									<h3 className="home__result-article-title">
										{result.article.name}
									</h3>
									<span className="home__result-category">
										{result.category}
									</span>
								</Link>
								<div className="home__result-matches">
									{result.matches.map((match, matchIndex) => (
										<div key={matchIndex} className="home__result-match">
											<div className="home__result-match-context">
												<span className="home__result-line-number">
													{match.lineNumber}行目
												</span>
												<div
													className="home__result-match-text"
													dangerouslySetInnerHTML={{
														__html: highlightText(match.context, query),
													}}
												/>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				)}

				{query && results.length === 0 && !isSearching && (
					<div className="home__no-results">
						検索結果が見つかりませんでした
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
