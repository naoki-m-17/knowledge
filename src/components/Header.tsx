import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import "./Header.scss";

const Header: FC = () => {
	return (
		<header className="header">
			<div className="header__container">
				<Link href="/" className="header__logo">
					<Image
						src="/logo.png"
						alt="Knowledge Logo"
						width={40}
						height={40}
						priority
					/>
				</Link>
			</div>
		</header>
	);
};

export default Header;

