import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ToggleSwitch } from '@app/components/elements/inputs/switch/ToggleSwitch.tsx';
import { Typography } from '@app/components/elements/Typography';
import {
    SettingsGroup,
    SettingsGroupContent,
    SettingsGroupTitle,
    SettingsGroupAction,
    SettingsGroupWrapper,
} from '@app/containers/floating/Settings/components/SettingsGroup.styles';
import { useConfigUIStore } from '@app/store';
import { togglePerformanceMode } from '@app/store/actions/uiStoreActions';

function PerformanceMode() {
    const performanceMode = useConfigUIStore((s) => s.performance_mode);
    const { t } = useTranslation('settings', { useSuspense: false });

    const handleSwitch = useCallback(() => {
        togglePerformanceMode(!performanceMode);
    }, [performanceMode]);

    return (
        <SettingsGroupWrapper>
            <SettingsGroup>
                <SettingsGroupContent>
                    <SettingsGroupTitle>
                        <Typography variant="h6">{t('performance-mode')}</Typography>
                    </SettingsGroupTitle>
                    <Typography variant="p">{t('performance-mode-description')}</Typography>
                </SettingsGroupContent>
                <SettingsGroupAction style={{ alignItems: 'center' }}>
                    <ToggleSwitch checked={performanceMode} onChange={handleSwitch} />
                </SettingsGroupAction>
            </SettingsGroup>
        </SettingsGroupWrapper>
    );
}
export default PerformanceMode;

