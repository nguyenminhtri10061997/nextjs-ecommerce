import Link from "next/link"
import TopAdBanner from "./TopAdBanner"
import { TReturnOfGetDictionary } from "@/app/[lang]/dictionaries"

type HeaderProps = {
  dict: TReturnOfGetDictionary
}

export default function Header({ dict }: HeaderProps) {

  return (
    <header>
      <TopAdBanner dict={dict} />
      <div>
        <div className="my-[23px] md:my-[24px]">
          <div className="my-theme-container flex items-center justify-between gap-[40px]">
            <div className="flex items-center gap-[16px] md:gap-[40px]">
              <Link href="/">LOGO</Link>
              <div
                className="relative -order-1 md:order-1"
                data-wp-interactive="myTheme/my-header-menu"
              >
                <button
                  id="btnMenu"
                  className="md:hidden cursor-pointer"
                  data-wp-on-async--click="actions.handleToggleMenu"
                >
                  <span data-wp-class--hidden="state.isOpenMenu">
                    icon Menu
                  </span>
                  <span
                    data-wp-class--hidden="!state.isOpenMenu"
                    className="hidden"
                  >
                    XIcon
                  </span>
                </button>
                <ul id="menu-ul" className="my-menu-idle gap-[24px]">
                  <li>
                    <a
                      href="<?php echo esc_url($shop_page_url); ?>"
                      className="no-underline! block"
                    >
                      Shop
                    </a>
                  </li>
                  <li>
                    <a href="#" className="no-underline! block">
                      On Sale
                    </a>
                  </li>
                  <li>
                    <a
                      href="<?php echo esc_url($new_arrival_url); ?>"
                      className="no-underline!"
                    >
                      New Arrivals
                    </a>
                  </li>
                  <li>
                    <a href="#" className="no-underline! block">
                      Brands
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grow flex item-center gap-[16px] md:gap-[40px]">
              <div
                data-wp-interactive="myTheme/my-search"
                className="grow flex items-center"
              >
                <a
                  data-wp-on-async--click="actions.handleClickSearch"
                  data-search-link="<?php echo esc_url(get_search_link()); ?>"
                  className="md:hidden cursor-pointer"
                >
                  icon Search
                </a>
                <div className="hidden md:flex w-full bg-[#F0F0F0] py-[13px] px-[17.86px] rounded-[62px] relative">
                  <div className="flex w-full">
                    <a
                      data-wp-on-async--click="actions.handleClickSearch"
                      data-search-link="<?php echo esc_url(get_search_link()); ?>"
                      className="cursor-pointer"
                    >
                      icon Search
                    </a>
                    <input
                      placeholder="Search for products..."
                      className="outline-0 ml-3 w-full"
                      data-wp-on-async--input="actions.onInputSearchProduct"
                      data-wp-on-async--focusin="actions.focusIn"
                      data-wp-on-async--focusout="actions.focusOut"
                    />
                  </div>
                  <div
                    id="my-search-product-result"
                    className="hidden absolute left-0 bg-white border border-black/10 w-full top-14 rounded-md z-10 overflow-y-auto max-h-[80vh]"
                  >
                    <template data-wp-each="state.products">
                      <li
                        className="hidden mt-1 py-1 transition hover:bg-black/20 group rounded-2xl"
                        data-wp-key=" context.item.id"
                      >
                        <a
                          data-wp-bind--href="context.item.permalink"
                          className="flex gap-2 no-underline! w-full"
                        >
                          <img
                            data-wp-bind--src="context.item.image"
                            className="rounded-2xl p-2"
                            width="75px"
                            height="75px"
                          />
                          <div className="flex flex-col justify-between py-2">
                            <span
                              data-wp-text="context.item.name"
                              className="no-underline transition group-hover:skew-x-12 group-hover:scale-110 group-hover:translate-x-1.5"
                            ></span>
                            <span
                              data-wp-watch="callbacks.renderShortDesc"
                              className="text-black/40"
                            ></span>
                          </div>
                        </a>
                      </li>
                      <div
                        data-wp-bind--hidden="context.item.isLastItem"
                        className="w-1/2 mx-auto border-b border-gray-300 my-2.5"
                      ></div>
                    </template>
                    <div
                      data-wp-bind--hidden="!state.isRenderNotFound"
                      className="p-5"
                    >
                      NOT FOUND
                    </div>
                    <div
                      data-wp-bind--hidden="!state.isLoading"
                      className="flex items-center justify-center h-screen"
                    >
                      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-[16px]">
                cart
                <a href="<?php echo esc_attr(wc_get_page_permalink('myaccount')); ?>">
                  account
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
