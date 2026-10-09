```javascript
/**
 * Cursor Glow
 *
 * Moves the portfolio's glow effect with the mouse pointer.
 *
 * Required HTML:
 *   <div id="cursor-glow"></div>
 */

const glow = document.getElementById("cursor-glow");

if (glow) {
    // Skip the mouse-following effect on devices without a fine pointer.
    const supportsMouse = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (supportsMouse && !prefersReducedMotion) {
        document.addEventListener("pointermove", (event) => {
            glow.style.left = `${event.clientX}px`;
            glow.style.top = `${event.clientY}px`;
        });
    } else {
        glow.style.display = "none";
    }
}
```
