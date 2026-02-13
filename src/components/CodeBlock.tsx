"use client";

import { FC, useState, useRef, ReactNode } from "react";
import "./CodeBlock.scss";

interface CodeBlockProps {
	children: ReactNode;
}

const CodeBlock: FC<CodeBlockProps> = ({ children }) => {
	const [copied, setCopied] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const preRef = useRef<HTMLPreElement>(null);

	// childrenからコードテキストを抽出（React構造）
	const getCodeText = (node: ReactNode): string => {
		if (typeof node === "string") {
			return node;
		}
		if (typeof node === "number") {
			return String(node);
		}
		if (Array.isArray(node)) {
			return node.map((child) => getCodeText(child)).join("");
		}
		if (typeof node === "object" && node !== null && "props" in node) {
			const props = node.props as { children?: ReactNode; className?: string };
			if (props.children) {
				return getCodeText(props.children);
			}
		}
		return "";
	};

	const handleCopy = async () => {
		setError(null);
		// DOMから直接取得を優先（長大なコードブロックや複雑な構造でも確実に取得）
		let codeText = preRef.current?.textContent ?? getCodeText(children);
		codeText = codeText.trimEnd();

		if (!codeText) {
			setError("コピーする内容がありません");
			setTimeout(() => setError(null), 3000);
			return;
		}

		try {
			// navigator.clipboardが利用可能な場合（PCやHTTPS環境）
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(codeText);
			} else {
				// フォールバック: モバイルブラウザやHTTP環境用
				const textArea = document.createElement("textarea");
				textArea.value = codeText;
				textArea.style.position = "fixed";
				textArea.style.left = "-999999px";
				textArea.style.top = "-999999px";
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();

				const successful = document.execCommand("copy");
				document.body.removeChild(textArea);

				if (!successful) {
					throw new Error("コピーに失敗しました");
				}
			}
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			const message = err instanceof Error ? err.message : "コピーに失敗しました";
			setError(message);
			setTimeout(() => setError(null), 3000);
		}
	};

	return (
		<div className="codeBlock">
			<pre ref={preRef}>
				{children}
			</pre>
			<button
				className="copyButton"
				onClick={handleCopy}
				aria-label="コードをコピー"
				title={error ?? undefined}
			>
				{error ? (
					<span className="copyButton-error">{error}</span>
				) : copied ? (
					<>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
						<span>コピーしました</span>
					</>
				) : (
					<>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect x="5" y="5" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
							<path d="M3 3V11H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
						</svg>
						<span>コピー</span>
					</>
				)}
			</button>
		</div>
	);
};

export default CodeBlock;

