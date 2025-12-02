import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
    useAchievementsStore,
    AchievementCategory,
    selectAchievementProgress,
    selectUnlockedAchievements,
} from '@app/store/useAchievementsStore';
import AchievementBadge from './AchievementBadge';
import { Typography } from '@app/components/elements/Typography';

const PanelWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background: ${({ theme }) => theme.palette.background.paper};
    border-radius: 16px;
    max-height: 70vh;
    overflow-y: auto;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ProgressWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-end;
`;

const ProgressBar = styled.div`
    width: 150px;
    height: 8px;
    background: ${({ theme }) => theme.palette.divider};
    border-radius: 4px;
    overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
    width: ${({ $percentage }) => $percentage}%;
    height: 100%;
    background: linear-gradient(90deg, #48bb78, #38a169);
    transition: width 0.5s ease;
`;

const ProgressText = styled.span`
    font-size: 12px;
    color: ${({ theme }) => theme.palette.text.secondary};
`;

const TabsWrapper = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

const Tab = styled.button<{ $active: boolean }>`
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${({ $active, theme }) =>
        $active ? theme.palette.primary.main : theme.palette.background.accent};
    color: ${({ $active, theme }) =>
        $active ? '#fff' : theme.palette.text.secondary};
    border: none;

    &:hover {
        background: ${({ $active, theme }) =>
            $active ? theme.palette.primary.main : theme.palette.divider};
    }
`;

const BadgeGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
`;

const CategorySection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const CategoryHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const CategoryIcon = styled.span`
    font-size: 18px;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 40px;
    color: ${({ theme }) => theme.palette.text.secondary};
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    margin-bottom: 16px;
`;

const StatCard = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    background: ${({ theme }) => theme.palette.background.accent};
    border-radius: 10px;
`;

const StatValue = styled.span`
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.palette.text.primary};
    font-family: 'IBM Plex Mono', monospace;
