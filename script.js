      /* =========================
    MOBILE MENU
  ========================= */
      document.addEventListener("DOMContentLoaded", () => {
        const btn = document.getElementById("menuBtn");
        const menu = document.getElementById("mobileMenu");
        let isOpen = false;

        if (btn && menu) {
          btn.addEventListener("click", () => {
            isOpen = !isOpen;
            menu.classList.toggle("opacity-100", isOpen);
            menu.classList.toggle("translate-y-0", isOpen);
            menu.classList.toggle("opacity-0", !isOpen);
            menu.classList.toggle("-translate-y-4", !isOpen);
            menu.classList.toggle("pointer-events-none", !isOpen);
            btn.classList.toggle("menu-open", isOpen);
          });

          menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
              isOpen = false;
              menu.classList.add(
                "opacity-0",
                "-translate-y-4",
                "pointer-events-none",
              );
              menu.classList.remove("opacity-100", "translate-y-0");
              btn.classList.remove("menu-open");
            });
          });
        }
      });

      /* =========================
    FLOATING DOTS
  ========================= */
      const fx = document.getElementById("fx");
      for (let i = 0; i < 50; i++) {
        const d = document.createElement("div");
        d.className = "float-dot";
        d.style.left = Math.random() * 100 + "vw";
        d.style.animationDuration = Math.random() * 10 + 5 + "s";
        fx.appendChild(d);
      }

      /* =========================
    CURSOR CORE
  ========================= */
      const cursor = document.getElementById("custom-cursor");
      const path = document.getElementById("cursor-path");

      let mouseX = 0,
        mouseY = 0;
      let currentX = 0,
        currentY = 0;

      let targetEl = null;
      let rect = null;

      /* tuning */
      const MAGNET_RADIUS = 120;
      const MAGNET_STRENGTH = 0.22;
      const FOLLOW_SMOOTH = 0.12;
      const SNAP_SMOOTH = 0.18;

      /* paths */
      const heartPath =
        "M12 21 C9 18,5 15,5 11 C5 7,8 5,12 8 C16 5,19 7,19 11 C19 15,15 18,12 21 Z";

      const squarePath =
        "M12 21 C8 21,5 18,5 14 C5 10,5 8,5 5 C8 5,10 5,14 5 C18 5,19 8,19 14 C19 18,18 21,12 21 Z";

      /* mouse tracking */
      document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      /* gooey morph */
      function liquidMorph(toPath) {
        path.setAttribute("d", toPath);
      }

      /* animation loop */
      function animate() {
        let tx = mouseX;
        let ty = mouseY;

        if (targetEl) {
          rect = targetEl.getBoundingClientRect();

          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;

          const dx = cx - mouseX;
          const dy = cy - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAGNET_RADIUS) {
            const t = 1 - dist / MAGNET_RADIUS;
            const force = t * t * MAGNET_STRENGTH * 2;

            tx = mouseX + dx * force;
            ty = mouseY + dy * force;
          }
        }

        const smooth = targetEl ? SNAP_SMOOTH : FOLLOW_SMOOTH;

        currentX += (tx - currentX) * smooth;
        currentY += (ty - currentY) * smooth;

        /* align to heart tip */
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

        requestAnimationFrame(animate);
      }
      animate();

      /* =========================
    HOVER DETECTION (NO FLICKER)
  ========================= */
      const interactive = "a, button, input, textarea, select";

      document.querySelectorAll(interactive).forEach((el) => {
        el.addEventListener("mouseenter", () => {
          targetEl = el;
          cursor.classList.add("is-hovering");
          liquidMorph(squarePath);
        });

        el.addEventListener("mouseleave", () => {
          targetEl = null;
          rect = null;
          cursor.classList.remove("is-hovering");
          liquidMorph(heartPath);
        });
      });

      const track = document.getElementById("certTrack");
      const next = document.getElementById("certNext");
      const prev = document.getElementById("certPrev");
      const dots = document.querySelectorAll("#certDots span");

      let index = 0;
      const total = track.children.length;

      function updateCarousel() {
        const slideWidth = track.children[0].offsetWidth + 24; // includes gap
        currentTranslate =
          -(index * slideWidth) + (track.offsetWidth - slideWidth) / 2;

        prevTranslate = currentTranslate;

        track.style.transition = "transform 0.7s cubic-bezier(0.22,1,0.36,1)";
        track.style.transform = `translateX(${currentTranslate}px)`;

        // ACTIVE STATE
        [...track.children].forEach((slide, i) => {
          slide.classList.toggle("active", i === index);
        });

        // DOTS
        dots.forEach((d, i) => {
          d.classList.toggle("bg-pink-400", i === index);
          d.classList.toggle("bg-white/20", i !== index);
          d.classList.toggle("w-6", i === index);
          d.classList.toggle("w-2", i !== index);
        });
      }

      next.addEventListener("click", () => {
        index = (index + 1) % total;
        updateCarousel();
      });

      prev.addEventListener("click", () => {
        index = (index - 1 + total) % total;
        updateCarousel();
      });
      AOS.init({
        duration: 900,
        easing: "ease-out-cubic",
        once: true,
        offset: 80,
      });

      /* =========================
    GLITCH ON SCROLL
  ========================= */
      const glitchEls = document.querySelectorAll(".glitch");

      const glitchObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;

              el.classList.add("active");

              // remove after animation so it can retrigger later
              setTimeout(() => {
                el.classList.remove("active");
              }, 400);
            }
          });
        },
        {
          threshold: 0.2,
        },
      );

      glitchEls.forEach((el) => glitchObserver.observe(el));

      /* =========================
    RANDOM GLITCH PULSES
  ========================= */

      function triggerRandomGlitch() {
        // pick a random glitch element
        const randomEl =
          glitchEls[Math.floor(Math.random() * glitchEls.length)];

        if (!randomEl) return;

        randomEl.classList.add("active");

        setTimeout(() => {
          randomEl.classList.remove("active");
        }, 400);
      }

      // every 5 seconds, CHANCE to glitch
      setInterval(() => {
        const chance = Math.random();

        // tweak this value to control frequency
        // 0.3 = 30% chance every 5s
        if (chance < 0.3) {
          // optionally trigger multiple at once
          const burst = Math.floor(Math.random() * 3) + 1;

          for (let i = 0; i < burst; i++) {
            setTimeout(triggerRandomGlitch, i * 80);
          }
        }
      }, 5000);

      /* =========================
    MOUSE GLITCH BURSTS
  ========================= */

      const glitchTargets = document.querySelectorAll(".glitch");

      let lastBurst = 0;
      const BURST_COOLDOWN = 120; // ms

      document.addEventListener("mousemove", (e) => {
        const now = Date.now();
        if (now - lastBurst < BURST_COOLDOWN) return;

        lastBurst = now;

        const { clientX, clientY } = e;

        glitchTargets.forEach((el) => {
          const rect = el.getBoundingClientRect();

          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;

          const dx = cx - clientX;
          const dy = cy - clientY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const radius = 180; // influence zone

          if (dist < radius) {
            const intensity = 1 - dist / radius;

            triggerGlitch(el, intensity);
          }
        });
      });

      function triggerGlitch(el, intensity = 1) {
        if (!el) return;

        el.classList.add("active");

        // scale effect via CSS variable
        el.style.setProperty("--glitch-intensity", intensity);

        // random duration = more chaotic
        const duration = 200 + Math.random() * 300;

        setTimeout(() => {
          el.classList.remove("active");
        }, duration);
      }
      dots.forEach((d, i) => {
        d.classList.toggle("bg-pink-400", i === index);
        d.classList.toggle("bg-white/20", i !== index);

        d.classList.toggle("w-6", i === index);
        d.classList.toggle("w-2", i !== index);
      });

      /* =========================
    DRAG / SWIPE SUPPORT
  ========================= */

      let isDragging = false;
      let startX = 0;
      let currentTranslate = 0;
      let prevTranslate = 0;
      let animationID = null;

      const threshold = 60; // swipe distance to trigger slide

      track.addEventListener("mousedown", startDrag);
      track.addEventListener("touchstart", startDrag, { passive: true });

      window.addEventListener("mouseup", endDrag);
      window.addEventListener("touchend", endDrag);

      window.addEventListener("mousemove", drag);
      window.addEventListener("touchmove", drag, { passive: true });

      function startDrag(e) {
        isDragging = true;
        startX = getPositionX(e);
        track.style.transition = "none"; // disable snap during drag
      }

      function drag(e) {
        if (!isDragging) return;

        const currentX = getPositionX(e);
        const delta = currentX - startX;

        currentTranslate = prevTranslate + delta;

        track.style.transform = `translateX(${currentTranslate}px)`;
      }

      function endDrag() {
        if (!isDragging) return;
        isDragging = false;

        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -threshold && index < total - 1) {
          index++;
        }

        if (movedBy > threshold && index > 0) {
          index--;
        }

        updateCarousel();
      }

      function getPositionX(e) {
        return e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
      }
      const form = document.querySelector("#contact form");

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        e.stopPropagation(); // extra safety

        const formData = new FormData(form);
        const jsonData = Object.fromEntries(formData.entries());

        try {
          const res = await fetch(form.action, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(jsonData),
          });

          const toast = document.getElementById("toast");

          function showToast(success = true) {
            const text = toast.querySelector("p");

            text.textContent = success
              ? "Message sent ✨"
              : "Something went wrong…";

            toast.classList.add("show");

            // glitch pulse
            text.classList.add("glitch", "active");
            setTimeout(() => text.classList.remove("active"), 400);

            setTimeout(() => {
              toast.classList.remove("show");
            }, 3000);
          }

          if (res.ok) {
            showToast(true);
            form.reset();
          } else {
            showToast(false);
          }
        } catch (err) {
          showToast(false);
        }
      });