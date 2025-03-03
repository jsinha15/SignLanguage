// "use client";

// import React, { useRef, useEffect, useState } from "react";
// import Webcam from "react-webcam";
// import * as tf from "@tensorflow/tfjs";

// const SignLanguageDetector = () => {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [model, setModel] = useState(null);
//   const [prediction, setPrediction] = useState("Loading...");

//   // Load TensorFlow.js model
//   useEffect(() => {
//     const loadModel = async () => {
//       try {
//         const loadedModel = await tf.loadLayersModel("/model/model.json");
//         setModel(loadedModel);
//         console.log("Model loaded successfully!");
//       } catch (error) {
//         console.error("Error loading model:", error);
//       }
//     };
//     loadModel();
//   }, []);

//   // Initialize MediaPipe Hands
//   useEffect(() => {
//     if (!webcamRef.current || !canvasRef.current) return;

//     // Ensure Hands and Camera are available globally
//     const hands = new window.Hands({
//       locateFile: (file) =>
//         `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//     });

//     hands.setOptions({
//       maxNumHands: 1,
//       minDetectionConfidence: 0.5,
//       minTrackingConfidence: 0.5,
//     });

//     hands.onResults((results) => onResults(results));

//     // Use global Camera object provided by MediaPipe's CDN
//     const camera = new window.Camera(webcamRef.current.video, {
//       onFrame: async () => {
//         await hands.send({ image: webcamRef.current.video });
//       },
//       width: 640,
//       height: 480,
//     });
//     camera.start();

//     return () => camera.stop(); // Cleanup on unmount
//   }, []);

//   // Process results from MediaPipe Hands
//   const onResults = (results) => {
//     if (!results.multiHandLandmarks || !canvasRef.current) return;

//     const canvasCtx = canvasRef.current.getContext("2d");
//     canvasCtx.clearRect(
//       0,
//       0,
//       canvasRef.current.width,
//       canvasRef.current.height
//     );

//     results.multiHandLandmarks.forEach((landmarks) => {
//       drawLandmarks(canvasCtx, landmarks);

//       // Preprocess landmarks for model prediction
//       const features = preprocessLandmarks(landmarks);
//       makePrediction(features);
//     });
//   };

//   // Draw landmarks on the canvas
//   const drawLandmarks = (canvasCtx, landmarks) => {
//     canvasCtx.fillStyle = "rgba(255,255,255,0)";
//     canvasCtx.strokeStyle = "#00FF00";
//     canvasCtx.lineWidth = 2;

//     for (let i = 0; i < landmarks.length; i++) {
//       const x = landmarks[i].x * canvasRef.current.width;
//       const y = landmarks[i].y * canvasRef.current.height;

//       canvasCtx.beginPath();
//       canvasCtx.arc(x, y, 5, 0, Math.PI * 2);
//       canvasCtx.fill();
//       if (i > 0) {
//         canvasCtx.moveTo(
//           landmarks[i - 1].x * canvasRef.current.width,
//           landmarks[i - 1].y * canvasRef.current.height
//         );
//         canvasCtx.lineTo(x, y);
//         canvasCtx.stroke();
//       }
//     }
//   };

//   // Preprocess hand landmarks for model input
//   const preprocessLandmarks = (landmarks) => {
//     const baseX = landmarks[0].x;
//     const baseY = landmarks[0].y;
//     return landmarks.map((lm) => [lm.x - baseX, lm.y - baseY]).flat();
//   };

//   // Predict gesture using TensorFlow.js model
//   const makePrediction = async (features) => {
//     if (!model) return;

//     const inputTensor = tf.tensor([features]);
//     const predictions = await model.predict(inputTensor).data();

//     // Get the class with the highest confidence score
//     const maxIndex = predictions.indexOf(Math.max(...predictions));
//     setPrediction(
//       `Gesture: ${String.fromCharCode(65 + maxIndex)} (${Math.max(
//         ...predictions
//       ).toFixed(2)})`
//     );

