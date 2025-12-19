
if (import.meta.hot) {
    import.meta.hot.accept((newModule) => {
        console.log('[HMR Browser] Update accepted for ${id}');

        if (!newModule) {
            console.error('[HMR Browser] newModule is undefined!');
            return;
        }

        try {
            if (typeof window === 'undefined') {
                console.error('[HMR Browser] window is undefined!');
                return;
            }
        } catch (e) {
            return;
        }

        // const NativeDocument = window.NativeDocument;
        // if (!NativeDocument) {
        //     console.error('[HMR Browser] NativeDocument not found on window!');
        //     return;
        // }

        if (!ComponentRegistry) {
            console.error('[HMR Browser] ComponentRegistry not found!');
            return;
        }

        console.log('[HMR Browser] Calling ComponentRegistry.update()');
        try {
            ComponentRegistry.update('${id}', newModule.default);
            console.log('[HMR Browser] ✓ Update successful');
        } catch (error) {
            console.error('[HMR Browser] ✗ Update failed:', error);
        }
    });

    import.meta.hot.on('vite:error', (payload) => {
        console.error('[HMR Browser] Vite error:', payload);
    });


    import.meta.hot.on('nd:update', (payload) => {
        console.error('[HMR Browser] ND:Update:', payload);
    });

    import.meta.hot.dispose(() => {
        console.log('[HMR Browser] Disposing ${id}');
    });
}