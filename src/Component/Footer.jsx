import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BannerImg from "../assets/krishno.jpg";

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-center font-bold text-2xl py-5">
      Made by ❤️{" "}
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-500 hover:underline"
      >
        Krishno Roy
      </button>
      {/* Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-5 w-[90%] max-w-5xl flex flex-col md:flex-row gap-5"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
            >
              {/* Left Side (Image) */}
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={BannerImg}
                  alt="Krishno Roy"
                  className="rounded-lg w-full object-cover"
                />
              </div>

              {/* Right Side (About Me) */}
              <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                <h2 className="text-2xl font-bold mb-3">About Me</h2>
                <p className="text-gray-600 text-xl">
                  I am Krishno Roy, a frontend web developer. I originally
                  created Tasks Board to keep my work serial in order, so that I
                  don't have to rely on other apps again and again. I believe
                  that a good tool is needed to save time and keep my work more
                  organized. So I created Tasks Board out of my own need, where
                  I can easily manage my to-do list. Coding, turning ideas into
                  reality, and doing challenging work — these are my passions.
                  Tasks Board is a real example of that. Now work will be
                  easier, faster, and more productive!
                </p>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-5 self-center md:self-start bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Footer;
