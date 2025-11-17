"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const titleControls = useAnimation();
  const headingControls = useAnimation();
  const paragraphControls = useAnimation();
  const actionsControls = useAnimation();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await titleControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      });
      // heading
      await headingControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45 },
      });
      // paragraph
      await paragraphControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45 },
      });
      // actions/buttons
      await actionsControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 },
      });
    })();
  }, [titleControls, headingControls, paragraphControls, actionsControls]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#FBFCFB] via-[#F7FBF9] to-[#FFFFFF]">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-6xl mx-auto w-full h-full flex flex-col-reverse md:flex-row items-center justify-center gap-4 md:gap-2"
      >
        {/* left: text and actions */}
        <div className="w-full md:w-7/12 flex flex-col justify-center items-center px-6 md:px-10 py-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={titleControls}
            className="text-[80px] md:text-[96px] font-extrabold leading-none text-[#63A58F]"
          >
            500
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={headingControls}
            className="mt-3 text-xl md:text-2xl font-semibold text-slate-800"
          >
            サーバーに問題が発生しました。
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={paragraphControls}
            className="mt-4 text-sm text-slate-500 max-w-lg"
          >
            申し訳ありませんが、サーバーで問題が発生しました。しばらくしてからもう一度お試しいただくか、ホームページに戻ってください。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={actionsControls}
            className="mt-6 flex items-center justify-center gap-3"
          >
            <Button
              asChild
              variant="default"
              size="lg"
              className="bg-[#63A58F] hover:bg-[#7BB5A9] text-white"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2"
              >
                <Home size={16} />
                ホームページに戻る
              </Link>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                router.back();
              }}
              className="hidden md:inline-flex"
            >
              <ArrowLeft size={16} />
              戻る
            </Button>
          </motion.div>
        </div>

        {/* right: image with white card, rounded and shadow */}
        <div className="w-full md:w-5/12 flex items-center justify-center px-6 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="relative w-full max-w-[360px] h-[36vh] md:h-[56vh] flex items-center justify-center"
          >
            <Image
              src="/niwan2.png"
              alt="Niwan"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
