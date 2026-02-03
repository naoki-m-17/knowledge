import { FC } from "react";
import Link from "next/link";
import "./javascript.scss";

const JavascriptDocsPage: FC = () => {
	return (
		<div className="docs">
			<main className="docs__main">
				<h1 className="docs__title">JavaScript / TypeScript関連ドキュメント</h1>
				<div className="docs__content">
					<ul className="docs__list">
						<li>
							<Link href="/docs/javascript/js-ts-basics" className="docs__link">
								JavaScript / TypeScript の共通ルールと文法
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

export default JavascriptDocsPage;

