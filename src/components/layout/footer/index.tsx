import PublicAppContainer from "@/components/customComponents/PublicAppContainer"
import MailIcon from "@public/svg/email.svg"
import FBIcon from "@public/svg/fb.svg"
import GithubIcon from "@public/svg/github.svg"
import InsIcon from "@public/svg/insta.svg"
import TwitterIcon from "@public/svg/twitter.svg"
import Image from "next/image"
import Link from "next/link"

const Sections = [
  {
    title: "COMPANY",
    items: ["About", "Features", "Works", "Career"],
  },
  {
    title: "HELP",
    items: [
      "Customer Support",
      "Delivery Details",
      "Terms & Conditions",
      "Privacy Policy",
    ],
  },
  {
    title: "FAQ",
    items: ["Account", "Manage Deliveries", "Orders", "Payments"],
  },
  {
    title: "RESOURCE",
    items: [
      "Free eBooks",
      "Development Tutorial",
      "How to - Blog",
      "Youtube Playlist",
    ],
  },
]

const Footer = () => {
  return (
    <div className="w-full bg-[#F0F0F0] relative pt-[220px] sm:pt-[190px] lg:pt-[106px] pb-[116px]">
      {/* Subscribe Section */}
      <div className="w-full absolute top-[-90px]">
        <PublicAppContainer>
          <div className="bg-black rounded-[20px] py-[32px] md:py-[36px] px-[24px] md:px-[64px] flex flex-col md:flex-row justify-between gap-[22px] hover:scale-105 transition">
            <div className="text-white italic max-w-[551px] text-[32px] md:text-[40px] leading-[35px] md:leading-[45px]">
              STAY UPTO DATE ABOUT OUR LATEST OFFERS
            </div>
            <form className="w-full md:w-[349px]">
              <div className="bg-white rounded-[62px] flex items-center py-[12px] px-[16px] gap-[14px]">
                {/* Icon Email Placeholder */}
                <span className="text-black/60">
                  <MailIcon />
                </span>
                <input
                  name="subscriber-email"
                  type="email"
                  required
                  className="w-full outline-0"
                  placeholder="Enter your email address"
                />
              </div>
              <button
                type="submit"
                className="mt-[14px] w-full rounded-[62px] text-center py-[12px] bg-white cursor-pointer hover:bg-gray-200"
              >
                Subscribe to Newsletter
              </button>
              <p className="mt-2 absolute text-white text-sm">
                {/* Dynamic text here */}
              </p>
            </form>
          </div>
        </PublicAppContainer>
      </div>

      {/* Footer Content */}
      <PublicAppContainer>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-[81px] md:gap-x-[105px] gap-y-[8px]">
          <div className="w-full md:w-[248px] col-span-2 md:col-span-1">
            <Link href="/">
              <Image
                alt="LOGO"
                src="/images/SHOP.CO.png"
                width={132}
                height={23}
              />
            </Link>
            <p className="mt-[25px] text-[14px] text-black/60">
              We have clothes that suits your style and which you’re proud to
              wear. From women to men.
            </p>
            <div className="mt-[35px] flex gap-[12px]">
              {/* Social icons placeholder */}
              <span className="bg-white rounded-full border border-black/10 flex items-center justify-center w-[28px] h-[28px] cursor-pointer hover:scale-105">
                <TwitterIcon />
              </span>
              <span className="bg-white rounded-full border border-black/10 flex items-center justify-center w-[28px] h-[28px] cursor-pointer hover:scale-105">
                <FBIcon width={8} height={12} />
              </span>
              <span className="bg-white rounded-full border border-black/10 flex items-center justify-center w-[28px] h-[28px] cursor-pointer hover:scale-105">
                <InsIcon />
              </span>
              <span className="bg-white rounded-full border border-black/10 flex items-center justify-center w-[28px] h-[28px] cursor-pointer hover:scale-105">
                <GithubIcon />
              </span>
            </div>
          </div>

          {/* Column */}
          {Sections.map((i, idx) => (
            <div key={idx} className="text-[14px] md:text-[16px]">
              <div>{i.title}</div>
              <div className="mt-[16px] md:mt-[26px] text-black/60">
                {i.items.map((item, i) => (
                  <h3 key={i} className={`${i > 0 ? "mt-[10px]" : ""}`}>
                    {" "}
                    <a className="cursor-pointer hover:opacity-80 transition">
                      {item}
                    </a>{" "}
                  </h3>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="h-[1px] bg-black/10 mt-[40px] md:mt-[50px]"></div>
        <div className="flex justify-center md:justify-between mt-[16px] md:mt-[20px] items-center flex-wrap">
          <div className="text-[14px] text-black/60">
            Shop.co © 2000-2023, All Rights Reserved
          </div>
          <div className="flex justify-center gap-2">
            <Image
              src="/images/visa.png"
              width={46.5}
              height={30}
              className="cursor-pointer"
              alt="visa"
            />
            <Image
              src="/images/master-card.png"
              width={46.5}
              height={30}
              className="cursor-pointer"
              alt="mastercard"
            />
            <Image
              src="/images/paypal.png"
              width={46.5}
              height={30}
              className="cursor-pointer"
              alt="paypal"
            />
            <Image
              src="/images/apple-pay.png"
              width={46.5}
              height={30}
              className="cursor-pointer"
              alt="apple pay"
            />
            <Image
              src="/images/g-pay.png"
              width={46.5}
              height={30}
              className="cursor-pointer"
              alt="google pay"
            />
          </div>
        </div>
      </PublicAppContainer>
    </div>
  )
}

export default Footer
