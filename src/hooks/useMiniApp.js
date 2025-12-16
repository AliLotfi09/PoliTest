// src/hooks/useMiniApp.js
import { useEffect, useState } from 'react';
import { initMiniApp, getMiniAppState } from '../utils/miniAppDetector';

export function useMiniApp() {
    const [miniAppInfo, setMiniAppInfo] = useState(() => getMiniAppState());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initialize = async () => {
            setIsLoading(true);
            
            // فقط SDKهای مورد نیاز را لود کن
            const result = await initMiniApp();
            
            // اگر لود شد، وضعیت رو آپدیت کن
            if (result.initialized) {
                setMiniAppInfo(getMiniAppState());
            }
            
            setIsLoading(false);
        };

        initialize();
    }, []);

    return {
        ...miniAppInfo,
        isLoading,
        isMiniApp: miniAppInfo.host !== "unknown",
        isTelegram: miniAppInfo.host === "telegram",
        isEitaa: miniAppInfo.host === "eitaa"
    };
}