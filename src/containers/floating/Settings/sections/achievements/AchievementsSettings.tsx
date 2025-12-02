import { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { AchievementsPanel, MiningStatsDashboard } from '@app/components/achievements';

const TabsWrapper = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
`;

const Tab = styled.button<{ $active: boolean }>`
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${({ $active, theme }) =>
        $active ? theme.palette.primary.main : theme.palette.background.paper};
    color: ${({ $active, theme }) =>
        $active ? '#fff' : theme.palette.text.secondary};
    border: 1px solid ${({ $active, theme }) =>
        $active ? theme.palette.primary.main : theme.palette.divider};

    &:hover {
        background: ${({ $active, theme }) =>
            $active ? theme.palette.primary.main : theme.palette.background.accent};
    }
`;

type TabType = 'stats' | 'achievements';

export const AchievementsSettings = () => {
    const { t } = useTranslation('achievements', { useSuspense: false });
    const [activeTab, setActiveTab] = useState<TabType>('stats');

    return (
        <>
            <TabsWrapper>
                <Tab $active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>
                    📊 {t('stats-dashboard', 'Stats Dashboard')}
                </Tab>
                <Tab $active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')}>
                    🏆 {t('achievements', 'Achievements')}
                </Tab>
            </TabsWrapper>

            {activeTab === 'stats' ? <MiningStatsDashboard /> : <AchievementsPanel />}
        </>
    );
};

