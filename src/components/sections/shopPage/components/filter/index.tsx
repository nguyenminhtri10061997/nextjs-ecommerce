"use client"

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Slider,
} from "@mui/material"
import ArrowDown from "@public/svg/arrow-down.svg"
import FilterIcon from "@public/svg/filter-icon.svg"
import { useState } from "react"

export default function Filter() {
  const [prices, setPrices] = useState([0, 200])

  return (
    <div className="border border-black/10 rounded-[1.25rem] px-6 py-5">
      <div className="flex justify-between items-center">
        <div className="italic text-xl">Filter</div>
        <FilterIcon />
      </div>
      <div className="mt-6">
        <Divider />
      </div>
      <div className="mt-6 text-black/60">
        {["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"].map((cat) => (
          <div
            key={`cat_${cat}`}
            className="flex items-center justify-between not-first:pt-5"
          >
            <span>{cat}</span>
            <span>{">"}</span>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Divider />
      </div>
      <div>
        <Accordion
          defaultExpanded
          sx={{
            boxShadow: "none",
            "& .MuiButtonBase-root": {
              padding: 0,
            },
          }}
        >
          <AccordionSummary expandIcon={<ArrowDown />}>
            <span className="italic text-xl">Price</span>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              padding: 0,
            }}
          >
            <Slider
              value={prices}
              min={1}
              max={250}
              sx={{
                "& .MuiSlider-thumb": {
                  backgroundColor: "black",
                },

                "& .MuiSlider-rail": {
                  height: 6,
                  backgroundColor: "#F0F0F0",
                },

                "& .MuiSlider-track": {
                  backgroundColor: "black",
                },
              }}
              onChange={(_, newVal) => setPrices(newVal)}
              marks={[
                {
                  value: prices[0],
                  label: `$${prices[0]}`,
                },
                {
                  value: prices[1],
                  label: `$${prices[1]}`,
                },
              ]}
            />
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="mt-6">
        <Divider />
      </div>
      <div>
        <Accordion
          defaultExpanded
          sx={{
            boxShadow: "none",
            "& .MuiButtonBase-root": {
              padding: 0,
            },
          }}
        >
          <AccordionSummary expandIcon={<ArrowDown />}>
            <span className="italic text-xl">Color</span>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              padding: 0,
            }}
          >
            <div className="grid grid-cols-5 gap-[0.9688rem]">
              <div className="w-9 h-9 bg-[#00C12B] rounded-full border border-black/20"></div>
              <div className="w-9 h-9 bg-[#F50606] rounded-full border border-black/20"></div>
              <div className="w-9 h-9 bg-[#F5DD06] rounded-full border border-black/20"></div>
              <div className="w-9 h-9 bg-[#F57906] rounded-full border border-black/20"></div>
              <div className="w-9 h-9 bg-[#06CAF5] rounded-full border border-black/20"></div>
              <div className="w-9 h-9 bg-[#063AF5] rounded-full border border-black/20"></div>
              <div className="w-9 h-9 bg-[#7D06F5] rounded-full border border-black/20"></div>
              <div className="w-9 h-9 bg-[#F506A4] rounded-full border border-black/20"></div>
              <div className="w-9 h-9 bg-[#FFFFFF] rounded-full border border-black/20"></div>
              <div className="w-9 h-9 bg-[#000000] rounded-full border border-black/20"></div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="mt-6">
        <Divider />
      </div>
      <div>
        <Accordion
          defaultExpanded
          sx={{
            boxShadow: "none",
            "& .MuiButtonBase-root": {
              padding: 0,
            },
          }}
        >
          <AccordionSummary expandIcon={<ArrowDown />}>
            <span className="italic text-xl">Size</span>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              padding: 0,
            }}
          >
            <div className="flex flex-wrap gap-2 text-black/60">
              <span className="bg-[#F0F0F0] rounded-4xl py-2.5 px-5">
                XX-Small
              </span>
              <span className="bg-[#F0F0F0] rounded-4xl py-2.5 px-5">
                X-Small
              </span>
              <span className="bg-[#F0F0F0] rounded-4xl py-2.5 px-5">
                Small
              </span>
              <span className="bg-[#F0F0F0] rounded-4xl py-2.5 px-5">
                Medium
              </span>
              <span className="bg-[#F0F0F0] rounded-4xl py-2.5 px-5">
                Large
              </span>
              <span className="bg-[#F0F0F0] rounded-4xl py-2.5 px-5">
                X-Large
              </span>
              <span className="bg-[#F0F0F0] rounded-4xl py-2.5 px-5">
                XX-Large
              </span>
              <span className="bg-[#F0F0F0] rounded-4xl py-2.5 px-5">
                3X-Large
              </span>
              <span className="bg-[#F0F0F0] rounded-4xl py-2.5 px-5">
                4X-Large
              </span>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="mt-6">
        <Divider />
      </div>
      <div>
        <Accordion
          defaultExpanded
          sx={{
            boxShadow: "none",
            "& .MuiButtonBase-root": {
              padding: 0,
            },
          }}
        >
          <AccordionSummary expandIcon={<ArrowDown />}>
            <span className="italic text-xl">Dress Style</span>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              padding: 0,
            }}
            className="text-black/60"
          >
            {["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"].map((cat) => (
              <div
                key={`cat_${cat}`}
                className="flex items-center justify-between not-first:pt-5"
              >
                <span>{cat}</span>
                <span>{">"}</span>
              </div>
            ))}
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="mt-6">
        <button className="cursor-pointer text-white bg-black text-center w-full">Apply Filter</button>
      </div>
    </div>
  )
}
