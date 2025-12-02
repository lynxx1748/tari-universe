import styled, { css, keyframes } from 'styled-components';
import { Achievement, AchievementRarity } from '@app/store/useAchievementsStore';

const shimmer = keyframes`
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
`;

const unlockPulse = keyframes`
    0% { transform: scale(1); box-shadow: 0 0 0 0 currentColor; }
    50% { transform: scale(1.05); box-shadow: 0 0 20px 5px currentColor; }
    100% { transform: scale(1); box-shadow: 0 0 0 0 transparent; }
`;

const getRarityColors = (rarity: AchievementRarity) => {
    switch (rarity) {
        case 'common':
            return { bg: '#4a5568', border: '#718096', glow: 'rgba(113, 128, 150, 0.5)' };
        case 'uncommon':
            return { bg: '#276749', border: '#48bb78', glow: 'rgba(72, 187, 120, 0.5)' };
        case 'rare':
            return { bg: '#2b6cb0', border: '#4299e1', glow: 'rgba(66, 153, 225, 0.5)' };
        case 'epic':
            return { bg: '#6b46c1', border: '#9f7aea', glow: 'rgba(159, 122, 234, 0.5)' };
        case 'legendary':
            return { bg: '#c05621', border: '#ed8936', glow: 'rgba(237, 137, 54, 0.5)' };
        default:
            return { bg: '#4a5568', border: '#718096', glow: 'rgba(113, 128, 150, 0.5)' };
    }
};

const BadgeWrapper = styled.div<{ $rarity: AchievementRarity; $unlocked: boolean; $size: 'small' | 'medium' | 'large'; $isNew?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: ${({ $size }) => ($size === 'small' ? '8px' : $size === 'medium' ? '12px' : '16px')};
    border-radius: 12px;
    background: ${({ $rarity, $unlocked }) => {
        const colors = getRarityColors($rarity);
        return $unlocked ? colors.bg : 'rgba(0,0,0,0.3)';
    }};
    border: 2px solid ${({ $rarity, $unlocked }) => {
        const colors = getRarityColors($rarity);
        return $unlocked ? colors.border : 'rgba(255,255,255,0.1)';
    }};
    opacity: ${({ $unlocked }) => ($unlocked ? 1 : 0.5)};
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    ${({ $unlocked, $rarity }) =>
        $unlocked &&
        css`
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px ${getRarityColors($rarity).glow};
            }
        `}

    ${({ $isNew, $rarity }) =>
        $isNew &&
        css`
            animation: ${unlockPulse} 1s ease-out;
            color: ${getRarityColors($rarity).border};
        `}

    ${({ $rarity, $unlocked }) =>
        $unlocked &&
        $rarity === 'legendary' &&
        css`
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
                    rgba(255, 255, 255, 0.2),
                    transparent
                );
                background-size: 200% 100%;
                animation: ${shimmer} 3s infinite;
            }
        `}
`;

const IconWrapper = styled.div<{ $size: 'small' | 'medium' | 'large' }>`
    font-size: ${({ $size }) => ($size === 'small' ? '24px' : $size === 'medium' ? '32px' : '48px')};
    line-height: 1;
    filter: ${({ $size }) => ($size === 'large' ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none')};
`;

const BadgeName = styled.span<{ $size: 'small' | 'medium' | 'large' }>`
    font-size: ${({ $size }) => ($size === 'small' ? '10px' : $size === 'medium' ? '12px' : '14px')};
    font-weight: 600;
    color: white;
    text-align: center;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const BadgeDescription = styled.span`
    font-size: 10px;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
`;

const RarityTag = styled.span<{ $rarity: AchievementRarity }>`
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${({ $rarity }) => getRarityColors($rarity).border};
    padding: 2px 6px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.3);
`;

const LockedOverlay = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
    opacity: 0.5;
`;

const ProgressBar = styled.div<{ $progress: number; $rarity: AchievementRarity }>`
    width: 100%;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 4px;

    &::after {
        content: '';
        display: block;
        width: ${({ $progress }) => Math.min($progress, 100)}%;
        height: 100%;
        background: ${({ $rarity }) => getRarityColors($rarity).border};
        transition: width 0.3s ease;
    }
`;

interface AchievementBadgeProps {
    achievement: Achievement;
    size?: 'small' | 'medium' | 'large';
    showDescription?: boolean;
    showProgress?: boolean;
    isNew?: boolean;
    currentValue?: number;
}

export default function AchievementBadge({
    achievement,
    size = 'medium',
    showDescription = false,
    showProgress = false,
    isNew = false,
    currentValue,
}: AchievementBadgeProps) {
    const isUnlocked = !!achievement.unlockedAt;
    const progress = currentValue !== undefined 
        ? Math.min((currentValue / achievement.requirement) * 100, 100)
        : 0;

    return (
        <BadgeWrapper
            $rarity={achievement.rarity}
            $unlocked={isUnlocked}
            $size={size}
            $isNew={isNew}
            title={`${achievement.name}: ${achievement.description}`}
        >
            <IconWrapper $size={size}>
                {isUnlocked ? achievement.icon : '🔒'}
            </IconWrapper>
            
            <BadgeName $size={size}>{achievement.name}</BadgeName>
            
            {showDescription && size !== 'small' && (
                <BadgeDescription>{achievement.description}</BadgeDescription>
            )}
            
            {size !== 'small' && (
                <RarityTag $rarity={achievement.rarity}>{achievement.rarity}</RarityTag>
            )}
            
            {!isUnlocked && showProgress && currentValue !== undefined && (
                <ProgressBar $progress={progress} $rarity={achievement.rarity} />
            )}
            
            {!isUnlocked && <LockedOverlay>🔒</LockedOverlay>}
        </BadgeWrapper>
    );
}

