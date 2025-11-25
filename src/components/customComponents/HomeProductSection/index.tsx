import StarIcon from "@public/svg/star.svg"
import ViewAllBtn from "../ViewAllBtn"

export default function HomeProductSection() {
  return (
    <div>
      <h2 className="text-[48px] italic text-center">New arrivals</h2>
      <div className="mt-[3.5rem]">
        <div>
          <div className="w-[18.4375rem] h-[18.625rem] rounded-[1.25rem] bg-[#F0EEED]">
            image
          </div>
          <div className="mt-4">
            <div className="italic text-[1.25rem]">
              T-SHIRT WITH TAPE DETAILS
            </div>
            <div className="mt-[0.625rem] flex items-center">
              <div className="flex">
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </div>
              <span className="ml-1 text-sm leading-2.5">
                4.5/<span className="text-black/60">5</span>
              </span>
            </div>
            <h3 className="mt-[0.5787rem] text-2xl italic">$120</h3>
          </div>
        </div>
      </div>
      <div>
        <ViewAllBtn />
      </div>
    </div>
  )
}
