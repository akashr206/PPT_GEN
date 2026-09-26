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
            style={{ ...style, willChange: "transform, opacity" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ 
                delay: index * 0.1, 
                duration: 0.7, 
                ease: [0.25, 1, 0.5, 1] 
            }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedItem;
