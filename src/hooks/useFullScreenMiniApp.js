// src/hooks/useFullScreenMiniApp.js
import { useEffect, useState } from 'react';
import { initMiniApp, expandToFullScreen, getMiniAppState } from '../utils/miniAppDetector';

export function useFullScreenMiniApp() {
    const [state, setState] = useState(() => ({
        isLoading: true,
        isMiniApp: false,
        isFullScreen: false,
        ...getMiniAppState()
    }));

    useEffect(() => {
        const initialize = async () => {
            // SDK را لود کن
            const result = await initMiniApp();
            
            // اگر SDK لود شد، سعی کن تمام صفحه کنی
            if (result.initialized && result.webApp) {
                // یک بار دیگر سعی کن expand کنی (برای اطمینان)
                setTimeout(() => {
                    expandToFullScreen();
                    
                    // وضعیت را آپدیت کن
                    setState(prev => ({
                        ...prev,
                        isLoading: false,
                        isMiniApp: true,
                        isFullScreen: true,
                        ...getMiniAppState()
                    }));
                }, 300);
            } else {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    isMiniApp: false
                }));
            }
        };

        initialize();

        // برای مواقعی که viewport تغییر کند
        const handleResize = () => {
            if (state.isMiniApp) {
                expandToFullScreen();
            }
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [state.isMiniApp]);

    return state;
}