'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, wrap as fmWrap } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Partner } from '@/types/types';
import { strapiImage } from '@/lib/strapi/strapiImage';

interface PartnersProps {
  partners: Partner[];
  locale: string;
}

const VISIBLE = 3;           // exactly 3 visible items
const GAP = 24;               // px gap between cards
const CLICK_ANIM_MS = 420;   // arrow/dot tween duration (ms)
const EPS = 1e-6;            // tiny epsilon for stable rounding
const AUTOPLAY_DELAY = 3000; // autoplay delay in ms

export default function Partners({ partners, locale }: PartnersProps) {
  const realLen = partners?.length ?? 0;
  if (!realLen) return null;

  // Ensure we can fill 3 slots
  const normalized = useMemo(() => {
    if (realLen >= VISIBLE) return partners;
    const arr: Partner[] = [];
    while (arr.length < VISIBLE) arr.push(...partners);
    return arr.slice(0, VISIBLE);
  }, [partners, realLen]);

  // Duplicate once → [real | real] so wrapping is seamless
  const data = useMemo(() => [...normalized, ...normalized], [normalized]);
  const real = normalized.length; // length of one real segment

  // Measure viewport width to compute exact slide widths
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((ents) => {
      for (const e of ents) setContainerWidth(e.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Geometry with true gaps (no px/-mx hacks)
  const slideWidth = Math.max(0, (containerWidth - GAP * (VISIBLE - 1)) / VISIBLE);
  const step = Math.round(slideWidth + GAP);     // one-card stride (rounded px)
  const period = real * step;                    // wrap period = width of one real list

  // Motion: baseX is unbounded; displayed x is wrapped into [-period, 0)
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => {
    if (period <= 0) return '0px';
    const w = fmWrap(-period, 0, v);
    return `${Math.round(w)}px`;                // snap transform to integer px
  });

  // Helpers
  const getLogicalIndex = () => {
    if (period <= 0) return 0;
    const wrapped = fmWrap(-period, 0, baseX.get()); // [-period, 0)
    return -wrapped / step;                           // fractional card position
  };

  const snapBaseToWrapped = () => {
    if (period <= 0) return;
    const wrapped = fmWrap(-period, 0, baseX.get());
    baseX.set(Math.round(wrapped)); // keep values small & aligned to pixel grid
  };

  // --- Click queue to prevent overlapping animations ---
  const queueRef = useRef(0);           // pending steps (+ right, - left)
  const animatingRef = useRef(false);
  const stopRef = useRef<() => void>(() => {});
  useEffect(() => () => stopRef.current(), []);

  const runQueue = () => {
    if (animatingRef.current || queueRef.current === 0 || period <= 0) return;

    animatingRef.current = true;
    const direction = queueRef.current > 0 ? 1 : -1;
    queueRef.current -= direction;

    const current = baseX.get();
    const targetRaw = current - direction * step;

    // Choose the closest wrapped target relative to current
    const curWrapped = fmWrap(-period, 0, current);
    const modTarget = ((targetRaw % period) + period) % period; // 0..period
    const modCur = ((curWrapped + period) % period);            // 0..period
    let diff = modTarget - modCur;
    if (diff > period / 2) diff -= period;
    if (diff < -period / 2) diff += period;

    const target = Math.round(current + diff);

    const controls = animate(baseX, target, {
      duration: CLICK_ANIM_MS / 1000,
      ease: 'linear', // no overshoot → prevents peeking
      onComplete: () => {
        snapBaseToWrapped();
        animatingRef.current = false;
        runQueue(); // continue if user spam-clicked
      },
      onStop: () => {
        snapBaseToWrapped();
        animatingRef.current = false;
      },
    });

    stopRef.current = () => controls.stop();
  };

  const queueStep = (delta: number) => {
    queueRef.current += delta;
    runQueue();
  };

  const nextSlide = () => queueStep(+1);
  const prevSlide = () => queueStep(-1);

  const goToReal = (realIdx: number) => {
    const cur = getLogicalIndex();
    const curIdx = ((Math.round(cur) % real) + real) % real;
    let delta = realIdx - curIdx;
    if (delta > real / 2) delta -= real;
    if (delta < -real / 2) delta += real;

    // Queue minimal number of single-card steps for stability
    if (delta > 0) for (let i = 0; i < delta; i++) queueStep(+1);
    else for (let i = 0; i < -delta; i++) queueStep(-1);
  };

  // Active dot (based on center card)
  const [activeDot, setActiveDot] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      const cur = getLogicalIndex();
      // Center is one slot to the right of the left-most; round with epsilon
      let centerIdx = Math.round(cur + 1 + EPS) % real;
      centerIdx = (centerIdx + real) % real;
      setActiveDot(centerIdx);
    }, 100);
    return () => clearInterval(id);
  }, [real, period, step]);

  // --- Autoplay functionality ---
  const [isAutoplayActive, setIsAutoplayActive] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (isAutoplayActive && !animatingRef.current) {
        nextSlide();
      }
    }, AUTOPLAY_DELAY);
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  // Start autoplay on mount and restart when conditions change
  useEffect(() => {
    if (isAutoplayActive && period > 0) {
      startAutoplay();
    } else {
      stopAutoplay();
    }

    return () => stopAutoplay();
  }, [isAutoplayActive, period]);

  const texts =
      locale === 'en'
          ? { title: 'Our Partners', subtitle: 'We collaborate with leading organizations' }
          : { title: 'Nos Partenaires', subtitle: 'Nous collaborons avec des organisations de premier plan' };

  return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {texts.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {texts.subtitle}
            </p>
          </div>

          {/* Carousel */}
          <div className="relative px-8 md:px-10 lg:px-14">
            {/* Viewport with horizontal masking */}
            <div
              ref={containerRef}
              className="relative overflow-hidden py-8"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0px, black 8px, black calc(100% - 8px), transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0px, black 8px, black calc(100% - 8px), transparent 100%)',
              }}
            >
              {/* Track: allow children to overflow vertically for scaling */}
              <motion.div
                  className="relative flex items-stretch"
                  style={{
                    x,
                    gap: `${GAP}px`,
                    // Allow vertical overflow while keeping horizontal contained
                    overflow: 'visible',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    marginTop: '-20px',
                    marginBottom: '-20px'
                  }}
              >
                {data.map((partner, i) => {
                  const imgUrl =
                      partner.logo.image.formats?.small?.url ||
                      partner.logo.image.formats?.thumbnail?.url ||
                      partner.logo.image.url;

                  // --- Center-first highlighting (robust mid-animation) ---
                  const cur = getLogicalIndex(); // fractional
                  let centerIdx = Math.round(cur + 1 + EPS);
                  centerIdx = ((centerIdx % real) + real) % real;

                  const v0 = ((centerIdx - 1) % real + real) % real;
                  const v1 = centerIdx;
                  const v2 = (centerIdx + 1) % real;

                  const realIndex = i % real;
                  const isCenter = realIndex === v1;
                  const isVisible = realIndex === v0 || isCenter || realIndex === v2;

                  return (
                      <div
                          key={`${partner.id}-${i}`}
                          className="relative shrink-0 overflow-visible"   // 👈 overflow-visible on the slide wrapper
                          style={{ width: slideWidth || undefined }}
                      >
                        <Link href={partner.link} target="_blank" rel="noopener noreferrer" className="group block h-full">
                          {/* Fixed-height wrapper to keep section height static */}
                          <div className="relative h-32 md:h-36 lg:h-40 xl:h-44">
                            {/* Absolute scale layer so transforms don't affect layout height */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                              <div
                                className={[
                                  'relative rounded-lg p-3 shadow-sm transition-all duration-300',
                                  'bg-white dark:bg-gray-800',
                                  'overflow-visible',
                                  isCenter ? 'z-20' : 'z-0',
                                ].join(' ')}
                                style={{
                                  width: `${slideWidth}px`,
                                  opacity: isCenter ? 1 : 0.9,
                                  transform: `scale(${isCenter ? 1.1 : 0.95})`,
                                  transformOrigin: 'center center',
                                  transformStyle: 'preserve-3d',
                                  backfaceVisibility: 'hidden',
                                  willChange: 'transform',
                                }}
                              >
                                <div
                                  className={[
                                    'relative transition-all duration-300 flex items-center justify-center w-full',
                                    isCenter
                                      ? 'h-32 md:h-36 lg:h-40 xl:h-44'
                                      : 'h-28 md:h-32 lg:h-36 xl:h-40',
                                  ].join(' ')}
                                >
                                  <div className="relative w-40 h-40 md:w-44 md:h-44 lg:w-48 lg:h-48">
                                    <Image
                                      src={strapiImage(imgUrl)}
                                      alt={partner.logo.company}
                                      fill
                                      className={[
                                        'object-contain',
                                        'transition-[filter] duration-300',
                                        isVisible
                                          ? isCenter
                                            ? 'filter-none'
                                            : 'grayscale group-hover:grayscale-0'
                                          : 'grayscale',
                                      ].join(' ')}
                                      sizes="(max-width: 1024px) 70vw, 28vw"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Arrows */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 -translate-y-1/2 -left-6 md:-left-8 lg:-left-10
                       bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full p-2 shadow-lg
                       hover:shadow-xl transition-transform duration-200 hover:scale-110 z-30"
                aria-label="Previous partners"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute top-1/2 -translate-y-1/2 -right-6 md:-right-8 lg:-right-10
                       bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full p-2 shadow-lg
                       hover:shadow-xl transition-transform duration-200 hover:scale-110 z-30"
                aria-label="Next partners"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {normalized.slice(0, real).map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => goToReal(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                        idx === activeDot
                            ? 'bg-blue-600 w-8'
                            : 'bg-gray-300 dark:bg-gray-600 w-2 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                    aria-label={`Go to partner ${idx + 1}`}
                />
            ))}
          </div>
        </div>
      </section>
  );
}
