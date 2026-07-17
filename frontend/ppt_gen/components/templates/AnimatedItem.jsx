import React from 'react';
import { motion } from 'framer-motion';
import { usePresentation } from '@/contexts/presentation-context';
import { useSettingsStore } from '@/hooks/use-settings-store';

const AnimatedItem = ({ children, index = 0, className = "" }) => {
    const { isPresenting } = usePresentation();
    const { animationsEnabled } = useSettingsStore();

    if (!isPresenting || !animationsEnabled) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedItem;
