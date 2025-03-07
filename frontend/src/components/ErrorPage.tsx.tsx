import React from "react";
import Link from "next/link";

interface ErrorPageProps {
  statusCode: number;
  message: string | undefined;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ statusCode, message }) => {
  return (
    <div className="relative min-h-screen">
      <div className="flex flex-col items-center justify-center text-center relative z-10 pt-48">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">{statusCode}</h1>
      </div>
      <div className="absolute top-0 left-0 w-full h-full">
        <iframe
          src="https://my.spline.design/gastly-8a52251f174f483eb85ec0516cb55aef/"
          width="100%"
          height="80%"
          frameBorder="0"
          className="absolute top-0 left-0 bg-white"
        />
      </div>
      <div className="flex flex-col items-center justify-center text-center relative z-10 mt-96">
        <p className="text-xl text-gray-800 mb-4">{message}</p>
        <Link href="/" className="text-lg text-blue-500 hover:underline">
          Go back to home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
