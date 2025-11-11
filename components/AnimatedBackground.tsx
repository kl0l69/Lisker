
import React, { useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { themeMode, themeColor, availableThemes } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const mouse = { x: -200, y: -200, radius: 150 };

        const primaryColorRGB = availableThemes[themeColor]['500'];
        const particleColor = themeMode === 'light' ? `rgba(${primaryColorRGB}, 0.5)` : `rgba(${primaryColorRGB}, 0.7)`;
        const lineColor = themeMode === 'light' ? `rgba(${primaryColorRGB}, 0.3)` : `rgba(${primaryColorRGB}, 0.5)`;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = event.x;
            mouse.y = event.y;
        };
        
        const handleMouseLeave = () => {
            mouse.x = -200;
            mouse.y = -200;
        }

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        class Particle {
            x: number;
            y: number;
            size: number;
            baseX: number;
            baseY: number;
            density: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 1.5 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
            }

            draw() {
                if(!ctx) return;
                ctx.fillStyle = particleColor;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let maxDistance = mouse.radius;
                    // Stronger force for closer particles (quadratic falloff)
                    let force = (maxDistance - distance) / maxDistance;
                    force = force < 0 ? 0 : force * force;
                    let directionX = (forceDirectionX * force * this.density);
                    let directionY = (forceDirectionY * force * this.density);
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 10;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 10;
                    }
                }
            }
        }

        const initParticles = () => {
            particles = [];
            const numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                particles.push(new Particle(x, y));
            }
        };

        const connect = () => {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                        + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));

                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = lineColor.replace(/,\s*\d*\.?\d*\)/, `, ${opacityValue})`);
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        const animate = () => {
            if(!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].draw();
                particles[i].update();
            }
            connect();
            animationFrameId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };

    }, [themeMode, themeColor, availableThemes]);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default AnimatedBackground;