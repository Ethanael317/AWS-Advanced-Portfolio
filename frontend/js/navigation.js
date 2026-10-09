```javascript
/**
 * Portfolio Navigation
 *
 * Smoothly scrolls to page sections when a navigation node is clicked.
 *
 * Expected HTML:
 *   <button class="node" data-target="about">About</button>
 *
 * The data-target value must match the destination section's ID.
 */

const nodes = document.querySelectorAll(".node");

nodes.forEach((node) => {
    node.addEventListener("click", () => {
        const targetId = node.dataset.target;

        if (!targetId) {
            console.warn("Navigation node is missing its data-target.");
            return;
        }

        const target = document.getElementById(targetId);

        if (!target) {
            console.warn(`Navigation target not found: ${targetId}`);
            return;
        }

        target.scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
            ? "auto"
            : "smooth",
            block: "start"
        });
    });
});
```
