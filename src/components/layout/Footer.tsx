import { FooterPolicy } from "@/data/Footer";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="bg-MainColor-PrimaryColor text-MainColor-PrimaryTextColor py-4 lg:py-12">
        <div className="justify-around items-center flex flex-col md:flex-row container">
          <div>logo</div>
          <div>about</div>
          <div>Contact</div>
          <div>social media</div>
        </div>
        <hr className="border-t border-gray-300 my-4" />
        <div className="flex items-center justify-between flex-col md:flex-row container">
          <div className="flex items-center">
            <p className="text-xs font-normal">
              @ copyright Saiyankraft {new Date().getFullYear()}
            </p>
          </div>
          <div className="flex justify-between items-center space-x-4">
            {FooterPolicy.map((item, index) => (
              <Link key={index} href={item.href}>
                <p className="text-xs font-normal">{item.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
