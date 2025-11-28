import PublicAppContainer from "@/components/customComponents/PublicAppContainer"
import ArrowLeft from "@public/svg/arrow-left.svg"
import ArrowRight from "@public/svg/arrow-right.svg"
import CheckIcon from "@public/svg/check-icon.svg"
import StarIcon from "@public/svg/star.svg"
import ClientSwiper from "./ClientSwiper"

const arrCusCommentTmp = [
  {
    name: "Sarah M.",
    content:
      "\"I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.\"",
  },
  {
    name: "Alex K.",
    content:
      '"Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions."',
  },
  {
    name: "James L.",
    content:
      "\"As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.\"",
  },
]
const arrCusCommentMerge = arrCusCommentTmp.concat(
  arrCusCommentTmp,
  arrCusCommentTmp
)

export default function OurHappyCustomer() {
  return (
    <div>
      <PublicAppContainer>
        <div className="flex item-center justify-between">
          <div className="text-[48px] italic">OUR HAPPY CUSTOMERS</div>
          <div className="flex items-center">
            <span
              id="arr-left"
              className="cursor-pointer hover:bg-black/10 rounded-full p-1 transition"
            >
              <ArrowLeft width={19} height={16} />
            </span>
            <span
              id="arr-right"
              className="ml-[10px] cursor-pointer hover:bg-black/10 rounded-full p-1 transition"
            >
              <ArrowRight width={19} height={16} />
            </span>
          </div>
        </div>
      </PublicAppContainer>
      <div className="swiper mt-[40px] h-[240px] w-full">
        <div className="swiper-wrapper leading-[22px]">
          {arrCusCommentMerge.map((i, idx) => (
            <div
              key={`${i.name}-${idx}`}
              className="swiper-slide border rounded-[20px] border-black/10 py-[28px] px-[32px]"
            >
              <div className="flex gap-[6.5px] text-[#FFC633]">
                {new Array(5).fill(null).map((_, idx) => (
                  <StarIcon key={idx} />
                ))}
              </div>
              <div className="mt-[15px] flex items-center gap-[6.25px]">
                <span className="italic text-[20px]">{i.name}</span>
                <span className="text-[#01AB31]">
                  <CheckIcon />
                </span>
              </div>
              <div className="mt-[12px] text-[16px] text-black/60">
                {i.content}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ClientSwiper />
    </div>
  )
}
