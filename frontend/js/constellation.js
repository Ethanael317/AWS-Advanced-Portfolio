```javascript
/**
 * Constellation Background
 *
 * Renders an animated starfield and cyan connections between
 * the central portfolio node and surrounding navigation nodes.
 *
 * Required HTML:
 *   <canvas id="constellation-bg"></canvas>
 *
 * Expected node classes:
 *   .center-node
 *   .node
 */

const canvas = document.getElementById("constellation-bg");

if (canvas) {
    const ctx = canvas.getContext("2d");

    if (ctx) {
        const STAR_COUNT = 200;
        const CONNECTION_COLOR = "rgba(0, 255, 255, 0.2)";
        const STAR_COLOR = "rgba(255, 255, 255, 0.7)";

        let stars = [];
        let animationFrameId;
        let isVisible = true;

        // Keep the canvas at the current viewport dimensions.
        function resizeCanvas() {
            const pixelRatio = Math.min(
                window.devicePixelRatio || 1,
                2
            );

            canvas.width = window.innerWidth * pixelRatio;
            canvas.height = window.innerHeight * pixelRatio;

            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;

            // Draw using CSS-pixel coordinates for sharper output.
            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

            createStars();
        }

        // Generate the background stars.
        function createStars() {
            stars = [];

            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push({
                    x: Math.random() * window.innerWidth,
                           y: Math.random() * window.innerHeight,
                           radius: Math.random() * 2
                });
            }
        }

        // Return the center point of an HTML element.
        function getNodeCenter(element) {
            const rect = element.getBoundingClientRect();

            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        }

        // Connect the central node to surrounding navigation nodes.
        function drawConnections() {
            const centerNode = document.querySelector(".center-node");

            if (!centerNode) return;

            const center = getNodeCenter(centerNode);
            const nodes = document.querySelectorAll(".node");

            ctx.strokeStyle = CONNECTION_COLOR;
            ctx.lineWidth = 1;

            nodes.forEach((node) => {
                // Avoid drawing a line from the center node to itself.
                if (node === centerNode) return;

                const position = getNodeCenter(node);

                ctx.beginPath();
                ctx.moveTo(center.x, center.y);
                ctx.lineTo(position.x, position.y);
                ctx.stroke();
            });
        }

        // Draw the starfield.
        function drawStars() {
            ctx.fillStyle = STAR_COLOR;

            stars.forEach((star) => {
                ctx.beginPath();
                ctx.arc(
                    star.x,
                    star.y,
                    star.radius,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            });
        }

        // Main animation loop.
        function animate() {
            if (!isVisible) return;

            ctx.clearRect(
                0,
                0,
                window.innerWidth,
                window.innerHeight
            );

            drawStars();
            drawConnections();

            animationFrameId = requestAnimationFrame(animate);
        }

        // Pause animation when the page is hidden.
        document.addEventListener("visibilitychange", () => {
            isVisible = !document.hidden;

            if (isVisible) {
                cancelAnimationFrame(animationFrameId);
                animate();
            } else {
                cancelAnimationFrame(animationFrameId);
            }
        });

        // Recalculate canvas dimensions when the viewport changes.
        window.addEventListener("resize", resizeCanvas);

        // Initialize.
        resizeCanvas();
        animate();
    }
}
```
