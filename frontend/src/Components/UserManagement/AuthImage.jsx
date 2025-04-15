import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "react-lottie-player";
import regGif from "../../assets/reg.gif";
import log1Gif from "../../assets/log1.gif";
import log2Gif from "../../assets/log2.gif";
import loginAnimation from "../../assets/NewsFeed.json";
import IconAnimation from "../../assets/Icons.json"; 
import randomAnimation from "../../assets/horizontalIcon.json";

const AuthImage = ({ view, isSuccess }) => {
  // --- Animation Variants ---
  const contentVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };
  const contentTransition = { duration: 0.4, ease: "easeInOut" };

  // --- Success Content ---
  const successContent = (
    <motion.div
      key="success-content-wrapper"
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ ...contentTransition, delay: 0.3 }}
      className="w-full h-full flex flex-col items-center justify-center text-center p-4 "
    >
      <img
        src="/images/success-illustration.png" // Replace with actual path
        alt="Success Illustration"
        className=" max-w-[150px] sm:max-w-[200px] mx-auto mb-4 "
      />
      <h1
        className="text-2xl sm:text-3xl font-bold mb-2 "
      >
        Success!
      </h1>
      <p
        className="mb-4 text-sm sm:text-base "
      >
        {view === "signup"
          ? "We have sent you an email verification."
          : "You have successfully logged in."}
      </p>
      <p
        className="text-xs text-white/70 "
      >
        Redirecting...
      </p>
    </motion.div>
  );

  // ---Login Image Content ---
  const loginImageContent = (
    <motion.div
      key="login-grid"
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={contentTransition}
      className="w-full max-w-lg sm:max-w-2xl flex flex-col items-start"
    >

      <div className="grid grid-cols-4 grid-rows-4 gap-3 w-full h-[350px] sm:h-[400px]">
        {[
         {
            id: 1,
            src: IconAnimation,
            alt: "Animated Alert",
            type: "lottie",
            colSpan: "col-span-2",
            rowSpan: "row-span-2",
          },
          {
            id: 2,
            src: "",
            alt: "Animated Icon 2",
            type: "image",
            colSpan: "col-span-2",
            rowSpan: "row-span-1",
          },
          {
            id: 3,
            src: log2Gif,
            alt: "Empty Box",
            type: "image",
            colSpan: "col-span-2",
            rowSpan: "row-span-2",
          },
          {
            id: 4,
            src: "",
            alt: "Empty Box 1",
            type: "text",
            colSpan: "col-span-2",
            rowSpan: "row-span-1",
          },
          {
            id: 5,
            src: randomAnimation,
            alt: "Empty Box 2",
            type: "lottie",
            colSpan: "col-span-4",
            rowSpan: "row-span-1",
          },
        ].map((item) => (
            <div
            key={item.id}
            className={`bg-bg-white/25 backdrop-blur-sm rounded-md flex items-center justify-center shadow-md hover:shadow-l hover:scale-[1.03] transition-all duration-300 ease-in-out overflow-hidden 
              ${item.colSpan || "col-span-1"} ${item.rowSpan || "row-span-1"}`}
          >
            {item.type === "lottie" ? (
              <Lottie
                animationData={item.src}
                play
                loop
                style={{ width: "100%", height: "100%" }}
              />
            ) : item.type === "image" ? (
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white/60 text-sm text-center px-2">
                {item.alt}
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );

  // --- Sign Up Grid Content ---
  const signupGridContent = (
    <motion.div
      key="login-animation-wrapper"
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={contentTransition}
      className="
              w-full h-full flex flex-col items-center justify-center 
              text-center p-4
          "
    >
    <div className="relative top-0 left-0 w-full" >  <h1 className="text-left text-[20px] font-semibold text-blue-300 mb-4">
             Start Your Journey...
          </h1></div> 
      {/* Lottie Animation */}
      {/*<Lottie
              loop
              animationData={loginAnimation} // Use imported JSON file for animation data
              play
              style={{ width: "500px", height: "500px" }} // Adjust size as needed
          />*/}
      <img
        src={regGif}
        alt="SignUpAnimation"
        className="w-full max-w-[450px] h-auto object-contain"
      />
    </motion.div>
  );

  return (
    <div
      className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center  p-6 sm:p-8 bg-[#4754E6]  
             text-white overflow-hiddenfont-poppins ">
      <AnimatePresence mode="wait">
        {isSuccess
          ? successContent
          : view === "login"
          ? loginImageContent
          : signupGridContent}
      </AnimatePresence>
    </div>
  );
};

export default AuthImage;
