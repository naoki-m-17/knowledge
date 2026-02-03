import { FC } from "react";
import Link from "next/link";
import "./firebase.scss";

const FirebaseDocsPage: FC = () => {
	return (
		<div className="docs">
			<main className="docs__main">
				<h1 className="docs__title">Firebase関連ドキュメント</h1>
				<div className="docs__content">
					<ul className="docs__list">
						<li>
							<Link href="/docs/firebase/secret-manager-setup" className="docs__link">
								Firebase App Hosting - Secret Manager 権限付与マニュアル
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

export default FirebaseDocsPage;

