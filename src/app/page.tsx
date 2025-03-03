// src/app/page.tsx (or pages/index.js)

import Head from "next/head"; // If using pages directory
import SignLanguageDetector from "./components/SignLanguageDetector"; // Adjust path if needed

export default function Home() {
  return (
    <div>
      <Head>
        {" "}
        {/* Only needed if you're using the pages directory */}
        <title>Real-time Sign Language Detection</title>
        <meta
          name="description"
          content="Sign language detection using live video"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Real-Time Sign Language Detection</h1>
        <SignLanguageDetector />
      </main>
    </div>
  );
}
