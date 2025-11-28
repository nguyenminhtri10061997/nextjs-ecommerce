<?php

require_once get_template_directory() . '/includes/helpers.php';
$icon = my_theme_get_svg('email');
$iconTwitter = my_theme_get_svg('twitter');
$iconFb = my_theme_get_svg('fb');
$iconInsta = my_theme_get_svg('insta');
$iconGithub = my_theme_get_svg('github');
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
    <div class="w-full bg-[#F0F0F0] relative pt-[220px] sm:pt-[190px] lg:pt-[106px] pb-[116px]">
        <div class="w-full absolute top-[-90px]">
            <div class="my-theme-container">
                <div id='sub-form' class="bg-black rounded-[20px] py-[32px] md:py-[36px] px-[24px] md:px-[64px] flex flex-col md:flex-row justify-between gap-[22px] hover:scale-105">
                    <div class="text-white italic max-w-[551px] text-[32px] md:text-[40px] leading-[35px] md:leading-[45px]">
                        STAY UPTO DATE ABOUT OUR LATEST OFFERS
                    </div>
                    <form data-wp-interactive="myTheme/myFooter" data-wp-on--submit="actions.handleSubmitNewLetter" class="w-full md:w-[349px]">
                        <div class="bg-white rounded-[62px] flex items-center py-[12px] px-[16px] gap-[14px]">
                            <span class="text-black/60"><?php echo $icon ?></span>
                            <input
                                name="subscriber-email"
                                type="email"
                                required
                                class="w-full outline-0"
                                placeholder="Enter your email address" />
                        </div>
                        <button
                            type="submit"
                            class="mt-[14px] w-full rounded-[62px] text-center py-[12px] bg-white cursor-pointer hover:bg-gray-200">
                            Subscribe to Newsletter
                        </button>
                        <p
                            data-wp-text="state.resNewsLetter.message"
                            data-wp-class--text-yellow-500="state.isWarning"
                            data-wp-class--text-green-500="state.isSuccess"
                            data-wp-class--text-red-500="state.isError"
                            class="mt-2 absolute">
                            akdsfasljdf</p>
                    </form>
                </div>
            </div>
        </div>
        <div class="my-theme-container">
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-[81px] md:gap-x-[105px] gap-y-[8px]">
                <div class="w-full md:w-[248px] col-span-2 md:col-span-1">
                    <a href="/">
                        <img src="<?php echo esc_attr(get_theme_file_uri('/assets/img/SHOP.CO.png')) ?>" />
                    </a>
                    <p class="mt-[25px] text-[14px] text-black/60">
                        We have clothes that suits your style and which you’re proud to wear. From women to men.
                    </p>
                    <div class="mt-[35px] flex gap-[12px]">
                        <span class="bg-white rounded-full border border-black/10 flex items-center justify-center w-[28px] h-[28px]">
                            <?php echo $iconTwitter ?>
                        </span>
                        <span class="bg-white rounded-full border border-black/10 flex items-center justify-center w-[28px] h-[28px]">
                            <?php echo $iconFb ?>
                        </span>
                        <span class="bg-white rounded-full border border-black/10 flex items-center justify-center w-[28px] h-[28px]">
                            <?php echo $iconInsta ?>
                        </span>
                        <span class="bg-white rounded-full border border-black/10 flex items-center justify-center w-[28px] h-[28px] pt-[6px]">
                            <?php echo $iconGithub ?>
                        </span>
                    </div>
                </div>
                <div class="text-[14px] md:text-[16px]">
                    <div>COMPANY</div>
                    <div class="mt-[16px] md:mt-[26px] text-black/60">
                        <h3><a class="no-underline! cursor-pointer hover:opacity-80">About</a></h3>
                        <h3 class="mt-[10px]"><a class="no-underline! cursor-pointer hover:opacity-80 transition">Features</a></h3>
                        <h3 class="mt-[10px]"><a class="no-underline! cursor-pointer hover:opacity-80 transition">Works</a></h3>
                        <h3 class="mt-[10px]"><a class="no-underline! cursor-pointer hover:opacity-80 transition">Career</a></h3>
                    </div>
                </div>
                <div class="text-[14px] md:text-[16px]">
                    <div>HELP</div>
                    <div class="mt-[16px] md:mt-[26px] text-black/60">
                        <h3><a class="no-underline! cursor-pointer">Customer Support</a></h3>
                        <h3 class="mt-[10px]"><a class="no-underline! cursor-pointer hover:opacity-80 transition">Delivery Details</a></h3>
                        <h3 class="mt-[10px]"><a class="no-underline! cursor-pointer hover:opacity-80 transition">Terms & Conditions</a></h3>
                        <h3 class="mt-[10px]"><a class="no-underline! cursor-pointer hover:opacity-80 transition">Privacy Policy</a></h3>
                    </div>
                </div>
                <div class="text-[14px] md:text-[16px]">
                    <div>FAQ</div>
                    <div class="mt-[16px] md:mt-[26px] text-black/60">
                        <h3><a class="no-underline! cursor-pointer">Account</a></h3>
                        <h3 class="mt-[10px]"><a class="no-underline! cursor-pointer hover:opacity-80 transition">Manage Deliveries</a></h3>
                        <h3 class="mt-[10px]"><a class="no-underline! cursor-pointer hover:opacity-80 transition">Orders</a></h3>
                        <h3 class="mt-[10px]"><a class="no-underline! cursor-pointer hover:opacity-80 transition">Payments</a></h3>
                    </div>
                </div>
                <div class="text-[14px] md:text-[16px]">
                    <div>RESOURCE</div>
                    <div class="mt-[16px] md:mt-[26px] text-black/60">
                        <h3><a class="no-underline! cursor-pointer">Free eBooks</a></h3>
                        <h3 class="mt-[10px]"><a class="no-underline! cursor-pointer hover:opacity-80 transition">Development Tutorial</a></h3>
                        <h3 class="mt-[10px]"><a class="no-underline! cursor-pointer hover:opacity-80 transition">How to - Blog</a></h3>
                        <h3 class="mt-[10px]"><a class="no-underline! cursor-pointer hover:opacity-80 transition">Youtube Playlist</a></h3>
                    </div>
                </div>
            </div>

            <div class="h-[1px] bg-black/10 mt-[40px] md:mt-[50px]"></div>
            <div class="flex justify-center md:justify-between mt-[16px] md:mt-[20px] items-center flex-wrap">
                <div class="text-[14px] text-black/60">
                    Shop.co © 2000-2023, All Rights Reserved
                </div>
                <div class="flex justify-center">
                    <img src="<?php echo esc_attr(get_theme_file_uri('/assets/img/visa.png')) ?>" />
                    <img src="<?php echo esc_attr(get_theme_file_uri('/assets/img/master-card.png')) ?>" />
                    <img src="<?php echo esc_attr(get_theme_file_uri('/assets/img/paypal.png')) ?>" />
                    <img src="<?php echo esc_attr(get_theme_file_uri('/assets/img/apple-pay.png')) ?>" />
                    <img src="<?php echo esc_attr(get_theme_file_uri('/assets/img/g-pay.png')) ?>" />
                </div>
            </div>
        </div>
    </div>
</div>