//     tf.dispose(inputTensor); // Clean up memory
//   };

//   return (
//     <div>
//       <Webcam ref={webcamRef} style={{ position: "absolute", zIndex: -1 }} />
//       <canvas
//         ref={canvasRef}
//         width="640"
//         height="480"
//         style={{ position: "absolute" }}
//       />
//       <div>
//         <h2>{prediction || "Waiting for gesture..."}</h2>
//       </div>
//     </div>
//   );
// };

// export default SignLanguageDetector;

"use client";

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";

const SignLanguageDetector = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState("Loading...");

  // Load TensorFlow.js model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel("/model/model.json");
        setModel(loadedModel);
        console.log("Model loaded successfully!");
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };
    loadModel();
  }, []);

  // Initialize MediaPipe Hands
  useEffect(() => {
    if (!webcamRef.current || !canvasRef.current) return;

    // Ensure Hands and Camera are available globally
    const hands = new window.Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => onResults(results));

    // Use global Camera object provided by MediaPipe's CDN
    const camera = new window.Camera(webcamRef.current.video, {
      onFrame: async () => {
        await hands.send({ image: webcamRef.current.video });
      },
      width: 640,
      height: 480,
    });
    camera.start();

    return () => camera.stop(); // Cleanup on unmount
  }, []);

  // Process results from MediaPipe Hands
  const onResults = (results) => {
    if (!results.multiHandLandmarks || !canvasRef.current) return;

    const canvasCtx = canvasRef.current.getContext("2d");
    canvasCtx.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    results.multiHandLandmarks.forEach((landmarks) => {
      drawLandmarks(canvasCtx, landmarks);

      // Preprocess landmarks for model prediction
      const features = preprocessLandmarks(landmarks);
      makePrediction(features);
    });
  };

  // Draw landmarks on the canvas
  const drawLandmarks = (canvasCtx, landmarks) => {
    canvasCtx.fillStyle = "rgba(255,255,255,0)";
    canvasCtx.strokeStyle = "#00FF00";
    canvasCtx.lineWidth = 2;

    for (let i = 0; i < landmarks.length; i++) {
      const x = landmarks[i].x * canvasRef.current.width;
      const y = landmarks[i].y * canvasRef.current.height;

      canvasCtx.beginPath();
      canvasCtx.arc(x, y, 5, 0, Math.PI * 2);
      canvasCtx.fill();
      if (i > 0) {
        canvasCtx.moveTo(
          landmarks[i - 1].x * canvasRef.current.width,
          landmarks[i - 1].y * canvasRef.current.height
        );
        canvasCtx.lineTo(x, y);
        canvasCtx.stroke();
      }
    }
  };

  // Preprocess hand landmarks for model input
  const preprocessLandmarks = (landmarks) => {
    const baseX = landmarks[0].x;
    const baseY = landmarks[0].y;
    return landmarks.map((lm) => [lm.x - baseX, lm.y - baseY]).flat();
  };

  // Predict gesture using TensorFlow.js model
  const makePrediction = async (features) => {
    if (!model) return;

    const inputTensor = tf.tensor([features]);
    const predictions = await model.predict(inputTensor).data();

    // Get the class with the highest confidence score
    const maxIndex = predictions.indexOf(Math.max(...predictions));
    setPrediction(
      `Gesture: ${String.fromCharCode(65 + maxIndex)} (${Math.max(
        ...predictions
      ).toFixed(2)})`
    );

    tf.dispose(inputTensor); // Clean up memory
  };

  return (
    <div>
      <Webcam ref={webcamRef} style={{ position: "absolute", zIndex: -1 }} />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ position: "absolute" }}
      />
      <div>
        <h2>{prediction || "Waiting for gesture..."}</h2>
      </div>
    </div>
  );
};

export default SignLanguageDetector;
