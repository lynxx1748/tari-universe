import { IoAlertCircleSharp } from 'react-icons/io5';
import { Stack } from '@app/components/elements/Stack';
import { Typography } from '@app/components/elements/Typography';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useNodeStore } from '@app/store/useNodeStore';
import { useUIStore } from '@app/store/useUIStore';

const LostConnectionIcon = styled(IoAlertCircleSharp)(({ theme }) => ({
    color: theme.palette.warning.main,
}));

const LostConnectionAlert = () => {
    const { t } = useTranslation('sidebar', { useSuspense: false });
    const isNodeConnected = useNodeStore((s) => s.isNodeConnected);
    const connectionStatus = useUIStore((s) => s.connectionStatus);
    
    // Show alert if node is disconnected or overall connection status is disconnected
    const showAlert = !isNodeConnected || connectionStatus === 'disconnected';

    return showAlert ? (
        <Stack direction="row" justifyContent="space-between" alignItems="center" style={{ padding: '0 6px' }} gap={6}>
            <LostConnectionIcon size={18} />
            <Typography variant="p">{t('lost-connection')}</Typography>
        </Stack>
    ) : null;
};

export default LostConnectionAlert;
