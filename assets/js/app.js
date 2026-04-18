$(function () {
    const header = $("#header");
    const intro = $("#intro");
    const nav = $("#nav");
    const navToggle = $("#nav_toggle");
    const navLinks = nav.find("[data-scroll]");
    const sections = $("#about, #services, #blog, #works, #footer");

    let introH = intro.innerHeight();
    let scrollOffset = $(window).scrollTop();

    function getHeaderOffset() {
        return header.outerHeight() || 0;
    }

    function setActiveLink(targetId) {
        navLinks.removeClass("active");

        if (!targetId) {
            return;
        }

        navLinks.filter(`[data-scroll="${targetId}"]`).addClass("active");
    }

    function updateActiveLinkByScroll() {
        const threshold = $(window).scrollTop() + getHeaderOffset() + 20;
        let activeId = "";

        sections.each(function () {
            const $section = $(this);

            if (threshold >= $section.offset().top) {
                activeId = `#${$section.attr("id")}`;
            }
        });

        setActiveLink(activeId);
    }

    function updateFixedHeader() {
        if (scrollOffset >= introH) {
            header.addClass("fixed");
        } else {
            header.removeClass("fixed");
        }
    }

    function closeMobileNav() {
        nav.removeClass("active");
        header.removeClass("active");
        navToggle.removeClass("active")
            .attr("aria-expanded", "false")
            .attr("aria-label", "Open menu");
    }

    function syncHeaderState() {
        scrollOffset = $(window).scrollTop();
        introH = intro.innerHeight();
        updateFixedHeader();
        updateActiveLinkByScroll();
    }

    syncHeaderState();

    $(window).on("scroll", function () {
        scrollOffset = $(this).scrollTop();
        updateFixedHeader();
        updateActiveLinkByScroll();
    });

    $(window).on("resize", function () {
        if ($(this).width() > 770) {
            closeMobileNav();
        }

        syncHeaderState();
    });

    $("[data-scroll]").on("click", function (event) {
        const $this = $(this);
        const blockId = $this.data("scroll");
        const $block = $(blockId);

        if (!$block.length) {
            return;
        }

        event.preventDefault();

        const blockOffset = Math.max($block.offset().top - getHeaderOffset(), 0);

        setActiveLink(blockId);
        $("html, body").stop().animate({
            scrollTop: blockOffset
        }, 500);

        closeMobileNav();
    });

    navToggle.on("click", function () {
        const isOpen = !$(this).hasClass("active");

        $(this).toggleClass("active")
            .attr("aria-expanded", String(isOpen))
            .attr("aria-label", isOpen ? "Close menu" : "Open menu");
        nav.toggleClass("active");
        header.toggleClass("active", isOpen);
    });

    navLinks.on("click", function () {
        if (nav.hasClass("active")) {
            closeMobileNav();
        }
    });

    $("[data-collapse]").on("click", function () {
        const $trigger = $(this);
        const targetId = $trigger.data("collapse");
        const $item = $trigger.closest(".accordion__item");
        const $accordion = $trigger.closest(".accordion");
        const isOpen = $item.hasClass("active");

        $accordion.find(".accordion__item").not($item).removeClass("active").find(".accordion__header").attr("aria-expanded", "false");
        $accordion.find(".accordion__item").not($item).find(".accordion__content").stop(true, true).slideUp(200);

        if (isOpen) {
            $item.removeClass("active");
            $item.find(".accordion__header").attr("aria-expanded", "false");
            $item.find(targetId).stop(true, true).slideUp(200);
        } else {
            $item.addClass("active");
            $item.find(".accordion__header").attr("aria-expanded", "true");
            $item.find(targetId).stop(true, true).slideDown(200);
        }
    });

    $("[data-slider]").slick({
        infinite: true,
        fade: false,
        slidesToShow: 1,
        slidesToScroll: 1
    });

    $(".subscribe").on("submit", function (event) {
        event.preventDefault();
        this.reset();
    });
});
