const maxButtonsToShow = 5;

interface PaginationBtnProps {
	totalPages: number;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	restLoading: boolean;
}

const PaginationBtn: React.FC<PaginationBtnProps> = ({ totalPages, currentPage, setCurrentPage, restLoading }) => {
	const getPaginationButtons = () => {
		const buttons = [];
		const halfMaxButtons = Math.floor(maxButtonsToShow / 2);

		let startPage = Math.max(1, currentPage - halfMaxButtons);
		let endPage = Math.min(totalPages, currentPage + halfMaxButtons);

		if (endPage - startPage + 1 < maxButtonsToShow) {
			if (startPage === 1) {
				endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);
			} else if (endPage === totalPages) {
				startPage = Math.max(1, endPage - maxButtonsToShow + 1);
			}
		}

		if (startPage > 1) {
			buttons.push(
				<button
					key={1}
					className={`mx-2 px-4 py-2 border rounded-md ${currentPage === 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
					onClick={() => setCurrentPage(1)}
				>
					1
				</button>
			);
			if (startPage > 2) {
				buttons.push(<span key="start-ellipsis" className="mx-2 mt-1">...</span>);
			}
		}

		for (let i = startPage; i <= endPage; i++) {
			buttons.push(
				<button
					key={i}
					className={`mx-2 px-4 py-2 border rounded-md ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
					onClick={() => setCurrentPage(i)}
				>
					{i}
				</button>
			);
		}

		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				buttons.push(<span key="end-ellipsis" className="mx-2 mt-1">...</span>);
			}
			buttons.push(
				<button
					key={totalPages}
					className={`mx-2 px-4 py-2 border rounded-md ${currentPage === totalPages ? 'bg-blue-600 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
					onClick={() => setCurrentPage(totalPages)}
				>
					{totalPages}
				</button>
			);
		}

		// Loading skeleton
		if (restLoading) {
			for (let i = 2; i < maxButtonsToShow; i++) {
				buttons.push(
					<div key={`skeleton-${i}`} className="mx-2 px-4 py-2 border rounded-md bg-gray-300 animate-pulse">
						&nbsp;
					</div>
				);
			}
		}

		return buttons;
	};

	return (
		<div className="flex justify-center mt-4">
			{getPaginationButtons()}
		</div>
	);
};

export default PaginationBtn;
