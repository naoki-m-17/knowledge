import { FC } from "react";
import Link from "next/link";
import "./nextjs.scss";

const NextjsDocsPage: FC = () => {
	return (
		<div className="docs">
			<main className="docs__main">
				<h1 className="docs__title">Next.js環境構築の記録</h1>
				<div className="docs__content">
					<ul className="docs__list">
						<li>
							<Link href="/docs/nextjs/setup-memo" className="docs__link">
								Next.js環境構築メモ
							</Link>
						</li>
						<li>
							<Link href="/docs/nextjs/nextjs-features" className="docs__link">
								Next.js の独自機能と便利ツール
							</Link>
						</li>
					</ul>
				</div>
				<div className="docs__back">
					<Link href="/" className="docs__backLink">
						← トップページに戻る
					</Link>
				</div>
			</main>
		</div>
	);
};

export default NextjsDocsPage;

