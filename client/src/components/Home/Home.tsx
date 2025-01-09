import React, { useState } from 'react';
import { urlEndpoints } from '../../constraints/endpoints/urlEndpoints';
import axiosInstance from '../../constraints/axios/userAxios';

const HOME = () => {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("heloo")
    e.preventDefault();

    console.log("eneterd ",url)
    
   const email = localStorage.getItem("email")

    try {
      const response = await axiosInstance.post(urlEndpoints.urlShorten, {url,email});
      console.log(response);
      setShortenedUrl(response.data.
        shortUrl
        )
    } catch (error) {
      console.error('Error shortening URL:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md space-y-6">
        <h1 className="text-4xl font-bold text-center text-purple-800">URL Shortener</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-gray-700 text-lg">Enter URL</label>
            <input
              type="url"
              id="url"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your long URL here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Shorten URL
          </button>
        </form>

        {shortenedUrl && (
          <div className="mt-6 text-center">
            <p className="text-lg text-gray-700">Your shortened URL:</p>
            <a
              href={`${shortenedUrl}`}
              className="text-indigo-600 text-xl font-semibold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortenedUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default HOME;
