import { useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useAchievementsStore, DailyStats } from '@app/store/useAchievementsStore';
import { Typography } from '@app/components/elements/Typography';
import { formatHashrate } from '@app/utils/formatters';

const DashboardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background: ${({ theme }) => theme.palette.background.paper};
    border-radius: 16px;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
`;

const StatCard = styled.div<{ $highlight?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px;
    background: ${({ theme, $highlight }) =>
        $highlight ? 'rgba(49, 238, 170, 0.1)' : theme.palette.background.accent};
    border-radius: 12px;
    border: 1px solid ${({ theme, $highlight }) =>
        $highlight ? 'rgba(49, 238, 170, 0.3)' : 'transparent'};
`;

const StatValue = styled.span<{ $size?: 'small' | 'large' }>`
    font-size: ${({ $size }) => ($size === 'large' ? '28px' : '20px')};
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

const StatSubtext = styled.span`
    font-size: 10px;
    color: ${({ theme }) => theme.palette.text.secondary};
`;

const ChartWrapper = styled.div`
    width: 100%;
    height: 120px;
    display: flex;
    align-items: flex-end;
    gap: 4px;
    padding: 8px 0;
`;

const ChartBar = styled.div<{ $height: number; $isToday?: boolean }>`
    flex: 1;
    min-width: 8px;
    max-width: 30px;
    height: ${({ $height }) => Math.max($height, 2)}%;
    background: ${({ $isToday, theme }) =>
        $isToday
            ? 'linear-gradient(180deg, #31eeaa 0%, #26b884 100%)'
            : `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark || theme.palette.primary.main} 100%)`};
    border-radius: 4px 4px 0 0;
    transition: height 0.3s ease;
    position: relative;

    &:hover {
        opacity: 0.8;
    }
`;

const ChartLabel = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: ${({ theme }) => theme.palette.text.secondary};
    padding-top: 4px;
`;

const StreakDisplay = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const StreakFire = styled.span<{ $active: boolean }>`
    font-size: 24px;
    opacity: ${({ $active }) => ($active ? 1 : 0.3)};
    filter: ${({ $active }) => ($active ? 'none' : 'grayscale(100%)')};
`;

const StreakDays = styled.div`
    display: flex;
    gap: 4px;
`;

const DayDot = styled.div<{ $mined: boolean; $isToday: boolean }>`
    width: 12px;
    height: 12px;
    border-radius: 3px;
    background: ${({ $mined, $isToday }) =>
        $isToday
            ? '#31eeaa'
            : $mined
              ? 'rgba(49, 238, 170, 0.6)'
              : 'rgba(255, 255, 255, 0.1)'};
    border: ${({ $isToday }) => ($isToday ? '2px solid #fff' : 'none')};
`;

const NoDataMessage = styled.div`
    text-align: center;
    padding: 40px;
    color: ${({ theme }) => theme.palette.text.secondary};
`;

const HistoryList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 200px;
    overflow-y: auto;
`;

const HistoryItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    background: ${({ theme }) => theme.palette.background.accent};
    border-radius: 8px;
    font-size: 12px;
`;

const HistoryDate = styled.span`
    color: ${({ theme }) => theme.palette.text.secondary};
`;

const HistoryStats = styled.div`
    display: flex;
    gap: 16px;
`;

const HistoryStat = styled.span`
    color: ${({ theme }) => theme.palette.text.primary};
    font-family: 'IBM Plex Mono', monospace;
`;

