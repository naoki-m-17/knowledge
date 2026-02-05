"use client";

import { FC, useState, ReactNode } from "react";
import "./CodeBlock.scss";

interface CodeBlockProps {
	children: ReactNode;
}

const CodeBlock: FC<CodeBlockProps> = ({ children }) => {
	const [copied, setCopied] = useState(false);

	// childrenからコードテキストを抽出
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
		const codeText = getCodeText(children).trimEnd();
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
			console.error("Failed to copy code:", err);
		}
	};

	return (
		<div className="codeBlock">
			<pre>
				{children}
			</pre>
			<button className="copyButton" onClick={handleCopy} aria-label="コードをコピー">
				{copied ? (
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

