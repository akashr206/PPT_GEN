import React from 'react';
import { motion } from 'framer-motion';
import { usePresentation } from '@/contexts/presentation-context';
import { useSettingsStore } from '@/hooks/use-settings-store';

const AnimatedItem = ({ children, index = 0, className = "", style }) => {
    const { isPresenting } = usePresentation();
    const { animationsEnabled } = useSettingsStore();

    if (!isPresenting || !animationsEnabled) {
        return <div className={className} style={style}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            style={style}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
            id = "animated-item"
        >
            {children}
        </motion.div>
    );
};

export default AnimatedItem;