export default function MiningStatsDashboard() {
    const { t } = useTranslation('achievements', { useSuspense: false });
    const stats = useAchievementsStore((s) => s.stats);

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours >= 24) {
            const days = Math.floor(hours / 24);
            const remainingHours = hours % 24;
            return `${days}d ${remainingHours}h`;
        }
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const last7Days = useMemo(() => {
        const days: (DailyStats | null)[] = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            days.push(stats.dailyStats[dateStr] || null);
        }
        
        return days;
    }, [stats.dailyStats]);

    const maxEarnings = useMemo(() => {
        return Math.max(...last7Days.map((d) => d?.xtmEarned || 0), 0.01);
    }, [last7Days]);

    const last7DaysLabels = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const labels: string[] = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(days[date.getDay()]);
        }
        
        return labels;
    }, []);

    const streakDays = useMemo(() => {
        const days: { date: string; mined: boolean }[] = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            days.push({
                date: dateStr,
                mined: !!stats.dailyStats[dateStr]?.miningSeconds,
            });
        }
        
        return days;
    }, [stats.dailyStats]);

    const recentHistory = useMemo(() => {
        return Object.values(stats.dailyStats)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10);
    }, [stats.dailyStats]);

    const formattedBestHashrate = formatHashrate(stats.bestHashrate);

    return (
        <DashboardWrapper>
            <Typography variant="h4">{t('mining-stats', 'Mining Stats')}</Typography>

            {/* Quick Stats */}
            <Section>
                <StatsGrid>
                    <StatCard $highlight>
                        <StatValue $size="large">{stats.totalXtmEarned.toFixed(4)}</StatValue>
                        <StatLabel>{t('total-earned', 'Total XTM Earned')}</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>{stats.totalSharesSubmitted.toLocaleString()}</StatValue>
                        <StatLabel>{t('shares-submitted', 'Shares Submitted')}</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>{formatTime(stats.totalMiningSeconds)}</StatValue>
                        <StatLabel>{t('total-mining-time', 'Total Mining Time')}</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>{formattedBestHashrate.value} {formattedBestHashrate.unit}</StatValue>
                        <StatLabel>{t('best-hashrate', 'Best Hashrate')}</StatLabel>
                    </StatCard>
                </StatsGrid>
            </Section>

            {/* Streak Section */}
            <Section>
                <SectionHeader>
                    <Typography variant="h6">{t('mining-streak', 'Mining Streak')}</Typography>
                    <StreakDisplay>
                        <StreakFire $active={stats.currentStreakDays > 0}>🔥</StreakFire>
                        <StatValue>{stats.currentStreakDays}</StatValue>
                        <StatLabel style={{ marginLeft: 4 }}>{t('days', 'days')}</StatLabel>
                    </StreakDisplay>
                </SectionHeader>
                
                <StreakDays>
                    {streakDays.map((day, i) => (
                        <DayDot
                            key={day.date}
                            $mined={day.mined}
                            $isToday={i === streakDays.length - 1}
                            title={`${day.date}: ${day.mined ? 'Mined' : 'No mining'}`}
                        />
                    ))}
                </StreakDays>
                
                {stats.longestStreakDays > stats.currentStreakDays && (
                    <StatSubtext>
                        {t('best-streak', 'Best streak')}: {stats.longestStreakDays} {t('days', 'days')}
                    </StatSubtext>
                )}
            </Section>

            {/* Earnings Chart */}
            <Section>
                <SectionHeader>
                    <Typography variant="h6">{t('last-7-days', 'Last 7 Days Earnings')}</Typography>
                </SectionHeader>
                
                {last7Days.some((d) => d !== null) ? (
                    <>
                        <ChartWrapper>
                            {last7Days.map((day, i) => (
                                <ChartBar
                                    key={i}
                                    $height={(day?.xtmEarned || 0) / maxEarnings * 100}
                                    $isToday={i === 6}
                                    title={day ? `${day.date}: ${day.xtmEarned.toFixed(4)} XTM` : 'No data'}
                                />
                            ))}
                        </ChartWrapper>
                        <ChartLabel>
                            <span>{last7DaysLabels[0]}</span>
                            <span>{t('today', 'Today')}</span>
                        </ChartLabel>
                    </>
                ) : (
                    <NoDataMessage>
                        <Typography variant="p">{t('no-data-yet', 'Start mining to see your stats!')}</Typography>
                    </NoDataMessage>
                )}
            </Section>

            {/* Recent History */}
            {recentHistory.length > 0 && (
                <Section>
                    <SectionHeader>
                        <Typography variant="h6">{t('recent-history', 'Recent History')}</Typography>
                    </SectionHeader>
                    
                    <HistoryList>
                        {recentHistory.map((day) => (
                            <HistoryItem key={day.date}>
                                <HistoryDate>
                                    {new Date(day.date).toLocaleDateString(undefined, {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </HistoryDate>
                                <HistoryStats>
                                    <HistoryStat>{day.xtmEarned.toFixed(4)} XTM</HistoryStat>
                                    <HistoryStat>{day.sharesSubmitted} shares</HistoryStat>
                                    <HistoryStat>{formatTime(day.miningSeconds)}</HistoryStat>
                                </HistoryStats>
                            </HistoryItem>
                        ))}
                    </HistoryList>
                </Section>
            )}

            {/* Additional Stats */}
            <Section>
                <SectionHeader>
                    <Typography variant="h6">{t('more-stats', 'More Stats')}</Typography>
                </SectionHeader>
                
                <StatsGrid>
                    <StatCard>
                        <StatValue>{stats.sessionsCount}</StatValue>
                        <StatLabel>{t('sessions', 'Mining Sessions')}</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>{stats.longestStreakDays}</StatValue>
                        <StatLabel>{t('longest-streak', 'Longest Streak')}</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>
                            {stats.firstMiningDate
                                ? new Date(stats.firstMiningDate).toLocaleDateString(undefined, {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                  })
                                : '-'}
                        </StatValue>
                        <StatLabel>{t('mining-since', 'Mining Since')}</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>{Object.keys(stats.dailyStats).length}</StatValue>
                        <StatLabel>{t('days-mined', 'Days Mined')}</StatLabel>
                    </StatCard>
                </StatsGrid>
            </Section>
        </DashboardWrapper>
    );
}

