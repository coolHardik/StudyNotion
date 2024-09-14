import React, { useCallback, useRef } from "react";
import { toPng } from "html-to-image";
import image from "../../../assets/Logo/f60b9057-846e-468b-8350-f1c7c10228bf.webp";
import formatDate from "../../../utils/dateFormatter";

export default function CertificateGenerator({
  studentName,
  courseName,
  close,
  setShowCertificate
}) {
  const certificateRef = useRef(null);

  const onButtonClick = useCallback(() => {
    if (certificateRef.current === null) {
      return;
    }

    toPng(certificateRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "certificate.png";
        link.href = dataUrl;
        link.click();

        // Call the onClose function to hide the CertificateGenerator after downloading
        close();
      })
      .catch((err) => {
        console.error("Could not generate certificate image:", err);
      });
  }, [certificateRef, close]);

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div
        ref={certificateRef}
        className="relative w-[800px] h-[600px] bg-white shadow-lg border-2 border-gray-300"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-800 font-bold">
          <h1 className="text-4xl font-bold">Certificate of Completion</h1>
          <p className="mt-2 text-lg">This is to certify that</p>
          <h2 className="mt-4 text-3xl font-semibold">{studentName}</h2>
          <p className="mt-2 text-lg">has successfully completed the course</p>
          <h2 className="mt-4 text-2xl font-semibold">{courseName}</h2>
          <p className="mt-4 text-lg">on</p>
          <p className="text-lg">{
            formatDate(Date.now())
          }</p>
        </div>
      </div>
      <div>
        {" "}
        <button
          onClick={onButtonClick}
          className="absolute bottom-5 right-5 px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition"
        >
          Download Certificate
        </button>
        <button 
        onClick={()=>{
          close();
        }}
        className="absolute bottom-5 left-2 px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition">
            Close
        </button>
      </div>
    </div>
  );
}
