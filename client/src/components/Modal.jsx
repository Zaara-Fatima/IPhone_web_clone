import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
import { ModalView } from "./ModalView";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import {models, sizes} from "../constants"
import {animationWithGsapTimeline} from "../utils/animation.js"
import {yellowImg} from '../utils'

export const Modal = () => {
  const [size, setSize] = useState("small");
  const [model, setModel] = useState({
    title: "iPhone 15 Pro in Natural Titanium",
    color: ["#8F8A81", "#FFE7B9", "#6F6C64"],
    img: yellowImg,
  });

  //camera control for the modal view
  const camereControlSmall = useRef();
  const camereControlLarge = useRef();

  //model
  const small = useRef(new THREE.Group());
  const large = useRef(new THREE.Group());

  //rotation
  const [smallRotation, setSmallRotation] = useState(0);
  const [largeRotation, setLargeRotation] = useState(0);

  const tl= gsap.timeline()

  useEffect(()=>{
    if(size==='large'){
      animationWithGsapTimeline(tl, small, smallRotation, '#view1', '#view2',{
        transform: 'translateX(-100%)',
        duration: 2
      }) 
    }

    if(size==='small'){
      animationWithGsapTimeline(tl, large, largeRotation, '#view2', '#view1',{
        transform: 'translateX(0%)',
        duration: 2
      }) 
    }
  },[size])

  useGSAP(() => {
    gsap.to("heading", {
      opacity: 1,
      y: 0,
    });
  }, []);

  return (
    <section className="common-padding">
      <div>
        <h1 id="heading" className="section-heading">
          Take a closer look
        </h1>
        <div className="flex flex-col items-center mt-5">
          <div className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative">
            <ModalView
              index={1}
              groupRef={small}
              gsapType="view1"
              controlRef={camereControlSmall}
              setRotationState={setSmallRotation}
              item={model}
              size={size}
            />
            <ModalView
              index={2}
              groupRef={large}
              gsapType="view2"
              controlRef={camereControlLarge}
              setRotationState={setLargeRotation}
              item={model}
              size={size}
            />

            <Canvas
              className="w-full h-full"
              style={{
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: "hidden",
              }}
              eventSource={document.getElementById('root')}
            >

              <View.Port />
            </Canvas>
          </div>
          <div className="flex  items-center justify-center">
            <ul className="color-container">
                {models.map((item,i)=>(
                  <li key={i} className=" 
                  w-6 h-6 rounded-full mx-2 cursor-pointer" style={{
                     backgroundColor: item.color[0] 
                  }} onClick={()=>setModel(item)}></li>
                ))}
            </ul>

            <button className="size-btn-container">
              {sizes.map(({label, value})=>(
                <span key={label} className="size-btn" tyle={{ backgroundColor: size === value ? 'white' : 'transparent', color: size === value ? 'black' : 'white'}} onClick={()=>setSize(value)}>
                  {label}
                </span>
              ))}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
