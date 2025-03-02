// import React from 'react';

// const NotFound = () => {
//   return (
//     <div className="relative min-h-screen">
//       <div className="flex flex-col items-center justify-center text-center relative z-10 pt-48">
//         <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
//       </div>
//       <div className="absolute top-0 left-0 w-full h-full">
//         <iframe
//           src="https://my.spline.design/gastly-8a52251f174f483eb85ec0516cb55aef/"
//           width="100%"
//           height="100%"
//           frameBorder="0"
// 					className="absolute top-0 left-0 bg-white"
//         />
// 			</div>
//       <div className="flex flex-col items-center justify-center text-center relative z-10 mt-96">
// 				<p className="text-xl text-gray-800 mb-4">Oops! The page you&apos;re looking for was not found.</p>
//         <a
//           href="/"
//           className="text-lg text-blue-500 hover:underline"
//         >
//           Go back to home
// 				</a>
// 			</div>
//     </div>
//   );
// };

// export default NotFound;

import ErrorPage from "../components/ErrorPage.tsx";

export default function NotFoundPage() {
  return <ErrorPage statusCode={404} message="Oops! The page you're looking for was not found." />;
}

