import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap' 
import { ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)
import {useGSAP}  from "@gsap/react"
import { heroVideo, smallHeroVideo } from '../utils'

export const Hero = () => {
  const videoRef =useRef('')
    const [videoSrc, setVideoSrc]= useState( window.innerWidth < 760 ? smallHeroVideo: heroVideo)

    useEffect(()=>{
        const handleState=()=>{
window.innerWidth < 760 ? setVideoSrc(smallHeroVideo): setVideoSrc(heroVideo)
        }
        handleState()

        window.addEventListener("resize", handleState);
        return (()=>window.removeEventListener("resize", handleState))
    },[])
    useGSAP(()=>{
        gsap.to("#hero",{opacity:1, delay:1.5, ease:'expo.out'})
        gsap.to("#cta", {
            opacity:1,
            y:-50, delay:1.5
        })
        gsap.to('#video',{
          scrollTrigger:{
            trigger:'#video',
            onEnterBack:()=>{
              videoRef.current.currentTime=0
              videoRef.current.play()
            }
          }
        })
    },[])
  return (
   <section className="w-full nav-height bg-black relative">
      <div className="h-5/6 w-full flex items-center justify-center flex-col">
        <p id="hero" className="hero-title">iPhone 15 Pro</p>
        <div className="md:w-10/12 w-9/12">
          <video className="pointer-events-none" autoPlay muted playsInline={true} key={videoSrc} id='video' ref={videoRef}>
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>

      <div
        id="cta"
        className="flex flex-col items-center opacity-0 translate-y-20"
      >
        <a href="#highlights" className="btn">Buy</a>
        <p className="font-normal text-xl">From $199/month or $999</p>
      </div>
    </section>
  )
}
