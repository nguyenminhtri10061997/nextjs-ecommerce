import PublicAppContainer from "@/components/customComponents/PublicAppContainer"
import logo from "@public/images/SHOP.CO.png"
import CartIcon from "@public/svg/cart.svg"
import SearchIcon from "@public/svg/search.svg"
import UserIcon from "@public/svg/user.svg"
import Image from "next/image"
import Link from "next/link"
import MenuToggle from "../menuToggle"
import SearchProduct from "../searchProduct"

export default function MainHeader() {
  return (
    <PublicAppContainer>
      <div className="my-[23px] md:my-[24px]">
        <div className="my-theme-container flex items-center justify-between gap-[40px]">
          <div className="flex items-center gap-[16px] md:gap-[40px]">
            <Link href="/">
              <Image
                alt="LOGO"
                src={logo}
                className="w-[7.875rem] h-[1.375rem]"
              />
            </Link>
            <div className="relative -order-1 md:order-1">
              <MenuToggle />
              <ul id="menu-ul" className="hidden md:flex gap-[24px]">
                <li>
                  <Link
                    href="#"
                    className="w-full h-full block hover:opacity-75"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="w-full h-full block hover:opacity-75"
                  >
                    On Sale
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="w-full h-full block hover:opacity-75"
                  >
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="w-full h-full block hover:opacity-75"
                  >
                    Brands
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="md:grow flex item-center gap-[16px] md:gap-[40px]">
            <SearchProduct />
            <div className="flex items-center gap-[16px]">
              <Link href="/cart" className="md:hidden text-black">
                <SearchIcon width="20.27" height="20.27" />
              </Link>
              <Link href="/cart">
                <CartIcon />
              </Link>
              <Link href="/account">
                <UserIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicAppContainer>
  )
}
