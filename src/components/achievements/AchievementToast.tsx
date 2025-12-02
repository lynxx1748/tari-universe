import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useAchievementsStore, AchievementRarity } from '@app/store/useAchievementsStore';

const slideIn = keyframes`
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
`;

const shine = keyframes`
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
`;

const ToastContainer = styled.div`
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: none;
`;

const getRarityGradient = (rarity: AchievementRarity) => {
    switch (rarity) {
        case 'common':
            return 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)';
        case 'uncommon':
            return 'linear-gradient(135deg, #276749 0%, #22543d 100%)';
        case 'rare':
            return 'linear-gradient(135deg, #2b6cb0 0%, #2c5282 100%)';
        case 'epic':
            return 'linear-gradient(135deg, #6b46c1 0%, #553c9a 100%)';
        case 'legendary':
            return 'linear-gradient(135deg, #c05621 0%, #9c4221 100%)';
        default:
            return 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)';
    }
};

const getRarityBorder = (rarity: AchievementRarity) => {
    switch (rarity) {
        case 'common':
            return '#718096';
        case 'uncommon':
            return '#48bb78';
        case 'rare':
            return '#4299e1';
        case 'epic':
            return '#9f7aea';
        case 'legendary':
            return '#ed8936';
        default:
            return '#718096';
    }
};

const ToastCard = styled(m.div)<{ $rarity: AchievementRarity }>`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: ${({ $rarity }) => getRarityGradient($rarity)};
    border: 2px solid ${({ $rarity }) => getRarityBorder($rarity)};
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    min-width: 280px;
    max-width: 350px;
    pointer-events: auto;
    animation: ${slideIn} 0.4s ease-out;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
        );
        background-size: 200% 100%;
        animation: ${shine} 2s ease-out;
        pointer-events: none;
    }
`;

const IconWrapper = styled.div`
    font-size: 36px;
    line-height: 1;
    flex-shrink: 0;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const UnlockedLabel = styled.span`
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 600;
`;

const AchievementName = styled.span`
    font-size: 16px;
    font-weight: 700;
    color: #fff;
`;

const AchievementDescription = styled.span`
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
`;

const RarityBadge = styled.span<{ $rarity: AchievementRarity }>`
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${({ $rarity }) => getRarityBorder($rarity)};
    background: rgba(0, 0, 0, 0.3);
    padding: 2px 6px;
    border-radius: 4px;
`;

interface ToastData {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: AchievementRarity;
}

export default function AchievementToast() {
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const recentUnlocks = useAchievementsStore((s) => s.recentUnlocks);
    const achievements = useAchievementsStore((s) => s.achievements);
    const clearRecentUnlocks = useAchievementsStore((s) => s.clearRecentUnlocks);

    useEffect(() => {
        if (recentUnlocks.length === 0) return;

        const newToasts: ToastData[] = [];
        recentUnlocks.forEach((id) => {
            const ach = achievements[id];
            if (ach) {
                newToasts.push({
                    id: `${id}-${Date.now()}`,
                    name: ach.name,
                    description: ach.description,
                    icon: ach.icon,
                    rarity: ach.rarity,
                });
            }
        });

        if (newToasts.length > 0) {
            setToasts((prev) => [...prev, ...newToasts]);
            clearRecentUnlocks();
        }
    }, [recentUnlocks, achievements, clearRecentUnlocks]);

    useEffect(() => {
        if (toasts.length === 0) return;

        const timer = setTimeout(() => {
            setToasts((prev) => prev.slice(1));
        }, 5000);

        return () => clearTimeout(timer);
    }, [toasts]);

    return (
        <ToastContainer>
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <ToastCard
                        key={toast.id}
                        $rarity={toast.rarity}
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                    >
                        <IconWrapper>{toast.icon}</IconWrapper>
                        <ContentWrapper>
                            <UnlockedLabel>Achievement Unlocked!</UnlockedLabel>
                            <AchievementName>{toast.name}</AchievementName>
                            <AchievementDescription>{toast.description}</AchievementDescription>
                        </ContentWrapper>
                        <RarityBadge $rarity={toast.rarity}>{toast.rarity}</RarityBadge>
                    </ToastCard>
                ))}
            </AnimatePresence>
        </ToastContainer>
    );
}

