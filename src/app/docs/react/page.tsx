import { FC } from "react";
import Link from "next/link";
import "./react.scss";

const ReactDocsPage: FC = () => {
	return (
		<div className="docs">
			<main className="docs__main">
				<h1 className="docs__title">React関連ドキュメント</h1>
				<div className="docs__content">
					<ul className="docs__list">
						<li>
							<Link href="/docs/react/react-basics" className="docs__link">
								React の基本ルールと慣習
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

export default ReactDocsPage;

