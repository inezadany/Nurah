/* ══════════════════════════════════════════════════════════════
   FOR NURAH — interactions
   Everything is progressive: the page reads fine without JS.
   ══════════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  const CONFIG = Object.assign(
    {
      web3formsAccessKey: "",
      email: "inezabyishimod@gmail.com",
      senderName: "Dany"
    },
    window.NURAH_CONFIG || {}
  );

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ── Footer year ───────────────────────────────────────────── */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ── Toast ─────────────────────────────────────────────────── */
  const toast = $("#toast");
  let toastTimer = null;

  function showToast(message, duration = 3200) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), duration);
  }

  /* ── Heart confetti ────────────────────────────────────────── */
  const heartColors = ["#ff7a9c", "#ffb2c4", "#e9c39a", "#cf466d", "#ffe1c8"];

  function heartBurst(x, y, count = 10) {
    if (reduceMotion) return;

    const layer = document.createElement("div");
    layer.className = "confetti-layer";
    layer.style.left = `${x}px`;
    layer.style.top = `${y}px`;
    document.body.appendChild(layer);

    for (let i = 0; i < count; i += 1) {
      const heart = document.createElement("span");
      heart.className = "confetti-heart";
      heart.textContent = Math.random() > 0.22 ? "♥" : "♡";
      heart.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
      heart.style.fontSize = `${8 + Math.random() * 13}px`;
      heart.style.left = `${(Math.random() - 0.5) * 22}px`;
      heart.style.top = `${(Math.random() - 0.5) * 12}px`;
      layer.appendChild(heart);

      const drift = (Math.random() - 0.5) * 190;
      const peak = -(35 + Math.random() * 115);
      const fall = 45 + Math.random() * 105;
      const rotation = (Math.random() - 0.5) * 220;
      const scale = 0.75 + Math.random() * 0.75;

      const animation = heart.animate(
        [
          {
            transform: "translate(-50%, -50%) scale(0.35) rotate(0deg)",
            opacity: 1,
            offset: 0
          },
          {
            transform: `translate(calc(-50% + ${drift * 0.72}px), calc(-50% + ${peak}px)) scale(${scale}) rotate(${rotation * 0.55}deg)`,
            opacity: 1,
            offset: 0.45
          },
          {
            transform: `translate(calc(-50% + ${drift}px), calc(-50% + ${fall}px)) scale(0.35) rotate(${rotation}deg)`,
            opacity: 0,
            offset: 1
          }
        ],
        {
          duration: 900 + Math.random() * 600,
          easing: "cubic-bezier(0.16, 0.8, 0.3, 1)"
        }
      );

      animation.onfinish = () => heart.remove();
    }

    window.setTimeout(() => layer.remove(), 1800);
  }

  $$("[data-heart-burst]").forEach((element) => {
    element.addEventListener("click", () => {
      const rect = element.getBoundingClientRect();
      heartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
    });
  });

  /* ── Header, scroll progress & active nav ──────────────────── */
  const header = $("#siteHeader");
  const scrollBar = $("#scrollBar");
  const navLinks = $$(".nav-link");
  const sections = navLinks
    .map((link) => link.getAttribute("href"))
    .filter((href) => href && href.startsWith("#") && href.length > 1)
    .map((href) => document.getElementById(href.slice(1)))
    .filter(Boolean)
    .filter((section, index, array) => array.indexOf(section) === index);

  let scrollTicking = false;

  function updateScrollUI() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;

    if (header) header.classList.toggle("is-scrolled", scrollTop > 36);
    if (scrollBar) {
      const progress = scrollable > 0 ? clamp((scrollTop / scrollable) * 100, 0, 100) : 0;
      scrollBar.style.width = `${progress}%`;
    }

    if (sections.length) {
      const marker = scrollTop + window.innerHeight * 0.35;
      let activeId = "";

      sections.forEach((section) => {
        if (section.offsetTop <= marker) activeId = section.id;
      });

      if (scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        activeId = sections[sections.length - 1].id;
      }

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", activeId !== "" && link.getAttribute("href") === `#${activeId}`);
      });
    }

    scrollTicking = false;
  }

  function requestScrollUpdate() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateScrollUI);
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
  window.addEventListener("resize", () => {
    if (window.innerWidth > 880 && menuOpen) closeMenu(false);
  });
  updateScrollUI();

  /* ── Mobile navigation ─────────────────────────────────────── */
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");
  let menuOpen = false;

  function openMenu() {
    if (!navMenu || !navToggle) return;
    menuOpen = true;
    navMenu.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("nav-open");

    window.setTimeout(() => {
      const firstLink = navMenu.querySelector("a");
      if (firstLink) firstLink.focus();
    }, reduceMotion ? 0 : 320);
  }

  function closeMenu(returnFocus = true) {
    if (!navMenu || !navToggle) return;
    menuOpen = false;
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("nav-open");

    if (returnFocus) navToggle.focus({ preventScroll: true });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      if (menuOpen) closeMenu();
      else openMenu();
    });

    navMenu.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuOpen) closeMenu();
    });
  }

  /* ── Scroll reveals ────────────────────────────────────────── */
  const revealElements = $$("[data-reveal]");

  if (revealElements.length) {
    if (!("IntersectionObserver" in window) || reduceMotion) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );

      revealElements.forEach((element) => revealObserver.observe(element));
    }

    // Safety net: if a fast scroll skips an observer callback, reveal anything
    // that has moved above the viewport instead of leaving it invisible.
    if (!reduceMotion && "IntersectionObserver" in window) {
      const revealPassed = () => {
        const threshold = window.innerHeight * 0.92;
        revealElements.forEach((element) => {
          if (element.classList.contains("is-visible")) return;
          if (element.getBoundingClientRect().top < threshold) {
            element.classList.add("is-visible");
          }
        });
      };

      window.addEventListener("scroll", revealPassed, { passive: true });
      window.addEventListener("load", () => window.setTimeout(revealPassed, 400));
    }
  }

  /* ── Hero cursor glow ──────────────────────────────────────── */
  const hero = $(".hero");
  if (hero && finePointer && !reduceMotion) {
    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      hero.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  }

  /* ── 3D tilt on photos & cards ─────────────────────────────── */
  if (finePointer && !reduceMotion) {
    $$("[data-tilt]").forEach((element) => {
      const resetTilt = () => {
        element.style.setProperty("--rx", "0deg");
        element.style.setProperty("--ry", "0deg");
      };

      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        element.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
        element.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
      });

      element.addEventListener("pointerleave", resetTilt);
      element.addEventListener("pointercancel", resetTilt);
    });
  }

  /* ── Floating hearts in the hero ───────────────────────────── */
  const heroCanvas = $("#petalCanvas");
  if (heroCanvas && hero && !reduceMotion) {
    const context = heroCanvas.getContext("2d");
    const colors = ["#ff7a9c", "#e9c39a", "#ffb2c4", "#d96f8f"];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];
    let width = 0;
    let height = 0;
    let animationFrame = null;
    let isVisible = true;

    function heartPath(ctx, size) {
      const scale = size / 16;
      ctx.beginPath();
      ctx.moveTo(0, 4.4 * scale);
      ctx.bezierCurveTo(-9 * scale, -3 * scale, -9 * scale, -11 * scale, -3.5 * scale, -11 * scale);
      ctx.bezierCurveTo(-1 * scale, -11 * scale, 0, -8.6 * scale, 0, -7.6 * scale);
      ctx.bezierCurveTo(0, -8.6 * scale, 1 * scale, -11 * scale, 3.5 * scale, -11 * scale);
      ctx.bezierCurveTo(9 * scale, -11 * scale, 9 * scale, -3 * scale, 0, 4.4 * scale);
      ctx.closePath();
    }

    function spawnParticle(randomY = false) {
      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : height + 30,
        size: 4 + Math.random() * 10,
        speedY: 0.18 + Math.random() * 0.45,
        speedX: (Math.random() - 0.5) * 0.22,
        sway: 0.25 + Math.random() * 0.75,
        phase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        alpha: 0.2 + Math.random() * 0.38,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    }

    function resizeCanvas() {
      const rect = hero.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      heroCanvas.width = Math.round(width * dpr);
      heroCanvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = width < 700 ? 12 : 24;
      particles = Array.from({ length: count }, () => spawnParticle(true));
    }

    function draw() {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        particle.phase += 0.008;
        particle.y -= particle.speedY;
        particle.x += particle.speedX + Math.sin(particle.phase) * particle.sway * 0.25;
        particle.rotation += particle.rotationSpeed;

        if (particle.y < -40 || particle.x < -60 || particle.x > width + 60) {
          particles[index] = spawnParticle(false);
          return;
        }

        context.save();
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.globalAlpha = particle.alpha;
        context.fillStyle = particle.color;
        heartPath(context, particle.size);
        context.fill();
        context.restore();
      });

      context.globalAlpha = 1;
    }

    function startCanvas() {
      if (animationFrame !== null || document.hidden) return;
      animationFrame = window.requestAnimationFrame(function tick() {
        draw();
        animationFrame = window.requestAnimationFrame(tick);
      });
    }

    function stopCanvas() {
      if (animationFrame === null) return;
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    resizeCanvas();
    startCanvas();

    let resizeTimer = null;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resizeCanvas, 180);
    });

    if ("IntersectionObserver" in window) {
      const canvasObserver = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) startCanvas();
          else stopCanvas();
        },
        { threshold: 0 }
      );
      canvasObserver.observe(hero);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopCanvas();
      else if (isVisible) startCanvas();
    });
  }

  /* ── Photo gallery + lightbox ──────────────────────────────── */
  const galleryItems = $$(".gallery-item");
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxCaption = $("#lightboxCaption");
  const photoCount = $("#photoCount");
  let currentPhoto = 0;

  function renderPhoto(index) {
    if (!galleryItems.length || !lightboxImg) return;
    currentPhoto = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentPhoto];

    lightboxImg.src = item.dataset.src || "";
    lightboxImg.alt = item.dataset.alt || "A photo of Nurah";
    if (lightboxCaption) lightboxCaption.textContent = item.dataset.caption || "";
    if (photoCount) {
      photoCount.textContent = `${currentPhoto + 1} / ${galleryItems.length}`;
    }
  }

  function openLightbox(index) {
    if (!lightbox) return;
    renderPhoto(index);
    if (!lightbox.open) lightbox.showModal();
  }

  if (lightbox) {
    galleryItems.forEach((item, index) => {
      item.addEventListener("click", () => openLightbox(index));
    });

    const lightboxClose = $("#lightboxClose");
    const prevPhoto = $("#prevPhoto");
    const nextPhoto = $("#nextPhoto");

    if (lightboxClose) lightboxClose.addEventListener("click", () => lightbox.close());
    if (prevPhoto) prevPhoto.addEventListener("click", () => renderPhoto(currentPhoto - 1));
    if (nextPhoto) nextPhoto.addEventListener("click", () => renderPhoto(currentPhoto + 1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });

    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        renderPhoto(currentPhoto - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        renderPhoto(currentPhoto + 1);
      }
    });

    let touchStartX = null;
    lightbox.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") touchStartX = event.clientX;
    });
    lightbox.addEventListener("pointerup", (event) => {
      if (touchStartX === null) return;
      const delta = event.clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(delta) < 50) return;
      if (delta > 0) renderPhoto(currentPhoto - 1);
      else renderPhoto(currentPhoto + 1);
    });
  }

  /* ── Reason deck ───────────────────────────────────────────── */
  const reasons = [
    "The way your whole face gets involved when you smile.",
    "Your laugh — especially the one you try to hide.",
    "How you make a hairnet look like a crown.",
    "The little nose scrunch you do without noticing.",
    "How deeply you care about the people you love.",
    "Your \u201cI\u2019m fine\u201d that has never once fooled me.",
    "The way you look in the mirror when you think no one\u2019s watching.",
    "Your patience with me, even when I don\u2019t deserve it.",
    "Your honesty, even when it\u2019s not the easy answer.",
    "The way you fight for the people you love.",
    "Your dreams — and the way you\u2019re actually chasing them.",
    "The fact that you exist at all.",
    "And because a list could never be long enough."
  ];

  const reasonText = $("#reasonText");
  const reasonIndex = $("#reasonIndex");
  const nextReason = $("#nextReason");
  const reasonCard = $("#reasonCard");
  let reasonDraws = 1;
  let lastReason = 0;

  if (reasonText && reasonIndex && nextReason) {
    nextReason.addEventListener("click", () => {
      let index = lastReason;
      while (index === lastReason && reasons.length > 1) {
        index = Math.floor(Math.random() * reasons.length);
      }

      lastReason = index;
      reasonDraws += 1;
      reasonText.textContent = reasons[index];
      reasonIndex.textContent = String(reasonDraws).padStart(2, "0");

      if (!reduceMotion && reasonText.animate) {
        reasonText.animate(
          [
            { opacity: 0, transform: "translateY(14px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          { duration: 480, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
        );
      }

      if (reasonCard && !reduceMotion) {
        const rect = reasonCard.getBoundingClientRect();
        heartBurst(rect.left + rect.width * 0.82, rect.top + rect.height * 0.25, 6);
      }
    });
  }

  /* ── Love meter ────────────────────────────────────────────── */
  const loveHold = $("#loveHold");
  const holdWord = $("#holdWord");
  const loveBar = $("#loveBar");
  const loveReadout = $("#loveReadout");

  if (loveHold && holdWord && loveBar && loveReadout) {
    const HOLD_TIME = 2200;
    const TICK = 50;
    let fill = 0;
    let completed = false;
    let holdTimer = null;
    let decayTimer = null;

    function readMeter() {
      if (completed) return "∞% — told you. There is no measuring it.";
      if (fill < 2) return "0% — go on, try me.";
      if (fill < 30) return "keep holding…";
      if (fill < 55) return "hm. barely scratching the surface.";
      if (fill < 80) return "okay, that\u2019s a lot of love.";
      return "almost there… don\u2019t let go.";
    }

    function paintMeter() {
      fill = clamp(fill, 0, 100);
      loveHold.style.setProperty("--fill", fill.toFixed(1));
      loveBar.style.width = `${fill}%`;
      const message = readMeter();
      if (loveReadout.textContent !== message) loveReadout.textContent = message;
    }

    function stopDecay() {
      if (decayTimer === null) return;
      window.clearInterval(decayTimer);
      decayTimer = null;
    }

    function completeMeter() {
      completed = true;
      fill = 100;
      window.clearInterval(holdTimer);
      holdTimer = null;
      stopDecay();
      loveHold.classList.remove("is-holding");
      loveHold.classList.add("is-complete");
      holdWord.textContent = "∞";
      paintMeter();

      const rect = loveHold.getBoundingClientRect();
      heartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 26);
      showToast("You broke the love meter. It\u2019s infinite. ♥", 3600);
    }

    function beginHold() {
      if (completed) {
        const rect = loveHold.getBoundingClientRect();
        heartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
        showToast("Still infinite. Still yours. ♥");
        return;
      }

      stopDecay();
      if (holdTimer !== null) return;

      loveHold.classList.add("is-holding");
      holdTimer = window.setInterval(() => {
        fill += 100 / (HOLD_TIME / TICK);
        paintMeter();
        if (fill >= 100) completeMeter();
      }, TICK);
    }

    function endHold() {
      if (holdTimer !== null) {
        window.clearInterval(holdTimer);
        holdTimer = null;
      }

      loveHold.classList.remove("is-holding");
      if (completed || fill <= 0) return;

      stopDecay();
      decayTimer = window.setInterval(() => {
        fill -= 1.3;
        if (fill <= 0) {
          fill = 0;
          stopDecay();
        }
        paintMeter();
      }, 40);
    }

    loveHold.addEventListener("pointerdown", () => {
      beginHold();
    });
    loveHold.addEventListener("pointerup", endHold);
    loveHold.addEventListener("pointercancel", endHold);
    loveHold.addEventListener("pointerleave", endHold);

    loveHold.addEventListener("keydown", (event) => {
      if ((event.key === " " || event.key === "Enter") && !event.repeat) {
        event.preventDefault();
        beginHold();
      }
    });

    loveHold.addEventListener("keyup", (event) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        endHold();
      }
    });

    loveHold.addEventListener("blur", endHold);
    paintMeter();
  }

  /* ── Envelope → letter dialog ──────────────────────────────── */
  const envelope = $("#openLetter");
  const letterDialog = $("#letterDialog");
  const letterPaper = $(".letter-paper");
  let letterOpening = false;

  function openLetter() {
    if (!envelope || !letterDialog || letterOpening || letterDialog.open) return;
    letterOpening = true;
    envelope.classList.add("is-open");
    envelope.setAttribute("aria-expanded", "true");

    window.setTimeout(() => {
      if (letterPaper) letterPaper.scrollTop = 0;
      if (!letterDialog.open) letterDialog.showModal();
      if (letterPaper) letterPaper.focus({ preventScroll: true });
      letterOpening = false;
    }, reduceMotion ? 0 : 720);
  }

  if (envelope && letterDialog) {
    envelope.addEventListener("click", openLetter);

    const letterClose = $("#letterClose");
    if (letterClose) letterClose.addEventListener("click", () => letterDialog.close());
    $$("[data-close-letter]").forEach((button) =>
      button.addEventListener("click", () => letterDialog.close())
    );

    letterDialog.addEventListener("click", (event) => {
      if (event.target === letterDialog) letterDialog.close();
    });

    letterDialog.addEventListener("close", () => {
      envelope.classList.remove("is-open");
      envelope.setAttribute("aria-expanded", "false");
      envelope.focus({ preventScroll: true });
    });
  }

  /* ── Footer secret ─────────────────────────────────────────── */
  const secretHeart = $("#secretHeart");
  const secretDialog = $("#secretDialog");
  const secretClose = $("#secretClose");
  let secretTaps = 0;
  let secretTimer = null;

  if (secretHeart && secretDialog) {
    secretHeart.addEventListener("click", () => {
      const rect = secretHeart.getBoundingClientRect();
      heartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 5);

      secretTaps += 1;
      window.clearTimeout(secretTimer);
      secretTimer = window.setTimeout(() => {
        secretTaps = 0;
      }, 2400);

      if (secretTaps >= 5) {
        secretTaps = 0;
        window.clearTimeout(secretTimer);
        if (!secretDialog.open) secretDialog.showModal();
        const dialogRect = secretDialog.getBoundingClientRect();
        heartBurst(
          dialogRect.left + dialogRect.width / 2,
          dialogRect.top + dialogRect.height / 2,
          30
        );
      }
    });

    if (secretClose) secretClose.addEventListener("click", () => secretDialog.close());
    secretDialog.addEventListener("click", (event) => {
      if (event.target === secretDialog) secretDialog.close();
    });
  }

  /* ── Love note form ────────────────────────────────────────── */
  const form = $("#loveForm");
  const formStatus = $("#formStatus");
  const messageField = $("#message");
  const charCount = $("#charCount");
  const sendBtn = $("#sendBtn");
  const successCard = $("#formSuccess");
  const writeAnother = $("#writeAnother");

  function buildMailto(name, email, mood, message) {
    const subject = `A love note from ${name || "your favorite person"} 💌`;
    const body = [
      mood ? `Mood: ${mood}` : "",
      message,
      "",
      `— ${name || "Anonymous"}`,
      email || ""
    ]
      .filter(Boolean)
      .join("\n");

    return `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function updateCharCount() {
    if (!messageField || !charCount) return;
    charCount.textContent = `${messageField.value.length} / ${messageField.maxLength}`;
  }

  if (messageField) {
    messageField.addEventListener("input", updateCharCount);
    updateCharCount();
  }

  function setSending(isSending) {
    if (!sendBtn) return;
    sendBtn.disabled = isSending;
    sendBtn.classList.toggle("is-loading", isSending);
    const label = sendBtn.querySelector(".btn-label");
    if (label) label.textContent = isSending ? "sending…" : "send it to my heart";
  }

  function showSuccess() {
    if (!form || !successCard) return;
    form.hidden = true;
    successCard.hidden = false;
    if (formStatus) {
      formStatus.textContent = "";
      formStatus.className = "form-status";
    }

    const rect = successCard.getBoundingClientRect();
    heartBurst(rect.left + rect.width / 2, rect.top + rect.height * 0.3, 22);
    successCard.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center"
    });
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (formStatus) {
        formStatus.textContent = "";
        formStatus.className = "form-status";
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const mood = String(data.get("mood") || "").trim();
      const message = String(data.get("message") || "").trim();
      const honeypot = data.get("botcheck");

      if (honeypot) {
        showSuccess();
        return;
      }

      if (!name || !message) {
        if (formStatus) {
          formStatus.textContent = "I need a name and a few words first. ♥";
          formStatus.classList.add("is-error");
        }
        return;
      }

      const accessKey = String(CONFIG.web3formsAccessKey || "").trim();
      const hasKey = accessKey.length >= 20 && !/paste|your[-_ ]?key/i.test(accessKey);
      const mailto = buildMailto(name, email, mood, message);

      if (!hasKey) {
        if (formStatus) {
          formStatus.innerHTML = `The direct line isn\u2019t switched on yet, but you can <a href="${mailto}">send this straight to my inbox</a>.`;
        }
        window.location.href = mailto;
        return;
      }

      const subject = `A love note from ${name} 💌`;
      const payload = {
        access_key: accessKey,
        subject,
        from_name: name,
        name,
        mood: mood || "No mood picked",
        message,
        botcheck: ""
      };

      if (email) {
        payload.email = email;
        payload.replyto = email;
      }

      setSending(true);

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "The message could not be sent.");
        }

        form.reset();
        updateCharCount();
        showSuccess();
      } catch (error) {
        console.error("Web3Forms error:", error);
        if (formStatus) {
          formStatus.innerHTML = `The love line glitched. Please try again, or <a href="${mailto}">send it straight to my inbox</a>.`;
          formStatus.classList.add("is-error");
        }
      } finally {
        setSending(false);
      }
    });
  }

  if (writeAnother) {
    writeAnother.addEventListener("click", () => {
      if (!form || !successCard) return;
      successCard.hidden = true;
      form.hidden = false;
      form.reset();
      updateCharCount();
      const nameField = $("#senderName");
      if (nameField) nameField.focus({ preventScroll: true });
    });
  }

  /* ── A tiny note for whoever opens the console ─────────────── */
  console.log(
    "%cFor Nurah ♥",
    "color:#ff7a9c;font-family:Georgia,serif;font-size:24px;font-weight:700;"
  );
  console.log(
    "%cIf you're reading this, I love you. — I",
    "color:#e9c39a;font-family:Georgia,serif;font-size:14px;"
  );
})();
