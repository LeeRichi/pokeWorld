import { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { FaHeartBroken } from "react-icons/fa";

const Heart: React.FC<{ isFilled: boolean }> = ({ isFilled }) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<>
			{isFilled ? (
				<div
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					{isHovered ? (
						<FaHeartBroken size={20} color="gray" />
					) : (
						<GoHeartFill size={20} color="red" />
					)}
				</div>
			) : (
				<GoHeart size={20} />
			)}
		</>
	);
};

export default Heart;
