import React from "react";
import { FaRegCopyright } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { IoCloudOutline } from "react-icons/io5";

const Footer: React.FC = () => {
  return (
    <div className="w-full p-1 px-3 flex flex-col items-center">
      <div className="md:flex md:flex-row hidden items-center justify-center w-full text-gray-300  bg-gray-800 p-5">
        <div className="w-[32%] flex flex-col pl-8" >
          <div className="flex flex-row items-center">
            <IoCloudOutline className="text-4xl text-gray-300  font-extralight" />
            <h3 className="text-xl font-bold text-gray-300  ml-3">SCS</h3>
          </div>
          <p >
            Suryansh Cloud services
          </p>
          <div className="flex flex-row">
            <a
              href="https://www.linkedin.com/in/suryansh-verma-54a88528a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
            >
              <FaLinkedin className=" m-4 aspect-square hover:scale-150" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100089669727713&mibextid=ZbWKwL"
              target="_blank"
            >
              <FaFacebook className=" m-4 aspect-square hover:scale-150" />
            </a>
            <a
              href="https://www.instagram.com/suryanshverma_1?utm_source=qr&igsh=MWE2ZDczZHg1c3Fxbg=="
              target="_blank"
            >
              <FaInstagram className=" m-4 aspect-square hover:scale-150" />
            </a>
          </div>
        </div>
        <div className="w-[32%] flex flex-col">
          <h1 style={{ borderLeft: "2px solid blue", paddingLeft: "8px" }}>
            Contact Us
          </h1>
          <p style={{ lineHeight: "25px" }}>
            lakhimpur kheri ,UP 262701 ,India <br />
            Ph: <span style={{ color: "blue" }}>+91 9580104753</span>
            <br />
            Mail:{" "}
            <span style={{ color: "blue" }}>suryanshv.ug23.ee@nitp.ac.in</span>
          </p>
        </div>
        <div className="w-[32%] flex flex-col">
          <h1 style={{  paddingLeft: "8px",textAlign:'center' }}>
            Useful Links
          </h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
           
            <a className="text-gray-400"
              href="https://drive.google.com/file/d/1hQkWJJX0cm36t9yyoBCOUDoPgEKnM64j/view?usp=drivesdk"
              target="_blank"
            >
              resume
            </a>
            <a className="text-gray-400"
              href="https://www.linkedin.com/in/suryansh-verma-54a88528a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
            >
              linkedIn
            </a>
            <a  className="text-gray-400"
              href="https://www.instagram.com/suryanshverma_1?utm_source=qr&igsh=MWE2ZDczZHg1c3Fxbg=="
              target="_blank"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center w-full  bg-gray-900">
        <FaRegCopyright className="text-md text-gray-300 font-extralight" />
        <h1 className="text-md font-light text-gray-300 inline ml-1">
          2024,Suryansh Cloud Services (SCS)
        </h1>
      </div>
    </div>
  );
};
export default Footer;
