import React from "react";

const Footer = () => {
  return (
    <div className="bg-slate-800 flex flex-col items-center text-white">
      <div className="logo font-bold text-2xl">
        <span className="text-green-500">&lt;</span>
        <span>Pass</span>
        <span className="text-green-500">OP/&gt;</span>
      </div>
      <div className="flex gap-1">
        Created with <img className="w-5 " src="/icons/heart.png" alt="" /> by apka Aniket
      </div>
    </div>
  );
};

export default Footer;
