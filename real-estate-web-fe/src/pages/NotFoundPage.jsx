import React, { useState, useEffect } from 'react';
import { Home, Search, ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 20 - 10,
                y: (e.clientY / window.innerHeight) * 20 - 10,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
            
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{
                        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                        transition: 'transform 0.3s ease-out',
                    }}
                />
                <div
                    className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{
                        transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
                        transition: 'transform 0.3s ease-out',
                        animationDelay: '2s',
                    }}
                />
                <div
                    className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{
                        transform: `translate(${mousePosition.y}px, ${mousePosition.x}px)`,
                        transition: 'transform 0.3s ease-out',
                        animationDelay: '4s',
                    }}
                />
            </div>

            
            <div className="relative z-10 text-center max-w-2xl mx-auto">
                
                <div className="relative mb-8">
                    <h1
                        className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-pulse"
                        style={{
                            transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
                            transition: 'transform 0.1s ease-out',
                        }}
                    >
                        404
                    </h1>
                    <div className="absolute inset-0 text-9xl md:text-[12rem] font-black text-purple-500 blur-2xl opacity-50 animate-pulse">
                        404
                    </div>
                </div>

                
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 mb-8 border border-white/20 shadow-2xl">
                    <div className="flex items-center justify-center mb-4">
                        <AlertCircle className="w-12 h-12 text-pink-400 animate-bounce" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-gray-300 mb-2">
                        Oops! The page you're looking for has wandered off into the digital void.
                    </p>
                    <p className="text-sm text-gray-400">
                        It might have been moved, deleted, or perhaps it never existed at all.
                    </p>
                </div>

                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => window.history.back()}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>

                    <button
                        onClick={() => window.location.href = '/'}
                        className="group flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Home Page
                    </button>

                    
                </div>

                
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 2}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-15px) translateX(5px);
          }
        }
      `}</style>
        </div>
    );
}