`;

const StatLabel = styled.span`
    font-size: 11px;
    color: ${({ theme }) => theme.palette.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

type TabType = 'all' | AchievementCategory | 'unlocked';

const CATEGORY_INFO: Record<AchievementCategory, { icon: string; label: string }> = {
    mining: { icon: '⛏️', label: 'Mining' },
    earnings: { icon: '💰', label: 'Earnings' },
    time: { icon: '⏰', label: 'Time' },
    social: { icon: '👥', label: 'Social' },
    special: { icon: '⭐', label: 'Special' },
};

export default function AchievementsPanel() {
    const { t } = useTranslation('achievements', { useSuspense: false });
    const [activeTab, setActiveTab] = useState<TabType>('all');
    
    const achievements = useAchievementsStore((s) => s.achievements);
    const stats = useAchievementsStore((s) => s.stats);
    const progress = useAchievementsStore(selectAchievementProgress);
    const unlockedAchievements = useAchievementsStore(selectUnlockedAchievements);

    const filteredAchievements = useMemo(() => {
        const all = Object.values(achievements);
        if (activeTab === 'all') return all;
        if (activeTab === 'unlocked') return all.filter((a) => a.unlockedAt);
        return all.filter((a) => a.category === activeTab);
    }, [achievements, activeTab]);

    const achievementsByCategory = useMemo(() => {
        const grouped: Record<AchievementCategory, typeof filteredAchievements> = {
            mining: [],
            earnings: [],
            time: [],
            social: [],
            special: [],
        };
        filteredAchievements.forEach((a) => {
            grouped[a.category].push(a);
        });
        return grouped;
    }, [filteredAchievements]);

    const getProgressValue = (achievementId: string): number | undefined => {
        switch (achievementId) {
            case 'first_share':
            case 'century_club':
            case 'thousand_shares':
            case 'ten_thousand_shares':
            case 'hundred_thousand_shares':
                return stats.totalSharesSubmitted;
            case 'hash_novice':
            case 'hash_apprentice':
            case 'hash_master':
            case 'hash_legend':
                return stats.bestHashrate;
            case 'first_hour':
            case 'day_miner':
            case 'week_warrior':
            case 'month_master':
                return stats.totalMiningSeconds;
            case 'streak_3':
            case 'streak_7':
            case 'streak_30':
                return stats.longestStreakDays;
            case 'first_xtm':
            case 'ten_xtm':
            case 'hundred_xtm':
            case 'thousand_xtm':
            case 'ten_thousand_xtm':
                return stats.totalXtmEarned;
            case 'first_session':
            case 'ten_sessions':
            case 'hundred_sessions':
                return stats.sessionsCount;
            default:
                return undefined;
        }
    };

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours >= 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h`;
        }
        return `${hours}h ${minutes}m`;
    };

    return (
        <PanelWrapper>
            <Header>
                <Typography variant="h4">{t('achievements', 'Achievements')}</Typography>
                <ProgressWrapper>
                    <ProgressBar>
                        <ProgressFill $percentage={progress.percentage} />
                    </ProgressBar>
                    <ProgressText>
                        {progress.unlocked} / {progress.total} ({progress.percentage}%)
                    </ProgressText>
                </ProgressWrapper>
            </Header>

            <StatsGrid>
                <StatCard>
                    <StatValue>{stats.totalSharesSubmitted.toLocaleString()}</StatValue>
                    <StatLabel>{t('total-shares', 'Total Shares')}</StatLabel>
                </StatCard>
                <StatCard>
                    <StatValue>{stats.totalXtmEarned.toFixed(2)}</StatValue>
                    <StatLabel>{t('xtm-earned', 'XTM Earned')}</StatLabel>
                </StatCard>
                <StatCard>
                    <StatValue>{formatTime(stats.totalMiningSeconds)}</StatValue>
                    <StatLabel>{t('mining-time', 'Mining Time')}</StatLabel>
                </StatCard>
                <StatCard>
                    <StatValue>{stats.currentStreakDays}</StatValue>
                    <StatLabel>{t('current-streak', 'Day Streak')}</StatLabel>
                </StatCard>
            </StatsGrid>

            <TabsWrapper>
                <Tab $active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
                    {t('all', 'All')} ({Object.keys(achievements).length})
                </Tab>
                <Tab $active={activeTab === 'unlocked'} onClick={() => setActiveTab('unlocked')}>
                    ✓ {t('unlocked', 'Unlocked')} ({unlockedAchievements.length})
                </Tab>
                {(Object.keys(CATEGORY_INFO) as AchievementCategory[]).map((cat) => (
                    <Tab key={cat} $active={activeTab === cat} onClick={() => setActiveTab(cat)}>
                        {CATEGORY_INFO[cat].icon} {CATEGORY_INFO[cat].label}
                    </Tab>
                ))}
            </TabsWrapper>

            {activeTab === 'all' ? (
                // Show grouped by category
                Object.entries(achievementsByCategory).map(([category, achs]) => {
                    if (achs.length === 0) return null;
                    const catInfo = CATEGORY_INFO[category as AchievementCategory];
                    return (
                        <CategorySection key={category}>
                            <CategoryHeader>
                                <CategoryIcon>{catInfo.icon}</CategoryIcon>
                                <Typography variant="h6">{catInfo.label}</Typography>
                            </CategoryHeader>
                            <BadgeGrid>
                                {achs.map((achievement) => (
                                    <AchievementBadge
                                        key={achievement.id}
                                        achievement={achievement}
                                        size="medium"
                                        showProgress
                                        currentValue={getProgressValue(achievement.id)}
                                    />
                                ))}
                            </BadgeGrid>
                        </CategorySection>
                    );
                })
            ) : (
                // Show flat list
                <BadgeGrid>
                    {filteredAchievements.length > 0 ? (
                        filteredAchievements.map((achievement) => (
                            <AchievementBadge
                                key={achievement.id}
                                achievement={achievement}
                                size="medium"
                                showProgress
                                currentValue={getProgressValue(achievement.id)}
                            />
                        ))
                    ) : (
                        <EmptyState>
                            <Typography variant="p">{t('no-achievements', 'No achievements in this category yet')}</Typography>
                        </EmptyState>
                    )}
                </BadgeGrid>
            )}
        </PanelWrapper>
    );
}

